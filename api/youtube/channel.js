const { getRequestUrl, sendJson, sendOptions } = require("../_lib/http.js");

const YT_API_BASE = "https://www.googleapis.com/youtube/v3";
const YT_USER_AGENT = "Mozilla/5.0 (YouTubeAPI/3.0)";
const YT_LOCALE_HL = "pl";
const YT_LOCALE_GL = "PL";
const YT_ACCEPT_LANGUAGE = "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7";
const YT_DEFAULT_LIMIT = 5;
const YT_MAX_RESULTS = 50;
const YT_MAX_SCAN_PAGES = 80;
const YT_CACHE_TTL_MS = 3 * 60 * 1000;
const YT_CACHE_TTL_NEWEST_MS = 8 * 1000;
const YT_CACHE_MAX_ITEMS = 250;
const ytCache = new Map();

function clampInt(value, min, max, fallback) {
  const parsed = Number.parseInt(String(value ?? "").trim(), 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, parsed));
}

function normalizeSortMode(value) {
  const clean = String(value || "").trim().toLowerCase();
  if (clean === "popular") {
    return "popular";
  }
  if (clean === "oldest") {
    return "oldest";
  }
  return "newest";
}

function normalizeChannelId(value) {
  const clean = String(value || "").trim();
  return /^UC[a-zA-Z0-9_-]{22}$/.test(clean) ? clean : "";
}

function normalizeHandle(value) {
  const clean = String(value || "").trim();
  if (!clean) {
    return "";
  }
  const candidate = clean.startsWith("@") ? clean : `@${clean.replace(/^@+/, "")}`;
  return /^@[a-zA-Z0-9._-]{2,60}$/.test(candidate) ? candidate : "";
}

function normalizeUserName(value) {
  const clean = String(value || "").trim();
  return /^[a-zA-Z0-9._-]{2,60}$/.test(clean) ? clean : "";
}

function parseChannelReference(value) {
  const input = String(value || "").trim();
  if (!input) {
    return null;
  }

  const directId = normalizeChannelId(input);
  if (directId) {
    return { channelId: directId, handle: "", userName: "", channelUrl: `https://www.youtube.com/channel/${directId}` };
  }

  const directHandle = normalizeHandle(input);
  if (directHandle) {
    return { channelId: "", handle: directHandle, userName: "", channelUrl: `https://www.youtube.com/${directHandle}` };
  }

  let parsed = null;
  try {
    parsed = new URL(input, "https://www.youtube.com");
  } catch (_error) {
    parsed = null;
  }
  if (!parsed) {
    return null;
  }

  const host = String(parsed.hostname || "").toLowerCase();
  const okHost = host === "youtube.com" || host === "www.youtube.com" || host === "m.youtube.com" || host === "youtu.be";
  if (!okHost) {
    return null;
  }

  const channelIdFromQuery = normalizeChannelId(parsed.searchParams.get("channel_id"));
  if (channelIdFromQuery) {
    return { channelId: channelIdFromQuery, handle: "", userName: "", channelUrl: `https://www.youtube.com/channel/${channelIdFromQuery}` };
  }

  const segments = String(parsed.pathname || "/").split("/").map((s) => s.trim()).filter(Boolean);
  if (!segments.length) {
    return null;
  }
  if (segments[0].toLowerCase() === "channel" && segments[1]) {
    const channelId = normalizeChannelId(segments[1]);
    if (channelId) {
      return { channelId, handle: "", userName: "", channelUrl: `https://www.youtube.com/channel/${channelId}` };
    }
  }
  if (segments[0].toLowerCase() === "user" && segments[1]) {
    const userName = normalizeUserName(segments[1]);
    if (userName) {
      return { channelId: "", handle: "", userName, channelUrl: `https://www.youtube.com/user/${userName}` };
    }
  }
  if (segments[0].startsWith("@")) {
    const handle = normalizeHandle(segments[0]);
    if (handle) {
      return { channelId: "", handle, userName: "", channelUrl: `https://www.youtube.com/${handle}` };
    }
  }
  return null;
}

function canonicalChannelUrl(reference) {
  const source = reference && typeof reference === "object" ? reference : {};
  const channelId = normalizeChannelId(source.channelId);
  if (channelId) {
    return `https://www.youtube.com/channel/${channelId}`;
  }
  const handle = normalizeHandle(source.handle);
  if (handle) {
    return `https://www.youtube.com/${handle}`;
  }
  const userName = normalizeUserName(source.userName);
  if (userName) {
    return `https://www.youtube.com/user/${userName}`;
  }
  const parsed = parseChannelReference(source.channelUrl || "");
  return parsed ? parsed.channelUrl : "";
}

