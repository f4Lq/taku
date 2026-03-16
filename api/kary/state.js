const { createRedisClient } = require('../../lib/redis.js');
const { getRequestUrl, getSafeInt, readJsonBody, sendJson, sendOptions } = require('../../lib/http.js');

const KARY_STATE_DATA_KEY = 'kary:state:data';
const KARY_STATE_UPDATED_AT_KEY = 'kary:state:updated_at';
function normalizeStateMap(rawValue) {
  if (!rawValue || typeof rawValue !== 'object' || Array.isArray(rawValue)) {
    return {};
  }

  const normalized = {};
  Object.entries(rawValue).forEach(([rawKey, rawNumber]) => {
    const key = String(rawKey || '').trim();
    if (!key) {
      return;
    }
    const value = Math.max(0, getSafeInt(rawNumber, 0));
    normalized[key] = value;
  });
  return normalized;
}

function normalizeKaryState(rawState, fallbackTickAt = Date.now()) {
  const source =
    rawState && typeof rawState === 'object' && !Array.isArray(rawState)
      ? rawState
      : {};

  const normalized = {
    timers: normalizeStateMap(source.timers),
    timerTotals: normalizeStateMap(source.timerTotals),
    counters: normalizeStateMap(source.counters),
    lastTickAt: Math.max(0, getSafeInt(source.lastTickAt, Math.max(0, getSafeInt(fallbackTickAt, Date.now())))),
  };

  Object.keys(normalized.timers).forEach((key) => {
    const timerValue = Math.max(0, getSafeInt(normalized.timers[key], 0));
    const totalValue = Math.max(0, getSafeInt(normalized.timerTotals[key], 0));
    normalized.timers[key] = timerValue;
    normalized.timerTotals[key] = Math.max(timerValue, totalValue);
  });

  Object.keys(normalized.timerTotals).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(normalized.timers, key)) {
      normalized.timers[key] = 0;
    }
    const timerValue = Math.max(0, getSafeInt(normalized.timers[key], 0));
    const totalValue = Math.max(0, getSafeInt(normalized.timerTotals[key], 0));
    normalized.timerTotals[key] = Math.max(timerValue, totalValue);
  });

  if (normalized.lastTickAt <= 0) {
    normalized.lastTickAt = Date.now();
  }
  return normalized;
}

function parseStoredState(rawValue) {
  const text = String(rawValue ?? '').trim();
  if (!text) {
    return null;
  }

  try {
    const parsed = JSON.parse(text);
    return normalizeKaryState(parsed);
  } catch (_error) {
    return null;
  }
}

module.exports = async function handler(req, res) {
  const method = String(req.method || 'GET').toUpperCase();
  if (method === 'OPTIONS') {
    sendOptions(res);
    return;
  }
  if (method !== 'GET' && method !== 'POST') {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    sendJson(res, { ok: false, error: 'METHOD_NOT_ALLOWED' }, 405);
    return;
  }

  const redis = createRedisClient();
  if (!redis) {
    sendJson(
      res,
      {
        ok: false,
        error: 'MISSING_KV_REST_ENV',
        requiredEnv: ['KV_REST_API_URL', 'KV_REST_API_TOKEN'],
      },
      500
    );
    return;
  }

  try {
    if (method === 'GET') {
      const url = getRequestUrl(req);
      const afterUpdatedAt = Math.max(0, getSafeInt(url.searchParams.get('after'), 0));

      const [rawState, rawUpdatedAt] = await redis.pipeline([
        ['GET', KARY_STATE_DATA_KEY],
        ['GET', KARY_STATE_UPDATED_AT_KEY],
      ]);
      const state = parseStoredState(rawState);
      const updatedAt = Math.max(0, getSafeInt(rawUpdatedAt, 0));

      if (afterUpdatedAt > 0 && updatedAt > 0 && updatedAt <= afterUpdatedAt) {
        sendJson(res, {
          ok: true,
          changed: false,
          updatedAt,
          state: null,
          serverTime: Date.now(),
          storage: 'redis',
        });
        return;
      }

      sendJson(res, {
        ok: true,
        changed: Boolean(state),
        updatedAt,
        state,
        serverTime: Date.now(),
        storage: 'redis',
      });
      return;
    }

    const payload = await readJsonBody(req);
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      sendJson(res, { ok: false, error: 'INVALID_JSON' }, 400);
      return;
    }

    const action = String(payload.action || 'set').trim().toLowerCase();
    if (action !== 'set' && action !== 'replace') {
      sendJson(res, { ok: false, error: 'INVALID_ACTION' }, 400);
      return;
    }

    const now = Date.now();
    const nextState = normalizeKaryState(payload.state, now);

    await redis.pipeline([
      ['SET', KARY_STATE_DATA_KEY, JSON.stringify(nextState)],
      ['SET', KARY_STATE_UPDATED_AT_KEY, now],
    ]);

    sendJson(res, {
      ok: true,
      updatedAt: now,
      state: nextState,
      storage: 'redis',
    });
  } catch (error) {
    sendJson(
      res,
      {
        ok: false,
        error: `KARY_STATE_API_ERROR: ${String(error?.message || 'request_failed')}`,
      },
      500
    );
  }
};
