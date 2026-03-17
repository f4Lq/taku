const { createRedisClient } = require("./_lib/redis.js");
const { sendJson, sendOptions } = require("./_lib/http.js");

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
        service: "takuu-live-api",
        error: "MISSING_KV_REST_ENV",
        env: {
          KV_REST_API_URL: Boolean(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL),
          KV_REST_API_TOKEN: Boolean(process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN),
          KICK_CHANNEL_SLUG: Boolean(process.env.KICK_CHANNEL_SLUG),
        },
        timestamp: new Date().toISOString(),
      },
      500
    );
    return;
  }

  try {
    const [ping, syncCountRaw, statsCountRaw, adminStateUpdatedAtRaw, karyStateUpdatedAtRaw, karyStatsUpdatedAtRaw] = await redis.pipeline([
      ["PING"],
      ["LLEN", "wheel:sync:events"],
      ["LLEN", "wheel:stats:history"],
      ["GET", "admin:state:updated_at"],
      ["GET", "kary:state:updated_at"],
      ["GET", "kary:stats:updated_at"],
    ]);

    sendJson(res, {
      ok: true,
      service: "takuu-live-api",
      redis: {
        ping: String(ping || "").toUpperCase() === "PONG",
      },
      counters: {
        syncEvents: Math.max(0, Number.parseInt(String(syncCountRaw || "0"), 10) || 0),
        statsHistory: Math.max(0, Number.parseInt(String(statsCountRaw || "0"), 10) || 0),
      },
      state: {
        adminUpdatedAt: Math.max(0, Number.parseInt(String(adminStateUpdatedAtRaw || "0"), 10) || 0),
        karyUpdatedAt: Math.max(0, Number.parseInt(String(karyStateUpdatedAtRaw || "0"), 10) || 0),
        karyStatsUpdatedAt: Math.max(0, Number.parseInt(String(karyStatsUpdatedAtRaw || "0"), 10) || 0),
      },
      env: {
        KICK_CHANNEL_SLUG: String(process.env.KICK_CHANNEL_SLUG || "takuu").trim() || "takuu",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    sendJson(
      res,
      {
        ok: false,
        service: "takuu-live-api",
        error: `HEALTHCHECK_FAILED: ${String(error?.message || "unknown_error")}`,
        timestamp: new Date().toISOString(),
      },
      500
    );
  }
};