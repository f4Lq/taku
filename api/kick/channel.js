const { getRequestUrl, sendJson, sendOptions } = require("../_lib/http.js");

const DEFAULT_CHANNEL_SLUG = "takuu";
const JINA_PREFIX = "https://r.jina.ai/";
const SUB_GOAL_CACHE_TTL_MS = 4000;
const subscribersGoalCacheBySlug = new Map();

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

function normalizeChannelSlug(rawValue) {
  return String(rawValue || "")
    .trim()
    .toLowerCase()
    .replace(/^@+/, "")
    .replace(/^https?:\/\/(?:www\.)?kick\.com\//i, "")
    .replace(/\/.*$/, "")
    .replace(/[^a-z0-9_]/g, "");
}

function isLikelyKickChannelPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return false;
  }
  const hasSlug = typeof payload.slug === "string" && payload.slug.trim().length > 0;
  const hasId = Number.isFinite(Number(payload.id));
  const hasUserId = Number.isFinite(Number(payload.user_id ?? payload.userId));
  const hasFollowers = "followers_count" in payload || "followersCount" in payload;
  const hasLivestream = typeof payload.livestream === "object";
  return (hasSlug && hasId) || (hasSlug && hasUserId) || (hasSlug && (hasFollowers || hasLivestream));
}

function parseJsonSafe(value) {
  try {
    return JSON.parse(String(value || ""));
  } catch (_error) {
    return null;
  }
}

function extractJsonFromJinaResponse(rawText) {
  const text = String(rawText || "").trim();
  if (!text) {
    throw new Error("EMPTY_JINA_RESPONSE");
  }

  const direct = parseJsonSafe(text);
  if (direct) {
    return direct;
  }

  const fencedMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch && fencedMatch[1]) {
    const fencedParsed = parseJsonSafe(fencedMatch[1].trim());
    if (fencedParsed) {
      return fencedParsed;
    }
  }

  const markerCandidates = ["Markdown Content:", "Content:", "content:"];
  for (const marker of markerCandidates) {
    const markerIndex = text.indexOf(marker);
    if (markerIndex === -1) {
      continue;
    }
    const payload = text.slice(markerIndex + marker.length).trim();
    const payloadParsed = parseJsonSafe(payload);
    if (payloadParsed) {
      return payloadParsed;
    }
  }

  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    const slicedParsed = parseJsonSafe(text.slice(jsonStart, jsonEnd + 1));
    if (slicedParsed) {
      return slicedParsed;
    }
  }

  throw new Error("INVALID_JINA_PAYLOAD");
}

function buildKickAuthHeaders(requestHeaders = {}) {
  const headers = {};
  const requestBearer = String(
    requestHeaders["x-kick-auth-bearer"] ||
      requestHeaders["authorization"] ||
      ""
  ).trim();
  const requestXsrf = String(
    requestHeaders["x-kick-xsrf-token"] ||
      requestHeaders["x-xsrf-token"] ||
      ""
  ).trim();
  const requestCookie = String(requestHeaders["x-kick-cookie"] || "").trim();

  const bearerRaw = String(
    requestBearer ||
      process.env.KICK_SESSION_TOKEN ||
      process.env.KICK_AUTH_BEARER ||
      process.env.KICK_XSRF_TOKEN ||
      ""
  ).trim();
  const xsrfToken = String(requestXsrf || process.env.KICK_XSRF_TOKEN || "").trim();
  const cookieHeader = String(requestCookie || process.env.KICK_COOKIE || process.env.KICK_SESSION_COOKIE || "").trim();

  if (bearerRaw) {
    headers.Authorization = bearerRaw.startsWith("Bearer ") ? bearerRaw : `Bearer ${bearerRaw}`;
  }
  if (xsrfToken) {
    headers["x-xsrf-token"] = xsrfToken;
  }
  if (cookieHeader) {
    headers.Cookie = cookieHeader;
  }
  return headers;
}

