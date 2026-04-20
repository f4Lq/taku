const { getRequestUrl, sendJson, sendOptions } = require("../_lib/http.js");

const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";
const YOUTUBE_FETCH_MAX_RESULTS = 25;
const YOUTUBE_DEFAULT_VISIBLE_RESULTS = 5;
const YOUTUBE_USER_AGENT = "Mozilla/5.0 (TakuuVercel/1.0)";

function clampInt(rawValue, minValue, maxValue, fallbackValue) {
  const parsed = Number.parseInt(String(rawValue ?? "").trim(), 10);
  if (!Number.isFinite(parsed)) {
    return fallbackValue;
  }
  return Math.min(maxValue, Math.max(minValue, parsed));
}

function normalizeYouTubeSortMode(rawValue) {
  const clean = String(rawValue || "").trim().toLowerCase();
  if (clean === "popular") {
    return "popular";
  }
  if (clean === "oldest") {
    return "oldest";
  }
  return "newest";
}

function normalizeYouTubeChannelId(value) {
  const clean = String(value || "").trim();
  return /^UC[a-zA-Z0-9_-]{22}$/.test(clean) ? clean : "";
}

function normalizeYouTubeHandle(value) {
  const clean = String(value || "").trim();
  if (!clean) {
    return "";
  }
  const candidate = clean.startsWith("@") ? clean : `@${clean.replace(/^@+/, "")}`;
  return /^@[a-zA-Z0-9._-]{2,60}$/.test(candidate) ? candidate : "";
}

function normalizeYouTubeUserName(value) {
  const clean = String(value || "").trim();
  return /^[a-zA-Z0-9._-]{2,60}$/.test(clean) ? clean : "";
}

function parseYouTubeChannelReference(rawValue) {
  const input = String(rawValue || "").trim();
  if (!input) {
    return null;
  }

  const directId = normalizeYouTubeChannelId(input);
  if (directId) {
    return {
      channelId: directId,
      handle: "",
      userName: "",
      channelUrl: `https://www.youtube.com/channel/${directId}`,
    };
  }

  const directHandle = normalizeYouTubeHandle(input);
  if (directHandle) {
    return {
      channelId: "",
      handle: directHandle,
      userName: "",
      channelUrl: `https://www.youtube.com/${directHandle}`,
    };
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
  const isYouTubeHost =
    host === "youtube.com" ||
    host === "www.youtube.com" ||
    host === "m.youtube.com" ||
    host === "youtu.be";
  if (!isYouTubeHost) {
    return null;
  }

  const segments = String(parsed.pathname || "/")
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean);

  const channelIdFromQuery = normalizeYouTubeChannelId(parsed.searchParams.get("channel_id"));
  if (channelIdFromQuery) {
    return {
      channelId: channelIdFromQuery,
      handle: "",
      userName: "",
      channelUrl: `https://www.youtube.com/channel/${channelIdFromQuery}`,
    };
  }

  if (!segments.length) {
    return null;
  }

  const first = segments[0];
  const firstLower = first.toLowerCase();
  if (firstLower === "channel" && segments[1]) {
    const channelId = normalizeYouTubeChannelId(segments[1]);
    if (channelId) {
      return {
        channelId,
        handle: "",
        userName: "",
        channelUrl: `https://www.youtube.com/channel/${channelId}`,
      };
    }
  }

  if (firstLower === "user" && segments[1]) {
    const userName = normalizeYouTubeUserName(segments[1]);
    if (userName) {
      return {
        channelId: "",
        handle: "",
        userName,
        channelUrl: `https://www.youtube.com/user/${userName}`,
      };
    }
  }

  if (first.startsWith("@")) {
    const handle = normalizeYouTubeHandle(first);
    if (handle) {
      return {
        channelId: "",
        handle,
        userName: "",
        channelUrl: `https://www.youtube.com/${handle}`,
      };
    }
  }

  return null;
}

