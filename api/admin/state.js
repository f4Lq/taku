const { createRedisClient } = require("../_lib/redis.js");
const { getRequestUrl, getSafeInt, readJsonBody, sendJson, sendOptions } = require("../_lib/http.js");

const ADMIN_STATE_DATA_KEY_PREFIX = 'admin:state:data';
const ADMIN_STATE_UPDATED_AT_KEY_PREFIX = 'admin:state:updated_at';

function sanitizeScopeSegment(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, '')
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

function resolveAdminStateScope(url, requestHeaders = {}) {
  const requestHost = String(requestHeaders['x-forwarded-host'] || requestHeaders.host || '').trim();
  const urlHost = String(url?.hostname || '').trim();
  let hostScope = sanitizeScopeSegment(urlHost || requestHost || 'default');
  if (hostScope.startsWith('www.')) {
    hostScope = hostScope.slice(4);
  }
  if (hostScope === '127.0.0.1' || hostScope === '::1') {
    hostScope = 'localhost';
  }
  return hostScope || 'default';
}

function buildScopedKey(prefix, scope) {
  const safePrefix = String(prefix || '').trim() || 'admin:state';
  const safeScope = sanitizeScopeSegment(scope || 'default') || 'default';
  return `${safePrefix}:${safeScope}`;
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

  const membersSource = Array.isArray(source.cciMembers)
    ? source.cciMembers
    : Array.isArray(source.customMembers)
      ? source.customMembers
      : [];
  const normalizedMembers = Array.isArray(membersSource) ? toSafeJsonValue(membersSource, []) : [];

  const incomingOrder = normalizeStringList(source.membersOrder);
  const membersOrder = incomingOrder.length
    ? incomingOrder
    : normalizedMembers
        .map((entry) => String(entry && entry.id ? entry.id : '').trim())
        .filter(Boolean);

  const licznikiConfigRaw =
    source.licznikiConfig && typeof source.licznikiConfig === 'object' && !Array.isArray(source.licznikiConfig)
      ? toSafeJsonValue(source.licznikiConfig, {})
      : {};
  const licznikiItemsFromConfig = Array.isArray(licznikiConfigRaw.items)
    ? licznikiConfigRaw.items
    : Array.isArray(licznikiConfigRaw.licznikiItems)
      ? licznikiConfigRaw.licznikiItems
      : Array.isArray(licznikiConfigRaw.entries)
        ? licznikiConfigRaw.entries
        : null;
  const hasExplicitLicznikiItems =
    Array.isArray(source.licznikiItems) || Array.isArray(licznikiItemsFromConfig);
  const licznikiItemsSource = Array.isArray(source.licznikiItems)
    ? source.licznikiItems
    : Array.isArray(licznikiItemsFromConfig)
      ? licznikiItemsFromConfig
      : [];
  const normalizedLicznikiItems = Array.isArray(licznikiItemsSource)
    ? toSafeJsonValue(licznikiItemsSource, [])
    : [];
  if (hasExplicitLicznikiItems) {
    licznikiConfigRaw.items = normalizedLicznikiItems;
  }

  return {
    accounts: Array.isArray(source.accounts) ? toSafeJsonValue(source.accounts, []) : [],
    baseMemberOverrides: toSafeJsonValue(source.baseMemberOverrides, {}),
    cciMembers: normalizedMembers,
    customMembers: normalizedMembers,
    membersOrder,
    karyTimerDefinitions: Array.isArray(source.karyTimerDefinitions) ? toSafeJsonValue(source.karyTimerDefinitions, []) : [],
    karyCounterDefinitions: Array.isArray(source.karyCounterDefinitions) ? toSafeJsonValue(source.karyCounterDefinitions, []) : [],
    karyCennikItems: Array.isArray(source.karyCennikItems) ? toSafeJsonValue(source.karyCennikItems, []) : [],
    timeryConfig: toSafeJsonValue(source.timeryConfig, {}),
    licznikiItems: normalizedLicznikiItems,
    licznikiConfig: licznikiConfigRaw,
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
  const url = getRequestUrl(req);
  const scope = resolveAdminStateScope(url, req && req.headers ? req.headers : {});
  const ADMIN_STATE_DATA_KEY = buildScopedKey(ADMIN_STATE_DATA_KEY_PREFIX, scope);
  const ADMIN_STATE_UPDATED_AT_KEY = buildScopedKey(ADMIN_STATE_UPDATED_AT_KEY_PREFIX, scope);
  if (method === 'OPTIONS') {
    sendOptions(res);
    return;
  }
  if (method !== 'GET' && method !== 'POST') {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    sendJson(res, { ok: false, error: 'METHOD_NOT_ALLOWED' }, 405);
    return;
  }

  const redis = createRedisClient({ allowMemoryFallback: false });
  if (!redis) {
    sendJson(
      res,
      {
        ok: false,
        error: 'MISSING_KV_REST_ENV',
        requiredEnv: ['KV_REST_API_URL', 'KV_REST_API_TOKEN'],
        optionalAliases: ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'],
      },
      500
    );
    return;
  }

  try {
    if (method === 'GET') {
      const afterUpdatedAt = Math.max(0, getSafeInt(url.searchParams.get('after'), 0));

      const [rawState, rawUpdatedAt] = await redis.pipeline([
        ['GET', ADMIN_STATE_DATA_KEY],
        ['GET', ADMIN_STATE_UPDATED_AT_KEY],
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
          scope,
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
        scope,
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

    await redis.pipeline([
      ['SET', ADMIN_STATE_DATA_KEY, JSON.stringify(nextState)],
      ['SET', ADMIN_STATE_UPDATED_AT_KEY, now],
    ]);

    sendJson(res, {
      ok: true,
      updatedAt: now,
      state: nextState,
      storage: 'redis',
      scope,
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
