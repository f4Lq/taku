const { getRequestUrl, sendJson, sendOptions } = require("../../lib/http.js");

const DEFAULT_CHANNEL_SLUG = String(process.env.KICK_CHANNEL_SLUG || "takuu").trim() || "takuu";
const REQUEST_TIMEOUT_MS = 3500;

function parseCountValue(rawValue) {
  if (typeof rawValue === "number" && Number.isFinite(rawValue)) {
    return Math.max(0, Math.floor(rawValue));
  }
  if (typeof rawValue !== "string") {
    return null;
  }
  const digitsOnly = rawValue.replace(/\D+/g, "");
  if (!digitsOnly) {
    return null;
  }
  const parsed = Number.parseInt(digitsOnly, 10);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : null;
}

function readCountCandidate(source, path) {
  let current = source;
  for (const segment of path) {
    if (!current || typeof current !== "object" || !(segment in current)) {
      return null;
    }
    current = current[segment];
  }
  return parseCountValue(current);
}

function readCountCandidates(source, paths) {
  for (const path of paths) {
    const value = readCountCandidate(source, path);
    if (Number.isFinite(value)) {
      return value;
    }
  }
  return null;
}

function extractSubscribersCount(payload) {
  const paths = [
    ["subscriber_count"],
    ["subscriberCount"],
    ["subscribers_count"],
    ["subscribersCount"],
    ["subscribers_last_count"],
    ["subscribersLastCount"],
    ["sub_count"],
    ["subCount"],
    ["subscriptions_count"],
    ["subscriptionsCount"],
    ["subscription_count"],
    ["subscriptionCount"],
    ["paid_subscribers_count"],
    ["paidSubscribersCount"],
    ["total_subscribers"],
    ["totalSubscribers"],
    ["subscribers"],
    ["last_subscriber", "count"],
    ["lastSubscriber", "count"],
    ["data", "count"],
    ["data", "sub_count"],
    ["data", "subscriber_count"],
    ["data", "subscriberCount"],
    ["data", "subscribers_count"],
    ["data", "subscribersCount"],
    ["stats", "subscribers_count"],
    ["stats", "subscribersCount"],
    ["metrics", "subscribers_count"],
    ["metrics", "subscribersCount"],
    ["channel", "subscribers_count"],
    ["channel", "subscribersCount"],
    ["channel", "last_subscriber", "count"],
    ["channel", "lastSubscriber", "count"],
    ["user", "subscribers_count"],
    ["user", "subscribersCount"],
    ["profile", "subscribers_count"],
    ["profile", "subscribersCount"]
  ];
  return readCountCandidates(payload, paths);
}

function extractFollowersCount(payload) {
  const paths = [
    ["followers_count"],
    ["followersCount"],
    ["follower_count"],
    ["followerCount"],
    ["stats", "followers_count"],
    ["stats", "followersCount"],
    ["channel", "followers_count"],
    ["channel", "followersCount"],
    ["data", "followers_count"],
    ["data", "followersCount"],
    ["user", "followers_count"],
    ["user", "followersCount"]
  ];
  return readCountCandidates(payload, paths);
}

async function fetchJsonWithTimeout(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (TakuuLiveBot/1.0)"
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP_${response.status}`);
    }
    return response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchKickSubscribers(channelSlug) {
  const encodedSlug = encodeURIComponent(String(channelSlug || "").trim());
  const sources = [
    {
      source: "kick-v2-info",
      url: `https://kick.com/api/v2/channels/${encodedSlug}/info?_=${Date.now()}`
    },
    {
      source: "kick-v2",
      url: `https://kick.com/api/v2/channels/${encodedSlug}?_=${Date.now()}`
    },
    {
      source: "kick-v1",
      url: `https://kick.com/api/v1/channels/${encodedSlug}?_=${Date.now()}`
    },
    {
      source: "kick-v2-subs-last",
      url: `https://kick.com/api/v2/channels/${encodedSlug}/subscribers/last?_=${Date.now()}`
    }
  ];

  let lastError = null;
  for (const candidate of sources) {
    try {
      const payload = await fetchJsonWithTimeout(candidate.url);
      const subscribersCount = extractSubscribersCount(payload);
      if (Number.isFinite(subscribersCount)) {
        return {
          source: candidate.source,
          subscribersCount,
          followersCount: extractFollowersCount(payload)
        };
      }
      lastError = new Error(`${candidate.source}:MISSING_SUBSCRIBER_COUNT`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error || "request_failed"));
    }
  }

  throw lastError || new Error("KICK_SUBSCRIBERS_FETCH_FAILED");
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
  const requestedSlug = String(requestUrl.searchParams.get("slug") || "").trim();
  const channelSlug = requestedSlug || DEFAULT_CHANNEL_SLUG;

  try {
    const result = await fetchKickSubscribers(channelSlug);
    sendJson(
      res,
      {
        ok: true,
        linked: true,
        channelSlug,
        channelName: channelSlug,
        subscribersCount: Number.isFinite(result.subscribersCount) ? result.subscribersCount : null,
        followersCount: Number.isFinite(result.followersCount) ? result.followersCount : null,
        updatedAt: Date.now(),
        source: result.source
      },
      200
    );
  } catch (error) {
    sendJson(
      res,
      {
        ok: false,
        linked: true,
        channelSlug,
        subscribersCount: null,
        error: `KICK_SUBSCRIBERS_FETCH_FAILED:${String(error?.message || "request_failed")}`
      },
      502
    );
  }
};