function buildCanonicalYouTubeChannelUrl(reference) {
  const source = reference && typeof reference === "object" ? reference : {};
  const channelId = normalizeYouTubeChannelId(source.channelId);
  if (channelId) {
    return `https://www.youtube.com/channel/${channelId}`;
  }

  const handle = normalizeYouTubeHandle(source.handle);
  if (handle) {
    return `https://www.youtube.com/${handle}`;
  }

  const userName = normalizeYouTubeUserName(source.userName);
  if (userName) {
    return `https://www.youtube.com/user/${userName}`;
  }

  const parsed = parseYouTubeChannelReference(source.channelUrl || "");
  return parsed ? parsed.channelUrl : "";
}

function pickBestThumbnail(thumbnails) {
  if (!thumbnails || typeof thumbnails !== "object") {
    return "";
  }
  const candidates = ["maxres", "standard", "high", "medium", "default"];
  for (const key of candidates) {
    const url = String((thumbnails[key] && thumbnails[key].url) || "").trim();
    if (url) {
      return url;
    }
  }
  return "";
}

function parseCountValue(rawValue) {
  if (typeof rawValue === "number" && Number.isFinite(rawValue)) {
    return Math.max(0, Math.floor(rawValue));
  }
  const digits = String(rawValue || "").replace(/\D+/g, "");
  if (!digits) {
    return null;
  }
  const parsed = Number.parseInt(digits, 10);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : null;
}

function formatSubscribersText(rawValue, hidden) {
  if (hidden) {
    return "";
  }

  const count = parseCountValue(rawValue);
  if (!Number.isFinite(count)) {
    return "";
  }

  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1).replace(".", ",")} mln subskrybentow`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(".", ",")} tys. subskrybentow`;
  }
  return `${count.toLocaleString("pl-PL")} subskrybentow`;
}

function formatDateMs(rawValue) {
  const parsed = new Date(String(rawValue || "").trim()).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

function sortYouTubeVideos(videosList, modeValue) {
  const mode = normalizeYouTubeSortMode(modeValue);
  const entries = Array.isArray(videosList) ? [...videosList] : [];

  if (mode === "oldest") {
    entries.sort((left, right) => (left.publishedMs || 0) - (right.publishedMs || 0));
    return entries;
  }

  if (mode === "popular") {
    entries.sort((left, right) => {
      const byViews = (right.views || 0) - (left.views || 0);
      if (byViews !== 0) {
        return byViews;
      }
      return (right.publishedMs || 0) - (left.publishedMs || 0);
    });
    return entries;
  }

  entries.sort((left, right) => (right.publishedMs || 0) - (left.publishedMs || 0));
  return entries;
}

async function requestYouTubeJson(pathname, params, apiKey) {
  const url = new URL(`${YOUTUBE_API_BASE_URL}/${String(pathname || "").replace(/^\/+/, "")}`);
  const sourceParams = params && typeof params === "object" ? params : {};
  Object.entries(sourceParams).forEach(([key, value]) => {
    const text = String(value || "").trim();
    if (text) {
      url.searchParams.set(key, text);
    }
  });
  url.searchParams.set("key", apiKey);

  let response = null;
  try {
    response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": YOUTUBE_USER_AGENT,
      },
      cache: "no-store",
    });
  } catch (error) {
    const wrappedError = new Error(`YOUTUBE_API_UNREACHABLE:${String(error?.message || "request_failed")}`);
    wrappedError.statusCode = 502;
    throw wrappedError;
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch (_error) {
    const wrappedError = new Error(`YOUTUBE_API_INVALID_JSON:HTTP_${response.status}`);
    wrappedError.statusCode = 502;
    throw wrappedError;
  }

  if (!response.ok) {
    const apiMessage = String(payload?.error?.message || "").trim();
    const wrappedError = new Error(
      `YOUTUBE_API_HTTP_${response.status}${apiMessage ? `:${apiMessage}` : ""}`
    );
    wrappedError.statusCode = response.status === 404 ? 404 : 502;
    throw wrappedError;
  }

  return payload;
}

async function fetchChannelById(apiKey, channelId) {
  const safeChannelId = normalizeYouTubeChannelId(channelId);
  if (!safeChannelId) {
    return null;
  }
  const payload = await requestYouTubeJson(
    "channels",
    {
      part: "snippet,statistics",
      id: safeChannelId,
      maxResults: 1,
    },
    apiKey
  );
  const items = Array.isArray(payload?.items) ? payload.items : [];
  return items[0] || null;
}

