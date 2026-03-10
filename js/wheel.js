/* =========================================
   TAKUU OBS STREAM WHEEL ENGINE
========================================= */

(function () {
  "use strict";

  /* =========================
     CONFIG STORAGE
  ========================= */

  function resolveWheelWebSocketUrl() {
    const explicit = String(window.TAKUU_WHEEL_WS_URL || "").trim();
    if (!explicit) {
      return "";
    }

    if (/^wss?:\/\//i.test(explicit)) {
      return explicit;
    }

    if (explicit.startsWith("/")) {
      const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      return `${wsProtocol}//${window.location.host}${explicit}`;
    }

    return "";
  }

  const STORAGE_KEY = "takuu_wheel_config";
  const HISTORY_KEY = "takuu_wheel_history";
  const SPIN_SPEED_KEY = "takuu_wheel_spin_speed";
  const WHEEL_SYNC_STORAGE_KEY = "takuu_wheel_sync_event";
  const WHEEL_SYNC_CHANNEL_NAME = "takuu-wheel-sync";
  const WHEEL_SYNC_API_ENDPOINT = "/api/wheel/sync";
  const WHEEL_STATS_API_ENDPOINT = "/api/wheel/stats";
  const WHEEL_WS_URL = resolveWheelWebSocketUrl();
  const WHEEL_WS_ENABLED = Boolean(WHEEL_WS_URL);
  const MAX_PROCESSED_SYNC_EVENTS = 400;
  const DEFAULT_SPIN_SPEED = 1;
  const MIN_SPIN_SPEED = 0.5;
  const MAX_SPIN_SPEED = 4;
  const MAX_SERIES_SPINS = 1000;
  const TWO_PI = Math.PI * 2;
  const TOP_POINTER_ANGLE = Math.PI * 1.5;
  const DEFAULT_COLORS = [
    "#ff6b6b",
    "#ffd93d",
    "#6bcb77",
    "#4d96ff",
    "#b983ff",
    "#ff9f1c",
    "#08bdbd",
    "#9b5de5",
    "#f15bb5",
    "#00bbf9"
  ];

  /* =========================
     CANVAS
  ========================= */

  const canvas = document.getElementById("obsWheelCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const wheelSpinSpeedRangeEl = document.getElementById("wheelSpinSpeedRange");
  const wheelSpinSpeedValueEl = document.getElementById("wheelSpinSpeedValue");
  const wheelSpinSeriesCountEl = document.getElementById("wheelSpinSeriesCount");
  const wheelSpinSeriesBtnEl = document.getElementById("wheelSpinSeries");
  const wheelSpinPauseBtnEl = document.getElementById("wheelSpinPause");

  /* =========================
     WHEEL DATA
  ========================= */

  const baseItems = [
    { name: "Brak Piwka", chance: 5, timer: "brak-piwka", minutes: 30, color: "#ff6b6b" },
    { name: "Pusto", chance: 20, timer: null, minutes: 0, color: "#444444" },
    { name: "Krzesło", chance: 5, timer: "krzeslo", minutes: 30, color: "#ffd93d" },
    { name: "Pusto", chance: 20, timer: null, minutes: 0, color: "#444444" },
    { name: "Klima", chance: 5, timer: "klima", minutes: 30, color: "#4d96ff" },
    { name: "Pusto", chance: 20, timer: null, minutes: 0, color: "#444444" },
    { name: "Dieta", chance: 5, timer: "dieta", minutes: 30, color: "#b983ff" },
    { name: "Pusto", chance: 20, timer: null, minutes: 0, color: "#444444" }
  ];

  function safeNumber(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function normalizeTimerLookupToken(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function buildWheelTimerLookupMap() {
    const tokenToTimerKey = new Map();
    const register = (candidate, timerKey) => {
      const normalizedTimerKey = String(timerKey || "").trim();
      if (!normalizedTimerKey) {
        return;
      }
      const token = normalizeTimerLookupToken(candidate);
      if (!token || tokenToTimerKey.has(token)) {
        return;
      }
      tokenToTimerKey.set(token, normalizedTimerKey);
    };

    baseItems.forEach((item) => {
      const timerKey = String(item && item.timer ? item.timer : "").trim();
      if (!timerKey) {
        return;
      }
      const name = String(item && item.name ? item.name : "").trim();
      register(timerKey, timerKey);
      register(timerKey.replace(/-/g, " "), timerKey);
      register(timerKey.replace(/-/g, ""), timerKey);
      register(name, timerKey);
    });

    const timerCards = Array.from(document.querySelectorAll("[data-kary-timer]"));
    timerCards.forEach((card) => {
      const timerKey = String(card.getAttribute("data-kary-timer") || "").trim();
      if (!timerKey) {
        return;
      }
      const label = String(card.querySelector("h3")?.textContent || "").trim();
      register(timerKey, timerKey);
      register(timerKey.replace(/-/g, " "), timerKey);
      register(timerKey.replace(/-/g, ""), timerKey);
      register(label, timerKey);
    });

    return tokenToTimerKey;
  }

  const wheelTimerLookupByToken = buildWheelTimerLookupMap();

  function resolveWheelTimerKey(timerCandidate, nameCandidate = "", minutesCandidate = 0) {
    const directTimer = String(timerCandidate || "").trim();
    const minutes = Math.max(0, Math.floor(safeNumber(minutesCandidate, 0)));
    const nameToken = normalizeTimerLookupToken(nameCandidate);

    if (directTimer) {
      const directToken = normalizeTimerLookupToken(directTimer);
      if (directToken && wheelTimerLookupByToken.has(directToken)) {
        return wheelTimerLookupByToken.get(directToken);
      }
      if (minutes > 0 && nameToken && wheelTimerLookupByToken.has(nameToken)) {
        return wheelTimerLookupByToken.get(nameToken);
      }
      return directTimer;
    }

    if (minutes <= 0) {
      return null;
    }

    if (nameToken && wheelTimerLookupByToken.has(nameToken)) {
      return wheelTimerLookupByToken.get(nameToken);
    }

    return null;
  }

  function clampSpinSpeed(value) {
    const numeric = safeNumber(value, DEFAULT_SPIN_SPEED);
    return Math.max(MIN_SPIN_SPEED, Math.min(MAX_SPIN_SPEED, numeric));
  }

  function readSpinSpeed() {
    try {
      const raw = localStorage.getItem(SPIN_SPEED_KEY);
      if (!raw) {
        return DEFAULT_SPIN_SPEED;
      }
      return clampSpinSpeed(raw);
    } catch (_error) {
      return DEFAULT_SPIN_SPEED;
    }
  }

  function persistSpinSpeed(value) {
    try {
      localStorage.setItem(SPIN_SPEED_KEY, String(clampSpinSpeed(value)));
    } catch (_error) {
      // Ignore storage write failures.
    }
  }

  function formatSpinSpeedLabel(value) {
    return `${Math.round(clampSpinSpeed(value) * 100)}%`;
  }

  function normalizeColor(input, index = 0) {
    const value = String(input || "").trim();
    if (/^#[0-9a-f]{6}$/i.test(value)) {
      return value;
    }
    if (/^#[0-9a-f]{3}$/i.test(value)) {
      return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
    }
    return DEFAULT_COLORS[index % DEFAULT_COLORS.length];
  }

  function normalizeItem(item, index) {
    const raw = item && typeof item === "object" ? item : {};
    const name = String(raw.name || `Pole ${index + 1}`).trim() || `Pole ${index + 1}`;
    const minutes = Math.max(0, Math.floor(safeNumber(raw.minutes, 0)));
    return {
      name,
      chance: Math.max(0, Math.floor(safeNumber(raw.chance, 0))),
      timer: resolveWheelTimerKey(raw.timer, name, minutes),
      minutes,
      color: normalizeColor(raw.color, index)
    };
  }

  function normalizeItems(items) {
    if (!Array.isArray(items) || !items.length) {
      return baseItems.map((item, index) => normalizeItem(item, index));
    }
    return items.map((item, index) => normalizeItem(item, index));
  }

  let wheelItems = normalizeItems(baseItems);

  try {
    const savedRaw = localStorage.getItem(STORAGE_KEY);
    if (savedRaw) {
      const parsed = JSON.parse(savedRaw);
      wheelItems = normalizeItems(parsed);
    }
  } catch (_error) {
    wheelItems = normalizeItems(baseItems);
  }

  /* =========================
     ENGINE STATE
  ========================= */

  let angle = 0;
  let spinning = false;
  let spinPaused = false;
  let spinPauseStartedAt = 0;
  let spinAnimation = null;
  let queue = [];
  let lastTickSegment = -1;
  let spinSpeed = readSpinSpeed();

  const TICK_SOUND_SOURCES = ["/sounds/tick.mp3", "/sounds/tick.mp4", "sounds/tick.mp3", "sounds/tick.mp4"];
  const TICK_VOLUME = 0.95;
  const TICK_BUFFER_GAIN = 1.05;
  const TICK_BUFFER_MAX_DURATION = 0.16;
  const TICK_MIN_INTERVAL_MS = 24;
  const TICK_ONSET_SCAN_SECONDS = 0.5;
  const TICK_ONSET_THRESHOLD = 0.012;
  const TICK_POOL_SIZE = 6;
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  function isObsAudioModeHintEnabled() {
    try {
      if (typeof window.__takuuObsOverlayMode === "boolean") {
        return window.__takuuObsOverlayMode;
      }
    } catch (_error) {
      // Ignore global hint failures.
    }

    try {
      const params = new URLSearchParams(window.location.search || "");
      const raw = String(params.get("obs") || params.get("overlay") || "").trim().toLowerCase();
      if (raw === "1" || raw === "true" || raw === "yes" || raw === "on") {
        return true;
      }
    } catch (_error) {
      // Ignore search params failures.
    }

    const ua = String(window.navigator?.userAgent || "").toLowerCase();
    return ua.includes("obs") || ua.includes("obsbrowser") || ua.includes("obs-studio");
  }
  const OBS_AUDIO_MODE = isObsAudioModeHintEnabled();
  const TICK_AUDIO_WARMUP_INTERVAL_MS = 1000;
  const TICK_AUDIO_WARMUP_MAX_ATTEMPTS = 24;
  let tickAudioContext = null;
  let tickSourceIndex = 0;
  let tickPool = [];
  let tickPoolCursor = 0;
  let tickBuffer = null;
  let tickBufferStartOffset = 0;
  let tickBufferSource = "";
  let tickBufferLoading = null;
  let lastTickPlaybackAt = 0;
  let tickWarmupIntervalId = null;
  let tickWarmupAttempts = 0;
  let tickAutoplayBlockedLogged = false;

  function buildTickPool(sourcePath) {
    const source = String(sourcePath || "").trim() || TICK_SOUND_SOURCES[0];
    tickPool = Array.from({ length: TICK_POOL_SIZE }, () => {
      const audio = new Audio(source);
      audio.preload = "auto";
      audio.defaultMuted = false;
      audio.muted = false;
      audio.playsInline = true;
      audio.volume = TICK_VOLUME;
      return audio;
    });
    tickPoolCursor = 0;
    preloadTickBuffer(source);
  }

  function getTickAudioContext() {
    if (!AudioContextCtor) {
      return null;
    }
    if (!tickAudioContext) {
      try {
        tickAudioContext = new AudioContextCtor();
      } catch (_error) {
        tickAudioContext = null;
      }
    }
    if (tickAudioContext && tickAudioContext.state === "suspended") {
      tickAudioContext.resume().catch(() => {});
    }
    return tickAudioContext;
  }

  function decodeAudioDataCompat(context, arrayBuffer) {
    return new Promise((resolve, reject) => {
      try {
        const result = context.decodeAudioData(arrayBuffer, resolve, reject);
        if (result && typeof result.then === "function") {
          result.then(resolve).catch(reject);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  function detectTickBufferStartOffset(buffer) {
    const audioBuffer = buffer && typeof buffer === "object" ? buffer : null;
    if (!audioBuffer || typeof audioBuffer.getChannelData !== "function") {
      return 0;
    }

    const channelData = audioBuffer.getChannelData(0);
    if (!channelData || !channelData.length) {
      return 0;
    }

    const sampleRate = Math.max(1, Math.floor(safeNumber(audioBuffer.sampleRate, 48000)));
    const scanSampleCount = Math.min(channelData.length, Math.floor(sampleRate * TICK_ONSET_SCAN_SECONDS));
    for (let i = 0; i < scanSampleCount; i += 1) {
      if (Math.abs(channelData[i]) >= TICK_ONSET_THRESHOLD) {
        const rewindSamples = Math.floor(sampleRate * 0.003);
        const startSample = Math.max(0, i - rewindSamples);
        return startSample / sampleRate;
      }
    }

    return 0;
  }

  function preloadTickBuffer(sourcePath) {
    const source = String(sourcePath || "").trim();
    if (!source) {
      return;
    }
    const context = getTickAudioContext();
    if (!context) {
      return;
    }
    if (tickBuffer && tickBufferSource === source) {
      return;
    }
    if (tickBufferLoading && tickBufferSource === source) {
      return;
    }

    tickBufferSource = source;
    tickBufferLoading = fetch(source, { cache: "force-cache" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`tick-http-${response.status}`);
        }
        return response.arrayBuffer();
      })
      .then((audioData) => decodeAudioDataCompat(context, audioData))
      .then((decodedBuffer) => {
        tickBuffer = decodedBuffer || null;
        tickBufferStartOffset = tickBuffer ? detectTickBufferStartOffset(tickBuffer) : 0;
      })
      .catch(() => {
        tickBuffer = null;
        tickBufferStartOffset = 0;
      })
      .finally(() => {
        tickBufferLoading = null;
      });
  }

  function playTickFromBuffer() {
    const context = getTickAudioContext();
    if (!context || !tickBuffer) {
      return false;
    }
    try {
      const now = context.currentTime;
      const source = context.createBufferSource();
      const gain = context.createGain();
      const bufferDuration = Math.max(0.03, safeNumber(tickBuffer.duration, TICK_BUFFER_MAX_DURATION));
      const startOffset = Math.max(0, Math.min(safeNumber(tickBufferStartOffset, 0), Math.max(0, bufferDuration - 0.03)));
      const availableDuration = Math.max(0.03, bufferDuration - startOffset);
      const sliceDuration = Math.max(0.03, Math.min(TICK_BUFFER_MAX_DURATION, availableDuration));
      source.buffer = tickBuffer;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(TICK_BUFFER_GAIN, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + sliceDuration);
      source.connect(gain);
      gain.connect(context.destination);
      source.start(now, startOffset, sliceDuration);
      source.stop(now + sliceDuration + 0.01);
      lastTickPlaybackAt = performance.now();
      return true;
    } catch (_error) {
      return false;
    }
  }

  function playTickBeepFallback() {
    const context = getTickAudioContext();
    if (!context) {
      return;
    }
    try {
      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(1220, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.05);
    } catch (_error) {
      // Ignore fallback beep errors.
    }
  }

  function trySwitchTickSource(playAfterSwitch = false) {
    if (tickSourceIndex >= TICK_SOUND_SOURCES.length - 1) {
      return false;
    }
    tickSourceIndex += 1;
    buildTickPool(TICK_SOUND_SOURCES[tickSourceIndex]);
    if (playAfterSwitch) {
      const candidate = tickPool[0];
      if (candidate) {
        const promise = candidate.play();
        if (promise && typeof promise.catch === "function") {
          promise
            .then(() => {
              candidate.pause();
              candidate.currentTime = 0;
            })
            .catch(() => {
              playTickBeepFallback();
            });
        }
      }
    }
    return true;
  }

  function handleTickPlayError(error) {
    const descriptor = String(error && (error.name || error.message) || "").toLowerCase();
    const autoplayBlocked =
      descriptor.includes("notallowed") ||
      descriptor.includes("user gesture") ||
      descriptor.includes("play() failed");
    const shouldTryNextSource =
      descriptor.includes("notfound") ||
      descriptor.includes("notsupported") ||
      descriptor.includes("decode") ||
      descriptor.includes("network");

    if (autoplayBlocked && !tickAutoplayBlockedLogged) {
      tickAutoplayBlockedLogged = true;
      console.warn("[TakuuWheel] Tick audio blocked by autoplay policy. In OBS enable Browser Source audio/mixer.");
    }

    if (shouldTryNextSource && trySwitchTickSource(true)) {
      return;
    }
    if (OBS_AUDIO_MODE && playTickFromBuffer()) {
      return;
    }
    playTickBeepFallback();
  }

  function playTickFromPool() {
    if (!OBS_AUDIO_MODE && playTickFromBuffer()) {
      return;
    }

    if (!tickPool.length) {
      buildTickPool(TICK_SOUND_SOURCES[tickSourceIndex]);
    }
    const audio = tickPool[tickPoolCursor % tickPool.length];
    tickPoolCursor += 1;
    if (!audio) {
      playTickBeepFallback();
      return;
    }

    try {
      const duration = safeNumber(audio.duration, 0);
      const preferredOffset = Math.max(0, safeNumber(tickBufferStartOffset, 0));
      const safeOffset =
        preferredOffset > 0
          ? (duration > 0 ? Math.min(preferredOffset, Math.max(0, duration - 0.03)) : preferredOffset)
          : 0;
      audio.currentTime = safeOffset;
    } catch (_error) {
      // Ignore seek errors.
    }
    audio.volume = TICK_VOLUME;
    lastTickPlaybackAt = performance.now();

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch((error) => {
        handleTickPlayError(error);
      });
    }
  }

  function primeTickAudioPlayback() {
    getTickAudioContext();
    if (!tickPool.length) {
      buildTickPool(TICK_SOUND_SOURCES[tickSourceIndex]);
    }
    preloadTickBuffer(TICK_SOUND_SOURCES[tickSourceIndex]);
    if (!OBS_AUDIO_MODE) {
      return;
    }
    const firstAudio = tickPool[0];
    if (!firstAudio) {
      return;
    }

    const originalMuted = firstAudio.muted;
    const originalVolume = firstAudio.volume;
    firstAudio.muted = true;
    firstAudio.volume = 0;
    const playPromise = firstAudio.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise
        .then(() => {
          firstAudio.pause();
          firstAudio.currentTime = 0;
          firstAudio.muted = originalMuted;
          firstAudio.volume = originalVolume;
          if (tickWarmupIntervalId) {
            window.clearInterval(tickWarmupIntervalId);
            tickWarmupIntervalId = null;
          }
        })
        .catch(() => {
          firstAudio.muted = originalMuted;
          firstAudio.volume = originalVolume;
        });
      return;
    }
    firstAudio.muted = originalMuted;
    firstAudio.volume = originalVolume;
  }

  function startTickAudioWarmupLoop() {
    if (!OBS_AUDIO_MODE || tickWarmupIntervalId) {
      return;
    }
    tickWarmupAttempts = 0;
    tickWarmupIntervalId = window.setInterval(() => {
      if (tickWarmupAttempts >= TICK_AUDIO_WARMUP_MAX_ATTEMPTS) {
        if (tickWarmupIntervalId) {
          window.clearInterval(tickWarmupIntervalId);
          tickWarmupIntervalId = null;
        }
        return;
      }
      tickWarmupAttempts += 1;
      primeTickAudioPlayback();
    }, TICK_AUDIO_WARMUP_INTERVAL_MS);
  }

  buildTickPool(TICK_SOUND_SOURCES[tickSourceIndex]);

  let history = [];
  try {
    history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    if (!Array.isArray(history)) {
      history = [];
    }
  } catch (_error) {
    history = [];
  }

  const wheelSyncSourceId = `wheel-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  try {
    window.__takuuWheelSyncSourceId = wheelSyncSourceId;
  } catch (_error) {
    // Ignore global assignment failures.
  }
  const processedSyncEventIds = new Set();
  const processedSyncEventOrder = [];
  let wheelSyncChannel = null;
  let wheelSocket = null;
  let wheelStatsApiDisabled = false;

  function emitWheelStatsEvent(type, detail = {}) {
    try {
      window.dispatchEvent(new CustomEvent(type, { detail }));
    } catch (_error) {
      // Ignore dispatch errors.
    }
  }

  function markSyncEventProcessed(eventId) {
    const key = String(eventId || "").trim();
    if (!key) {
      return false;
    }
    if (processedSyncEventIds.has(key)) {
      return false;
    }
    processedSyncEventIds.add(key);
    processedSyncEventOrder.push(key);
    if (processedSyncEventOrder.length > MAX_PROCESSED_SYNC_EVENTS) {
      const stale = processedSyncEventOrder.shift();
      if (stale) {
        processedSyncEventIds.delete(stale);
      }
    }
    return true;
  }

  function normalizeWinnerPayload(rawWinner, fallbackTime = Date.now()) {
    const source = rawWinner && typeof rawWinner === "object" ? rawWinner : {};
    const name = String(source.name || source.winnerName || "").trim();
    if (!name) {
      return null;
    }
    const idRaw = source.id != null ? source.id : source.eventId;
    const id = idRaw == null ? "" : String(idRaw).trim();
    const minutes = Math.max(0, Math.floor(safeNumber(source.minutes, 0)));
    const timerRaw = source.timerKey != null ? source.timerKey : source.timer;
    const timer = resolveWheelTimerKey(timerRaw, name, minutes);
    const timestampRaw = Math.floor(safeNumber(source.timestamp ?? source.time, fallbackTime));
    const timestamp = timestampRaw > 0 ? timestampRaw : fallbackTime;
    return {
      id,
      name,
      timer,
      minutes,
      timestamp
    };
  }

  function renderWinnerResult(winnerName, animate = true) {
    const result = document.getElementById("obsWheelResult");
    if (!result) {
      return;
    }
    result.textContent = `WYGRANA: ${winnerName}`;
    if (!animate) {
      result.style.transform = "scale(1)";
      return;
    }
    result.style.transform = "scale(1.12)";
    setTimeout(() => {
      result.style.transform = "scale(1)";
    }, 340);
  }

  function normalizeHistoryEntry(entry) {
    const source = entry && typeof entry === "object" ? entry : {};
    const name = String(source.name || "").trim();
    if (!name) {
      return null;
    }
    const timestamp = Math.max(1, Math.floor(safeNumber(source.time, Date.now())));
    const idRaw = source.id != null ? source.id : source.eventId;
    const id = idRaw == null ? "" : String(idRaw).trim();
    const normalized = {
      name,
      time: timestamp
    };
    if (id) {
      normalized.id = id;
    }
    return normalized;
  }

  function saveWheelHistoryEntryToApi(entry) {
    if (wheelStatsApiDisabled || typeof fetch !== "function") {
      return;
    }

    const normalizedEntry = normalizeHistoryEntry(entry);
    if (!normalizedEntry) {
      return;
    }

    fetch(WHEEL_STATS_API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "append",
        entry: normalizedEntry
      }),
      keepalive: true
    })
      .then(async (response) => {
        const contentType = String(response.headers.get("content-type") || "").toLowerCase();
        if (response.ok) {
          if (!contentType.includes("application/json")) {
            let preview = "";
            try {
              preview = String(await response.text()).slice(0, 220);
            } catch (_error) {
              preview = "";
            }
            console.warn("[TakuuWheel] POST /api/wheel/stats returned non-JSON response", {
              status: response.status,
              contentType,
              preview
            });
            return;
          }

          let payload = null;
          try {
            payload = await response.json();
          } catch (_error) {
            payload = null;
          }
          if (!payload || payload.ok !== true) {
            console.warn("[TakuuWheel] POST /api/wheel/stats returned unexpected payload", payload);
          }
          return;
        }

        if (!response.ok && (response.status === 404 || response.status === 405 || response.status === 501)) {
          wheelStatsApiDisabled = true;
        }
        let details = "";
        try {
          details = await response.text();
        } catch (_error) {
          details = "";
        }
        console.warn("[TakuuWheel] POST /api/wheel/stats failed", {
          status: response.status,
          details
        });
      })
      .catch((error) => {
        console.warn("[TakuuWheel] POST /api/wheel/stats request error", error);
      });
  }

  function pushWheelHistoryEntry(entry) {
    const normalizedEntry = normalizeHistoryEntry(entry);
    if (!normalizedEntry) {
      return;
    }
    const entryId = String(normalizedEntry.id || "").trim();
    if (entryId && history.some((item) => String(item && item.id ? item.id : "").trim() === entryId)) {
      return;
    }
    history.push(normalizedEntry);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (_error) {
      // Ignore storage write failures.
    }
    saveWheelHistoryEntryToApi(normalizedEntry);
    emitWheelStatsEvent("takuu:wheel-history-updated", {
      winner: normalizedEntry.name,
      entry: normalizedEntry
    });
  }

  function applyWinnerOutcome(rawWinner, options = {}) {
    const normalizedWinner = normalizeWinnerPayload(rawWinner);
    if (!normalizedWinner) {
      return null;
    }

    const shouldRender = options.renderResult !== false;
    const shouldAnimate = options.animateResult !== false;
    if (shouldRender) {
      renderWinnerResult(normalizedWinner.name, shouldAnimate);
    }

    addTimer(normalizedWinner.timer, normalizedWinner.minutes);

    const historyEntry = {
      name: normalizedWinner.name,
      time: normalizedWinner.timestamp
    };
    if (normalizedWinner.id) {
      historyEntry.id = normalizedWinner.id;
    }
    pushWheelHistoryEntry(historyEntry);

    return {
      ...normalizedWinner,
      historyEntry
    };
  }

  function buildWinnerSyncPayload(winnerOutcome) {
    if (!winnerOutcome || typeof winnerOutcome !== "object") {
      return null;
    }
    const payload = {
      type: "winner",
      eventId: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      sourceId: wheelSyncSourceId,
      winnerName: String(winnerOutcome.name || "").trim(),
      timerKey: winnerOutcome.timer == null ? "" : String(winnerOutcome.timer),
      minutes: Math.max(0, Math.floor(safeNumber(winnerOutcome.minutes, 0))),
      timestamp: Math.max(1, Math.floor(safeNumber(winnerOutcome.timestamp, Date.now())))
    };
    if (!payload.winnerName) {
      return null;
    }
    markSyncEventProcessed(payload.eventId);
    return payload;
  }

  function handleIncomingWinnerSync(rawPayload) {
    const payload = rawPayload && typeof rawPayload === "object" ? rawPayload : {};
    if (String(payload.type || "").trim().toLowerCase() !== "winner") {
      return false;
    }

    const winnerName = String(payload.winnerName || payload.name || "").trim();
    if (!winnerName) {
      return false;
    }

    const fallbackTimestamp = Math.max(1, Math.floor(safeNumber(payload.timestamp ?? payload.time, Date.now())));
    let eventId = String(payload.eventId || payload.id || "").trim();
    if (!eventId) {
      const winnerToken = normalizeTimerLookupToken(winnerName) || "winner";
      eventId = `sync-${fallbackTimestamp}-${winnerToken}`;
    }
    const sourceId = String(payload.sourceId || "").trim();
    if (sourceId === wheelSyncSourceId || !markSyncEventProcessed(eventId)) {
      return false;
    }

    const applied = applyWinnerOutcome(
      {
        id: eventId,
        name: winnerName,
        timerKey: payload.timerKey != null ? payload.timerKey : payload.timer,
        minutes: payload.minutes,
        timestamp: fallbackTimestamp
      },
      {
        renderResult: true,
        animateResult: false
      }
    );

    return Boolean(applied);
  }

  function publishWinnerSync(payload) {
    if (!payload || typeof payload !== "object") {
      return;
    }

    if (wheelSyncChannel && typeof wheelSyncChannel.postMessage === "function") {
      try {
        wheelSyncChannel.postMessage(payload);
      } catch (_error) {
        // Ignore channel failures.
      }
    }

    try {
      localStorage.setItem(WHEEL_SYNC_STORAGE_KEY, JSON.stringify(payload));
    } catch (_error) {
      // Ignore storage write failures.
    }

    if (typeof fetch === "function") {
      fetch(WHEEL_SYNC_API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true
      })
        .then(async (response) => {
          if (!response.ok) {
            let details = "";
            try {
              details = await response.text();
            } catch (_error) {
              details = "";
            }
            console.warn("[TakuuWheel] POST /api/wheel/sync failed", {
              status: response.status,
              details
            });
            return;
          }

          const contentType = String(response.headers.get("content-type") || "").toLowerCase();
          if (!contentType.includes("application/json")) {
            let preview = "";
            try {
              preview = String(await response.text()).slice(0, 220);
            } catch (_error) {
              preview = "";
            }
            console.warn("[TakuuWheel] POST /api/wheel/sync returned non-JSON response", {
              status: response.status,
              contentType,
              preview
            });
          }
        })
        .catch((error) => {
          console.warn("[TakuuWheel] POST /api/wheel/sync request error", error);
      });
    }

    if (wheelSocket && wheelSocket.readyState === 1) {
      try {
        wheelSocket.send(
          JSON.stringify({
            type: "wheel_sync_result",
            payload
          })
        );
      } catch (_error) {
        // Ignore websocket send failures.
      }
    }
  }

  function initWheelSyncBridge() {
    if ("BroadcastChannel" in window) {
      try {
        wheelSyncChannel = new BroadcastChannel(WHEEL_SYNC_CHANNEL_NAME);
        wheelSyncChannel.addEventListener("message", (event) => {
          const payload = event && event.data ? event.data : null;
          handleIncomingWinnerSync(payload);
        });
      } catch (_error) {
        wheelSyncChannel = null;
      }
    }

    window.addEventListener("storage", (event) => {
      if (!event || String(event.key || "") !== WHEEL_SYNC_STORAGE_KEY || !event.newValue) {
        return;
      }
      try {
        const payload = JSON.parse(event.newValue);
        handleIncomingWinnerSync(payload);
      } catch (_error) {
        // Ignore malformed sync payload.
      }
    });
  }

  /* =========================
     COLOR UTILS
  ========================= */

  function hexToRgb(hex) {
    const normalized = normalizeColor(hex, 0).replace("#", "");
    const value = Number.parseInt(normalized, 16);
    return {
      r: (value >> 16) & 255,
      g: (value >> 8) & 255,
      b: value & 255
    };
  }

  function rgbToHex(rgb) {
    const clamp = (value) => Math.max(0, Math.min(255, Math.round(value)));
    const toHex = (value) => clamp(value).toString(16).padStart(2, "0");
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
  }

  function mixColors(colorA, colorB, ratio) {
    const a = hexToRgb(colorA);
    const b = hexToRgb(colorB);
    const t = Math.max(0, Math.min(1, safeNumber(ratio, 0)));
    return rgbToHex({
      r: a.r + (b.r - a.r) * t,
      g: a.g + (b.g - a.g) * t,
      b: a.b + (b.b - a.b) * t
    });
  }

  /* =========================
     GEOMETRY
  ========================= */

  function arcSize() {
    return wheelItems.length ? TWO_PI / wheelItems.length : TWO_PI;
  }

  function normalizeAngle(value) {
    let normalized = safeNumber(value, 0) % TWO_PI;
    if (normalized < 0) normalized += TWO_PI;
    return normalized;
  }

  function currentSegmentFromAngle(rawAngle) {
    if (!wheelItems.length) return 0;
    const arc = arcSize();
    let normalized = normalizeAngle(TOP_POINTER_ANGLE - rawAngle);
    let segment = Math.floor(normalized / arc);
    if (segment >= wheelItems.length) segment = wheelItems.length - 1;
    if (segment < 0) segment = 0;
    return segment;
  }

  function getSegment() {
    return currentSegmentFromAngle(angle);
  }

  function winnerAngleForIndex(index) {
    if (!wheelItems.length) return 0;
    const arc = arcSize();
    const centerOfSegment = (index + 0.5) * arc;
    return normalizeAngle(TOP_POINTER_ANGLE - centerOfSegment);
  }

  /* =========================
     DRAW
  ========================= */

  function fitLabel(text, maxLen = 16) {
    const clean = String(text || "").trim();
    if (clean.length <= maxLen) return clean;
    return `${clean.slice(0, maxLen - 3)}...`;
  }

  function drawPointer(center, radius) {
    const pointerTopY = center - radius - 24;
    const pointerTipY = center - radius + 24;
    const pointerHalfWidth = Math.max(14, radius * 0.065);

    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.38)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 3;

    ctx.beginPath();
    ctx.moveTo(center - pointerHalfWidth, pointerTopY);
    ctx.lineTo(center + pointerHalfWidth, pointerTopY);
    ctx.lineTo(center, pointerTipY);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(center, pointerTopY, center, pointerTipY);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(1, "#b7d8ff");
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.lineWidth = Math.max(1.5, radius * 0.009);
    ctx.strokeStyle = "rgba(18, 39, 72, 0.75)";
    ctx.stroke();
    ctx.restore();
  }

  function drawWheel() {
    const size = Math.min(canvas.width, canvas.height);
    const center = size / 2;
    const radius = center - 46;
    const arc = arcSize();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!wheelItems.length) return;

    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(angle);

    wheelItems.forEach((item, i) => {
      const start = i * arc;
      const end = start + arc;
      const baseColor = normalizeColor(item.color, i);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, start, end);
      ctx.closePath();

      const segmentGradient = ctx.createLinearGradient(0, -radius, 0, radius);
      segmentGradient.addColorStop(0, mixColors(baseColor, "#ffffff", 0.2));
      segmentGradient.addColorStop(1, mixColors(baseColor, "#000000", 0.25));
      ctx.fillStyle = segmentGradient;
      ctx.fill();

      ctx.lineWidth = Math.max(1.4, radius * 0.0065);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
      ctx.stroke();

      ctx.save();
      ctx.rotate(start + arc / 2);
      const label = fitLabel(item.name, 18);
      const fontSize = Math.max(14, Math.min(30, radius * 0.11 - Math.max(0, label.length - 10) * 0.9));
      ctx.font = `700 ${fontSize}px "Space Grotesk", sans-serif`;
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.lineWidth = Math.max(2, fontSize * 0.12);
      ctx.strokeStyle = "rgba(4, 9, 21, 0.72)";
      ctx.fillStyle = "#f8fbff";
      const textX = radius - Math.max(26, radius * 0.1);
      ctx.strokeText(label, textX, 0);
      ctx.fillText(label, textX, 0);
      ctx.restore();
    });

    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, radius + Math.max(3, radius * 0.013), 0, TWO_PI);
    ctx.lineWidth = Math.max(5, radius * 0.022);
    ctx.strokeStyle = "rgba(227, 243, 255, 0.86)";
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.18, 0, TWO_PI);
    const centerGradient = ctx.createRadialGradient(0, 0, radius * 0.02, 0, 0, radius * 0.18);
    centerGradient.addColorStop(0, "#ffffff");
    centerGradient.addColorStop(1, "#cde4ff");
    ctx.fillStyle = centerGradient;
    ctx.fill();
    ctx.lineWidth = Math.max(2, radius * 0.01);
    ctx.strokeStyle = "rgba(9, 21, 43, 0.62)";
    ctx.stroke();

    ctx.restore();

    drawPointer(center, radius);
  }

  function draw() {
    drawWheel();
  }

  /* =========================
     TICK SOUND
  ========================= */

  function tickSound() {
    if (!spinning) return;
    const segment = getSegment();
    if (segment === lastTickSegment) return;
    if (performance.now() - lastTickPlaybackAt < TICK_MIN_INTERVAL_MS) {
      lastTickSegment = segment;
      return;
    }
    lastTickSegment = segment;
    playTickFromPool();
  }

  /* =========================
     CHANCE SYSTEM
  ========================= */

  function getRandomUnit() {
    try {
      if (window.crypto && typeof window.crypto.getRandomValues === "function") {
        const buffer = new Uint32Array(1);
        window.crypto.getRandomValues(buffer);
        return buffer[0] / 4294967296;
      }
    } catch (_error) {
      // Fallback below.
    }
    return Math.random();
  }

  function getChanceWeight(item) {
    return Math.max(0, safeNumber(item && item.chance, 0));
  }

  function rollWinnerIndex() {
    if (!wheelItems.length) return 0;

    // Losowanie ważone procentami:
    // wiekszy % => wieksza szansa; mniejszy % => mniejsza szansa.
    const weights = wheelItems.map((item) => getChanceWeight(item));
    const totalWeight = weights.reduce((acc, value) => acc + value, 0);
    if (totalWeight <= 0) {
      return Math.floor(Math.random() * wheelItems.length);
    }

    let threshold = getRandomUnit() * totalWeight;
    for (let i = 0; i < weights.length; i += 1) {
      threshold -= weights[i];
      if (threshold < 0) {
        return i;
      }
    }
    return weights.length - 1;
  }

  function simulateChanceDistribution(spins = 10000) {
    const rounds = Math.max(1, Math.floor(safeNumber(spins, 10000)));
    const counts = Array.from({ length: wheelItems.length }, () => 0);
    for (let i = 0; i < rounds; i += 1) {
      const winnerIndex = rollWinnerIndex();
      counts[winnerIndex] = (counts[winnerIndex] || 0) + 1;
    }

    return wheelItems.map((item, index) => {
      const count = Math.max(0, Math.floor(safeNumber(counts[index], 0)));
      return {
        index,
        name: String(item.name || `Pole ${index + 1}`),
        configuredChance: getChanceWeight(item),
        wins: count,
        winPercent: Number(((count / rounds) * 100).toFixed(2))
      };
    });
  }

  /* =========================
     TIMER INTEGRATION
  ========================= */

  function enqueuePendingTimerAdd(payload) {
    if (!payload || typeof payload !== "object") return;
    if (!Array.isArray(window.__takuuPendingTimerAdds)) {
      window.__takuuPendingTimerAdds = [];
    }
    window.__takuuPendingTimerAdds.push(payload);
  }

  function addTimer(timerKey, minutes) {
    const normalizedKey = String(timerKey || "").trim();
    const normalizedMinutes = Math.max(0, Math.floor(safeNumber(minutes, 0)));
    if (!normalizedKey || normalizedMinutes <= 0) {
      return { ok: false, error: "INVALID_TIMER_INPUT" };
    }

    const payload = {
      timerKey: normalizedKey,
      amount: normalizedMinutes,
      unit: "minutes",
      silentStatus: true,
      emitWebhook: false,
      source: "wheel"
    };

    const liveApi = window.TakuuKaryLive;
    if (liveApi && typeof liveApi.addTimerMinutes === "function") {
      try {
        const result = liveApi.addTimerMinutes(normalizedKey, normalizedMinutes, {
          silentStatus: true,
          emitWebhook: false,
          source: "wheel"
        });
        if (result && result.ok) {
          return result;
        }
      } catch (_error) {
        // Fall through to queue fallback.
      }
    }

    enqueuePendingTimerAdd(payload);
    try {
      window.dispatchEvent(new CustomEvent("takuu:add-timer-time", { detail: payload }));
    } catch (_error) {
      // Ignore dispatch errors; queue fallback remains.
    }

    return { ok: true, pending: true };
  }

  /* =========================
     WIN
  ========================= */

  function finishSpin(expectedIndex) {
    const landedIndex = getSegment();
    if (Number.isInteger(expectedIndex) && expectedIndex !== landedIndex) {
      // Keep result consistent with the visual pointer segment.
      console.warn("[TakuuWheel] Landed segment differs from expected winner", {
        expectedIndex,
        landedIndex
      });
    }

    const winner = wheelItems[landedIndex] || wheelItems[0];
    const winnerName = String(winner?.name || "").trim();
    const winnerMinutes = Math.max(0, Math.floor(safeNumber(winner?.minutes, 0)));
    const winnerTimer = resolveWheelTimerKey(winner?.timer, winnerName, winnerMinutes);
    const winnerBasePayload = {
      name: winnerName,
      timer: winnerTimer,
      minutes: winnerMinutes,
      timestamp: Date.now()
    };
    const syncPayload = buildWinnerSyncPayload(winnerBasePayload);
    const winnerOutcome = applyWinnerOutcome(
      {
        ...winnerBasePayload,
        id: syncPayload ? syncPayload.eventId : ""
      },
      {
        renderResult: true,
        animateResult: true
      }
    );
    if (syncPayload) {
      publishWinnerSync(syncPayload);
    }

    if (queue.length > 0) {
      queue.shift();
      spin();
    }
  }

  function updateSpinPauseButton() {
    if (!wheelSpinPauseBtnEl) {
      return;
    }

    if (!spinning || !spinAnimation) {
      wheelSpinPauseBtnEl.disabled = true;
      wheelSpinPauseBtnEl.textContent = "Zatrzymaj";
      wheelSpinPauseBtnEl.classList.remove("admin-kary-btn-danger");
      wheelSpinPauseBtnEl.setAttribute("aria-pressed", "false");
      return;
    }

    wheelSpinPauseBtnEl.disabled = false;
    if (spinPaused) {
      wheelSpinPauseBtnEl.textContent = "Wznów";
      wheelSpinPauseBtnEl.classList.add("admin-kary-btn-danger");
      wheelSpinPauseBtnEl.setAttribute("aria-pressed", "true");
      return;
    }

    wheelSpinPauseBtnEl.textContent = "Zatrzymaj";
    wheelSpinPauseBtnEl.classList.remove("admin-kary-btn-danger");
    wheelSpinPauseBtnEl.setAttribute("aria-pressed", "false");
  }

  function setSpinPausedState(nextPaused) {
    if (!spinning || !spinAnimation) {
      spinPaused = false;
      spinPauseStartedAt = 0;
      updateSpinPauseButton();
      return false;
    }

    const shouldPause = Boolean(nextPaused);
    if (spinPaused === shouldPause) {
      updateSpinPauseButton();
      return spinPaused;
    }

    spinPaused = shouldPause;
    if (spinPaused) {
      spinPauseStartedAt = performance.now();
    }
    updateSpinPauseButton();
    return spinPaused;
  }

  /* =========================
     ANIMATION
  ========================= */

  function easeOutQuart(value) {
    const t = Math.max(0, Math.min(1, value));
    return 1 - Math.pow(1 - t, 4);
  }

  function runSpinFrame(timestamp) {
    if (!spinAnimation) return;

    if (spinPaused) {
      if (!spinPauseStartedAt) {
        spinPauseStartedAt = timestamp;
      }
      requestAnimationFrame(runSpinFrame);
      return;
    }

    if (spinPauseStartedAt > 0) {
      spinAnimation.start += timestamp - spinPauseStartedAt;
      spinPauseStartedAt = 0;
    }

    const elapsed = timestamp - spinAnimation.start;
    const progress = Math.min(1, elapsed / spinAnimation.duration);
    const eased = easeOutQuart(progress);
    angle = spinAnimation.from + (spinAnimation.to - spinAnimation.from) * eased;

    tickSound();
    draw();

    if (progress < 1) {
      requestAnimationFrame(runSpinFrame);
      return;
    }

    angle = spinAnimation.to;
    spinning = false;
    spinPaused = false;
    spinPauseStartedAt = 0;
    updateSpinPauseButton();
    const winnerIndex = spinAnimation.winnerIndex;
    spinAnimation = null;
    finishSpin(winnerIndex);
  }

  /* =========================
     SPIN
  ========================= */

  function spin() {
    primeTickAudioPlayback();
    if (!wheelItems.length) return;

    const totalChance = getChanceTotal(wheelItems);
    if (totalChance !== 100) {
      const result = document.getElementById("obsWheelResult");
      if (result) {
        result.textContent = `BLAD: Suma szans = ${totalChance}% (musi byc 100%).`;
        result.style.transform = "scale(1)";
      }
      updateChanceValidation(wheelItems);
      return;
    }

    if (spinning) {
      queue.push(true);
      return;
    }

    const winnerIndex = rollWinnerIndex();
    const target = winnerAngleForIndex(winnerIndex);
    const current = normalizeAngle(angle);
    const delta = normalizeAngle(target - current);
    const speedMultiplier = clampSpinSpeed(spinSpeed);
    const fullTurns = 6 + Math.random() * 2.5;
    const spinDuration = Math.max(1400, Math.round((4600 + Math.random() * 700) / speedMultiplier));

    lastTickSegment = getSegment();
    spinning = true;
    spinPaused = false;
    spinPauseStartedAt = 0;
    spinAnimation = {
      start: performance.now(),
      duration: spinDuration,
      from: angle,
      to: angle + fullTurns * TWO_PI + delta,
      winnerIndex
    };
    updateSpinPauseButton();

    requestAnimationFrame(runSpinFrame);
  }

  /* =========================
     MULTI SPIN
  ========================= */

  function normalizeSeriesSpinCount(value, fallback = 1) {
    const parsed = Math.floor(safeNumber(value, fallback));
    if (!Number.isFinite(parsed) || parsed < 1) {
      return Math.max(1, Math.min(MAX_SERIES_SPINS, Math.floor(safeNumber(fallback, 1))));
    }
    return Math.max(1, Math.min(MAX_SERIES_SPINS, parsed));
  }

  function queueSpin(count = 1) {
    const total = normalizeSeriesSpinCount(count, 1);
    for (let i = 0; i < total; i += 1) {
      queue.push(true);
    }
    if (!spinning) {
      queue.shift();
      spin();
    }
  }

  /* =========================
     URL TRIGGER
  ========================= */

  function isObsOverlayFlagEnabled(value) {
    const normalized = String(value || "").trim().toLowerCase();
    return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
  }

  function detectObsOverlayMode() {
    if (typeof window.__takuuObsOverlayMode === "boolean") {
      return window.__takuuObsOverlayMode;
    }

    try {
      const params = new URLSearchParams(window.location.search || "");
      const value = String(params.get("obs") || params.get("overlay") || "");
      if (isObsOverlayFlagEnabled(value)) {
        return true;
      }
    } catch (_error) {
      // Ignore URLSearchParams failures.
    }

    try {
      const decodedHref = decodeURIComponent(String(window.location.href || ""));
      const match = decodedHref.match(/(?:[?&#]|%3f|%26)(obs|overlay)=([^&#]+)/i);
      if (match && isObsOverlayFlagEnabled(match[2])) {
        return true;
      }
    } catch (_error) {
      // Ignore decode errors.
    }

    const path = String(window.location.pathname || "").toLowerCase();
    const isAdminPath = /(^|\/)admin(\/|$)/i.test(path);
    const userAgent = String(window.navigator?.userAgent || "").toLowerCase();
    const isObsUserAgent = userAgent.includes("obs") || userAgent.includes("obsbrowser") || userAgent.includes("obs-studio");
    return isAdminPath && isObsUserAgent;
  }

  let params = null;
  try {
    params = new URLSearchParams(window.location.search || "");
  } catch (_error) {
    params = {
      has: () => false,
      get: () => ""
    };
  }

  const isObsOverlayMode = detectObsOverlayMode();

  function applyObsOverlayMode() {
    if (!isObsOverlayMode) return;

    document.body.classList.add("obs-wheel-overlay");

    const adminPanel = document.getElementById("adminPanel");
    const adminDashboard = document.getElementById("adminDashboard");
    const streamObsTab = document.getElementById("adminStreamObsTab");
    const tabButtons = document.querySelectorAll(".admin-tab-btn");
    const tabsToHide = ["adminMembersTab", "adminKaryTab", "adminAccountsTab"];

    if (adminPanel) {
      adminPanel.hidden = true;
      adminPanel.style.display = "none";
    }
    if (adminDashboard) {
      adminDashboard.hidden = false;
      adminDashboard.style.display = "";
    }
    if (streamObsTab) {
      streamObsTab.hidden = false;
      streamObsTab.classList.add("is-active");
    }

    tabsToHide.forEach((id) => {
      const tab = document.getElementById(id);
      if (!tab) return;
      tab.hidden = true;
      tab.classList.remove("is-active");
    });

    tabButtons.forEach((button) => {
      const active = String(button.dataset.tab || "") === "streamobs";
      button.classList.toggle("is-active", active);
    });
  }

  const CANONICAL_WHEEL_DOMAIN = "taku-live.pl";
  const CANONICAL_WHEEL_ORIGIN = `https://${CANONICAL_WHEEL_DOMAIN}`;

  function buildBaseWheelUrl() {
    let url = null;
    try {
      url = new URL(window.location.href);
    } catch (_error) {
      url = new URL(`${CANONICAL_WHEEL_ORIGIN}/admin`);
    }

    const protocol = String(url.protocol || "").toLowerCase();
    const host = String(url.hostname || "").toLowerCase();
    const isCanonicalHost = host === CANONICAL_WHEEL_DOMAIN || host === `www.${CANONICAL_WHEEL_DOMAIN}`;
    const isFileProtocol = protocol === "file:";

    // Keep current origin for local/staging environments.
    // Normalize only when we are already on canonical domain.
    if (isFileProtocol) {
      url = new URL("http://localhost:5500/admin");
    } else if (isCanonicalHost) {
      url.protocol = "https:";
      if (host === `www.${CANONICAL_WHEEL_DOMAIN}`) {
        url.hostname = CANONICAL_WHEEL_DOMAIN;
      }
    }
    if (!/(^|\/)admin(\/|$)/i.test(url.pathname)) {
      url.pathname = "/admin";
    }

    url.hash = "";
    url.search = "";
    return url;
  }

  function buildWheelUrl(paramsMap) {
    const url = buildBaseWheelUrl();
    const entries = paramsMap && typeof paramsMap === "object" ? Object.entries(paramsMap) : [];
    entries.forEach(([key, value]) => {
      url.searchParams.set(String(key), String(value));
    });
    return url.toString();
  }

  function buildStreamObsLinks() {
    return [
      {
        id: "obs_overlay",
        title: "OBS - Kolo Overlay",
        description: "Link do Browser Source w OBS. Pokazuje tylko kolo i wynik na przezroczystym tle.",
        url: buildWheelUrl({ obs: 1 })
      },
      {
        id: "streamdeck_spin1",
        title: "StreamDeck - Spin x1",
        description: "Link do przycisku StreamDeck. Po otwarciu uruchamia jeden spin (test lub akcja live).",
        url: buildWheelUrl({ obs: 1, spin: 1 })
      },
      {
        id: "streamdeck_spin3",
        title: "StreamDeck - Spin x3",
        description: "Link do przycisku StreamDeck. Po otwarciu uruchamia serie trzech spinow.",
        url: buildWheelUrl({ obs: 1, spin: 3 })
      }
    ];
  }

  async function copyTextToClipboard(text) {
    const value = String(text || "");
    if (!value) return false;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        return true;
      }
    } catch (_error) {
      // Fallback below.
    }

    try {
      const temp = document.createElement("textarea");
      temp.value = value;
      temp.setAttribute("readonly", "");
      temp.style.position = "fixed";
      temp.style.top = "-9999px";
      temp.style.left = "-9999px";
      document.body.appendChild(temp);
      temp.focus();
      temp.select();
      const success = document.execCommand("copy");
      document.body.removeChild(temp);
      return Boolean(success);
    } catch (_error) {
      return false;
    }
  }

  function setStreamObsLinksStatus(message, tone) {
    const statusEl = document.getElementById("streamObsLinksStatus");
    if (!statusEl) return;
    statusEl.textContent = String(message || "").trim();
    statusEl.classList.remove("is-error", "is-success", "is-info");
    if (tone === "error") {
      statusEl.classList.add("is-error");
    } else if (tone === "success") {
      statusEl.classList.add("is-success");
    } else if (tone === "info") {
      statusEl.classList.add("is-info");
    }
  }

  function createLinkCard(item) {
    const card = document.createElement("article");
    card.className = "streamobs-link-card";

    const title = document.createElement("h5");
    title.className = "streamobs-link-title";
    title.textContent = item.title;

    const description = document.createElement("p");
    description.className = "streamobs-link-desc";
    description.textContent = item.description;

    const row = document.createElement("div");
    row.className = "streamobs-link-row";

    const input = document.createElement("input");
    input.className = "streamobs-link-input";
    input.type = "text";
    input.readOnly = true;
    input.value = item.url;
    input.setAttribute("aria-label", item.title);

    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className = "admin-kary-btn";
    copyBtn.textContent = "Kopiuj";
    copyBtn.addEventListener("click", async () => {
      const ok = await copyTextToClipboard(item.url);
      if (ok) {
        setStreamObsLinksStatus(`Skopiowano link: ${item.title}`, "success");
      } else {
        setStreamObsLinksStatus("Nie udalo sie skopiowac linku. Skopiuj URL recznie z pola.", "error");
      }
    });

    row.appendChild(input);
    row.appendChild(copyBtn);

    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(row);
    return card;
  }

  function renderStreamOBSLinks() {
    const wrap = document.getElementById("streamObsLinks");
    if (!wrap) return;

    wrap.innerHTML = "";
    const links = buildStreamObsLinks();
    links.forEach((item) => {
      wrap.appendChild(createLinkCard(item));
    });

    setStreamObsLinksStatus("", "info");
  }

  if (params.has("spin")) {
    const count = safeNumber(params.get("spin"), 1);
    setTimeout(() => {
      queueSpin(count);
    }, 450);
  }

  function syncSpinSpeedUi() {
    if (wheelSpinSpeedRangeEl) {
      wheelSpinSpeedRangeEl.value = String(Math.round(clampSpinSpeed(spinSpeed) * 100));
    }
    if (wheelSpinSpeedValueEl) {
      wheelSpinSpeedValueEl.textContent = formatSpinSpeedLabel(spinSpeed);
    }
  }

  function setWheelSpinSpeed(value, options = {}) {
    const persist = options.persist !== false;
    spinSpeed = clampSpinSpeed(value);
    syncSpinSpeedUi();
    if (persist) {
      persistSpinSpeed(spinSpeed);
    }
    return spinSpeed;
  }

  function bindSpinSpeedControl() {
    syncSpinSpeedUi();
    if (!wheelSpinSpeedRangeEl) {
      return;
    }

    wheelSpinSpeedRangeEl.addEventListener("input", () => {
      const percent = safeNumber(wheelSpinSpeedRangeEl.value, 100);
      setWheelSpinSpeed(percent / 100);
    });

    wheelSpinSpeedRangeEl.addEventListener("change", () => {
      const normalized = clampSpinSpeed(safeNumber(wheelSpinSpeedRangeEl.value, 100) / 100);
      emitWheelConfigWebhook("config_speed_change", {
        speedPercent: Math.round(normalized * 100),
        speedMultiplier: normalized
      });
    });
  }

  /* =========================
     STREAMOBS PANEL
  ========================= */

  let dragSourceIndex = -1;
  let dragOverRow = null;
  let wheelConfigEventsBound = false;
  let wheelConfigPanelOpen = false;

  function applyWheelConfigPanelVisibility() {
    const toggleBtn = document.getElementById("wheelConfigToggle");
    const body = document.getElementById("wheelConfigBody");
    if (!toggleBtn || !body) return;

    body.hidden = !wheelConfigPanelOpen;
    toggleBtn.setAttribute("aria-expanded", wheelConfigPanelOpen ? "true" : "false");
    toggleBtn.textContent = wheelConfigPanelOpen ? "Ukryj konfiguracje koła" : "Konfiguracje koła";
  }

  function bindWheelConfigToggle() {
    const toggleBtn = document.getElementById("wheelConfigToggle");
    const body = document.getElementById("wheelConfigBody");
    if (!toggleBtn || !body || toggleBtn.dataset.bound === "1") return;

    wheelConfigPanelOpen = false;
    applyWheelConfigPanelVisibility();

    toggleBtn.addEventListener("click", () => {
      wheelConfigPanelOpen = !wheelConfigPanelOpen;
      applyWheelConfigPanelVisibility();
    });

    toggleBtn.dataset.bound = "1";
  }

  function getChanceTotal(items) {
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, item) => {
      return sum + Math.max(0, Math.floor(safeNumber(item?.chance, 0)));
    }, 0);
  }

  function setWheelChanceStatus(message, tone) {
    const statusEl = document.getElementById("wheelChanceStatus");
    if (!statusEl) return;

    statusEl.textContent = String(message || "").trim();
    statusEl.classList.remove("is-error", "is-success", "is-info");
    if (tone === "error") {
      statusEl.classList.add("is-error");
    } else if (tone === "success") {
      statusEl.classList.add("is-success");
    } else if (tone === "info") {
      statusEl.classList.add("is-info");
    }
  }

  function buildWheelConfigWebhookDetails(itemsCandidate = wheelItems) {
    const items = normalizeItems(Array.isArray(itemsCandidate) ? itemsCandidate : wheelItems);
    return {
      segmentsCount: items.length,
      chanceTotal: getChanceTotal(items),
      segments: items.slice(0, 12).map((item, index) => {
        return `${index + 1}. ${item.name} [${item.chance}% | ${item.minutes}m]`;
      }),
      segmentsTruncated: items.length > 12
    };
  }

  function emitWheelConfigWebhook(action, details = {}) {
    if (!window.TakuuWebhook || typeof window.TakuuWebhook.sendWheelConfigAudit !== "function") {
      return;
    }
    Promise.resolve(window.TakuuWebhook.sendWheelConfigAudit(action, details)).catch(() => {
      // Ignore webhook failures in UI flow.
    });
  }

  function updateChanceValidation(itemsCandidate) {
    const items = normalizeItems(Array.isArray(itemsCandidate) ? itemsCandidate : collectItemsFromPanel());
    const total = getChanceTotal(items);
    const isValid = total === 100;
    const saveBtn = document.getElementById("wheelSave");

    if (saveBtn) {
      saveBtn.disabled = !isValid;
    }

    if (isValid) {
      setWheelChanceStatus("Suma szans: 100% (OK).", "success");
    } else {
      setWheelChanceStatus(`Suma szans musi wynosic 100%. Aktualnie: ${total}%.`, "error");
    }

    return isValid;
  }

  function escapeHtmlAttribute(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function createNewSegment(index) {
    return normalizeItem(
      {
        name: `Nowy segment ${index + 1}`,
        chance: 0,
        timer: null,
        minutes: 0,
        color: DEFAULT_COLORS[index % DEFAULT_COLORS.length]
      },
      index
    );
  }

  function collectItemsFromPanel() {
    const rows = Array.from(document.querySelectorAll(".wheelRow"));
    if (!rows.length) {
      return wheelItems.map((item) => ({ ...item }));
    }

    return rows.map((row, index) => {
      const prev = wheelItems[index] || {};
      const nameInput = row.querySelector("[data-wheel-name]");
      const chanceInput = row.querySelector("[data-wheel-chance]");
      const minutesInput = row.querySelector("[data-wheel-minutes]");
      const colorInput = row.querySelector("[data-wheel-color]");
      const name = String(nameInput?.value || "").trim() || prev.name || `Pole ${index + 1}`;
      const chance = Math.max(0, Math.floor(safeNumber(chanceInput?.value, prev.chance || 0)));
      const minutes = Math.max(0, Math.floor(safeNumber(minutesInput?.value, prev.minutes || 0)));
      const timer = resolveWheelTimerKey(prev.timer, name, minutes);

      return {
        name,
        chance,
        minutes,
        timer,
        color: normalizeColor(colorInput?.value || prev.color, index)
      };
    });
  }

  function focusSegmentNameInput(index) {
    const row = document.querySelector(`.wheelRow[data-row-index="${index}"]`);
    if (!row) {
      return;
    }
    const nameInput = row.querySelector("[data-wheel-name]");
    if (nameInput instanceof HTMLInputElement) {
      nameInput.focus();
      nameInput.select();
    }
    if (typeof row.scrollIntoView === "function") {
      row.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function addSegmentRow() {
    const currentItems = normalizeItems(collectItemsFromPanel());
    const nextIndex = currentItems.length;
    wheelItems = normalizeItems([...currentItems, createNewSegment(nextIndex)]);
    clearDragVisuals();
    dragSourceIndex = -1;
    renderStreamOBSPanel();
    draw();
    focusSegmentNameInput(nextIndex);

    const added = wheelItems[nextIndex] || null;
    emitWheelConfigWebhook("config_segment_add", {
      index: nextIndex + 1,
      name: added ? added.name : `Pole ${nextIndex + 1}`,
      ...buildWheelConfigWebhookDetails(wheelItems)
    });
  }

  function removeSegmentRow(index) {
    const currentItems = normalizeItems(collectItemsFromPanel());
    if (currentItems.length <= 1) {
      setWheelChanceStatus("Musi zostac przynajmniej 1 segment.", "error");
      return false;
    }
    if (!Number.isInteger(index) || index < 0 || index >= currentItems.length) {
      return false;
    }

    const removedSegment = currentItems[index] || null;
    wheelItems = normalizeItems(currentItems.filter((_, itemIndex) => itemIndex !== index));
    clearDragVisuals();
    dragSourceIndex = -1;
    renderStreamOBSPanel();
    draw();
    emitWheelConfigWebhook("config_segment_remove", {
      index: index + 1,
      name: removedSegment ? removedSegment.name : "",
      ...buildWheelConfigWebhookDetails(wheelItems)
    });
    return true;
  }

  function moveItem(items, fromIndex, toIndex) {
    const list = Array.isArray(items) ? [...items] : [];
    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= list.length ||
      toIndex >= list.length ||
      fromIndex === toIndex
    ) {
      return list;
    }
    const [moved] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, moved);
    return list;
  }

  function clearDragVisuals() {
    const rows = document.querySelectorAll(".wheelRow");
    rows.forEach((row) => {
      row.classList.remove("is-dragging", "is-drag-over");
    });
    dragOverRow = null;
  }

  function updateWheelPreviewFromPanel() {
    const currentItems = normalizeItems(collectItemsFromPanel());
    wheelItems = currentItems;
    updateChanceValidation(currentItems);
    draw();
  }

  function bindWheelConfigEvents() {
    const panel = document.getElementById("wheelConfig");
    if (!panel || wheelConfigEventsBound) return;
    wheelConfigEventsBound = true;

    panel.addEventListener("input", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (
        !target.matches("[data-wheel-name]") &&
        !target.matches("[data-wheel-chance]") &&
        !target.matches("[data-wheel-minutes]") &&
        !target.matches("[data-wheel-color]")
      ) {
        return;
      }
      updateWheelPreviewFromPanel();
    });

    panel.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.matches("[data-wheel-color]")) return;
      updateWheelPreviewFromPanel();
    });

    panel.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const removeBtn = target.closest("[data-wheel-remove]");
      if (!removeBtn) return;

      event.preventDefault();
      const rowIndex = Number(removeBtn.getAttribute("data-wheel-remove"));
      removeSegmentRow(rowIndex);
    });

    panel.addEventListener("dragstart", (event) => {
      const handle = event.target instanceof HTMLElement ? event.target.closest(".wheelDragHandle") : null;
      if (!handle) {
        event.preventDefault();
        return;
      }
      const row = handle.closest(".wheelRow");
      if (!row) return;

      const rowIndex = Number(row.getAttribute("data-row-index"));
      if (!Number.isInteger(rowIndex) || rowIndex < 0) {
        event.preventDefault();
        return;
      }

      dragSourceIndex = rowIndex;
      row.classList.add("is-dragging");

      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.dropEffect = "move";
        event.dataTransfer.setData("text/plain", String(rowIndex));
      }
    });

    panel.addEventListener("dragover", (event) => {
      const row = event.target instanceof HTMLElement ? event.target.closest(".wheelRow") : null;
      if (!row || dragSourceIndex < 0) return;

      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
      }

      if (dragOverRow && dragOverRow !== row) {
        dragOverRow.classList.remove("is-drag-over");
      }
      dragOverRow = row;
      row.classList.add("is-drag-over");
    });

    panel.addEventListener("drop", (event) => {
      const row = event.target instanceof HTMLElement ? event.target.closest(".wheelRow") : null;
      if (!row) return;

      event.preventDefault();

      const targetIndex = Number(row.getAttribute("data-row-index"));
      const sourceFromData = Number(event.dataTransfer?.getData("text/plain"));
      const sourceIndex = Number.isInteger(sourceFromData) && sourceFromData >= 0 ? sourceFromData : dragSourceIndex;

      if (!Number.isInteger(sourceIndex) || sourceIndex < 0 || !Number.isInteger(targetIndex) || targetIndex < 0) {
        clearDragVisuals();
        dragSourceIndex = -1;
        return;
      }

      const currentItems = normalizeItems(collectItemsFromPanel());
      const reordered = moveItem(currentItems, sourceIndex, targetIndex);
      wheelItems = normalizeItems(reordered);
      emitWheelConfigWebhook("config_reorder", {
        fromIndex: sourceIndex + 1,
        toIndex: targetIndex + 1,
        ...buildWheelConfigWebhookDetails(wheelItems)
      });

      clearDragVisuals();
      dragSourceIndex = -1;
      renderStreamOBSPanel();
      draw();
    });

    panel.addEventListener("dragleave", (event) => {
      const row = event.target instanceof HTMLElement ? event.target.closest(".wheelRow") : null;
      if (!row) return;
      const related = event.relatedTarget instanceof HTMLElement ? event.relatedTarget : null;
      if (related && row.contains(related)) return;
      row.classList.remove("is-drag-over");
      if (dragOverRow === row) {
        dragOverRow = null;
      }
    });

    panel.addEventListener("dragend", () => {
      clearDragVisuals();
      dragSourceIndex = -1;
    });
  }

  function renderStreamOBSPanel() {
    const panel = document.getElementById("wheelConfig");
    if (!panel) return;

    bindWheelConfigEvents();

    panel.innerHTML = wheelItems
      .map((item, i) => {
        const isNewSegment = /^nowy segment\b/i.test(String(item.name || "").trim());
        const nameValue = isNewSegment ? "" : String(item.name || "");
        const chanceValue = isNewSegment && safeNumber(item.chance, 0) === 0 ? "" : String(Math.max(0, Math.floor(safeNumber(item.chance, 0))));
        const minutesValue = isNewSegment && safeNumber(item.minutes, 0) === 0 ? "" : String(Math.max(0, Math.floor(safeNumber(item.minutes, 0))));

        return `
<div class="wheelRow" data-row-index="${i}">
  <button class="wheelDragHandle" type="button" draggable="true" title="Przeciagnij, aby zmienic kolejnosc" aria-label="Przeciagnij segment ${i + 1}">
    <span class="wheelDragDots" aria-hidden="true">::</span>
  </button>
  <input data-wheel-name="${i}" value="${escapeHtmlAttribute(nameValue)}" placeholder="nazwa">
  <input data-wheel-chance="${i}" type="number" value="${chanceValue}" min="0" step="1" placeholder="%">
  <input data-wheel-minutes="${i}" type="number" value="${minutesValue}" min="0" step="1" placeholder="czas">
  <input class="wheelColorInput" data-wheel-color="${i}" type="color" value="${normalizeColor(item.color, i)}" aria-label="Kolor segmentu ${item.name}">
  <button class="wheelDeleteBtn" type="button" data-wheel-remove="${i}" title="Usun segment ${i + 1}" aria-label="Usun segment ${i + 1}">x</button>
</div>`;
      })
      .join("");

    updateChanceValidation(wheelItems);
  }

  function saveItems(items) {
    wheelItems = normalizeItems(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wheelItems));
    } catch (_error) {
      // Ignore storage write failures.
    }
    emitWheelStatsEvent("takuu:wheel-config-updated", {
      items: wheelItems.map((item) => ({ ...item }))
    });
  }

  document.getElementById("wheelSave")?.addEventListener("click", () => {
    const items = normalizeItems(collectItemsFromPanel());
    if (!updateChanceValidation(items)) {
      return;
    }
    saveItems(items);
    draw();
    renderStreamOBSPanel();
    emitWheelConfigWebhook("config_save", buildWheelConfigWebhookDetails(items));
  });

  document.getElementById("wheelAddSegment")?.addEventListener("click", () => {
    addSegmentRow();
  });

  /* =========================
     ADMIN SPIN BUTTONS
  ========================= */

  if (OBS_AUDIO_MODE) {
    document.addEventListener("pointerdown", primeTickAudioPlayback, { once: true });
    document.addEventListener("keydown", primeTickAudioPlayback, { once: true });
  }

  document.getElementById("wheelSpinNow")?.addEventListener("click", () => {
    primeTickAudioPlayback();
    spin();
  });

  document.getElementById("wheelSpin3")?.addEventListener("click", () => {
    primeTickAudioPlayback();
    queueSpin(3);
  });

  if (wheelSpinPauseBtnEl) {
    wheelSpinPauseBtnEl.addEventListener("click", () => {
      primeTickAudioPlayback();
      setSpinPausedState(!spinPaused);
    });
  }

  if (wheelSpinSeriesCountEl) {
    wheelSpinSeriesCountEl.addEventListener("change", () => {
      const normalizedCount = normalizeSeriesSpinCount(wheelSpinSeriesCountEl.value, 1);
      wheelSpinSeriesCountEl.value = String(normalizedCount);
    });
  }

  if (wheelSpinSeriesBtnEl) {
    wheelSpinSeriesBtnEl.addEventListener("click", () => {
      primeTickAudioPlayback();
      const count = normalizeSeriesSpinCount(wheelSpinSeriesCountEl ? wheelSpinSeriesCountEl.value : 1, 1);
      if (wheelSpinSeriesCountEl) {
        wheelSpinSeriesCountEl.value = String(count);
      }
      queueSpin(count);
    });
  }

  /* =========================
     WEBSOCKET
  ========================= */

  function handleWheelSocketMessage(rawMessage) {
    const message = rawMessage && typeof rawMessage === "object" ? rawMessage : {};
    const messageType = String(message.type || "").trim().toLowerCase();

    if (messageType === "spin") {
      if (!isObsOverlayMode) {
        return;
      }
      primeTickAudioPlayback();
      queueSpin(safeNumber(message.count, 1));
      return;
    }

    const isSyncEnvelope =
      messageType === "wheel_sync_result" ||
      messageType === "wheel_sync" ||
      messageType === "wheel_result";

    if (isSyncEnvelope && message.payload && typeof message.payload === "object") {
      handleIncomingWinnerSync(message.payload);
      return;
    }

    if (String(message.type || "").trim().toLowerCase() === "winner") {
      handleIncomingWinnerSync(message);
    }
  }

  function connectWheelSocket() {
    if (!WHEEL_WS_ENABLED || typeof WebSocket !== "function") {
      return;
    }
    try {
      wheelSocket = new WebSocket(WHEEL_WS_URL);
      wheelSocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleWheelSocketMessage(message);
        } catch (_error) {
          // Ignore malformed messages.
        }
      };
      wheelSocket.onclose = () => {
        wheelSocket = null;
      };
      wheelSocket.onerror = () => {
        // Ignore websocket errors.
      };
    } catch (_error) {
      wheelSocket = null;
      // Ignore websocket connection failures.
    }
  }

  initWheelSyncBridge();
  connectWheelSocket();

  /* =========================
     GLOBAL API
  ========================= */

  window.TakuuWheel = {
    spin,
    queueSpin,
    pause: () => setSpinPausedState(true),
    resume: () => {
      if (!spinning || !spinAnimation) {
        return false;
      }
      setSpinPausedState(false);
      return !spinPaused;
    },
    togglePause: () => setSpinPausedState(!spinPaused),
    isPaused: () => Boolean(spinning && spinPaused),
    getItems: () => wheelItems.map((item) => ({ ...item })),
    getSpinSpeed: () => spinSpeed,
    setSpinSpeed: (value) => {
      const numeric = safeNumber(value, DEFAULT_SPIN_SPEED);
      const normalized = numeric > MAX_SPIN_SPEED ? numeric / 100 : numeric;
      return setWheelSpinSpeed(normalized);
    },
    setItems: (items) => {
      const normalized = normalizeItems(items);
      if (!updateChanceValidation(normalized)) {
        return false;
      }
      saveItems(normalized);
      renderStreamOBSPanel();
      draw();
      emitWheelConfigWebhook("config_set_items", {
        source: "TakuuWheel.setItems",
        ...buildWheelConfigWebhookDetails(normalized)
      });
      return true;
    },
    stats: () => [...history],
    simulateChances: (spins = 10000) => simulateChanceDistribution(spins)
  };

  /* ========================= */

  bindWheelConfigToggle();
  renderStreamOBSLinks();
  bindSpinSpeedControl();
  renderStreamOBSPanel();
  applyWheelConfigPanelVisibility();
  startTickAudioWarmupLoop();
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && OBS_AUDIO_MODE) {
      primeTickAudioPlayback();
    }
  });
  draw();
  updateSpinPauseButton();
  window.addEventListener("load", applyObsOverlayMode);
})();
