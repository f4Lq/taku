const { createRedisClient } = require("../_lib/redis.js");
const { getRequestUrl, getSafeInt, readJsonBody, sendJson, sendOptions } = require("../_lib/http.js");

const MAX_EVENTS = 1000;
const SYNC_EVENTS_KEY = "wheel:sync:events";
const SYNC_LAST_ID_KEY = "wheel:sync:last_id";

function normalizeString(value) {
  return String(value ?? "").trim();
}

function normalizeWinnerSyncPayload(rawPayload, fallbackTime = Date.now(), fallbackEventId = "") {
  const source = rawPayload && typeof rawPayload === "object" ? rawPayload : {};
  const winnerName = normalizeString(source.winnerName ?? source.name);
  if (!winnerName) {
    return null;
  }

  const timestamp = Math.max(1, getSafeInt(source.timestamp ?? source.time, fallbackTime));
  const sourceId = normalizeString(source.sourceId);
  const timerCandidates = [];
  if (Array.isArray(source.timerKeys)) {
    source.timerKeys.forEach((entry) => {
      const normalized = normalizeString(entry);
      if (normalized) {
        timerCandidates.push(normalized);
      }
    });
  }
  const timerKey = normalizeString(source.timerKey ?? source.timer);
  if (timerKey) {
    timerCandidates.push(timerKey);
  }
  const timerKeys = Array.from(new Set(timerCandidates));
  const minutes = Math.max(0, getSafeInt(source.minutes, 0));

  let eventId = normalizeString(source.eventId ?? source.id ?? fallbackEventId);
  if (!eventId) {
    eventId = `sync-${timestamp}-${Math.random().toString(36).slice(2, 10)}`;
  }

  return {
    type: "winner",
    eventId,
    sourceId,
    winnerName,
    timerKey: timerKeys.length ? timerKeys[0] : "",
    timerKeys,
    minutes,
    timestamp,
  };
}

function normalizeSyncPayload(rawPayload, fallbackTime = Date.now(), fallbackEventId = "") {
  if (!rawPayload || typeof rawPayload !== "object" || Array.isArray(rawPayload)) {
    return null;
  }

  const type = normalizeString(rawPayload.type).toLowerCase();
  if (type !== "winner") {
    return rawPayload;
  }

  return normalizeWinnerSyncPayload(rawPayload, fallbackTime, fallbackEventId);
}

function isConfigSyncPayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return false;
  }
  return normalizeString(payload.type).toLowerCase() === "config";
}

function parseStoredEvent(rawItem) {
  try {
    const parsed = JSON.parse(String(rawItem ?? ""));
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const id = Math.max(0, getSafeInt(parsed.id, 0));
    const time = Math.max(0, getSafeInt(parsed.time, 0));
    const payload = normalizeSyncPayload(
      parsed.payload,
      time || Date.now(),
      id > 0 ? String(id) : ""
    );
    if (id <= 0 || !payload) {
      return null;
    }

    return {
      id,
      time,
      payload,
    };
  } catch (_error) {
    return null;
  }
}

module.exports = async function handler(req, res) {
  const method = String(req.method || "GET").toUpperCase();
  if (method === "OPTIONS") {
    sendOptions(res);
    return;
  }
  if (method !== "GET" && method !== "POST") {
    res.setHeader("Allow", "GET, POST, OPTIONS");
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
        requiredEnv: ["KV_REST_API_URL", "KV_REST_API_TOKEN"],
      },
      500
    );
    return;
  }

  try {
    if (method === "GET") {
      const url = getRequestUrl(req);
      const afterRaw = url.searchParams.get("after") ?? url.searchParams.get("since") ?? "0";
      const limitRaw = url.searchParams.get("limit") ?? "100";
      const afterId = Math.max(0, getSafeInt(afterRaw, 0));
      const limit = Math.max(1, Math.min(250, getSafeInt(limitRaw, 100)));

      const [rawEvents, rawLastId] = await Promise.all([
        redis.command("LRANGE", SYNC_EVENTS_KEY, 0, MAX_EVENTS - 1),
        redis.command("GET", SYNC_LAST_ID_KEY),
      ]);

      const allEvents = (Array.isArray(rawEvents) ? rawEvents : [])
        .map((item) => parseStoredEvent(item))
        .filter(Boolean)
        .sort((a, b) => a.id - b.id);

      const filtered = allEvents.filter((eventItem) => eventItem.id > afterId);
      const events =
        afterId <= 0
          ? filtered.slice(Math.max(0, filtered.length - limit))
          : filtered.slice(0, limit);
      const lastId = Math.max(0, getSafeInt(rawLastId, 0));
      const lastReturnedId = events.length > 0 ? events[events.length - 1].id : afterId;
      let latestConfig = null;
      for (let i = allEvents.length - 1; i >= 0; i -= 1) {
        const payload = allEvents[i] && typeof allEvents[i] === "object" ? allEvents[i].payload : null;
        if (isConfigSyncPayload(payload)) {
          latestConfig = payload;
          break;
        }
      }

      sendJson(res, {
        ok: true,
        events,
        count: events.length,
        nextAfter: Math.max(0, lastReturnedId),
        hasMore: filtered.length > events.length || lastId > lastReturnedId,
        lastId,
        latestConfig,
        serverTime: Date.now(),
      });
      return;
    }

    const rawPayload = await readJsonBody(req);
    if (!rawPayload || typeof rawPayload !== "object" || Array.isArray(rawPayload)) {
      sendJson(res, { ok: false, error: "INVALID_JSON" }, 400);
      return;
    }

    const now = Date.now();
    const payload = normalizeSyncPayload(rawPayload, now);
    if (!payload) {
      sendJson(res, { ok: false, error: "INVALID_SYNC_PAYLOAD" }, 400);
      return;
    }

    const insertedId = Math.max(1, getSafeInt(await redis.command("INCR", SYNC_LAST_ID_KEY), 1));
    const event = {
      id: insertedId,
      time: now,
      payload,
    };

    await redis.pipeline([
      ["LPUSH", SYNC_EVENTS_KEY, JSON.stringify(event)],
      ["LTRIM", SYNC_EVENTS_KEY, 0, MAX_EVENTS - 1],
    ]);

    sendJson(res, {
      ok: true,
      id: insertedId,
      event,
    });
  } catch (error) {
    sendJson(
      res,
      {
        ok: false,
        error: `SYNC_API_ERROR: ${String(error?.message || "request_failed")}`,
      },
      500
    );
  }
};