async function fetchKickDirectJson(sourceUrl, extraHeaders = {}) {
  const response = await fetch(sourceUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "User-Agent": "Mozilla/5.0 (TakuuVercel/1.0)",
      ...extraHeaders
    },
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error(`KICK_HTTP_${response.status}`);
  }

  const payload = await response.json();
  if (!isLikelyKickChannelPayload(payload)) {
    throw new Error("KICK_INVALID_PAYLOAD");
  }
  return payload;
}

async function fetchKickViaJinaJson(sourceUrl, extraHeaders = {}) {
  const response = await fetch(`${JINA_PREFIX}${sourceUrl.replace(/^https:\/\//i, "http://")}`, {
    method: "GET",
    headers: {
      Accept: "text/plain, application/json;q=0.9, */*;q=0.8",
      "User-Agent": "Mozilla/5.0 (TakuuVercel/1.0)",
      ...extraHeaders
    },
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error(`JINA_HTTP_${response.status}`);
  }

  const rawText = await response.text();
  const payload = extractJsonFromJinaResponse(rawText);
  if (!isLikelyKickChannelPayload(payload)) {
    throw new Error("JINA_INVALID_PAYLOAD");
  }
  return payload;
}

function extractSubscribersLastCount(payload) {
  const paths = [
    ["count"],
    ["sub_count"],
    ["subCount"],
    ["subscriber_count"],
    ["subscriberCount"],
    ["subscribers_count"],
    ["subscribersCount"],
    ["total"],
    ["data", "count"],
    ["data", "sub_count"],
    ["data", "subCount"],
    ["data", "subscriber_count"],
    ["data", "subscriberCount"],
    ["data", "subscribers_count"],
    ["data", "subscribersCount"]
  ];
  return readCountCandidates(payload, paths);
}

function extractSubscribersCountFromChannelPayload(payload) {
  const paths = [
    ["subscribers_last_count"],
    ["subscribersLastCount"],
    ["subscribers_count"],
    ["subscribersCount"],
    ["subscriber_count"],
    ["subscriberCount"],
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
    ["data", "subscribers_count"],
    ["stats", "subscribers_count"],
    ["stats", "subscribersCount"],
    ["stats", "subscriptions_count"],
    ["stats", "subscriptionsCount"],
    ["metrics", "subscribers_count"],
    ["metrics", "subscribersCount"],
    ["channel", "subscribers_count"],
    ["channel", "subscribersCount"],
    ["channel", "sub_count"],
    ["channel", "last_subscriber", "count"],
    ["channel", "lastSubscriber", "count"],
    ["user", "subscribers_count"],
    ["user", "subscribersCount"],
    ["user", "sub_count"],
    ["profile", "subscribers_count"],
    ["profile", "subscribersCount"]
  ];
  return readCountCandidates(payload, paths);
}

async function fetchSubscribersLastCountDirect(sourceUrl, authHeaders = {}) {
  const response = await fetch(sourceUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "User-Agent": "Mozilla/5.0 (TakuuVercel/1.0)",
      ...authHeaders
    },
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error(`SUB_COUNT_HTTP_${response.status}`);
  }

  const payload = await response.json();
  const count = extractSubscribersLastCount(payload);
  if (!Number.isFinite(count)) {
    throw new Error("SUB_COUNT_INVALID_PAYLOAD");
  }
  return count;
}

