const { createRedisClient } = require('../../lib/redis.js');
const { getRequestUrl, getSafeInt, readJsonBody, sendJson, sendOptions } = require('../../lib/http.js');

const KARY_STATS_DATA_KEY = 'kary:stats:data';
const KARY_STATS_UPDATED_AT_KEY = 'kary:stats:updated_at';

function normalizeTimerStatsMap(rawValue) {
  if (!rawValue || typeof rawValue !== 'object' || Array.isArray(rawValue)) {
    return {};
  }

  const normalized = {};
  Object.entries(rawValue).forEach(([rawKey, rawEntry]) => {
    const key = String(rawKey || '').trim();
    if (!key) {
      return;
    }

    const source = rawEntry && typeof rawEntry === 'object' && !Array.isArray(rawEntry) ? rawEntry : {};
    const recordSeconds = Math.max(
      0,
      getSafeInt(
        source.recordSeconds != null ? source.recordSeconds : source.record,
        0
      )
    );
    const totalAddedSeconds = Math.max(
      0,
      getSafeInt(
        source.totalAddedSeconds != null ? source.totalAddedSeconds : source.totalAdded,
        0
      )
    );
    normalized[key] = {
      recordSeconds,
      totalAddedSeconds,
    };
  });

  return normalized;
}

function normalizeCounterStatsMap(rawValue) {
  if (!rawValue || typeof rawValue !== 'object' || Array.isArray(rawValue)) {
    return {};
  }

  const normalized = {};
  Object.entries(rawValue).forEach(([rawKey, rawEntry]) => {
    const key = String(rawKey || '').trim();
    if (!key) {
      return;
    }

    const source = rawEntry && typeof rawEntry === 'object' && !Array.isArray(rawEntry) ? rawEntry : {};
    const maxValue = Math.max(
      0,
      getSafeInt(
        source.maxValue != null ? source.maxValue : source.max,
        0
      )
    );
    normalized[key] = { maxValue };
  });

  return normalized;
}

function normalizeKaryStats(rawState) {
  const source = rawState && typeof rawState === 'object' && !Array.isArray(rawState) ? rawState : {};

  return {
    timers: normalizeTimerStatsMap(source.timers),
    counters: normalizeCounterStatsMap(source.counters),
  };
}

function parseStoredState(rawValue) {
  const text = String(rawValue ?? '').trim();
  if (!text) {
    return null;
  }

  try {
    return normalizeKaryStats(JSON.parse(text));
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
        ['GET', KARY_STATS_DATA_KEY],
        ['GET', KARY_STATS_UPDATED_AT_KEY],
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
    const nextState = normalizeKaryStats(payload.state);

    await redis.pipeline([
      ['SET', KARY_STATS_DATA_KEY, JSON.stringify(nextState)],
      ['SET', KARY_STATS_UPDATED_AT_KEY, now],
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
        error: `KARY_STATS_API_ERROR: ${String(error?.message || 'request_failed')}`,
      },
      500
    );
  }
};
