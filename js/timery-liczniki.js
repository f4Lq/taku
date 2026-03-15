(function () {
  "use strict";

  const ADMIN_STATE_API_ENDPOINT = "/api/admin/state";
  const KARY_STATE_API_ENDPOINT = "/api/kary/state";
  const KARY_STATE_STORAGE_KEY = "takuu_kary_live_state";
  const OBS_TIMERY_CONFIG_KEY = "takuu_streamobs_timery_config";
  const OBS_LICZNIKI_CONFIG_KEY = "takuu_streamobs_liczniki_config";
  const IS_FILE_PROTOCOL = window.location.protocol === "file:";
  const PREFER_API_CONFIG_SYNC = !IS_FILE_PROTOCOL && typeof fetch === "function";
  const POLL_INTERVAL_MS = 1000;
  const RENDER_INTERVAL_MS = 250;
  const CONFIG_SYNC_INTERVAL_MS = 600;
  const ADMIN_CONFIG_SYNC_INTERVAL_MS = 1000;

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

  function formatClock(totalSeconds) {
    const seconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
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
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
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

  const overlayKind = detectObsOverlayKind();
  if (!overlayKind) {
    return;
  }

  const configFromStorage = readObsTimeryConfigFromStorage(overlayKind);
  const configFromQuery = readObsTimeryConfigFromQuery(overlayKind);
  let obsConfig = normalizeObsOverlayConfig(
    { ...(configFromStorage || {}), ...(configFromQuery || {}) },
    configFromStorage || configFromQuery
  );
  const overlayConfigStorageKey = getObsOverlayConfigStorageKey(overlayKind);

  const overlayDefinitions = getOverlayDefinitions(overlayKind);
  let sourceState = normalizeKaryState(readLocalKaryState());
  let lastRemoteUpdatedAt = 0;
  let lastAdminConfigUpdatedAt = 0;
  let adminConfigApiDisabled = false;
  let lastRenderedSignature = "";

  const overlayEl = document.createElement("section");
  overlayEl.id = "timeryObsOverlay";
  overlayEl.setAttribute("aria-label", overlayKind === "liczniki" ? "Aktywne liczniki OBS" : "Aktywne timery OBS");

  const listEl = document.createElement("div");
  listEl.className = "timery-obs-list";
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
    if (adminConfigApiDisabled || IS_FILE_PROTOCOL || typeof fetch !== "function") {
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

      if (!payload.changed || !payload.state) {
        return false;
      }

      const nextConfig = getObsConfigFromAdminState(payload.state);
      if (!nextConfig || areObsConfigsEqual(nextConfig, obsConfig)) {
        return false;
      }

      applyObsVisualConfig(nextConfig);
      persistObsConfigToStorage(overlayKind, nextConfig);
      return true;
    } catch (_error) {
      return false;
    }
  }

  applyObsVisualConfig(obsConfig);

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

  function getActiveCounters() {
    return overlayDefinitions
      .map((counter) => {
        const value = Math.max(0, Math.floor(Number(sourceState.counters[counter.key] || 0)));
        return {
          key: counter.key,
          label: counter.label,
          value
        };
      })
      .filter((counter) => counter.value > 0);
  }

  function getActiveOverlayItems() {
    return overlayKind === "liczniki" ? getActiveCounters() : getActiveTimers();
  }

  function renderOverlay() {
    const activeItems = getActiveOverlayItems();
    if (!activeItems.length) {
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
        ? activeItems.map((item) => `${item.key}:${item.value}`).join("|")
        : activeItems.map((item) => `${item.key}:${item.remaining}:${item.total}`).join("|");
    if (signature === lastRenderedSignature) {
      return;
    }

    if (overlayKind === "liczniki") {
      listEl.innerHTML = activeItems
        .map(
          (item) => `
            <article class="timery-obs-card" data-timery-obs-key="${escapeHtml(item.key)}">
              <p class="timery-obs-name">${escapeHtml(item.label)}</p>
              <p class="timery-obs-time">${escapeHtml(String(item.value))}</p>
            </article>
          `
        )
        .join("");
    } else {
      listEl.innerHTML = activeItems
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

  function applyIncomingState(nextState) {
    sourceState = normalizeKaryState(nextState);
    renderOverlay();
  }

  async function pollRemoteState() {
    if (typeof fetch !== "function") {
      const local = readLocalKaryState();
      if (local) {
        applyIncomingState(local);
      }
      return;
    }

    const endpoint =
      lastRemoteUpdatedAt > 0
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

      if (Number.isFinite(Number(payload.updatedAt)) && Number(payload.updatedAt) > 0) {
        lastRemoteUpdatedAt = Math.max(lastRemoteUpdatedAt, Math.floor(Number(payload.updatedAt)));
      }

      if (payload.changed && payload.state) {
        applyIncomingState(payload.state);
        return;
      }

      renderOverlay();
    } catch (_error) {
      const local = readLocalKaryState();
      if (local) {
        applyIncomingState(local);
      } else {
        renderOverlay();
      }
    }
  }

  window.addEventListener("storage", (event) => {
    const key = String(event.key || "");
    if (key === KARY_STATE_STORAGE_KEY) {
      const local = readLocalKaryState();
      if (local) {
        applyIncomingState(local);
      }
      return;
    }
    if (key === overlayConfigStorageKey && (!PREFER_API_CONFIG_SYNC || adminConfigApiDisabled)) {
      if (syncObsConfigFromStorage()) {
        renderOverlay();
      }
    }
  });

  void pollAdminConfigFromApiOnce({ force: true }).then((changed) => {
    if (changed) {
      renderOverlay();
    }
  });
  pollRemoteState();
  renderOverlay();
  if (!PREFER_API_CONFIG_SYNC) {
    window.setInterval(() => {
      if (syncObsConfigFromStorage()) {
        renderOverlay();
      }
    }, CONFIG_SYNC_INTERVAL_MS);
  }
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