function withYouTubeLocaleUrl(rawUrl) {
  const cleanUrl = String(rawUrl || "").trim();
  if (!cleanUrl) {
    return "";
  }
  let parsed = null;
  try {
    parsed = new URL(cleanUrl);
  } catch (_error) {
    return cleanUrl;
  }
  const host = String(parsed.hostname || "").toLowerCase();
  const isYouTubeHost = host === "youtube.com" || host === "www.youtube.com" || host === "m.youtube.com";
  if (!isYouTubeHost) {
    return cleanUrl;
  }
  if (!parsed.searchParams.get("hl")) {
    parsed.searchParams.set("hl", YT_LOCALE_HL);
  }
  if (!parsed.searchParams.get("gl")) {
    parsed.searchParams.set("gl", YT_LOCALE_GL);
  }
  return parsed.toString();
}

function parseCount(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.floor(value));
  }
  const text = String(value || "").trim().toLowerCase().replace(/\u00a0/g, " ");
  if (!text) {
    return 0;
  }

  const numberMatch = text.match(/(\d+(?:[.,]\d+)?)/);
  if (numberMatch) {
    const numberText = String(numberMatch[1] || "").trim();
    let multiplier = 1;
    if (/(?:\s|^)(?:mld|billion|miliard)/i.test(text) || /\d(?:[.,]\d+)?\s*b(?![a-z])/i.test(text)) {
      multiplier = 1_000_000_000;
    } else if (/(?:\s|^)(?:mln|million|milion)/i.test(text) || /\d(?:[.,]\d+)?\s*m(?![a-z])/i.test(text)) {
      multiplier = 1_000_000;
    } else if (/(?:\s|^)(?:tys|thousand)/i.test(text) || /\d(?:[.,]\d+)?\s*k(?![a-z])/i.test(text)) {
      multiplier = 1_000;
    }

    if (multiplier > 1) {
      const compactNumber = Number.parseFloat(numberText.replace(",", "."));
      if (Number.isFinite(compactNumber)) {
        return Math.max(0, Math.round(compactNumber * multiplier));
      }
    }
  }

  const digits = text.replace(/\D+/g, "");
  if (!digits) {
    return 0;
  }
  const parsed = Number.parseInt(digits, 10);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function formatDateMs(value) {
  const ms = new Date(String(value || "").trim()).getTime();
  return Number.isFinite(ms) ? ms : 0;
}

function sortVideos(videos, sortMode) {
  const mode = normalizeSortMode(sortMode);
  const list = Array.isArray(videos) ? [...videos] : [];
  if (mode === "popular") {
    list.sort((a, b) => (b.views || 0) - (a.views || 0) || (b.publishedMs || 0) - (a.publishedMs || 0));
    return list;
  }
  if (mode === "oldest") {
    list.sort((a, b) => (a.publishedMs || 0) - (b.publishedMs || 0));
    return list;
  }
  list.sort((a, b) => (b.publishedMs || 0) - (a.publishedMs || 0));
  return list;
}

function hasReference(reference) {
  const source = reference && typeof reference === "object" ? reference : {};
  return Boolean(normalizeChannelId(source.channelId) || normalizeHandle(source.handle) || normalizeUserName(source.userName));
}

function cacheKey(reference, sortMode, limit) {
  const source = reference && typeof reference === "object" ? reference : {};
  return [
    normalizeChannelId(source.channelId),
    normalizeHandle(source.handle).toLowerCase(),
    normalizeUserName(source.userName).toLowerCase(),
    String(source.channelUrl || "").trim().toLowerCase(),
    normalizeSortMode(sortMode),
    String(clampInt(limit, 1, YT_MAX_RESULTS, YT_DEFAULT_LIMIT)),
  ].join("|");
}

function getFromCache(key) {
  const clean = String(key || "").trim();
  if (!clean) {
    return null;
  }
  const cached = ytCache.get(clean);
  if (!cached || typeof cached !== "object") {
    return null;
  }
  if (Number(cached.expiresAt || 0) <= Date.now()) {
    ytCache.delete(clean);
    return null;
  }
  return cached.value || null;
}

function putInCache(key, value, sortMode) {
  const clean = String(key || "").trim();
  if (!clean || !value || typeof value !== "object") {
    return;
  }
  const ttl = normalizeSortMode(sortMode) === "newest" ? YT_CACHE_TTL_NEWEST_MS : YT_CACHE_TTL_MS;
  ytCache.set(clean, { value, expiresAt: Date.now() + ttl });
  while (ytCache.size > YT_CACHE_MAX_ITEMS) {
    const first = ytCache.keys().next().value;
    if (!first) {
      break;
    }
    ytCache.delete(first);
  }
}

