const { createRedisClient } = require("../_lib/redis.js");
const { getRequestUrl, getSafeInt, readJsonBody, sendJson, sendOptions } = require("../_lib/http.js");

const STATS_HISTORY_KEY = "wheel:stats:history";
const STATS_EVENT_KEYS_KEY = "wheel:stats:event_keys";
const STATS_UPDATED_AT_KEY = "wheel:stats:updated_at";

function normalizeName(value) {
  return String(value ?? "").trim();
}

function normalizeEventId(value) {
  const clean = String(value ?? "").trim();
  return clean || "";
}

function normalizeTimestamp(value, fallback = 0) {
  const parsed = getSafeInt(value, fallback);
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  return Math.max(0, parsed);
}

function normalizeStatsEntry(rawEntry) {
  if (!rawEntry || typeof rawEntry !== "object") {
    return null;
  }

  const name = normalizeName(rawEntry.name ?? rawEntry.winnerName);
  if (!name) {
    return null;
  }

  const time = normalizeTimestamp(rawEntry.time ?? rawEntry.timestamp, 0);
  if (time <= 0) {
    return null;
  }

  const id = normalizeEventId(rawEntry.id ?? rawEntry.eventId);
  const eventKey = id ? `id:${id}` : `time:${time}|name:${name}`;
  return {
    eventKey,
    eventId: id || null,
    name,
    time,
  };
}

function normalizeStatsEntries(rawEntries) {
  if (!Array.isArray(rawEntries)) {
    return [];
  }

  const normalized = [];
  const seen = new Set();
  rawEntries.forEach((entry) => {
    const item = normalizeStatsEntry(entry);
    if (!item || seen.has(item.eventKey)) {
      return;
    }
    seen.add(item.eventKey);
    normalized.push(item);
  });
  normalized.sort((a, b) => a.time - b.time);
  return normalized;
}

function mapStoredHistoryRow(rawItem) {
  try {
    const parsed = JSON.parse(String(rawItem ?? ""));
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const name = normalizeName(parsed.name ?? parsed.winnerName);
    const time = normalizeTimestamp(parsed.time ?? parsed.timestamp, 0);
    if (!name || time <= 0) {
      return null;
    }

    const eventId = normalizeEventId(parsed.eventId ?? parsed.id);
    const item = { name, time };
    if (eventId) {
      item.id = eventId;
    }
    return item;
  } catch (_error) {
    return null;
  }
}

function toStoredHistoryRow(entry) {
  return {
    eventId: entry.eventId || "",
    name: entry.name,
    time: entry.time,
  };
}

async function readStatsMeta(redis) {
  const [totalRaw, updatedAtRaw] = await Promise.all([
    redis.command("LLEN", STATS_HISTORY_KEY),
    redis.command("GET", STATS_UPDATED_AT_KEY),
  ]);
  return {
    total: Math.max(0, getSafeInt(totalRaw, 0)),
    updatedAt: Math.max(0, getSafeInt(updatedAtRaw, 0)),
  };
}

async function readAllHistory(redis) {
  const rawRows = await redis.command("LRANGE", STATS_HISTORY_KEY, 0, -1);
  return (Array.isArray(rawRows) ? rawRows : [])
    .map((row) => mapStoredHistoryRow(row))
    .filter(Boolean);
}

async function appendEntries(redis, entries) {
  if (!entries.length) {
    return 0;
  }

  let inserted = 0;
  for (const entry of entries) {
    const added = Math.max(
      0,
      getSafeInt(await redis.command("SADD", STATS_EVENT_KEYS_KEY, entry.eventKey), 0)
    );
    if (added > 0) {
      await redis.command("RPUSH", STATS_HISTORY_KEY, JSON.stringify(toStoredHistoryRow(entry)));
      inserted += 1;
    }
  }

  if (inserted > 0) {
    await redis.command("SET", STATS_UPDATED_AT_KEY, Date.now());
  }
  return inserted;
}

async function replaceEntries(redis, entries) {
  await redis.pipeline([
    ["DEL", STATS_HISTORY_KEY],
    ["DEL", STATS_EVENT_KEYS_KEY],
  ]);

  if (entries.length > 0) {
    const commands = [];
    entries.forEach((entry) => {
      commands.push(["SADD", STATS_EVENT_KEYS_KEY, entry.eventKey]);
      commands.push(["RPUSH", STATS_HISTORY_KEY, JSON.stringify(toStoredHistoryRow(entry))]);
    });
    await redis.pipeline(commands);
  }
  await redis.command("SET", STATS_UPDATED_AT_KEY, Date.now());
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
      const sinceTs = Math.max(0, getSafeInt(url.searchParams.get("since"), 0));
      const limit = Math.max(0, Math.min(5000, getSafeInt(url.searchParams.get("limit"), 0)));

      let history = await readAllHistory(redis);
      const meta = await readStatsMeta(redis);

      if (sinceTs > 0) {
        history = history.filter((item) => normalizeTimestamp(item.time, 0) >= sinceTs);
        if (limit > 0) {
          history = history.slice(0, limit);
        }
      } else if (limit > 0 && history.length > limit) {
        history = history.slice(history.length - limit);
      }

      sendJson(res, {
        ok: true,
        history,
        count: history.length,
        totalCount: meta.total,
        updatedAt: meta.updatedAt,
        serverTime: Date.now(),
      });
      return;
    }

    const payload = await readJsonBody(req);
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      sendJson(res, { ok: false, error: "INVALID_JSON" }, 400);
      return;
    }

    const action = String(payload.action || "append").trim().toLowerCase();
    if (action !== "append" && action !== "replace") {
      sendJson(res, { ok: false, error: "INVALID_ACTION" }, 400);
      return;
    }

    const beforeMeta = await readStatsMeta(redis);
    let changed = false;

    if (action === "replace") {
      const rawEntries = payload.history ?? payload.entries ?? [];
      const normalizedEntries = normalizeStatsEntries(rawEntries);
      await replaceEntries(redis, normalizedEntries);
      changed = true;
    } else {
      const rawEntries =
        payload.entry != null
          ? [payload.entry]
          : payload.entries ?? payload.history ?? [];
      const normalizedEntries = normalizeStatsEntries(rawEntries);
      const inserted = await appendEntries(redis, normalizedEntries);
      changed = inserted > 0;
    }

    const afterMeta = await readStatsMeta(redis);
    if (!changed && afterMeta.total !== beforeMeta.total) {
      changed = true;
    }

    sendJson(res, {
      ok: true,
      changed,
      count: afterMeta.total,
      updatedAt: afterMeta.updatedAt,
    });
  } catch (error) {
    sendJson(
      res,
      {
        ok: false,
        error: `STATS_API_ERROR: ${String(error?.message || "request_failed")}`,
      },
      500
    );
  }
};
