const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Cache-Control": "no-store",
};

function setHeader(res, name, value) {
  if (value === undefined || value === null) {
    return;
  }
  res.setHeader(name, String(value));
}

function setCorsHeaders(res, extraHeaders = {}) {
  const headers = { ...CORS_HEADERS, ...extraHeaders };
  Object.entries(headers).forEach(([name, value]) => setHeader(res, name, value));
}

function setStatus(res, statusCode) {
  if (typeof res.status === "function") {
    res.status(statusCode);
    return;
  }
  res.statusCode = statusCode;
}

function sendJson(res, payload, statusCode = 200, extraHeaders = {}) {
  setCorsHeaders(res, {
    "Content-Type": "application/json; charset=utf-8",
    ...extraHeaders,
  });
  setStatus(res, statusCode);
  res.end(JSON.stringify(payload));
}

function sendOptions(res, allowMethods = "GET, POST, OPTIONS") {
  setCorsHeaders(res, {
    "Access-Control-Allow-Methods": allowMethods,
    "Content-Length": "0",
  });
  setStatus(res, 204);
  res.end();
}

async function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    req.on("end", () => {
      resolve(Buffer.concat(chunks).toString("utf8"));
    });
    req.on("error", reject);
  });
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object" && !Array.isArray(req.body)) {
    return req.body;
  }
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch (_error) {
      return null;
    }
  }

  const raw = await readRawBody(req);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
}

function getSafeInt(value, fallback = 0) {
  const parsed = Number.parseInt(String(value ?? "").trim(), 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return parsed;
}

function getRequestUrl(req) {
  const host =
    String(req.headers["x-forwarded-host"] || req.headers.host || "localhost").trim() || "localhost";
  const proto = String(req.headers["x-forwarded-proto"] || "https").trim() || "https";
  return new URL(String(req.url || "/"), `${proto}://${host}`);
}

module.exports = {
  CORS_HEADERS,
  getRequestUrl,
  getSafeInt,
  readJsonBody,
  sendJson,
  sendOptions,
  setCorsHeaders,
};