async function fetchJson(url, options = {}) {
  let response = null;
  try {
    response = await fetch(url, options);
  } catch (error) {
    throw new Error(`HTTP_UNREACHABLE:${String(error?.message || "request_failed")}`);
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload) {
    const message = String(payload && payload.error && payload.error.message || "").trim();
    throw new Error(`HTTP_${response.status}${message ? `:${message}` : ""}`);
  }
  return payload;
}

async function fetchText(url) {
  const response = await fetch(withYouTubeLocaleUrl(url), {
    method: "GET",
    headers: {
      Accept: "application/xml, text/xml, text/html, text/plain;q=0.9, */*;q=0.8",
      "User-Agent": YT_USER_AGENT,
      "Accept-Language": YT_ACCEPT_LANGUAGE,
    },
    cache: "no-store",
  }).catch((error) => {
    throw new Error(`YOUTUBE_TEXT_UNREACHABLE:${String(error?.message || "request_failed")}`);
  });
  if (!response.ok) {
    throw new Error(`YOUTUBE_TEXT_HTTP_${response.status}`);
  }
  const text = await response.text();
  if (!String(text || "").trim()) {
    throw new Error("YOUTUBE_TEXT_EMPTY");
  }
  return text;
}

function extractJsonObjectAfterToken(sourceText, token) {
  const source = String(sourceText || "");
  const marker = String(token || "");
  const tokenIndex = source.indexOf(marker);
  if (tokenIndex < 0) {
    return "";
  }
  const start = source.indexOf("{", tokenIndex + marker.length);
  if (start < 0) {
    return "";
  }
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === "\"") {
        inString = false;
      }
      continue;
    }
    if (ch === "\"") {
      inString = true;
      continue;
    }
    if (ch === "{") {
      depth += 1;
    } else if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(start, i + 1);
      }
    }
  }
  return "";
}

function collectByKey(value, keyName, collector) {
  const stack = [value];
  while (stack.length) {
    const current = stack.pop();
    if (!current || typeof current !== "object") {
      continue;
    }
    if (Array.isArray(current)) {
      for (let index = current.length - 1; index >= 0; index -= 1) {
        stack.push(current[index]);
      }
      continue;
    }
    if (Object.prototype.hasOwnProperty.call(current, keyName)) {
      collector.push(current[keyName]);
    }
    const keys = Object.keys(current);
    for (let index = keys.length - 1; index >= 0; index -= 1) {
      stack.push(current[keys[index]]);
    }
  }
}

function readText(value) {
  if (typeof value === "string") {
    return value.trim();
  }
  if (!value || typeof value !== "object") {
    return "";
  }
  if (typeof value.content === "string") {
    return value.content.trim();
  }
  if (typeof value.simpleText === "string") {
    return value.simpleText.trim();
  }
  if (Array.isArray(value.runs)) {
    return value.runs.map((item) => String(item && item.text || "")).join("").trim();
  }
  const accessibilityLabel = value && value.accessibility && value.accessibility.accessibilityData && value.accessibility.accessibilityData.label;
  if (typeof accessibilityLabel === "string") {
    return accessibilityLabel.trim();
  }
  return "";
}