async function fetchSubscribersLastCountViaJina(sourceUrl, authHeaders = {}) {
  const response = await fetch(`${JINA_PREFIX}${sourceUrl.replace(/^https:\/\//i, "http://")}`, {
    method: "GET",
    headers: {
      Accept: "text/plain, application/json;q=0.9, */*;q=0.8",
      "User-Agent": "Mozilla/5.0 (TakuuVercel/1.0)",
      ...authHeaders
    },
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error(`SUB_COUNT_JINA_HTTP_${response.status}`);
  }

  const rawText = await response.text();
  const payload = extractJsonFromJinaResponse(rawText);
  const count = extractSubscribersLastCount(payload);
  if (!Number.isFinite(count)) {
    throw new Error("SUB_COUNT_JINA_INVALID_PAYLOAD");
  }
  return count;
}

function parseLoosePositiveInt(rawValue) {
  const digitsOnly = String(rawValue || "").replace(/\D+/g, "");
  if (!digitsOnly) {
    return null;
  }
  const parsed = Number.parseInt(digitsOnly, 10);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : null;
}

function extractSubscribersGoalCountFromText(rawText) {
  const text = String(rawText || "");
  if (!text.trim()) {
    return null;
  }

  const englishMatch = text.match(/(\d[\d\s.,]*)\s+subscriptions?\s+to\s+go!?/i);
  if (englishMatch) {
    const toGo = parseLoosePositiveInt(englishMatch[1]);
    const englishTailStart = Math.max(0, (englishMatch.index || 0) + String(englishMatch[0] || "").length);
    const englishTail = text.slice(englishTailStart, englishTailStart + 360);
    const englishRatioMatch = englishTail.match(/(\d[\d\s.,]*)\s*\/\s*(\d[\d\s.,]*)/);
    const current = parseLoosePositiveInt(englishRatioMatch?.[1] || "");
    const target = parseLoosePositiveInt(englishRatioMatch?.[2] || "");
    if (Number.isFinite(current)) {
      return current;
    }
    if (Number.isFinite(target) && Number.isFinite(toGo) && target >= toGo) {
      return target - toGo;
    }
  }

  const polishMatch = text.match(/brakuje\s+jeszcze\s+(\d[\d\s.,]*)\s+subskryb\w*/i);
  if (polishMatch) {
    const toGo = parseLoosePositiveInt(polishMatch[1]);
    const polishTailStart = Math.max(0, (polishMatch.index || 0) + String(polishMatch[0] || "").length);
    const polishTail = text.slice(polishTailStart, polishTailStart + 360);
    const polishRatioMatch = polishTail.match(/(\d[\d\s.,]*)\s*\/\s*(\d[\d\s.,]*)/);
    const current = parseLoosePositiveInt(polishRatioMatch?.[1] || "");
    const target = parseLoosePositiveInt(polishRatioMatch?.[2] || "");
    if (Number.isFinite(current)) {
      return current;
    }
    if (Number.isFinite(target) && Number.isFinite(toGo) && target >= toGo) {
      return target - toGo;
    }
  }

  return null;
}

async function fetchSubscribersGoalCountViaJinaPage(channelSlug) {
  const normalizedSlug = normalizeChannelSlug(channelSlug);
  if (!normalizedSlug) {
    throw new Error("SUB_GOAL_INVALID_SLUG");
  }

  const cachedGoal = subscribersGoalCacheBySlug.get(normalizedSlug);
  if (cachedGoal && Number.isFinite(cachedGoal.count) && Number(cachedGoal.expiresAt) > Date.now()) {
    return Number(cachedGoal.count);
  }

  const response = await fetch(`${JINA_PREFIX}http://kick.com/${encodeURIComponent(normalizedSlug)}`, {
    method: "GET",
    headers: {
      Accept: "text/plain, application/json;q=0.9, */*;q=0.8",
      "User-Agent": "Mozilla/5.0 (TakuuVercel/1.0)"
    },
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error(`SUB_GOAL_JINA_HTTP_${response.status}`);
  }

  const rawText = await response.text();
  const count = extractSubscribersGoalCountFromText(rawText);
  if (!Number.isFinite(count)) {
    throw new Error("SUB_GOAL_NOT_FOUND");
  }
  subscribersGoalCacheBySlug.set(normalizedSlug, {
    count,
    expiresAt: Date.now() + SUB_GOAL_CACHE_TTL_MS
  });
  return count;
}

async function fetchSubscribersLastCount(channelSlug, attempts = [], requestHeaders = {}) {
  const authHeaders = buildKickAuthHeaders(requestHeaders);
  const subscribersLastUrl = `https://kick.com/api/v2/channels/${encodeURIComponent(channelSlug)}/subscribers/last`;

  try {
    const count = await fetchSubscribersGoalCountViaJinaPage(channelSlug);
    return { count, source: "kick-channel-goal-jina" };
  } catch (error) {
    attempts.push(`kick-channel-goal-jina:${String(error?.message || "request_failed")}`);
  }

  try {
    const count = await fetchSubscribersLastCountDirect(subscribersLastUrl, authHeaders);
    return { count, source: "kick-v2-subs-last" };
  } catch (error) {
    attempts.push(`kick-v2-subs-last:${String(error?.message || "request_failed")}`);
  }

  try {
    const count = await fetchSubscribersLastCountViaJina(subscribersLastUrl, authHeaders);
    return { count, source: "kick-v2-subs-last-jina" };
  } catch (error) {
    attempts.push(`kick-v2-subs-last-jina:${String(error?.message || "request_failed")}`);
  }

  return { count: null, source: null };
}

async function withSubscribersLastCount(channelSlug, channel, attempts = [], requestHeaders = {}) {
  if (!isLikelyKickChannelPayload(channel)) {
    return { channel, subscribersSource: null };
  }

  const { count, source } = await fetchSubscribersLastCount(channelSlug, attempts, requestHeaders);
  if (Number.isFinite(count)) {
    const isGoalSource = source === "kick-channel-goal-jina";
    return {
      channel: {
        ...channel,
        subscribers_last_count: count,
        subscribersLastCount: count,
        ...(isGoalSource
          ? {
              subscribers_goal_current: count,
              subscribersGoalCurrent: count
            }
          : {})
      },
      subscribersSource: source
    };
  }

  const channelCount = extractSubscribersCountFromChannelPayload(channel);
  if (!Number.isFinite(channelCount)) {
    return { channel, subscribersSource: source };
  }

  return {
    channel: {
      ...channel,
      subscribers_last_count: channelCount,
      subscribersLastCount: channelCount
    },
    subscribersSource: "kick-channel-data"
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

  const url = getRequestUrl(req);
  const requestedSlug = String(url.searchParams.get("slug") || "").trim();
  const fallbackSlug = String(process.env.KICK_CHANNEL_SLUG || DEFAULT_CHANNEL_SLUG).trim() || DEFAULT_CHANNEL_SLUG;
  const channelSlug = normalizeChannelSlug(requestedSlug || fallbackSlug);
  if (!channelSlug) {
    sendJson(res, { ok: false, error: "INVALID_CHANNEL_SLUG" }, 400);
    return;
  }

  const baseUrls = [
    { source: "kick-v2-info", url: `https://kick.com/api/v2/channels/${encodeURIComponent(channelSlug)}/info` },
    { source: "kick-v2", url: `https://kick.com/api/v2/channels/${encodeURIComponent(channelSlug)}` },
    { source: "kick-v1", url: `https://kick.com/api/v1/channels/${encodeURIComponent(channelSlug)}` }
  ];
  const attempts = [];

  for (const target of baseUrls) {
    try {
      const channel = await fetchKickDirectJson(target.url);
      const enriched = await withSubscribersLastCount(channelSlug, channel, attempts, req.headers || {});
      sendJson(
        res,
        {
          ok: true,
          channel: enriched.channel,
          source: target.source,
          subscribersSource: enriched.subscribersSource
        },
        200
      );
      return;
    } catch (error) {
      attempts.push(`${target.source}:${String(error?.message || "request_failed")}`);
    }
  }

  for (const target of baseUrls) {
    try {
      const channel = await fetchKickViaJinaJson(target.url);
      const enriched = await withSubscribersLastCount(channelSlug, channel, attempts, req.headers || {});
      sendJson(
        res,
        {
          ok: true,
          channel: enriched.channel,
          source: `${target.source}-jina`,
          subscribersSource: enriched.subscribersSource
        },
        200
      );
      return;
    } catch (error) {
      attempts.push(`${target.source}-jina:${String(error?.message || "request_failed")}`);
    }
  }

  sendJson(
    res,
    {
      ok: false,
      error: "KICK_CHANNEL_UNREACHABLE",
      attempts
    },
    502
  );
};


