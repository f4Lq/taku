const { getRequestUrl, sendJson, sendOptions, setCorsHeaders } = require("../../lib/http.js");

const DEFAULT_CHANNEL_SLUG = "takuu";

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
  const cursor = String(url.searchParams.get("cursor") || "").trim();
  const sort = String(url.searchParams.get("sort") || "date").trim() || "date";
  const range = String(url.searchParams.get("range") || "month").trim() || "month";
  const channelSlug = String(process.env.KICK_CHANNEL_SLUG || DEFAULT_CHANNEL_SLUG).trim() || DEFAULT_CHANNEL_SLUG;

  const kickUrl = new URL(`https://kick.com/api/v2/channels/${encodeURIComponent(channelSlug)}/clips`);
  kickUrl.searchParams.set("sort", sort);
  kickUrl.searchParams.set("range", range);
  if (cursor) {
    kickUrl.searchParams.set("cursor", cursor);
  }

  let response;
  try {
    response = await fetch(kickUrl.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (TakuuVercel/1.0)",
      },
      cache: "no-store",
    });
  } catch (error) {
    sendJson(
      res,
      {
        ok: false,
        error: `Kick API unreachable: ${String(error?.message || "request_failed")}`,
      },
      502
    );
    return;
  }

  const body = await response.text();
  const contentType = response.headers.get("content-type") || "application/json; charset=utf-8";
  setCorsHeaders(res, {
    "Content-Type": contentType,
  });
  res.statusCode = response.status;
  res.end(body);
};
