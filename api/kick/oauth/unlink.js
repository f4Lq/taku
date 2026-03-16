const { createRedisClient } = require("../../../lib/redis.js");
const { sendJson, sendOptions } = require("../../../lib/http.js");
const { deleteKickLink } = require("../../../lib/kick-oauth.js");

module.exports = async function handler(req, res) {
  const method = String(req.method || "POST").toUpperCase();
  if (method === "OPTIONS") {
    sendOptions(res, "POST, DELETE, OPTIONS");
    return;
  }
  if (method !== "POST" && method !== "DELETE") {
    res.setHeader("Allow", "POST, DELETE, OPTIONS");
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
        requiredEnv: ["KV_REST_API_URL", "KV_REST_API_TOKEN"]
      },
      500
    );
    return;
  }

  try {
    await deleteKickLink(redis);
    sendJson(res, { ok: true, linked: false }, 200);
  } catch (error) {
    sendJson(
      res,
      {
        ok: false,
        error: `KICK_OAUTH_UNLINK_FAILED:${String(error?.message || "request_failed")}`
      },
      500
    );
  }
};
