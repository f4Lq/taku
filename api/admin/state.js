const { createRedisClient } = require('../_lib/redis.js');
const { getRequestUrl, getSafeInt, readJsonBody, sendJson, sendOptions } = require('../_lib/http.js');

const ADMIN_STATE_DATA_KEY = 'admin:state:data';
const ADMIN_STATE_UPDATED_AT_KEY = 'admin:state:updated_at';
const ADMIN_STATE_MEMORY_SYMBOL = Symbol.for('takuu.admin_state.memory_store.v1');

function getAdminStateMemoryStore() {
  const scope = globalThis;
  if (!scope[ADMIN_STATE_MEMORY_SYMBOL]) {
    scope[ADMIN_STATE_MEMORY_SYMBOL] = {
      state: null,
      updatedAt: 0,
    };
  }
  return scope[ADMIN_STATE_MEMORY_SYMBOL];
}

function toSafeJsonValue(value, fallback) {
  try {
    if (value == null) {
      return fallback;
    }
    return JSON.parse(JSON.stringify(value));
  } catch (_error) {
    return fallback;
  }
}

function normalizeStringList(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => String(item || '').trim())
    .filter(Boolean);
}

function normalizeAdminState(rawState) {
  const source =
    rawState && typeof rawState === 'object' && !Array.isArray(rawState)
      ? rawState
      : {};

  return {
    accounts: Array.isArray(source.accounts) ? toSafeJsonValue(source.accounts, []) : [],
    baseMemberOverrides: toSafeJsonValue(source.baseMemberOverrides, {}),
    customMembers: Array.isArray(source.customMembers) ? toSafeJsonValue(source.customMembers, []) : [],
    membersOrder: normalizeStringList(source.membersOrder),
    karyCennikItems: Array.isArray(source.karyCennikItems) ? toSafeJsonValue(source.karyCennikItems, []) : [],
    timeryConfig: toSafeJsonValue(source.timeryConfig, {}),
    licznikiConfig: toSafeJsonValue(source.licznikiConfig, {}),
  };
}

function parseStoredState(rawValue) {
  const text = String(rawValue ?? '').trim();
  if (!text) {
    return null;
  }

  try {
    return normalizeAdminState(JSON.parse(text));
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
  const useRedis = Boolean(redis);
  const memoryStore = useRedis ? null : getAdminStateMemoryStore();

  try {
    if (method === 'GET') {
      const url = getRequestUrl(req);
      const afterUpdatedAt = Math.max(0, getSafeInt(url.searchParams.get('after'), 0));

      let state = null;
      let updatedAt = 0;
      if (useRedis) {
        const [rawState, rawUpdatedAt] = await redis.pipeline([
          ['GET', ADMIN_STATE_DATA_KEY],
          ['GET', ADMIN_STATE_UPDATED_AT_KEY],
        ]);
        state = parseStoredState(rawState);
        updatedAt = Math.max(0, getSafeInt(rawUpdatedAt, 0));
      } else {
        state = memoryStore && memoryStore.state ? normalizeAdminState(memoryStore.state) : null;
        updatedAt = Math.max(0, getSafeInt(memoryStore?.updatedAt, 0));
      }

      if (afterUpdatedAt > 0 && updatedAt > 0 && updatedAt <= afterUpdatedAt) {
        sendJson(res, {
          ok: true,
          changed: false,
          updatedAt,
          state: null,
          serverTime: Date.now(),
          storage: useRedis ? 'redis' : 'memory',
        });
        return;
      }

      sendJson(res, {
        ok: true,
        changed: Boolean(state),
        updatedAt,
        state,
        serverTime: Date.now(),
        storage: useRedis ? 'redis' : 'memory',
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
    const nextState = normalizeAdminState(payload.state);

    if (useRedis) {
      await redis.pipeline([
        ['SET', ADMIN_STATE_DATA_KEY, JSON.stringify(nextState)],
        ['SET', ADMIN_STATE_UPDATED_AT_KEY, now],
      ]);
    } else {
      memoryStore.state = nextState;
      memoryStore.updatedAt = now;
    }

    sendJson(res, {
      ok: true,
      updatedAt: now,
      state: nextState,
      storage: useRedis ? 'redis' : 'memory',
    });
  } catch (error) {
    sendJson(
      res,
      {
        ok: false,
        error: `ADMIN_STATE_API_ERROR: ${String(error?.message || 'request_failed')}`,
      },
      500
    );
  }
};
