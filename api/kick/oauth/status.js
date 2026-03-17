const { createRedisClient } = require("../../_lib/redis.js");
const { getRequestUrl, sendJson, sendOptions } = require("../../_lib/http.js");
const {
  ensureKickLinkHasFreshAccessToken,
  fetchKickChannelsByAccessToken,
  getKickOAuthConfig,
  loadKickLink,
  patchKickLinkWithChannel,
  pickKickChannel,
  resolveKickOAuthRedirectUri,
  saveKickLink
} = require("../../_lib/kick-oauth.js");

function toPublicLinkState(link, extra = {}) {
  const safe = link && typeof link === "object" ? link : {};
  return {
    linked: true,
    channelSlug: String(safe.channelSlug || "").trim() || null,
    channelName: String(safe.channelName || "").trim() || null,
    broadcasterUserId: Number.isFinite(Number(safe.broadcasterUserId))
      ? Math.floor(Number(safe.broadcasterUserId))
      : null,
    subscribersCount: Number.isFinite(Number(safe.activeSubscribersCount))
      ? Math.floor(Number(safe.activeSubscribersCount))
      : null,
    canceledSubscribersCount: Number.isFinite(Number(safe.canceledSubscribersCount))
      ? Math.floor(Number(safe.canceledSubscribersCount))
      : null,
    followersCount: Number.isFinite(Number(safe.followersCount))
      ? Math.floor(Number(safe.followersCount))
      : null,
    scope: String(safe.scope || "").trim(),
    expiresAt: Math.max(0, Math.floor(Number(safe.expiresAt || 0))),
    linkedAt: Math.max(0, Math.floor(Number(safe.linkedAt || 0))),
    updatedAt: Math.max(0, Math.floor(Number(safe.updatedAt || 0))),
    lastChannelSyncAt: Math.max(0, Math.floor(Number(safe.lastChannelSyncAt || 0))),
    ...extra
  };
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

  const redis = createRedisClient();
  if (!redis) {
    sendJson(
      res,
      {
        ok: false,
        error: "MISSING_KV_REST_ENV",
        requiredEnv: ["KV_REST_API_URL", "KV_REST_API_TOKEN"]
      },
      500
    );
    return;
  }

  try {
    let link = await loadKickLink(redis);
    if (!link) {
      sendJson(res, { ok: true, linked: false });
      return;
    }

    const url = getRequestUrl(req);
    const config = getKickOAuthConfig();
    const forceChannelSync = String(url.searchParams.get("force") || "") === "1";
    const now = Date.now();

    let freshness = { link, refreshed: false };
    try {
      freshness = await ensureKickLinkHasFreshAccessToken(redis, link, {
        redirectUri: resolveKickOAuthRedirectUri(url),
        minTtlMs: 60 * 1000
      });
      link = freshness.link;
    } catch (_error) {
      // Keep previous link state when token refresh fails temporarily.
    }

    if (!link) {
      sendJson(res, { ok: true, linked: false });
      return;
    }

    const staleChannelMs = now - Math.max(0, Math.floor(Number(link.lastChannelSyncAt || 0)));
    if (forceChannelSync || staleChannelMs > 20 * 1000) {
      try {
        const channelsResponse = await fetchKickChannelsByAccessToken(link.accessToken, link.channelSlug || config.channelSlug);
        const channel = pickKickChannel(channelsResponse.channels, link.channelSlug || config.channelSlug);
        if (channel) {
          link = patchKickLinkWithChannel(link, channel, channelsResponse.source);
          await saveKickLink(redis, link);
        }
      } catch (_error) {
        // Keep old data when Kick channel endpoint has temporary issues.
      }
    }

    sendJson(
      res,
      {
        ok: true,
        ...toPublicLinkState(link, {
          refreshed: freshness.refreshed === true
        })
      },
      200
    );
  } catch (error) {
    sendJson(
      res,
      {
        ok: false,
        error: `KICK_OAUTH_STATUS_FAILED:${String(error?.message || "request_failed")}`
      },
      500
    );
  }
};