function decodeEscapedText(value) {
  return String(value || "")
    .replace(/\\\\u0026/gi, "&")
    .replace(/\\u0026/gi, "&")
    .replace(/\\\\\//g, "/")
    .replace(/\\\//g, "/")
    .replace(/&amp;/g, "&")
    .trim();
}

function firstNonEmptyString(...values) {
  for (const value of values) {
    const clean = String(value || "").trim();
    if (clean) {
      return clean;
    }
  }
  return "";
}

function isSubscribersLabel(value) {
  return /subskrybent|subscriber/i.test(String(value || "").trim());
}

function pickBestSubscribersText(values) {
  const candidates = Array.isArray(values) ? values.map((value) => String(value || "").trim()).filter(Boolean) : [];
  let best = "";
  let bestCount = -1;
  candidates.forEach((candidate) => {
    if (!isSubscribersLabel(candidate)) {
      return;
    }
    const count = parseCount(candidate);
    if (count > bestCount) {
      best = candidate;
      bestCount = count;
    }
  });
  if (best) {
    return best;
  }
  return candidates.find((candidate) => isSubscribersLabel(candidate)) || "";
}

function subscribersTextFromInitialData(data) {
  const candidates = [];

  const c4Headers = [];
  collectByKey(data, "c4TabbedHeaderRenderer", c4Headers);
  c4Headers.forEach((header) => {
    candidates.push(readText(header && header.subscriberCountText));
  });

  const channelHeaders = [];
  collectByKey(data, "channelHeaderRenderer", channelHeaders);
  channelHeaders.forEach((header) => {
    candidates.push(readText(header && header.subscriberCountText));
  });

  const pageHeaders = [];
  collectByKey(data, "pageHeaderViewModel", pageHeaders);
  pageHeaders.forEach((pageHeader) => {
    const rows =
      pageHeader &&
      pageHeader.metadata &&
      pageHeader.metadata.contentMetadataViewModel &&
      Array.isArray(pageHeader.metadata.contentMetadataViewModel.metadataRows)
        ? pageHeader.metadata.contentMetadataViewModel.metadataRows
        : [];
    rows.forEach((row) => {
      const parts = Array.isArray(row && row.metadataParts) ? row.metadataParts : [];
      parts.forEach((part) => {
        candidates.push(readText(part && part.text));
        candidates.push(String(part && part.accessibilityLabel || "").trim());
      });
    });
  });

  const genericSubs = [];
  collectByKey(data, "subscriberCountText", genericSubs);
  genericSubs.forEach((item) => {
    candidates.push(readText(item));
  });

  return pickBestSubscribersText(candidates);
}

function parseRelativePublishedMs(labelValue) {
  const text = String(labelValue || "").trim().toLowerCase();
  if (!text) {
    return 0;
  }

  const now = Date.now();
  if (text.includes("wczoraj") || text.includes("yesterday")) {
    return now - (24 * 60 * 60 * 1000);
  }
  if (text.includes("przed chwila") || text.includes("just now")) {
    return now;
  }

  const numberMatch = text.match(/(\d+)/);
  const value = Number.parseInt(numberMatch && numberMatch[1], 10);
  const amount = Number.isFinite(value) && value > 0 ? value : 1;
  const hourMs = 60 * 60 * 1000;
  const dayMs = 24 * hourMs;

  if (text.includes("rok") || text.includes("lat") || text.includes("year")) {
    return now - (amount * 365 * dayMs);
  }
  if (text.includes("mies") || text.includes("month")) {
    return now - (amount * 30 * dayMs);
  }
  if (text.includes("tyg") || text.includes("week")) {
    return now - (amount * 7 * dayMs);
  }
  if (text.includes("dni") || text.includes("dzien") || text.includes("day")) {
    return now - (amount * dayMs);
  }
  if (text.includes("godz") || text.includes("hour")) {
    return now - (amount * hourMs);
  }
  if (text.includes("min") || text.includes("minute")) {
    return now - (amount * 60 * 1000);
  }
  return 0;
}

function videosFromRendererData(data) {
  const renderers = [];
  collectByKey(data, "videoRenderer", renderers);
  const seen = new Set();
  const videos = [];
  renderers.forEach((renderer) => {
    const item = renderer && typeof renderer === "object" ? renderer : {};
    const videoId = String(item.videoId || "").trim();
    if (!videoId || seen.has(videoId)) {
      return;
    }
    seen.add(videoId);
    const viewText = readText(item.viewCountText) || readText(item.shortViewCountText);
    const publishedLabel = readText(item.publishedTimeText);
    const publishedMs = parseRelativePublishedMs(publishedLabel);
    const thumbCandidates = [];
    const thumbsA = item && item.thumbnail && Array.isArray(item.thumbnail.thumbnails) ? item.thumbnail.thumbnails : [];
    const thumbsB =
      item &&
      item.richThumbnail &&
      item.richThumbnail.movingThumbnailRenderer &&
      item.richThumbnail.movingThumbnailRenderer.movingThumbnailDetails &&
      Array.isArray(item.richThumbnail.movingThumbnailRenderer.movingThumbnailDetails.thumbnails)
        ? item.richThumbnail.movingThumbnailRenderer.movingThumbnailDetails.thumbnails
        : [];
    thumbCandidates.push(...thumbsA, ...thumbsB);
    videos.push({
      id: videoId,
      title: readText(item.title) || "Bez tytulu",
      videoId,
      url: `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`,
      thumbnailUrl: bestThumbFromList(thumbCandidates),
      description: readText(item.descriptionSnippet),
      publishedAt: publishedMs ? new Date(publishedMs).toISOString() : "",
      updatedAt: publishedMs ? new Date(publishedMs).toISOString() : "",
      publishedMs,
      views: parseCount(viewText),
      publishedLabel,
    });
  });
  return videos;
}

function bestThumbFromList(thumbnails) {
  const source = Array.isArray(thumbnails) ? thumbnails : [];
  const ranked = source
    .map((entry) => ({
      url: String(entry && entry.url || "").trim(),
      area: (Number.parseInt(String(entry && entry.width || ""), 10) || 0) * (Number.parseInt(String(entry && entry.height || ""), 10) || 0),
    }))
    .filter((entry) => entry.url);
  ranked.sort((a, b) => b.area - a.area);
  return ranked[0] ? ranked[0].url : "";
}

function avatarFromHtml(htmlText) {
  const html = String(htmlText || "");
  if (!html) {
    return "";
  }

  const metaPatterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
  ];
  for (const pattern of metaPatterns) {
    const match = html.match(pattern);
    const url = decodeEscapedText(match && match[1]);
    if (url) {
      return url;
    }
  }

  const avatarIndex = html.indexOf("\"decoratedAvatarViewModel\"");
  if (avatarIndex >= 0) {
    const chunk = html.slice(avatarIndex, avatarIndex + 3000);
    const urls = Array.from(chunk.matchAll(/"url":"([^"]+)"/g))
      .map((match) => decodeEscapedText(match && match[1]))
      .filter(Boolean);
    if (urls.length) {
      return urls[urls.length - 1];
    }
  }

  return "";
}

function channelMetaFromInitialData(data, fallbackReference) {
  const metadataItems = [];
  collectByKey(data, "channelMetadataRenderer", metadataItems);
  const metadata = metadataItems.find((item) => item && typeof item === "object") || {};
  const subscribersText = subscribersTextFromInitialData(data);

  const parsedFromMetaUrl = parseChannelReference(metadata.vanityChannelUrl || metadata.channelUrl || "") || {};
  const channelId =
    normalizeChannelId((fallbackReference && fallbackReference.channelId) || "") ||
    normalizeChannelId(metadata.externalId) ||
    normalizeChannelId(parsedFromMetaUrl.channelId);
  const handle =
    normalizeHandle((fallbackReference && fallbackReference.handle) || "") ||
    normalizeHandle(parsedFromMetaUrl.handle);
  const userName =
    normalizeUserName((fallbackReference && fallbackReference.userName) || "") ||
    normalizeUserName(parsedFromMetaUrl.userName) ||
    normalizeUserName(String(handle || "").replace(/^@+/, ""));

  return {
    name: String(metadata.title || "").trim(),
    description: String(metadata.description || "").trim(),
    avatarUrl: bestThumbFromList(metadata.avatar && metadata.avatar.thumbnails),
    subscribersText: String(subscribersText || "").trim(),
    channelId,
    handle,
    userName,
    channelUrl: canonicalChannelUrl({
      channelId,
      handle,
      userName,
      channelUrl: metadata.vanityChannelUrl || metadata.channelUrl || (fallbackReference && fallbackReference.channelUrl) || "",
    }),
  };
}

function channelMetaFromHtml(htmlText, fallbackReference = {}) {
  const html = String(htmlText || "");
  const fallback = fallbackReference && typeof fallbackReference === "object" ? fallbackReference : {};
  if (!html) {
    return {
      name: "",
      description: "",
      avatarUrl: "",
      subscribersText: "",
      channelId: normalizeChannelId(fallback.channelId),
      handle: normalizeHandle(fallback.handle),
      userName: normalizeUserName(fallback.userName),
      channelUrl: canonicalChannelUrl(fallback),
    };
  }

  const ogTitle =
    (html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) || [])[1] ||
    "";
  const ogDescription =
    (html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) || [])[1] ||
    "";
  const canonicalUrlMatch =
    (html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) || [])[1] ||
    "";
  const subscriberMatch =
    (html.match(/([0-9][0-9\s.,\u00A0]*\s*(?:subskrybent(?:ow|ów|y)?|subscribers?))/i) || [])[1] ||
    "";
  const initialDataRaw =
    extractJsonObjectAfterToken(html, "var ytInitialData =") ||
    extractJsonObjectAfterToken(html, "ytInitialData =");
  let subscribersFromInitialData = "";
  if (initialDataRaw) {
    try {
      const initialData = JSON.parse(initialDataRaw);
      subscribersFromInitialData = subscribersTextFromInitialData(initialData);
    } catch (_error) {
      subscribersFromInitialData = "";
    }
  }

  const parsedCanonical = parseChannelReference(canonicalUrlMatch) || {};
  const parsedChannelUrl = parseChannelReference(String(fallback.channelUrl || "")) || {};
  const channelId =
    normalizeChannelId(fallback.channelId) ||
    normalizeChannelId(parsedCanonical.channelId) ||
    normalizeChannelId(parsedChannelUrl.channelId);
  const handle =
    normalizeHandle(fallback.handle) ||
    normalizeHandle(parsedCanonical.handle) ||
    normalizeHandle(parsedChannelUrl.handle);
  const userName =
    normalizeUserName(fallback.userName) ||
    normalizeUserName(parsedCanonical.userName) ||
    normalizeUserName(parsedChannelUrl.userName) ||
    normalizeUserName(String(handle || "").replace(/^@+/, ""));

  return {
    name: decodeEscapedText(ogTitle),
    description: decodeEscapedText(ogDescription),
    avatarUrl: avatarFromHtml(html),
    subscribersText: pickBestSubscribersText([
      decodeEscapedText(subscribersFromInitialData),
      decodeEscapedText(subscriberMatch),
    ]),
    channelId,
    handle,
    userName,
    channelUrl: canonicalChannelUrl({
      channelId,
      handle,
      userName,
      channelUrl: canonicalUrlMatch || fallback.channelUrl,
    }),
  };
}

