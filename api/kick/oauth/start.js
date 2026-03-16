const { getRequestUrl, sendJson, sendOptions } = require("../../_lib/http.js");
const {
  createKickCodeChallenge,
  createKickCodeVerifier,
  createKickOAuthState,
  getKickOAuthConfig,
  resolveKickOAuthRedirectUri,
  sanitizeReturnToPath
} = require("../../_lib/kick-oauth.js");

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

  const config = getKickOAuthConfig();
  if (!config.clientId) {
    sendJson(
      res,
      {
        ok: false,
        error: "KICK_OAUTH_CLIENT_ID_MISSING",
        requiredEnv: ["KICK_OAUTH_CLIENT_ID"]
      },
      500
    );
    return;
  }

  const url = getRequestUrl(req);
  const redirectUri = resolveKickOAuthRedirectUri(url);
  const returnTo = sanitizeReturnToPath(
    url.searchParams.get("return_to") || url.searchParams.get("returnTo") || "/admin"
  );
  const codeVerifier = createKickCodeVerifier();
  const state = createKickOAuthState(
    {
      returnTo,
      codeVerifier
    },
    config.stateSecret
  );

  const authorizeUrl = new URL("https://id.kick.com/oauth/authorize");
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", config.clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", config.scope);
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("code_challenge_method", "S256");
  authorizeUrl.searchParams.set("code_challenge", createKickCodeChallenge(codeVerifier));

  const prompt = String(url.searchParams.get("prompt") || "").trim();
  if (prompt) {
    authorizeUrl.searchParams.set("prompt", prompt);
  }

  if (String(url.searchParams.get("redirect") || "").trim() === "1") {
    sendRedirect(res, authorizeUrl.toString());
    return;
  }

  sendJson(res, {
    ok: true,
    authorizeUrl: authorizeUrl.toString(),
    redirectUri,
    scope: config.scope,
    returnTo
  });
};
