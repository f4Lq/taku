const { createRedisClient } = require("../_lib/redis.js");
const { getRequestUrl, sendJson, sendOptions } = require("../_lib/http.js");
const {
  ensureKickLinkHasFreshAccessToken,
  extractKickSubscribersCount,
  fetchKickChannelsByAccessToken,
  getKickOAuthConfig,
  loadKickLink,
  patchKickLinkWithChannel,
  pickKickChannel,
  resolveKickOAuthRedirectUri,
  saveKickLink
} = require("../_lib/kick-oauth.js");

function parseSafeCount(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return Math.max(0, Math.floor(parsed));
}

function pickPublicSubscribersCount(payload) {
  const channel = payload && typeof payload.channel === "object" ? payload.channel : null;
  if (!channel) {
    return null;
  }

  const goalCurrent =
    parseSafeCount(channel.subscribers_goal_current) ?? parseSafeCount(channel.subscribersGoalCurrent);
  if (Number.isFinite(goalCurrent)) {
    return goalCurrent;
  }

  const source = String(payload?.subscribersSource || "").trim();
  if (source === "kick-channel-goal-jina") {
    const goalFallback =
      parseSafeCount(channel.subscribers_last_count) ?? parseSafeCount(channel.subscribersLastCount);
    if (Number.isFinite(goalFallback)) {
      return goalFallback;
    }
  }

  const fallback = extractKickSubscribersCount(channel);
  return Number.isFinite(fallback) ? Math.max(0, Math.floor(fallback)) : null;
}

async function fetchPublicTotalSubscribersCount(requestUrl, channelSlug, accessToken = "") {
  const slug = String(channelSlug || "").trim();
  if (!slug) {
    return null;
  }

  try {
    const endpoint = new URL("/api/kick/channel", String(requestUrl?.origin || "https://taku-live.pl"));
    endpoint.searchParams.set("slug", slug);
    endpoint.searchParams.set("_", String(Date.now()));
    const response = await fetch(endpoint.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(String(accessToken || "").trim()
          ? { "x-kick-auth-bearer": String(accessToken || "").trim() }
          : {})
      },
      cache: "no-store"
    });
    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    if (!payload || payload.ok !== true || !payload.channel || typeof payload.channel !== "object") {
      return null;
    }

    return pickPublicSubscribersCount(payload);
  } catch (_error) {
    return null;
  }
}

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

  const requestUrl = getRequestUrl(req);
  const config = getKickOAuthConfig();
  const redis = createRedisClient();
  if (!redis) {
    const publicSubscribersCount = await fetchPublicTotalSubscribersCount(requestUrl, config.channelSlug || "takuu");
    sendJson(
      res,
      {
        ok: true,
        linked: false,
        channelSlug: String(config.channelSlug || "").trim() || null,
        subscribersCount: Number.isFinite(Number(publicSubscribersCount))
          ? Math.floor(Number(publicSubscribersCount))
          : null,
        source: Number.isFinite(Number(publicSubscribersCount)) ? "kick-channel-public" : "kick-channel-unavailable",
        warning: "MISSING_KV_REST_ENV"
      },
      200
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

    let freshness = { link, refreshed: false };
    try {
      freshness = await ensureKickLinkHasFreshAccessToken(redis, link, {
        redirectUri: resolveKickOAuthRedirectUri(requestUrl),
        minTtlMs: 70 * 1000
      });
      link = freshness.link;
    } catch (_error) {
      // Keep previous link state when token refresh fails temporarily.
    }

    try {
      const channelsResponse = await fetchKickChannelsByAccessToken(link.accessToken, link.channelSlug || config.channelSlug);
      const channel = pickKickChannel(channelsResponse.channels, link.channelSlug || config.channelSlug);
      if (channel) {
        link = patchKickLinkWithChannel(link, channel, channelsResponse.source);
        const totalSubscribers = await fetchPublicTotalSubscribersCount(
          requestUrl,
          link.channelSlug || config.channelSlug,
          link.accessToken
        );
        if (Number.isFinite(totalSubscribers)) {
          link = {
            ...link,
            activeSubscribersCount: Math.max(0, Math.floor(totalSubscribers)),
            updatedAt: Date.now()
          };
        }
        await saveKickLink(redis, link);
      }
      sendJson(res, toPublicPayload(link, { refreshed: freshness.refreshed === true }), 200);
    } catch (channelError) {
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
