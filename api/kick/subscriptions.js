const { createRedisClient } = require("../_lib/redis.js");
const { getRequestUrl, sendJson, sendOptions } = require("../_lib/http.js");
const {
  ensureKickLinkHasFreshAccessToken,
  fetchKickChannelsByAccessToken,
  getKickOAuthConfig,
  loadKickLink,
  patchKickLinkWithChannel,
  pickKickChannel,
  resolveKickOAuthRedirectUri,
  saveKickLink
} = require("../_lib/kick-oauth.js");

function toPublicPayload(link, extras = {}) {
  const safe = link && typeof link === "object" ? link : {};
  return {
    ok: true,
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
    expiresAt: Math.max(0, Math.floor(Number(safe.expiresAt || 0))),
    updatedAt: Math.max(0, Math.floor(Number(safe.updatedAt || 0))),
    lastChannelSyncAt: Math.max(0, Math.floor(Number(safe.lastChannelSyncAt || 0))),
    ...extras
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
      sendJson(
        res,
        {
          ok: true,
          linked: false,
          subscribersCount: null
        },
        200
      );
      return;
    }

    const requestUrl = getRequestUrl(req);
    const config = getKickOAuthConfig();
    const freshness = await ensureKickLinkHasFreshAccessToken(redis, link, {
      redirectUri: resolveKickOAuthRedirectUri(requestUrl),
      minTtlMs: 70 * 1000
    });
    link = freshness.link;

    try {
      const channelsResponse = await fetchKickChannelsByAccessToken(link.accessToken, link.channelSlug || config.channelSlug);
      const channel = pickKickChannel(channelsResponse.channels, link.channelSlug || config.channelSlug);
      if (channel) {
        link = patchKickLinkWithChannel(link, channel, channelsResponse.source);
        await saveKickLink(redis, link);
      }
      sendJson(res, toPublicPayload(link, { refreshed: freshness.refreshed === true }), 200);
    } catch (channelError) {
      if (Number.isFinite(Number(link.activeSubscribersCount))) {
        sendJson(
          res,
          toPublicPayload(link, {
            stale: true,
            warning: `KICK_CHANNEL_SYNC_FAILED:${String(channelError?.message || "request_failed")}`
          }),
          200
        );
        return;
      }
      sendJson(
        res,
        {
          ok: false,
          linked: true,
          error: `KICK_SUBSCRIBERS_FETCH_FAILED:${String(channelError?.message || "request_failed")}`
        },
        502
      );
    }
  } catch (error) {
    sendJson(
      res,
      {
        ok: false,
        error: `KICK_SUBSCRIPTIONS_ENDPOINT_FAILED:${String(error?.message || "request_failed")}`
      },
      500
    );
  }
};
