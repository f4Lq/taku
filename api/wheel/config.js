const { createRedisClient } = require("../_lib/redis.js");
const { getSafeInt, readJsonBody, sendJson, sendOptions } = require("../_lib/http.js");

const WHEEL_CONFIG_KEY = "wheel:config:latest";
const MIN_SPIN_SPEED = 0.5;
const MAX_SPIN_SPEED = 4;
const MAX_ITEMS = 128;
const DEFAULT_COLORS = [
  "#ff6b6b",
  "#ffd93d",
  "#6bcb77",
  "#4d96ff",
  "#b983ff",
  "#ff9f1c",
  "#08bdbd",
  "#9b5de5",
  "#f15bb5",
  "#00bbf9",
];

function safeFloat(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeString(value) {
  return String(value ?? "").trim();
}

function normalizeColor(value, index = 0) {
  const clean = normalizeString(value);
  if (/^#[\da-f]{6}$/i.test(clean)) {
    return clean;
  }
  if (/^#[\da-f]{3}$/i.test(clean)) {
    return `#${clean[1]}${clean[1]}${clean[2]}${clean[2]}${clean[3]}${clean[3]}`;
  }
  return DEFAULT_COLORS[index % DEFAULT_COLORS.length];
}

function normalizeSpinSpeed(value, fallback = 1) {
  const numeric = safeFloat(value, fallback);
  const normalized = numeric > MAX_SPIN_SPEED ? numeric / 100 : numeric;
  return Math.max(MIN_SPIN_SPEED, Math.min(MAX_SPIN_SPEED, normalized));
}

function normalizeWheelItem(rawItem, index) {
  const source = rawItem && typeof rawItem === "object" ? rawItem : {};
  const name = normalizeString(source.name) || `Segment ${index + 1}`;
  const chance = Math.max(0, Math.floor(getSafeInt(source.chance, 0)));
  const minutes = Math.max(0, Math.floor(getSafeInt(source.minutes, 0)));
  const timerRaw = source.timerKey != null ? source.timerKey : source.timer;
  const timer = normalizeString(timerRaw);
  return {
    name,
    chance,
    timer: timer || null,
    minutes,
    color: normalizeColor(source.color, index),
  };
}

function normalizeWheelItems(rawItems) {
  if (!Array.isArray(rawItems)) {
    return [];
  }
  return rawItems
    .slice(0, MAX_ITEMS)
    .map((item, index) => normalizeWheelItem(item, index))
    .filter((item) => Boolean(item.name));
}

function normalizeConfigPayload(rawPayload, fallbackTime = Date.now()) {
  const source = rawPayload && typeof rawPayload === "object" ? rawPayload : {};
  const itemsSource = Array.isArray(source.items)
    ? source.items
    : (source.config && Array.isArray(source.config.items) ? source.config.items : []);
  const items = normalizeWheelItems(itemsSource);
  if (!items.length) {
    return null;
  }

  const updatedAt = Math.max(
    1,
    Math.floor(getSafeInt(source.updatedAt ?? source.timestamp ?? source.time, fallbackTime))
  );
  const spinSpeed = normalizeSpinSpeed(source.spinSpeed ?? source.speed, 1);
  const sourceId = normalizeString(source.sourceId);

  return {
    items,
    spinSpeed,
    updatedAt,
    sourceId,
  };
}

function parseStoredConfig(rawValue) {
  try {
    const parsed = JSON.parse(String(rawValue ?? ""));
    return normalizeConfigPayload(parsed);
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
      const stored = await redis.command("GET", WHEEL_CONFIG_KEY);
      const config = stored ? parseStoredConfig(stored) : null;
      sendJson(res, {
        ok: true,
        config: config || null,
        updatedAt: config ? config.updatedAt : 0,
        serverTime: Date.now(),
      });
      return;
    }

    const payload = await readJsonBody(req);
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      sendJson(res, { ok: false, error: "INVALID_JSON" }, 400);
      return;
    }

    const normalized = normalizeConfigPayload(payload, Date.now());
    if (!normalized) {
      sendJson(res, { ok: false, error: "INVALID_CONFIG_PAYLOAD" }, 400);
      return;
    }

    await redis.command("SET", WHEEL_CONFIG_KEY, JSON.stringify(normalized));

    sendJson(res, {
      ok: true,
      config: normalized,
      updatedAt: normalized.updatedAt,
      serverTime: Date.now(),
    });
  } catch (error) {
    sendJson(
      res,
      {
        ok: false,
        error: `CONFIG_API_ERROR: ${String(error?.message || "request_failed")}`,
      },
      500
    );
  }
};
