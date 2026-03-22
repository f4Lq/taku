const DEFAULT_TIMEOUT_MS = 10000;
const MEMORY_STORE_GLOBAL_KEY = "__TAKUU_WHEEL_MEMORY_KV__";

function readEnv(...names) {
  for (const name of names) {
    const value = String(process.env[name] || "").trim();
    if (value) {
      return value;
    }
  }
  return "";
}

function resolveRedisConfig() {
  const url = readEnv("KV_REST_API_URL", "UPSTASH_REDIS_REST_URL");
  const token = readEnv("KV_REST_API_TOKEN", "UPSTASH_REDIS_REST_TOKEN");
  if (!url || !token) {
    return null;
  }
  return {
    url: url.replace(/\/+$/, ""),
    token,
  };
}

function normalizeCommandPart(part, index) {
  if (index === 0) {
    return String(part ?? "").trim().toUpperCase();
  }
  if (part === undefined || part === null) {
    return "";
  }
  if (typeof part === "string" || typeof part === "number") {
    return part;
  }
  if (typeof part === "boolean") {
    return part ? "1" : "0";
  }
  return JSON.stringify(part);
}

function normalizeCommand(command) {
  if (!Array.isArray(command) || command.length === 0) {
    throw new Error("INVALID_REDIS_COMMAND");
  }
  return command.map((part, index) => normalizeCommandPart(part, index));
}