async function resolveYouTubeChannel(apiKey, reference) {
  const source = reference && typeof reference === "object" ? reference : {};
  const channelId = normalizeYouTubeChannelId(source.channelId);
  if (channelId) {
    return fetchChannelById(apiKey, channelId);
  }

  const handle = normalizeYouTubeHandle(source.handle);
  if (handle) {
    try {
      const payload = await requestYouTubeJson(
        "channels",
        {
          part: "snippet,statistics",
          forHandle: handle.replace(/^@+/, ""),
          maxResults: 1,
        },
        apiKey
      );
      const items = Array.isArray(payload?.items) ? payload.items : [];
      if (items[0]) {
        return items[0];
      }
    } catch (_error) {
      // Fallback to search below.
    }
  }

  const userName = normalizeYouTubeUserName(source.userName);
  if (userName) {
    try {
      const payload = await requestYouTubeJson(
        "channels",
        {
          part: "snippet,statistics",
          forUsername: userName,
          maxResults: 1,
        },
        apiKey
      );
      const items = Array.isArray(payload?.items) ? payload.items : [];
      if (items[0]) {
        return items[0];
      }
    } catch (_error) {
      // Continue to other resolution paths.
    }
  }

  if (handle) {
    const searchPayload = await requestYouTubeJson(
      "search",
      {
        part: "snippet",
        type: "channel",
        q: handle,
        maxResults: 1,
      },
      apiKey
    );
    const channelIdFromSearch = normalizeYouTubeChannelId(
      searchPayload?.items?.[0]?.id?.channelId
    );
    if (channelIdFromSearch) {
      return fetchChannelById(apiKey, channelIdFromSearch);
    }
  }

  return null;
}

