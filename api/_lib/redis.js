const DEFAULT_TIMEOUT_MS = 10000;

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
    return null;
  }

  return {
    async command(...parts) {
      return runCommand(config, parts);
    },
    async pipeline(commands) {
      return runPipeline(config, commands);
    },
  };
}

module.exports = {
  createRedisClient,
  resolveRedisConfig,
};
