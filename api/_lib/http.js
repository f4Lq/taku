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

function pickForwardedValue(rawValue, fallback = "") {
  const text = String(rawValue || "")
    .split(",")[0]
    .trim();
  return text || fallback;
}

function normalizeProto(rawValue) {
  const proto = pickForwardedValue(rawValue, "https").toLowerCase();
  return proto === "http" || proto === "https" ? proto : "https";
}

function normalizeHost(rawValue) {
  const candidate = pickForwardedValue(rawValue, "localhost");
  const cleaned = candidate.replace(/[^\w.\-:[\]]+/g, "");
  return cleaned || "localhost";
}

function getRequestUrl(req) {
  const headers = req && typeof req.headers === "object" && req.headers ? req.headers : {};
  const host = normalizeHost(headers["x-forwarded-host"] || headers.host || "localhost");
  const proto = normalizeProto(headers["x-forwarded-proto"] || "https");
  const path = String((req && req.url) || "/");

  try {
    return new URL(path, `${proto}://${host}`);
  } catch (_error) {
    return new URL("/", "https://localhost");
  }
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
