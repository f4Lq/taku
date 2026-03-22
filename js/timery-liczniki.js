(function () {
  "use strict";

  const CANONICAL_REDIS_API_DOMAIN = "www.taku-live.pl";
  const LEGACY_REDIS_API_DOMAIN = "taku-live.pl";
  const CANONICAL_REDIS_API_ORIGIN = `https://${CANONICAL_REDIS_API_DOMAIN}`;
  const KARY_STATE_STORAGE_KEY = "takuu_kary_live_state";
  const KARY_STATE_SYNC_CHANNEL_NAME = "takuu-kary-state-sync";
  const KARY_TIMER_DEFINITIONS_KEY = "takuu_kary_timer_definitions";
  const KARY_COUNTER_DEFINITIONS_KEY = "takuu_kary_counter_definitions";
  const OBS_TIMERY_CONFIG_KEY = "takuu_streamobs_timery_config";
  const OBS_LICZNIKI_CONFIG_KEY = "takuu_streamobs_liczniki_config";
  const IS_FILE_PROTOCOL = window.location.protocol === "file:";
  const IS_LOCALHOST_RUNTIME = isRuntimeLocalHostName(window.location.hostname);
  const PREFER_API_CONFIG_SYNC = typeof fetch === "function";
  const POLL_INTERVAL_MS = 250;
  const RENDER_INTERVAL_MS = 250;
  const CONFIG_SYNC_INTERVAL_MS = 600;
  const ADMIN_CONFIG_SYNC_INTERVAL_MS = 1000;
  const REMOTE_STATE_STALE_RESET_MS = 4500;

  function normalizeApiOrigin(rawValue) {
    const candidate = String(rawValue || "").trim();
    if (!candidate) {
      return "";
    }
    try {
      const url = new URL(candidate);
      return `${url.protocol}//${url.host}`;
    } catch (_error) {
      return "";
    }
  }

  function getRuntimeHostName() {
    return String(window.location.hostname || "").trim().toLowerCase();
  }

  function isRuntimeLocalHostName(hostname) {
    const host = String(hostname || "").trim().toLowerCase();
    return host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "[::1]";
  }

  function isLocalApiOverrideEnabled() {
    if (window.TAKUU_USE_LOCAL_API === true) {
      return true;
    }
    try {
      const params = new URLSearchParams(window.location.search || "");
      const hasFlag = (name) => {
        const value = String(params.get(name) || "").trim().toLowerCase();
        return value === "1" || value === "true" || value === "yes" || value === "on";
      };
      return hasFlag("localApi") || hasFlag("useLocalApi") || hasFlag("localhostApi");
    } catch (_error) {
      return false;
    }
  }

  function resolveRedisApiOrigin() {
    const protocol = String(window.location.protocol || "").toLowerCase();
    const host = getRuntimeHostName();

    const explicitOrigin = normalizeApiOrigin(window.TAKUU_REDIS_API_ORIGIN || window.TAKUU_API_ORIGIN || "");
    if (explicitOrigin) {
      return explicitOrigin;
    }

    if (isRuntimeLocalHostName(host)) {
      return "";
    }

    if (protocol === "file:") {
      return CANONICAL_REDIS_API_ORIGIN;
    }
    if (host === CANONICAL_REDIS_API_DOMAIN) {
      return "";
    }
    if (host === LEGACY_REDIS_API_DOMAIN) {
      return CANONICAL_REDIS_API_ORIGIN;
    }
    return CANONICAL_REDIS_API_ORIGIN;
  }

  function buildRedisApiEndpoint(pathname) {
    const path = String(pathname || "").trim() || "/";
    const origin = resolveRedisApiOrigin();
    if (!origin) {
      return path.startsWith("/") ? path : `/${path}`;
    }
    try {
      return new URL(path.startsWith("/") ? path : `/${path}`, origin).toString();
    } catch (_error) {
      return `${CANONICAL_REDIS_API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
    }
  }

  const ADMIN_STATE_API_ENDPOINT = buildRedisApiEndpoint("/api/admin/state");
  const KARY_STATE_API_ENDPOINT = buildRedisApiEndpoint("/api/kary/state");

  function isTruthyFlag(value) {
    const normalized = String(value || "").trim().toLowerCase();
    return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
  }

  function detectObsOverlayKind() {
    const path = String(window.location.pathname || "").toLowerCase();
    let params = null;
    try {
      params = new URLSearchParams(window.location.search || "");
      const viewParam = String(params.get("view") || "").toLowerCase();
      const isTimeryPath = /(^|\/)timery(\/|$)/i.test(path);
      const isTimeryView = viewParam === "timery" || viewParam === "timers";
      const isLicznikiPath = /(^|\/)liczniki(\/|$)/i.test(path);
      const isLicznikiView = viewParam === "liczniki" || viewParam === "counters";

      if (
        (isTimeryPath || isTimeryView) &&
        (
          isTruthyFlag(params.get("timeryObs")) ||
          isTruthyFlag(params.get("obsTimers")) ||
          isTruthyFlag(params.get("timersObs"))
        )
      ) {
        return "timery";
      }

      if (
        (isLicznikiPath || isLicznikiView) &&
        (
          isTruthyFlag(params.get("licznikiObs")) ||
          isTruthyFlag(params.get("obsCounters")) ||
          isTruthyFlag(params.get("countersObs"))
        )
      ) {
        return "liczniki";
      }
    } catch (_error) {
      // Ignore URLSearchParams parse failures.
    }

    return null;
  }

  function shouldEnableLocalStateFallback() {
    try {
      const params = new URLSearchParams(window.location.search || "");
      const explicitFallback = (
        isTruthyFlag(params.get("localStateFallback")) ||
        isTruthyFlag(params.get("allowLocalFallback")) ||
        isTruthyFlag(params.get("fallbackLocalState"))
      );
      if (explicitFallback) {
        return true;
      }
    } catch (_error) {
      // Ignore URLSearchParams parse failures.
    }
    if (IS_LOCALHOST_RUNTIME) {
      return true;
    }
    if (IS_FILE_PROTOCOL) {
      return isLocalApiOverrideEnabled();
    }
    return false;
  }

  function normalizeLayout(value, fallback = "vertical") {
    const normalized = String(value || "").trim().toLowerCase();
    return normalized === "horizontal" ? "horizontal" : fallback;
  }

  function normalizeHexColor(value, fallback = "#1a1e26") {
    const normalized = String(value || "").trim();
    if (/^#[\da-f]{6}$/i.test(normalized)) {
      return normalized;
    }
    if (/^[\da-f]{6}$/i.test(normalized)) {
      return `#${normalized}`;
    }
    return fallback;
  }

  function normalizeObsOverlayConfig(rawValue, fallbackState = null) {
    const fallback =
      fallbackState && typeof fallbackState === "object"
        ? fallbackState
        : {
            layout: "vertical",
            color: "#1a1e26",
            progressColor: "#6bffc1"
          };
    const source = rawValue && typeof rawValue === "object" ? rawValue : {};
    return {
      layout: normalizeLayout(source.layout || fallback.layout || "vertical", "vertical"),
      color: normalizeHexColor(source.color || fallback.color || "#1a1e26", "#1a1e26"),
      progressColor: normalizeHexColor(source.progressColor || fallback.progressColor || "#6bffc1", "#6bffc1")
    };
  }

  function readObsTimeryConfigFromQuery(overlayKind) {
    try {
      const params = new URLSearchParams(window.location.search || "");
      const isLiczniki = overlayKind === "liczniki";
      const pickRawParam = (keys) => {
        for (const key of keys) {
          const value = String(params.get(key) || "").trim();
          if (value) {
            return value;
          }
        }
        return "";
      };

      const layoutRaw = pickRawParam(
        isLiczniki
          ? ["licznikiObsLayout", "licznikiLayout", "obsLayout"]
          : ["timeryObsLayout", "timeryLayout", "obsLayout"]
      );
      const colorRaw = pickRawParam(
        isLiczniki
          ? ["licznikiObsColor", "licznikiColor", "obsColor"]
          : ["timeryObsColor", "timeryColor", "obsColor"]
      );
      const progressColorRaw = pickRawParam(
        isLiczniki
          ? ["licznikiObsProgressColor", "licznikiProgressColor", "obsProgressColor"]
          : ["timeryObsProgressColor", "timeryProgressColor", "obsProgressColor"]
      );

      const result = {};
      if (layoutRaw) {
        result.layout = normalizeLayout(layoutRaw, "vertical");
      }
      if (colorRaw) {
        result.color = normalizeHexColor(colorRaw, "#1a1e26");
      }
      if (progressColorRaw) {
        result.progressColor = normalizeHexColor(progressColorRaw, "#6bffc1");
      }

      return result;
    } catch (_error) {
      return {};
    }
  }

  function getObsOverlayConfigStorageKey(overlayKind) {
    return overlayKind === "liczniki" ? OBS_LICZNIKI_CONFIG_KEY : OBS_TIMERY_CONFIG_KEY;
  }

  function readObsTimeryConfigFromStorage(overlayKind) {
    const storageKey = getObsOverlayConfigStorageKey(overlayKind);
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") {
        return null;
      }
      return {
        layout: normalizeLayout(parsed.layout, "vertical"),
        color: normalizeHexColor(parsed.color, "#1a1e26"),
        progressColor: normalizeHexColor(parsed.progressColor, "#6bffc1")
      };
    } catch (_error) {
      return null;
    }
  }

  function persistObsConfigToStorage(overlayKind, config) {
    const storageKey = getObsOverlayConfigStorageKey(overlayKind);
    const normalized = normalizeObsOverlayConfig(config);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(normalized));
    } catch (_error) {
      // Ignore storage write failures.
    }
  }

  function hexToRgba(hex, alpha = 0.92) {
    const normalized = normalizeHexColor(hex, "#1a1e26");
    const safeAlpha = Math.max(0, Math.min(1, Number(alpha) || 0.92));
    const raw = normalized.replace("#", "");
    const r = Number.parseInt(raw.slice(0, 2), 16);
    const g = Number.parseInt(raw.slice(2, 4), 16);
    const b = Number.parseInt(raw.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${safeAlpha})`;
  }

  function areObsConfigsEqual(leftConfig, rightConfig) {
    const left = normalizeObsOverlayConfig(leftConfig);
    const right = normalizeObsOverlayConfig(rightConfig);
    return (
      left.layout === right.layout &&
      left.color.toLowerCase() === right.color.toLowerCase() &&
      left.progressColor.toLowerCase() === right.progressColor.toLowerCase()
    );
  }

  function normalizeStateMap(rawValue) {
    if (!rawValue || typeof rawValue !== "object" || Array.isArray(rawValue)) {
      return {};
    }
    const normalized = {};
    Object.entries(rawValue).forEach(([rawKey, rawNumber]) => {
      const key = String(rawKey || "").trim();
      if (!key) {
        return;
      }
      const parsed = Math.max(0, Math.floor(Number(rawNumber) || 0));
      normalized[key] = parsed;
    });
    return normalized;
  }

  function normalizeKaryState(rawState) {
    const source = rawState && typeof rawState === "object" && !Array.isArray(rawState) ? rawState : {};
    const timers = normalizeStateMap(source.timers);
    const timerTotals = normalizeStateMap(source.timerTotals);
    const counters = normalizeStateMap(source.counters);
    const lastTickAt = Math.max(0, Math.floor(Number(source.lastTickAt) || Date.now()));
    return {
      timers,
      timerTotals,
      counters,
      lastTickAt: lastTickAt > 0 ? lastTickAt : Date.now()
    };
  }

  function readLocalKaryState() {
    try {
      const raw = window.localStorage.getItem(KARY_STATE_STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw);
      return normalizeKaryState(parsed);
    } catch (_error) {
      return null;
    }
  }

  function parseKaryStateFromRaw(rawValue) {
    const raw = String(rawValue || "").trim();
    if (!raw) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw);
      return normalizeKaryState(parsed);
    } catch (_error) {
      return null;
    }
  }

  function parseKaryStateFromMessage(rawMessage) {
    const source =
      rawMessage && typeof rawMessage === "object" && !Array.isArray(rawMessage)
        ? rawMessage
        : null;
    if (!source) {
      return null;
    }
    const type = String(source.type || "").trim().toLowerCase();
    const candidate =
      type === "kary_state" &&
      source.state &&
      typeof source.state === "object" &&
      !Array.isArray(source.state)
        ? source.state
        : source;
    const hasStateFields =
      candidate &&
      typeof candidate === "object" &&
      !Array.isArray(candidate) &&
      (
        Object.prototype.hasOwnProperty.call(candidate, "timers") ||
        Object.prototype.hasOwnProperty.call(candidate, "timerTotals") ||
        Object.prototype.hasOwnProperty.call(candidate, "counters")
      );
    if (!hasStateFields) {
      return null;
    }
    return normalizeKaryState(candidate);
  }

  function formatClock(totalSeconds) {
    const seconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [hours, minutes, secs].map((part) => String(part).padStart(2, "0")).join(":");
  }

  function clampPercent(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return 0;
    }
    return Math.max(0, Math.min(100, numeric));
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getOverlayDefinitions(overlayKind) {
    const selector =
      overlayKind === "liczniki"
        ? "#licznikiPanel [data-kary-counter], [data-kary-counter]"
        : "#timeryPanel [data-kary-timer], [data-kary-timer]";
    const sourceNodes = document.querySelectorAll(selector);
    const map = new Map();
    sourceNodes.forEach((card) => {
      const key = String(
        overlayKind === "liczniki"
          ? card.getAttribute("data-kary-counter") || ""
          : card.getAttribute("data-kary-timer") || ""
      ).trim();
      if (!key || map.has(key)) {
        return;
      }
      const label = String(card.querySelector("h3")?.textContent || key).trim();
      map.set(key, label || key);
    });
    return Array.from(map.entries()).map(([key, label]) => ({ key, label }));
  }

  function readOverlayDefinitionsFromStorage(overlayKind) {
    const storageKey = overlayKind === "liczniki" ? KARY_COUNTER_DEFINITIONS_KEY : KARY_TIMER_DEFINITIONS_KEY;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      const entries = [];
      const seen = new Set();
      parsed.forEach((entry, index) => {
        const source = entry && typeof entry === "object" ? entry : {};
        const key = String(source.key || "").trim();
        if (!key || seen.has(key)) {
          return;
        }
        seen.add(key);
        const label = String(source.label || source.name || key || `${overlayKind}-${index + 1}`).trim() || key;
        entries.push({ key, label });
      });
      return entries;
    } catch (_error) {
      return [];
    }
  }

  function collectDefinitionKeysFromState(overlayKind, state) {
    const source = state && typeof state === "object" ? state : {};
    const mapSource =
      overlayKind === "liczniki"
        ? source.counters && typeof source.counters === "object"
          ? source.counters
          : {}
        : source.timers && typeof source.timers === "object"
          ? source.timers
          : {};
    return Object.keys(mapSource)
      .map((rawKey) => String(rawKey || "").trim())
      .filter(Boolean);
  }

  function buildOverlayDefinitions(overlayKind, state) {
    const fromStorage = readOverlayDefinitionsFromStorage(overlayKind);
    const fromDom = getOverlayDefinitions(overlayKind);
    const fromStateKeys = collectDefinitionKeysFromState(overlayKind, state).map((key) => ({ key, label: key }));

    const merged = [];
    const seen = new Set();
    [fromStorage, fromDom, fromStateKeys].forEach((list) => {
      list.forEach((entry) => {
        const key = String(entry && entry.key ? entry.key : "").trim();
        if (!key || seen.has(key)) {
          return;
        }
        seen.add(key);
        const label = String(entry && entry.label ? entry.label : key).trim() || key;
        merged.push({ key, label });
      });
    });
    return merged;
  }

  function normalizeOverlayDefinitionEntry(rawEntry, overlayKind, index = 0) {
    const source = rawEntry && typeof rawEntry === "object" ? rawEntry : {};
    const key = String(source.key || "").trim();
    if (!key) {
      return null;
    }
    const defaultLabel = overlayKind === "liczniki" ? `Licznik ${index + 1}` : `Timer ${index + 1}`;
    const label = String(source.label || source.name || defaultLabel || key).trim() || key;
    return { key, label };
  }

  function normalizeOverlayDefinitions(rawEntries, overlayKind) {
    if (!Array.isArray(rawEntries)) {
      return [];
    }
    const normalized = [];
    const seen = new Set();
    rawEntries.forEach((entry, index) => {
      const next = normalizeOverlayDefinitionEntry(entry, overlayKind, index);
      if (!next || seen.has(next.key)) {
        return;
      }
      seen.add(next.key);
      normalized.push(next);
    });
    return normalized;
  }

  function getOverlayDefinitionsFromAdminState(rawState, overlayKind) {
    const source = rawState && typeof rawState === "object" && !Array.isArray(rawState) ? rawState : {};
    const rawDefinitions =
      overlayKind === "liczniki"
        ? source.karyCounterDefinitions
        : source.karyTimerDefinitions;
    return normalizeOverlayDefinitions(rawDefinitions, overlayKind);
  }

  function getOverlayDefinitionsStorageKey(overlayKind) {
    return overlayKind === "liczniki" ? KARY_COUNTER_DEFINITIONS_KEY : KARY_TIMER_DEFINITIONS_KEY;
  }

  function getOverlayDefinitionsSignature(definitions) {
    if (!Array.isArray(definitions) || !definitions.length) {
      return "";
    }
    return definitions
      .map((item) => `${String(item.key || "").trim()}:${String(item.label || "").trim()}`)
      .join("|");
  }

  const overlayKind = detectObsOverlayKind();
  if (!overlayKind) {
    return;
  }
  const ALLOW_LOCAL_STATE_FALLBACK = shouldEnableLocalStateFallback();

  const configFromStorage = readObsTimeryConfigFromStorage(overlayKind);
  const configFromQuery = readObsTimeryConfigFromQuery(overlayKind);
  let obsConfig = normalizeObsOverlayConfig(
    { ...(configFromStorage || {}), ...(configFromQuery || {}) },
    configFromStorage || configFromQuery
  );
  const overlayConfigStorageKey = getObsOverlayConfigStorageKey(overlayKind);

  let sourceState = normalizeKaryState({});
  let overlayDefinitions = buildOverlayDefinitions(overlayKind, sourceState);
  let overlayDefinitionsSignature = getOverlayDefinitionsSignature(overlayDefinitions);
  let lastRemoteUpdatedAt = 0;
  let lastRemoteStateAppliedAt = 0;
  let remoteStateHealthy = false;
  let remoteStateHasSnapshot = false;
  let karyStateChannel = null;
  let lastAdminConfigUpdatedAt = 0;
  let adminConfigApiDisabled = false;
  let lastRenderedSignature = "";

  const overlayEl = document.createElement("section");
  overlayEl.id = "timeryObsOverlay";
  overlayEl.classList.add(overlayKind === "liczniki" ? "is-liczniki" : "is-timery");
  overlayEl.setAttribute("aria-label", overlayKind === "liczniki" ? "Aktywne liczniki OBS" : "Aktywne timery OBS");

  const listEl = document.createElement("div");
  listEl.className = "timery-obs-list";
  listEl.classList.add(overlayKind === "liczniki" ? "is-liczniki" : "is-timery");
  overlayEl.appendChild(listEl);

  document.body.appendChild(overlayEl);
  document.body.classList.add("obs-timery-overlay");

  function applyObsVisualConfig(nextConfig) {
    obsConfig = normalizeObsOverlayConfig(nextConfig, obsConfig);
    overlayEl.style.setProperty("--timery-obs-card-bg", hexToRgba(obsConfig.color, 0.92));
    overlayEl.style.setProperty(
      "--timery-obs-progress-fill-bg",
      `linear-gradient(90deg, ${hexToRgba(obsConfig.progressColor, 0.96)}, ${hexToRgba(obsConfig.progressColor, 0.74)})`
    );
    overlayEl.style.setProperty("--timery-obs-progress-fill-shadow", hexToRgba(obsConfig.progressColor, 0.48));
    listEl.classList.toggle("is-horizontal", obsConfig.layout === "horizontal");
    listEl.classList.toggle("is-vertical", obsConfig.layout !== "horizontal");
  }

  function setOverlayDefinitions(nextDefinitions) {
    const normalized = normalizeOverlayDefinitions(nextDefinitions, overlayKind);
    if (!normalized.length) {
      return false;
    }

    const nextSignature = getOverlayDefinitionsSignature(normalized);
    if (nextSignature === overlayDefinitionsSignature) {
      return false;
    }

    overlayDefinitions = normalized;
    overlayDefinitionsSignature = nextSignature;
    return true;
  }

  function refreshOverlayDefinitionsFromSources() {
    const merged = buildOverlayDefinitions(overlayKind, sourceState);
    return setOverlayDefinitions(merged);
  }

  function syncObsConfigFromStorage() {
    if (PREFER_API_CONFIG_SYNC && !adminConfigApiDisabled) {
      return false;
    }
    const nextFromStorage = readObsTimeryConfigFromStorage(overlayKind);
    if (!nextFromStorage) {
      return false;
    }
    const normalized = normalizeObsOverlayConfig(nextFromStorage, obsConfig);
    if (areObsConfigsEqual(normalized, obsConfig)) {
      return false;
    }
    applyObsVisualConfig(normalized);
    return true;
  }

  function getObsConfigFromAdminState(rawState) {
    const source = rawState && typeof rawState === "object" && !Array.isArray(rawState) ? rawState : {};
    const rawConfig =
      overlayKind === "liczniki"
        ? source.streamObsLicznikiConfig
        : source.streamObsTimeryConfig;
    if (!rawConfig || typeof rawConfig !== "object" || Array.isArray(rawConfig)) {
      return null;
    }
    return normalizeObsOverlayConfig(rawConfig, obsConfig);
  }

  async function pollAdminConfigFromApiOnce(options = {}) {
    if (adminConfigApiDisabled || typeof fetch !== "function") {
      return false;
    }

    const force = options && options.force === true;
    const knownUpdatedAt = Math.max(0, Math.floor(Number(lastAdminConfigUpdatedAt || 0)));
    const query = !force && knownUpdatedAt > 0 ? `?after=${knownUpdatedAt}` : "";

    try {
      const response = await fetch(`${ADMIN_STATE_API_ENDPOINT}${query}`, { cache: "no-store" });
      if (!response.ok) {
        if (response.status === 404 || response.status === 405 || response.status === 501) {
          adminConfigApiDisabled = true;
        }
        return false;
      }

      const payload = await response.json();
      if (!payload || payload.ok !== true) {
        return false;
      }

      const updatedAt = Math.max(0, Math.floor(Number(payload.updatedAt || payload.serverTime || 0) || 0));
      if (updatedAt > 0) {
        lastAdminConfigUpdatedAt = Math.max(lastAdminConfigUpdatedAt, updatedAt);
      }

      const state = payload.state && typeof payload.state === "object" && !Array.isArray(payload.state)
        ? payload.state
        : null;
      if (!state) {
        return false;
      }

      let changed = false;

      const adminDefinitions = getOverlayDefinitionsFromAdminState(state, overlayKind);
      if (adminDefinitions.length) {
        const definitionsChanged = setOverlayDefinitions(adminDefinitions);
        if (definitionsChanged) {
          const definitionsStorageKey = getOverlayDefinitionsStorageKey(overlayKind);
          try {
            window.localStorage.setItem(definitionsStorageKey, JSON.stringify(adminDefinitions));
          } catch (_error) {
            // Ignore storage write failures.
          }
          changed = true;
        }
      }

      const nextConfig = getObsConfigFromAdminState(state);
      if (nextConfig && !areObsConfigsEqual(nextConfig, obsConfig)) {
        applyObsVisualConfig(nextConfig);
        persistObsConfigToStorage(overlayKind, nextConfig);
        changed = true;
      }

      return changed;
    } catch (_error) {
      return false;
    }
  }

  applyObsVisualConfig(obsConfig);

  function bindKaryStateChannel() {
    if (!("BroadcastChannel" in window)) {
      return;
    }
    try {
      karyStateChannel = new BroadcastChannel(KARY_STATE_SYNC_CHANNEL_NAME);
      karyStateChannel.addEventListener("message", (event) => {
        const nextState = parseKaryStateFromMessage(event?.data);
        if (!nextState) {
          return;
        }
        remoteStateHasSnapshot = true;
        applyIncomingState(nextState, { source: "channel" });
      });
    } catch (_error) {
      karyStateChannel = null;
    }
  }

  function closeKaryStateChannel() {
    if (!karyStateChannel) {
      return;
    }
    try {
      karyStateChannel.close();
    } catch (_error) {
      // Ignore channel close failures.
    }
    karyStateChannel = null;
  }

  function getActiveTimers() {
    const elapsed = Math.max(0, Math.floor((Date.now() - sourceState.lastTickAt) / 1000));
    return overlayDefinitions
      .map((timer) => {
        const baseRemaining = Math.max(0, Math.floor(Number(sourceState.timers[timer.key] || 0)));
        const remaining = Math.max(0, baseRemaining - elapsed);
        const totalRaw = Math.max(0, Math.floor(Number(sourceState.timerTotals[timer.key] || 0)));
        const total = Math.max(1, totalRaw, baseRemaining, remaining);
        const progressPercent = clampPercent((remaining / total) * 100);
        return {
          key: timer.key,
          label: timer.label,
          remaining,
          total,
          progressPercent
        };
      })
      .filter((timer) => timer.remaining > 0);
  }

  function getCounterItems() {
    return overlayDefinitions
      .map((counter) => {
        const value = Math.max(0, Math.floor(Number(sourceState.counters[counter.key] || 0)));
        return {
          key: counter.key,
          label: counter.label,
          value,
          isActive: value > 0
        };
      })
      .filter((counter) => counter.isActive);
  }

  function getActiveOverlayItems() {
    if (overlayKind === "liczniki") {
      return getCounterItems();
    }
    return getActiveTimers();
  }

  function getActiveItemsCountFromState(state) {
    const source = normalizeKaryState(state);
    if (overlayKind === "liczniki") {
      return Object.values(source.counters).reduce((count, value) => {
        return count + (Math.max(0, Math.floor(Number(value) || 0)) > 0 ? 1 : 0);
      }, 0);
    }
    return Object.values(source.timers).reduce((count, value) => {
      return count + (Math.max(0, Math.floor(Number(value) || 0)) > 0 ? 1 : 0);
    }, 0);
  }

  function shouldPreferLocalStateOverRemote(localState, remoteState) {
    if (!ALLOW_LOCAL_STATE_FALLBACK) {
      return false;
    }
    if (!IS_LOCALHOST_RUNTIME) {
      return false;
    }
    const local = normalizeKaryState(localState);
    const remote = normalizeKaryState(remoteState);
    const localActive = getActiveItemsCountFromState(local);
    const remoteActive = getActiveItemsCountFromState(remote);
    if (localActive <= remoteActive) {
      return false;
    }
    const localTick = Math.max(0, Math.floor(Number(local.lastTickAt || 0)));
    const remoteTick = Math.max(0, Math.floor(Number(remote.lastTickAt || 0)));
    return localTick >= Math.max(0, remoteTick - 1500);
  }

  function renderOverlay() {
    refreshOverlayDefinitionsFromSources();
    const activeItems = getActiveOverlayItems();
    const visibleItems =
      overlayKind === "liczniki"
        ? activeItems.filter((item) => Math.max(0, Math.floor(Number(item.value) || 0)) > 0)
        : activeItems;
    if (!visibleItems.length) {
      overlayEl.hidden = true;
      if (lastRenderedSignature !== "__empty__") {
        listEl.innerHTML = "";
        lastRenderedSignature = "__empty__";
      }
      return;
    }

    overlayEl.hidden = false;
    const signature =
      overlayKind === "liczniki"
        ? visibleItems.map((item) => `${item.key}:${item.label}:${item.value}:${item.isActive ? 1 : 0}`).join("|")
        : visibleItems.map((item) => `${item.key}:${item.label}:${item.remaining}:${item.total}`).join("|");
    if (signature === lastRenderedSignature) {
      return;
    }

    if (overlayKind === "liczniki") {
      listEl.innerHTML = visibleItems
        .map(
          (item) => `
            <article class="timery-obs-card ${item.isActive ? "is-active" : "is-idle"}" data-timery-obs-key="${escapeHtml(item.key)}">
              <p class="timery-obs-name">${escapeHtml(item.label)}</p>
              <p class="timery-obs-time">${escapeHtml(String(item.value))}</p>
            </article>
          `
        )
        .join("");
    } else {
      listEl.innerHTML = visibleItems
        .map(
          (item) => `
            <article class="timery-obs-card" data-timery-obs-key="${escapeHtml(item.key)}">
              <p class="timery-obs-name">${escapeHtml(item.label)}</p>
              <p class="timery-obs-time">${escapeHtml(formatClock(item.remaining))}</p>
              <div class="timery-obs-progress" aria-hidden="true">
                <span class="timery-obs-progress-fill" style="width:${item.progressPercent.toFixed(2)}%;"></span>
              </div>
            </article>
          `
        )
        .join("");
    }
    lastRenderedSignature = signature;
  }

  function applyIncomingState(nextState, options = {}) {
    sourceState = normalizeKaryState(nextState);
    const source = String(options && options.source ? options.source : "").trim().toLowerCase();
    if (source === "remote" || source === "channel" || source === "storage") {
      lastRemoteStateAppliedAt = Date.now();
    }
    refreshOverlayDefinitionsFromSources();
    renderOverlay();
  }

  function applyLocalStateFallback() {
    if (!ALLOW_LOCAL_STATE_FALLBACK) {
      return false;
    }
    const local = readLocalKaryState();
    if (!local) {
      return false;
    }
    applyIncomingState(local, { source: "local-fallback" });
    return true;
  }

  function clearStaleStateWhenRemoteUnavailable() {
    if (ALLOW_LOCAL_STATE_FALLBACK) {
      return false;
    }
    if (overlayKind !== "liczniki") {
      return false;
    }
    if (!remoteStateHasSnapshot || lastRemoteStateAppliedAt <= 0) {
      return false;
    }

    const staleForMs = Date.now() - lastRemoteStateAppliedAt;
    if (staleForMs < REMOTE_STATE_STALE_RESET_MS) {
      return false;
    }

    const activeItems = getActiveItemsCountFromState(sourceState);
    if (activeItems <= 0) {
      return false;
    }

    sourceState = normalizeKaryState({});
    remoteStateHasSnapshot = false;
    lastRemoteUpdatedAt = 0;
    lastRemoteStateAppliedAt = 0;
    refreshOverlayDefinitionsFromSources();
    return true;
  }

  async function pollRemoteState() {
    if (typeof fetch !== "function") {
      remoteStateHealthy = false;
      if (!applyLocalStateFallback()) {
        renderOverlay();
      }
      return;
    }

    const hasRemoteCursor = lastRemoteUpdatedAt > 0;
    const endpoint = hasRemoteCursor
      ? `${KARY_STATE_API_ENDPOINT}?after=${encodeURIComponent(String(lastRemoteUpdatedAt))}`
      : KARY_STATE_API_ENDPOINT;

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store"
      });
      if (!response.ok) {
        throw new Error(`HTTP_${response.status}`);
      }
      const payload = await response.json();
      if (!payload || payload.ok !== true) {
        throw new Error("INVALID_PAYLOAD");
      }
      remoteStateHealthy = true;

      const payloadUpdatedAt = Math.max(0, Math.floor(Number(payload.updatedAt || 0)));
      if (payloadUpdatedAt > 0 && payloadUpdatedAt < lastRemoteUpdatedAt) {
        return;
      }
      if (payloadUpdatedAt > 0) {
        lastRemoteUpdatedAt = Math.max(lastRemoteUpdatedAt, payloadUpdatedAt);
      }

      const hasStatePayload = payload.state && typeof payload.state === "object" && !Array.isArray(payload.state);
      if (hasStatePayload) {
        remoteStateHasSnapshot = true;
        const remoteState = normalizeKaryState(payload.state);
        if (ALLOW_LOCAL_STATE_FALLBACK) {
          const localState = readLocalKaryState();
          if (localState && shouldPreferLocalStateOverRemote(localState, remoteState)) {
            applyIncomingState(localState);
            return;
          }
        }
        applyIncomingState(remoteState, { source: "remote" });
        return;
      }

      const changed = payload.changed === true;
      if (!hasRemoteCursor && !remoteStateHasSnapshot && !changed) {
        remoteStateHasSnapshot = true;
        applyIncomingState({
          timers: {},
          timerTotals: {},
          counters: {},
          lastTickAt: Date.now()
        }, { source: "remote" });
        return;
      }

      if (!remoteStateHasSnapshot && applyLocalStateFallback()) {
        return;
      }
      renderOverlay();
    } catch (_error) {
      remoteStateHealthy = false;
      if (!remoteStateHasSnapshot && applyLocalStateFallback()) {
        return;
      }
      if (clearStaleStateWhenRemoteUnavailable()) {
        renderOverlay();
        return;
      }
      renderOverlay();
    }
  }

  window.addEventListener("storage", (event) => {
    const key = String(event.key || "");
    if (key === KARY_STATE_STORAGE_KEY) {
      const directState = parseKaryStateFromRaw(event.newValue);
      if (directState) {
        remoteStateHasSnapshot = true;
        applyIncomingState(directState, { source: "storage" });
        return;
      }
      if (!ALLOW_LOCAL_STATE_FALLBACK) {
        return;
      }
      if (!remoteStateHealthy || !remoteStateHasSnapshot) {
        applyLocalStateFallback();
      }
      return;
    }
    if (
      (overlayKind === "timery" && key === KARY_TIMER_DEFINITIONS_KEY) ||
      (overlayKind === "liczniki" && key === KARY_COUNTER_DEFINITIONS_KEY)
    ) {
      overlayDefinitions = buildOverlayDefinitions(overlayKind, sourceState);
      renderOverlay();
      return;
    }
    if (key === overlayConfigStorageKey && (!PREFER_API_CONFIG_SYNC || adminConfigApiDisabled)) {
      if (syncObsConfigFromStorage()) {
        renderOverlay();
      }
    }
  });

  window.addEventListener("pagehide", () => {
    closeKaryStateChannel();
  });

  bindKaryStateChannel();
  void pollAdminConfigFromApiOnce({ force: true }).then((changed) => {
    if (changed) {
      renderOverlay();
    }
  });
  pollRemoteState();
  renderOverlay();
  window.setInterval(() => {
    let changed = refreshOverlayDefinitionsFromSources();
    if (!PREFER_API_CONFIG_SYNC || adminConfigApiDisabled) {
      changed = syncObsConfigFromStorage() || changed;
    }
    if (changed) {
      renderOverlay();
    }
  }, CONFIG_SYNC_INTERVAL_MS);
  window.setInterval(() => {
    void pollAdminConfigFromApiOnce().then((changed) => {
      if (changed) {
        renderOverlay();
      }
    });
  }, ADMIN_CONFIG_SYNC_INTERVAL_MS);
  window.setInterval(pollRemoteState, POLL_INTERVAL_MS);
  window.setInterval(renderOverlay, RENDER_INTERVAL_MS);
})();