function safeParseInt(value, fallback = 0) {
  const parsed = Number.parseInt(String(value ?? "").trim(), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function createMemoryStore() {
  return {
    data: new Map(),
  };
}

function getMemoryStore() {
  const scope = globalThis;
  if (!scope[MEMORY_STORE_GLOBAL_KEY]) {
    scope[MEMORY_STORE_GLOBAL_KEY] = createMemoryStore();
  }
  return scope[MEMORY_STORE_GLOBAL_KEY];
}

function getTypedEntry(store, key, type, createIfMissing = false) {
  const normalizedKey = String(key ?? "");
  const existing = store.data.get(normalizedKey);
  if (existing && existing.type === type) {
    return existing;
  }
  if (!createIfMissing) {
    return null;
  }
  const entry = {
    type,
    value: type === "set" ? new Set() : type === "list" ? [] : "",
  };
  store.data.set(normalizedKey, entry);
  return entry;
}

function normalizeRangeBounds(startRaw, stopRaw, length) {
  const startBase = safeParseInt(startRaw, 0);
  const stopBase = safeParseInt(stopRaw, -1);
  const start = startBase < 0 ? length + startBase : startBase;
  const stop = stopBase < 0 ? length + stopBase : stopBase;
  const clampedStart = Math.max(0, start);
  const clampedStop = Math.min(length - 1, stop);
  return {
    start: clampedStart,
    stop: clampedStop,
    isEmpty: clampedStart > clampedStop || clampedStart >= length || clampedStop < 0,
  };
}

function runMemoryCommand(store, commandParts) {
  const parts = normalizeCommand(commandParts);
  const op = String(parts[0] || "").toUpperCase();

  if (op === "PING") {
    return "PONG";
  }

  if (op === "GET") {
    const entry = getTypedEntry(store, parts[1], "string", false);
    return entry ? String(entry.value) : null;
  }

  if (op === "SET") {
    const entry = getTypedEntry(store, parts[1], "string", true);
    entry.value = String(parts[2] ?? "");
    return "OK";
  }

  if (op === "INCR") {
    const entry = getTypedEntry(store, parts[1], "string", true);
    const current = safeParseInt(entry.value, 0);
    const next = current + 1;
    entry.value = String(next);
    return next;
  }

  if (op === "DEL") {
    let removed = 0;
    parts.slice(1).forEach((key) => {
      if (store.data.delete(String(key ?? ""))) {
        removed += 1;
      }
    });
    return removed;
  }

  if (op === "LLEN") {
    const entry = getTypedEntry(store, parts[1], "list", false);
    return entry ? entry.value.length : 0;
  }

  if (op === "LRANGE") {
    const entry = getTypedEntry(store, parts[1], "list", false);
    const list = entry ? entry.value : [];
    const range = normalizeRangeBounds(parts[2], parts[3], list.length);
    if (range.isEmpty) {
      return [];
    }
    return list.slice(range.start, range.stop + 1);
  }

  if (op === "LTRIM") {
    const entry = getTypedEntry(store, parts[1], "list", true);
    const list = entry.value;
    const range = normalizeRangeBounds(parts[2], parts[3], list.length);
    if (range.isEmpty) {
      list.splice(0, list.length);
      return "OK";
    }
    const next = list.slice(range.start, range.stop + 1);
    list.splice(0, list.length, ...next);
    return "OK";
  }

  if (op === "LPUSH") {
    const entry = getTypedEntry(store, parts[1], "list", true);
    const list = entry.value;
    parts.slice(2).forEach((value) => {
      list.unshift(String(value ?? ""));
    });
    return list.length;
  }

  if (op === "RPUSH") {
    const entry = getTypedEntry(store, parts[1], "list", true);
    const list = entry.value;
    parts.slice(2).forEach((value) => {
      list.push(String(value ?? ""));
    });
    return list.length;
  }

  if (op === "SADD") {
    const entry = getTypedEntry(store, parts[1], "set", true);
    const valueSet = entry.value;
    let added = 0;
    parts.slice(2).forEach((value) => {
      const normalized = String(value ?? "");
      if (!valueSet.has(normalized)) {
        valueSet.add(normalized);
        added += 1;
      }
    });
    return added;
  }

  throw new Error(`UNSUPPORTED_MEMORY_REDIS_COMMAND: ${op}`);
}

function createMemoryRedisClient() {
  const store = getMemoryStore();
  return {
    __kind: "memory",
    async command(...parts) {
      return runMemoryCommand(store, parts);
    },
    async pipeline(commands) {
      if (!Array.isArray(commands) || commands.length === 0) {
        return [];
      }
      return commands.map((command) => runMemoryCommand(store, command));
    },
  };
}

async function postJson(url, token, payload, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (error) {
    throw new Error(`KV_REQUEST_FAILED: ${String(error?.message || "fetch_error")}`);
  } finally {
    clearTimeout(timeout);
  }

  let json;
  let text = "";
  try {
    text = await response.text();
    json = text ? JSON.parse(text) : {};
  } catch (_error) {
    json = null;
  }

  if (!response.ok) {
    const message =
      (json && typeof json === "object" && json.error ? json.error : "") ||
      text ||
      `HTTP_${response.status}`;
    throw new Error(`KV_HTTP_ERROR_${response.status}: ${message}`);
  }

  return json;
}

async function runCommand(config, command) {
  const normalized = normalizeCommand(command);
  const payload = await postJson(config.url, config.token, normalized);
  if (payload && typeof payload === "object") {
    if (payload.error) {
      throw new Error(`KV_COMMAND_ERROR: ${String(payload.error)}`);
    }
    if (Object.prototype.hasOwnProperty.call(payload, "result")) {
      return payload.result;
    }
  }
  return payload;
}

async function runPipeline(config, commands) {
  if (!Array.isArray(commands) || commands.length === 0) {
    return [];
  }
  const normalized = commands.map((command) => normalizeCommand(command));
  const payload = await postJson(`${config.url}/pipeline`, config.token, normalized);
  if (payload && typeof payload === "object" && payload.error) {
    throw new Error(`KV_PIPELINE_ERROR: ${String(payload.error)}`);
  }

  const results = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.result)
      ? payload.result
      : [];
  return results.map((item, index) => {
    if (item && typeof item === "object" && item.error) {
      throw new Error(`KV_PIPELINE_COMMAND_${index}_ERROR: ${String(item.error)}`);
    }
    if (item && typeof item === "object" && Object.prototype.hasOwnProperty.call(item, "result")) {
      return item.result;
    }
    return item;
  });
}

function createRedisClient() {
  const config = resolveRedisConfig();
  if (!config) {
    return createMemoryRedisClient();
  }

  const memoryFallback = createMemoryRedisClient();
  let fallbackEnabled = false;
  const shouldFallbackToMemory = (error) => String(error?.message || "").toUpperCase().startsWith("KV_");

  return {
    __kind: "upstash",
    async command(...parts) {
      if (fallbackEnabled) {
        return memoryFallback.command(...parts);
      }
      try {
        return await runCommand(config, parts);
      } catch (error) {
        if (shouldFallbackToMemory(error)) {
          fallbackEnabled = true;
          return memoryFallback.command(...parts);
        }
        throw error;
      }
    },
    async pipeline(commands) {
      if (fallbackEnabled) {
        return memoryFallback.pipeline(commands);
      }
      try {
        return await runPipeline(config, commands);
      } catch (error) {
        if (shouldFallbackToMemory(error)) {
          fallbackEnabled = true;
          return memoryFallback.pipeline(commands);
        }
        throw error;
      }
    },
  };
}

module.exports = {
  createRedisClient,
  resolveRedisConfig,
};