function classifySortFromChipLabel(labelValue) {
  const label = String(labelValue || "").trim().toLowerCase();
  if (!label) {
    return "";
  }
  if (label.includes("popular")) {
    return "popular";
  }
  if (label.includes("najstars") || label.includes("oldest")) {
    return "oldest";
  }
  if (label.includes("najnows") || label.includes("newest") || label.includes("latest")) {
    return "newest";
  }
  return "";
}

function sortContinuationTokens(data) {
  const chips = [];
  collectByKey(data, "chipViewModel", chips);
  const tokens = {};
  chips.forEach((chip) => {
    const mode = classifySortFromChipLabel(chip && chip.text);
    const token = String(
      chip &&
      chip.tapCommand &&
      chip.tapCommand.innertubeCommand &&
      chip.tapCommand.innertubeCommand.continuationCommand &&
      chip.tapCommand.innertubeCommand.continuationCommand.token ||
      ""
    ).trim();
    if (mode && token && !tokens[mode]) {
      tokens[mode] = token;
    }
  });
  return tokens;
}

function innertubeSettings(htmlText) {
  const source = String(htmlText || "");
  return {
    apiKey: String((source.match(/"INNERTUBE_API_KEY":"([^"]+)"/) || [])[1] || "").trim(),
    clientVersion: String((source.match(/"INNERTUBE_CLIENT_VERSION":"([^"]+)"/) || [])[1] || "").trim(),
    hl: String((source.match(/"HL":"([^"]+)"/) || [])[1] || "pl").trim() || "pl",
    gl: String((source.match(/"GL":"([^"]+)"/) || [])[1] || "PL").trim() || "PL",
  };
}

async function browseByContinuation(settings, continuationToken) {
  const apiKey = String(settings && settings.apiKey || "").trim();
  const token = String(continuationToken || "").trim();
  if (!apiKey || !token) {
    return null;
  }
  return fetchJson(
    withYouTubeLocaleUrl(`https://www.youtube.com/youtubei/v1/browse?key=${encodeURIComponent(apiKey)}&prettyPrint=false`),
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": YT_USER_AGENT,
        "Accept-Language": YT_ACCEPT_LANGUAGE,
      },
      body: JSON.stringify({
        context: {
          client: {
            clientName: "WEB",
            clientVersion: String(settings.clientVersion || "").trim() || "2.20260101.00.00",
            hl: String(settings.hl || "").trim() || "pl",
            gl: String(settings.gl || "").trim() || "PL",
          },
        },
        continuation: token,
      }),
    }
  );
}

function parseFeed(xmlText) {
  const source = String(xmlText || "").trim();
  if (!source) {
    return [];
  }
  const entries = Array.from(source.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi)).map((m) => String(m[1] || ""));
  return entries
    .map((entry) => {
      const videoId = (entry.match(/<yt:videoId\b[^>]*>([\s\S]*?)<\/yt:videoId>/i) || [])[1];
      const title = (entry.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || [])[1];
      const publishedAt = (entry.match(/<published\b[^>]*>([\s\S]*?)<\/published>/i) || [])[1];
      const views = (entry.match(/<media:statistics\b[^>]*views=["']([^"']+)["']/i) || [])[1];
      const cleanId = String(videoId || "").trim();
      if (!cleanId) {
        return null;
      }
      return {
        id: cleanId,
        title: String(title || "Bez tytulu").trim() || "Bez tytulu",
        videoId: cleanId,
        url: `https://www.youtube.com/watch?v=${encodeURIComponent(cleanId)}`,
        thumbnailUrl: "",
        description: "",
        publishedAt: String(publishedAt || "").trim(),
        updatedAt: String(publishedAt || "").trim(),
        publishedMs: formatDateMs(publishedAt),
        views: parseCount(views),
      };
    })
    .filter(Boolean);
}

async function loadFromWebOrRss(reference, sortMode, limit) {
  const mode = normalizeSortMode(sortMode);
  const safeLimit = clampInt(limit, 1, YT_MAX_RESULTS, YT_DEFAULT_LIMIT);
  const baseUrl = canonicalChannelUrl(reference);
  const videosUrl = withYouTubeLocaleUrl(`${baseUrl.replace(/\/+$/, "")}/videos?view=0&sort=dd&flow=grid`);

  try {
    const html = await fetchText(videosUrl);
    const raw = extractJsonObjectAfterToken(html, "var ytInitialData =") || extractJsonObjectAfterToken(html, "ytInitialData =");
    if (raw) {
      const data = JSON.parse(raw);
      const dataMeta = channelMetaFromInitialData(data, reference);
      const htmlMeta = channelMetaFromHtml(html, reference);
      const meta = {
        name: firstNonEmptyString(dataMeta.name, htmlMeta.name),
        description: firstNonEmptyString(dataMeta.description, htmlMeta.description),
        avatarUrl: firstNonEmptyString(dataMeta.avatarUrl, htmlMeta.avatarUrl),
        subscribersText: firstNonEmptyString(dataMeta.subscribersText, htmlMeta.subscribersText),
        channelId: firstNonEmptyString(dataMeta.channelId, htmlMeta.channelId, reference.channelId),
        handle: firstNonEmptyString(dataMeta.handle, htmlMeta.handle, reference.handle),
        userName: firstNonEmptyString(dataMeta.userName, htmlMeta.userName, reference.userName),
        channelUrl: firstNonEmptyString(dataMeta.channelUrl, htmlMeta.channelUrl, canonicalChannelUrl(reference)),
      };
      const needsAdditionalMeta = !meta.subscribersText || !meta.avatarUrl || !meta.description || !meta.name;
      if (needsAdditionalMeta) {
        const infoUrl = canonicalChannelUrl({
          channelId: meta.channelId || reference.channelId,
          handle: meta.handle || reference.handle,
          userName: meta.userName || reference.userName,
          channelUrl: meta.channelUrl || reference.channelUrl,
        });
        if (infoUrl) {
          try {
            const infoHtml = await fetchText(infoUrl);
            const infoMeta = channelMetaFromHtml(infoHtml, {
              channelId: meta.channelId || reference.channelId,
              handle: meta.handle || reference.handle,
              userName: meta.userName || reference.userName,
              channelUrl: infoUrl,
            });
            meta.name = firstNonEmptyString(meta.name, infoMeta.name);
            meta.description = firstNonEmptyString(meta.description, infoMeta.description);
            meta.avatarUrl = firstNonEmptyString(meta.avatarUrl, infoMeta.avatarUrl);
            meta.subscribersText = firstNonEmptyString(meta.subscribersText, infoMeta.subscribersText);
            meta.channelId = firstNonEmptyString(meta.channelId, infoMeta.channelId, reference.channelId);
            meta.handle = firstNonEmptyString(meta.handle, infoMeta.handle, reference.handle);
            meta.userName = firstNonEmptyString(meta.userName, infoMeta.userName, reference.userName);
            meta.channelUrl = firstNonEmptyString(meta.channelUrl, infoMeta.channelUrl, infoUrl);
          } catch (_error) {
            // Keep already collected metadata.
          }
        }
      }
      const tokens = sortContinuationTokens(data);
      const continuationToken = String(tokens[mode] || "").trim();
      const settings = innertubeSettings(html);

      let continuationUsed = false;
      let videos = videosFromRendererData(data);
      if (continuationToken) {
        try {
          const continuationPayload = await browseByContinuation(settings, continuationToken);
          const continuationVideos = videosFromRendererData(continuationPayload);
          if (continuationVideos.length) {
            videos = continuationVideos;
            continuationUsed = true;
          }
        } catch (_error) {
          // Keep initial list.
        }
      }
      if (continuationToken && !continuationUsed && mode !== "newest") {
        // For popular/oldest we rely on dedicated sorted continuation payload.
        videos = [];
      }

      const videosOut = (continuationUsed ? videos : sortVideos(videos, mode)).slice(0, safeLimit);
      if (videosOut.length) {
        const metaChannelId = normalizeChannelId(meta.channelId);
        const metaHandle = normalizeHandle(meta.handle);
        const metaUserName = normalizeUserName(meta.userName);
        return {
          ok: true,
          source: continuationUsed ? "youtube-web-sorted-fallback" : "youtube-web-fallback",
          channel: {
            name: firstNonEmptyString(meta.name, normalizeHandle(reference.handle), normalizeChannelId(reference.channelId), "Kanal YouTube"),
            channelId: metaChannelId || normalizeChannelId(reference.channelId),
            handle: metaHandle || normalizeHandle(reference.handle),
            userName: metaUserName || normalizeUserName(reference.userName),
            channelUrl: canonicalChannelUrl({
              channelId: metaChannelId || reference.channelId,
              handle: metaHandle || reference.handle,
              userName: metaUserName || reference.userName,
              channelUrl: meta.channelUrl || reference.channelUrl,
            }),
            subscribersText: firstNonEmptyString(meta.subscribersText),
            description: firstNonEmptyString(meta.description),
            avatarUrl: firstNonEmptyString(meta.avatarUrl),
            sortMode: mode,
            videos: videosOut,
          },
        };
      }
    }
  } catch (_error) {
    // Continue to RSS fallback.
  }

  const feedUrls = [];
  const channelId = normalizeChannelId(reference.channelId);
  const userName = normalizeUserName(reference.userName) || normalizeUserName(normalizeHandle(reference.handle).replace(/^@+/, ""));
  let fallbackHtmlMeta = null;
  const canonicalUrl = canonicalChannelUrl(reference);
  if (canonicalUrl) {
    try {
      const channelHtml = await fetchText(canonicalUrl);
      fallbackHtmlMeta = channelMetaFromHtml(channelHtml, reference);
    } catch (_error) {
      fallbackHtmlMeta = null;
    }
  }
  if (channelId) {
    feedUrls.push(`https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`);
  }
  if (userName) {
    feedUrls.push(`https://www.youtube.com/feeds/videos.xml?user=${encodeURIComponent(userName)}`);
  }
  const unique = Array.from(new Set(feedUrls));
  for (const feedUrl of unique) {
    try {
      const xml = await fetchText(feedUrl);
      const videos = sortVideos(parseFeed(xml), mode).slice(0, safeLimit);
      if (videos.length) {
        return {
          ok: true,
          source: "youtube-rss-fallback",
          channel: {
            name: firstNonEmptyString(
              fallbackHtmlMeta && fallbackHtmlMeta.name,
              normalizeHandle(reference.handle),
              normalizeChannelId(reference.channelId),
              "Kanal YouTube"
            ),
            channelId: normalizeChannelId((fallbackHtmlMeta && fallbackHtmlMeta.channelId) || "") || channelId,
            handle: normalizeHandle((fallbackHtmlMeta && fallbackHtmlMeta.handle) || "") || normalizeHandle(reference.handle),
            userName: normalizeUserName((fallbackHtmlMeta && fallbackHtmlMeta.userName) || "") || userName,
            channelUrl: canonicalChannelUrl(reference),
            subscribersText: firstNonEmptyString(fallbackHtmlMeta && fallbackHtmlMeta.subscribersText),
            description: firstNonEmptyString(fallbackHtmlMeta && fallbackHtmlMeta.description),
            avatarUrl: firstNonEmptyString(fallbackHtmlMeta && fallbackHtmlMeta.avatarUrl),
            sortMode: mode,
            videos,
          },
        };
      }
    } catch (_error) {
      // Try next feed url.
    }
  }
  throw new Error("YOUTUBE_WEB_AND_RSS_FAILED");
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
  const sortMode = normalizeSortMode(url.searchParams.get("sort"));
  const visibleLimit = clampInt(url.searchParams.get("limit"), 1, YT_MAX_RESULTS, YT_DEFAULT_LIMIT);
  const parsedFromUrl = parseChannelReference(url.searchParams.get("channelUrl") || "");
  const parsedChannelId = normalizeChannelId(parsedFromUrl && parsedFromUrl.channelId);
  const parsedHandle = normalizeHandle(parsedFromUrl && parsedFromUrl.handle);
  const parsedUserName = normalizeUserName(parsedFromUrl && parsedFromUrl.userName);
  let requestedChannelId = normalizeChannelId(url.searchParams.get("channelId")) || parsedChannelId;
  const requestedHandle = normalizeHandle(url.searchParams.get("handle")) || parsedHandle;
  const requestedUserName = normalizeUserName(url.searchParams.get("userName")) || parsedUserName;
  if ((requestedHandle || requestedUserName) && !parsedChannelId) {
    requestedChannelId = "";
  }
  const reference = {
    channelId: requestedChannelId,
    handle: requestedHandle,
    userName: requestedUserName,
    channelUrl: String(url.searchParams.get("channelUrl") || "").trim(),
  };

  if (!hasReference(reference)) {
    sendJson(res, { ok: false, error: "YOUTUBE_CHANNEL_REFERENCE_REQUIRED" }, 400);
    return;
  }

  const key = cacheKey(reference, sortMode, visibleLimit);
  const cached = getFromCache(key);
  if (cached) {
    sendJson(res, cached);
    return;
  }

  try {
    const payload = await loadFromWebOrRss(reference, sortMode, visibleLimit);
    putInCache(key, payload, sortMode);
    sendJson(res, payload);
    return;
  } catch (error) {
    sendJson(res, { ok: false, error: String(error && error.message || "YOUTUBE_REQUEST_FAILED") }, 502);
  }
};
