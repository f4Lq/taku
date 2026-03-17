const crypto = require("crypto");

const DEFAULT_CHANNEL_SLUG = "takuu";
const DEFAULT_KICK_OAUTH_SCOPE = "channel:read user:read";
const KICK_OAUTH_LINK_KEY = "kick:oauth:streamer_link";
const KICK_OAUTH_STATE_TTL_MS = 10 * 60 * 1000;
const KICK_TOKEN_ENDPOINT = "https://id.kick.com/oauth/token";
const KICK_CHANNELS_ENDPOINT = "https://api.kick.com/public/v1/channels";

function readEnv(...names) {
  for (const name of names) {
    const value = String(process.env[name] || "").trim();
    if (value) {
      return value;
    }
  }
  return "";
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

function normalizeScope(rawValue) {
  const tokens = String(rawValue || "")
    .replace(/,/g, " ")
    .split(/\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
  if (!tokens.length) {
    return "";
  }
  return Array.from(new Set(tokens)).join(" ");
}

function getKickOAuthConfig() {
  const clientId = readEnv("KICK_OAUTH_CLIENT_ID", "KICK_CLIENT_ID");
  const clientSecret = readEnv("KICK_OAUTH_CLIENT_SECRET", "KICK_CLIENT_SECRET");
  const requestedScope = readEnv("KICK_OAUTH_SCOPE", "KICK_OAUTH_SCOPES");
  const scope = normalizeScope(requestedScope) || DEFAULT_KICK_OAUTH_SCOPE;
  const channelSlug =
    normalizeChannelSlug(readEnv("KICK_CHANNEL_SLUG", "KICK_OAUTH_CHANNEL_SLUG")) || DEFAULT_CHANNEL_SLUG;
  const stateSecret = readEnv("KICK_OAUTH_STATE_SECRET", "KICK_OAUTH_CLIENT_SECRET") || "takuu-kick-oauth";

  return {
    clientId,
    clientSecret,
    scope,
    channelSlug,
    stateSecret
  };
}

function isLocalHost(hostname) {
  const host = String(hostname || "").trim().toLowerCase();
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

function resolveKickOAuthRedirectUri(requestUrl) {
  const hostIsLocal = isLocalHost(requestUrl?.hostname);
  const localOverride = readEnv("KICK_OAUTH_REDIRECT_URI_LOCAL");
  const globalOverride = readEnv("KICK_OAUTH_REDIRECT_URI");
  if (hostIsLocal && localOverride) {
    return localOverride;
  }
  if (!hostIsLocal && globalOverride) {
    return globalOverride;
  }
  if (globalOverride) {
    return globalOverride;
  }
  return `${String(requestUrl?.origin || "").replace(/\/+$/, "")}/api/kick/oauth/callback`;
}

function sanitizeReturnToPath(rawValue) {
  const fallback = "/admin";
  const text = String(rawValue || "").trim();
  if (!text) {
    return fallback;
  }

  if (/^https?:\/\//i.test(text)) {
    try {
      const parsed = new URL(text);
      const joined = `${parsed.pathname || "/"}` + `${parsed.search || ""}`;
      return sanitizeReturnToPath(joined);
    } catch (_error) {
      return fallback;
    }
  }

  const withLeadingSlash = text.startsWith("/") ? text : `/${text}`;
  if (withLeadingSlash.startsWith("//")) {
    return fallback;
  }
  return withLeadingSlash;
}

function toBase64Url(value) {
  const buffer = Buffer.isBuffer(value) ? value : Buffer.from(String(value || ""), "utf8");
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value) {
  const normalized = String(value || "")
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const padding = (4 - (normalized.length % 4 || 4)) % 4;
  return Buffer.from(`${normalized}${"=".repeat(padding)}`, "base64");
}

function signStatePayload(encodedPayload, secret) {
  return toBase64Url(crypto.createHmac("sha256", String(secret || "")).update(String(encodedPayload || "")).digest());
}

function createKickCodeVerifier() {
  return toBase64Url(crypto.randomBytes(64));
}

function createKickCodeChallenge(codeVerifier) {
  return toBase64Url(crypto.createHash("sha256").update(String(codeVerifier || "")).digest());
}

function createKickOAuthState(payload, secret) {
  const safePayload = payload && typeof payload === "object" ? payload : {};
  const withTimestamp = {
    ...safePayload,
    iat: Date.now()
  };
  const encodedPayload = toBase64Url(JSON.stringify(withTimestamp));
  const signature = signStatePayload(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

function verifyKickOAuthState(state, secret, maxAgeMs = KICK_OAUTH_STATE_TTL_MS) {
  const stateText = String(state || "").trim();
  const [payloadPart, signaturePart] = stateText.split(".");
  if (!payloadPart || !signaturePart) {
    return null;
  }

  const expectedSignature = signStatePayload(payloadPart, secret);
  const expectedBuffer = fromBase64Url(expectedSignature);
  const actualBuffer = fromBase64Url(signaturePart);
  if (expectedBuffer.length !== actualBuffer.length) {
    return null;
  }
  if (!crypto.timingSafeEqual(expectedBuffer, actualBuffer)) {
    return null;
  }

  let payload = null;
  try {
    payload = JSON.parse(fromBase64Url(payloadPart).toString("utf8"));
  } catch (_error) {
    payload = null;
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }

  const issuedAt = Math.max(0, Math.floor(Number(payload.iat || 0)));
  if (issuedAt <= 0) {
    return null;
  }
  if (Date.now() - issuedAt > Math.max(1000, Math.floor(Number(maxAgeMs) || KICK_OAUTH_STATE_TTL_MS))) {
    return null;
  }

  return payload;
}

function parseCountValue(rawValue) {
  if (typeof rawValue === "number" && Number.isFinite(rawValue)) {
    return Math.max(0, Math.floor(rawValue));
  }
  if (typeof rawValue !== "string") {
    return null;
  }
  const digits = rawValue.replace(/\D+/g, "");
  if (!digits) {
    return null;
  }
  const parsed = Number.parseInt(digits, 10);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : null;
}

function readCountCandidate(source, path) {
  let current = source;
  for (const key of path) {
    if (!current || typeof current !== "object" || !(key in current)) {
      return null;
    }
    current = current[key];
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

function extractKickSubscribersCount(channel) {
  const total = readCountCandidates(channel, [
    ["subscribers_last_count"],
    ["subscribersLastCount"],
    ["total_subscribers"],
    ["totalSubscribers"],
    ["subscribers_count"],
    ["subscribersCount"],
    ["subscriptions_count"],
    ["subscriptionsCount"],
    ["subscriber_count"],
    ["subscriberCount"],
    ["sub_count"],
    ["subCount"]
  ]);
  if (Number.isFinite(total)) {
    return total;
  }
  return readCountCandidates(channel, [["active_subscribers_count"], ["activeSubscribersCount"]]);
}

function extractKickCanceledSubscribersCount(channel) {
  return readCountCandidates(channel, [["canceled_subscribers_count"], ["canceledSubscribersCount"]]);
}

function extractKickFollowersCount(channel) {
  return readCountCandidates(channel, [
    ["followers_count"],
    ["followersCount"],
    ["follower_count"],
    ["followerCount"]
  ]);
}

function normalizeStoredKickLink(rawValue) {
  if (!rawValue || typeof rawValue !== "object" || Array.isArray(rawValue)) {
    return null;
  }

  const accessToken = String(rawValue.accessToken || "").trim();
  if (!accessToken) {
    return null;
  }

  const refreshToken = String(rawValue.refreshToken || "").trim();
  const tokenType = String(rawValue.tokenType || "Bearer").trim() || "Bearer";
  const scope = normalizeScope(rawValue.scope || "");
  const expiresAt = Math.max(0, Math.floor(Number(rawValue.expiresAt || 0)));
  const linkedAt = Math.max(0, Math.floor(Number(rawValue.linkedAt || rawValue.updatedAt || Date.now())));
  const updatedAt = Math.max(0, Math.floor(Number(rawValue.updatedAt || linkedAt)));
  const channelSlug = normalizeChannelSlug(rawValue.channelSlug || "");
  const channelName = String(rawValue.channelName || "").trim();
  const broadcasterUserId = Number.isFinite(Number(rawValue.broadcasterUserId))
    ? Math.floor(Number(rawValue.broadcasterUserId))
    : null;
  const followersCount = readCountCandidates(rawValue, [["followersCount"]]);
  const activeSubscribersCount = readCountCandidates(rawValue, [["activeSubscribersCount"], ["subscribersCount"]]);
  const canceledSubscribersCount = readCountCandidates(rawValue, [["canceledSubscribersCount"]]);
  const lastChannelSyncAt = Math.max(0, Math.floor(Number(rawValue.lastChannelSyncAt || 0)));

  return {
    accessToken,
    refreshToken,
    tokenType,
    scope,
    expiresAt,
    linkedAt,
    updatedAt,
    channelSlug,
    channelName,
    broadcasterUserId,
    followersCount,
    activeSubscribersCount,
    canceledSubscribersCount,
    lastChannelSyncAt
  };
}

async function loadKickLink(redis) {
  const raw = await redis.command("GET", KICK_OAUTH_LINK_KEY);
  const text = String(raw || "").trim();
  if (!text) {
    return null;
  }
  try {
    return normalizeStoredKickLink(JSON.parse(text));
  } catch (_error) {
    return null;
  }
}

async function saveKickLink(redis, link) {
  const normalized = normalizeStoredKickLink(link);
  if (!normalized) {
    throw new Error("KICK_LINK_INVALID");
  }
  await redis.command("SET", KICK_OAUTH_LINK_KEY, JSON.stringify(normalized));
  return normalized;
}

async function deleteKickLink(redis) {
  await redis.command("DEL", KICK_OAUTH_LINK_KEY);
}

function buildKickTokenRequestBody(params) {
  const body = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    const text = String(value || "").trim();
    if (text) {
      body.set(key, text);
    }
  });
  return body.toString();
}

function normalizeTokenType(rawValue) {
  const tokenType = String(rawValue || "Bearer").trim();
  return tokenType || "Bearer";
}

function normalizeTokenPayload(payload, fallbackScope = "") {
  const source = payload && typeof payload === "object" ? payload : {};
  const accessToken = String(source.access_token || "").trim();
  if (!accessToken) {
    throw new Error("KICK_TOKEN_MISSING_ACCESS_TOKEN");
  }
  const refreshToken = String(source.refresh_token || "").trim();
  const tokenType = normalizeTokenType(source.token_type);
  const scope = normalizeScope(source.scope || fallbackScope);
  const expiresIn = Math.max(0, Math.floor(Number(source.expires_in || 0)));

  return {
    accessToken,
    refreshToken,
    tokenType,
    scope,
    expiresIn
  };
}

async function requestKickToken(params, fallbackScope = "") {
  const requestBody = buildKickTokenRequestBody(params);
  const response = await fetch(KICK_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: requestBody,
    cache: "no-store"
  });

  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch (_error) {
    payload = null;
  }

  if (!response.ok) {
    const message =
      String(payload?.error_description || payload?.error || payload?.message || "").trim() ||
      `HTTP_${response.status}`;
    throw new Error(`KICK_TOKEN_HTTP_${response.status}:${message}`);
  }

  return normalizeTokenPayload(payload, fallbackScope);
}

async function exchangeKickAuthorizationCode({
  clientId,
  clientSecret,
  code,
  redirectUri,
  codeVerifier = "",
  scope = ""
}) {
  return requestKickToken(
    {
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier
    },
    scope
  );
}

async function refreshKickAccessToken({
  clientId,
  clientSecret,
  refreshToken,
  redirectUri = "",
  scope = ""
}) {
  return requestKickToken(
    {
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      redirect_uri: redirectUri
    },
    scope
  );
}

function withBearerToken(accessToken, tokenType = "Bearer") {
  const token = String(accessToken || "").trim();
  if (!token) {
    return "";
  }
  const normalizedType = normalizeTokenType(tokenType);
  if (/^bearer\s+/i.test(token)) {
    return token;
  }
  return `${normalizedType} ${token}`;
}

async function fetchKickChannelsByAccessToken(accessToken, preferredSlug = "") {
  const headerValue = withBearerToken(accessToken, "Bearer");
  if (!headerValue) {
    throw new Error("KICK_ACCESS_TOKEN_MISSING");
  }

  const normalizedSlug = normalizeChannelSlug(preferredSlug);
  const urls = [];
  if (normalizedSlug) {
    const url = new URL(KICK_CHANNELS_ENDPOINT);
    url.searchParams.append("slug", normalizedSlug);
    urls.push({ url: url.toString(), source: "kick-public-v1-channels-slug" });
  }
  urls.push({ url: KICK_CHANNELS_ENDPOINT, source: "kick-public-v1-channels-self" });

  const attempts = [];
  for (const target of urls) {
    const response = await fetch(target.url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: headerValue
      },
      cache: "no-store"
    });

    const text = await response.text();
    let payload = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch (_error) {
      payload = null;
    }

    if (!response.ok) {
      const errorMessage = String(payload?.message || payload?.error || "").trim() || `HTTP_${response.status}`;
      attempts.push(`${target.source}:${errorMessage}`);
      continue;
    }

    const data = Array.isArray(payload?.data) ? payload.data : [];
    if (!data.length) {
      attempts.push(`${target.source}:EMPTY_DATA`);
      continue;
    }
    return {
      channels: data,
      source: target.source
    };
  }

  throw new Error(`KICK_CHANNELS_FETCH_FAILED:${attempts.join("|")}`);
}

function pickKickChannel(channels, preferredSlug = "") {
  const list = Array.isArray(channels) ? channels : [];
  if (!list.length) {
    return null;
  }
  const normalizedPreferred = normalizeChannelSlug(preferredSlug);
  if (!normalizedPreferred) {
    return list[0];
  }
  const bySlug = list.find((item) => normalizeChannelSlug(item?.slug) === normalizedPreferred);
  return bySlug || list[0];
}

function patchKickLinkWithChannel(link, channel, source = "") {
  const safeLink = normalizeStoredKickLink(link) || {};
  const safeChannel = channel && typeof channel === "object" ? channel : {};
  const nextSlug = normalizeChannelSlug(safeChannel.slug || safeLink.channelSlug || "");
  const nextName = String(
    safeChannel.user?.username ||
      safeChannel.user?.name ||
      safeChannel.slug ||
      safeLink.channelName ||
      ""
  ).trim();
  const nextBroadcasterId = Number.isFinite(Number(safeChannel.broadcaster_user_id))
    ? Math.floor(Number(safeChannel.broadcaster_user_id))
    : safeLink.broadcasterUserId;

  return {
    ...safeLink,
    channelSlug: nextSlug,
    channelName: nextName,
    broadcasterUserId: Number.isFinite(Number(nextBroadcasterId)) ? Number(nextBroadcasterId) : null,
    followersCount: extractKickFollowersCount(safeChannel),
    activeSubscribersCount: extractKickSubscribersCount(safeChannel),
    canceledSubscribersCount: extractKickCanceledSubscribersCount(safeChannel),
    lastChannelSyncAt: Date.now(),
    lastChannelSource: String(source || "").trim(),
    updatedAt: Date.now()
  };
}

function createKickLinkFromToken(tokenPayload, meta = {}) {
  const now = Date.now();
  const expiresAt =
    tokenPayload.expiresIn > 0 ? now + tokenPayload.expiresIn * 1000 : now + 50 * 60 * 1000;

  return normalizeStoredKickLink({
    accessToken: tokenPayload.accessToken,
    refreshToken: tokenPayload.refreshToken,
    tokenType: tokenPayload.tokenType,
    scope: tokenPayload.scope,
    expiresAt,
    linkedAt: now,
    updatedAt: now,
    channelSlug: meta.channelSlug,
    channelName: meta.channelName,
    broadcasterUserId: meta.broadcasterUserId,
    followersCount: meta.followersCount,
    activeSubscribersCount: meta.activeSubscribersCount,
    canceledSubscribersCount: meta.canceledSubscribersCount,
    lastChannelSyncAt: now
  });
}

async function ensureKickLinkHasFreshAccessToken(redis, link, options = {}) {
  const normalized = normalizeStoredKickLink(link);
  if (!normalized) {
    return { link: null, refreshed: false };
  }

  const minTtlMs = Math.max(5000, Math.floor(Number(options.minTtlMs || 60 * 1000)));
  const now = Date.now();
  if (normalized.expiresAt <= 0 || normalized.expiresAt - now > minTtlMs) {
    return { link: normalized, refreshed: false };
  }
  if (!normalized.refreshToken) {
    return { link: normalized, refreshed: false };
  }

  const config = getKickOAuthConfig();
  if (!config.clientId || !config.clientSecret) {
    throw new Error("KICK_OAUTH_CONFIG_MISSING");
  }

  const refreshedToken = await refreshKickAccessToken({
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    refreshToken: normalized.refreshToken,
    redirectUri: String(options.redirectUri || "").trim(),
    scope: config.scope
  });
  const refreshedNow = Date.now();
  const nextLink = normalizeStoredKickLink({
    ...normalized,
    accessToken: refreshedToken.accessToken,
    refreshToken: refreshedToken.refreshToken || normalized.refreshToken,
    tokenType: refreshedToken.tokenType || normalized.tokenType,
    scope: refreshedToken.scope || normalized.scope,
    expiresAt:
      refreshedToken.expiresIn > 0
        ? refreshedNow + refreshedToken.expiresIn * 1000
        : refreshedNow + 50 * 60 * 1000,
    updatedAt: refreshedNow
  });
  await saveKickLink(redis, nextLink);
  return { link: nextLink, refreshed: true };
}

module.exports = {
  DEFAULT_CHANNEL_SLUG,
  DEFAULT_KICK_OAUTH_SCOPE,
  KICK_OAUTH_LINK_KEY,
  KICK_OAUTH_STATE_TTL_MS,
  createKickCodeChallenge,
  createKickCodeVerifier,
  createKickLinkFromToken,
  createKickOAuthState,
  deleteKickLink,
  ensureKickLinkHasFreshAccessToken,
  exchangeKickAuthorizationCode,
  extractKickFollowersCount,
  extractKickSubscribersCount,
  fetchKickChannelsByAccessToken,
  getKickOAuthConfig,
  isLocalHost,
  loadKickLink,
  normalizeChannelSlug,
  normalizeScope,
  patchKickLinkWithChannel,
  pickKickChannel,
  readEnv,
  resolveKickOAuthRedirectUri,
  sanitizeReturnToPath,
  saveKickLink,
  verifyKickOAuthState
};