async function fetchChannelVideos(apiKey, channelId) {
  const safeChannelId = normalizeYouTubeChannelId(channelId);
  if (!safeChannelId) {
    return [];
  }

  const searchPayload = await requestYouTubeJson(
    "search",
    {
      part: "snippet",
      channelId: safeChannelId,
      maxResults: YOUTUBE_FETCH_MAX_RESULTS,
      order: "date",
      type: "video",
    },
    apiKey
  );

  const searchItems = Array.isArray(searchPayload?.items) ? searchPayload.items : [];
  const uniqueVideoIds = Array.from(
    new Set(
      searchItems
        .map((item) => String(item?.id?.videoId || "").trim())
        .filter(Boolean)
    )
  );
  if (!uniqueVideoIds.length) {
    return [];
  }

  const videosPayload = await requestYouTubeJson(
    "videos",
    {
      part: "snippet,statistics",
      id: uniqueVideoIds.join(","),
      maxResults: uniqueVideoIds.length,
    },
    apiKey
  );

  const videoItems = Array.isArray(videosPayload?.items) ? videosPayload.items : [];
  const videoById = new Map();
  videoItems.forEach((item) => {
    const id = String(item?.id || "").trim();
    if (!id) {
      return;
    }
    videoById.set(id, item);
  });

  return uniqueVideoIds
    .map((videoId) => {
      const fromSearch = searchItems.find((item) => String(item?.id?.videoId || "").trim() === videoId) || {};
      const fromVideos = videoById.get(videoId) || {};
      const snippet = fromVideos.snippet || fromSearch.snippet || {};
      const statistics = fromVideos.statistics || {};
      const publishedAt = String(snippet.publishedAt || fromSearch?.snippet?.publishedAt || "").trim();
      const thumbnailUrl = pickBestThumbnail(snippet.thumbnails || fromSearch?.snippet?.thumbnails || {});

      return {
        id: videoId,
        title: String(snippet.title || fromSearch?.snippet?.title || "Bez tytulu").trim() || "Bez tytulu",
        videoId,
        url: `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`,
        thumbnailUrl,
        description: String(snippet.description || fromSearch?.snippet?.description || "").trim(),
        publishedAt,
        updatedAt: publishedAt,
        publishedMs: formatDateMs(publishedAt),
        views: parseCountValue(statistics.viewCount) || 0,
      };
    })
    .filter((entry) => Boolean(entry.url));
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

  const apiKey = String(
    process.env.YOUTUBE_API_KEY ||
      process.env.YOUTUBE_DATA_API_KEY ||
      ""
  ).trim();
  if (!apiKey) {
    sendJson(
      res,
      {
        ok: false,
        error: "YOUTUBE_API_KEY_MISSING",
        requiredEnv: ["YOUTUBE_API_KEY"],
        optionalAliases: ["YOUTUBE_DATA_API_KEY"],
      },
      500
    );
    return;
  }

  const url = getRequestUrl(req);
  const sortMode = normalizeYouTubeSortMode(url.searchParams.get("sort"));
  const visibleLimit = clampInt(
    url.searchParams.get("limit"),
    1,
    YOUTUBE_FETCH_MAX_RESULTS,
    YOUTUBE_DEFAULT_VISIBLE_RESULTS
  );

  const parsedFromUrl = parseYouTubeChannelReference(url.searchParams.get("channelUrl") || "");
  const reference = {
    channelId:
      normalizeYouTubeChannelId(url.searchParams.get("channelId")) ||
      normalizeYouTubeChannelId(parsedFromUrl && parsedFromUrl.channelId),
    handle:
      normalizeYouTubeHandle(url.searchParams.get("handle")) ||
      normalizeYouTubeHandle(parsedFromUrl && parsedFromUrl.handle),
    userName:
      normalizeYouTubeUserName(url.searchParams.get("userName")) ||
      normalizeYouTubeUserName(parsedFromUrl && parsedFromUrl.userName),
    channelUrl: String(url.searchParams.get("channelUrl") || "").trim(),
  };

  if (!reference.channelId && !reference.handle && !reference.userName) {
    sendJson(
      res,
      {
        ok: false,
        error: "YOUTUBE_CHANNEL_REFERENCE_REQUIRED",
        acceptedQuery: ["channelId", "handle", "userName", "channelUrl"],
      },
      400
    );
    return;
  }

  try {
    const channelPayload = await resolveYouTubeChannel(apiKey, reference);
    if (!channelPayload || typeof channelPayload !== "object") {
      sendJson(res, { ok: false, error: "YOUTUBE_CHANNEL_NOT_FOUND" }, 404);
      return;
    }

    const channelId = normalizeYouTubeChannelId(channelPayload.id);
    if (!channelId) {
      sendJson(res, { ok: false, error: "YOUTUBE_CHANNEL_ID_INVALID" }, 502);
      return;
    }

    const channelSnippet = channelPayload.snippet || {};
    const channelStats = channelPayload.statistics || {};
    const handle =
      normalizeYouTubeHandle(reference.handle) ||
      normalizeYouTubeHandle(channelSnippet.customUrl) ||
      "";
    const userName =
      normalizeYouTubeUserName(reference.userName) ||
      normalizeYouTubeUserName(String(handle || "").replace(/^@+/, "")) ||
      "";

    const videos = await fetchChannelVideos(apiKey, channelId);
    const sortedVideos = sortYouTubeVideos(videos, sortMode).slice(0, visibleLimit);

    sendJson(res, {
      ok: true,
      source: "youtube-data-api-v3",
      channel: {
        name: String(channelSnippet.title || "").trim() || "Kanal YouTube",
        channelId,
        handle,
        userName,
        channelUrl: buildCanonicalYouTubeChannelUrl({
          channelId,
          handle,
          userName,
          channelUrl: reference.channelUrl,
        }),
        subscribersText: formatSubscribersText(
          channelStats.subscriberCount,
          channelStats.hiddenSubscriberCount
        ),
        description: String(channelSnippet.description || "").trim(),
        avatarUrl: pickBestThumbnail(channelSnippet.thumbnails),
        sortMode,
        videos: sortedVideos,
      },
    });
  } catch (error) {
    const statusCode = Number.isFinite(Number(error?.statusCode))
      ? Math.max(400, Math.min(599, Number(error.statusCode)))
      : 502;
    sendJson(
      res,
      {
        ok: false,
        error: String(error?.message || "YOUTUBE_API_REQUEST_FAILED"),
      },
      statusCode
    );
  }
};
