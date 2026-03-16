const { createRedisClient } = require("../../../lib/redis.js");
const { getRequestUrl, sendJson, sendOptions } = require("../../../lib/http.js");
const {
  createKickLinkFromToken,
  exchangeKickAuthorizationCode,
  fetchKickChannelsByAccessToken,
  getKickOAuthConfig,
  patchKickLinkWithChannel,
  pickKickChannel,
  resolveKickOAuthRedirectUri,
  sanitizeReturnToPath,
  saveKickLink,
  verifyKickOAuthState
} = require("../../../lib/kick-oauth.js");

function sanitizeMessage(rawValue, fallback = "oauth_error") {
  const text = String(rawValue || "").trim();
  if (!text) {
    return fallback;
  }
  return text.replace(/[^\w\-:. ]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 180) || fallback;
}

function buildReturnLocation(returnToPath, status, message = "") {
  const safePath = sanitizeReturnToPath(returnToPath || "/admin");
  const url = new URL(safePath, "https://taku-live.local");
  url.searchParams.set("kick_oauth", String(status || "error"));
  if (message) {
    url.searchParams.set("kick_oauth_msg", sanitizeMessage(message));
  }
  return `${url.pathname}${url.search}`;
}

function sendRedirect(res, location) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Location", String(location || "/admin"));
  if (typeof res.status === "function") {
    res.status(302).end();
    return;
  }
  res.statusCode = 302;
  res.end();
}

module.exports = async function handler(req, res) {
  const method = String(req.method || "GET").toUpperCase();
  if (method === "OPTIONS") {
    sendOptions(res, "GET, OPTIONS");
    return;
  }
  if (method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    sendJson(res, { ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
    return;
  }

  const url = getRequestUrl(req);
  const config = getKickOAuthConfig();
  const stateRaw = String(url.searchParams.get("state") || "").trim();
  const verifiedState = verifyKickOAuthState(stateRaw, config.stateSecret);
  const fallbackReturnTo = sanitizeReturnToPath(url.searchParams.get("return_to") || "/admin");
  const returnTo = sanitizeReturnToPath(verifiedState?.returnTo || fallbackReturnTo);

  const oauthError = String(url.searchParams.get("error") || "").trim();
  if (oauthError) {
    const oauthErrorDescription = String(url.searchParams.get("error_description") || "").trim();
    sendRedirect(
      res,
      buildReturnLocation(returnTo, "error", oauthErrorDescription || `kick_authorize_${oauthError}`)
    );
    return;
  }

  if (!verifiedState) {
    sendRedirect(res, buildReturnLocation(returnTo, "error", "oauth_state_invalid_or_expired"));
    return;
  }

  const authorizationCode = String(url.searchParams.get("code") || "").trim();
  if (!authorizationCode) {
    sendRedirect(res, buildReturnLocation(returnTo, "error", "oauth_code_missing"));
    return;
  }

  if (!config.clientId || !config.clientSecret) {
    sendRedirect(res, buildReturnLocation(returnTo, "error", "oauth_client_credentials_missing"));
    return;
  }

  const redis = createRedisClient();
  if (!redis) {
    sendRedirect(
      res,
      buildReturnLocation(returnTo, "error", "kv_rest_env_missing")
    );
    return;
  }

  try {
    const redirectUri = resolveKickOAuthRedirectUri(url);
    const token = await exchangeKickAuthorizationCode({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      code: authorizationCode,
      redirectUri,
      codeVerifier: String(verifiedState.codeVerifier || "").trim(),
      scope: config.scope
    });

    let link = createKickLinkFromToken(token, {
      channelSlug: config.channelSlug
    });

    try {
      const channelsResponse = await fetchKickChannelsByAccessToken(token.accessToken, config.channelSlug);
      const channel = pickKickChannel(channelsResponse.channels, config.channelSlug);
      if (channel) {
        link = patchKickLinkWithChannel(link, channel, channelsResponse.source);
      }
    } catch (_error) {
      // Keep valid token even if channel payload fetch failed.
    }

    await saveKickLink(redis, link);
    sendRedirect(res, buildReturnLocation(returnTo, "success", "konto_kick_powiazane"));
  } catch (error) {
    sendRedirect(
      res,
      buildReturnLocation(returnTo, "error", `oauth_exchange_failed:${sanitizeMessage(error?.message || "")}`)
    );
  }
};
