const CHANNEL_SLUG = "takuu";
    const JINA_PREFIX = "https://r.jina.ai/";
    const ALL_ORIGINS_RAW_PREFIX = "https://api.allorigins.win/raw?url=";
    const CORS_PROXY_PREFIX = "https://corsproxy.io/?";
    const LOCAL_KICK_CLIPS_ENDPOINT = "/api/kick/clips";
    const LOCAL_KICK_CHANNEL_ENDPOINT = "/api/kick/channel";
    const LOCAL_KICK_SUBSCRIPTIONS_ENDPOINT = "/api/kick/subscriptions";
    const LOCAL_KICK_OAUTH_START_ENDPOINT = "/api/kick/oauth/start";
    const LOCAL_KICK_OAUTH_STATUS_ENDPOINT = "/api/kick/oauth/status";
    const LOCAL_KICK_OAUTH_UNLINK_ENDPOINT = "/api/kick/oauth/unlink";
    const KICK_SUBS_LAST_COUNT_STORAGE_KEY = `takuu:kick:last-subs-goal:${CHANNEL_SLUG}`;
    const CLIPS_MAX_ITEMS = 200; // liczba ładowania klipów w /klipy
    const CHANNEL_AVATAR_FALLBACK = "https://files.kick.com/images/user/196056/profile_image/conversion/5ed75600-4d1e-40ed-afb8-b2731a02ba10-fullsize.webp";
    const KICK_ICON_URL = "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/webp/kick.webp";
    const clipsEl = document.getElementById("clips");
    const statusEl = document.getElementById("status");
    const refreshBtn = document.getElementById("refreshBtn");
    const streamShellEl = document.querySelector(".stream-shell");
    const streamLayoutEl = document.querySelector(".stream-layout");
    const routePlaceholderEl = document.getElementById("routePlaceholder");
    const routeBadgeEl = document.getElementById("routeBadge");
    const statsPanelEl = document.getElementById("statsPanel");
    const statsRefreshBtnEl = document.getElementById("statsRefreshBtn");
    const wheelStatsSummaryEl = document.getElementById("wheelStatsSummary");
    const wheelStatsSegmentBodyEl = document.getElementById("wheelStatsSegmentBody");
    const wheelStatsRecentListEl = document.getElementById("wheelStatsRecentList");
    const karyTimerStatsGridEl = document.getElementById("karyTimerStatsGrid");
    const karyCounterStatsGridEl = document.getElementById("karyCounterStatsGrid");
    const karyPanelEl = document.getElementById("karyPanel");
    const timeryPanelEl = document.getElementById("timeryPanel");
    const timeryConfigBtnEl = document.getElementById("timeryConfigBtn");
    const timeryConfigPanelEl = document.getElementById("timeryConfigPanel");
    const timeryLayoutSelectEl = document.getElementById("timeryLayoutSelect");
    const timeryBgColorInputEl = document.getElementById("timeryBgColorInput");
    const timeryShowTitleEl = document.getElementById("timeryShowTitle");
    const timeryShowProgressEl = document.getElementById("timeryShowProgress");
    const timeryShowStatusEl = document.getElementById("timeryShowStatus");
    const licznikiPanelEl = document.getElementById("licznikiPanel");
    const licznikiConfigBtnEl = document.getElementById("licznikiConfigBtn");
    const licznikiConfigPanelEl = document.getElementById("licznikiConfigPanel");
    const licznikiLayoutSelectEl = document.getElementById("licznikiLayoutSelect");
    const licznikiBgColorInputEl = document.getElementById("licznikiBgColorInput");
    const licznikiShowTitleEl = document.getElementById("licznikiShowTitle");
    const licznikiShowStatusEl = document.getElementById("licznikiShowStatus");
    const licznikiShowValueEl = document.getElementById("licznikiShowValue");
    const adminPanelEl = document.getElementById("adminPanel");
    const adminDashboardEl = document.getElementById("adminDashboard");
    const adminLoginFormEl = document.getElementById("adminLoginForm");
    const adminLoginStatusEl = document.getElementById("adminLoginStatus");
    const adminDiscordStatusEl = document.getElementById("adminDiscordStatus");
    const adminLoginPasswordEl = document.getElementById("adminLoginPassword");
    const adminPasswordToggleEl = document.getElementById("adminPasswordToggle");
    const adminPasswordToggleIconEl = document.getElementById("adminPasswordToggleIcon");
    const adminRememberMeEl = document.getElementById("adminRememberMe");
    const adminShowPasswordEl = document.getElementById("adminShowPassword");
    const adminDiscordLoginBtnEl = document.getElementById("adminDiscordLoginBtn");
    const adminLogoutBtnEl = document.getElementById("adminLogoutBtn");
    const adminTabsWrapEl = document.querySelector(".admin-tabs");
    const adminMembersTabEl = document.getElementById("adminMembersTab");
    const adminKaryTabEl = document.getElementById("adminKaryTab");
    const adminBindingsTabEl = document.getElementById("adminBindingsTab");
    const adminStreamObsTabEl = document.getElementById("adminStreamObsTab");
    const adminAccountsTabEl = document.getElementById("adminAccountsTab");
    const streamObsLinksEl = document.getElementById("streamObsLinks");
    const streamObsLinksStatusEl = document.getElementById("streamObsLinksStatus");
    const streamObsTimeryConfigToggleEl = document.getElementById("streamObsTimeryConfigToggle");
    const streamObsTimeryConfigBodyEl = document.getElementById("streamObsTimeryConfigBody");
    const streamObsTimeryLayoutSelectEl = document.getElementById("streamObsTimeryLayoutSelect");
    const streamObsTimeryColorInputEl = document.getElementById("streamObsTimeryColorInput");
    const streamObsTimeryProgressColorInputEl = document.getElementById("streamObsTimeryProgressColorInput");
    const streamObsLicznikiConfigToggleEl = document.getElementById("streamObsLicznikiConfigToggle");
    const streamObsLicznikiConfigBodyEl = document.getElementById("streamObsLicznikiConfigBody");
    const streamObsLicznikiLayoutSelectEl = document.getElementById("streamObsLicznikiLayoutSelect");
    const streamObsLicznikiColorInputEl = document.getElementById("streamObsLicznikiColorInput");
    const adminMemberFormEl = document.getElementById("adminMemberForm");
    const adminMemberSubmitBtnEl = adminMemberFormEl ? adminMemberFormEl.querySelector('button[type="submit"]') : null;
    const adminMemberStatusEl = document.getElementById("adminMemberStatus");
    const adminMembersTableBodyEl = document.getElementById("adminMembersTableBody");
    const adminTimerFormEl = document.getElementById("adminTimerForm");
    const adminCounterFormEl = document.getElementById("adminCounterForm");
    const adminTimerSelectEl = document.getElementById("adminTimerSelect");
    const adminCounterSelectEl = document.getElementById("adminCounterSelect");
    const adminKaryStatusEl = document.getElementById("adminKaryStatus");
    const adminCennikFormEl = document.getElementById("adminCennikForm");
    const adminCennikCancelBtnEl = document.getElementById("adminCennikCancelBtn");
    const adminCennikTableBodyEl = document.getElementById("adminCennikTableBody");
    const adminCennikStatusEl = document.getElementById("adminCennikStatus");
    const adminAccountFormEl = document.getElementById("adminAccountForm");
    const adminAccountStatusEl = document.getElementById("adminAccountStatus");
    const adminAccountsTableBodyEl = document.getElementById("adminAccountsTableBody");
    const mainWrapEl = document.querySelector("main.wrap");
    const friendsEl = document.getElementById("friends");
    const friendsGridEl = document.querySelector(".friends-grid");
    const streamIntroActiveCountEl = document.getElementById("streamIntroActiveCount");
    const streamIntroActiveTextEl = document.getElementById("streamIntroActiveText");
    const streamIntroLiveEl = document.getElementById("streamIntroActiveStat");
    const streamIntroFollowersStatEl = document.getElementById("streamIntroFollowersStat");
    const streamIntroFollowersCountEl = document.getElementById("streamIntroFollowersCount");
    const streamIntroFollowersTextEl = document.getElementById("streamIntroFollowersText");
    const streamIntroSubsStatEl = document.getElementById("streamIntroSubsStat");
    const streamIntroSubsCountEl = document.getElementById("streamIntroSubsCount");
    const streamIntroSubsTextEl = document.getElementById("streamIntroSubsText");
    const kickOauthConnectBtnEl = document.getElementById("kickOauthConnectBtn");
    const kickOauthRefreshBtnEl = document.getElementById("kickOauthRefreshBtn");
    const kickOauthUnlinkBtnEl = document.getElementById("kickOauthUnlinkBtn");
    const kickOauthStatusEl = document.getElementById("kickOauthStatus");
    const kickOauthStatusTextEl = document.getElementById("kickOauthStatusText");
    const kickOauthChannelTextEl = document.getElementById("kickOauthChannelText");
    const kickOauthSubscribersTextEl = document.getElementById("kickOauthSubscribersText");
    const kickOauthExpiresTextEl = document.getElementById("kickOauthExpiresText");
    const kickOauthRedirectTextEl = document.getElementById("kickOauthRedirectText");
    const streamIntroTitleEl = document.querySelector(".stream-intro-title");
    const streamIntroTitleAccentEl = streamIntroTitleEl ? streamIntroTitleEl.querySelector(".stream-intro-title-accent") : null;
    const streamIntroSubtitleEl = document.querySelector(".stream-intro-subtitle");
    const streamActiveKaryEl = document.getElementById("streamActiveKary");
    const streamActiveKaryListEl = document.getElementById("streamActiveKaryList");
    const karyCurrencySwitchEl = document.querySelector(".kary-currency-switch");
    const karyPriceListChillEl = document.getElementById("karyPriceListChill");
    const karyPriceListHardEl = document.getElementById("karyPriceListHard");
    const karyPriceEmptyChillEl = document.getElementById("karyPriceEmptyChill");
    const karyPriceEmptyHardEl = document.getElementById("karyPriceEmptyHard");
    const karyJumpButtonEls = document.querySelectorAll("[data-kary-jump]");
    const karyOpenWindowButtonEls = document.querySelectorAll("[data-kary-open-window]");
    const karyTimerCardEls = document.querySelectorAll("[data-kary-timer]");
    const karyCounterCardEls = document.querySelectorAll("[data-kary-counter]");
    const karyNavEl = document.querySelector(".stream-nav-kary");
    const homeNavEl = document.querySelector(".stream-nav-item-home");
    const clipsNavEl = document.querySelector(".stream-nav-item-clips");
    const soonNavEl = document.querySelector(".stream-nav-item-soon");
    const statsNavEl = document.querySelector(".stream-nav-item-stats");
    const adminNavEl = document.querySelector(".stream-log");
    const ctaKaryLinkEl = document.querySelector(".stream-cta-btn-kary");
    const ctaClipsLinkEl = document.querySelector(".stream-cta-btn-clips");
    const CLIP_RENDER_BATCH_SIZE = 24;
    const CLIP_POSTER_EAGER_COUNT = 18;
    const CLIPS_FAST_LOAD_ITEMS = 60;
    const CLIP_SOURCE_TIMEOUT_MS = 2600;
    const CLIP_VIEWER_AUTO_HIDE_DELAY_MS = 2000;
    const downloadInProgress = new Set();
    const ROUTE_BODY_CLASSES = ["route-home", "route-kary", "route-timery", "route-liczniki", "route-clips", "route-soon", "route-stats", "route-login", "route-admin"];
    let menuOutsideCloserBound = false;
    let clipViewerState = null;
    let clipViewerOpenSeq = 0;
    let clipPosterObserver = null;
    let clipRenderFrameId = 0;
    let clipRenderToken = 0;
    let clipsLoadSeq = 0;
    let clipsLoadedOnce = false;
    let introTypingPlayed = false;
    let introTypingTickId = null;
    let introTypingStartDelayId = null;
    let lastAppliedRouteName = "";
    const FRIENDS_LIVE_POLL_MS = 5000;
    const KICK_FOLLOWERS_POLL_MS = 2500;
    const KICK_OAUTH_STATUS_POLL_MS = 2000;
    const KICK_CHANNEL_REQUEST_TIMEOUT_MS = 1600;
    const KICK_CHANNEL_PROXY_TIMEOUT_MS = 1400;
    const KICK_CHANNEL_JINA_TIMEOUT_MS = 1700;
    const KICK_SUBSCRIPTIONS_REQUEST_TIMEOUT_MS = 1800;
    const WHEEL_STATS_LIVE_REFRESH_MS = 1000;
    const WHEEL_STATS_RECENT_LIMIT = 5;
    let friendsLivePollId = null;
    let friendsLivePollBusy = false;
    let friendsLiveRequestSeq = 0;
    let kickFollowersPollId = null;
    let kickFollowersPollBusy = false;
    let kickOAuthStatusPollId = null;
    let kickOAuthStatusBusy = false;
    let cachedKickOAuthStatus = null;
    let lastKnownKickSubsCount = null;
    let wheelStatsLiveRefreshId = null;
    let wheelSyncChannel = null;
    let wheelSyncPollId = null;
    let wheelSyncSocket = null;
    let wheelSyncSocketRetryId = null;
    let wheelSyncApiDisabled = false;
    let wheelStatsApiDisabled = false;
    let wheelSyncLastEventId = 0;
    let wheelSyncCursorInitialized = false;
    let wheelStatsHistoryCache = [];
    const processedWheelSyncEventIds = new Set();
    const processedWheelSyncEventOrder = [];
    const friendsLiveStateBySlug = new Map();
    let timeryPopupRef = null;
    let licznikiPopupRef = null;

    const IS_FILE_PROTOCOL = window.location.protocol === "file:";
    const HOME_ROUTE_PATH = IS_FILE_PROTOCOL ? "index.html" : "/";
    const KARY_ROUTE_PATH = IS_FILE_PROTOCOL ? "index.html?view=kary" : "/kary";
    const TIMERY_ROUTE_PATH = IS_FILE_PROTOCOL ? "index.html?view=timery" : "/timery";
    const LICZNIKI_ROUTE_PATH = IS_FILE_PROTOCOL ? "index.html?view=liczniki" : "/liczniki";
    const CLIPS_ROUTE_PATH = IS_FILE_PROTOCOL ? "index.html?view=klipy" : "/klipy";
    const SOON_ROUTE_PATH = IS_FILE_PROTOCOL ? "index.html?view=soon" : "/soon";
    const STATS_ROUTE_PATH = IS_FILE_PROTOCOL ? "index.html?view=stats" : "/stats";
    const LOGIN_ROUTE_PATH = IS_FILE_PROTOCOL ? "index.html?view=logowanie" : "/logowanie";
    const ADMIN_ROUTE_PATH = IS_FILE_PROTOCOL ? "index.html?view=admin" : "/admin";

    function isObsOverlayFlagEnabled(value) {
      const normalized = String(value || "").trim().toLowerCase();
      return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
    }
    function detectObsOverlayMode() {
      try {
        const params = new URLSearchParams(window.location.search || "");
        const raw = String(params.get("obs") || params.get("overlay") || "").trim().toLowerCase();
        if (isObsOverlayFlagEnabled(raw)) {
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
        // Ignore URI decode failures.
      }

      try {
        const hashRaw = String(window.location.hash || "").replace(/^#/, "");
        if (hashRaw) {
          const hashParams = new URLSearchParams(hashRaw.startsWith("?") ? hashRaw.slice(1) : hashRaw);
          const hashValue = String(hashParams.get("obs") || hashParams.get("overlay") || "");
          if (isObsOverlayFlagEnabled(hashValue)) {
            return true;
          }
        }
      } catch (_error) {
        // Ignore hash parse failures.
      }

      const path = String(window.location.pathname || "").toLowerCase();
      const isAdminPath = /(^|\/)admin(\/|$)/i.test(path);
      const ua = String(window.navigator?.userAgent || "").toLowerCase();
      const isObsUserAgent = ua.includes("obs") || ua.includes("obsbrowser") || ua.includes("obs-studio");
      return isAdminPath && isObsUserAgent;
    }
    const OBS_OVERLAY_MODE = (() => {
      return detectObsOverlayMode();
    })();
    try {
      window.__takuuObsOverlayMode = OBS_OVERLAY_MODE;
    } catch (_error) {
      // Ignore global assignment failures.
    }
    try {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
    } catch (_error) {
      // Ignore history API failures.
    }

    function decodeObfuscatedSecret(encodedValue) {
      const key = "takuu_2026";
      try {
        const encoded = String(encodedValue || "");
        const decoded = window.atob(encoded);
        let output = "";
        for (let i = 0; i < decoded.length; i += 1) {
          const code = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
          output += String.fromCharCode(code);
        }
        return output;
      } catch (_error) {
        return "";
      }
    }

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

    const ADMIN_SESSION_KEY = "takuu_admin_auth";
    const ADMIN_ACCOUNTS_KEY = "takuu_admin_accounts";
    const CCI_MEMBERS_KEY = "takuu_custom_members";
    const CCI_BASE_MEMBER_OVERRIDES_KEY = "takuu_base_members_overrides";
    const CCI_MEMBERS_ORDER_KEY = "takuu_members_order";
    const KARY_STATE_KEY = "takuu_kary_live_state";
    const KARY_STATS_KEY = "takuu_kary_stats_state";
    const KARY_CENNIK_KEY = "takuu_kary_cennik_items";
    const KARY_CENNIK_MIGRATION_KEY = "takuu_kary_cennik_kicksy_migration_v1";
    const TIMERY_CONFIG_KEY = "takuu_timery_view_config";
    const STREAMOBS_TIMERY_CONFIG_KEY = "takuu_streamobs_timery_config";
    const STREAMOBS_LICZNIKI_CONFIG_KEY = "takuu_streamobs_liczniki_config";
    const LICZNIKI_CONFIG_KEY = "takuu_liczniki_view_config";
    const WHEEL_CONFIG_STORAGE_KEY = "takuu_wheel_config";
    const WHEEL_SYNC_STORAGE_KEY = "takuu_wheel_sync_event";
    const WHEEL_SYNC_CURSOR_STORAGE_KEY = "takuu_wheel_sync_last_event_id";
    const WHEEL_SYNC_CHANNEL_NAME = "takuu-wheel-sync";
    const WHEEL_SYNC_API_ENDPOINT = "/api/wheel/sync";
    const WHEEL_STATS_API_ENDPOINT = "/api/wheel/stats";
    const KARY_STATE_API_ENDPOINT = "/api/kary/state";
    const KARY_STATS_API_ENDPOINT = "/api/kary/stats";
    const ADMIN_STATE_API_ENDPOINT = "/api/admin/state";
    const WHEEL_WS_URL = resolveWheelWebSocketUrl();
    const WHEEL_WS_ENABLED = Boolean(WHEEL_WS_URL);
    const WHEEL_SYNC_POLL_MS = 900;
    const WHEEL_SYNC_SOCKET_RETRY_MS = 2500;
    const WHEEL_SYNC_MAX_PROCESSED_EVENTS = 600;
    const KARY_STATE_SYNC_POLL_MS = 1000;
    const KARY_STATS_SYNC_POLL_MS = 1300;
    const KARY_STATE_API_HEARTBEAT_MS = 10000;
    const ADMIN_STATE_SYNC_POLL_MS = 1300;
    const LAST_ROUTE_PATH_KEY = "takuu_last_route_path";
    const LAST_RELOAD_SOURCE_KEY = "takuu_last_reload_source_path";
    const ADMIN_REMEMBER_ME_KEY = "takuu_admin_remember_me";
    const ADMIN_REMEMBER_ME_MAX_AGE_MS = 3 * 24 * 60 * 60 * 1000;
    const ROOT_ADMIN_ID = "root-admin";
    const ROOT_ADMIN_LOGIN = decodeObfuscatedSecret("ElUnBA=="); // login właściciela
    const ROOT_ADMIN_PASSWORD = decodeObfuscatedSecret("OQQHFBs2U3tdXQ=="); // hasło właściciela
    const ROOT_ADMIN_DISCORD_ID = decodeObfuscatedSecret("QFZcTUVvBwQLA0RUWEVHagAJ"); // ID discord właściciela
    let isAdminAuthenticated = false;
    let currentAdminLogin = "";
    let activeDiscordSession = null;
    let activeAdminTab = "members";
    let adminAccounts = [];
    let baseMembers = [];
    let baseMemberOverrides = {};
    let customMembers = [];
    let membersOrder = [];
    let editingMemberId = "";
    let draggingMemberId = "";
    let draggingMemberRow = null;
    let draggingCennikId = "";
    let draggingCennikSection = "";
    let draggingCennikRow = null;
    let karyTimerTickId = null;
    let karyExternalTimerBridgeBound = false;
    let karyStateSyncPollId = null;
    let karyStateSyncBusy = false;
    let karyStateApiDisabled = false;
    let karyStateRemoteUpdatedAt = 0;
    let karyStatePushInFlight = false;
    let karyStatePushQueued = false;
    let karyStateLastApiHeartbeatAt = 0;
    let karyStatsSyncPollId = null;
    let karyStatsSyncBusy = false;
    let karyStatsApiDisabled = false;
    let karyStatsRemoteUpdatedAt = 0;
    let karyStatsPushInFlight = false;
    let karyStatsPushQueued = false;
    let adminStateSyncPollId = null;
    let adminStateSyncBusy = false;
    let adminStateApiDisabled = false;
    let adminStateRemoteUpdatedAt = 0;
    let adminStatePushInFlight = false;
    let adminStatePushQueued = false;
    let adminStateSyncInitialized = false;
    let adminStatePendingLocalPush = false;
    let adminStateApplyingRemote = false;
    let activeKaryCurrency = "pln";
    let karyLiveState = { timers: {}, timerTotals: {}, counters: {}, lastTickAt: 0 };
    let karyStatsState = { timers: {}, counters: {} };
    let karyCennikItems = [];
    let timeryConfigState = {
      panelOpen: false,
      layout: "list",
      bgColor: "#101420",
      showTitle: true,
      showProgress: true,
      showStatus: true
    };
    let streamObsTimeryConfigState = {
      panelOpen: false,
      layout: "vertical",
      color: "#1a1e26",
      progressColor: "#6bffc1"
    };
    let streamObsLicznikiConfigState = {
      panelOpen: false,
      layout: "vertical",
      color: "#1a1e26"
    };
    let licznikiConfigState = {
      panelOpen: false,
      layout: "grid",
      bgColor: "#101420",
      showTitle: true,
      showStatus: true,
      showValue: true
    };
    const INTRO_DEFAULT_TITLE = "Witaj u takuu";
    const INTRO_DEFAULT_ACCENT = "takuu";
    const INTRO_DEFAULT_SUBTITLE = "Wpłać donate lub zasubskrybuj, aby aktywować karę dla Taku na streamie!";
    const normalizedIntroTitleTextRaw = streamIntroTitleEl ? String(streamIntroTitleEl.textContent || "").replace(/\s+/g, " ").trim() : "";
    const normalizedIntroTitleText = normalizedIntroTitleTextRaw || INTRO_DEFAULT_TITLE;
    const normalizedIntroAccentTextRaw = streamIntroTitleAccentEl ? String(streamIntroTitleAccentEl.textContent || "").replace(/\s+/g, " ").trim() : "";
    const normalizedIntroAccentText = normalizedIntroAccentTextRaw || INTRO_DEFAULT_ACCENT;
    let introAccentStartIndex =
      normalizedIntroTitleText && normalizedIntroAccentText
        ? normalizedIntroTitleText.toLowerCase().indexOf(normalizedIntroAccentText.toLowerCase())
        : -1;
    if (introAccentStartIndex < 0) {
      introAccentStartIndex = normalizedIntroTitleText.toLowerCase().indexOf(INTRO_DEFAULT_ACCENT.toLowerCase());
    }
    const introTitleBeforeText =
      introAccentStartIndex >= 0 ? normalizedIntroTitleText.slice(0, introAccentStartIndex) : normalizedIntroTitleText;
    const introTitleAccentText =
      introAccentStartIndex >= 0
        ? normalizedIntroTitleText.slice(introAccentStartIndex, introAccentStartIndex + normalizedIntroAccentText.length)
        : "";
    const introTitleAfterText =
      introAccentStartIndex >= 0
        ? normalizedIntroTitleText.slice(introAccentStartIndex + introTitleAccentText.length)
        : "";
    const introSubtitleRaw = streamIntroSubtitleEl
      ? String(streamIntroSubtitleEl.textContent || "").replace(/\s+/g, " ").trim()
      : "";
    const introSubtitleFullText = introSubtitleRaw || INTRO_DEFAULT_SUBTITLE;
    const visibleAdminPasswords = new Set();
    const karyTimerDefinitions = Array.from(
      Array.from(karyTimerCardEls).reduce((map, card) => {
        const key = String(card.dataset.karyTimer || "").trim();
        const label = String(card.querySelector("h3")?.textContent || "").trim();
        if (key && !map.has(key)) {
          map.set(key, { key, label: label || key });
        }
        return map;
      }, new Map()).values()
    );
    const karyCounterDefinitions = Array.from(
      Array.from(karyCounterCardEls).reduce((map, card) => {
        const key = String(card.dataset.karyCounter || "").trim();
        const label = String(card.querySelector("h3")?.textContent || "").trim();
        if (key && !map.has(key)) {
          map.set(key, { key, label: label || key });
        }
        return map;
      }, new Map()).values()
    );

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
        const cleanTimerKey = String(timerKey || "").trim();
        if (!cleanTimerKey) {
          return;
        }
        const token = normalizeTimerLookupToken(candidate);
        if (!token || tokenToTimerKey.has(token)) {
          return;
        }
        tokenToTimerKey.set(token, cleanTimerKey);
      };

      karyTimerDefinitions.forEach((timer) => {
        const key = String(timer.key || "").trim();
        const label = String(timer.label || "").trim();
        if (!key) {
          return;
        }
        register(key, key);
        register(key.replace(/-/g, " "), key);
        register(key.replace(/-/g, ""), key);
        register(label, key);
      });

      return tokenToTimerKey;
    }

    const wheelTimerLookupByToken = buildWheelTimerLookupMap();

    function resolveWheelTimerKey(timerCandidate, winnerName = "", minutesCandidate = 0) {
      const directTimer = String(timerCandidate || "").trim();
      const minutes = Math.max(0, Math.floor(Number(minutesCandidate) || 0));
      const winnerToken = normalizeTimerLookupToken(winnerName);

      if (directTimer) {
        const directToken = normalizeTimerLookupToken(directTimer);
        if (directToken && wheelTimerLookupByToken.has(directToken)) {
          return String(wheelTimerLookupByToken.get(directToken) || "").trim();
        }
        if (minutes > 0 && winnerToken && wheelTimerLookupByToken.has(winnerToken)) {
          return String(wheelTimerLookupByToken.get(winnerToken) || "").trim();
        }
        return directTimer;
      }

      if (minutes <= 0) {
        return "";
      }

      if (winnerToken && wheelTimerLookupByToken.has(winnerToken)) {
        return String(wheelTimerLookupByToken.get(winnerToken) || "").trim();
      }

      return "";
    }

    function normalizePath(path) {
      return String(path || "")
        .replace(/\\/g, "/")
        .replace(/\/+$/, "")
        .toLowerCase();
    }

    function getRouteFromHash(hash = window.location.hash) {
      const clean = String(hash || "").trim().replace(/^#\/?/, "").toLowerCase();
      if (!clean) {
        return "";
      }
      if (clean === "home" || clean === "index" || clean === "index.html") {
        return "home";
      }
      if (clean === "kary" || clean === "punishments") {
        return "kary";
      }
      if (clean === "timery" || clean === "timers") {
        return "timery";
      }
      if (clean === "liczniki" || clean === "counters") {
        return "liczniki";
      }
      if (clean === "klipy" || clean === "clips") {
        return "clips";
      }
      if (clean === "soon" || clean === "wkrotce") {
        return "soon";
      }
      if (clean === "stats" || clean === "statystyki") {
        return "stats";
      }
      if (clean === "logowanie" || clean === "login") {
        return "login";
      }
      if (clean === "admin" || clean === "panel") {
        return "admin";
      }
      return "";
    }

    function getRouteFromSearch(search = window.location.search) {
      const params = new URLSearchParams(String(search || ""));
      const view = String(params.get("view") || "").trim().toLowerCase();
      if (!view) {
        return "";
      }
      if (view === "home" || view === "index" || view === "index.html") {
        return "home";
      }
      if (view === "kary" || view === "punishments") {
        return "kary";
      }
      if (view === "timery" || view === "timers") {
        return "timery";
      }
      if (view === "liczniki" || view === "counters") {
        return "liczniki";
      }
      if (view === "klipy" || view === "clips") {
        return "clips";
      }
      if (view === "soon" || view === "wkrotce") {
        return "soon";
      }
      if (view === "stats" || view === "statystyki") {
        return "stats";
      }
      if (view === "logowanie" || view === "login") {
        return "login";
      }
      if (view === "admin" || view === "panel") {
        return "admin";
      }
      return "";
    }

    function normalizePathAndSearch(value) {
      const raw = String(value || "");
      const hashCut = raw.split("#")[0];
      const queryIndex = hashCut.indexOf("?");
      const onlyPath = queryIndex === -1 ? hashCut : hashCut.slice(0, queryIndex);
      const onlySearch = queryIndex === -1 ? "" : hashCut.slice(queryIndex).toLowerCase();
      return `${normalizePath(onlyPath)}${onlySearch}`;
    }

    function persistLastRoutePath(path = window.location.pathname) {
      if (IS_FILE_PROTOCOL) {
        return;
      }
      const normalized = normalizePath(path) || "/";
      try {
        window.sessionStorage.setItem(LAST_ROUTE_PATH_KEY, normalized);
      } catch (_error) {
        // Ignore storage failures.
      }
    }

    function getReloadType() {
      try {
        const entries = window.performance?.getEntriesByType?.("navigation");
        if (Array.isArray(entries) && entries.length && entries[0] && entries[0].type) {
          return String(entries[0].type);
        }
      } catch (_error) {
        // Ignore performance API failures.
      }
      return "";
    }

    function saveReloadSourcePath(path = window.location.pathname) {
      if (IS_FILE_PROTOCOL) {
        return;
      }

      const normalized = normalizePath(path) || "/";

      try {
        window.sessionStorage.setItem(
          LAST_RELOAD_SOURCE_KEY,
          JSON.stringify({
            path: normalized,
            at: Date.now()
          })
        );
      } catch (_error) {
        // Ignore storage failures.
      }
    }

    function getRestorableRoutePath() {
      if (IS_FILE_PROTOCOL) {
        return "";
      }

      if (getReloadType() !== "reload") {
        return "";
      }

      const explicitRoute = getRouteFromSearch(window.location.search) || getRouteFromHash(window.location.hash);
      if (explicitRoute) {
        return "";
      }

      const currentPath = normalizePath(window.location.pathname);
      const homePath = normalizePath(HOME_ROUTE_PATH);
      const homeDirPath = normalizePath(HOME_ROUTE_PATH.replace(/\/index\.html$/i, ""));
      const isCurrentHomePath =
        currentPath === homePath ||
        currentPath === homeDirPath ||
        currentPath === "/" ||
        currentPath.endsWith("/index.html") ||
        currentPath.endsWith("/index.htm");

      if (!isCurrentHomePath) {
        return "";
      }

      try {
        const rawReloadSource = String(window.sessionStorage.getItem(LAST_RELOAD_SOURCE_KEY) || "");
        let sourcePath = "";
        let sourceAt = 0;
        if (rawReloadSource) {
          const parsed = JSON.parse(rawReloadSource);
          sourcePath = normalizePath(parsed?.path || "") || "/";
          sourceAt = Math.max(0, Number(parsed?.at || 0));
        }

        window.sessionStorage.removeItem(LAST_RELOAD_SOURCE_KEY);

        const isFreshReloadSource = sourceAt > 0 && Date.now() - sourceAt <= 2 * 60 * 1000;
        if (!isFreshReloadSource || !sourcePath) {
          return "";
        }
        if (
          sourcePath === currentPath ||
          sourcePath === homePath ||
          sourcePath === homeDirPath ||
          sourcePath === "/" ||
          sourcePath.endsWith("/index.html") ||
          sourcePath.endsWith("/index.htm")
        ) {
          return "";
        }

        const storedRoute = getRouteFromPath(sourcePath);
        if (!storedRoute || storedRoute === "home") {
          return "";
        }

        return getCanonicalRoutePath(storedRoute);
      } catch (_error) {
        // Ignore storage read failures.
      }

      return "";
    }

    function getRouteFromPath(path = window.location.pathname) {
      const rawPath = String(path || "");
      const pathOnly = rawPath.split("?")[0].split("#")[0];
      const normalized = normalizePath(pathOnly);
      const homePath = normalizePath(HOME_ROUTE_PATH);
      const homeDirPath = normalizePath(HOME_ROUTE_PATH.replace(/\/index\.html$/i, ""));

      const routeMatchers = [
        { route: "kary", pattern: /(^|\/)(kary)(\/|$)/i },
        { route: "timery", pattern: /(^|\/)(timery)(\/|$)/i },
        { route: "liczniki", pattern: /(^|\/)(liczniki)(\/|$)/i },
        { route: "clips", pattern: /(^|\/)(klipy|clips)(\/|$)/i },
        { route: "stats", pattern: /(^|\/)(stats|statystyki)(\/|$)/i },
        { route: "login", pattern: /(^|\/)(logowanie|login)(\/|$)/i },
        { route: "admin", pattern: /(^|\/)(admin)(\/|$)/i },
        { route: "soon", pattern: /(^|\/)(soon|wkrotce)(\/|$)/i }
      ];

      for (const entry of routeMatchers) {
        if (entry.pattern.test(normalized)) {
          return entry.route;
        }
      }

      const embeddedSearch = rawPath.includes("?") ? `?${rawPath.split("?")[1].split("#")[0]}` : "";
      const searchRoute = getRouteFromSearch(embeddedSearch || window.location.search);
      if (searchRoute) {
        return searchRoute;
      }

      const embeddedHash = rawPath.includes("#") ? `#${rawPath.split("#")[1]}` : "";
      const hashRoute = getRouteFromHash(embeddedHash || window.location.hash);
      if (hashRoute) {
        return hashRoute;
      }

      if (
        normalized === homePath ||
        normalized === homeDirPath ||
        normalized === "/" ||
        normalized.endsWith("/index.html") ||
        normalized.endsWith("/index.htm")
      ) {
        return "home";
      }
      return "soon";
    }

    function getPopupRouteHint() {
      const popupName = String(window.name || "").toLowerCase();
      if (popupName === "takuu_timery_popup") {
        return "timery";
      }
      if (popupName === "takuu_liczniki_popup") {
        return "liczniki";
      }
      return "";
    }

    function scrollToRouteTop() {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      } catch (_error) {
        window.scrollTo(0, 0);
      }
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }
    }

    function renderFullIntroText() {
      if (streamIntroTitleEl) {
        streamIntroTitleEl.innerHTML =
          `${escapeHtml(introTitleBeforeText)}` +
          `<span class="stream-intro-title-accent">${escapeHtml(introTitleAccentText)}</span>` +
          `${escapeHtml(introTitleAfterText)}`;
      }
      if (streamIntroSubtitleEl) {
        streamIntroSubtitleEl.textContent = introSubtitleFullText;
      }
    }

    function stopIntroTypingAnimation() {
      if (introTypingStartDelayId) {
        window.clearTimeout(introTypingStartDelayId);
        introTypingStartDelayId = null;
      }
      if (introTypingTickId) {
        window.clearInterval(introTypingTickId);
        introTypingTickId = null;
      }
      if (streamIntroTitleEl) {
        streamIntroTitleEl.classList.remove("is-typing");
      }
      if (streamIntroSubtitleEl) {
        streamIntroSubtitleEl.classList.remove("is-typing");
      }
    }

    function renderTypedIntroTitle(charCount) {
      if (!streamIntroTitleEl) {
        return;
      }

      const beforeLen = introTitleBeforeText.length;
      const accentLen = introTitleAccentText.length;
      const safeCount = Math.max(0, Math.floor(charCount));
      let html = "";

      if (safeCount <= beforeLen) {
        html = escapeHtml(introTitleBeforeText.slice(0, safeCount));
      } else if (safeCount <= beforeLen + accentLen) {
        html =
          `${escapeHtml(introTitleBeforeText)}` +
          `<span class="stream-intro-title-accent">${escapeHtml(
            introTitleAccentText.slice(0, safeCount - beforeLen)
          )}</span>`;
      } else {
        html =
          `${escapeHtml(introTitleBeforeText)}` +
          `<span class="stream-intro-title-accent">${escapeHtml(introTitleAccentText)}</span>` +
          `${escapeHtml(introTitleAfterText.slice(0, safeCount - beforeLen - accentLen))}`;
      }

      streamIntroTitleEl.innerHTML = html;
    }

    function startIntroTypingAnimation() {
      if (!streamIntroTitleEl || !streamIntroSubtitleEl) {
        return false;
      }
      if (!introTitleBeforeText && !introTitleAccentText && !introTitleAfterText) {
        return false;
      }

      try {
        window.__takuuIntroTypingTriggered = true;
      } catch (_error) {
        // Ignore global flag write failures.
      }

      stopIntroTypingAnimation();

      const titleTotalLength = introTitleBeforeText.length + introTitleAccentText.length + introTitleAfterText.length;
      const subtitleTotalLength = introSubtitleFullText.length;
      let phase = "title";
      let titleCount = 0;
      let subtitleCount = 0;
      let holdTicks = 0;

      streamIntroTitleEl.style.opacity = "1";
      streamIntroTitleEl.style.transform = "none";
      streamIntroSubtitleEl.style.opacity = "1";
      streamIntroSubtitleEl.style.transform = "none";
      streamIntroTitleEl.classList.add("is-typing");
      streamIntroSubtitleEl.classList.remove("is-typing");
      streamIntroTitleEl.innerHTML = "";
      streamIntroSubtitleEl.textContent = "";

      introTypingTickId = window.setInterval(() => {
        if (phase === "title") {
          if (titleCount < titleTotalLength) {
            titleCount += 1;
            renderTypedIntroTitle(titleCount);
            return;
          }
          phase = "hold";
          streamIntroTitleEl.classList.remove("is-typing");
          holdTicks = 0;
          return;
        }

        if (phase === "hold") {
          holdTicks += 1;
          if (holdTicks < 5) {
            return;
          }
          if (subtitleTotalLength <= 0) {
            renderFullIntroText();
            stopIntroTypingAnimation();
            return;
          }
          phase = "subtitle";
          streamIntroSubtitleEl.classList.add("is-typing");
          return;
        }

        if (phase === "subtitle") {
          if (subtitleCount < subtitleTotalLength) {
            subtitleCount += 1;
            streamIntroSubtitleEl.textContent = introSubtitleFullText.slice(0, subtitleCount);
            return;
          }

          streamIntroTitleEl.innerHTML =
            `${escapeHtml(introTitleBeforeText)}` +
            `<span class="stream-intro-title-accent">${escapeHtml(introTitleAccentText)}</span>` +
            `${escapeHtml(introTitleAfterText)}`;
          streamIntroSubtitleEl.textContent = introSubtitleFullText;
          stopIntroTypingAnimation();
        }
      }, 38);

      return true;
    }

    function queueIntroTypingAnimation(delayMs = 0) {
      stopIntroTypingAnimation();
      const normalizedDelay = Math.max(0, Math.floor(delayMs));
      if (normalizedDelay <= 0) {
        return startIntroTypingAnimation();
      }
      introTypingStartDelayId = window.setTimeout(() => {
        introTypingStartDelayId = null;
        startIntroTypingAnimation();
      }, normalizedDelay);
      return true;
    }

    function setActiveNavState(routeName) {
      if (karyNavEl) {
        karyNavEl.classList.toggle("is-active", routeName === "kary" || routeName === "timery" || routeName === "liczniki");
      }
      if (homeNavEl) {
        homeNavEl.classList.toggle("is-active", routeName === "home");
      }
      if (clipsNavEl) {
        clipsNavEl.classList.toggle("is-active", routeName === "clips");
      }
      if (soonNavEl) {
        soonNavEl.classList.toggle("is-active", routeName === "soon");
      }
      if (statsNavEl) {
        statsNavEl.classList.toggle("is-active", routeName === "stats");
      }
      if (adminNavEl) {
        adminNavEl.classList.toggle("is-active", routeName === "login" || routeName === "admin");
      }
    }

    function updatePlaceholder(routeName) {
      if (!routePlaceholderEl) {
        return;
      }

      const shouldShow = routeName === "soon";
      routePlaceholderEl.hidden = !shouldShow;

      if (routeBadgeEl && shouldShow) {
        routeBadgeEl.textContent = "WKRÓTCE...";
      }
    }

    function safeWheelStatNumber(value, fallback = 0) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    }

    function formatWheelStatsPercent(value) {
      const numeric = Math.max(0, safeWheelStatNumber(value, 0));
      return `${numeric.toFixed(1).replace(".", ",")}%`;
    }

    function formatWheelStatsDateTime(timestamp) {
      const value = safeWheelStatNumber(timestamp, 0);
      if (value <= 0) {
        return "-";
      }
      try {
        return new Intl.DateTimeFormat("pl-PL", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }).format(new Date(value));
      } catch (_error) {
        return "-";
      }
    }

    function normalizeWheelStatName(value, fallback = "Bez nazwy") {
      const clean = String(value || "").trim();
      return clean || fallback;
    }

    function readWheelConfigStats() {
      const parsed = readStorageJson(WHEEL_CONFIG_STORAGE_KEY, []);
      let sourceItems = Array.isArray(parsed) ? parsed : [];

      if (!sourceItems.length && window.TakuuWheel && typeof window.TakuuWheel.getItems === "function") {
        try {
          const liveItems = window.TakuuWheel.getItems();
          if (Array.isArray(liveItems)) {
            sourceItems = liveItems;
          }
        } catch (_error) {
          // Ignore unavailable wheel API.
        }
      }

      if (!Array.isArray(sourceItems) || !sourceItems.length) {
        return [];
      }
      return sourceItems.map((item, index) => {
        const source = item && typeof item === "object" ? item : {};
        return {
          name: normalizeWheelStatName(source.name, `Segment ${index + 1}`),
          chance: Math.max(0, Math.floor(safeWheelStatNumber(source.chance, 0))),
          minutes: Math.max(0, Math.floor(safeWheelStatNumber(source.minutes, 0)))
        };
      });
    }

    function normalizeWheelHistoryEntry(rawEntry) {
      const source = rawEntry && typeof rawEntry === "object" ? rawEntry : {};
      const idRaw = source.id != null ? source.id : source.eventId;
      const id = idRaw == null ? "" : String(idRaw).trim();
      const name = normalizeWheelStatName(source.name || source.winnerName, "");
      const numericTime = safeWheelStatNumber(source.time ?? source.timestamp, Number.NaN);
      const parsedTime = Number.isFinite(numericTime)
        ? numericTime
        : Date.parse(String(source.time ?? source.timestamp ?? ""));
      if (!name || !Number.isFinite(parsedTime) || parsedTime <= 0) {
        return null;
      }
      const normalized = {
        name,
        time: Math.max(1, Math.floor(parsedTime))
      };
      if (id) {
        normalized.id = id;
      }
      return normalized;
    }

    function mergeWheelHistoryEntries(baseEntries, incomingEntries) {
      const merged = [];
      const seen = new Set();
      const appendEntry = (rawEntry) => {
        const normalized = normalizeWheelHistoryEntry(rawEntry);
        if (!normalized) {
          return;
        }
        const key = normalized.id
          ? `id:${normalized.id}`
          : `time:${normalized.time}|name:${normalized.name}`;
        if (seen.has(key)) {
          return;
        }
        seen.add(key);
        merged.push(normalized);
      };

      if (Array.isArray(baseEntries)) {
        baseEntries.forEach(appendEntry);
      }
      if (Array.isArray(incomingEntries)) {
        incomingEntries.forEach(appendEntry);
      }

      merged.sort((a, b) => a.time - b.time);
      return merged;
    }

    function applyWheelHistoryEntryToStatsCache(rawEntry) {
      const normalized = normalizeWheelHistoryEntry(rawEntry);
      if (!normalized) {
        return false;
      }
      const merged = mergeWheelHistoryEntries(wheelStatsHistoryCache, [normalized]);
      if (JSON.stringify(merged) === JSON.stringify(wheelStatsHistoryCache)) {
        return false;
      }
      wheelStatsHistoryCache = merged;
      return true;
    }

    function persistWheelHistoryEntryToApi(rawEntry) {
      if (wheelStatsApiDisabled || IS_FILE_PROTOCOL || typeof fetch !== "function") {
        return;
      }
      const normalized = normalizeWheelHistoryEntry(rawEntry);
      if (!normalized) {
        return;
      }

      fetch(WHEEL_STATS_API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "append",
          entry: normalized
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
              console.warn("[TakuuScript] POST /api/wheel/stats returned non-JSON response", {
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
              console.warn("[TakuuScript] POST /api/wheel/stats returned unexpected payload", payload);
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
          console.warn("[TakuuScript] POST /api/wheel/stats failed", {
            status: response.status,
            details
          });
        })
        .catch((error) => {
          console.warn("[TakuuScript] POST /api/wheel/stats request error", error);
        });
    }

    async function fetchWheelStatsFromApiOnce() {
      if (wheelStatsApiDisabled || IS_FILE_PROTOCOL || typeof fetch !== "function") {
        return false;
      }

      let response;
      try {
        response = await fetch(`${WHEEL_STATS_API_ENDPOINT}?limit=5000`, { cache: "no-store" });
      } catch (_error) {
        console.warn("[TakuuScript] GET /api/wheel/stats request error", _error);
        return false;
      }

      if (!response.ok) {
        if (response.status === 404 || response.status === 405 || response.status === 501) {
          wheelStatsApiDisabled = true;
        }
        let details = "";
        try {
          details = await response.text();
        } catch (_error) {
          details = "";
        }
        console.warn("[TakuuScript] GET /api/wheel/stats failed", {
          status: response.status,
          details
        });
        return false;
      }

      const contentType = String(response.headers.get("content-type") || "").toLowerCase();
      if (!contentType.includes("application/json")) {
        let preview = "";
        try {
          preview = String(await response.text()).slice(0, 220);
        } catch (_error) {
          preview = "";
        }
        console.warn("[TakuuScript] GET /api/wheel/stats returned non-JSON response", {
          status: response.status,
          contentType,
          preview
        });
        return false;
      }

      let data = null;
      try {
        data = await response.json();
      } catch (_error) {
        console.warn("[TakuuScript] GET /api/wheel/stats invalid JSON", _error);
        return false;
      }
      if (!data || typeof data !== "object") {
        return false;
      }

      const remoteHistoryRaw = Array.isArray(data?.history)
        ? data.history
        : (Array.isArray(data) ? data : []);
      const normalized = mergeWheelHistoryEntries([], remoteHistoryRaw);
      if (JSON.stringify(normalized) !== JSON.stringify(wheelStatsHistoryCache)) {
        wheelStatsHistoryCache = normalized;
        return true;
      }
      return false;
    }

    function readWheelHistoryStats() {
      return mergeWheelHistoryEntries([], wheelStatsHistoryCache);
    }

    function formatKaryStatsTimerClock(totalSeconds) {
      const safe = Math.max(0, Math.floor(Number(totalSeconds) || 0));
      const hours = Math.floor(safe / 3600);
      const minutes = Math.floor((safe % 3600) / 60);
      const seconds = safe % 60;
      if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
      }
      return `${minutes}:${String(seconds).padStart(2, "0")}`;
    }

    function formatKaryStatsAddedTime(totalSeconds) {
      const safe = Math.max(0, Math.floor(Number(totalSeconds) || 0));
      if (safe <= 0) {
        return "0 min";
      }
      const hours = Math.floor(safe / 3600);
      const minutes = Math.floor((safe % 3600) / 60);
      if (hours <= 0) {
        return `${Math.floor(safe / 60)} min`;
      }
      if (minutes <= 0) {
        return `${hours}h`;
      }
      return `${hours}h ${minutes}m`;
    }

    function renderKaryStats() {
      if (!karyTimerStatsGridEl || !karyCounterStatsGridEl) {
        return;
      }

      ensureKaryStateShape();
      ensureKaryStatsShape();
      syncKaryStatsRecordsFromCurrentState({ queueApi: false, render: false });

      if (!karyTimerDefinitions.length) {
        karyTimerStatsGridEl.innerHTML = `<p class="wheel-stats-empty">Brak timerów do wyświetlenia.</p>`;
      } else {
        karyTimerStatsGridEl.innerHTML = karyTimerDefinitions
          .map((timer) => {
            const remaining = Math.max(0, Math.floor(Number(karyLiveState.timers[timer.key] || 0)));
            const timerStats = karyStatsState.timers[timer.key] || { recordSeconds: 0, totalAddedSeconds: 0 };
            const timerCycleTotalSeconds = Math.max(0, Math.floor(Number(karyLiveState.timerTotals[timer.key] || 0)));
            const recordSeconds = Math.max(0, Math.floor(Number(timerStats.recordSeconds || 0)));
            const totalAddedSeconds = Math.max(0, Math.floor(Number(timerStats.totalAddedSeconds || 0)));
            const isActive = remaining > 0;

            return `
              <article class="kary-stats-timer-card${isActive ? " is-active" : ""}">
                <h4 class="kary-stats-item-title">${escapeHtml(timer.label)}</h4>
                <p class="kary-stats-item-current">${escapeHtml(formatKaryStatsTimerClock(remaining))}</p>
                <p class="kary-stats-item-status">
                  Status:
                  <span class="kary-stats-status-dot${isActive ? " is-active" : " is-idle"}" aria-hidden="true"></span>
                  ${isActive ? "Działa" : "Idle"}
                </p>
                <div class="kary-stats-item-divider"></div>
                <div class="kary-stats-item-metrics">
                  <div class="kary-stats-item-metric">
                    <p class="kary-stats-item-label">CIĄGIEM (EVER)</p>
                    <p class="kary-stats-item-value is-record">${escapeHtml(formatKaryStatsTimerClock(recordSeconds))}</p>
                  </div>
                  <div class="kary-stats-item-metric">
                    <p class="kary-stats-item-label">ŁĄCZNIE DODANO (EVER)</p>
                    <p class="kary-stats-item-value is-added">${escapeHtml(formatKaryStatsAddedTime(totalAddedSeconds))}</p>
                  </div>
                </div>
              </article>`;
          })
          .join("");
      }

      if (!karyCounterDefinitions.length) {
        karyCounterStatsGridEl.innerHTML = `<p class="wheel-stats-empty">Brak liczników do wyświetlenia.</p>`;
      } else {
        karyCounterStatsGridEl.innerHTML = karyCounterDefinitions
          .map((counter) => {
            const currentValue = Math.max(0, Math.floor(Number(karyLiveState.counters[counter.key] || 0)));
            const counterStats = karyStatsState.counters[counter.key] || { maxValue: 0 };
            const maxValue = Math.max(0, Math.floor(Number(counterStats.maxValue || 0)));

            return `
              <article class="kary-stats-counter-card">
                <h4 class="kary-stats-item-title">${escapeHtml(counter.label)}</h4>
                <div class="kary-stats-counter-row">
                  <div class="kary-stats-counter-col">
                    <p class="kary-stats-counter-label">Aktualnie</p>
                    <p class="kary-stats-counter-value">${currentValue.toLocaleString("pl-PL")}</p>
                  </div>
                  <div class="kary-stats-counter-col">
                    <p class="kary-stats-counter-label">Max (ever)</p>
                    <p class="kary-stats-counter-value is-max">${maxValue.toLocaleString("pl-PL")}</p>
                  </div>
                </div>
              </article>`;
          })
          .join("");
      }
    }

    function renderWheelStats() {
      if (!wheelStatsSummaryEl || !wheelStatsSegmentBodyEl || !wheelStatsRecentListEl) {
        return;
      }

      const configItems = readWheelConfigStats();
      const historyItems = readWheelHistoryStats();
      const totalSpins = historyItems.length;
      const now = Date.now();
      const since24h = now - 24 * 60 * 60 * 1000;

      const countsByName = historyItems.reduce((map, entry) => {
        const key = normalizeWheelStatName(entry.name, "Bez nazwy");
        map.set(key, (map.get(key) || 0) + 1);
        return map;
      }, new Map());

      const configByName = configItems.reduce((map, item) => {
        map.set(normalizeWheelStatName(item.name), item);
        return map;
      }, new Map());

      const rowNames = new Set([
        ...configItems.map((item) => normalizeWheelStatName(item.name)),
        ...Array.from(countsByName.keys())
      ]);

      const longestStreakByName = new Map();
      let currentStreakName = "";
      let currentStreakCount = 0;
      historyItems.forEach((entry) => {
        const name = normalizeWheelStatName(entry.name, "Bez nazwy");
        if (name === currentStreakName) {
          currentStreakCount += 1;
        } else {
          currentStreakName = name;
          currentStreakCount = 1;
        }
        const prevRecord = Math.max(0, Math.floor(safeWheelStatNumber(longestStreakByName.get(name), 0)));
        if (currentStreakCount > prevRecord) {
          longestStreakByName.set(name, currentStreakCount);
        }
      });

      const statsRows = Array.from(rowNames).map((name) => {
        const count = Math.max(0, Math.floor(safeWheelStatNumber(countsByName.get(name), 0)));
        const item = configByName.get(name) || null;
        const baseMinutes = item ? Math.max(0, Math.floor(safeWheelStatNumber(item.minutes, 0))) : null;
        const longestStreakCount = Math.max(0, Math.floor(safeWheelStatNumber(longestStreakByName.get(name), 0)));
        const totalPenaltyMinutesByRow = baseMinutes == null ? null : count * baseMinutes;
        const longestStreakMinutes = baseMinutes == null ? null : longestStreakCount * baseMinutes;
        return {
          name,
          count,
          share: totalSpins > 0 ? (count / totalSpins) * 100 : 0,
          totalPenaltyMinutes: totalPenaltyMinutesByRow,
          longestStreakMinutes
        };
      });

      statsRows.sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.name.localeCompare(b.name, "pl");
      });

      const topRow = statsRows.find((row) => row.count > 0) || null;
      const spins24h = historyItems.filter((entry) => entry.time >= since24h).length;
      const firstSpinAt = totalSpins ? historyItems[0].time : 0;
      const lastSpin = totalSpins ? historyItems[historyItems.length - 1] : null;
      const daysSinceStart = firstSpinAt > 0 ? Math.max(1, (now - firstSpinAt) / (24 * 60 * 60 * 1000)) : 1;
      const spinsPerDay = totalSpins > 0 ? totalSpins / daysSinceStart : 0;
      const totalPenaltyMinutes = historyItems.reduce((sum, entry) => {
        const linked = configByName.get(normalizeWheelStatName(entry.name));
        const minutes = linked ? Math.max(0, Math.floor(safeWheelStatNumber(linked.minutes, 0))) : 0;
        return sum + minutes;
      }, 0);

      wheelStatsSummaryEl.innerHTML = [
        {
          label: "Łącznie kręceń",
          value: totalSpins.toLocaleString("pl-PL")
        },
        {
          label: "Top segment",
          value: topRow ? topRow.name : "-"
        },
        {
          label: "Losowania 24h",
          value: spins24h.toLocaleString("pl-PL")
        },
        {
          label: "Średnio / dzień",
          value: totalSpins > 0 ? spinsPerDay.toFixed(2).replace(".", ",") : "0,00"
        },
        {
          label: "Suma minut kary",
          value: totalPenaltyMinutes.toLocaleString("pl-PL")
        },
        {
          label: "Ostatnie losowanie",
          value: lastSpin ? `${lastSpin.name} (${formatWheelStatsDateTime(lastSpin.time)})` : "-"
        }
      ]
        .map(
          (item) => `
            <article class="wheel-stats-card">
              <p class="wheel-stats-card-label">${escapeHtml(item.label)}</p>
              <p class="wheel-stats-card-value">${escapeHtml(item.value)}</p>
            </article>`
        )
        .join("");

      if (!statsRows.length) {
        wheelStatsSegmentBodyEl.innerHTML = `
          <tr>
            <td colspan="5" class="wheel-stats-empty">Brak segmentów do wyświetlenia.</td>
          </tr>`;
      } else {
        wheelStatsSegmentBodyEl.innerHTML = statsRows
          .map((row) => {
            const totalPenaltyMinutesText = row.totalPenaltyMinutes == null ? "-" : `${row.totalPenaltyMinutes} min`;
            const longestStreakText = row.longestStreakMinutes == null ? "-" : `${row.longestStreakMinutes} min`;
            return `
              <tr>
                <td>${escapeHtml(row.name)}</td>
                <td>${row.count.toLocaleString("pl-PL")}</td>
                <td>${escapeHtml(formatWheelStatsPercent(row.share))}</td>
                <td>${escapeHtml(totalPenaltyMinutesText)}</td>
                <td>${escapeHtml(longestStreakText)}</td>
              </tr>`;
          })
          .join("");
      }

      const recentItems = historyItems.slice(-WHEEL_STATS_RECENT_LIMIT).reverse();
      if (!recentItems.length) {
        wheelStatsRecentListEl.innerHTML = `<li class="wheel-stats-empty">Brak historii losowań.</li>`;
      } else {
        wheelStatsRecentListEl.innerHTML = recentItems
          .map((entry) => {
            const iso = new Date(entry.time).toISOString();
            const formatted = formatWheelStatsDateTime(entry.time);
            const relative = formatRelativeTime(iso);
            const meta = relative ? `${formatted} (${relative})` : formatted;
            return `
              <li class="wheel-stats-recent-item">
                <span class="wheel-stats-recent-name">${escapeHtml(entry.name)}</span>
                <time datetime="${escapeHtml(iso)}">${escapeHtml(meta)}</time>
              </li>`;
          })
          .join("");
      }
    }

    function stopWheelStatsLiveUpdates() {
      if (!wheelStatsLiveRefreshId) {
        return;
      }
      window.clearInterval(wheelStatsLiveRefreshId);
      wheelStatsLiveRefreshId = null;
    }

    function startWheelStatsLiveUpdates() {
      if (!statsPanelEl || !wheelStatsSummaryEl || !wheelStatsSegmentBodyEl || !wheelStatsRecentListEl) {
        return;
      }
      void Promise.all([
        fetchWheelStatsFromApiOnce(),
        syncKaryStatsFromApiOnce({ force: true })
      ]).finally(() => {
        renderWheelStats();
        renderKaryStats();
      });
      if (wheelStatsLiveRefreshId) {
        return;
      }
      wheelStatsLiveRefreshId = window.setInterval(() => {
        if (document.hidden || lastAppliedRouteName !== "stats") {
          return;
        }
        void Promise.all([
          fetchWheelStatsFromApiOnce(),
          syncKaryStatsFromApiOnce()
        ]).finally(() => {
          renderWheelStats();
          renderKaryStats();
        });
      }, WHEEL_STATS_LIVE_REFRESH_MS);
    }

    function markWheelSyncEventProcessed(eventId) {
      const key = String(eventId || "").trim();
      if (!key) {
        return false;
      }
      if (processedWheelSyncEventIds.has(key)) {
        return false;
      }
      processedWheelSyncEventIds.add(key);
      processedWheelSyncEventOrder.push(key);
      if (processedWheelSyncEventOrder.length > WHEEL_SYNC_MAX_PROCESSED_EVENTS) {
        const stale = processedWheelSyncEventOrder.shift();
        if (stale) {
          processedWheelSyncEventIds.delete(stale);
        }
      }
      return true;
    }

    function normalizeWheelSyncWinnerPayload(rawPayload) {
      const source = rawPayload && typeof rawPayload === "object" ? rawPayload : {};
      const type = String(source.type || "winner").trim().toLowerCase();
      if (type !== "winner") {
        return null;
      }

      const winnerName = String(source.winnerName || source.name || "").trim();
      if (!winnerName) {
        return null;
      }

      const minutes = Math.max(0, Math.floor(Number(source.minutes) || 0));
      const timerRaw = source.timerKey != null ? source.timerKey : source.timer;
      const timerKey = resolveWheelTimerKey(timerRaw, winnerName, minutes);
      const timestamp = Math.max(
        1,
        Math.floor(Number(source.timestamp || source.time || source.serverTimestamp || Date.now()) || Date.now())
      );
      let eventId = String(source.eventId || source.id || source.serverEventId || "").trim();
      if (!eventId) {
        const winnerToken = normalizeTimerLookupToken(winnerName) || "winner";
        const timerToken = normalizeTimerLookupToken(timerKey || "none") || "none";
        eventId = `sync-${timestamp}-${winnerToken}-${timerToken}`;
      }
      const sourceId = String(source.sourceId || "").trim();

      return {
        type: "winner",
        eventId,
        sourceId,
        winnerName,
        timerKey,
        minutes,
        timestamp
      };
    }

    function isWheelSyncFromCurrentWheelSource(sourceId) {
      const incomingSourceId = String(sourceId || "").trim();
      const currentWheelSourceId = String(window.__takuuWheelSyncSourceId || "").trim();
      if (!incomingSourceId || !currentWheelSourceId) {
        return false;
      }
      return incomingSourceId === currentWheelSourceId;
    }

    function appendWheelHistorySyncEntry(payload) {
      const normalized = normalizeWheelSyncWinnerPayload(payload);
      if (!normalized) {
        return false;
      }

      const incomingEntry = {
        id: normalized.eventId,
        source: "wheel-sync",
        name: normalized.winnerName,
        time: normalized.timestamp
      };
      const changed = applyWheelHistoryEntryToStatsCache(incomingEntry);
      if (!changed) {
        return false;
      }

      persistWheelHistoryEntryToApi(incomingEntry);

      try {
        window.dispatchEvent(
          new CustomEvent("takuu:wheel-history-updated", {
            detail: {
              winner: normalized.winnerName,
              entry: {
                id: normalized.eventId,
                name: normalized.winnerName,
                time: normalized.timestamp
              }
            }
          })
        );
      } catch (_error) {
        // Ignore dispatch failures.
      }

      return true;
    }

    function applyWheelWinnerSync(rawPayload, source = "sync") {
      const payload = normalizeWheelSyncWinnerPayload(rawPayload);
      if (!payload) {
        return false;
      }
      if (!markWheelSyncEventProcessed(payload.eventId)) {
        return false;
      }
      if (isWheelSyncFromCurrentWheelSource(payload.sourceId)) {
        return false;
      }

      if (payload.timerKey && payload.minutes > 0) {
        addTimerTimeFromExternal(payload.timerKey, payload.minutes, "minutes", {
          silentStatus: true,
          emitWebhook: false,
          source: `wheel-sync-${source}`
        });
      }

      appendWheelHistorySyncEntry(payload);
      renderWheelStats();
      return true;
    }

    function consumeWheelSyncMessage(rawMessage, source = "bridge") {
      const message = rawMessage && typeof rawMessage === "object" ? rawMessage : null;
      if (!message) {
        return false;
      }

      const candidate =
        message.payload && typeof message.payload === "object"
          ? {
              ...message.payload,
              serverEventId:
                message.payload.serverEventId != null
                  ? message.payload.serverEventId
                  : (message.id != null ? message.id : ""),
              serverTimestamp:
                message.payload.serverTimestamp != null
                  ? message.payload.serverTimestamp
                  : (message.time != null ? message.time : "")
            }
          : message;

      return applyWheelWinnerSync(candidate, source);
    }

    function stopWheelSyncApiPolling() {
      if (wheelSyncPollId) {
        window.clearInterval(wheelSyncPollId);
        wheelSyncPollId = null;
      }
    }

    function readWheelSyncCursorFromStorage() {
      try {
        const raw = Number.parseInt(String(window.localStorage.getItem(WHEEL_SYNC_CURSOR_STORAGE_KEY) || "0"), 10);
        if (!Number.isFinite(raw) || raw <= 0) {
          return 0;
        }
        return Math.max(0, Math.floor(raw));
      } catch (_error) {
        return 0;
      }
    }

    function saveWheelSyncCursorToStorage(value) {
      const normalized = Math.max(0, Math.floor(Number(value) || 0));
      try {
        if (normalized <= 0) {
          window.localStorage.removeItem(WHEEL_SYNC_CURSOR_STORAGE_KEY);
        } else {
          window.localStorage.setItem(WHEEL_SYNC_CURSOR_STORAGE_KEY, String(normalized));
        }
      } catch (_error) {
        // Ignore storage failures.
      }
    }

    function hydrateWheelSyncCursor() {
      if (wheelSyncCursorInitialized) {
        return;
      }
      wheelSyncCursorInitialized = true;
      const storedCursor = readWheelSyncCursorFromStorage();
      if (storedCursor > 0) {
        wheelSyncLastEventId = storedCursor;
      }
    }

    function setWheelSyncCursor(nextId) {
      const normalized = Math.max(0, Math.floor(Number(nextId) || 0));
      if (normalized === wheelSyncLastEventId) {
        return false;
      }
      wheelSyncLastEventId = normalized;
      saveWheelSyncCursorToStorage(normalized);
      return true;
    }

    async function pollWheelSyncApiOnce() {
      if (wheelSyncApiDisabled || typeof fetch !== "function") {
        return;
      }

      const query = wheelSyncLastEventId > 0 ? `?after=${wheelSyncLastEventId}` : "";
      let response;
      try {
        response = await fetch(`${WHEEL_SYNC_API_ENDPOINT}${query}`, { cache: "no-store" });
      } catch (_error) {
        console.warn("[TakuuScript] GET /api/wheel/sync request error", _error);
        return;
      }

      if (!response.ok) {
        let details = "";
        try {
          details = await response.text();
        } catch (_error) {
          details = "";
        }
        console.warn("[TakuuScript] GET /api/wheel/sync failed", {
          status: response.status,
          details
        });
        if (response.status === 404 || response.status === 405 || response.status === 501) {
          wheelSyncApiDisabled = true;
          stopWheelSyncApiPolling();
        }
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
        console.warn("[TakuuScript] GET /api/wheel/sync returned non-JSON response", {
          status: response.status,
          contentType,
          preview
        });
        return;
      }

      let data = null;
      try {
        data = await response.json();
      } catch (_error) {
        console.warn("[TakuuScript] GET /api/wheel/sync invalid JSON", _error);
        return;
      }

      if (!data || typeof data !== "object") {
        return;
      }

      const events = Array.isArray(data.events) ? data.events : [];
      const nextAfterFromResponse = Math.max(0, Math.floor(Number(data.nextAfter || 0)));
      const lastIdFromResponse = Math.max(0, Math.floor(Number(data.lastId || 0)));

      // First poll after page load should not replay old wheel results,
      // because timer state is already persisted in localStorage.
      if (wheelSyncLastEventId <= 0 && lastIdFromResponse > 0) {
        setWheelSyncCursor(lastIdFromResponse);
        return;
      }

      // If sync history was rotated/reset on backend, re-anchor cursor.
      if (
        wheelSyncLastEventId > 0 &&
        lastIdFromResponse > 0 &&
        lastIdFromResponse < wheelSyncLastEventId &&
        !events.length
      ) {
        setWheelSyncCursor(lastIdFromResponse);
        return;
      }

      let maxProcessedEventId = wheelSyncLastEventId;
      events.forEach((eventItem) => {
        if (!eventItem || typeof eventItem !== "object") {
          return;
        }
        const serverId = Math.max(0, Math.floor(Number(eventItem.id || 0)));
        if (serverId > maxProcessedEventId) {
          maxProcessedEventId = serverId;
        }
        consumeWheelSyncMessage(eventItem, "api");
      });

      if (nextAfterFromResponse > maxProcessedEventId) {
        maxProcessedEventId = nextAfterFromResponse;
      }

      if (!events.length && lastIdFromResponse > maxProcessedEventId) {
        maxProcessedEventId = lastIdFromResponse;
      }

      if (maxProcessedEventId > wheelSyncLastEventId) {
        setWheelSyncCursor(maxProcessedEventId);
      }
    }

    function clearWheelSyncSocketReconnect() {
      if (wheelSyncSocketRetryId) {
        window.clearTimeout(wheelSyncSocketRetryId);
        wheelSyncSocketRetryId = null;
      }
    }

    function scheduleWheelSyncSocketReconnect() {
      if (wheelSyncSocketRetryId || !WHEEL_WS_ENABLED || IS_FILE_PROTOCOL || typeof WebSocket !== "function") {
        return;
      }
      wheelSyncSocketRetryId = window.setTimeout(() => {
        wheelSyncSocketRetryId = null;
        connectWheelSyncSocket();
      }, WHEEL_SYNC_SOCKET_RETRY_MS);
    }

    function consumeWheelSyncSocketMessage(rawMessage) {
      const message = rawMessage && typeof rawMessage === "object" ? rawMessage : null;
      if (!message) {
        return false;
      }
      const messageType = String(message.type || "").trim().toLowerCase();
      const isSyncEnvelope =
        messageType === "wheel_sync_result" ||
        messageType === "wheel_sync" ||
        messageType === "wheel_result";

      if (isSyncEnvelope && message.payload && typeof message.payload === "object") {
        return consumeWheelSyncMessage(message.payload, "ws");
      }
      if (messageType === "winner") {
        return consumeWheelSyncMessage(message, "ws");
      }
      return false;
    }

    function connectWheelSyncSocket() {
      if (!WHEEL_WS_ENABLED || IS_FILE_PROTOCOL || typeof WebSocket !== "function") {
        return;
      }
      if (wheelSyncSocket && (wheelSyncSocket.readyState === 0 || wheelSyncSocket.readyState === 1)) {
        return;
      }
      clearWheelSyncSocketReconnect();

      try {
        wheelSyncSocket = new WebSocket(WHEEL_WS_URL);
        wheelSyncSocket.onopen = () => {
          clearWheelSyncSocketReconnect();
        };
        wheelSyncSocket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            consumeWheelSyncSocketMessage(message);
          } catch (_error) {
            // Ignore malformed websocket messages.
          }
        };
        wheelSyncSocket.onclose = () => {
          wheelSyncSocket = null;
          scheduleWheelSyncSocketReconnect();
        };
        wheelSyncSocket.onerror = () => {
          // Ignore websocket errors. Reconnect is handled by onclose.
        };
      } catch (_error) {
        wheelSyncSocket = null;
        scheduleWheelSyncSocketReconnect();
      }
    }

    function startWheelSyncBridge() {
      hydrateWheelSyncCursor();

      if ("BroadcastChannel" in window) {
        try {
          wheelSyncChannel = new BroadcastChannel(WHEEL_SYNC_CHANNEL_NAME);
          wheelSyncChannel.addEventListener("message", (event) => {
            consumeWheelSyncMessage(event?.data, "broadcast");
          });
        } catch (_error) {
          wheelSyncChannel = null;
        }
      }

      pollWheelSyncApiOnce();
      if (!wheelSyncApiDisabled && !wheelSyncPollId) {
        wheelSyncPollId = window.setInterval(() => {
          pollWheelSyncApiOnce();
        }, WHEEL_SYNC_POLL_MS);
      }
      connectWheelSyncSocket();
    }

    function readStorageJson(key, fallback) {
      try {
        const raw = window.localStorage.getItem(key);
        if (!raw) {
          return fallback;
        }
        const parsed = JSON.parse(raw);
        return parsed ?? fallback;
      } catch (_error) {
        return fallback;
      }
    }

    function saveStorageJson(key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (_error) {
        // Ignore storage write failures.
      }
    }

    function clearLegacyWheelHistoryStorage() {
      try {
        window.localStorage.removeItem("takuu_wheel_history");
      } catch (_error) {
        // Ignore storage failures.
      }
    }

    function setPanelStatus(element, text, type = "info") {
      if (!element) {
        return;
      }

      element.textContent = text;
      element.classList.toggle("is-error", type === "error");
      element.classList.toggle("is-success", type === "success");
    }

    function setAdminStatus(text, type = "info") {
      setPanelStatus(adminLoginStatusEl, text, type);
    }

    function setDiscordStatus(text, type = "info") {
      setPanelStatus(adminDiscordStatusEl, text, type);
    }

    function formatAbsoluteDateTime(value) {
      const timestamp = Math.max(0, Math.floor(Number(value || 0)));
      if (timestamp <= 0) {
        return "-";
      }
      try {
        return new Date(timestamp).toLocaleString("pl-PL");
      } catch (_error) {
        return "-";
      }
    }

    function getKickOAuthReturnPath() {
      if (IS_FILE_PROTOCOL) {
        return ADMIN_ROUTE_PATH;
      }
      try {
        return getCanonicalRoutePath("admin");
      } catch (_error) {
        return ADMIN_ROUTE_PATH;
      }
    }

    function buildKickOAuthRedirectUriPreview() {
      if (IS_FILE_PROTOCOL) {
        return "http://localhost:5500/api/kick/oauth/callback";
      }
      return `${window.location.origin.replace(/\/+$/, "")}/api/kick/oauth/callback`;
    }

    function setKickOAuthPanelStatus(message, type = "info") {
      setPanelStatus(kickOauthStatusEl, message, type);
    }

    function updateKickOAuthPanelView(status = null) {
      const state = status && typeof status === "object" ? status : {};
      const linked = state.linked === true;
      const hasSubscribers = Number.isFinite(Number(state.subscribersCount));

      if (kickOauthStatusTextEl) {
        kickOauthStatusTextEl.textContent = linked ? "Powiazane" : "Niepowiazane";
      }
      if (kickOauthChannelTextEl) {
        const channelLabel = String(state.channelSlug || state.channelName || "").trim();
        kickOauthChannelTextEl.textContent = channelLabel || "-";
      }
      if (kickOauthSubscribersTextEl) {
        kickOauthSubscribersTextEl.textContent = hasSubscribers
          ? Number(state.subscribersCount).toLocaleString("pl-PL")
          : "--";
      }
      if (kickOauthExpiresTextEl) {
        kickOauthExpiresTextEl.textContent = linked ? formatAbsoluteDateTime(state.expiresAt) : "-";
      }
      if (kickOauthRedirectTextEl) {
        kickOauthRedirectTextEl.textContent = buildKickOAuthRedirectUriPreview();
      }

      const bindingsAccess = hasBindingsAccess();
      if (kickOauthConnectBtnEl) {
        kickOauthConnectBtnEl.disabled = !bindingsAccess;
      }
      if (kickOauthRefreshBtnEl) {
        kickOauthRefreshBtnEl.disabled = false;
      }
      if (kickOauthUnlinkBtnEl) {
        kickOauthUnlinkBtnEl.disabled = !bindingsAccess || !linked;
      }
    }

    async function fetchKickOAuthStatus(force = false) {
      if (kickOAuthStatusBusy && !force) {
        return cachedKickOAuthStatus;
      }
      if (IS_FILE_PROTOCOL || typeof fetch !== "function") {
        cachedKickOAuthStatus = { linked: false, subscribersCount: null };
        updateKickOAuthPanelView(cachedKickOAuthStatus);
        return cachedKickOAuthStatus;
      }

      kickOAuthStatusBusy = true;
      const statusParams = new URLSearchParams();
      if (force) {
        statusParams.set("force", "1");
      }
      statusParams.set("_", String(Date.now()));
      const query = `?${statusParams.toString()}`;

      try {
        const response = await fetch(`${LOCAL_KICK_OAUTH_STATUS_ENDPOINT}${query}`, {
          method: "GET",
          cache: "no-store"
        });
        if (!response.ok) {
          throw new Error(`HTTP_${response.status}`);
        }

        const payload = await response.json();
        if (!payload || payload.ok !== true) {
          throw new Error(String(payload?.error || "KICK_OAUTH_STATUS_INVALID"));
        }

        if (payload.linked === false) {
          cachedKickOAuthStatus = { linked: false, subscribersCount: null };
        } else {
          cachedKickOAuthStatus = {
            linked: true,
            channelSlug: String(payload.channelSlug || "").trim(),
            channelName: String(payload.channelName || "").trim(),
            subscribersCount: parseKickCountValue(payload.subscribersCount),
            canceledSubscribersCount: parseKickCountValue(payload.canceledSubscribersCount),
            followersCount: parseKickCountValue(payload.followersCount),
            scope: String(payload.scope || "").trim(),
            expiresAt: Math.max(0, Math.floor(Number(payload.expiresAt || 0))),
            updatedAt: Math.max(0, Math.floor(Number(payload.updatedAt || Date.now()))),
            lastChannelSyncAt: Math.max(0, Math.floor(Number(payload.lastChannelSyncAt || 0)))
          };
        }

        updateKickOAuthPanelView(cachedKickOAuthStatus);
        return cachedKickOAuthStatus;
      } catch (_error) {
        if (!cachedKickOAuthStatus) {
          cachedKickOAuthStatus = { linked: false, subscribersCount: null };
        }
        updateKickOAuthPanelView(cachedKickOAuthStatus);
        return cachedKickOAuthStatus;
      } finally {
        kickOAuthStatusBusy = false;
      }
    }

    function startKickOAuthStatusPolling() {
      void fetchKickOAuthStatus();
      if (kickOAuthStatusPollId) {
        return;
      }

      kickOAuthStatusPollId = window.setInterval(() => {
        void fetchKickOAuthStatus();
      }, KICK_OAUTH_STATUS_POLL_MS);
    }

    function consumeKickOAuthResultFromUrl() {
      let currentUrl = null;
      try {
        currentUrl = new URL(window.location.href);
      } catch (_error) {
        return;
      }

      const oauthState = String(currentUrl.searchParams.get("kick_oauth") || "").trim().toLowerCase();
      if (!oauthState) {
        return;
      }
      const oauthMessage = String(currentUrl.searchParams.get("kick_oauth_msg") || "").trim();

      if (oauthState === "success") {
        setKickOAuthPanelStatus(oauthMessage || "Konto Kick zostalo pomyslnie powiazane.", "success");
      } else {
        setKickOAuthPanelStatus(oauthMessage || "Nie udalo sie powiazac konta Kick.", "error");
      }

      currentUrl.searchParams.delete("kick_oauth");
      currentUrl.searchParams.delete("kick_oauth_msg");
      const nextRelative = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`;
      try {
        window.history.replaceState(window.history.state, "", nextRelative);
      } catch (_error) {
        // Ignore URL cleanup failures.
      }

      void fetchKickOAuthStatus(true);
      if (oauthState === "success") {
        void updateKickFollowersBadge(true);
      }
    }

    async function fetchKickSubscribersFromOAuth() {
      if (IS_FILE_PROTOCOL || typeof fetch !== "function") {
        return { linked: false, count: null };
      }

      const response = await withKickChannelTimeout(
        () =>
          fetch(`${LOCAL_KICK_SUBSCRIPTIONS_ENDPOINT}?_=${Date.now()}`, {
            method: "GET",
            cache: "no-store"
          }),
        KICK_SUBSCRIPTIONS_REQUEST_TIMEOUT_MS,
        "KICK_SUBSCRIPTIONS_TIMEOUT"
      );
      if (!response.ok) {
        throw new Error(`HTTP_${response.status}`);
      }

      const payload = await response.json();
      if (!payload || payload.ok !== true) {
        throw new Error(String(payload?.error || "KICK_SUBSCRIPTIONS_INVALID"));
      }

      if (payload.linked === false) {
        cachedKickOAuthStatus = {
          linked: false,
          subscribersCount: null
        };
        updateKickOAuthPanelView(cachedKickOAuthStatus);
        return { linked: false, count: null };
      }

      const nextState = {
        ...(cachedKickOAuthStatus && typeof cachedKickOAuthStatus === "object" ? cachedKickOAuthStatus : {}),
        linked: true,
        channelSlug: String(payload.channelSlug || "").trim(),
        channelName: String(payload.channelName || "").trim(),
        subscribersCount: parseKickCountValue(payload.subscribersCount),
        canceledSubscribersCount: parseKickCountValue(payload.canceledSubscribersCount),
        followersCount: parseKickCountValue(payload.followersCount),
        expiresAt: Math.max(0, Math.floor(Number(payload.expiresAt || 0))),
        updatedAt: Math.max(0, Math.floor(Number(payload.updatedAt || Date.now()))),
        lastChannelSyncAt: Math.max(0, Math.floor(Number(payload.lastChannelSyncAt || 0)))
      };
      cachedKickOAuthStatus = nextState;
      updateKickOAuthPanelView(cachedKickOAuthStatus);

      return {
        linked: true,
        count: Number.isFinite(Number(nextState.subscribersCount)) ? Number(nextState.subscribersCount) : null
      };
    }

    function startKickOAuthConnectionFlow() {
      if (IS_FILE_PROTOCOL) {
        setKickOAuthPanelStatus("Kick OAuth wymaga uruchomienia strony przez localhost lub domene.", "error");
        return;
      }

      const returnTo = getKickOAuthReturnPath();
      const oauthStartUrl = new URL(LOCAL_KICK_OAUTH_START_ENDPOINT, window.location.origin);
      oauthStartUrl.searchParams.set("redirect", "1");
      oauthStartUrl.searchParams.set("return_to", returnTo);
      window.location.href = oauthStartUrl.toString();
    }

    async function unlinkKickOAuthConnection() {
      if (IS_FILE_PROTOCOL || typeof fetch !== "function") {
        setKickOAuthPanelStatus("Kick OAuth unlink nie dziala w trybie file://", "error");
        return;
      }

      try {
        const response = await fetch(LOCAL_KICK_OAUTH_UNLINK_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ action: "unlink" }),
          cache: "no-store"
        });
        if (!response.ok) {
          throw new Error(`HTTP_${response.status}`);
        }
        setKickOAuthPanelStatus("Polaczenie Kick OAuth zostalo odlaczone.", "success");
        cachedKickOAuthStatus = { linked: false, subscribersCount: null };
        updateKickOAuthPanelView(cachedKickOAuthStatus);
        setKickSubsBadgeState({
          count: null,
          text: "ładowanie danych z Kick...",
          state: "loading"
        });
        void updateKickFollowersBadge(true);
      } catch (_error) {
        setKickOAuthPanelStatus("Nie udalo sie odlaczyc konta Kick.", "error");
      }
    }

    function getAdminActorContext() {
      if (window.TakuuWebhook && typeof window.TakuuWebhook.getActorIdentity === "function") {
        const actor = window.TakuuWebhook.getActorIdentity(currentAdminLogin);
        if (actor && typeof actor === "object") {
          return actor;
        }
      }
      const fallbackLogin = String(currentAdminLogin || "").trim() || "unknown-admin";
      return {
        type: "local",
        login: fallbackLogin,
        label: fallbackLogin
      };
    }

    function sendAdminWebhookEvent(action, target, details = {}) {
      if (!window.TakuuWebhook || typeof window.TakuuWebhook.sendAdminAudit !== "function") {
        return;
      }
      const payload = {
        action: String(action || "admin_change"),
        target: String(target || "Panel Administratora"),
        details: details && typeof details === "object" ? details : {},
        actor: getAdminActorContext(),
        route: window.location.href
      };
      Promise.resolve(window.TakuuWebhook.sendAdminAudit(payload)).catch(() => {
        // Ignore webhook failures in UI flow.
      });
    }

    function canAccountAccessAnyAdminArea(account) {
      if (!account || typeof account !== "object") {
        return false;
      }
      if (account.isRoot) {
        return true;
      }
      if (normalizeDiscordUserId(account.discordUserId) === ROOT_ADMIN_DISCORD_ID) {
        return true;
      }
      return Boolean(account.canAccessAdmin || account.canAccessStreamObs || account.canAccessBindings);
    }

    function hasOwnerAdminAccess() {
      if (!isAdminAuthenticated) {
        return false;
      }

      const currentLogin = String(currentAdminLogin || "").trim().toLowerCase();
      if (currentLogin && currentLogin === String(ROOT_ADMIN_LOGIN).toLowerCase()) {
        return true;
      }

      const currentAccount = adminAccounts.find(
        (item) => String(item.login || "").trim().toLowerCase() === currentLogin
      );
      if (
        currentAccount &&
        (
          currentAccount.isRoot ||
          currentAccount.canAccessAdmin ||
          normalizeDiscordUserId(currentAccount.discordUserId) === ROOT_ADMIN_DISCORD_ID
        )
      ) {
        return true;
      }

      if (activeDiscordSession && normalizeDiscordUserId(activeDiscordSession.id) === ROOT_ADMIN_DISCORD_ID) {
        return true;
      }
      if (
        activeDiscordSession &&
        adminAccounts.some(
          (item) =>
            normalizeDiscordUserId(item.discordUserId) === normalizeDiscordUserId(activeDiscordSession.id) &&
            item.canAccessAdmin
        )
      ) {
        return true;
      }
      if (!activeDiscordSession) {
        return false;
      }
      return Boolean(
        window.TakuuWebhook &&
          typeof window.TakuuWebhook.isDiscordOwnerSession === "function" &&
          window.TakuuWebhook.isDiscordOwnerSession(activeDiscordSession)
      );
    }

    function hasStreamObsAccess() {
      if (OBS_OVERLAY_MODE) {
        return true;
      }
      if (!isAdminAuthenticated) {
        return false;
      }

      const currentLogin = String(currentAdminLogin || "").trim().toLowerCase();
      if (currentLogin && currentLogin === String(ROOT_ADMIN_LOGIN).toLowerCase()) {
        return true;
      }

      const currentAccount = adminAccounts.find(
        (item) => String(item.login || "").trim().toLowerCase() === currentLogin
      );
      if (
        currentAccount &&
        (
          currentAccount.isRoot ||
          currentAccount.canAccessStreamObs ||
          normalizeDiscordUserId(currentAccount.discordUserId) === ROOT_ADMIN_DISCORD_ID
        )
      ) {
        return true;
      }

      if (activeDiscordSession && normalizeDiscordUserId(activeDiscordSession.id) === ROOT_ADMIN_DISCORD_ID) {
        return true;
      }
      if (
        activeDiscordSession &&
        adminAccounts.some(
          (item) =>
            normalizeDiscordUserId(item.discordUserId) === normalizeDiscordUserId(activeDiscordSession.id) &&
            (item.canAccessStreamObs || item.isRoot)
        )
      ) {
        return true;
      }
      if (!activeDiscordSession) {
        return false;
      }
      return Boolean(
        window.TakuuWebhook &&
          typeof window.TakuuWebhook.isDiscordOwnerSession === "function" &&
          window.TakuuWebhook.isDiscordOwnerSession(activeDiscordSession)
      );
    }

    function hasBindingsAccess() {
      if (!isAdminAuthenticated) {
        return false;
      }

      const currentLogin = String(currentAdminLogin || "").trim().toLowerCase();
      if (currentLogin && currentLogin === String(ROOT_ADMIN_LOGIN).toLowerCase()) {
        return true;
      }

      const currentAccount = adminAccounts.find(
        (item) => String(item.login || "").trim().toLowerCase() === currentLogin
      );
      if (
        currentAccount &&
        (
          currentAccount.isRoot ||
          currentAccount.canAccessBindings ||
          normalizeDiscordUserId(currentAccount.discordUserId) === ROOT_ADMIN_DISCORD_ID
        )
      ) {
        return true;
      }

      if (activeDiscordSession && normalizeDiscordUserId(activeDiscordSession.id) === ROOT_ADMIN_DISCORD_ID) {
        return true;
      }
      if (
        activeDiscordSession &&
        adminAccounts.some(
          (item) =>
            normalizeDiscordUserId(item.discordUserId) === normalizeDiscordUserId(activeDiscordSession.id) &&
            (item.canAccessBindings || item.isRoot)
        )
      ) {
        return true;
      }
      if (!activeDiscordSession) {
        return false;
      }
      return Boolean(
        window.TakuuWebhook &&
          typeof window.TakuuWebhook.isDiscordOwnerSession === "function" &&
          window.TakuuWebhook.isDiscordOwnerSession(activeDiscordSession)
      );
    }

    function setLoginPasswordVisibility(visible) {
      if (adminLoginPasswordEl) {
        adminLoginPasswordEl.type = visible ? "text" : "password";
      }
      if (adminPasswordToggleEl) {
        adminPasswordToggleEl.setAttribute("aria-pressed", visible ? "true" : "false");
        adminPasswordToggleEl.setAttribute("aria-label", visible ? "Ukryj hasło" : "Pokaż hasło");
      }
      if (adminPasswordToggleIconEl) {
        adminPasswordToggleIconEl.classList.toggle("fa-eye", !visible);
        adminPasswordToggleIconEl.classList.toggle("fa-eye-slash", visible);
      }
      if (adminShowPasswordEl && adminShowPasswordEl.type === "checkbox") {
        adminShowPasswordEl.checked = Boolean(visible);
      }
    }

    function normalizeDiscordUserId(value) {
      if (window.TakuuWebhook && typeof window.TakuuWebhook.normalizeDiscordUserId === "function") {
        return window.TakuuWebhook.normalizeDiscordUserId(value);
      }
      return "";
    }

    function canDiscordSessionAccessAdmin(session) {
      if (window.TakuuWebhook && typeof window.TakuuWebhook.canDiscordSessionAccessAdmin === "function") {
        return window.TakuuWebhook.canDiscordSessionAccessAdmin(session, adminAccounts);
      }
      return false;
    }

    function upsertAdminAccountFromDiscordSession(session) {
      if (!window.TakuuWebhook || typeof window.TakuuWebhook.upsertAdminAccountFromDiscordSession !== "function") {
        return null;
      }
      const result = window.TakuuWebhook.upsertAdminAccountFromDiscordSession(session, adminAccounts);
      if (!result || !result.account) {
        return null;
      }
      if (result.changed) {
        saveAdminAccounts();
      }
      return result.account;
    }

    function sanitizeMemberUrl(rawUrl) {
      const clean = String(rawUrl || "").trim();
      if (!clean) {
        return "";
      }
      if (/^https?:\/\//i.test(clean)) {
        return clean;
      }
      return `https://kick.com/${clean.replace(/^@+/, "")}`;
    }

    function getRootAdminAccount(discordName = "") {
      return {
        id: ROOT_ADMIN_ID,
        login: ROOT_ADMIN_LOGIN,
        password: ROOT_ADMIN_PASSWORD,
        discordUserId: ROOT_ADMIN_DISCORD_ID,
        discordName: String(discordName || ""),
        canAccessAdmin: true,
        canAccessStreamObs: true,
        canAccessBindings: true,
        isRoot: true,
        isDiscordAccount: false
      };
    }

    function normalizeAdminAccounts(rawAccounts) {
      const accounts = Array.isArray(rawAccounts)
        ? rawAccounts
            .filter((item) => item && (item.discordUserId || (item.login && item.password)))
            .map((item) => ({
              id: String(item.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
              login: String(item.login || ""),
              password: String(item.password || ""),
              discordUserId: normalizeDiscordUserId(item.discordUserId),
              discordName: String(item.discordName || ""),
              canAccessAdmin: Boolean(item.canAccessAdmin),
              canAccessStreamObs:
                item.canAccessStreamObs == null ? Boolean(item.canAccessAdmin) : Boolean(item.canAccessStreamObs),
              canAccessBindings:
                item.canAccessBindings == null ? Boolean(item.canAccessAdmin) : Boolean(item.canAccessBindings),
              isRoot: Boolean(item.isRoot),
              isDiscordAccount: Boolean(item.isDiscordAccount || item.discordUserId)
            }))
        : [];

      accounts.forEach((account) => {
        if (!account.login && account.discordUserId) {
          account.login = `discord:${account.discordUserId}`;
        }
        if (!account.password) {
          account.password = account.isDiscordAccount ? "DISCORD_ONLY" : "";
        }
      });

      const rootIndex = accounts.findIndex((item) => item.id === ROOT_ADMIN_ID || item.login === ROOT_ADMIN_LOGIN);
      const rootDiscordName = rootIndex !== -1 ? String(accounts[rootIndex].discordName || "") : "";
      if (rootIndex === -1) {
        accounts.unshift(getRootAdminAccount(rootDiscordName));
      } else {
        accounts[rootIndex] = getRootAdminAccount(rootDiscordName);
      }
      return accounts;
    }

    function normalizeCustomMembers(rawMembers) {
      if (!Array.isArray(rawMembers)) {
        return [];
      }
      return rawMembers
        .filter((item) => item && item.id && item.name && item.url)
        .map((item) => ({
          id: String(item.id),
          name: String(item.name),
          url: sanitizeMemberUrl(item.url),
          avatar: String(item.avatar || CHANNEL_AVATAR_FALLBACK)
        }));
    }

    function loadAdminAccounts() {
      const fallback = [
        getRootAdminAccount("")
      ];

      const raw = readStorageJson(ADMIN_ACCOUNTS_KEY, fallback);
      return normalizeAdminAccounts(raw);
    }

    function saveAdminAccounts() {
      saveStorageJson(ADMIN_ACCOUNTS_KEY, adminAccounts);
      if (!adminStateApplyingRemote) {
        queueAdminStateApiPush();
      }
    }

    function sanitizeBaseMemberOverrides(rawValue) {
      if (!rawValue || typeof rawValue !== "object" || Array.isArray(rawValue)) {
        return {};
      }

      const entries = Object.entries(rawValue);
      const normalized = {};
      entries.forEach(([id, value]) => {
        const cleanId = String(id || "").trim();
        if (!cleanId || !value || typeof value !== "object" || Array.isArray(value)) {
          return;
        }
        const name = String(value.name || "").trim();
        const url = sanitizeMemberUrl(value.url || "");
        const avatar = String(value.avatar || "").trim();
        const deleted = value.deleted === true;

        if (!deleted && !name && !url && !avatar) {
          return;
        }

        normalized[cleanId] = {
          name: name || "",
          url: url || "",
          avatar: avatar || "",
          deleted
        };
      });

      return normalized;
    }

    function loadBaseMemberOverrides() {
      const raw = readStorageJson(CCI_BASE_MEMBER_OVERRIDES_KEY, {});
      return sanitizeBaseMemberOverrides(raw);
    }

    function saveBaseMemberOverrides() {
      baseMemberOverrides = sanitizeBaseMemberOverrides(baseMemberOverrides);
      saveStorageJson(CCI_BASE_MEMBER_OVERRIDES_KEY, baseMemberOverrides);
      if (!adminStateApplyingRemote) {
        queueAdminStateApiPush();
      }
    }

    function loadCustomMembers() {
      const raw = readStorageJson(CCI_MEMBERS_KEY, []);
      return normalizeCustomMembers(raw);
    }

    function loadBaseMembersFromGrid() {
      if (!friendsGridEl) {
        return [];
      }

      const nodes = Array.from(friendsGridEl.querySelectorAll(".friend-card:not(.custom-member)"));
      return nodes
        .map((card, index) => {
          const id = `base-${index + 1}`;
          const override = baseMemberOverrides && typeof baseMemberOverrides === "object"
            ? baseMemberOverrides[id]
            : null;
          if (override && override.deleted === true) {
            return null;
          }

          const baseName = String(card.querySelector(".friend-name")?.textContent || "").trim();
          const href = String(card.getAttribute("href") || "").trim();
          const baseUrl = sanitizeMemberUrl(href);
          const baseAvatar = String(card.querySelector(".friend-avatar")?.getAttribute("src") || "").trim() || CHANNEL_AVATAR_FALLBACK;

          const overrideName = override && typeof override.name === "string" ? String(override.name || "").trim() : "";
          const overrideUrl = override && typeof override.url === "string" ? sanitizeMemberUrl(override.url) : "";
          const overrideAvatar = override && typeof override.avatar === "string" ? String(override.avatar || "").trim() : "";

          const name = overrideName || baseName || `Członek ${index + 1}`;
          const url = overrideUrl || baseUrl;
          const avatar = overrideAvatar || baseAvatar || CHANNEL_AVATAR_FALLBACK;

          return {
            id,
            name,
            url,
            avatar
          };
        })
        .filter((item) => item && item.name && item.url);
    }

    function saveCustomMembers() {
      saveStorageJson(CCI_MEMBERS_KEY, customMembers);
      if (!adminStateApplyingRemote) {
        queueAdminStateApiPush();
      }
    }

    function loadMembersOrder() {
      const raw = readStorageJson(CCI_MEMBERS_ORDER_KEY, []);
      if (!Array.isArray(raw)) {
        return [];
      }
      return raw.map((item) => String(item || "").trim()).filter(Boolean);
    }

    function saveMembersOrder() {
      saveStorageJson(CCI_MEMBERS_ORDER_KEY, membersOrder);
      if (!adminStateApplyingRemote) {
        queueAdminStateApiPush();
      }
    }

    function getAllMembers() {
      return [
        ...baseMembers.map((member) => ({ ...member, builtIn: true })),
        ...customMembers.map((member) => ({ ...member, builtIn: false }))
      ];
    }

    function normalizeMembersOrder(orderList, members = getAllMembers()) {
      const availableIds = members.map((member) => String(member.id || "").trim()).filter(Boolean);
      const availableSet = new Set(availableIds);
      const nextOrder = [];
      const seen = new Set();

      if (Array.isArray(orderList)) {
        orderList.forEach((id) => {
          const cleanId = String(id || "").trim();
          if (!cleanId || seen.has(cleanId) || !availableSet.has(cleanId)) {
            return;
          }
          seen.add(cleanId);
          nextOrder.push(cleanId);
        });
      }

      availableIds.forEach((id) => {
        if (seen.has(id)) {
          return;
        }
        seen.add(id);
        nextOrder.push(id);
      });

      return nextOrder;
    }

    function refreshMembersOrder(persist = false) {
      membersOrder = normalizeMembersOrder(membersOrder);
      const orderIndex = new Map(membersOrder.map((id, index) => [id, index]));
      const getPosition = (member) => (orderIndex.has(member.id) ? orderIndex.get(member.id) : Number.MAX_SAFE_INTEGER);

      baseMembers = baseMembers.slice().sort((left, right) => getPosition(left) - getPosition(right));
      customMembers = customMembers.slice().sort((left, right) => getPosition(left) - getPosition(right));

      if (persist) {
        saveMembersOrder();
        saveCustomMembers();
      }
    }

    function getOrderedMembers() {
      const allMembers = getAllMembers();
      const order = normalizeMembersOrder(membersOrder, allMembers);
      const membersById = new Map(allMembers.map((member) => [member.id, member]));
      return order.map((id) => membersById.get(id)).filter(Boolean);
    }

    function setMemberFormEditingState(memberId = "") {
      editingMemberId = String(memberId || "").trim();
      if (adminMemberSubmitBtnEl) {
        adminMemberSubmitBtnEl.textContent = editingMemberId ? "Zapisz zmiany członka CCI" : "Dodaj Członka CCI";
      }
    }

    function stopMemberEdit(options = {}) {
      const shouldResetForm = options.resetForm === true;
      const statusText = String(options.statusText || "").trim();
      const statusType = String(options.statusType || "info");

      setMemberFormEditingState("");
      if (adminMemberFormEl && shouldResetForm) {
        adminMemberFormEl.reset();
      }
      if (statusText) {
        setPanelStatus(adminMemberStatusEl, statusText, statusType);
      }
    }

    function startMemberEdit(memberId) {
      if (!adminMemberFormEl) {
        return;
      }

      const cleanId = String(memberId || "").trim();
      if (!cleanId) {
        return;
      }

      if (editingMemberId && editingMemberId === cleanId) {
        stopMemberEdit({
          resetForm: true,
          statusText: "Anulowano edycję członka CCI.",
          statusType: "info"
        });
        return;
      }

      const member = getAllMembers().find((item) => item.id === cleanId);
      if (!member) {
        setPanelStatus(adminMemberStatusEl, "Nie znaleziono członka do edycji.", "error");
        return;
      }

      const nameInput = adminMemberFormEl.querySelector('input[name="memberName"]');
      const kickInput = adminMemberFormEl.querySelector('input[name="memberKick"]');
      const avatarInput = adminMemberFormEl.querySelector('input[name="memberAvatar"]');

      if (nameInput) {
        nameInput.value = member.name;
      }
      if (kickInput) {
        kickInput.value = member.url;
      }
      if (avatarInput) {
        avatarInput.value = member.avatar === CHANNEL_AVATAR_FALLBACK ? "" : member.avatar;
      }

      setMemberFormEditingState(cleanId);
      const memberTypeText = member.builtIn ? " (wbudowany)" : "";
      setPanelStatus(adminMemberStatusEl, `Edytujesz członka CCI${memberTypeText}: ${member.name}.`, "info");
      if (nameInput) {
        nameInput.focus();
      }
    }

    function applyMembersOrderFromDom() {
      if (!adminMembersTableBodyEl) {
        return false;
      }

      const orderedIds = Array.from(adminMembersTableBodyEl.querySelectorAll("tr[data-member-id]"))
        .map((row) => String(row.dataset.memberId || "").trim())
        .filter(Boolean);
      if (!orderedIds.length) {
        return false;
      }

      const previousOrder = normalizeMembersOrder(membersOrder);
      const nextOrder = normalizeMembersOrder(orderedIds);
      const changed =
        previousOrder.length !== nextOrder.length || previousOrder.some((id, index) => id !== nextOrder[index]);

      if (!changed) {
        return false;
      }

      membersOrder = nextOrder;
      refreshMembersOrder(true);
      return true;
    }

    function findDropTargetMemberRow(pointerY) {
      if (!adminMembersTableBodyEl) {
        return null;
      }

      const rows = Array.from(adminMembersTableBodyEl.querySelectorAll("tr[data-member-id]")).filter((row) => {
        const rowId = String(row.dataset.memberId || "");
        return rowId && rowId !== draggingMemberId;
      });
      let dropTarget = null;
      let closestOffset = Number.NEGATIVE_INFINITY;

      rows.forEach((row) => {
        const rect = row.getBoundingClientRect();
        const offset = pointerY - rect.top - rect.height / 2;
        if (offset < 0 && offset > closestOffset) {
          closestOffset = offset;
          dropTarget = row;
        }
      });

      return dropTarget;
    }

    function clearCennikDragTargetRows() {
      if (!adminCennikTableBodyEl) {
        return;
      }
      adminCennikTableBodyEl
        .querySelectorAll("tr.admin-cennik-row.is-drag-target")
        .forEach((row) => row.classList.remove("is-drag-target"));
    }

    function findDropTargetCennikRow(pointerY, section) {
      if (!adminCennikTableBodyEl) {
        return null;
      }
      const cleanSection = normalizeKarySection(section);
      const rows = Array.from(
        adminCennikTableBodyEl.querySelectorAll(`tr.admin-cennik-row[data-cennik-section="${cleanSection}"]`)
      ).filter((row) => {
        const rowId = String(row.dataset.cennikId || "").trim();
        return rowId && rowId !== draggingCennikId;
      });

      let dropTarget = null;
      let closestOffset = Number.NEGATIVE_INFINITY;

      rows.forEach((row) => {
        const rect = row.getBoundingClientRect();
        const offset = pointerY - rect.top - rect.height / 2;
        if (offset < 0 && offset > closestOffset) {
          closestOffset = offset;
          dropTarget = row;
        }
      });

      return dropTarget;
    }

    function moveDraggingCennikRowToSectionEnd(section) {
      if (!adminCennikTableBodyEl || !draggingCennikRow) {
        return;
      }
      const cleanSection = normalizeKarySection(section);
      const sectionRows = Array.from(
        adminCennikTableBodyEl.querySelectorAll(`tr.admin-cennik-row[data-cennik-section="${cleanSection}"]`)
      ).filter((row) => row !== draggingCennikRow);

      if (!sectionRows.length) {
        return;
      }
      const lastRow = sectionRows[sectionRows.length - 1];
      if (lastRow.nextSibling) {
        adminCennikTableBodyEl.insertBefore(draggingCennikRow, lastRow.nextSibling);
      } else {
        adminCennikTableBodyEl.appendChild(draggingCennikRow);
      }
    }

    function applyCennikOrderFromDom(section) {
      if (!adminCennikTableBodyEl) {
        return false;
      }

      const cleanSection = normalizeKarySection(section);
      const orderedIds = Array.from(
        adminCennikTableBodyEl.querySelectorAll(`tr.admin-cennik-row[data-cennik-section="${cleanSection}"]`)
      )
        .map((row) => String(row.dataset.cennikId || "").trim())
        .filter(Boolean);

      if (!orderedIds.length) {
        return false;
      }

      const previousOrder = getSortedKaryCennikItems()
        .filter((item) => item.section === cleanSection)
        .map((item) => item.id);

      const changed =
        previousOrder.length !== orderedIds.length ||
        previousOrder.some((itemId, index) => itemId !== orderedIds[index]);

      if (!changed) {
        return false;
      }

      const orderMap = new Map(orderedIds.map((itemId, index) => [itemId, index]));
      karyCennikItems = karyCennikItems.map((item) => {
        if (item.section !== cleanSection) {
          return item;
        }
        const nextOrder = orderMap.get(item.id);
        if (!Number.isInteger(nextOrder)) {
          return item;
        }
        return {
          ...item,
          sortOrder: nextOrder
        };
      });

      return true;
    }

    function getRememberMeState() {
      const state = { enabled: false, expired: false };
      const now = Date.now();
      try {
        const rawValue = String(window.localStorage.getItem(ADMIN_REMEMBER_ME_KEY) || "").trim();
        if (!rawValue) {
          return state;
        }

        // Backward compatibility for older boolean storage format.
        if (rawValue === "1") {
          const migratedExpiresAt = now + ADMIN_REMEMBER_ME_MAX_AGE_MS;
          window.localStorage.setItem(ADMIN_REMEMBER_ME_KEY, String(migratedExpiresAt));
          state.enabled = true;
          return state;
        }

        const expiresAt = Number(rawValue);
        if (!Number.isFinite(expiresAt)) {
          window.localStorage.removeItem(ADMIN_REMEMBER_ME_KEY);
          return state;
        }
        if (expiresAt <= now) {
          window.localStorage.removeItem(ADMIN_REMEMBER_ME_KEY);
          state.expired = true;
          return state;
        }
        state.enabled = true;
      } catch (_error) {
        // Ignore storage read failures.
      }
      return state;
    }

    function isRememberMeEnabled() {
      return getRememberMeState().enabled;
    }

    function setRememberMeEnabled(enabled) {
      const normalized = Boolean(enabled);
      try {
        if (normalized) {
          const expiresAt = Date.now() + ADMIN_REMEMBER_ME_MAX_AGE_MS;
          window.localStorage.setItem(ADMIN_REMEMBER_ME_KEY, String(expiresAt));
        } else {
          window.localStorage.removeItem(ADMIN_REMEMBER_ME_KEY);
        }
      } catch (_error) {
        // Ignore storage write failures.
      }

      if (adminRememberMeEl) {
        adminRememberMeEl.checked = normalized;
      }
    }

    function isReloadNavigation() {
      try {
        if (window.performance && typeof window.performance.getEntriesByType === "function") {
          const entries = window.performance.getEntriesByType("navigation");
          if (entries && entries.length) {
            return entries[0].type === "reload";
          }
        }
      } catch (_error) {
        // Ignore navigation timing read failures.
      }

      try {
        if (window.performance && window.performance.navigation) {
          return window.performance.navigation.type === window.performance.navigation.TYPE_RELOAD;
        }
      } catch (_error) {
        // Ignore legacy navigation timing failures.
      }

      return false;
    }

    function clearAdminSessionOnReload() {
      const rememberState = getRememberMeState();

      if (rememberState.expired) {
        try {
          window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
        } catch (_error) {
          // Ignore session storage failures.
        }

        if (window.TakuuWebhook && typeof window.TakuuWebhook.clearDiscordSession === "function") {
          window.TakuuWebhook.clearDiscordSession();
        }

        isAdminAuthenticated = false;
        currentAdminLogin = "";
        activeDiscordSession = null;
        return;
      }

      if (!isReloadNavigation()) {
        return;
      }

      if (rememberState.enabled) {
        return;
      }

      try {
        window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
      } catch (_error) {
        // Ignore session storage failures.
      }

      if (window.TakuuWebhook && typeof window.TakuuWebhook.clearDiscordSession === "function") {
        window.TakuuWebhook.clearDiscordSession();
      }

      isAdminAuthenticated = false;
      currentAdminLogin = "";
      activeDiscordSession = null;
    }

    function restoreAdminSession() {
      activeDiscordSession = null;
      if (window.TakuuWebhook && typeof window.TakuuWebhook.getStoredDiscordSession === "function") {
        const discordSession = window.TakuuWebhook.getStoredDiscordSession();
        if (discordSession && discordSession.isAuthorized && discordSession.username) {
          activeDiscordSession = discordSession;
          upsertAdminAccountFromDiscordSession(discordSession);
          isAdminAuthenticated = canDiscordSessionAccessAdmin(discordSession);
          currentAdminLogin = isAdminAuthenticated ? `discord:${discordSession.username}` : "";
          if (!isAdminAuthenticated) {
            setAdminStatus("Konto Discord nie ma permisji do zadnej zakladki admina.", "error");
          }
          return;
        }
      }

      try {
        const savedLogin = String(window.sessionStorage.getItem(ADMIN_SESSION_KEY) || "");
        if (!savedLogin) {
          isAdminAuthenticated = false;
          currentAdminLogin = "";
          return;
        }

        const matched = adminAccounts.find((item) => item.login === savedLogin && canAccountAccessAnyAdminArea(item));
        isAdminAuthenticated = Boolean(matched);
        currentAdminLogin = matched ? matched.login : "";
      } catch (_error) {
        isAdminAuthenticated = false;
        currentAdminLogin = "";
      }
    }

    function renderCustomMembersCards() {
      if (!friendsGridEl) {
        return;
      }

      const orderedMembers = getOrderedMembers();
      friendsGridEl.innerHTML = "";

      orderedMembers.forEach((member) => {
        const card = document.createElement("a");
        card.className = member.builtIn ? "friend-card" : "friend-card custom-member";
        card.href = member.url;
        card.target = "_blank";
        card.rel = "noopener noreferrer";
        const avatar = String(member.avatar || "").trim() || CHANNEL_AVATAR_FALLBACK;

        card.innerHTML = `
          <span class="friend-avatar-wrap">
            <img class="friend-avatar" src="${escapeHtml(avatar)}" alt="${escapeHtml(member.name)}">
            <img class="friend-k" src="${escapeHtml(KICK_ICON_URL)}" alt="">
          </span>
          <span class="friend-name">${escapeHtml(member.name)}</span>
        `;

        friendsGridEl.appendChild(card);
      });

      updateFriendsLiveBadges();
    }

    function getKickSlugFromUrl(rawUrl) {
      const clean = sanitizeMemberUrl(rawUrl);
      try {
        const parsed = new URL(clean);
        const parts = parsed.pathname.split("/").map((part) => part.trim()).filter(Boolean);
        if (!parts.length) {
          return "";
        }
        if (parts[0].toLowerCase() === "popout" && parts[1]) {
          return parts[1].toLowerCase();
        }
        return parts[0].toLowerCase();
      } catch (_error) {
        return String(clean)
          .replace(/^https?:\/\/(?:www\.)?kick\.com\//i, "")
          .split(/[/?#]/)[0]
          .trim()
          .toLowerCase();
      }
    }

    function isKickChannelLive(channelData) {
      if (!channelData || typeof channelData !== "object") {
        return false;
      }

      const candidates = [channelData];
      if (channelData.data && typeof channelData.data === "object") {
        candidates.push(channelData.data);
      }
      if (channelData.channel && typeof channelData.channel === "object") {
        candidates.push(channelData.channel);
      }

      for (const data of candidates) {
        if (!data || typeof data !== "object") {
          continue;
        }

        if (typeof data.is_live === "boolean") {
          return data.is_live;
        }
        if (typeof data.isLive === "boolean") {
          return data.isLive;
        }
        if (typeof data.livestream !== "undefined") {
          return Boolean(data.livestream);
        }
        if (typeof data.stream !== "undefined") {
          return Boolean(data.stream);
        }
        if (typeof data.current_live_session !== "undefined") {
          return Boolean(data.current_live_session);
        }
      }

      return false;
    }

    function setFriendLiveBadge(card, isLive) {
      if (!card) {
        return;
      }
      card.classList.toggle("is-live", Boolean(isLive));

      let badge = card.querySelector(".friend-live-badge");
      if (!isLive) {
        if (badge) {
          badge.remove();
        }
        return;
      }

      if (!badge) {
        badge = document.createElement("span");
        badge.className = "friend-live-badge";
        badge.innerHTML = `<span class="friend-live-dot" aria-hidden="true"></span>LIVE`;
        card.appendChild(badge);
      }
    }

    function buildChannelInfoApiUrl(channelSlug) {
      return `https://kick.com/api/v2/channels/${encodeURIComponent(String(channelSlug || "").trim())}/info`;
    }

    function buildChannelApiUrl(channelSlug) {
      return `https://kick.com/api/v2/channels/${encodeURIComponent(String(channelSlug || "").trim())}`;
    }

    function buildChannelApiV1Url(channelSlug) {
      return `https://kick.com/api/v1/channels/${encodeURIComponent(String(channelSlug || "").trim())}`;
    }

    function isLikelyKickChannelPayload(payload) {
      if (!payload || typeof payload !== "object") {
        return false;
      }
      const hasSlug = typeof payload.slug === "string" && payload.slug.trim().length > 0;
      const hasId = Number.isFinite(Number(payload.id));
      const hasUserId = Number.isFinite(Number(payload.user_id ?? payload.userId));
      const hasLivestream = typeof payload.livestream === "object";
      return (hasSlug && hasId) || (hasSlug && hasUserId) || (hasSlug && hasLivestream);
    }

    async function withKickChannelTimeout(taskFactory, timeoutMs, timeoutLabel) {
      let timeoutId = null;
      try {
        return await Promise.race([
          taskFactory(),
          new Promise((_, reject) => {
            timeoutId = window.setTimeout(() => {
              reject(new Error(`${timeoutLabel}_${timeoutMs}`));
            }, timeoutMs);
          })
        ]);
      } finally {
        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }
      }
    }

    function buildLocalKickChannelUrl(channelSlug = CHANNEL_SLUG) {
      const params = new URLSearchParams();
      const cleanSlug = String(channelSlug || "").trim();
      if (cleanSlug) {
        params.set("slug", cleanSlug);
      }
      params.set("_", String(Date.now()));
      return `${LOCAL_KICK_CHANNEL_ENDPOINT}?${params.toString()}`;
    }

    async function fetchLocalKickChannelJson(channelSlug = CHANNEL_SLUG) {
      if (IS_FILE_PROTOCOL) {
        throw new Error("LOCAL_CHANNEL_PROXY_UNAVAILABLE_FILE_PROTOCOL");
      }

      const response = await withKickChannelTimeout(
        () =>
          fetch(buildLocalKickChannelUrl(channelSlug), {
            cache: "no-store",
            headers: {
              Accept: "application/json"
            }
          }),
        KICK_CHANNEL_REQUEST_TIMEOUT_MS,
        "LOCAL_CHANNEL_TIMEOUT"
      );
      if (!response.ok) {
        throw new Error(`LOCAL_CHANNEL_PROXY_HTTP_${response.status}`);
      }

      const payload = await response.json();
      if (!payload || typeof payload !== "object") {
        throw new Error("LOCAL_CHANNEL_PROXY_INVALID_JSON");
      }

      if (isLikelyKickChannelPayload(payload)) {
        return payload;
      }

      const nestedPayload = payload.channel ?? payload.data ?? null;
      if (isLikelyKickChannelPayload(nestedPayload)) {
        return { ...nestedPayload };
      }

      throw new Error("LOCAL_CHANNEL_PROXY_INVALID_PAYLOAD");
    }

    async function fetchKickChannelJson(channelSlug) {
      const cleanSlug = String(channelSlug || "").trim();
      const stamp = Date.now();
      const directUrls = [
        `${buildChannelInfoApiUrl(cleanSlug)}?_=${stamp}`,
        `${buildChannelApiUrl(cleanSlug)}?_=${stamp}`,
        `${buildChannelApiV1Url(cleanSlug)}?_=${stamp}`
      ];

      let bestPayload = null;
      function rememberBetterPayload(payload) {
        if (!isLikelyKickChannelPayload(payload)) {
          return false;
        }
        if (!bestPayload) {
          bestPayload = payload;
        }
        return true;
      }

      try {
        const localPayload = await fetchLocalKickChannelJson(cleanSlug);
        if (rememberBetterPayload(localPayload)) {
          return localPayload;
        }
      } catch (_error) {
        // Local API may be unavailable on file:// or while running without serverless routes.
      }

      for (const directUrl of directUrls) {
        try {
          const directResponse = await withKickChannelTimeout(
            () =>
              fetch(directUrl, {
                mode: "cors",
                cache: "no-store",
                headers: {
                  Accept: "application/json"
                }
              }),
            KICK_CHANNEL_REQUEST_TIMEOUT_MS,
            "CHANNEL_DIRECT_TIMEOUT"
          );
          if (!directResponse.ok) {
            continue;
          }
          const directPayload = await directResponse.json();
          if (rememberBetterPayload(directPayload)) {
            return directPayload;
          }
        } catch (_error) {
          // Fall back to proxy options below.
        }
      }

      const proxyPrefixes = [ALL_ORIGINS_RAW_PREFIX, CORS_PROXY_PREFIX];
      for (const directUrl of directUrls) {
        for (const proxyPrefix of proxyPrefixes) {
          try {
            const proxyPayload = await withKickChannelTimeout(
              () => fetchViaProxyJson(directUrl, proxyPrefix),
              KICK_CHANNEL_PROXY_TIMEOUT_MS,
              "CHANNEL_PROXY_TIMEOUT"
            );
            if (rememberBetterPayload(proxyPayload)) {
              return proxyPayload;
            }
          } catch (_error) {
            // Try next proxy.
          }
        }
      }

      // Last fallback for environments where proxy CORS works but direct/proxy API calls are blocked.
      for (const directUrl of directUrls) {
        try {
          const jinaPayload = await withKickChannelTimeout(
            () => fetchJinaJson(directUrl.replace(/^https:\/\//i, "http://")),
            KICK_CHANNEL_JINA_TIMEOUT_MS,
            "CHANNEL_JINA_TIMEOUT"
          );
          if (rememberBetterPayload(jinaPayload)) {
            return jinaPayload;
          }
        } catch (_error) {
          // Try next source variant.
        }
      }

      if (isLikelyKickChannelPayload(bestPayload)) {
        return bestPayload;
      }

      throw new Error("KICK_CHANNEL_FETCH_FAILED");
    }

    function parseKickCountValue(rawValue) {
      if (typeof rawValue === "number" && Number.isFinite(rawValue)) {
        return Math.max(0, Math.floor(rawValue));
      }
      if (typeof rawValue !== "string") {
        return null;
      }
      const digitsOnly = rawValue.replace(/\D+/g, "");
      if (!digitsOnly) {
        return null;
      }
      const parsed = Number.parseInt(digitsOnly, 10);
      return Number.isFinite(parsed) ? Math.max(0, parsed) : null;
    }

    function loadLastKnownKickSubsCount() {
      try {
        const storedValue = window.localStorage.getItem(KICK_SUBS_LAST_COUNT_STORAGE_KEY);
        return parseKickCountValue(storedValue);
      } catch (_error) {
        return null;
      }
    }

    function saveLastKnownKickSubsCount(count) {
      const normalizedCount = parseKickCountValue(count);
      if (!Number.isFinite(normalizedCount)) {
        return;
      }

      lastKnownKickSubsCount = normalizedCount;
      try {
        window.localStorage.setItem(KICK_SUBS_LAST_COUNT_STORAGE_KEY, String(normalizedCount));
      } catch (_error) {
        // Ignore localStorage quota/privacy failures.
      }
    }

    function getLastKnownKickSubsCount() {
      if (Number.isFinite(lastKnownKickSubsCount)) {
        return lastKnownKickSubsCount;
      }

      const storedCount = loadLastKnownKickSubsCount();
      if (!Number.isFinite(storedCount)) {
        return null;
      }

      lastKnownKickSubsCount = storedCount;
      return storedCount;
    }

    function readKickNumericCandidate(source, path) {
      let current = source;
      for (const segment of path) {
        if (!current || typeof current !== "object" || !(segment in current)) {
          return null;
        }
        current = current[segment];
      }
      return parseKickCountValue(current);
    }

    function readKickNumericCandidates(source, paths) {
      for (const path of paths) {
        const value = readKickNumericCandidate(source, path);
        if (Number.isFinite(value)) {
          return value;
        }
      }
      return null;
    }

    function extractKickFollowersCount(channelData) {
      const followerPaths = [
        ["followers_count"],
        ["followersCount"],
        ["follower_count"],
        ["followerCount"],
        ["stats", "followers_count"],
        ["stats", "followersCount"],
        ["channel", "followers_count"],
        ["channel", "followersCount"],
        ["data", "followers_count"],
        ["data", "followersCount"],
        ["user", "followers_count"],
        ["user", "followersCount"]
      ];
      return readKickNumericCandidates(channelData, followerPaths);
    }

    function extractKickSubscribersCount(channelData) {
      const subscriberPaths = [
        ["subscribers_last_count"],
        ["subscribersLastCount"],
        ["subscribers_goal_current"],
        ["subscribersGoalCurrent"],
        ["subscribers_count"],
        ["subscribersCount"],
        ["subscriber_count"],
        ["subscriberCount"],
        ["sub_count"],
        ["subCount"],
        ["subscriptions_count"],
        ["subscriptionsCount"],
        ["subscription_count"],
        ["subscriptionCount"],
        ["paid_subscribers_count"],
        ["paidSubscribersCount"],
        ["total_subscribers"],
        ["totalSubscribers"],
        ["subscribers"],
        ["last_subscriber", "count"],
        ["lastSubscriber", "count"],
        ["data", "count"],
        ["data", "sub_count"],
        ["data", "subscribers_count"],
        ["stats", "subscribers_count"],
        ["stats", "subscribersCount"],
        ["stats", "subscriptions_count"],
        ["stats", "subscriptionsCount"],
        ["metrics", "subscribers_count"],
        ["metrics", "subscribersCount"],
        ["channel", "subscribers_count"],
        ["channel", "subscribersCount"],
        ["channel", "sub_count"],
        ["channel", "last_subscriber", "count"],
        ["channel", "lastSubscriber", "count"],
        ["user", "subscribers_count"],
        ["user", "subscribersCount"],
        ["user", "sub_count"],
        ["profile", "subscribers_count"],
        ["profile", "subscribersCount"]
      ];
      return readKickNumericCandidates(channelData, subscriberPaths);
    }

    function extractKickGoalSubscribersCount(channelData) {
      const goalPaths = [
        ["subscribers_goal_current"],
        ["subscribersGoalCurrent"],
        ["goal", "current"],
        ["goal", "subs", "current"],
        ["subscription_goal", "current"],
        ["subscriptionGoal", "current"]
      ];
      return readKickNumericCandidates(channelData, goalPaths);
    }

    function setKickSubsBadgeState({ count = null, text = "subów na Kicku", state = "ready" } = {}) {
      if (!streamIntroSubsStatEl || !streamIntroSubsCountEl || !streamIntroSubsTextEl) {
        return;
      }

      streamIntroSubsCountEl.textContent = Number.isFinite(count) ? count.toLocaleString("pl-PL") : "--";
      streamIntroSubsTextEl.textContent = text;
      streamIntroSubsStatEl.classList.toggle("is-loading", state === "loading");
      streamIntroSubsStatEl.classList.toggle("is-error", state === "error");
    }

    function setKickFollowersBadgeState({ count = null, text = "obserwujących na Kicku", state = "ready" } = {}) {
      if (!streamIntroFollowersStatEl || !streamIntroFollowersCountEl || !streamIntroFollowersTextEl) {
        return;
      }

      streamIntroFollowersCountEl.textContent = Number.isFinite(count) ? count.toLocaleString("pl-PL") : "--";
      streamIntroFollowersTextEl.textContent = text;
      streamIntroFollowersStatEl.classList.toggle("is-loading", state === "loading");
      streamIntroFollowersStatEl.classList.toggle("is-error", state === "error");
    }

    async function updateKickFollowersBadge(force = false) {
      const hasFollowersBadge = Boolean(streamIntroFollowersStatEl && streamIntroFollowersCountEl && streamIntroFollowersTextEl);
      const hasSubsBadge = Boolean(streamIntroSubsStatEl && streamIntroSubsCountEl && streamIntroSubsTextEl);
      if (!hasFollowersBadge && !hasSubsBadge) {
        return;
      }
      if (kickFollowersPollBusy && !force) {
        return;
      }

      kickFollowersPollBusy = true;
      const hasFollowersRenderedOnce = hasFollowersBadge ? streamIntroFollowersStatEl.dataset.ready === "1" : true;
      const hasSubsRenderedOnce = hasSubsBadge ? streamIntroSubsStatEl.dataset.ready === "1" : true;
      if (!hasFollowersRenderedOnce && hasFollowersBadge) {
        setKickFollowersBadgeState({
          count: null,
          text: "ładowanie danych z Kick...",
          state: "loading"
        });
      }
      if (!hasSubsRenderedOnce && hasSubsBadge) {
        setKickSubsBadgeState({
          count: null,
          text: "ładowanie danych z Kick...",
          state: "loading"
        });
      }

      const pendingTasks = [];
      let sharedChannelPayloadPromise = null;
      const getSharedChannelPayload = () => {
        if (!sharedChannelPayloadPromise) {
          sharedChannelPayloadPromise = Promise.resolve().then(() => fetchKickChannelJson(CHANNEL_SLUG));
        }
        return sharedChannelPayloadPromise;
      };

      if (hasFollowersBadge) {
        const followersTask = Promise.resolve()
          .then(() => getSharedChannelPayload())
          .then((channelPayload) => {
            const followersCount = extractKickFollowersCount(channelPayload);
            setKickFollowersBadgeState({
              count: Number.isFinite(followersCount) ? followersCount : null,
              text: "obserwujących na Kicku",
              state: Number.isFinite(followersCount) ? "ready" : "error"
            });
          })
          .catch(() => {
            if (!hasFollowersRenderedOnce) {
              setKickFollowersBadgeState({
                count: null,
                text: IS_FILE_PROTOCOL ? "brak danych (odpal przez serwer)" : "brak danych z Kick",
                state: "error"
              });
            } else {
              streamIntroFollowersStatEl.classList.remove("is-loading");
            }
          })
          .finally(() => {
            streamIntroFollowersStatEl.dataset.ready = "1";
          });
        pendingTasks.push(followersTask);
      }

      if (hasSubsBadge) {
        const subsTask = Promise.resolve()
          .then(() => getSharedChannelPayload())
          .then((channelPayload) => {
            const subscribersCount = extractKickGoalSubscribersCount(channelPayload);
            if (Number.isFinite(subscribersCount)) {
              saveLastKnownKickSubsCount(subscribersCount);
              setKickSubsBadgeState({
                count: subscribersCount,
                text: "subów na Kicku",
                state: "ready"
              });
              return;
            }

            const fallbackCount = getLastKnownKickSubsCount();
            setKickSubsBadgeState({
              count: Number.isFinite(fallbackCount) ? fallbackCount : null,
              text: "subów na Kicku",
              state: Number.isFinite(fallbackCount) ? "ready" : "error"
            });
          })
          .catch(() => {
            const fallbackCount = getLastKnownKickSubsCount();
            if (Number.isFinite(fallbackCount)) {
              setKickSubsBadgeState({
                count: fallbackCount,
                text: "subów na Kicku",
                state: "ready"
              });
              return;
            }

            if (!hasSubsRenderedOnce) {
              setKickSubsBadgeState({
                count: null,
                text: IS_FILE_PROTOCOL ? "brak danych (odpal przez serwer)" : "brak danych z Kick",
                state: "error"
              });
            } else {
              streamIntroSubsStatEl.classList.remove("is-loading");
            }
          })
          .finally(() => {
            streamIntroSubsStatEl.dataset.ready = "1";
          });
        pendingTasks.push(subsTask);
      }

      try {
        await Promise.all(pendingTasks);
      } finally {
        kickFollowersPollBusy = false;
      }
    }

    function startKickFollowersPolling() {
      lastKnownKickSubsCount = getLastKnownKickSubsCount();
      void updateKickFollowersBadge();
      if (kickFollowersPollId) {
        return;
      }

      kickFollowersPollId = window.setInterval(() => {
        void updateKickFollowersBadge();
      }, KICK_FOLLOWERS_POLL_MS);
    }

    async function updateFriendsLiveBadges(force = false) {
      if (!friendsGridEl) {
        return;
      }
      if (friendsLivePollBusy && !force) {
        return;
      }

      friendsLivePollBusy = true;
      try {
        const cards = Array.from(friendsGridEl.querySelectorAll(".friend-card"));
        if (!cards.length) {
          return;
        }

        const requestSeq = ++friendsLiveRequestSeq;
        const slugToCards = new Map();

        cards.forEach((card) => {
          const href = String(card.getAttribute("href") || "").trim();
          const slug = getKickSlugFromUrl(href);
          if (!slug) {
            setFriendLiveBadge(card, false);
            return;
          }
          if (!slugToCards.has(slug)) {
            slugToCards.set(slug, []);
          }
          slugToCards.get(slug).push(card);

          // Apply cached state immediately to avoid visual lag.
          if (friendsLiveStateBySlug.has(slug)) {
            setFriendLiveBadge(card, Boolean(friendsLiveStateBySlug.get(slug)));
          }
        });

        if (!slugToCards.size) {
          return;
        }

        const liveBySlug = new Map();
        await Promise.all(
          Array.from(slugToCards.keys()).map(async (slug) => {
            try {
              const channelData = await fetchKickChannelJson(slug);
              liveBySlug.set(slug, isKickChannelLive(channelData));
            } catch (_error) {
              if (friendsLiveStateBySlug.has(slug)) {
                liveBySlug.set(slug, Boolean(friendsLiveStateBySlug.get(slug)));
              } else {
                liveBySlug.set(slug, false);
              }
            }
          })
        );

        if (requestSeq !== friendsLiveRequestSeq) {
          return;
        }

        slugToCards.forEach((cardList, slug) => {
          const isLive = Boolean(liveBySlug.get(slug));
          friendsLiveStateBySlug.set(slug, isLive);
          cardList.forEach((card) => setFriendLiveBadge(card, isLive));
        });
      } finally {
        friendsLivePollBusy = false;
      }
    }

    function startFriendsLivePolling() {
      updateFriendsLiveBadges(true);
      if (friendsLivePollId) {
        return;
      }

      friendsLivePollId = window.setInterval(() => {
        if (document.hidden) {
          return;
        }
        updateFriendsLiveBadges();
      }, FRIENDS_LIVE_POLL_MS);
    }

    function renderAdminMembersTable() {
      if (!adminMembersTableBodyEl) {
        return;
      }

      const allMembers = getOrderedMembers();

      adminMembersTableBodyEl.innerHTML = "";
      if (!allMembers.length) {
        adminMembersTableBodyEl.innerHTML = `
          <tr>
            <td colspan="3" class="admin-table-empty">Brak dodanych członków.</td>
          </tr>
        `;
        return;
      }

      allMembers.forEach((member) => {
        const row = document.createElement("tr");
        row.dataset.memberId = member.id;
        row.draggable = false;
        row.innerHTML = `
          <td>
            <button
              class="admin-row-btn"
              type="button"
              data-member-drag-handle="1"
              draggable="true"
              title="Przeciągnij, aby ustawić kolejność"
              aria-label="Przeciągnij, aby ustawić kolejność"
              style="padding: 2px 8px; margin-right: 8px; cursor: grab;"
            >⇅</button>${escapeHtml(member.name)}
          </td>
          <td><a href="${escapeHtml(member.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(member.url)}</a></td>
          <td>
            <span style="display: inline-flex; flex-wrap: wrap; gap: 8px;">
              <button class="admin-row-btn" type="button" data-member-edit="${escapeHtml(member.id)}">Edytuj</button>
              <button class="admin-row-btn admin-row-btn-danger" type="button" data-member-remove="${escapeHtml(member.id)}">Usuń</button>
            </span>
          </td>
        `;
        adminMembersTableBodyEl.appendChild(row);
      });
    }

    function renderAdminAccountsTable() {
      if (!adminAccountsTableBodyEl) {
        return;
      }

      adminAccountsTableBodyEl.innerHTML = "";
      adminAccounts.forEach((account) => {
        const visible = !account.isRoot && visibleAdminPasswords.has(account.id);
        const discordUserId = normalizeDiscordUserId(account.discordUserId);
        const discordName = String(account.discordName || "").trim();
        const permissionsEnabledCount =
          (account.canAccessAdmin ? 1 : 0) +
          (account.canAccessStreamObs ? 1 : 0) +
          (account.canAccessBindings ? 1 : 0);
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${escapeHtml(account.login)}</td>
          <td>${escapeHtml(discordUserId || "-")}</td>
          <td>${escapeHtml(discordName || "-")}</td>
          <td>${escapeHtml(visible ? account.password : "********")}</td>
          <td>
            ${
              account.isRoot
                ? "-"
                : `<button class="admin-row-btn" type="button" data-account-toggle="${escapeHtml(account.id)}">${visible ? "Ukryj" : "Pokaż"}</button>`
            }
          </td>
          <td>${account.canAccessAdmin ? "Tak" : "Nie"}</td>
          <td>${account.canAccessStreamObs ? "Tak" : "Nie"}</td>
          <td>${account.canAccessBindings ? "Tak" : "Nie"}</td>
          <td>
            ${
              account.isRoot
                ? "-"
                : `
                  <div class="admin-account-actions">
                    <details class="admin-permissions-details">
                      <summary class="admin-row-btn admin-permissions-summary">
                        Permisje (${permissionsEnabledCount}/3)
                      </summary>
                      <ul class="admin-permissions-list">
                        <li class="admin-permission-item">
                          <label>
                            <span>Panel Admina</span>
                            <input
                              class="admin-access-checkbox"
                              type="checkbox"
                              data-account-permission-checkbox="admin"
                              data-account-id="${escapeHtml(account.id)}"
                              ${account.canAccessAdmin ? "checked" : ""}
                            >
                          </label>
                        </li>
                        <li class="admin-permission-item">
                          <label>
                            <span>StreamOBS</span>
                            <input
                              class="admin-access-checkbox"
                              type="checkbox"
                              data-account-permission-checkbox="streamobs"
                              data-account-id="${escapeHtml(account.id)}"
                              ${account.canAccessStreamObs ? "checked" : ""}
                            >
                          </label>
                        </li>
                        <li class="admin-permission-item">
                          <label>
                            <span>Powiązania</span>
                            <input
                              class="admin-access-checkbox"
                              type="checkbox"
                              data-account-permission-checkbox="bindings"
                              data-account-id="${escapeHtml(account.id)}"
                              ${account.canAccessBindings ? "checked" : ""}
                            >
                          </label>
                        </li>
                      </ul>
                    </details>
                    <button class="admin-row-btn admin-row-btn-danger" type="button" data-account-remove="${escapeHtml(account.id)}">Usuń</button>
                  </div>
                `
            }
          </td>
        `;
        adminAccountsTableBodyEl.appendChild(row);
      });
    }

    function setActiveAdminTab(tabName) {
      const ownerAccess = hasOwnerAdminAccess();
      const streamObsAccess = hasStreamObsAccess();
      const bindingsAccess = hasBindingsAccess();
      const requestedTab =
        tabName === "accounts" ||
        tabName === "bindings" ||
        tabName === "kary" ||
        tabName === "members" ||
        tabName === "streamobs"
          ? tabName
          : "members";
      if (requestedTab === "accounts" && !ownerAccess) {
        activeAdminTab = "members";
        setPanelStatus(adminAccountStatusEl, "Brak permisji do zakładki Panel Admina.", "error");
      } else if (requestedTab === "bindings" && !bindingsAccess) {
        activeAdminTab = "members";
        setPanelStatus(kickOauthStatusEl, "Brak permisji do zakładki Powiązania.", "error");
      } else if (requestedTab === "streamobs" && !streamObsAccess) {
        activeAdminTab = "members";
        setPanelStatus(adminAccountStatusEl, "Brak permisji do zakładki StreamOBS.", "error");
      } else {
        activeAdminTab = requestedTab;
      }

      if (adminTabsWrapEl) {
        const accountsBtn = adminTabsWrapEl.querySelector('[data-tab="accounts"]');
        const bindingsBtn = adminTabsWrapEl.querySelector('[data-tab="bindings"]');
        const streamObsBtn = adminTabsWrapEl.querySelector('[data-tab="streamobs"]');
        if (accountsBtn) {
          accountsBtn.hidden = !ownerAccess;
        }
        if (bindingsBtn) {
          bindingsBtn.hidden = !bindingsAccess;
        }
        if (streamObsBtn) {
          streamObsBtn.hidden = !streamObsAccess;
        }
      }

      if (adminTabsWrapEl) {
        const buttons = adminTabsWrapEl.querySelectorAll(".admin-tab-btn");
        buttons.forEach((button) => {
          button.classList.toggle("is-active", button.dataset.tab === activeAdminTab);
        });
      }

      if (adminMembersTabEl) {
        const isMembers = activeAdminTab === "members";
        adminMembersTabEl.hidden = !isMembers;
        adminMembersTabEl.classList.toggle("is-active", isMembers);
      }
      if (adminKaryTabEl) {
        const isKary = activeAdminTab === "kary";
        adminKaryTabEl.hidden = !isKary;
        adminKaryTabEl.classList.toggle("is-active", isKary);
      }
      if (adminAccountsTabEl) {
        const isAccounts = activeAdminTab === "accounts";
        adminAccountsTabEl.hidden = !isAccounts;
        adminAccountsTabEl.classList.toggle("is-active", isAccounts);
      }
      if (adminBindingsTabEl) {
        const isBindings = activeAdminTab === "bindings";
        adminBindingsTabEl.hidden = !isBindings;
        adminBindingsTabEl.classList.toggle("is-active", isBindings);
      }
      if (adminStreamObsTabEl) {
        const isStreamObs = activeAdminTab === "streamobs";
        adminStreamObsTabEl.hidden = !isStreamObs;
        adminStreamObsTabEl.classList.toggle("is-active", isStreamObs);
        if (isStreamObs) {
          applyStreamObsTimeryConfig();
          applyStreamObsLicznikiConfig();
        }
      }

      updateKickOAuthPanelView(cachedKickOAuthStatus);
    }

    function getKaryPricePairs() {
      return [
        { list: karyPriceListChillEl, empty: karyPriceEmptyChillEl },
        { list: karyPriceListHardEl, empty: karyPriceEmptyHardEl }
      ].filter((pair) => pair.list);
    }

    function getKaryPriceValueElements() {
      return document.querySelectorAll(".kary-price-value");
    }

    function normalizeKarySection(value) {
      return String(value || "").toLowerCase() === "hard" ? "hard" : "chill";
    }

    function formatKaryPln(value) {
      const number = Math.max(0, Math.floor(Number(value) || 0));
      return `${number} PLN`;
    }

    function formatKarySuby(value) {
      const number = Math.max(0, Math.floor(Number(value) || 0));
      return `${number} Suby`;
    }

    function formatKaryKicksy(value) {
      const number = Math.max(0, Math.floor(Number(value) || 0));
      return `${number} Kicksy`;
    }

    function parseFirstInteger(value) {
      const match = String(value || "").match(/-?\d+/);
      if (!match) {
        return 0;
      }
      const parsed = Number.parseInt(match[0], 10);
      return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
    }

    function extractDefaultKaryCennikItems() {
      const result = [];
      const readColumn = (listEl, section) => {
        if (!listEl) {
          return;
        }
        const rows = Array.from(listEl.querySelectorAll("li"));
        rows.forEach((row, index) => {
          const name = String(row.querySelector("strong")?.textContent || "").trim();
          const smallTexts = Array.from(row.querySelectorAll("small"))
            .map((small) => String(small.textContent || "").trim())
            .filter(Boolean);
          const isTimeLine = (text) =>
            isStandaloneMinuteDeltaDescription(text) || /^czas\s*:/i.test(String(text || "").trim());
          const timeLineText = smallTexts.find((text) => isTimeLine(text)) || "";
          const descriptionText = smallTexts.find((text) => !isTimeLine(text)) || "";
          const fallbackText = smallTexts[0] || "";
          const desc = descriptionText || (!timeLineText ? fallbackText : "");
          const baseMinutesSource = timeLineText || desc || fallbackText;
          const priceEl = row.querySelector(".kary-price-value");
          const plnRaw = priceEl ? String(priceEl.dataset.pln || priceEl.textContent || "") : "";
          const subyRaw = priceEl ? String(priceEl.dataset.suby || "") : "";
          const kicksyRaw = priceEl ? String(priceEl.dataset.kicksy || "") : "";
          if (!name) {
            return;
          }
          result.push({
            id: `default-${section}-${index + 1}`,
            section,
            name,
            description: desc,
            baseMinutes: parseTimerBaseMinutesFromDescription(baseMinutesSource),
            pricePln: parseFirstInteger(plnRaw),
            priceSuby: parseFirstInteger(subyRaw),
            priceKicksy: parseFirstInteger(kicksyRaw),
            sortOrder: index
          });
        });
      };

      readColumn(karyPriceListChillEl, "chill");
      readColumn(karyPriceListHardEl, "hard");
      return result;
    }

    function normalizeKaryCennikItem(item, index) {
      const safe = item && typeof item === "object" ? item : {};
      const section = normalizeKarySection(safe.section);
      const name = String(safe.name || "").trim();
      if (!name) {
        return null;
      }

      return {
        id: String(safe.id || `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`),
        section,
        name,
        description: String(safe.description || "").trim(),
        baseMinutes: (() => {
          const explicit = Math.max(0, Math.floor(Number(safe.baseMinutes) || 0));
          if (explicit > 0) {
            return explicit;
          }
          return parseTimerBaseMinutesFromDescription(safe.description);
        })(),
        pricePln: Math.max(0, Math.floor(Number(safe.pricePln) || 0)),
        priceSuby: Math.max(0, Math.floor(Number(safe.priceSuby) || 0)),
        priceKicksy: Math.max(0, Math.floor(Number(safe.priceKicksy) || 0)),
        sortOrder: Math.max(0, Math.floor(Number(safe.sortOrder) || index))
      };
    }

    function getSortedKaryCennikItems() {
      const sectionPriority = { chill: 0, hard: 1 };
      return [...karyCennikItems].sort((left, right) => {
        const sectionDiff = (sectionPriority[left.section] ?? 0) - (sectionPriority[right.section] ?? 0);
        if (sectionDiff !== 0) {
          return sectionDiff;
        }
        return (left.sortOrder ?? 0) - (right.sortOrder ?? 0);
      });
    }

    function loadKaryCennikItems() {
      const fallback = extractDefaultKaryCennikItems();
      const raw = readStorageJson(KARY_CENNIK_KEY, null);
      if (!Array.isArray(raw)) {
        karyCennikItems = fallback;
        return;
      }

      karyCennikItems = raw
        .map((item, index) => normalizeKaryCennikItem(item, index))
        .filter(Boolean);
    }

    function migrateDuplicatedKicksyPrices() {
      try {
        if (window.localStorage.getItem(KARY_CENNIK_MIGRATION_KEY) === "1") {
          return;
        }
      } catch (_error) {
        // Ignore storage read failures.
      }

      if (!Array.isArray(karyCennikItems) || !karyCennikItems.length) {
        return;
      }

      const hasAnySuby = karyCennikItems.some((item) => Number(item.priceSuby) > 0);
      const allKicksyDuplicated = karyCennikItems.every(
        (item) => Number(item.priceKicksy) === Number(item.priceSuby)
      );

      if (hasAnySuby && allKicksyDuplicated) {
        karyCennikItems = karyCennikItems.map((item) => ({
          ...item,
          priceKicksy: 0
        }));
        saveKaryCennikItems();
      }

      try {
        window.localStorage.setItem(KARY_CENNIK_MIGRATION_KEY, "1");
      } catch (_error) {
        // Ignore storage write failures.
      }
    }

    function saveKaryCennikItems() {
      saveStorageJson(KARY_CENNIK_KEY, karyCennikItems);
      if (!adminStateApplyingRemote) {
        queueAdminStateApiPush();
      }
    }

    function renderPublicKaryCennik() {
      const sorted = getSortedKaryCennikItems();
      const grouped = {
        chill: sorted.filter((item) => item.section === "chill"),
        hard: sorted.filter((item) => item.section === "hard")
      };

      const fillList = (listEl, items) => {
        if (!listEl) {
          return;
        }
        listEl.innerHTML = items
          .map((item) => {
            const rawDescription = String(item.description || "").trim();
            const explicitBaseMinutes = Math.max(0, Math.floor(Number(item.baseMinutes) || 0));
            const baseMinutes = explicitBaseMinutes > 0
              ? explicitBaseMinutes
              : parseTimerBaseMinutesFromDescription(rawDescription);
            const hasBaseMinutes = baseMinutes > 0;
            const isMinuteOnlyDescription = isStandaloneMinuteDeltaDescription(rawDescription);
            const descriptionText = isMinuteOnlyDescription ? "" : rawDescription;
            const baseMinutesMarkup = hasBaseMinutes
              ? `<small class="kary-price-base-time">Czas: +${escapeHtml(String(baseMinutes))} min</small>`
              : "";
            const descriptionMarkup = descriptionText
              ? `<small class="kary-price-description">${escapeHtml(descriptionText)}</small>`
              : "";
            const fallbackDescriptionMarkup = !descriptionMarkup && !baseMinutesMarkup
              ? `<small class="kary-price-description">—</small>`
              : "";
            return `
          <li data-cennik-id="${escapeHtml(item.id)}">
            <strong>${escapeHtml(item.name)}</strong>
            <span class="kary-price-value" data-pln="${escapeHtml(formatKaryPln(item.pricePln))}" data-suby="${escapeHtml(formatKarySuby(item.priceSuby))}" data-kicksy="${escapeHtml(formatKaryKicksy(item.priceKicksy))}">${escapeHtml(formatKaryPln(item.pricePln))}</span>
            ${baseMinutesMarkup}
            ${descriptionMarkup}
            ${fallbackDescriptionMarkup}
          </li>
        `
          })
          .join("");
      };

      fillList(karyPriceListChillEl, grouped.chill);
      fillList(karyPriceListHardEl, grouped.hard);
      setKaryCurrency(activeKaryCurrency);
      updateTimerQuickActionButtons();
    }

    function renderAdminKaryCennikTable() {
      if (!adminCennikTableBodyEl) {
        return;
      }

      const rows = getSortedKaryCennikItems();
      adminCennikTableBodyEl.innerHTML = "";

      if (!rows.length) {
        adminCennikTableBodyEl.innerHTML = `
          <tr>
            <td colspan="8" class="admin-table-empty">Brak pozycji cennika.</td>
          </tr>
        `;
        return;
      }

      rows.forEach((item) => {
        const tr = document.createElement("tr");
        tr.classList.add("admin-cennik-row");
        tr.dataset.cennikId = item.id;
        tr.dataset.cennikSection = item.section;
        tr.draggable = false;
        tr.innerHTML = `
          <td>
            <button
              class="admin-row-btn admin-cennik-drag-handle"
              type="button"
              data-cennik-drag-handle="1"
              draggable="true"
              title="Przeciągnij, aby ustawić kolejność"
              aria-label="Przeciągnij, aby ustawić kolejność"
            >⇅</button>
          </td>
          <td>${escapeHtml(item.section === "hard" ? "Tortury" : "Opcje widza")}</td>
          <td>${escapeHtml(item.name)}</td>
          <td>${escapeHtml(item.baseMinutes > 0 ? `+${item.baseMinutes} min` : "—")}</td>
          <td>${escapeHtml(formatKaryPln(item.pricePln))}</td>
          <td>${escapeHtml(formatKarySuby(item.priceSuby))}</td>
          <td>${escapeHtml(formatKaryKicksy(item.priceKicksy))}</td>
          <td>
            <button class="admin-row-btn" type="button" data-cennik-edit="${escapeHtml(item.id)}">Edytuj</button>
            <button class="admin-row-btn admin-row-btn-danger" type="button" data-cennik-remove="${escapeHtml(item.id)}">Usuń</button>
          </td>
        `;
        adminCennikTableBodyEl.appendChild(tr);
      });
    }

    function setKaryCurrency(currency) {
      if (!karyCurrencySwitchEl) {
        return;
      }

      const normalized = String(currency || "").toLowerCase();
      const allowed = ["pln", "suby", "kicksy"];
      const nextCurrency = allowed.includes(normalized) ? normalized : "pln";
      activeKaryCurrency = nextCurrency;

      const switchButtons = karyCurrencySwitchEl.querySelectorAll("button[data-currency]");
      switchButtons.forEach((button) => {
        const isActive = button.dataset.currency === nextCurrency;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
      });

      const dataKey = nextCurrency === "suby" ? "suby" : nextCurrency === "kicksy" ? "kicksy" : "pln";
      getKaryPriceValueElements().forEach((price) => {
        price.classList.toggle("is-pln", dataKey === "pln");
        price.classList.toggle("is-suby", dataKey === "suby");
        price.classList.toggle("is-kicksy", dataKey === "kicksy");
        const nextValue = String(price.dataset[dataKey] || "").trim();
        if (nextValue) {
          price.textContent = nextValue;
          return;
        }

        // Never keep stale value from previous currency tab.
        if (dataKey === "suby") {
          price.textContent = formatKarySuby(0);
          return;
        }
        if (dataKey === "kicksy") {
          price.textContent = formatKaryKicksy(0);
          return;
        }
        price.textContent = formatKaryPln(0);
      });

      const listPairs = getKaryPricePairs();
      listPairs.forEach((pair) => {
        const rows = Array.from(pair.list.querySelectorAll("li"));
        let visibleCount = 0;

        rows.forEach((row) => {
          const priceEl = row.querySelector(".kary-price-value");
          if (!priceEl) {
            row.hidden = false;
            visibleCount += 1;
            return;
          }

          if (dataKey === "pln") {
            row.hidden = false;
            visibleCount += 1;
            return;
          }

          const rawValue = String(priceEl.dataset[dataKey] || "");
          const numericValue = parseFirstInteger(rawValue);
          const shouldShow = numericValue > 0;
          row.hidden = !shouldShow;
          if (shouldShow) {
            visibleCount += 1;
          }
        });

        const hasItems = visibleCount > 0;
        pair.list.hidden = !hasItems;
        pair.list.style.display = hasItems ? "grid" : "none";
        if (pair.empty) {
          pair.empty.hidden = hasItems;
          pair.empty.style.display = hasItems ? "none" : "block";
        }
      });
    }

    function setKaryStatus(text, type = "info") {
      setPanelStatus(adminKaryStatusEl, text, type);
    }

    function setKaryCennikStatus(text, type = "info") {
      setPanelStatus(adminCennikStatusEl, text, type);
    }

    function normalizeTimeryConfig(rawValue, fallbackState = null) {
      const fallback =
        fallbackState && typeof fallbackState === "object"
          ? fallbackState
          : {
              panelOpen: false,
              layout: "list",
              bgColor: "#101420",
              showTitle: true,
              showProgress: true,
              showStatus: true
            };
      const asObject = rawValue && typeof rawValue === "object" ? rawValue : {};
      const layoutRaw = String(asObject.layout || "list").toLowerCase();
      const layout = layoutRaw === "grid" || layoutRaw === "compact" ? layoutRaw : "list";
      return {
        panelOpen: Boolean(asObject.panelOpen),
        layout,
        bgColor: /^#[\da-f]{6}$/i.test(String(asObject.bgColor || ""))
          ? String(asObject.bgColor)
          : String(fallback.bgColor || "#101420"),
        showTitle: asObject.showTitle !== false,
        showProgress: asObject.showProgress !== false,
        showStatus: asObject.showStatus !== false
      };
    }

    function loadTimeryConfig() {
      const raw = readStorageJson(TIMERY_CONFIG_KEY, timeryConfigState);
      timeryConfigState = normalizeTimeryConfig(raw, timeryConfigState);
    }

    function saveTimeryConfig() {
      saveStorageJson(TIMERY_CONFIG_KEY, timeryConfigState);
      if (!adminStateApplyingRemote) {
        queueAdminStateApiPush();
      }
    }

    function applyTimeryConfig() {
      if (!timeryPanelEl) {
        return;
      }

      timeryPanelEl.classList.toggle("timery-layout-grid", timeryConfigState.layout === "grid");
      timeryPanelEl.classList.toggle("timery-layout-compact", timeryConfigState.layout === "compact");
      timeryPanelEl.classList.toggle("timery-hide-title", !timeryConfigState.showTitle);
      timeryPanelEl.classList.toggle("timery-hide-progress", !timeryConfigState.showProgress);
      timeryPanelEl.classList.toggle("timery-hide-status", !timeryConfigState.showStatus);
      timeryPanelEl.style.setProperty("--timery-card-bg", timeryConfigState.bgColor);

      if (timeryConfigPanelEl) {
        timeryConfigPanelEl.hidden = !timeryConfigState.panelOpen;
      }
      if (timeryConfigBtnEl) {
        timeryConfigBtnEl.textContent = timeryConfigState.panelOpen ? "Ukryj konfigurację" : "Konfiguracja";
      }

      if (timeryLayoutSelectEl) {
        timeryLayoutSelectEl.value = timeryConfigState.layout;
      }
      if (timeryBgColorInputEl) {
        timeryBgColorInputEl.value = timeryConfigState.bgColor;
      }
      if (timeryShowTitleEl) {
        timeryShowTitleEl.checked = timeryConfigState.showTitle;
      }
      if (timeryShowProgressEl) {
        timeryShowProgressEl.checked = timeryConfigState.showProgress;
      }
      if (timeryShowStatusEl) {
        timeryShowStatusEl.checked = timeryConfigState.showStatus;
      }
    }

    function normalizeStreamObsTimeryConfig(rawValue, fallbackState = null) {
      const fallback =
        fallbackState && typeof fallbackState === "object"
          ? fallbackState
          : {
              panelOpen: false,
              layout: "vertical",
              color: "#1a1e26",
              progressColor: "#6bffc1"
            };
      const asObject = rawValue && typeof rawValue === "object" ? rawValue : {};
      const layoutRaw = String(asObject.layout || fallback.layout || "vertical").toLowerCase();
      return {
        panelOpen: Boolean(asObject.panelOpen),
        layout: layoutRaw === "horizontal" ? "horizontal" : "vertical",
        color: /^#[\da-f]{6}$/i.test(String(asObject.color || ""))
          ? String(asObject.color)
          : String(fallback.color || "#1a1e26"),
        progressColor: /^#[\da-f]{6}$/i.test(String(asObject.progressColor || ""))
          ? String(asObject.progressColor)
          : String(fallback.progressColor || "#6bffc1")
      };
    }

    function loadStreamObsTimeryConfig() {
      const raw = readStorageJson(STREAMOBS_TIMERY_CONFIG_KEY, streamObsTimeryConfigState);
      streamObsTimeryConfigState = normalizeStreamObsTimeryConfig(raw, streamObsTimeryConfigState);
    }

    function saveStreamObsTimeryConfig() {
      saveStorageJson(STREAMOBS_TIMERY_CONFIG_KEY, streamObsTimeryConfigState);
      if (!adminStateApplyingRemote) {
        queueAdminStateApiPush();
      }
    }

    function normalizeStreamObsLicznikiConfig(rawValue, fallbackState = null) {
      const fallback =
        fallbackState && typeof fallbackState === "object"
          ? fallbackState
          : {
              panelOpen: false,
              layout: "vertical",
              color: "#1a1e26"
            };
      const asObject = rawValue && typeof rawValue === "object" ? rawValue : {};
      const layoutRaw = String(asObject.layout || fallback.layout || "vertical").toLowerCase();
      return {
        panelOpen: Boolean(asObject.panelOpen),
        layout: layoutRaw === "horizontal" ? "horizontal" : "vertical",
        color: /^#[\da-f]{6}$/i.test(String(asObject.color || ""))
          ? String(asObject.color)
          : String(fallback.color || "#1a1e26")
      };
    }

    function loadStreamObsLicznikiConfig() {
      const raw = readStorageJson(STREAMOBS_LICZNIKI_CONFIG_KEY, streamObsLicznikiConfigState);
      streamObsLicznikiConfigState = normalizeStreamObsLicznikiConfig(raw, streamObsLicznikiConfigState);
    }

    function saveStreamObsLicznikiConfig() {
      saveStorageJson(STREAMOBS_LICZNIKI_CONFIG_KEY, streamObsLicznikiConfigState);
      if (!adminStateApplyingRemote) {
        queueAdminStateApiPush();
      }
    }

    async function copyTextWithFallback(text) {
      const value = String(text || "");
      if (!value) {
        return false;
      }

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
        const copied = document.execCommand("copy");
        document.body.removeChild(temp);
        return Boolean(copied);
      } catch (_error) {
        return false;
      }
    }

    function buildStreamObsTimeryUrl() {
      let url = null;
      try {
        url = new URL(TIMERY_ROUTE_PATH, window.location.href);
      } catch (_error) {
        return String(TIMERY_ROUTE_PATH || "/timery");
      }
      url.searchParams.set("timeryObs", "1");
      url.searchParams.set("timeryObsLayout", streamObsTimeryConfigState.layout);
      url.searchParams.set("timeryObsColor", streamObsTimeryConfigState.color.replace("#", ""));
      url.searchParams.set("timeryObsProgressColor", streamObsTimeryConfigState.progressColor.replace("#", ""));
      return url.toString();
    }

    function buildStreamObsLicznikiUrl() {
      let url = null;
      try {
        url = new URL(LICZNIKI_ROUTE_PATH, window.location.href);
      } catch (_error) {
        return String(LICZNIKI_ROUTE_PATH || "/liczniki");
      }
      url.searchParams.set("licznikiObs", "1");
      url.searchParams.set("licznikiObsLayout", streamObsLicznikiConfigState.layout);
      url.searchParams.set("licznikiObsColor", streamObsLicznikiConfigState.color.replace("#", ""));
      return url.toString();
    }

    function upsertStreamObsTimeryLinkCard() {
      if (!streamObsLinksEl) {
        return;
      }

      const linkUrl = buildStreamObsTimeryUrl();
      let card = streamObsLinksEl.querySelector('[data-streamobs-link-id="obs_timery_active"]');
      if (!card) {
        card = document.createElement("article");
        card.className = "streamobs-link-card";
        card.dataset.streamobsLinkId = "obs_timery_active";
        card.innerHTML = `
          <h5 class="streamobs-link-title">OBS - Timery Aktywne</h5>
          <p class="streamobs-link-desc">Browser Source do /timery. Pokazuje wyłącznie aktywne timery w stylu overlay.</p>
          <div class="streamobs-link-row">
            <input class="streamobs-link-input" type="text" readonly aria-label="OBS - Timery Aktywne URL">
            <button class="admin-kary-btn" type="button">Kopiuj</button>
          </div>
        `;

        const copyBtn = card.querySelector("button");
        if (copyBtn) {
          copyBtn.addEventListener("click", async () => {
            const currentUrl = String(card.dataset.streamobsLinkUrl || "");
            const copied = await copyTextWithFallback(currentUrl);
            if (copied) {
              setPanelStatus(streamObsLinksStatusEl, "Skopiowano link: OBS - Timery Aktywne", "success");
            } else {
              setPanelStatus(streamObsLinksStatusEl, "Nie udało się skopiować linku. Skopiuj go ręcznie z pola.", "error");
            }
          });
        }

        streamObsLinksEl.appendChild(card);
      }

      const input = card.querySelector("input");
      if (input) {
        input.value = linkUrl;
      }
      card.dataset.streamobsLinkUrl = linkUrl;
    }

    function upsertStreamObsLicznikiLinkCard() {
      if (!streamObsLinksEl) {
        return;
      }

      const linkUrl = buildStreamObsLicznikiUrl();
      let card = streamObsLinksEl.querySelector('[data-streamobs-link-id="obs_liczniki_active"]');
      if (!card) {
        card = document.createElement("article");
        card.className = "streamobs-link-card";
        card.dataset.streamobsLinkId = "obs_liczniki_active";
        card.innerHTML = `
          <h5 class="streamobs-link-title">OBS - Liczniki Aktywne</h5>
          <p class="streamobs-link-desc">Browser Source do /liczniki. Pokazuje aktywne liczniki w stylu overlay.</p>
          <div class="streamobs-link-row">
            <input class="streamobs-link-input" type="text" readonly aria-label="OBS - Liczniki Aktywne URL">
            <button class="admin-kary-btn" type="button">Kopiuj</button>
          </div>
        `;

        const copyBtn = card.querySelector("button");
        if (copyBtn) {
          copyBtn.addEventListener("click", async () => {
            const currentUrl = String(card.dataset.streamobsLinkUrl || "");
            const copied = await copyTextWithFallback(currentUrl);
            if (copied) {
              setPanelStatus(streamObsLinksStatusEl, "Skopiowano link: OBS - Liczniki Aktywne", "success");
            } else {
              setPanelStatus(streamObsLinksStatusEl, "Nie udało się skopiować linku. Skopiuj go ręcznie z pola.", "error");
            }
          });
        }

        streamObsLinksEl.appendChild(card);
      }

      const input = card.querySelector("input");
      if (input) {
        input.value = linkUrl;
      }
      card.dataset.streamobsLinkUrl = linkUrl;
    }

    function applyStreamObsTimeryConfig() {
      if (streamObsTimeryConfigBodyEl) {
        streamObsTimeryConfigBodyEl.hidden = !streamObsTimeryConfigState.panelOpen;
      }
      if (streamObsTimeryConfigToggleEl) {
        streamObsTimeryConfigToggleEl.setAttribute("aria-expanded", streamObsTimeryConfigState.panelOpen ? "true" : "false");
        streamObsTimeryConfigToggleEl.textContent = streamObsTimeryConfigState.panelOpen
          ? "Ukryj konfigurację timerów OBS"
          : "Konfiguracja timerów OBS";
      }
      if (streamObsTimeryLayoutSelectEl) {
        streamObsTimeryLayoutSelectEl.value = streamObsTimeryConfigState.layout;
      }
      if (streamObsTimeryColorInputEl) {
        streamObsTimeryColorInputEl.value = streamObsTimeryConfigState.color;
      }
      if (streamObsTimeryProgressColorInputEl) {
        streamObsTimeryProgressColorInputEl.value = streamObsTimeryConfigState.progressColor;
      }

      upsertStreamObsTimeryLinkCard();
    }

    function applyStreamObsLicznikiConfig() {
      if (streamObsLicznikiConfigBodyEl) {
        streamObsLicznikiConfigBodyEl.hidden = !streamObsLicznikiConfigState.panelOpen;
      }
      if (streamObsLicznikiConfigToggleEl) {
        streamObsLicznikiConfigToggleEl.setAttribute("aria-expanded", streamObsLicznikiConfigState.panelOpen ? "true" : "false");
        streamObsLicznikiConfigToggleEl.textContent = streamObsLicznikiConfigState.panelOpen
          ? "Ukryj konfigurację liczników OBS"
          : "Konfiguracja liczników OBS";
      }
      if (streamObsLicznikiLayoutSelectEl) {
        streamObsLicznikiLayoutSelectEl.value = streamObsLicznikiConfigState.layout;
      }
      if (streamObsLicznikiColorInputEl) {
        streamObsLicznikiColorInputEl.value = streamObsLicznikiConfigState.color;
      }

      upsertStreamObsLicznikiLinkCard();
    }

    function normalizeLicznikiConfig(rawValue, fallbackState = null) {
      const fallback =
        fallbackState && typeof fallbackState === "object"
          ? fallbackState
          : {
              panelOpen: false,
              layout: "grid",
              bgColor: "#101420",
              showTitle: true,
              showStatus: true,
              showValue: true
            };
      const asObject = rawValue && typeof rawValue === "object" ? rawValue : {};
      const layoutRaw = String(asObject.layout || "grid").toLowerCase();
      const layout =
        layoutRaw === "list" || layoutRaw === "compact" ? layoutRaw : "grid";
      return {
        panelOpen: Boolean(asObject.panelOpen),
        layout,
        bgColor: /^#[\da-f]{6}$/i.test(String(asObject.bgColor || ""))
          ? String(asObject.bgColor)
          : String(fallback.bgColor || "#101420"),
        showTitle: asObject.showTitle !== false,
        showStatus: asObject.showStatus !== false,
        showValue: asObject.showValue !== false
      };
    }

    function loadLicznikiConfig() {
      const raw = readStorageJson(LICZNIKI_CONFIG_KEY, licznikiConfigState);
      licznikiConfigState = normalizeLicznikiConfig(raw, licznikiConfigState);
    }

    function saveLicznikiConfig() {
      saveStorageJson(LICZNIKI_CONFIG_KEY, licznikiConfigState);
      if (!adminStateApplyingRemote) {
        queueAdminStateApiPush();
      }
    }

    function applyLicznikiConfig() {
      if (!licznikiPanelEl) {
        return;
      }

      licznikiPanelEl.classList.toggle("liczniki-layout-list", licznikiConfigState.layout === "list");
      licznikiPanelEl.classList.toggle("liczniki-layout-grid", licznikiConfigState.layout === "grid");
      licznikiPanelEl.classList.toggle("liczniki-layout-compact", licznikiConfigState.layout === "compact");
      licznikiPanelEl.classList.toggle("liczniki-hide-title", !licznikiConfigState.showTitle);
      licznikiPanelEl.classList.toggle("liczniki-hide-status", !licznikiConfigState.showStatus);
      licznikiPanelEl.classList.toggle("liczniki-hide-value", !licznikiConfigState.showValue);
      licznikiPanelEl.style.setProperty("--liczniki-card-bg", licznikiConfigState.bgColor);

      if (licznikiConfigPanelEl) {
        licznikiConfigPanelEl.hidden = !licznikiConfigState.panelOpen;
      }
      if (licznikiConfigBtnEl) {
        licznikiConfigBtnEl.textContent = licznikiConfigState.panelOpen ? "Ukryj konfigurację" : "Konfiguracja";
      }
      if (licznikiLayoutSelectEl) {
        licznikiLayoutSelectEl.value = licznikiConfigState.layout;
      }
      if (licznikiBgColorInputEl) {
        licznikiBgColorInputEl.value = licznikiConfigState.bgColor;
      }
      if (licznikiShowTitleEl) {
        licznikiShowTitleEl.checked = licznikiConfigState.showTitle;
      }
      if (licznikiShowStatusEl) {
        licznikiShowStatusEl.checked = licznikiConfigState.showStatus;
      }
      if (licznikiShowValueEl) {
        licznikiShowValueEl.checked = licznikiConfigState.showValue;
      }
    }

    function resetAdminCennikForm() {
      if (!adminCennikFormEl) {
        return;
      }
      adminCennikFormEl.reset();
      const idInput = adminCennikFormEl.querySelector('input[name="cennikId"]');
      if (idInput) {
        idInput.value = "";
      }
      const sectionInput = adminCennikFormEl.querySelector('select[name="cennikSection"]');
      if (sectionInput) {
        sectionInput.value = "chill";
      }
    }

    function fillAdminCennikForm(item) {
      if (!adminCennikFormEl || !item) {
        return;
      }
      const idInput = adminCennikFormEl.querySelector('input[name="cennikId"]');
      const sectionInput = adminCennikFormEl.querySelector('select[name="cennikSection"]');
      const nameInput = adminCennikFormEl.querySelector('input[name="cennikName"]');
      const descriptionInput = adminCennikFormEl.querySelector('input[name="cennikDescription"]');
      const baseMinutesInput = adminCennikFormEl.querySelector('input[name="cennikBaseMinutes"]');
      const plnInput = adminCennikFormEl.querySelector('input[name="cennikPricePln"]');
      const subyInput = adminCennikFormEl.querySelector('input[name="cennikPriceSuby"]');
      const kicksyInput = adminCennikFormEl.querySelector('input[name="cennikPriceKicksy"]');

      if (idInput) {
        idInput.value = item.id;
      }
      if (sectionInput) {
        sectionInput.value = item.section;
      }
      if (nameInput) {
        nameInput.value = item.name;
      }
      if (descriptionInput) {
        descriptionInput.value = item.description || "";
      }
      if (baseMinutesInput) {
        baseMinutesInput.value = item.baseMinutes > 0 ? String(item.baseMinutes) : "";
      }
      if (plnInput) {
        plnInput.value = String(item.pricePln);
      }
      if (subyInput) {
        subyInput.value = String(item.priceSuby);
      }
      if (kicksyInput) {
        kicksyInput.value = String(item.priceKicksy);
      }
    }

    function getNextKarySortOrder(section) {
      const values = karyCennikItems
        .filter((item) => item.section === section)
        .map((item) => Number(item.sortOrder) || 0);
      const maxValue = values.length ? Math.max(...values) : -1;
      return maxValue + 1;
    }

    function upsertKaryCennikFromForm() {
      if (!adminCennikFormEl) {
        return;
      }

      const formData = new FormData(adminCennikFormEl);
      const editingId = String(formData.get("cennikId") || "").trim();
      const section = normalizeKarySection(formData.get("cennikSection"));
      const name = String(formData.get("cennikName") || "").trim();
      const description = String(formData.get("cennikDescription") || "").trim();
      const baseMinutesRaw = String(formData.get("cennikBaseMinutes") || "").trim();
      const pricePlnRaw = Number(formData.get("cennikPricePln"));
      const priceSubyRaw = Number(formData.get("cennikPriceSuby"));
      const priceKicksyRaw = Number(formData.get("cennikPriceKicksy"));
      let baseMinutes = 0;

      if (!name) {
        setKaryCennikStatus("Podaj nazwe pozycji cennika.", "error");
        return;
      }
      if (baseMinutesRaw) {
        const parsedBaseMinutes = Number(baseMinutesRaw);
        if (!Number.isFinite(parsedBaseMinutes) || parsedBaseMinutes < 0) {
          setKaryCennikStatus("Podaj poprawny czas dodawany (minuty).", "error");
          return;
        }
        baseMinutes = Math.floor(parsedBaseMinutes);
      }
      if (
        !Number.isFinite(pricePlnRaw) ||
        pricePlnRaw < 0 ||
        !Number.isFinite(priceSubyRaw) ||
        priceSubyRaw < 0 ||
        !Number.isFinite(priceKicksyRaw) ||
        priceKicksyRaw < 0
      ) {
        setKaryCennikStatus("Podaj poprawne ceny (PLN, Suby i Kicksy).", "error");
        return;
      }

      const pricePln = Math.floor(pricePlnRaw);
      const priceSuby = Math.floor(priceSubyRaw);
      const priceKicksy = Math.floor(priceKicksyRaw);

      if (editingId) {
        const index = karyCennikItems.findIndex((item) => item.id === editingId);
        if (index !== -1) {
          const previous = karyCennikItems[index];
          const previousSnapshot = {
            section: previous.section,
            name: previous.name,
            description: previous.description,
            baseMinutes: previous.baseMinutes,
            pricePln: previous.pricePln,
            priceSuby: previous.priceSuby,
            priceKicksy: previous.priceKicksy
          };
          karyCennikItems[index] = {
            ...previous,
            section,
            name,
            description,
            baseMinutes,
            pricePln,
            priceSuby,
            priceKicksy,
            sortOrder: previous.section === section ? previous.sortOrder : getNextKarySortOrder(section)
          };
          saveKaryCennikItems();
          renderPublicKaryCennik();
          renderAdminKaryCennikTable();
          resetAdminCennikForm();
          setKaryCennikStatus("Zaktualizowano pozycje cennika.", "success");
          sendAdminWebhookEvent("cennik_update", name, {
            section,
            description,
            baseMinutes,
            pricePln,
            priceSuby,
            priceKicksy,
            previous: previousSnapshot
          });
          return;
        }
      }

      karyCennikItems.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        section,
        name,
        description,
        baseMinutes,
        pricePln,
        priceSuby,
        priceKicksy,
        sortOrder: getNextKarySortOrder(section)
      });

      saveKaryCennikItems();
      renderPublicKaryCennik();
      renderAdminKaryCennikTable();
      resetAdminCennikForm();
      setKaryCennikStatus("Dodano nowa pozycje cennika.", "success");
      sendAdminWebhookEvent("cennik_add", name, {
        section,
        description,
        baseMinutes,
        pricePln,
        priceSuby,
        priceKicksy
      });
    }

    function formatTimerClock(totalSeconds) {
      const safe = Math.max(0, Math.floor(Number(totalSeconds) || 0));
      const hours = Math.floor(safe / 3600);
      const minutes = Math.floor((safe % 3600) / 60);
      const seconds = safe % 60;
      return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
    }

    function getTimerSecondsFromInput(formData) {
      const amountRaw = Number(formData.get("timerAmount"));
      const unit = String(formData.get("timerUnit") || "minutes");
      if (!Number.isFinite(amountRaw) || amountRaw <= 0) {
        return null;
      }

      const amount = Math.floor(amountRaw);
      if (unit === "hours") {
        return amount * 3600;
      }
      if (unit === "seconds") {
        return amount;
      }
      return amount * 60;
    }

    function ensureKaryStateShape() {
      if (!karyLiveState || typeof karyLiveState !== "object") {
        karyLiveState = { timers: {}, timerTotals: {}, counters: {}, lastTickAt: 0 };
      }
      if (!karyLiveState.timers || typeof karyLiveState.timers !== "object") {
        karyLiveState.timers = {};
      }
      if (!karyLiveState.timerTotals || typeof karyLiveState.timerTotals !== "object") {
        karyLiveState.timerTotals = {};
      }
      if (!karyLiveState.counters || typeof karyLiveState.counters !== "object") {
        karyLiveState.counters = {};
      }
      const lastTickRaw = Number(karyLiveState.lastTickAt || 0);
      karyLiveState.lastTickAt = Number.isFinite(lastTickRaw) && lastTickRaw > 0 ? Math.floor(lastTickRaw) : Date.now();

      karyTimerDefinitions.forEach((timer) => {
        const currentValue = Number(karyLiveState.timers[timer.key] || 0);
        const normalizedCurrent = Number.isFinite(currentValue) && currentValue > 0 ? Math.floor(currentValue) : 0;
        const totalValue = Number(karyLiveState.timerTotals[timer.key] || 0);
        let normalizedTotal = Number.isFinite(totalValue) && totalValue > 0 ? Math.floor(totalValue) : 0;
        if (normalizedCurrent > normalizedTotal) {
          normalizedTotal = normalizedCurrent;
        }

        karyLiveState.timers[timer.key] = normalizedCurrent;
        karyLiveState.timerTotals[timer.key] = normalizedTotal;
      });
      karyCounterDefinitions.forEach((counter) => {
        const currentValue = Number(karyLiveState.counters[counter.key] || 0);
        karyLiveState.counters[counter.key] = Number.isFinite(currentValue) && currentValue > 0 ? Math.floor(currentValue) : 0;
      });
    }

    function ensureKaryStatsShape() {
      if (!karyStatsState || typeof karyStatsState !== "object") {
        karyStatsState = { timers: {}, counters: {} };
      }
      if (!karyStatsState.timers || typeof karyStatsState.timers !== "object") {
        karyStatsState.timers = {};
      }
      if (!karyStatsState.counters || typeof karyStatsState.counters !== "object") {
        karyStatsState.counters = {};
      }

      karyTimerDefinitions.forEach((timer) => {
        const rawEntry = karyStatsState.timers[timer.key];
        const source = rawEntry && typeof rawEntry === "object" ? rawEntry : {};
        const recordSeconds = Math.max(
          0,
          Math.floor(
            Number(
              source.recordSeconds != null
                ? source.recordSeconds
                : (source.record != null ? source.record : 0)
            ) || 0
          )
        );
        const totalAddedSeconds = Math.max(
          0,
          Math.floor(
            Number(
              source.totalAddedSeconds != null
                ? source.totalAddedSeconds
                : (source.totalAdded != null ? source.totalAdded : 0)
            ) || 0
          )
        );
        karyStatsState.timers[timer.key] = {
          recordSeconds,
          totalAddedSeconds
        };
      });

      karyCounterDefinitions.forEach((counter) => {
        const rawEntry = karyStatsState.counters[counter.key];
        const source = rawEntry && typeof rawEntry === "object" ? rawEntry : {};
        const maxValue = Math.max(
          0,
          Math.floor(
            Number(
              source.maxValue != null
                ? source.maxValue
                : (source.max != null ? source.max : 0)
            ) || 0
          )
        );
        karyStatsState.counters[counter.key] = { maxValue };
      });
    }

    function getKaryStatsSnapshot() {
      ensureKaryStatsShape();
      return {
        timers: karyTimerDefinitions.reduce((acc, timer) => {
          const entry = karyStatsState.timers[timer.key] || {};
          acc[timer.key] = {
            recordSeconds: Math.max(0, Math.floor(Number(entry.recordSeconds || 0) || 0)),
            totalAddedSeconds: Math.max(0, Math.floor(Number(entry.totalAddedSeconds || 0) || 0))
          };
          return acc;
        }, {}),
        counters: karyCounterDefinitions.reduce((acc, counter) => {
          const entry = karyStatsState.counters[counter.key] || {};
          acc[counter.key] = {
            maxValue: Math.max(0, Math.floor(Number(entry.maxValue || 0) || 0))
          };
          return acc;
        }, {})
      };
    }

    function getKaryStatsSnapshotKey(snapshot) {
      try {
        return JSON.stringify(snapshot || {});
      } catch (_error) {
        return "";
      }
    }

    function normalizeKaryStatsSnapshot(rawState) {
      const previousState = karyStatsState;
      const source = rawState && typeof rawState === "object" && !Array.isArray(rawState) ? rawState : {};

      karyStatsState = {
        timers: source.timers && typeof source.timers === "object" ? { ...source.timers } : {},
        counters: source.counters && typeof source.counters === "object" ? { ...source.counters } : {}
      };
      ensureKaryStatsShape();
      const normalized = getKaryStatsSnapshot();
      karyStatsState = previousState;
      return normalized;
    }

    function mergeKaryStatsSnapshots(baseSnapshot, incomingSnapshot) {
      const base = normalizeKaryStatsSnapshot(baseSnapshot);
      const incoming = normalizeKaryStatsSnapshot(incomingSnapshot);

      return {
        timers: karyTimerDefinitions.reduce((acc, timer) => {
          const key = timer.key;
          const baseEntry = base.timers[key] || {};
          const incomingEntry = incoming.timers[key] || {};
          acc[key] = {
            recordSeconds: Math.max(
              Math.max(0, Math.floor(Number(baseEntry.recordSeconds || 0) || 0)),
              Math.max(0, Math.floor(Number(incomingEntry.recordSeconds || 0) || 0))
            ),
            totalAddedSeconds: Math.max(
              Math.max(0, Math.floor(Number(baseEntry.totalAddedSeconds || 0) || 0)),
              Math.max(0, Math.floor(Number(incomingEntry.totalAddedSeconds || 0) || 0))
            )
          };
          return acc;
        }, {}),
        counters: karyCounterDefinitions.reduce((acc, counter) => {
          const key = counter.key;
          const baseEntry = base.counters[key] || {};
          const incomingEntry = incoming.counters[key] || {};
          acc[key] = {
            maxValue: Math.max(
              Math.max(0, Math.floor(Number(baseEntry.maxValue || 0) || 0)),
              Math.max(0, Math.floor(Number(incomingEntry.maxValue || 0) || 0))
            )
          };
          return acc;
        }, {})
      };
    }

    function loadKaryStats() {
      karyStatsState = readStorageJson(KARY_STATS_KEY, { timers: {}, counters: {} });
      ensureKaryStatsShape();
    }

    function saveKaryStats(options = {}) {
      ensureKaryStatsShape();
      saveStorageJson(KARY_STATS_KEY, karyStatsState);
      if (options && options.queueApi === false) {
        return;
      }
      queueKaryStatsApiPush();
    }

    function applyRemoteKaryStats(rawState, updatedAt = 0) {
      const normalized = normalizeKaryStatsSnapshot(rawState);
      const currentSnapshot = getKaryStatsSnapshot();
      const mergedSnapshot = mergeKaryStatsSnapshots(currentSnapshot, normalized);
      if (updatedAt > 0) {
        karyStatsRemoteUpdatedAt = Math.max(karyStatsRemoteUpdatedAt, Math.floor(updatedAt));
      }
      if (getKaryStatsSnapshotKey(mergedSnapshot) === getKaryStatsSnapshotKey(currentSnapshot)) {
        return false;
      }

      karyStatsState = mergedSnapshot;
      saveStorageJson(KARY_STATS_KEY, mergedSnapshot);
      if (lastAppliedRouteName === "stats") {
        renderKaryStats();
      }
      return true;
    }

    function syncKaryStatsRecordsFromCurrentState(options = {}) {
      ensureKaryStateShape();
      ensureKaryStatsShape();
      let changed = false;

      karyTimerDefinitions.forEach((timer) => {
        const current = Math.max(0, Math.floor(Number(karyLiveState.timers[timer.key] || 0)));
        const timerStats = karyStatsState.timers[timer.key] || { recordSeconds: 0, totalAddedSeconds: 0 };
        if (current > Math.max(0, Math.floor(Number(timerStats.recordSeconds || 0)))) {
          timerStats.recordSeconds = current;
          changed = true;
        }
        karyStatsState.timers[timer.key] = timerStats;
      });

      karyCounterDefinitions.forEach((counter) => {
        const current = Math.max(0, Math.floor(Number(karyLiveState.counters[counter.key] || 0)));
        const counterStats = karyStatsState.counters[counter.key] || { maxValue: 0 };
        if (current > Math.max(0, Math.floor(Number(counterStats.maxValue || 0)))) {
          counterStats.maxValue = current;
          changed = true;
        }
        karyStatsState.counters[counter.key] = counterStats;
      });

      if (changed) {
        saveKaryStats({ queueApi: options && options.queueApi === false ? false : true });
      }
      if (options && options.render === true && lastAppliedRouteName === "stats") {
        renderKaryStats();
      }
      return changed;
    }

    function updateKaryStatsFromStateTransition(previousSnapshot, nextSnapshot, options = {}) {
      ensureKaryStatsShape();

      const prevTimers =
        previousSnapshot && previousSnapshot.timers && typeof previousSnapshot.timers === "object"
          ? previousSnapshot.timers
          : {};
      const nextTimers =
        nextSnapshot && nextSnapshot.timers && typeof nextSnapshot.timers === "object"
          ? nextSnapshot.timers
          : {};
      const nextCounters =
        nextSnapshot && nextSnapshot.counters && typeof nextSnapshot.counters === "object"
          ? nextSnapshot.counters
          : {};

      const skipAddedSeconds = options && options.skipAddedSeconds === true;
      let changed = false;
      karyTimerDefinitions.forEach((timer) => {
        const timerKey = timer.key;
        const previousValue = Math.max(0, Math.floor(Number(prevTimers[timerKey] || 0)));
        const nextValue = Math.max(0, Math.floor(Number(nextTimers[timerKey] || 0)));
        const timerStats = karyStatsState.timers[timerKey] || { recordSeconds: 0, totalAddedSeconds: 0 };

        if (nextValue > Math.max(0, Math.floor(Number(timerStats.recordSeconds || 0)))) {
          timerStats.recordSeconds = nextValue;
          changed = true;
        }

        if (!skipAddedSeconds && nextValue > previousValue) {
          timerStats.totalAddedSeconds = Math.max(0, Math.floor(Number(timerStats.totalAddedSeconds || 0))) + (nextValue - previousValue);
          changed = true;
        }

        karyStatsState.timers[timerKey] = timerStats;
      });

      karyCounterDefinitions.forEach((counter) => {
        const counterKey = counter.key;
        const nextValue = Math.max(0, Math.floor(Number(nextCounters[counterKey] || 0)));
        const counterStats = karyStatsState.counters[counterKey] || { maxValue: 0 };
        if (nextValue > Math.max(0, Math.floor(Number(counterStats.maxValue || 0)))) {
          counterStats.maxValue = nextValue;
          changed = true;
        }
        karyStatsState.counters[counterKey] = counterStats;
      });

      if (!changed) {
        return false;
      }

      saveKaryStats({ queueApi: options && options.queueApi === false ? false : true });
      if (options && options.render === false) {
        return true;
      }
      if (lastAppliedRouteName === "stats") {
        renderKaryStats();
      }
      return true;
    }

    function loadKaryState() {
      karyLiveState = readStorageJson(KARY_STATE_KEY, { timers: {}, timerTotals: {}, counters: {}, lastTickAt: 0 });
      ensureKaryStateShape();
    }

    function saveKaryState() {
      ensureKaryStateShape();
      saveStorageJson(KARY_STATE_KEY, karyLiveState);
    }

    function getKaryStateSnapshot() {
      ensureKaryStateShape();
      return {
        timers: { ...karyLiveState.timers },
        timerTotals: { ...karyLiveState.timerTotals },
        counters: { ...karyLiveState.counters },
        lastTickAt: Math.max(0, Math.floor(Number(karyLiveState.lastTickAt || 0)))
      };
    }

    function normalizeKaryStateSnapshot(rawState) {
      const previousState = karyLiveState;
      const source = rawState && typeof rawState === "object" && !Array.isArray(rawState) ? rawState : {};

      karyLiveState = {
        timers: source.timers && typeof source.timers === "object" ? { ...source.timers } : {},
        timerTotals: source.timerTotals && typeof source.timerTotals === "object" ? { ...source.timerTotals } : {},
        counters: source.counters && typeof source.counters === "object" ? { ...source.counters } : {},
        lastTickAt: Number(source.lastTickAt || 0)
      };
      ensureKaryStateShape();
      const normalized = getKaryStateSnapshot();
      karyLiveState = previousState;
      return normalized;
    }

    function getKarySnapshotKey(snapshot) {
      try {
        return JSON.stringify(snapshot || {});
      } catch (_error) {
        return "";
      }
    }

    function applyRemoteKaryState(rawState, updatedAt = 0) {
      const normalized = normalizeKaryStateSnapshot(rawState);
      const currentSnapshot = getKaryStateSnapshot();

      if (updatedAt > 0) {
        karyStateRemoteUpdatedAt = Math.max(karyStateRemoteUpdatedAt, Math.floor(updatedAt));
      }

      if (getKarySnapshotKey(normalized) === getKarySnapshotKey(currentSnapshot)) {
        return false;
      }

      karyLiveState = normalized;
      updateKaryStatsFromStateTransition(currentSnapshot, getKaryStateSnapshot(), {
        render: false,
        queueApi: false,
        skipAddedSeconds: true
      });
      karyStateLastApiHeartbeatAt = Date.now();
      saveKaryState();
      renderKaryLiveState();
      return true;
    }

    function stopKaryStateSyncBridge() {
      if (!karyStateSyncPollId) {
        return;
      }
      window.clearInterval(karyStateSyncPollId);
      karyStateSyncPollId = null;
    }

    async function pushKaryStateToApiOnce() {
      if (karyStateApiDisabled || IS_FILE_PROTOCOL || typeof fetch !== "function") {
        return false;
      }

      const snapshot = getKaryStateSnapshot();
      karyStatePushInFlight = true;

      try {
        const response = await fetch(KARY_STATE_API_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "set",
            state: snapshot
          }),
          keepalive: true
        });

        if (!response.ok) {
          let details = "";
          try {
            details = await response.text();
          } catch (_error) {
            details = "";
          }
          console.warn("[TakuuScript] POST /api/kary/state failed", {
            status: response.status,
            details
          });
          if (response.status === 404 || response.status === 405 || response.status === 501) {
            karyStateApiDisabled = true;
            stopKaryStateSyncBridge();
          }
          return false;
        }

        const contentType = String(response.headers.get("content-type") || "").toLowerCase();
        if (!contentType.includes("application/json")) {
          let preview = "";
          try {
            preview = String(await response.text()).slice(0, 220);
          } catch (_error) {
            preview = "";
          }
          console.warn("[TakuuScript] POST /api/kary/state returned non-JSON response", {
            status: response.status,
            contentType,
            preview
          });
          return false;
        }

        let payload = null;
        try {
          payload = await response.json();
        } catch (_error) {
          payload = null;
        }
        const updatedAt = Math.max(
          0,
          Math.floor(Number(payload?.updatedAt || payload?.serverTime || Date.now()) || 0)
        );
        if (updatedAt > 0) {
          karyStateRemoteUpdatedAt = Math.max(karyStateRemoteUpdatedAt, updatedAt);
        }
        karyStateLastApiHeartbeatAt = Date.now();
        return Boolean(payload && payload.ok === true);
      } catch (error) {
        console.warn("[TakuuScript] POST /api/kary/state request error", error);
        return false;
      } finally {
        karyStatePushInFlight = false;
        if (karyStatePushQueued) {
          karyStatePushQueued = false;
          queueKaryStateApiPush();
        }
      }
    }

    function queueKaryStateApiPush() {
      if (karyStateApiDisabled || IS_FILE_PROTOCOL || typeof fetch !== "function") {
        return;
      }
      if (karyStatePushInFlight) {
        karyStatePushQueued = true;
        return;
      }
      void pushKaryStateToApiOnce();
    }

    async function syncKaryStateFromApiOnce(options = {}) {
      if (karyStateApiDisabled || IS_FILE_PROTOCOL || typeof fetch !== "function") {
        return false;
      }
      const force = options && options.force === true;
      if (karyStateSyncBusy) {
        return false;
      }
      if (!force && (karyStatePushInFlight || karyStatePushQueued)) {
        return false;
      }

      karyStateSyncBusy = true;
      const knownUpdatedAt = Math.max(0, Math.floor(Number(karyStateRemoteUpdatedAt || 0)));
      const query = !force && knownUpdatedAt > 0 ? `?after=${knownUpdatedAt}` : "";

      try {
        const response = await fetch(`${KARY_STATE_API_ENDPOINT}${query}`, { cache: "no-store" });

        if (!response.ok) {
          let details = "";
          try {
            details = await response.text();
          } catch (_error) {
            details = "";
          }
          console.warn("[TakuuScript] GET /api/kary/state failed", {
            status: response.status,
            details
          });
          if (response.status === 404 || response.status === 405 || response.status === 501) {
            karyStateApiDisabled = true;
            stopKaryStateSyncBridge();
          }
          return false;
        }

        const contentType = String(response.headers.get("content-type") || "").toLowerCase();
        if (!contentType.includes("application/json")) {
          let preview = "";
          try {
            preview = String(await response.text()).slice(0, 220);
          } catch (_error) {
            preview = "";
          }
          console.warn("[TakuuScript] GET /api/kary/state returned non-JSON response", {
            status: response.status,
            contentType,
            preview
          });
          return false;
        }

        let payload = null;
        try {
          payload = await response.json();
        } catch (_error) {
          payload = null;
        }
        if (!payload || typeof payload !== "object") {
          return false;
        }

        const updatedAt = Math.max(0, Math.floor(Number(payload.updatedAt || 0)));
        const state = payload.state && typeof payload.state === "object" && !Array.isArray(payload.state)
          ? payload.state
          : null;

        if (!state) {
          return false;
        }
        if (karyStatePushInFlight || karyStatePushQueued) {
          return false;
        }
        if (!force && updatedAt > 0 && updatedAt <= knownUpdatedAt) {
          return false;
        }

        return applyRemoteKaryState(state, updatedAt);
      } catch (error) {
        console.warn("[TakuuScript] GET /api/kary/state request error", error);
        return false;
      } finally {
        karyStateSyncBusy = false;
      }
    }

    function startKaryStateSyncBridge() {
      if (karyStateApiDisabled || IS_FILE_PROTOCOL || typeof fetch !== "function") {
        return;
      }

      void syncKaryStateFromApiOnce({ force: true }).finally(() => {
        // If Redis has no snapshot yet, seed it with current local state.
        if (karyStateRemoteUpdatedAt <= 0) {
          queueKaryStateApiPush();
        }
      });
      if (karyStateSyncPollId) {
        return;
      }

      karyStateSyncPollId = window.setInterval(() => {
        void syncKaryStateFromApiOnce();
      }, KARY_STATE_SYNC_POLL_MS);
    }

    function stopKaryStatsSyncBridge() {
      if (!karyStatsSyncPollId) {
        return;
      }
      window.clearInterval(karyStatsSyncPollId);
      karyStatsSyncPollId = null;
    }

    async function pushKaryStatsToApiOnce() {
      if (karyStatsApiDisabled || IS_FILE_PROTOCOL || typeof fetch !== "function") {
        return false;
      }

      const snapshot = getKaryStatsSnapshot();
      karyStatsPushInFlight = true;

      try {
        const response = await fetch(KARY_STATS_API_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "set",
            state: snapshot
          }),
          keepalive: true
        });

        if (!response.ok) {
          let details = "";
          try {
            details = await response.text();
          } catch (_error) {
            details = "";
          }
          console.warn("[TakuuScript] POST /api/kary/stats failed", {
            status: response.status,
            details
          });
          if (response.status === 404 || response.status === 405 || response.status === 501) {
            karyStatsApiDisabled = true;
            stopKaryStatsSyncBridge();
          }
          return false;
        }

        const contentType = String(response.headers.get("content-type") || "").toLowerCase();
        if (!contentType.includes("application/json")) {
          let preview = "";
          try {
            preview = String(await response.text()).slice(0, 220);
          } catch (_error) {
            preview = "";
          }
          console.warn("[TakuuScript] POST /api/kary/stats returned non-JSON response", {
            status: response.status,
            contentType,
            preview
          });
          return false;
        }

        let payload = null;
        try {
          payload = await response.json();
        } catch (_error) {
          payload = null;
        }
        const updatedAt = Math.max(
          0,
          Math.floor(Number(payload?.updatedAt || payload?.serverTime || Date.now()) || 0)
        );
        if (updatedAt > 0) {
          karyStatsRemoteUpdatedAt = Math.max(karyStatsRemoteUpdatedAt, updatedAt);
        }
        return Boolean(payload && payload.ok === true);
      } catch (error) {
        console.warn("[TakuuScript] POST /api/kary/stats request error", error);
        return false;
      } finally {
        karyStatsPushInFlight = false;
        if (karyStatsPushQueued) {
          karyStatsPushQueued = false;
          queueKaryStatsApiPush();
        }
      }
    }

    function queueKaryStatsApiPush() {
      if (karyStatsApiDisabled || IS_FILE_PROTOCOL || typeof fetch !== "function") {
        return;
      }
      if (karyStatsPushInFlight) {
        karyStatsPushQueued = true;
        return;
      }
      void pushKaryStatsToApiOnce();
    }

    async function syncKaryStatsFromApiOnce(options = {}) {
      if (karyStatsApiDisabled || IS_FILE_PROTOCOL || typeof fetch !== "function") {
        return false;
      }
      const force = options && options.force === true;
      if (karyStatsSyncBusy) {
        return false;
      }
      if (!force && (karyStatsPushInFlight || karyStatsPushQueued)) {
        return false;
      }

      karyStatsSyncBusy = true;
      const knownUpdatedAt = Math.max(0, Math.floor(Number(karyStatsRemoteUpdatedAt || 0)));
      const query = !force && knownUpdatedAt > 0 ? `?after=${knownUpdatedAt}` : "";

      try {
        const response = await fetch(`${KARY_STATS_API_ENDPOINT}${query}`, { cache: "no-store" });

        if (!response.ok) {
          let details = "";
          try {
            details = await response.text();
          } catch (_error) {
            details = "";
          }
          console.warn("[TakuuScript] GET /api/kary/stats failed", {
            status: response.status,
            details
          });
          if (response.status === 404 || response.status === 405 || response.status === 501) {
            karyStatsApiDisabled = true;
            stopKaryStatsSyncBridge();
          }
          return false;
        }

        const contentType = String(response.headers.get("content-type") || "").toLowerCase();
        if (!contentType.includes("application/json")) {
          let preview = "";
          try {
            preview = String(await response.text()).slice(0, 220);
          } catch (_error) {
            preview = "";
          }
          console.warn("[TakuuScript] GET /api/kary/stats returned non-JSON response", {
            status: response.status,
            contentType,
            preview
          });
          return false;
        }

        let payload = null;
        try {
          payload = await response.json();
        } catch (_error) {
          payload = null;
        }
        if (!payload || typeof payload !== "object") {
          return false;
        }

        const updatedAt = Math.max(0, Math.floor(Number(payload.updatedAt || 0)));
        const state = payload.state && typeof payload.state === "object" && !Array.isArray(payload.state)
          ? payload.state
          : null;

        if (!state) {
          return false;
        }
        if (karyStatsPushInFlight || karyStatsPushQueued) {
          return false;
        }
        if (!force && updatedAt > 0 && updatedAt <= knownUpdatedAt) {
          return false;
        }

        return applyRemoteKaryStats(state, updatedAt);
      } catch (error) {
        console.warn("[TakuuScript] GET /api/kary/stats request error", error);
        return false;
      } finally {
        karyStatsSyncBusy = false;
      }
    }

    function startKaryStatsSyncBridge() {
      if (karyStatsApiDisabled || IS_FILE_PROTOCOL || typeof fetch !== "function") {
        return;
      }

      void syncKaryStatsFromApiOnce({ force: true }).finally(() => {
        // If Redis has no snapshot yet, seed timer/counter stats.
        if (karyStatsRemoteUpdatedAt <= 0) {
          syncKaryStatsRecordsFromCurrentState({ queueApi: false, render: false });
          queueKaryStatsApiPush();
        }
      });
      if (karyStatsSyncPollId) {
        return;
      }

      karyStatsSyncPollId = window.setInterval(() => {
        void syncKaryStatsFromApiOnce();
      }, KARY_STATS_SYNC_POLL_MS);
    }

    function normalizeKaryCennikItems(rawItems) {
      if (!Array.isArray(rawItems)) {
        return [];
      }
      return rawItems
        .map((item, index) => normalizeKaryCennikItem(item, index))
        .filter(Boolean);
    }

    function normalizeAdminStatePayload(rawState) {
      const source = rawState && typeof rawState === "object" && !Array.isArray(rawState) ? rawState : {};
      const normalizedMembersOrder = Array.isArray(source.membersOrder)
        ? source.membersOrder.map((item) => String(item || "").trim()).filter(Boolean)
        : [];

      return {
        accounts: normalizeAdminAccounts(source.accounts),
        baseMemberOverrides: sanitizeBaseMemberOverrides(source.baseMemberOverrides),
        customMembers: normalizeCustomMembers(source.customMembers),
        membersOrder: normalizedMembersOrder,
        karyCennikItems: normalizeKaryCennikItems(source.karyCennikItems),
        timeryConfig: normalizeTimeryConfig(source.timeryConfig, timeryConfigState),
        licznikiConfig: normalizeLicznikiConfig(source.licznikiConfig, licznikiConfigState),
        streamObsTimeryConfig: normalizeStreamObsTimeryConfig(source.streamObsTimeryConfig, streamObsTimeryConfigState),
        streamObsLicznikiConfig: normalizeStreamObsLicznikiConfig(source.streamObsLicznikiConfig, streamObsLicznikiConfigState)
      };
    }

    function getAdminStateSnapshot() {
      const snapshot = {
        accounts: normalizeAdminAccounts(adminAccounts),
        baseMemberOverrides: sanitizeBaseMemberOverrides(baseMemberOverrides),
        customMembers: normalizeCustomMembers(customMembers),
        membersOrder: normalizeMembersOrder(membersOrder),
        karyCennikItems: normalizeKaryCennikItems(karyCennikItems),
        timeryConfig: normalizeTimeryConfig(timeryConfigState, timeryConfigState),
        licznikiConfig: normalizeLicznikiConfig(licznikiConfigState, licznikiConfigState),
        streamObsTimeryConfig: normalizeStreamObsTimeryConfig(streamObsTimeryConfigState, streamObsTimeryConfigState),
        streamObsLicznikiConfig: normalizeStreamObsLicznikiConfig(streamObsLicznikiConfigState, streamObsLicznikiConfigState)
      };
      return snapshot;
    }

    function saveAdminStateSnapshotToStorage(snapshot = null) {
      const source = snapshot && typeof snapshot === "object" ? snapshot : getAdminStateSnapshot();
      saveStorageJson(ADMIN_ACCOUNTS_KEY, source.accounts);
      saveStorageJson(CCI_BASE_MEMBER_OVERRIDES_KEY, source.baseMemberOverrides);
      saveStorageJson(CCI_MEMBERS_KEY, source.customMembers);
      saveStorageJson(CCI_MEMBERS_ORDER_KEY, source.membersOrder);
      saveStorageJson(KARY_CENNIK_KEY, source.karyCennikItems);
      saveStorageJson(TIMERY_CONFIG_KEY, source.timeryConfig);
      saveStorageJson(LICZNIKI_CONFIG_KEY, source.licznikiConfig);
      saveStorageJson(STREAMOBS_TIMERY_CONFIG_KEY, source.streamObsTimeryConfig);
      saveStorageJson(STREAMOBS_LICZNIKI_CONFIG_KEY, source.streamObsLicznikiConfig);
    }

    function getAdminSnapshotKey(snapshot) {
      try {
        return JSON.stringify(snapshot || {});
      } catch (_error) {
        return "";
      }
    }

    function applyRemoteAdminState(rawState, updatedAt = 0) {
      const normalized = normalizeAdminStatePayload(rawState);
      const currentSnapshot = getAdminStateSnapshot();

      if (updatedAt > 0) {
        adminStateRemoteUpdatedAt = Math.max(adminStateRemoteUpdatedAt, Math.floor(updatedAt));
      }
      if (getAdminSnapshotKey(normalized) === getAdminSnapshotKey(currentSnapshot)) {
        return false;
      }

      adminStateApplyingRemote = true;
      try {
        adminAccounts = normalized.accounts;
        baseMemberOverrides = normalized.baseMemberOverrides;
        customMembers = normalized.customMembers;
        membersOrder = normalized.membersOrder;
        karyCennikItems = normalized.karyCennikItems;
        timeryConfigState = normalized.timeryConfig;
        licznikiConfigState = normalized.licznikiConfig;
        streamObsTimeryConfigState = normalized.streamObsTimeryConfig;
        streamObsLicznikiConfigState = normalized.streamObsLicznikiConfig;

        baseMembers = loadBaseMembersFromGrid();
        refreshMembersOrder(false);

        if (editingMemberId && !getAllMembers().some((member) => member.id === editingMemberId)) {
          stopMemberEdit({ resetForm: true });
        }

        const finalSnapshot = getAdminStateSnapshot();
        saveAdminStateSnapshotToStorage(finalSnapshot);

        renderPublicKaryCennik();
        renderAdminKaryCennikTable();
        renderCustomMembersCards();
        renderAdminMembersTable();
        renderAdminAccountsTable();
        applyTimeryConfig();
        applyStreamObsTimeryConfig();
        applyStreamObsLicznikiConfig();
        applyLicznikiConfig();
        restoreAdminSession();
      } finally {
        adminStateApplyingRemote = false;
      }
      return true;
    }

    function stopAdminStateSyncBridge() {
      if (!adminStateSyncPollId) {
        return;
      }
      window.clearInterval(adminStateSyncPollId);
      adminStateSyncPollId = null;
    }

    async function pushAdminStateToApiOnce() {
      if (adminStateApiDisabled || IS_FILE_PROTOCOL || typeof fetch !== "function") {
        return false;
      }

      const snapshot = getAdminStateSnapshot();
      adminStatePushInFlight = true;

      try {
        const response = await fetch(ADMIN_STATE_API_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "set",
            state: snapshot
          }),
          keepalive: true
        });

        if (!response.ok) {
          let details = "";
          try {
            details = await response.text();
          } catch (_error) {
            details = "";
          }
          console.warn("[TakuuScript] POST /api/admin/state failed", {
            status: response.status,
            details
          });
          if (response.status === 404 || response.status === 405 || response.status === 501) {
            adminStateApiDisabled = true;
            stopAdminStateSyncBridge();
          }
          return false;
        }

        const contentType = String(response.headers.get("content-type") || "").toLowerCase();
        if (!contentType.includes("application/json")) {
          let preview = "";
          try {
            preview = String(await response.text()).slice(0, 220);
          } catch (_error) {
            preview = "";
          }
          console.warn("[TakuuScript] POST /api/admin/state returned non-JSON response", {
            status: response.status,
            contentType,
            preview
          });
          return false;
        }

        let payload = null;
        try {
          payload = await response.json();
        } catch (_error) {
          payload = null;
        }
        const updatedAt = Math.max(0, Math.floor(Number(payload?.updatedAt || payload?.serverTime || Date.now()) || 0));
        if (updatedAt > 0) {
          adminStateRemoteUpdatedAt = Math.max(adminStateRemoteUpdatedAt, updatedAt);
        }
        return Boolean(payload && payload.ok === true);
      } catch (error) {
        console.warn("[TakuuScript] POST /api/admin/state request error", error);
        return false;
      } finally {
        adminStatePushInFlight = false;
        if (adminStatePushQueued) {
          adminStatePushQueued = false;
          queueAdminStateApiPush();
        }
      }
    }

    function queueAdminStateApiPush() {
      if (adminStateApplyingRemote || adminStateApiDisabled || IS_FILE_PROTOCOL || typeof fetch !== "function") {
        return;
      }
      if (!adminStateSyncInitialized) {
        adminStatePendingLocalPush = true;
        return;
      }
      if (adminStatePushInFlight) {
        adminStatePushQueued = true;
        return;
      }
      void pushAdminStateToApiOnce();
    }

    async function syncAdminStateFromApiOnce(options = {}) {
      if (adminStateApiDisabled || IS_FILE_PROTOCOL || typeof fetch !== "function") {
        return false;
      }
      const force = options && options.force === true;
      if (adminStateSyncBusy) {
        return false;
      }
      if (!force && (adminStatePushInFlight || adminStatePushQueued)) {
        return false;
      }

      adminStateSyncBusy = true;
      const knownUpdatedAt = Math.max(0, Math.floor(Number(adminStateRemoteUpdatedAt || 0)));
      const query = !force && knownUpdatedAt > 0 ? `?after=${knownUpdatedAt}` : "";

      try {
        const response = await fetch(`${ADMIN_STATE_API_ENDPOINT}${query}`, { cache: "no-store" });

        if (!response.ok) {
          let details = "";
          try {
            details = await response.text();
          } catch (_error) {
            details = "";
          }
          console.warn("[TakuuScript] GET /api/admin/state failed", {
            status: response.status,
            details
          });
          if (response.status === 404 || response.status === 405 || response.status === 501) {
            adminStateApiDisabled = true;
            stopAdminStateSyncBridge();
          }
          return false;
        }

        const contentType = String(response.headers.get("content-type") || "").toLowerCase();
        if (!contentType.includes("application/json")) {
          let preview = "";
          try {
            preview = String(await response.text()).slice(0, 220);
          } catch (_error) {
            preview = "";
          }
          console.warn("[TakuuScript] GET /api/admin/state returned non-JSON response", {
            status: response.status,
            contentType,
            preview
          });
          return false;
        }

        let payload = null;
        try {
          payload = await response.json();
        } catch (_error) {
          payload = null;
        }
        if (!payload || typeof payload !== "object") {
          return false;
        }

        const updatedAt = Math.max(0, Math.floor(Number(payload.updatedAt || 0)));
        const state = payload.state && typeof payload.state === "object" && !Array.isArray(payload.state)
          ? payload.state
          : null;

        if (updatedAt > 0) {
          adminStateRemoteUpdatedAt = Math.max(adminStateRemoteUpdatedAt, updatedAt);
        }
        if (!state) {
          return false;
        }
        if (adminStatePushInFlight || adminStatePushQueued) {
          return false;
        }
        if (!force && updatedAt > 0 && updatedAt <= knownUpdatedAt) {
          return false;
        }

        return applyRemoteAdminState(state, updatedAt);
      } catch (error) {
        console.warn("[TakuuScript] GET /api/admin/state request error", error);
        return false;
      } finally {
        adminStateSyncBusy = false;
      }
    }

    function startAdminStateSyncBridge() {
      if (adminStateApiDisabled || IS_FILE_PROTOCOL || typeof fetch !== "function") {
        return;
      }

      void syncAdminStateFromApiOnce({ force: true }).finally(() => {
        adminStateSyncInitialized = true;
        if (adminStatePendingLocalPush && adminStateRemoteUpdatedAt <= 0) {
          adminStatePendingLocalPush = false;
          queueAdminStateApiPush();
        } else {
          adminStatePendingLocalPush = false;
        }
      });

      if (adminStateSyncPollId) {
        return;
      }
      adminStateSyncPollId = window.setInterval(() => {
        void syncAdminStateFromApiOnce();
      }, ADMIN_STATE_SYNC_POLL_MS);
    }

    function renderKaryLiveState() {
      ensureKaryStateShape();
      const activeTimerKeys = new Set();

      karyTimerCardEls.forEach((card) => {
        const key = String(card.dataset.karyTimer || "");
        if (!key) {
          return;
        }
        const remaining = Math.max(0, Math.floor(Number(karyLiveState.timers[key] || 0)));
        const total = Math.max(0, Math.floor(Number(karyLiveState.timerTotals[key] || 0)));
        const progress = total > 0 ? Math.max(0, Math.min(100, (remaining / total) * 100)) : 0;
        const stateEl = card.querySelector("[data-kary-timer-state]");
        const timeEl = card.querySelector("[data-kary-timer-time]");

        if (stateEl) {
          stateEl.textContent = remaining > 0 ? "AKTYWNY" : "IDLE";
        }
        if (timeEl) {
          const nextClock = formatTimerClock(remaining);
          const prevClock = String(timeEl.dataset.clock || timeEl.textContent || "");
          if (prevClock !== nextClock) {
            timeEl.textContent = nextClock;
            timeEl.dataset.clock = nextClock;
            if (remaining > 0) {
              if (!timeEl.dataset.tickAnimationBound) {
                timeEl.dataset.tickAnimationBound = "1";
                timeEl.addEventListener("animationend", () => {
                  timeEl.classList.remove("time-tick");
                });
              }
              timeEl.classList.remove("time-tick");
              void timeEl.offsetWidth;
              timeEl.classList.add("time-tick");
            } else {
              timeEl.classList.remove("time-tick");
            }
          }
        }
        card.style.setProperty("--timer-progress", `${progress}%`);
        card.classList.toggle("is-active", remaining > 0);
        if (remaining > 0) {
          activeTimerKeys.add(key);
        }
      });

      const activeTimersCount = activeTimerKeys.size;
      const activeTimerItems = karyTimerDefinitions
        .map((timer) => {
          const remaining = Math.max(0, Math.floor(Number(karyLiveState.timers[timer.key] || 0)));
          return { ...timer, remaining };
        })
        .filter((timer) => timer.remaining > 0);

      if (streamIntroActiveCountEl) {
        streamIntroActiveCountEl.textContent = String(activeTimersCount);
      }
      if (streamIntroLiveEl) {
        streamIntroLiveEl.classList.toggle("is-inactive", activeTimersCount <= 0);
      }
      if (streamIntroActiveTextEl) {
        if (activeTimersCount === 1) {
          streamIntroActiveTextEl.textContent = "aktywna kara teraz";
        } else if (activeTimersCount >= 2 && activeTimersCount <= 4) {
          streamIntroActiveTextEl.textContent = "aktywne kary teraz";
        } else {
          streamIntroActiveTextEl.textContent = "aktywnych kar teraz";
        }
      }
      if (streamActiveKaryEl) {
        streamActiveKaryEl.classList.toggle("is-empty", activeTimerItems.length === 0);
      }
      if (streamActiveKaryListEl) {
        if (!activeTimerItems.length) {
          streamActiveKaryListEl.innerHTML = '<p class="stream-active-kary-empty">Brak aktywnych kar.</p>';
        } else {
          streamActiveKaryListEl.innerHTML = activeTimerItems
            .map(
              (timer) => `
                <article class="stream-active-kary-item">
                  <p class="stream-active-kary-name">${escapeHtml(timer.label)}</p>
                  <span class="stream-active-kary-time time-tick">${formatTimerClock(timer.remaining)}</span>
                </article>
              `
            )
            .join("");
        }
      }

      karyCounterCardEls.forEach((card) => {
        const key = String(card.dataset.karyCounter || "");
        if (!key) {
          return;
        }
        const value = Math.max(0, Math.floor(Number(karyLiveState.counters[key] || 0)));
        const valueEl = card.querySelector("[data-kary-counter-value]");
        if (valueEl) {
          valueEl.textContent = String(value);
        }
      });

      if (lastAppliedRouteName === "stats") {
        renderKaryStats();
      }
    }

    function tickKaryTimers() {
      // Keep multiple opened windows in sync without manual refresh.
      loadKaryState();
      ensureKaryStateShape();
      const now = Date.now();
      const lastTickAt = Math.max(0, Math.floor(Number(karyLiveState.lastTickAt || now)));
      const elapsedSeconds = Math.max(0, Math.floor((now - lastTickAt) / 1000));
      const consumedSeconds = document.hidden ? elapsedSeconds : Math.min(1, elapsedSeconds);

      if (consumedSeconds <= 0) {
        renderKaryLiveState();
        return;
      }

      let changed = false;
      karyTimerDefinitions.forEach((timer) => {
        const current = Math.max(0, Math.floor(Number(karyLiveState.timers[timer.key] || 0)));
        if (current > 0) {
          const nextValue = Math.max(0, current - consumedSeconds);
          if (nextValue !== current) {
            changed = true;
            karyLiveState.timers[timer.key] = nextValue;
          }
        }
      });

      karyLiveState.lastTickAt = Math.min(now, lastTickAt + consumedSeconds * 1000);
      if (changed) {
        saveKaryState();
        const hasActiveTimers = karyTimerDefinitions.some(
          (timer) => Math.max(0, Math.floor(Number(karyLiveState.timers[timer.key] || 0))) > 0
        );
        const shouldHeartbeatStatePush =
          !hasActiveTimers || (now - karyStateLastApiHeartbeatAt >= KARY_STATE_API_HEARTBEAT_MS);
        if (shouldHeartbeatStatePush) {
          queueKaryStateApiPush();
          karyStateLastApiHeartbeatAt = now;
        }
      } else {
        ensureKaryStateShape();
      }
      renderKaryLiveState();
    }

    function startKaryTimerTick() {
      if (karyTimerTickId || !karyTimerDefinitions.length) {
        return;
      }
      karyTimerTickId = window.setInterval(tickKaryTimers, 1000);
    }

    function populateKaryAdminControls() {
      if (adminTimerSelectEl) {
        adminTimerSelectEl.innerHTML = karyTimerDefinitions
          .map((timer) => `<option value="${escapeHtml(timer.key)}">${escapeHtml(timer.label)}</option>`)
          .join("");
      }
      if (adminCounterSelectEl) {
        adminCounterSelectEl.innerHTML = karyCounterDefinitions
          .map((counter) => `<option value="${escapeHtml(counter.key)}">${escapeHtml(counter.label)}</option>`)
          .join("");
      }
      updateTimerQuickActionButtons();
    }

    function getTimerLabel(timerKey) {
      const match = karyTimerDefinitions.find((item) => item.key === timerKey);
      return match ? match.label : timerKey;
    }

    function getCounterLabel(counterKey) {
      const match = karyCounterDefinitions.find((item) => item.key === counterKey);
      return match ? match.label : counterKey;
    }

    function parseTimerBaseMinutesFromDescription(description) {
      const clean = String(description || "").trim();
      if (!clean) {
        return 0;
      }

      const minuteMatch = clean.match(/([+-]?\d+)\s*(?:min\.?|minute|minutes|minuta|minuty|minut)\b/i);
      if (!minuteMatch) {
        return 0;
      }

      const parsed = Number.parseInt(minuteMatch[1], 10);
      if (!Number.isFinite(parsed)) {
        return 0;
      }
      return Math.max(0, Math.abs(parsed));
    }

    function isStandaloneMinuteDeltaDescription(description) {
      const clean = String(description || "").trim();
      if (!clean) {
        return false;
      }
      return /^(?:czas\s*:\s*)?[+-]?\d+\s*(?:min\.?|minute|minutes|minuta|minuty|minut)$/i.test(clean);
    }

    function resolveTimerBaseMinutes(timerKey) {
      const fallbackMinutes = 30;
      const cleanKey = String(timerKey || "").trim();
      if (!cleanKey) {
        return fallbackMinutes;
      }

      const timerLabel = getTimerLabel(cleanKey);
      const candidateTokens = new Set([
        normalizeTimerLookupToken(cleanKey),
        normalizeTimerLookupToken(cleanKey.replace(/-/g, " ")),
        normalizeTimerLookupToken(cleanKey.replace(/-/g, "")),
        normalizeTimerLookupToken(timerLabel)
      ].filter(Boolean));

      const exactMatches = (Array.isArray(karyCennikItems) ? karyCennikItems : []).filter((item) => {
        const nameToken = normalizeTimerLookupToken(item && item.name);
        return nameToken && candidateTokens.has(nameToken);
      });

      for (const item of exactMatches) {
        const explicitBaseMinutes = Math.max(0, Math.floor(Number(item && item.baseMinutes) || 0));
        if (explicitBaseMinutes > 0) {
          return explicitBaseMinutes;
        }
        const minutes = parseTimerBaseMinutesFromDescription(item.description);
        if (minutes > 0) {
          return minutes;
        }
      }

      return fallbackMinutes;
    }

    function updateTimerQuickActionButtons() {
      if (!adminTimerFormEl) {
        return;
      }

      const minusBtn = adminTimerFormEl.querySelector('[data-timer-action="minus-30"]');
      const plusBtn = adminTimerFormEl.querySelector('[data-timer-action="plus-30"]');
      if (!minusBtn && !plusBtn) {
        return;
      }

      const selectedTimerKey = String(adminTimerSelectEl?.value || "").trim();
      const baseMinutes = resolveTimerBaseMinutes(selectedTimerKey);
      const minusLabel = `-${baseMinutes} min`;
      const plusLabel = `+${baseMinutes} min`;
      const title = `Krok bazowy z cennika: ${baseMinutes} min`;

      if (minusBtn) {
        minusBtn.textContent = minusLabel;
        minusBtn.title = title;
      }
      if (plusBtn) {
        plusBtn.textContent = plusLabel;
        plusBtn.title = title;
      }
    }

    async function handleDiscordOAuthCallback() {
      if (!window.TakuuWebhook || typeof window.TakuuWebhook.completeDiscordAdminLogin !== "function") {
        return;
      }

      const callbackResult = await window.TakuuWebhook.completeDiscordAdminLogin(adminAccounts);
      if (!callbackResult || callbackResult.skipped) {
        return;
      }

      if (!callbackResult.ok) {
        setDiscordStatus(callbackResult.error || "Nie udało się zalogować przez Discord.", "error");
        return;
      }

      const session = callbackResult.session || null;
      if (!session) {
        setDiscordStatus("Nie udało się odczytać sesji Discord.", "error");
        return;
      }

      const linkedAccount = callbackResult.linkedAccount || null;
      if (callbackResult.accountsChanged) {
        saveAdminAccounts();
      }
      const hasAnyAdminAccess = Boolean(
        callbackResult.hasAnyAdminAccess == null ? callbackResult.canAccessAdmin : callbackResult.hasAnyAdminAccess
      );
      const canAccessPanelAdmin = Boolean(callbackResult.canAccessPanelAdmin);
      const canAccessStreamObs = Boolean(callbackResult.canAccessStreamObs);
      const canAccessBindings = Boolean(callbackResult.canAccessBindings);
      activeDiscordSession = session;
      isAdminAuthenticated = hasAnyAdminAccess;
      currentAdminLogin = isAdminAuthenticated ? `discord:${session.username}` : "";
      try {
        window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
      } catch (_error) {
        // Ignore session storage failures.
      }

      sendAdminWebhookEvent("admin_login_discord", "Panel Administratora", {
        discordId: session.id,
        discordUser: session.username,
        discordDisplayName: session.displayName,
        canAccessAnyAdminArea: hasAnyAdminAccess,
        canAccessPanelAdmin,
        canAccessStreamObs,
        canAccessBindings
      });
      renderAdminAccountsTable();

      if (!isAdminAuthenticated) {
        setAdminStatus("Konto Discord zapisane, ale nie ma permisji do Panelu Admina, StreamOBS ani Powiązań.", "error");
        setDiscordStatus("Brak permisji. Owner ma dostep automatyczny, pozostale ID musza dostac permisje.", "error");
        sendAdminWebhookEvent("admin_login_discord_denied", "Panel Administratora", {
          discordId: session.id,
          discordUser: session.username,
          linkedAccountId: linkedAccount ? linkedAccount.id : ""
        });
        return;
      }

      setAdminStatus(`Zalogowano przez Discord jako ${session.displayName || session.username}.`, "success");
      setDiscordStatus("Logowanie Discord zakończone pomyślnie.", "success");
      navigateTo(ADMIN_ROUTE_PATH, "admin");
    }

    async function startDiscordLoginFlow() {
      if (!window.TakuuWebhook || typeof window.TakuuWebhook.startDiscordLogin !== "function") {
        setDiscordStatus("Brak modułu webhook.js dla logowania Discord.", "error");
        return;
      }

      setRememberMeEnabled(Boolean(adminRememberMeEl && adminRememberMeEl.checked));

      if (typeof window.TakuuWebhook.isDiscordLoginAvailable === "function") {
        const availability = window.TakuuWebhook.isDiscordLoginAvailable();
        if (!availability.ok) {
          setDiscordStatus(availability.error || "Logowanie Discord jest niedostepne.", "error");
          return;
        }
      }

      setDiscordStatus("Przekierowanie do logowania Discord...", "info");
      const result = await window.TakuuWebhook.startDiscordLogin();
      if (result && result.ok === false) {
        setDiscordStatus(result.error || "Nie udało się uruchomić logowania Discord.", "error");
      }
    }

    function addTimerTimeToLiveState(timerKey, deltaSeconds, options = {}) {
      ensureKaryStateShape();

      const normalizedKey = String(timerKey || "").trim();
      if (!normalizedKey || !Object.prototype.hasOwnProperty.call(karyLiveState.timers, normalizedKey)) {
        return {
          ok: false,
          error: "INVALID_TIMER_KEY"
        };
      }

      const normalizedDeltaSeconds = Math.max(0, Math.floor(Number(deltaSeconds) || 0));
      if (normalizedDeltaSeconds <= 0) {
        return {
          ok: false,
          error: "INVALID_DELTA_SECONDS"
        };
      }

      const previousSnapshot = getKaryStateSnapshot();
      const current = Math.max(0, Math.floor(Number(karyLiveState.timers[normalizedKey] || 0)));
      const currentTotal = Math.max(current, Math.floor(Number(karyLiveState.timerTotals[normalizedKey] || 0)));
      const nextRemaining = current + normalizedDeltaSeconds;
      const nextTotal = current > 0 ? currentTotal + normalizedDeltaSeconds : nextRemaining;

      karyLiveState.timers[normalizedKey] = nextRemaining;
      karyLiveState.timerTotals[normalizedKey] = nextTotal;
      karyLiveState.lastTickAt = Date.now();
      updateKaryStatsFromStateTransition(previousSnapshot, getKaryStateSnapshot(), { render: false });

      saveKaryState();
      queueKaryStateApiPush();
      renderKaryLiveState();

      const timerLabel = getTimerLabel(normalizedKey);
      const silentStatus = options.silentStatus === true;
      if (!silentStatus) {
        const statusText =
          String(options.statusText || "").trim() || "Dodano czas do timera.";
        setKaryStatus(statusText, "success");
      }

      if (options.emitWebhook === true) {
        const webhookAction = String(options.webhookAction || "").trim() || "timer_add_time";
        sendAdminWebhookEvent(webhookAction, timerLabel, {
          timerKey: normalizedKey,
          timerLabel,
          deltaSeconds: normalizedDeltaSeconds,
          remainingSeconds: nextRemaining,
          source: String(options.source || "manual")
        });
      }

      return {
        ok: true,
        timerKey: normalizedKey,
        timerLabel,
        deltaSeconds: normalizedDeltaSeconds,
        remainingSeconds: nextRemaining
      };
    }

    function addTimerTimeFromExternal(timerKey, amount, unit = "minutes", options = {}) {
      const normalizedUnit = String(unit || "minutes").trim().toLowerCase();
      const amountValue = Math.max(0, Math.floor(Number(amount) || 0));
      let deltaSeconds = 0;

      if (normalizedUnit === "seconds" || normalizedUnit === "second") {
        deltaSeconds = amountValue;
      } else if (normalizedUnit === "hours" || normalizedUnit === "hour") {
        deltaSeconds = amountValue * 3600;
      } else {
        deltaSeconds = amountValue * 60;
      }

      return addTimerTimeToLiveState(timerKey, deltaSeconds, {
        silentStatus: options.silentStatus !== false,
        emitWebhook: options.emitWebhook === true,
        webhookAction: options.webhookAction,
        source: options.source || "external"
      });
    }

    function normalizeExternalTimerPayload(payload, defaultSource = "external-event") {
      if (!payload || typeof payload !== "object") {
        return null;
      }

      const timerKey = String(payload.timerKey || payload.key || payload.timer || "").trim();
      if (!timerKey) {
        return null;
      }

      let unit = String(payload.unit || "").trim().toLowerCase();
      let amount = null;

      if (payload.amount != null) {
        amount = Number(payload.amount);
      } else if (payload.value != null) {
        amount = Number(payload.value);
      } else if (payload.minutes != null) {
        amount = Number(payload.minutes);
        unit = unit || "minutes";
      } else if (payload.seconds != null) {
        amount = Number(payload.seconds);
        unit = unit || "seconds";
      } else if (payload.hours != null) {
        amount = Number(payload.hours);
        unit = unit || "hours";
      }

      if (!Number.isFinite(amount) || amount <= 0) {
        return null;
      }

      if (
        unit !== "minutes" &&
        unit !== "minute" &&
        unit !== "hours" &&
        unit !== "hour" &&
        unit !== "seconds" &&
        unit !== "second"
      ) {
        unit = "minutes";
      }

      return {
        timerKey,
        amount: Math.floor(amount),
        unit: unit || "minutes",
        options: {
          silentStatus: payload.silentStatus !== false,
          emitWebhook: payload.emitWebhook === true,
          webhookAction: payload.webhookAction,
          source: String(payload.source || defaultSource || "external-event")
        }
      };
    }

    function applyExternalTimerPayload(payload, defaultSource = "external-event") {
      const normalized = normalizeExternalTimerPayload(payload, defaultSource);
      if (!normalized) {
        return {
          ok: false,
          error: "INVALID_EXTERNAL_TIMER_PAYLOAD"
        };
      }

      return addTimerTimeFromExternal(
        normalized.timerKey,
        normalized.amount,
        normalized.unit,
        normalized.options
      );
    }

    function flushPendingExternalTimerQueue() {
      if (!Array.isArray(window.__takuuPendingTimerAdds) || !window.__takuuPendingTimerAdds.length) {
        return;
      }

      const pendingQueue = window.__takuuPendingTimerAdds.slice();
      window.__takuuPendingTimerAdds.length = 0;

      pendingQueue.forEach((payload) => {
        applyExternalTimerPayload(payload, "pending-queue");
      });
    }

    function bindExternalTimerBridge() {
      const previousApi =
        window.TakuuKaryLive && typeof window.TakuuKaryLive === "object" ? window.TakuuKaryLive : {};

      const addTimerTime = (timerKey, amount, unit = "minutes", options = {}) => {
        return addTimerTimeFromExternal(timerKey, amount, unit, {
          silentStatus: options.silentStatus !== false,
          emitWebhook: options.emitWebhook === true,
          webhookAction: options.webhookAction,
          source: options.source || "external-api"
        });
      };

      window.TakuuKaryLive = {
        ...previousApi,
        addTimerTime,
        addTimerMinutes: (timerKey, minutes, options = {}) => addTimerTime(timerKey, minutes, "minutes", options),
        addTimerSeconds: (timerKey, seconds, options = {}) => addTimerTime(timerKey, seconds, "seconds", options),
        getStateSnapshot: () => getKaryStateSnapshot()
      };

      if (!karyExternalTimerBridgeBound) {
        window.addEventListener("takuu:add-timer-time", (event) => {
          const detail = event && event.detail ? event.detail : null;
          applyExternalTimerPayload(detail, "custom-event");
        });
        karyExternalTimerBridgeBound = true;
      }

      flushPendingExternalTimerQueue();
    }

    function applyTimerAction(action, formData) {
      ensureKaryStateShape();
      const normalizedAction =
        action === "set" ||
        action === "reset" ||
        action === "remove" ||
        action === "minus-30" ||
        action === "plus-30"
          ? action
          : "add";

      const timerKey = String(formData.get("timerKey") || "").trim();
      if (!timerKey || !Object.prototype.hasOwnProperty.call(karyLiveState.timers, timerKey)) {
        setKaryStatus("Wybierz poprawny timer.", "error");
        return;
      }
      const timerLabel = getTimerLabel(timerKey);
      const previousSnapshot = getKaryStateSnapshot();

      if (normalizedAction === "reset") {
        karyLiveState.timers[timerKey] = 0;
        karyLiveState.timerTotals[timerKey] = 0;
        karyLiveState.lastTickAt = Date.now();
        updateKaryStatsFromStateTransition(previousSnapshot, getKaryStateSnapshot(), { render: false });
        saveKaryState();
        queueKaryStateApiPush();
        renderKaryLiveState();
        setKaryStatus("Timer zresetowany.", "success");
        sendAdminWebhookEvent("timer_reset", timerLabel, {
          timerKey,
          timerLabel,
          remainingSeconds: 0
        });
        return;
      }

      if (normalizedAction === "minus-30") {
        const stepMinutes = resolveTimerBaseMinutes(timerKey);
        const deltaSeconds = stepMinutes * 60;
        const current = Math.max(0, Math.floor(Number(karyLiveState.timers[timerKey] || 0)));
        const currentTotal = Math.max(current, Math.floor(Number(karyLiveState.timerTotals[timerKey] || 0)));
        const nextRemaining = Math.max(0, current - deltaSeconds);
        karyLiveState.timers[timerKey] = nextRemaining;
        karyLiveState.timerTotals[timerKey] = nextRemaining > 0 ? Math.max(nextRemaining, currentTotal) : 0;
        karyLiveState.lastTickAt = Date.now();
        updateKaryStatsFromStateTransition(previousSnapshot, getKaryStateSnapshot(), { render: false });
        saveKaryState();
        queueKaryStateApiPush();
        renderKaryLiveState();
        setKaryStatus(`Usunięto ${stepMinutes} min z timera.`, "success");
        sendAdminWebhookEvent("timer_remove_quick", timerLabel, {
          timerKey,
          timerLabel,
          stepMinutes,
          deltaSeconds,
          remainingSeconds: Math.max(0, Math.floor(Number(karyLiveState.timers[timerKey] || 0)))
        });
        return;
      }

      if (normalizedAction === "plus-30") {
        const stepMinutes = resolveTimerBaseMinutes(timerKey);
        const deltaSeconds = stepMinutes * 60;
        const addResult = addTimerTimeToLiveState(timerKey, deltaSeconds, {
          silentStatus: false,
          statusText: `Dodano ${stepMinutes} min do timera.`,
          emitWebhook: true,
          webhookAction: "timer_add_quick",
          source: "admin-panel"
        });
        if (!addResult.ok) {
          setKaryStatus(`Nie udało się dodać ${stepMinutes} min do timera.`, "error");
        }
        return;
      }

      const deltaSeconds = getTimerSecondsFromInput(formData);
      if (!deltaSeconds) {
        setKaryStatus("Podaj poprawną wartość czasu.", "error");
        return;
      }

      const current = Math.max(0, Math.floor(Number(karyLiveState.timers[timerKey] || 0)));
      const currentTotal = Math.max(current, Math.floor(Number(karyLiveState.timerTotals[timerKey] || 0)));
      if (normalizedAction === "set") {
        karyLiveState.timers[timerKey] = deltaSeconds;
        karyLiveState.timerTotals[timerKey] = deltaSeconds;
      } else if (normalizedAction === "remove") {
        const nextRemaining = Math.max(0, current - deltaSeconds);
        karyLiveState.timers[timerKey] = nextRemaining;
        karyLiveState.timerTotals[timerKey] = nextRemaining > 0 ? Math.max(nextRemaining, currentTotal) : 0;
      } else {
        const addResult = addTimerTimeToLiveState(timerKey, deltaSeconds, {
          silentStatus: false,
          statusText: "Dodano czas do timera.",
          emitWebhook: true,
          webhookAction: "timer_add_time",
          source: "admin-panel"
        });
        if (!addResult.ok) {
          setKaryStatus("Nie udało się dodać czasu do timera.", "error");
          return;
        }
        return;
      }
      karyLiveState.lastTickAt = Date.now();
      updateKaryStatsFromStateTransition(previousSnapshot, getKaryStateSnapshot(), { render: false });
      saveKaryState();
      queueKaryStateApiPush();
      renderKaryLiveState();
      if (normalizedAction === "set") {
        setKaryStatus("Ustawiono czas timera.", "success");
        sendAdminWebhookEvent("timer_set", timerLabel, {
          timerKey,
          timerLabel,
          deltaSeconds,
          remainingSeconds: Math.max(0, Math.floor(Number(karyLiveState.timers[timerKey] || 0)))
        });
      } else if (normalizedAction === "remove") {
        setKaryStatus("Usunięto czas z timera.", "success");
        sendAdminWebhookEvent("timer_remove_time", timerLabel, {
          timerKey,
          timerLabel,
          deltaSeconds,
          remainingSeconds: Math.max(0, Math.floor(Number(karyLiveState.timers[timerKey] || 0)))
        });
      } else {
        setKaryStatus("Dodano czas do timera.", "success");
        sendAdminWebhookEvent("timer_add_time", timerLabel, {
          timerKey,
          timerLabel,
          deltaSeconds,
          remainingSeconds: Math.max(0, Math.floor(Number(karyLiveState.timers[timerKey] || 0)))
        });
      }
    }

    function applyCounterAction(action, formData) {
      ensureKaryStateShape();
      const normalizedAction =
        action === "set" || action === "reset" || action === "minus-one" || action === "plus-one" ? action : "add";

      const counterKey = String(formData.get("counterKey") || "").trim();
      if (!counterKey || !Object.prototype.hasOwnProperty.call(karyLiveState.counters, counterKey)) {
        setKaryStatus("Wybierz poprawny licznik.", "error");
        return;
      }
      const counterLabel = getCounterLabel(counterKey);
      const previousSnapshot = getKaryStateSnapshot();

      if (normalizedAction === "reset") {
        karyLiveState.counters[counterKey] = 0;
        updateKaryStatsFromStateTransition(previousSnapshot, getKaryStateSnapshot(), { render: false });
        saveKaryState();
        queueKaryStateApiPush();
        renderKaryLiveState();
        setKaryStatus("Licznik zresetowany.", "success");
        sendAdminWebhookEvent("counter_reset", counterLabel, {
          counterKey,
          counterLabel,
          value: 0
        });
        return;
      }

      if (normalizedAction === "minus-one") {
        const current = Math.max(0, Math.floor(Number(karyLiveState.counters[counterKey] || 0)));
        const nextValue = Math.max(0, current - 1);
        karyLiveState.counters[counterKey] = nextValue;
        updateKaryStatsFromStateTransition(previousSnapshot, getKaryStateSnapshot(), { render: false });
        saveKaryState();
        queueKaryStateApiPush();
        renderKaryLiveState();
        setKaryStatus("Odjęto 1 od licznika.", "success");
        sendAdminWebhookEvent("counter_minus_one", counterLabel, {
          counterKey,
          counterLabel,
          deltaValue: -1,
          value: nextValue
        });
        return;
      }

      if (normalizedAction === "plus-one") {
        const current = Math.max(0, Math.floor(Number(karyLiveState.counters[counterKey] || 0)));
        const nextValue = current + 1;
        karyLiveState.counters[counterKey] = nextValue;
        updateKaryStatsFromStateTransition(previousSnapshot, getKaryStateSnapshot(), { render: false });
        saveKaryState();
        queueKaryStateApiPush();
        renderKaryLiveState();
        setKaryStatus("Dodano 1 do licznika.", "success");
        sendAdminWebhookEvent("counter_plus_one", counterLabel, {
          counterKey,
          counterLabel,
          deltaValue: 1,
          value: nextValue
        });
        return;
      }

      const inputValue = Number(formData.get("counterAmount"));
      if (!Number.isFinite(inputValue) || inputValue < 0) {
        setKaryStatus("Podaj poprawną liczbę.", "error");
        return;
      }
      const deltaValue = Math.floor(inputValue);

      const current = Math.max(0, Math.floor(Number(karyLiveState.counters[counterKey] || 0)));
      karyLiveState.counters[counterKey] = normalizedAction === "set" ? deltaValue : current + deltaValue;
      updateKaryStatsFromStateTransition(previousSnapshot, getKaryStateSnapshot(), { render: false });
      saveKaryState();
      queueKaryStateApiPush();
      renderKaryLiveState();
      setKaryStatus(normalizedAction === "set" ? "Ustawiono licznik." : "Dodano wartość do licznika.", "success");
      sendAdminWebhookEvent(normalizedAction === "set" ? "counter_set" : "counter_add", counterLabel, {
        counterKey,
        counterLabel,
        deltaValue,
        value: Math.max(0, Math.floor(Number(karyLiveState.counters[counterKey] || 0)))
      });
    }

    function applyView(routeName) {
      const isRouteChanged = lastAppliedRouteName !== routeName;
      lastAppliedRouteName = routeName;

      const showObsOverlay = OBS_OVERLAY_MODE;
      const showKary = routeName === "kary";
      const showTimery = routeName === "timery";
      const showLiczniki = routeName === "liczniki";
      const showClips = routeName === "clips";
      const showStats = routeName === "stats" && !showObsOverlay;
      const showHome = routeName === "home";
      const showLogin = routeName === "login" && !showObsOverlay;
      const showAdmin = routeName === "admin" || showObsOverlay;
      if (!showClips) {
        closeClipViewer();
      }

      if (showAdmin && !showObsOverlay && !isAdminAuthenticated) {
        setAdminStatus("Zaloguj się, aby otworzyć panel administratora.", "error");
        navigateTo(LOGIN_ROUTE_PATH, "login");
        return;
      }

      if (showLogin && isAdminAuthenticated) {
        navigateTo(ADMIN_ROUTE_PATH, "admin");
        return;
      }

      if (mainWrapEl) {
        mainWrapEl.hidden = !showClips;
        mainWrapEl.style.display = showClips ? "" : "none";
      }
      if (karyPanelEl) {
        karyPanelEl.hidden = !showKary;
        karyPanelEl.style.display = showKary ? "" : "none";
      }
      if (timeryPanelEl) {
        timeryPanelEl.hidden = !showTimery;
        timeryPanelEl.style.display = showTimery ? "" : "none";
      }
      if (licznikiPanelEl) {
        licznikiPanelEl.hidden = !showLiczniki;
        licznikiPanelEl.style.display = showLiczniki ? "" : "none";
      }
      if (statsPanelEl) {
        statsPanelEl.hidden = !showStats;
        statsPanelEl.style.display = showStats ? "" : "none";
      }
      if (streamShellEl) {
        streamShellEl.style.display = "";
      }
      if (streamLayoutEl) {
        streamLayoutEl.style.display = showHome ? "" : "none";
      }
      if (friendsEl) {
        friendsEl.style.display = showHome ? "" : "none";
      }
      if (adminPanelEl) {
        adminPanelEl.hidden = !showLogin;
      }
      if (adminDashboardEl) {
        adminDashboardEl.hidden = !showAdmin;
      }

      if (document.body) {
        document.body.classList.remove(...ROUTE_BODY_CLASSES);
        document.body.classList.add(`route-${routeName}`);
        document.body.classList.toggle("obs-wheel-overlay", showObsOverlay);
      }

      setActiveNavState(routeName);
      updatePlaceholder(routeName);

      if (showAdmin) {
        renderAdminMembersTable();
        renderAdminAccountsTable();
        renderAdminKaryCennikTable();
        setActiveAdminTab(showObsOverlay ? "streamobs" : activeAdminTab);
      }

      if (showStats) {
        startWheelStatsLiveUpdates();
      } else {
        stopWheelStatsLiveUpdates();
      }

      if (showHome || showKary || showTimery || showLiczniki || showAdmin) {
        renderKaryLiveState();
      }

      if (showTimery) {
        loadTimeryConfig();
        applyTimeryConfig();
      }

      if (showLiczniki) {
        loadLicznikiConfig();
        applyLicznikiConfig();
      }

      if (!IS_FILE_PROTOCOL) {
        if (showTimery && normalizePath(window.location.pathname) !== normalizePath("/timery")) {
          try {
            window.history.replaceState({ view: "timery" }, "", "/timery");
          } catch (_error) {
            // Ignore URL replace failures.
          }
        }
        if (showLiczniki && normalizePath(window.location.pathname) !== normalizePath("/liczniki")) {
          try {
            window.history.replaceState({ view: "liczniki" }, "", "/liczniki");
          } catch (_error) {
            // Ignore URL replace failures.
          }
        }
      }

      if (showClips && !clipsLoadedOnce) {
        clipsLoadedOnce = true;
        loadClips();
      }

      if (showHome && (isRouteChanged || !introTypingPlayed)) {
        const typingScheduled = queueIntroTypingAnimation(0);
        introTypingPlayed = introTypingPlayed || typingScheduled;
      }
      if (showHome) {
        updateFriendsLiveBadges(true);
      }

      if (!showHome) {
        stopIntroTypingAnimation();
      }

      persistLastRoutePath(window.location.pathname);
    }

    function navigateTo(path, routeName) {
      const current = normalizePathAndSearch(`${window.location.pathname}${window.location.search}`);
      const target = normalizePathAndSearch(path);
      const nextRoute = routeName || getRouteFromPath(path);
      const currentRoute = getRouteFromPath(`${window.location.pathname}${window.location.search}${window.location.hash}`);
      const shouldResetScroll = current !== target || currentRoute !== nextRoute;

      if (current !== target) {
        try {
          window.history.pushState({ view: nextRoute }, "", path);
        } catch (_error) {
          window.location.href = path;
          return;
        }

        const afterPush = normalizePathAndSearch(`${window.location.pathname}${window.location.search}`);
        if (afterPush !== target) {
          window.location.href = path;
          return;
        }
      }

      applyView(nextRoute);
      if (shouldResetScroll) {
        scrollToRouteTop();
      }
      persistLastRoutePath(path);
    }

    function getCanonicalRoutePath(routeName) {
      if (routeName === "kary") {
        return KARY_ROUTE_PATH;
      }
      if (routeName === "timery") {
        return TIMERY_ROUTE_PATH;
      }
      if (routeName === "liczniki") {
        return LICZNIKI_ROUTE_PATH;
      }
      if (routeName === "clips") {
        return CLIPS_ROUTE_PATH;
      }
      if (routeName === "soon") {
        return SOON_ROUTE_PATH;
      }
      if (routeName === "stats") {
        return STATS_ROUTE_PATH;
      }
      if (routeName === "login") {
        return LOGIN_ROUTE_PATH;
      }
      if (routeName === "admin") {
        return ADMIN_ROUTE_PATH;
      }
      return HOME_ROUTE_PATH;
    }

    function resolveRouteFromUrl(url) {
      if (!url || typeof url !== "object") {
        return null;
      }

      const path = String(url.pathname || "");
      const search = String(url.search || "");
      const hash = String(url.hash || "");

      const pathRoute = getRouteFromPath(`${path}${search}${hash}`);
      const explicitSearchRoute = getRouteFromSearch(search);
      const explicitHashRoute = getRouteFromHash(hash);
      const normalizedPath = normalizePath(path);
      const normalizedHomePath = normalizePath(HOME_ROUTE_PATH);
      const normalizedHomeDirPath = normalizePath(HOME_ROUTE_PATH.replace(/\/index\.html$/i, ""));
      const isHomePath =
        normalizedPath === normalizedHomePath ||
        normalizedPath === normalizedHomeDirPath ||
        normalizedPath === "/" ||
        normalizedPath.endsWith("/index.html") ||
        normalizedPath.endsWith("/index.htm");
      const isPathRoute =
        /(^|\/)(kary|timery|liczniki|klipy|clips|soon|wkrotce|stats|statystyki|logowanie|login|admin)(\/|$)/i.test(normalizedPath);

      const routeName = explicitSearchRoute || explicitHashRoute || pathRoute;
      if (!routeName) {
        return null;
      }
      if (!isPathRoute && !isHomePath && !explicitSearchRoute && !explicitHashRoute) {
        return null;
      }

      return routeName;
    }

    function bindInternalRouteLinks() {
      document.addEventListener("click", (event) => {
        if (event.defaultPrevented) {
          return;
        }
        if (event.button !== 0) {
          return;
        }
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }

        const clickTarget = event.target;
        if (!clickTarget || typeof clickTarget.closest !== "function") {
          return;
        }

        const link = clickTarget.closest("a[href]");
        if (!link) {
          return;
        }
        if (link.hasAttribute("download")) {
          return;
        }

        const targetAttr = String(link.getAttribute("target") || "").toLowerCase();
        if (targetAttr && targetAttr !== "_self") {
          return;
        }

        let url;
        try {
          url = new URL(link.getAttribute("href"), window.location.href);
        } catch (_error) {
          return;
        }

        if (url.origin !== window.location.origin) {
          return;
        }

        const routeName = resolveRouteFromUrl(url);
        if (!routeName) {
          return;
        }

        event.preventDefault();
        navigateTo(getCanonicalRoutePath(routeName), routeName);
      });
    }

    function setStatus(text, isError = false) {
      statusEl.textContent = text;
      statusEl.classList.toggle("error", isError);
    }

    function escapeHtml(value) {
      return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    function formatViews(views) {
      if (typeof views === "number" && Number.isFinite(views)) {
        return `${views.toLocaleString("pl-PL")} wyswietlen`;
      }

      const clean = String(views ?? "").trim().replace(/\s+/g, " ");
      const match = clean.match(/^([\d.,KkMm]+)\s+views$/i);
      if (match) {
        return `${match[1]} wyswietlen`;
      }
      if (!clean) {
        return "0 wyswietlen";
      }
      if (/^\d+$/.test(clean)) {
        return `${Number(clean).toLocaleString("pl-PL")} wyswietlen`;
      }
      if (/wyswietlen$/i.test(clean)) {
        return clean || "0 wyswietlen";
      }
      return `${clean} wyswietlen`;
    }

    function formatRelativeTime(relativeTime) {
      const clean = String(relativeTime ?? "").trim();
      if (!clean) {
        return "";
      }

      const isoTime = Date.parse(clean);
      if (!Number.isNaN(isoTime)) {
        const diffSeconds = Math.max(0, Math.floor((Date.now() - isoTime) / 1000));
        if (diffSeconds < 60) {
          return "przed chwila";
        }

        const minutes = Math.floor(diffSeconds / 60);
        if (minutes < 60) {
          return `${minutes} min temu`;
        }

        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
          return `${hours} godz. temu`;
        }

        const days = Math.floor(hours / 24);
        if (days < 7) {
          return days === 1 ? "1 dzien temu" : `${days} dni temu`;
        }

        const weeks = Math.floor(days / 7);
        if (weeks < 5) {
          return weeks === 1 ? "1 tydz. temu" : `${weeks} tyg. temu`;
        }

        const months = Math.floor(days / 30);
        return months <= 1 ? "1 mies. temu" : `${months} mies. temu`;
      }

      const match = clean.match(/^(\d+)\s+(day|days|hour|hours|minute|minutes|week|weeks|month|months)\s+ago$/i);
      if (!match) {
        return clean;
      }

      const count = Number(match[1]);
      const unit = match[2].toLowerCase();

      if (unit.startsWith("day")) {
        return count === 1 ? "1 dzien temu" : `${count} dni temu`;
      }
      if (unit.startsWith("hour")) {
        return count === 1 ? "1 godz. temu" : `${count} godz. temu`;
      }
      if (unit.startsWith("minute")) {
        return count === 1 ? "1 min temu" : `${count} min temu`;
      }
      if (unit.startsWith("week")) {
        return count === 1 ? "1 tydz. temu" : `${count} tyg. temu`;
      }
      if (unit.startsWith("month")) {
        return count === 1 ? "1 mies. temu" : `${count} mies. temu`;
      }

      return clean;
    }

    function formatClipCreatedDate(createdAtValue) {
      const clean = String(createdAtValue ?? "").trim();
      if (!clean) {
        return "";
      }

      const parsed = Date.parse(clean);
      if (Number.isNaN(parsed)) {
        return "";
      }

      try {
        return new Intl.DateTimeFormat("pl-PL", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }).format(new Date(parsed));
      } catch (_error) {
        return "";
      }
    }

    function formatDuration(seconds) {
      const totalSeconds = Number(seconds);
      if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
        return "00:00";
      }

      const mins = Math.floor(totalSeconds / 60);
      const secs = Math.floor(totalSeconds % 60);
      return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }

    function shortenCategory(category) {
      const clean = String(category ?? "").trim();
      return clean;
    }

    function extractJsonFromJinaResponse(rawText) {
      const text = String(rawText ?? "").trim();
      if (!text) {
        throw new Error("Pusta odpowiedz proxy.");
      }

      const tryParse = (value) => {
        try {
          return JSON.parse(value);
        } catch (_error) {
          return null;
        }
      };

      const direct = tryParse(text);
      if (direct) {
        return direct;
      }

      const fencedMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      if (fencedMatch && fencedMatch[1]) {
        const fencedParsed = tryParse(fencedMatch[1].trim());
        if (fencedParsed) {
          return fencedParsed;
        }
      }

      const markerCandidates = ["Markdown Content:", "Content:", "content:"];
      for (const marker of markerCandidates) {
        const markerIndex = text.indexOf(marker);
        if (markerIndex === -1) {
          continue;
        }
        const payload = text.slice(markerIndex + marker.length).trim();
        const payloadParsed = tryParse(payload);
        if (payloadParsed) {
          return payloadParsed;
        }
      }

      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const slicedParsed = tryParse(text.slice(jsonStart, jsonEnd + 1));
        if (slicedParsed) {
          return slicedParsed;
        }
      }

      throw new Error("Nieprawidłowy format danych klipów.");
    }

    function buildApiUrl(cursor = "") {
      const params = new URLSearchParams({
        sort: "date",
        range: "month"
      });

      if (cursor) {
        params.set("cursor", cursor);
      }

      return `https://kick.com/api/v2/channels/${CHANNEL_SLUG}/clips?${params.toString()}`;
    }

    function buildLocalApiUrl(cursor = "") {
      const params = new URLSearchParams({
        sort: "date",
        range: "month"
      });

      if (cursor) {
        params.set("cursor", cursor);
      }

      return `${LOCAL_KICK_CLIPS_ENDPOINT}?${params.toString()}`;
    }

    async function fetchDirectKickJson(sourceUrl) {
      const response = await fetch(sourceUrl, {
        mode: "cors",
        cache: "no-store",
        headers: {
          Accept: "application/json"
        }
      });
      if (!response.ok) {
        throw new Error(`KICK_HTTP_${response.status}`);
      }
      return response.json();
    }

    async function fetchLocalKickJson(cursor = "") {
      if (IS_FILE_PROTOCOL) {
        throw new Error("LOCAL_PROXY_UNAVAILABLE_FILE_PROTOCOL");
      }

      const response = await fetch(buildLocalApiUrl(cursor), {
        cache: "no-store",
        headers: {
          Accept: "application/json"
        }
      });
      if (!response.ok) {
        throw new Error(`LOCAL_PROXY_HTTP_${response.status}`);
      }
      const payload = await response.json();
      if (!payload || typeof payload !== "object") {
        throw new Error("LOCAL_PROXY_INVALID_JSON");
      }
      return payload;
    }

    async function fetchJinaJson(sourceUrl) {
      const response = await fetch(`${JINA_PREFIX}${sourceUrl}`, {
        mode: "cors",
        cache: "no-store"
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const rawText = await response.text();
      return extractJsonFromJinaResponse(rawText);
    }

    async function fetchViaProxyJson(sourceUrl, proxyPrefix) {
      const response = await fetch(`${proxyPrefix}${encodeURIComponent(sourceUrl)}`, {
        mode: "cors",
        cache: "no-store",
        headers: {
          Accept: "application/json, text/plain;q=0.9, */*;q=0.8"
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const rawText = await response.text();
      const parsed = extractJsonFromJinaResponse(rawText);
      if (!parsed || typeof parsed !== "object") {
        throw new Error("Niepoprawny format JSON proxy.");
      }
      return parsed;
    }

    async function withClipFetchTimeout(taskFactory, timeoutMs, timeoutLabel) {
      let timeoutId = null;
      try {
        return await Promise.race([
          taskFactory(),
          new Promise((_, reject) => {
            timeoutId = window.setTimeout(() => {
              reject(new Error(`${timeoutLabel}_${timeoutMs}`));
            }, timeoutMs);
          })
        ]);
      } finally {
        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }
      }
    }

    async function fetchClipsPageJson(sourceUrl, cursor = "") {
      const errors = [];

      try {
        return await withClipFetchTimeout(
          () => fetchLocalKickJson(cursor),
          CLIP_SOURCE_TIMEOUT_MS,
          "local_clips_timeout"
        );
      } catch (localError) {
        errors.push(`local:${localError?.message || "fail"}`);
      }

      const remoteAttempts = [
        {
          label: "direct",
          task: () => fetchDirectKickJson(sourceUrl)
        },
        {
          label: "allorigins",
          task: () => fetchViaProxyJson(sourceUrl, ALL_ORIGINS_RAW_PREFIX)
        },
        {
          label: "corsproxy",
          task: () => fetchViaProxyJson(sourceUrl, CORS_PROXY_PREFIX)
        },
        {
          label: "jina",
          task: () => fetchJinaJson(sourceUrl)
        }
      ];

      if (typeof Promise.any === "function") {
        try {
          const winner = await Promise.any(
            remoteAttempts.map((attempt) =>
              withClipFetchTimeout(
                () => attempt.task(),
                CLIP_SOURCE_TIMEOUT_MS,
                `${attempt.label}_clips_timeout`
              )
                .then((payload) => ({ label: attempt.label, payload }))
                .catch((error) => Promise.reject({ label: attempt.label, error }))
            )
          );
          return winner.payload;
        } catch (aggregateError) {
          const reasons = Array.isArray(aggregateError?.errors) ? aggregateError.errors : [];
          reasons.forEach((reason) => {
            const label = String(reason?.label || "remote").trim();
            const message = String(reason?.error?.message || reason?.message || "fail").trim() || "fail";
            errors.push(`${label}:${message}`);
          });
        }
      } else {
        for (const attempt of remoteAttempts) {
          try {
            return await withClipFetchTimeout(
              () => attempt.task(),
              CLIP_SOURCE_TIMEOUT_MS,
              `${attempt.label}_clips_timeout`
            );
          } catch (error) {
            errors.push(`${attempt.label}:${error?.message || "fail"}`);
          }
        }
      }

      throw new Error(errors.join(" | "));
    }

    function normalizeClipMediaUrl(value) {
      const raw = String(value ?? "").trim();
      if (!raw) {
        return "";
      }

      try {
        return new URL(raw, window.location.origin).toString();
      } catch (_error) {
        return raw;
      }
    }

    function isPlayableClipMediaUrl(value) {
      const raw = String(value ?? "").trim().toLowerCase();
      if (!raw) {
        return false;
      }

      const path = raw.split("#")[0].split("?")[0];
      return (
        /\.m3u8$/.test(path) ||
        /\.(mp4|m4v|webm|mov|ts)$/.test(path) ||
        /\/playlist(?:[./]|$)/.test(path) ||
        /\/manifest(?:[./]|$)/.test(path)
      );
    }

    function pickClipPlaybackUrl(apiClip, thumbnail) {
      const candidates = [
        apiClip?.video_url,
        apiClip?.clip_url,
        apiClip?.playback_url,
        apiClip?.playbackUrl,
        apiClip?.playlist_url,
        apiClip?.playlistUrl,
        apiClip?.stream_url,
        apiClip?.streamUrl,
        apiClip?.video?.url,
        apiClip?.media?.url
      ]
        .map(normalizeClipMediaUrl)
        .filter(Boolean);

      const directCandidate = candidates.find(isPlayableClipMediaUrl);
      if (directCandidate) {
        return directCandidate;
      }

      const thumb = String(thumbnail ?? "").trim();
      if (thumb) {
        const derived = normalizeClipMediaUrl(thumb.replace("/thumbnail.webp", "/playlist.m3u8"));
        if (isPlayableClipMediaUrl(derived)) {
          return derived;
        }
      }

      return "";
    }

    function pickFirstNonEmptyString(values) {
      if (!Array.isArray(values)) {
        return "";
      }

      for (const value of values) {
        const normalized = String(value ?? "").trim();
        if (normalized) {
          return normalized;
        }
      }

      return "";
    }

    function normalizeKickSlug(value) {
      const raw = String(value ?? "").trim();
      if (!raw) {
        return "";
      }

      const parsed = getKickSlugFromUrl(raw);
      const cleaned = String(parsed || raw)
        .trim()
        .replace(/^@+/, "")
        .split(/[/?#]/)[0]
        .trim()
        .toLowerCase();
      return cleaned;
    }

    function buildKickProfileUrl(values) {
      if (!Array.isArray(values)) {
        return "";
      }

      for (const value of values) {
        const slug = normalizeKickSlug(value);
        if (slug) {
          return `https://kick.com/${encodeURIComponent(slug)}`;
        }
      }

      return "";
    }

    function resolveClipAuthorData(apiClip, channel, channelSlug) {
      const authorObjects = [
        apiClip?.creator,
        apiClip?.created_by,
        apiClip?.clipper,
        apiClip?.author,
        apiClip?.user,
        apiClip?.owner,
        apiClip?.uploader,
        apiClip?.creator_user,
        apiClip?.clipper_user
      ].filter((entry) => entry && typeof entry === "object");

      const nestedObjects = [];
      authorObjects.forEach((entry) => {
        if (entry.user && typeof entry.user === "object") {
          nestedObjects.push(entry.user);
        }
        if (entry.channel && typeof entry.channel === "object") {
          nestedObjects.push(entry.channel);
        }
      });
      const allAuthorObjects = [...authorObjects, ...nestedObjects];

      const authorName = pickFirstNonEmptyString([
        apiClip?.creator_username,
        apiClip?.created_by_username,
        apiClip?.clipper_username,
        apiClip?.author_name,
        ...allAuthorObjects.map(
          (entry) =>
            entry.username ??
            entry.display_name ??
            entry.displayName ??
            entry.name ??
            entry.login ??
            entry.slug
        ),
        channel?.username,
        channel?.slug,
        channelSlug,
        CHANNEL_SLUG
      ]) || CHANNEL_SLUG;

      const authorUrl = buildKickProfileUrl([
        apiClip?.creator_url,
        apiClip?.created_by_url,
        apiClip?.clipper_url,
        apiClip?.author_url,
        apiClip?.creator_slug,
        apiClip?.created_by_slug,
        apiClip?.clipper_slug,
        apiClip?.author_slug,
        ...allAuthorObjects.map(
          (entry) =>
            entry.channel_url ??
            entry.channelUrl ??
            entry.profile_url ??
            entry.profileUrl ??
            entry.url ??
            entry.href ??
            entry.slug ??
            entry.username
        ),
        authorName,
        channel?.slug,
        channel?.username,
        channelSlug,
        CHANNEL_SLUG
      ]);

      const authorAvatar = pickFirstNonEmptyString([
        apiClip?.creator_avatar,
        apiClip?.author_avatar,
        ...allAuthorObjects.map(
          (entry) =>
            entry.profile_picture ??
            entry.profilePicture ??
            entry.avatar_url ??
            entry.avatarUrl ??
            entry.avatar ??
            entry.picture
        ),
        channel?.profile_picture,
        CHANNEL_AVATAR_FALLBACK
      ]) || CHANNEL_AVATAR_FALLBACK;

      return {
        name: authorName,
        url: authorUrl,
        avatar: authorAvatar
      };
    }

    function mapApiClip(apiClip) {
      if (!apiClip) {
        return null;
      }

      const clipId = apiClip.id || apiClip.clip_id || apiClip.uuid || apiClip.slug || "";
      if (!clipId) {
        return null;
      }

      const channel = apiClip.channel || {};
      const channelSlug = channel.slug || CHANNEL_SLUG;
      const titleRaw = String(apiClip.title ?? "").trim();
      const thumbnail = apiClip.thumbnail_url || apiClip.thumbnail || "";
      const durationSeconds = apiClip.duration ?? apiClip.duration_seconds ?? apiClip.length ?? 0;
      const createdAt = apiClip.created_at || apiClip.createdAt || apiClip.published_at || "";
      const viewCount = apiClip.view_count ?? apiClip.views ?? apiClip.viewers ?? 0;
      const playlistUrl = pickClipPlaybackUrl(apiClip, thumbnail);
      const author = resolveClipAuthorData(apiClip, channel, channelSlug);

      return {
        id: clipId,
        title: !titleRaw || titleRaw === "." ? "Bez tytulu" : titleRaw,
        duration: formatDuration(durationSeconds),
        views: viewCount,
        category: apiClip.category?.name || "",
        createdAt,
        pageUrl: `https://kick.com/${channelSlug}/clips/${clipId}`,
        thumbnail,
        playlistUrl,
        authorName: author.name,
        authorUrl: author.url,
        authorAvatar: author.avatar
      };
    }

    async function fetchAllClips(maxPages = 40, maxClips = CLIPS_MAX_ITEMS) {
      const allClips = [];
      const seenIds = new Set();
      const clipsLimit = Math.max(1, Math.floor(Number(maxClips) || CLIPS_MAX_ITEMS));
      let cursor = "";

      for (let page = 1; page <= maxPages; page += 1) {
        let data;
        try {
          data = await fetchClipsPageJson(buildApiUrl(cursor), cursor);
        } catch (error) {
          if (allClips.length > 0) {
            return { clips: allClips, partial: true };
          }
          throw error;
        }

        const pageItems = Array.isArray(data?.clips)
          ? data.clips
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data)
              ? data
              : [];
        const mapped = pageItems.map(mapApiClip).filter(Boolean);
        let added = 0;

        for (const clip of mapped) {
          if (seenIds.has(clip.id)) {
            continue;
          }
          seenIds.add(clip.id);
          allClips.push(clip);
          added += 1;

          if (allClips.length >= clipsLimit) {
            setStatus(`Pobieram klipy... ${allClips.length}/${clipsLimit}`);
            return { clips: allClips.slice(0, clipsLimit), partial: true, reachedLimit: true };
          }
        }

        setStatus(`Pobieram klipy... ${allClips.length}/${clipsLimit}`);

        const nextCursor = String(
          data?.nextCursor ??
          data?.next_cursor ??
          data?.cursor ??
          data?.pagination?.nextCursor ??
          ""
        ).trim();
        if (!nextCursor || nextCursor === cursor || mapped.length === 0 || added === 0) {
          return { clips: allClips, partial: false };
        }
        cursor = nextCursor;

        await new Promise((resolve) => setTimeout(resolve, 20));
      }

      return { clips: allClips, partial: true, reachedLimit: false };
    }

    function sanitizeFileName(name) {
      const safe = String(name ?? "clip")
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      return (safe || "clip").slice(0, 80);
    }

    async function resolveBestPlaylist(playlistUrl) {
      let currentUrl = playlistUrl;

      for (let depth = 0; depth < 4; depth += 1) {
        const response = await fetch(currentUrl, { mode: "cors", cache: "no-store" });
        if (!response.ok) {
          throw new Error(`PLAYLIST_HTTP_${response.status}`);
        }

        const text = await response.text();
        const lines = text.replace(/\r/g, "").split("\n").map((line) => line.trim());
        const hasVariants = lines.some((line) => line.startsWith("#EXT-X-STREAM-INF"));
        if (!hasVariants) {
          return { url: currentUrl, text };
        }

        let bestVariantUrl = "";
        let bestBandwidth = -1;

        for (let i = 0; i < lines.length; i += 1) {
          const line = lines[i];
          if (!line.startsWith("#EXT-X-STREAM-INF")) {
            continue;
          }

          const next = lines[i + 1] ? lines[i + 1].trim() : "";
          if (!next || next.startsWith("#")) {
            continue;
          }

          const bwMatch = line.match(/BANDWIDTH=(\d+)/i);
          const bandwidth = bwMatch ? Number(bwMatch[1]) : 0;
          if (bandwidth > bestBandwidth) {
            bestBandwidth = bandwidth;
            bestVariantUrl = new URL(next, currentUrl).href;
          }
        }

        if (!bestVariantUrl) {
          return { url: currentUrl, text };
        }

        currentUrl = bestVariantUrl;
      }

      throw new Error("PLAYLIST_RESOLVE_FAILED");
    }

    function parseByteRange(rawValue) {
      const match = String(rawValue ?? "").trim().match(/^(\d+)(?:@(\d+))?$/);
      if (!match) {
        return null;
      }

      return {
        length: Number(match[1]),
        offset: match[2] ? Number(match[2]) : null
      };
    }

    function parseSegmentsFromMediaPlaylist(playlistText, playlistUrl) {
      const lines = playlistText.replace(/\r/g, "").split("\n").map((line) => line.trim());
      const segments = [];
      const nextOffsetByUrl = new Map();
      let pendingRange = null;

      for (const line of lines) {
        if (!line) {
          continue;
        }

        if (line.startsWith("#EXT-X-BYTERANGE:")) {
          pendingRange = parseByteRange(line.slice("#EXT-X-BYTERANGE:".length));
          continue;
        }

        if (line.startsWith("#")) {
          continue;
        }

        const segmentUrl = new URL(line, playlistUrl).href;
        let range = null;

        if (pendingRange) {
          const start = pendingRange.offset ?? (nextOffsetByUrl.get(segmentUrl) ?? 0);
          const end = start + pendingRange.length - 1;
          range = { start, end };
          nextOffsetByUrl.set(segmentUrl, end + 1);
          pendingRange = null;
        } else {
          nextOffsetByUrl.delete(segmentUrl);
        }

        segments.push({ url: segmentUrl, range });
      }

      return segments;
    }

    async function fetchSegmentBytes(segment) {
      const headers = {};
      if (segment.range) {
        headers.Range = `bytes=${segment.range.start}-${segment.range.end}`;
      }

      const response = await fetch(segment.url, {
        mode: "cors",
        cache: "no-store",
        headers
      });

      if (!response.ok) {
        throw new Error(`SEGMENT_HTTP_${response.status}`);
      }

      const data = await response.arrayBuffer();
      return new Uint8Array(data);
    }

    function downloadBlob(blob, fileName) {
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
    }

    async function downloadClipBestQuality(payload, button) {
      const clipId = String(payload?.id ?? "");
      const clipTitle = String(payload?.title ?? "clip");
      const playlistUrl = String(payload?.playlistUrl ?? "").trim();

      if (!clipId || !playlistUrl) {
        throw new Error("MISSING_DOWNLOAD_DATA");
      }

      if (downloadInProgress.has(clipId)) {
        return;
      }
      downloadInProgress.add(clipId);

      const originalLabel = button ? button.textContent : "";
      if (button) {
        button.disabled = true;
        button.textContent = "Pobieranie...";
      }

      try {
        setStatus(`Pobieram klip: ${clipTitle}...`);

        const bestPlaylist = await resolveBestPlaylist(playlistUrl);
        const segments = parseSegmentsFromMediaPlaylist(bestPlaylist.text, bestPlaylist.url);
        if (!segments.length) {
          throw new Error("NO_SEGMENTS");
        }

        const chunks = [];
        for (let i = 0; i < segments.length; i += 1) {
          const chunk = await fetchSegmentBytes(segments[i]);
          chunks.push(chunk);

          if (i === 0 || i === segments.length - 1 || (i + 1) % 4 === 0) {
            setStatus(`Pobieram klip: ${i + 1}/${segments.length}`);
          }
        }

        const blob = new Blob(chunks, { type: "video/mp2t" });
        const fileName = `${sanitizeFileName(clipTitle || clipId)}.ts`;
        downloadBlob(blob, fileName);
        setStatus(`Pobrano klip: ${clipTitle}`);
      } finally {
        downloadInProgress.delete(clipId);

        if (button) {
          button.disabled = false;
          button.textContent = originalLabel || "Pobierz";
        }
      }
    }

    async function attachStream(video) {
      if (video.dataset.ready === "1") {
        return true;
      }

      const source = String(video.dataset.src ?? "").trim();
      if (!source) {
        setStatus("Ten klip nie ma bezpośredniego linku do odtworzenia na stronie.", true);
        return false;
      }

      video.setAttribute("crossorigin", "anonymous");

      const sourcePath = source.toLowerCase().split("#")[0].split("?")[0];
      const isDirectVideoFile = /\.(mp4|m4v|webm|mov|ts)$/.test(sourcePath);
      if (isDirectVideoFile) {
        video.src = source;
        video.dataset.ready = "1";
        return true;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        video.dataset.ready = "1";
        return true;
      }

      if (window.Hls && window.Hls.isSupported()) {
        return new Promise((resolve, reject) => {
          try {
            if (video._hls && typeof video._hls.destroy === "function") {
              video._hls.destroy();
            }

            const hls = new window.Hls({
              enableWorker: true,
              lowLatencyMode: false,
              startLevel: 0,
              testBandwidth: false,
              capLevelToPlayerSize: true,
              maxBufferLength: 14,
              backBufferLength: 35
            });

            const onManifest = () => {
              hls.off(window.Hls.Events.MANIFEST_PARSED, onManifest);
              hls.off(window.Hls.Events.ERROR, onError);
              video.dataset.ready = "1";
              resolve(true);
            };

            const onError = (_event, data) => {
              if (!data?.fatal) {
                return;
              }
              hls.off(window.Hls.Events.MANIFEST_PARSED, onManifest);
              hls.off(window.Hls.Events.ERROR, onError);
              hls.destroy();
              video._hls = null;
              reject(new Error(data.type || "HLS_FATAL"));
            };

            hls.on(window.Hls.Events.MANIFEST_PARSED, onManifest);
            hls.on(window.Hls.Events.ERROR, onError);
            hls.loadSource(source);
            hls.attachMedia(video);
            video._hls = hls;
          } catch (error) {
            reject(error);
          }
        });
      }

      video.src = source;
      video.dataset.ready = "1";
      return true;
    }

    function formatPlaybackTimeLabel(seconds, fallback = "0:00") {
      const numeric = Number(seconds);
      if (!Number.isFinite(numeric) || numeric < 0) {
        return fallback;
      }

      const totalSeconds = Math.max(0, Math.floor(numeric));
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;
      if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
      }
      return `${minutes}:${String(secs).padStart(2, "0")}`;
    }

    const CLIP_VIEWER_BUTTON_ICONS = Object.freeze({
      play:
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 5v14l11-7z"></path></svg>',
      pause:
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M7 5h4v14H7zM13 5h4v14h-4z"></path></svg>',
      volume:
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M3 10v4h4l5 4V6l-5 4H3z"></path><path fill="currentColor" d="M14.4 4.2v2.1A7 7 0 0 1 19 12a7 7 0 0 1-4.6 5.7v2.1A9.3 9.3 0 0 0 21.2 12a9.3 9.3 0 0 0-6.8-7.8z"></path></svg>',
      muted:
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M3 10v4h4l5 4V6l-5 4H3z"></path><path d="M16 9l5 5M21 9l-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>',
      fullscreen:
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M4 10V4h6v2H6v4H4zm10-6h6v6h-2V6h-4V4zM4 14h2v4h4v2H4v-6zm14 4v-4h2v6h-6v-2h4z"></path></svg>'
    });

    function setClipViewerButtonIcon(buttonEl, iconName) {
      if (!buttonEl) {
        return;
      }
      const iconMarkup = CLIP_VIEWER_BUTTON_ICONS[iconName] || "";
      buttonEl.innerHTML = iconMarkup;
    }

    function clearClipViewerAutoHideTimer(state) {
      if (!state || !state.autoHideTimerId) {
        return;
      }
      window.clearTimeout(state.autoHideTimerId);
      state.autoHideTimerId = 0;
    }

    function setClipViewerUiHidden(state, hidden) {
      if (!state || !state.root) {
        return;
      }
      state.root.classList.toggle("is-ui-hidden", Boolean(hidden));
    }

    function shouldAutoHideClipViewerUi(state) {
      if (!state || !state.video || !state.root || state.root.hidden) {
        return false;
      }
      if (state.root.getAttribute("aria-hidden") === "true") {
        return false;
      }
      if (state.video.paused || state.video.ended) {
        return false;
      }
      if (state.controls && typeof state.controls.matches === "function" && state.controls.matches(":hover")) {
        return false;
      }
      if (state.controls && state.controls.contains(document.activeElement)) {
        return false;
      }
      return true;
    }

    function scheduleClipViewerAutoHide(state) {
      clearClipViewerAutoHideTimer(state);
      if (!shouldAutoHideClipViewerUi(state)) {
        setClipViewerUiHidden(state, false);
        return;
      }

      state.autoHideTimerId = window.setTimeout(() => {
        if (!shouldAutoHideClipViewerUi(state)) {
          setClipViewerUiHidden(state, false);
          return;
        }
        setClipViewerUiHidden(state, true);
      }, CLIP_VIEWER_AUTO_HIDE_DELAY_MS);
    }

    function revealClipViewerUi(state, shouldReschedule = true) {
      if (!state) {
        return;
      }
      setClipViewerUiHidden(state, false);
      if (shouldReschedule) {
        scheduleClipViewerAutoHide(state);
      }
    }

    function resetClipViewerVideo(videoEl) {
      if (!videoEl) {
        return;
      }
      try {
        videoEl.pause();
      } catch (_error) {
        // Ignore pause failures.
      }
      if (videoEl._hls && typeof videoEl._hls.destroy === "function") {
        try {
          videoEl._hls.destroy();
        } catch (_error) {
          // Ignore HLS destroy failures.
        }
        videoEl._hls = null;
      }
      videoEl.removeAttribute("src");
      delete videoEl.dataset.ready;
      try {
        videoEl.load();
      } catch (_error) {
        // Ignore media reset failures.
      }
    }

    function syncClipViewerPlayUi(state) {
      if (!state || !state.video) {
        return;
      }
      const isPlaying = !state.video.paused && !state.video.ended;
      state.root.classList.toggle("is-playing", isPlaying);

      if (state.toggleBtn) {
        state.toggleBtn.dataset.state = isPlaying ? "pause" : "play";
        state.toggleBtn.setAttribute("aria-label", isPlaying ? "Pauza" : "Start");
        setClipViewerButtonIcon(state.toggleBtn, isPlaying ? "pause" : "play");
      }

      if (isPlaying) {
        scheduleClipViewerAutoHide(state);
      } else {
        clearClipViewerAutoHideTimer(state);
        setClipViewerUiHidden(state, false);
      }
    }

    function syncClipViewerMuteUi(state) {
      if (!state || !state.video) {
        return;
      }
      const rawVolume = Number(state.video.volume);
      const safeVolume = Number.isFinite(rawVolume) ? Math.max(0, Math.min(1, rawVolume)) : 1;
      const isMuted = Boolean(state.video.muted || safeVolume <= 0.01);

      if (state.muteBtn) {
        state.muteBtn.dataset.state = isMuted ? "muted" : "volume";
        state.muteBtn.setAttribute("aria-label", isMuted ? "Wlacz dzwiek" : "Wycisz");
        setClipViewerButtonIcon(state.muteBtn, isMuted ? "muted" : "volume");
      }

      if (state.volumeSliderEl) {
        const sliderValue = isMuted ? 0 : Math.round(safeVolume * 100);
        state.volumeSliderEl.value = String(sliderValue);
        state.volumeSliderEl.setAttribute("aria-valuenow", String(sliderValue));
      }
    }

    function syncClipViewerTimeUi(state) {
      if (!state || !state.video) {
        return;
      }
      const duration = Number(state.video.duration);
      const current = Number(state.video.currentTime);
      const hasDuration = Number.isFinite(duration) && duration > 0;
      const safeCurrent = Number.isFinite(current) && current > 0 ? current : 0;
      const fallbackDuration = String(state.video.dataset.durationLabel || "0:00").trim() || "0:00";

      if (state.timeCurrentEl) {
        state.timeCurrentEl.textContent = formatPlaybackTimeLabel(safeCurrent, "0:00");
      }
      if (state.timeTotalEl) {
        state.timeTotalEl.textContent = hasDuration
          ? formatPlaybackTimeLabel(duration, fallbackDuration)
          : fallbackDuration;
      }
      if (state.progressEl) {
        if (hasDuration) {
          const progress = Math.max(0, Math.min(1000, Math.round((safeCurrent / duration) * 1000)));
          state.progressEl.disabled = false;
          state.progressEl.value = String(progress);
        } else {
          state.progressEl.disabled = true;
          state.progressEl.value = "0";
        }
      }
    }

    function syncClipViewerControls(state) {
      syncClipViewerPlayUi(state);
      syncClipViewerMuteUi(state);
      syncClipViewerTimeUi(state);
    }

    function seekClipViewerFromProgress(state) {
      if (!state || !state.video || !state.progressEl) {
        return;
      }
      const duration = Number(state.video.duration);
      if (!Number.isFinite(duration) || duration <= 0) {
        return;
      }
      const ratio = Math.max(0, Math.min(1, Number(state.progressEl.value || "0") / 1000));
      state.video.currentTime = ratio * duration;
      syncClipViewerTimeUi(state);
    }

    function applyClipViewerVolumeFromSlider(state) {
      if (!state || !state.video || !state.volumeSliderEl) {
        return;
      }
      const numeric = Math.max(0, Math.min(100, Math.round(Number(state.volumeSliderEl.value || "0"))));
      const nextVolume = numeric / 100;
      state.video.volume = nextVolume;
      state.video.muted = nextVolume <= 0.01;
      if (nextVolume > 0.01) {
        state.video.dataset.lastVolume = String(nextVolume);
      }
      syncClipViewerMuteUi(state);
    }

    async function toggleClipViewerPlayback(state) {
      if (!state || !state.video) {
        return;
      }
      if (state.video.paused || state.video.ended) {
        try {
          const ready = await attachStream(state.video);
          if (!ready) {
            syncClipViewerControls(state);
            return;
          }
          await state.video.play();
        } catch (_error) {
          syncClipViewerControls(state);
          return;
        }
      } else {
        state.video.pause();
      }
      syncClipViewerControls(state);
    }

    async function toggleClipViewerFullscreen(state) {
      if (!state || !state.video) {
        return;
      }
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
          return;
        }
        const target = state.video.closest(".clip-viewer-main") || state.video;
        if (target && typeof target.requestFullscreen === "function") {
          await target.requestFullscreen();
        }
      } catch (_error) {
        // Ignore fullscreen API errors.
      }
    }

    function ensureClipViewer() {
      if (clipViewerState) {
        return clipViewerState;
      }

      const root = document.createElement("section");
      root.className = "clip-viewer-modal";
      root.hidden = true;
      root.setAttribute("aria-hidden", "true");
      root.innerHTML = `
        <div class="clip-viewer-dialog" role="dialog" aria-modal="true" aria-label="Podglad klipu">
          <div class="clip-viewer-main">
            <video class="clip-viewer-video" preload="none" playsinline></video>
            <div class="clip-viewer-top">
              <p class="clip-viewer-top-meta"></p>
            </div>
            <div class="clip-viewer-controls" aria-label="Sterowanie podgladu klipu">
              <button class="clip-viewer-control-btn clip-viewer-control-toggle" type="button" data-state="play" aria-label="Start">
              </button>
              <span class="clip-viewer-control-time">
                <span class="clip-viewer-time-current">0:00</span>
                <span class="clip-viewer-time-sep">/</span>
                <span class="clip-viewer-time-total">0:00</span>
              </span>
              <input class="clip-viewer-control-progress" type="range" min="0" max="1000" step="1" value="0" aria-label="Postep klipu">
              <div class="clip-viewer-volume-wrap">
                <button class="clip-viewer-control-btn clip-viewer-control-volume" type="button" data-state="volume" aria-label="Wycisz">
                </button>
                <input class="clip-viewer-control-volume-slider" type="range" min="0" max="100" step="1" value="100" aria-label="Glosnosc 0 do 100">
              </div>
              <button class="clip-viewer-control-btn clip-viewer-control-fullscreen" type="button" aria-label="Caly ekran">
              </button>
            </div>
          </div>
          <aside class="clip-viewer-side" aria-label="Szczegoly klipu">
            <div class="clip-viewer-author">
              <img class="clip-viewer-avatar" src="" alt="">
              <div class="clip-viewer-author-copy">
                <p class="clip-viewer-name"></p>
                <a class="clip-viewer-title clip-viewer-author-link" href="#" target="_blank" rel="noopener noreferrer"></a>
              </div>
            </div>
            <div class="clip-viewer-meta" aria-label="Informacje o klipie">
              <p class="clip-viewer-meta-item">
                <span class="clip-viewer-meta-label">Utworzono:</span>
                <span class="clip-viewer-meta-value clip-viewer-meta-created"></span>
              </p>
              <p class="clip-viewer-meta-item">
                <span class="clip-viewer-meta-label">Gra/Kategoria:</span>
                <span class="clip-viewer-meta-value clip-viewer-meta-category"></span>
              </p>
            </div>
            <a class="clip-viewer-open-kick" href="#" target="_blank" rel="noopener noreferrer">
              Zobacz caly film
            </a>
          </aside>
        </div>
      `;

      document.body.appendChild(root);

      const state = {
        root,
        main: root.querySelector(".clip-viewer-main"),
        video: root.querySelector(".clip-viewer-video"),
        topMeta: root.querySelector(".clip-viewer-top-meta"),
        controls: root.querySelector(".clip-viewer-controls"),
        toggleBtn: root.querySelector(".clip-viewer-control-toggle"),
        muteBtn: root.querySelector(".clip-viewer-control-volume"),
        volumeSliderEl: root.querySelector(".clip-viewer-control-volume-slider"),
        fullBtn: root.querySelector(".clip-viewer-control-fullscreen"),
        progressEl: root.querySelector(".clip-viewer-control-progress"),
        timeCurrentEl: root.querySelector(".clip-viewer-time-current"),
        timeTotalEl: root.querySelector(".clip-viewer-time-total"),
        avatar: root.querySelector(".clip-viewer-avatar"),
        name: root.querySelector(".clip-viewer-name"),
        title: root.querySelector(".clip-viewer-author-link"),
        metaCreatedEl: root.querySelector(".clip-viewer-meta-created"),
        metaCategoryEl: root.querySelector(".clip-viewer-meta-category"),
        openKickLink: root.querySelector(".clip-viewer-open-kick"),
        autoHideTimerId: 0
      };

      root.addEventListener("click", (event) => {
        if (event.target === root) {
          event.preventDefault();
          closeClipViewer();
        }
      });

      document.addEventListener("keydown", (event) => {
        if (state.root.hidden) {
          return;
        }
        if (event.key === "Escape") {
          closeClipViewer();
          return;
        }
        revealClipViewerUi(state);
      });

      if (state.toggleBtn) {
        state.toggleBtn.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          void toggleClipViewerPlayback(state);
        });
      }

      if (state.muteBtn) {
        state.muteBtn.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          const isMutedNow = Boolean(state.video.muted || Number(state.video.volume) <= 0.01);
          if (isMutedNow) {
            const storedVolume = Number(state.video.dataset.lastVolume || "");
            const restoreVolume =
              Number.isFinite(storedVolume) && storedVolume > 0
                ? Math.max(0.05, Math.min(1, storedVolume))
                : 1;
            state.video.muted = false;
            state.video.volume = restoreVolume;
          } else {
            const currentVolume = Number(state.video.volume);
            if (Number.isFinite(currentVolume) && currentVolume > 0.01) {
              state.video.dataset.lastVolume = String(Math.max(0, Math.min(1, currentVolume)));
            }
            state.video.muted = true;
          }
          syncClipViewerMuteUi(state);
        });
      }

      if (state.volumeSliderEl) {
        state.volumeSliderEl.addEventListener("input", () => {
          applyClipViewerVolumeFromSlider(state);
        });
        state.volumeSliderEl.addEventListener("change", () => {
          applyClipViewerVolumeFromSlider(state);
        });
      }

      if (state.fullBtn) {
        setClipViewerButtonIcon(state.fullBtn, "fullscreen");
        state.fullBtn.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          void toggleClipViewerFullscreen(state);
        });
      }

      if (state.progressEl) {
        state.progressEl.addEventListener("input", () => {
          seekClipViewerFromProgress(state);
        });
        state.progressEl.addEventListener("change", () => {
          seekClipViewerFromProgress(state);
        });
      }

      const handleViewerActivity = () => {
        revealClipViewerUi(state);
      };

      if (state.main) {
        state.main.addEventListener("pointermove", handleViewerActivity, { passive: true });
        state.main.addEventListener("pointerdown", handleViewerActivity);
        state.main.addEventListener("touchstart", handleViewerActivity, { passive: true });
        state.main.addEventListener("mouseenter", handleViewerActivity, { passive: true });
      }

      if (state.controls) {
        state.controls.addEventListener("pointerenter", () => {
          revealClipViewerUi(state, false);
        });
        state.controls.addEventListener("pointerleave", () => {
          scheduleClipViewerAutoHide(state);
        });
        state.controls.addEventListener("focusin", () => {
          revealClipViewerUi(state, false);
        });
        state.controls.addEventListener("focusout", () => {
          window.setTimeout(() => {
            scheduleClipViewerAutoHide(state);
          }, 0);
        });
      }

      state.video.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        revealClipViewerUi(state);
        void toggleClipViewerPlayback(state);
      });
      state.video.addEventListener("play", () => {
        syncClipViewerPlayUi(state);
      });
      state.video.addEventListener("pause", () => {
        syncClipViewerPlayUi(state);
      });
      state.video.addEventListener("ended", () => {
        syncClipViewerControls(state);
      });
      state.video.addEventListener("loadedmetadata", () => {
        syncClipViewerTimeUi(state);
      });
      state.video.addEventListener("durationchange", () => {
        syncClipViewerTimeUi(state);
      });
      state.video.addEventListener("timeupdate", () => {
        syncClipViewerTimeUi(state);
      });
      state.video.addEventListener("volumechange", () => {
        syncClipViewerMuteUi(state);
      });

      syncClipViewerControls(state);
      revealClipViewerUi(state, false);

      clipViewerState = state;
      return state;
    }

    function closeClipViewer() {
      if (!clipViewerState || clipViewerState.root.hidden) {
        return;
      }

      clipViewerOpenSeq += 1;
      const state = clipViewerState;
      clearClipViewerAutoHideTimer(state);
      setClipViewerUiHidden(state, false);
      state.root.classList.remove("is-open");
      state.root.setAttribute("aria-hidden", "true");
      if (document.body) {
        document.body.classList.remove("clip-viewer-open");
      }

      window.setTimeout(() => {
        if (state.root.getAttribute("aria-hidden") === "true") {
          state.root.hidden = true;
        }
      }, 170);

      resetClipViewerVideo(state.video);
      syncClipViewerControls(state);
    }

    async function openClipViewerFromCard(card) {
      if (!card) {
        return;
      }

      const viewer = ensureClipViewer();
      const cardVideo = card.querySelector(".clip-player");
      const source = String(cardVideo?.dataset.src || "").trim();
      if (!source) {
        return;
      }

      const topMetaText = String(card.querySelector(".clip-top-meta")?.textContent || "").trim();
      const authorName = String(card.querySelector(".clip-author")?.textContent || CHANNEL_SLUG).trim();
      const authorProfileUrl = String(card.querySelector(".clip-author")?.getAttribute("href") || "").trim() ||
        buildKickProfileUrl([authorName, CHANNEL_SLUG]) ||
        `https://kick.com/${encodeURIComponent(CHANNEL_SLUG)}`;
      const clipTitle = String(card.querySelector(".clip-title")?.textContent || "").trim();
      const avatarSrc = String(card.querySelector(".clip-avatar")?.getAttribute("src") || CHANNEL_AVATAR_FALLBACK).trim();
      const clipPageUrl = String(cardVideo?.dataset.clip || card.querySelector(".clip-title")?.getAttribute("href") || "#").trim() || "#";
      const categoryLabel = String(
        cardVideo?.dataset.categoryLabel ||
        card.querySelector(".clip-meta-category")?.textContent ||
        "Klip"
      ).trim() || "Klip";
      const createdRelative = String(
        cardVideo?.dataset.createdRelative ||
        card.querySelector(".clip-meta-time")?.textContent ||
        ""
      ).trim();
      const createdAbsolute = formatClipCreatedDate(cardVideo?.dataset.createdAt || "");
      const createdLabel = createdRelative && createdAbsolute
        ? `${createdRelative} (${createdAbsolute})`
        : createdRelative || createdAbsolute || "Brak danych";

      if (clipsEl) {
        const allCardVideos = clipsEl.querySelectorAll(".clip-player");
        allCardVideos.forEach((item) => {
          if (item && !item.paused) {
            try {
              item.pause();
            } catch (_error) {
              // Ignore pause failures.
            }
          }
        });
      }

      clipViewerOpenSeq += 1;
      const currentOpenSeq = clipViewerOpenSeq;

      resetClipViewerVideo(viewer.video);
      viewer.video.poster = String(cardVideo?.getAttribute("poster") || cardVideo?.dataset.poster || "").trim();
      viewer.video.dataset.src = source;
      viewer.video.dataset.clip = clipPageUrl;
      viewer.video.dataset.durationLabel = String(cardVideo?.dataset.durationLabel || "0:00");
      viewer.video.controls = false;
      viewer.video.removeAttribute("controls");
      const sliderInitialVolume = viewer.volumeSliderEl
        ? Math.max(0, Math.min(1, Number(viewer.volumeSliderEl.value || "100") / 100))
        : 1;
      viewer.video.volume = Number.isFinite(sliderInitialVolume) ? sliderInitialVolume : 1;
      viewer.video.muted = viewer.video.volume <= 0.01;
      if (viewer.video.volume > 0.01) {
        viewer.video.dataset.lastVolume = String(viewer.video.volume);
      }

      viewer.topMeta.textContent = topMetaText;
      viewer.avatar.src = avatarSrc;
      viewer.avatar.alt = authorName;
      viewer.name.textContent = clipTitle || topMetaText || "Klip";
      if (viewer.title) {
        viewer.title.textContent = authorName || CHANNEL_SLUG;
        viewer.title.href = authorProfileUrl;
      }
      if (viewer.metaCreatedEl) {
        viewer.metaCreatedEl.textContent = createdLabel;
      }
      if (viewer.metaCategoryEl) {
        viewer.metaCategoryEl.textContent = categoryLabel;
      }
      viewer.openKickLink.href = clipPageUrl;
      syncClipViewerControls(viewer);
      clearClipViewerAutoHideTimer(viewer);
      setClipViewerUiHidden(viewer, false);

      viewer.root.hidden = false;
      viewer.root.setAttribute("aria-hidden", "false");
      if (document.body) {
        document.body.classList.add("clip-viewer-open");
      }
      window.requestAnimationFrame(() => {
        viewer.root.classList.add("is-open");
      });
      revealClipViewerUi(viewer, false);

      try {
        const ready = await attachStream(viewer.video);
        if (!ready || currentOpenSeq !== clipViewerOpenSeq || viewer.root.hidden) {
          return;
        }
        try {
          await viewer.video.play();
        } catch (_error) {
          // Autoplay can be blocked by browser.
        }
        syncClipViewerControls(viewer);
      } catch (_error) {
        if (currentOpenSeq === clipViewerOpenSeq) {
          setStatus("Nie udalo sie odtworzyc klipu w podgladzie.", true);
        }
        syncClipViewerControls(viewer);
      }
    }

    function bindPlayers() {
      if (!menuOutsideCloserBound) {
        document.addEventListener("click", (event) => {
          const detailsNodes = document.querySelectorAll(".clip-actions[open]");
          detailsNodes.forEach((node) => {
            if (!node.contains(event.target)) {
              node.open = false;
            }
          });
        });
        menuOutsideCloserBound = true;
      }

      const cards = clipsEl.querySelectorAll(".clip-card");
      cards.forEach((card) => {
        if (card.dataset.playerBound === "1") {
          return;
        }
        card.dataset.playerBound = "1";

        const video = card.querySelector(".clip-player");
        const btn = card.querySelector(".clip-play");
        const toggleBtn = card.querySelector(".clip-control-toggle");
        const muteBtn = card.querySelector(".clip-control-mute");
        const fullBtn = card.querySelector(".clip-control-full");
        const progressEl = card.querySelector(".clip-control-progress");
        const currentTimeEl = card.querySelector(".clip-time-current");
        const totalTimeEl = card.querySelector(".clip-time-total");
        const downloadBtn = card.querySelector(".clip-action-download");

        if (!video || !btn) {
          return;
        }

        card.addEventListener("pointerenter", () => {
          applyClipPoster(video);
        }, { passive: true });
        card.addEventListener("focusin", () => {
          applyClipPoster(video);
        });

        const fallbackDuration = String(video.dataset.durationLabel || "0:00").trim() || "0:00";
        video.controls = false;
        video.removeAttribute("controls");

        const syncPlayUi = () => {
          const isPlaying = !video.paused && !video.ended;
          card.classList.toggle("is-playing", isPlaying);
          btn.classList.toggle("is-hidden", isPlaying);
          if (toggleBtn) {
            toggleBtn.dataset.state = isPlaying ? "pause" : "play";
            toggleBtn.setAttribute("aria-label", isPlaying ? "Pauza" : "Odtworz");
            const toggleIcon = toggleBtn.querySelector("i");
            if (toggleIcon) {
              toggleIcon.className = isPlaying ? "fas fa-pause" : "fas fa-play";
            }
          }
        };

        const syncMuteUi = () => {
          if (!muteBtn) {
            return;
          }
          const isMuted = Boolean(video.muted || Number(video.volume) <= 0.01);
          muteBtn.dataset.state = isMuted ? "muted" : "volume";
          muteBtn.setAttribute("aria-label", isMuted ? "Wlacz dzwiek" : "Wycisz");
          const muteIcon = muteBtn.querySelector("i");
          if (muteIcon) {
            muteIcon.className = isMuted ? "fas fa-volume-mute" : "fas fa-volume-up";
          }
        };

        const syncTimeUi = () => {
          const duration = Number(video.duration);
          const current = Number(video.currentTime);
          const hasDuration = Number.isFinite(duration) && duration > 0;
          const safeCurrent = Number.isFinite(current) && current > 0 ? current : 0;

          if (currentTimeEl) {
            currentTimeEl.textContent = formatPlaybackTimeLabel(safeCurrent, "0:00");
          }
          if (totalTimeEl) {
            totalTimeEl.textContent = hasDuration
              ? formatPlaybackTimeLabel(duration, fallbackDuration)
              : fallbackDuration;
          }
          if (progressEl) {
            if (hasDuration) {
              const progress = Math.max(0, Math.min(1000, Math.round((safeCurrent / duration) * 1000)));
              progressEl.disabled = false;
              progressEl.value = String(progress);
            } else {
              progressEl.disabled = true;
              progressEl.value = "0";
            }
          }
        };

        const seekFromProgress = () => {
          if (!progressEl) {
            return;
          }
          const duration = Number(video.duration);
          if (!Number.isFinite(duration) || duration <= 0) {
            return;
          }
          const ratio = Math.max(0, Math.min(1, Number(progressEl.value || "0") / 1000));
          video.currentTime = ratio * duration;
          syncTimeUi();
        };

        const playNow = async () => {
          try {
            const ready = await attachStream(video);
            if (!ready) {
              card.classList.remove("is-playing");
              btn.classList.remove("is-hidden");
              syncPlayUi();
              return;
            }
            card.classList.add("is-ready");
            await video.play();
            syncPlayUi();
            syncTimeUi();
          } catch (error) {
            card.classList.remove("is-playing");
            btn.classList.remove("is-hidden");
            syncPlayUi();
            setStatus(
              "Nie udalo sie odtworzyc klipu na stronie. Uzyj opcji \"Otworz na Kick\" z menu (...).",
              true
            );
          }
        };

        const togglePlayback = async () => {
          if (video.paused || video.ended) {
            await playNow();
            return;
          }
          video.pause();
          syncPlayUi();
        };

        btn.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          void openClipViewerFromCard(card);
        });
        if (toggleBtn) {
          toggleBtn.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            void openClipViewerFromCard(card);
          });
        }
        video.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          void openClipViewerFromCard(card);
        });
        video.addEventListener("play", syncPlayUi);
        video.addEventListener("pause", syncPlayUi);
        video.addEventListener("ended", () => {
          syncPlayUi();
          syncTimeUi();
        });
        video.addEventListener("loadedmetadata", () => {
          card.classList.add("is-ready");
          syncTimeUi();
        });
        video.addEventListener("durationchange", syncTimeUi);
        video.addEventListener("timeupdate", syncTimeUi);
        video.addEventListener("volumechange", syncMuteUi);
        if (progressEl) {
          progressEl.addEventListener("input", seekFromProgress);
          progressEl.addEventListener("change", seekFromProgress);
        }
        if (muteBtn) {
          muteBtn.addEventListener("click", () => {
            video.muted = !video.muted;
            syncMuteUi();
          });
        }
        if (fullBtn) {
          fullBtn.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            void openClipViewerFromCard(card);
          });
        }

        syncPlayUi();
        syncMuteUi();
        syncTimeUi();

        if (downloadBtn) {
          downloadBtn.addEventListener("click", async (event) => {
            event.preventDefault();

            const clipData = {
              id: downloadBtn.dataset.id,
              title: downloadBtn.dataset.title,
              playlistUrl: downloadBtn.dataset.playlist
            };

            const details = downloadBtn.closest(".clip-actions");
            if (details) {
              details.open = false;
            }

            try {
              await downloadClipBestQuality(clipData, downloadBtn);
            } catch (_error) {
              setStatus("Nie udalo sie pobrac klipu w najlepszej jakosci.", true);
            }
          });
        }
      });
    }

    function stopClipPosterObserver() {
      if (clipPosterObserver && typeof clipPosterObserver.disconnect === "function") {
        clipPosterObserver.disconnect();
      }
      clipPosterObserver = null;
    }

    function applyClipPoster(videoEl) {
      if (!videoEl || videoEl.dataset.posterReady === "1") {
        return;
      }

      const posterUrl = String(videoEl.dataset.poster || "").trim();
      if (!posterUrl) {
        return;
      }

      videoEl.setAttribute("poster", posterUrl);
      videoEl.dataset.posterReady = "1";
    }

    function setupClipPosterLoading() {
      stopClipPosterObserver();
      if (!clipsEl) {
        return;
      }

      const videos = Array.from(clipsEl.querySelectorAll(".clip-player"));
      if (!videos.length) {
        return;
      }

      videos.forEach((videoEl, index) => {
        if (index < CLIP_POSTER_EAGER_COUNT) {
          applyClipPoster(videoEl);
        }
      });

      if (typeof window.IntersectionObserver !== "function") {
        videos.forEach((videoEl) => {
          applyClipPoster(videoEl);
        });
        return;
      }

      clipPosterObserver = new window.IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting && entry.intersectionRatio <= 0) {
              return;
            }
            applyClipPoster(entry.target);
            observer.unobserve(entry.target);
          });
        },
        {
          root: null,
          rootMargin: "280px 0px",
          threshold: 0.01
        }
      );

      videos.forEach((videoEl, index) => {
        if (index >= CLIP_POSTER_EAGER_COUNT && videoEl.dataset.posterReady !== "1") {
          clipPosterObserver.observe(videoEl);
        }
      });
    }

    function buildClipCardElement(clip, index) {
      const card = document.createElement("article");
      card.className = "clip-card";
      card.style.animationDelay = `${Math.min(index, 12) * 45}ms`;

      const localizedViews = formatViews(clip.views);
      const localizedTime = formatRelativeTime(clip.createdAt);
      const categoryLabel = shortenCategory(clip.category) || "Klip";
      const metaTimeLabel = localizedTime || "";
      const authorName = clip.authorName || CHANNEL_SLUG;
      const authorUrl = clip.authorUrl || "";
      const authorAvatar = clip.authorAvatar || CHANNEL_AVATAR_FALLBACK;
      const duration = clip.duration || "00:00";
      const clipPageUrl = clip.pageUrl || `https://kick.com/${CHANNEL_SLUG}`;
      const playlistUrl = clip.playlistUrl || "";

      card.innerHTML = `
        <div class="clip-media">
          <video
            class="clip-player"
            preload="none"
            playsinline
            data-poster="${escapeHtml(clip.thumbnail)}"
            data-src="${escapeHtml(clip.playlistUrl)}"
            data-clip="${escapeHtml(clipPageUrl)}"
            data-duration-label="${escapeHtml(duration)}"
            data-created-at="${escapeHtml(clip.createdAt || "")}"
            data-created-relative="${escapeHtml(metaTimeLabel)}"
            data-category-label="${escapeHtml(categoryLabel)}"
          ></video>
          <button class="clip-play" type="button" aria-label="Odtworz klip"></button>
          <span class="clip-badge clip-duration">${escapeHtml(duration)}</span>
          <span class="clip-badge clip-views">${escapeHtml(localizedViews)}</span>
          <div class="clip-controls" aria-label="Sterowanie klipem">
            <button class="clip-control-btn clip-control-toggle" type="button" data-state="play" aria-label="Odtworz">
              <i class="fas fa-play" aria-hidden="true"></i>
            </button>
            <span class="clip-control-time">
              <span class="clip-time-current">0:00</span>
              <span class="clip-time-sep">/</span>
              <span class="clip-time-total">${escapeHtml(duration)}</span>
            </span>
            <input class="clip-control-progress" type="range" min="0" max="1000" step="1" value="0" aria-label="Postep klipu">
            <button class="clip-control-btn clip-control-mute" type="button" data-state="volume" aria-label="Wycisz">
              <i class="fas fa-volume-up" aria-hidden="true"></i>
            </button>
            <button class="clip-control-btn clip-control-full" type="button" aria-label="Pelny ekran">
              <i class="fas fa-expand" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        <div class="clip-row">
          <img class="clip-avatar" src="${escapeHtml(authorAvatar)}" alt="${escapeHtml(authorName)}">
          <div class="clip-copy">
            <a class="clip-title" href="${escapeHtml(clipPageUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(clip.title)}</a>
            <p class="clip-meta">
              <span class="clip-meta-category">${escapeHtml(categoryLabel)}</span>
              ${metaTimeLabel ? `<span class="clip-meta-sep" aria-hidden="true">·</span><span class="clip-meta-time">${escapeHtml(metaTimeLabel)}</span>` : ""}
            </p>
            ${authorUrl
              ? `<a class="clip-author" href="${escapeHtml(authorUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(authorName)}</a>`
              : `<p class="clip-author">${escapeHtml(authorName)}</p>`}
          </div>
          <details class="clip-actions">
            <summary class="clip-menu" aria-label="Opcje klipu"><i class="fas fa-ellipsis-v" aria-hidden="true"></i></summary>
            <div class="clip-actions-menu">
              <a class="clip-action-link" href="${escapeHtml(clipPageUrl)}" target="_blank" rel="noopener noreferrer">Otworz na Kick</a>
              <button
                class="clip-action-download"
                type="button"
                data-id="${escapeHtml(clip.id)}"
                data-title="${escapeHtml(clip.title)}"
                data-playlist="${escapeHtml(playlistUrl)}"
              >Pobierz</button>
            </div>
          </details>
        </div>
      `;

      return card;
    }

    async function appendClipCards(clips, startIndex = 0, renderToken = clipRenderToken) {
      if (!Array.isArray(clips) || !clips.length) {
        return;
      }

      let localIndex = 0;
      await new Promise((resolve) => {
        const renderBatch = () => {
          if (renderToken !== clipRenderToken) {
            resolve();
            return;
          }

          const fragment = document.createDocumentFragment();
          const stopAt = Math.min(clips.length, localIndex + CLIP_RENDER_BATCH_SIZE);
          for (; localIndex < stopAt; localIndex += 1) {
            fragment.appendChild(buildClipCardElement(clips[localIndex], startIndex + localIndex));
          }
          clipsEl.appendChild(fragment);

          if (localIndex < clips.length) {
            clipRenderFrameId = window.requestAnimationFrame(renderBatch);
            return;
          }

          clipRenderFrameId = 0;
          resolve();
        };

        renderBatch();
      });
    }

    async function renderClips(clips) {
      clipRenderToken += 1;
      const renderToken = clipRenderToken;
      if (clipRenderFrameId) {
        window.cancelAnimationFrame(clipRenderFrameId);
        clipRenderFrameId = 0;
      }
      stopClipPosterObserver();
      clipsEl.innerHTML = "";

      if (!Array.isArray(clips) || !clips.length) {
        setStatus("Brak klipów w odczytanych danych.", true);
        return;
      }

      await appendClipCards(clips, 0, renderToken);
      if (renderToken !== clipRenderToken) {
        return;
      }

      setupClipPosterLoading();
      bindPlayers();
      setStatus(`Załadowano ${clips.length} klipów.`);
    }

    async function loadClips() {
      clipsLoadSeq += 1;
      const loadSeq = clipsLoadSeq;
      let releaseRefreshInFinally = true;

      refreshBtn.disabled = true;
      setStatus(`Pobieram klipy z Kick (max ${CLIPS_MAX_ITEMS})...`);
      if (clipRenderFrameId) {
        window.cancelAnimationFrame(clipRenderFrameId);
        clipRenderFrameId = 0;
      }
      stopClipPosterObserver();
      clipsEl.innerHTML = "";

      try {
        const quickLimit = Math.max(1, Math.min(CLIPS_MAX_ITEMS, CLIPS_FAST_LOAD_ITEMS));
        const quickResult = await fetchAllClips(40, quickLimit);
        if (loadSeq !== clipsLoadSeq) {
          return;
        }

        const quickClips = Array.isArray(quickResult?.clips) ? quickResult.clips : [];
        await renderClips(quickClips);
        if (loadSeq !== clipsLoadSeq) {
          return;
        }

        if (!quickClips.length) {
          return;
        }

        refreshBtn.disabled = false;
        releaseRefreshInFinally = false;

        const shouldLoadRest = Boolean(quickResult.reachedLimit && quickLimit < CLIPS_MAX_ITEMS);
        if (!shouldLoadRest) {
          if (quickResult.reachedLimit) {
            setStatus(`Załadowano ${quickClips.length} klipów (limit ${CLIPS_MAX_ITEMS}).`);
          } else if (quickResult.partial) {
            setStatus(`Załadowano ${quickClips.length} klipów.`);
          } else {
            setStatus(`Załadowano ${quickClips.length} klipów.`);
          }
          return;
        }

        setStatus(`Załadowano ${quickClips.length} klipów. Doczytuję resztę...`);

        const fullResult = await fetchAllClips(40, CLIPS_MAX_ITEMS);
        if (loadSeq !== clipsLoadSeq) {
          return;
        }

        const existingIds = new Set(quickClips.map((clip) => String(clip?.id || "").trim()).filter(Boolean));
        const allFullClips = Array.isArray(fullResult?.clips) ? fullResult.clips : [];
        const extraClips = allFullClips.filter((clip) => {
          const clipId = String(clip?.id || "").trim();
          if (!clipId || existingIds.has(clipId)) {
            return false;
          }
          existingIds.add(clipId);
          return true;
        });

        if (extraClips.length) {
          const activeRenderToken = clipRenderToken;
          await appendClipCards(extraClips, quickClips.length, activeRenderToken);
          if (loadSeq !== clipsLoadSeq || activeRenderToken !== clipRenderToken) {
            return;
          }
          setupClipPosterLoading();
          bindPlayers();
        }

        const totalLoaded = quickClips.length + extraClips.length;
        if (fullResult.reachedLimit) {
          setStatus(`Załadowano ${totalLoaded} klipów (limit ${CLIPS_MAX_ITEMS}).`);
        } else if (fullResult.partial) {
          setStatus(`Załadowano ${totalLoaded} klipów.`);
        } else {
          setStatus(`Załadowano ${totalLoaded} klipów.`);
        }
      } catch (error) {
        if (loadSeq !== clipsLoadSeq) {
          return;
        }
        const reason = String(error?.message || "").trim();
        const suffix = reason ? ` (${reason})` : "";
        setStatus(`Nie udało się pobrać wszystkich klipów.${suffix}`, true);
      } finally {
        if (releaseRefreshInFinally && loadSeq === clipsLoadSeq) {
          refreshBtn.disabled = false;
        }
      }
    }

    function logoutAdmin() {
      const previousLogin = String(currentAdminLogin || "").trim();
      isAdminAuthenticated = false;
      currentAdminLogin = "";
      activeDiscordSession = null;
      setRememberMeEnabled(false);
      try {
        window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
      } catch (_error) {
        // Ignore session storage failures.
      }
      if (window.TakuuWebhook && typeof window.TakuuWebhook.clearDiscordSession === "function") {
        window.TakuuWebhook.clearDiscordSession();
      }
      if (previousLogin) {
        sendAdminWebhookEvent("admin_logout", "Panel Administratora", { login: previousLogin });
      }
      setAdminStatus("Wylogowano.", "info");
      setDiscordStatus("", "info");
      navigateTo(LOGIN_ROUTE_PATH, "login");
    }

    if (karyNavEl) {
      karyNavEl.setAttribute("href", KARY_ROUTE_PATH);
      karyNavEl.addEventListener("click", (event) => {
        event.preventDefault();
        navigateTo(KARY_ROUTE_PATH, "kary");
      });
    }

    if (clipsNavEl) {
      clipsNavEl.setAttribute("href", CLIPS_ROUTE_PATH);
      clipsNavEl.addEventListener("click", (event) => {
        event.preventDefault();
        navigateTo(CLIPS_ROUTE_PATH, "clips");
      });
    }

    if (homeNavEl) {
      homeNavEl.setAttribute("href", HOME_ROUTE_PATH);
      homeNavEl.addEventListener("click", (event) => {
        event.preventDefault();
        navigateTo(HOME_ROUTE_PATH, "home");
      });
    }

    if (soonNavEl) {
      soonNavEl.setAttribute("href", SOON_ROUTE_PATH);
      soonNavEl.addEventListener("click", (event) => {
        event.preventDefault();
        navigateTo(SOON_ROUTE_PATH, "soon");
      });
    }

    if (statsNavEl) {
      statsNavEl.setAttribute("href", STATS_ROUTE_PATH);
      statsNavEl.addEventListener("click", (event) => {
        event.preventDefault();
        navigateTo(STATS_ROUTE_PATH, "stats");
      });
    }

    if (adminNavEl) {
      adminNavEl.setAttribute("href", LOGIN_ROUTE_PATH);
      adminNavEl.addEventListener("click", (event) => {
        event.preventDefault();
        navigateTo(LOGIN_ROUTE_PATH, "login");
      });
    }

    if (ctaKaryLinkEl) {
      ctaKaryLinkEl.setAttribute("href", KARY_ROUTE_PATH);
      ctaKaryLinkEl.addEventListener("click", (event) => {
        event.preventDefault();
        navigateTo(KARY_ROUTE_PATH, "kary");
      });
    }

    if (ctaClipsLinkEl) {
      ctaClipsLinkEl.setAttribute("href", CLIPS_ROUTE_PATH);
      ctaClipsLinkEl.addEventListener("click", (event) => {
        event.preventDefault();
        navigateTo(CLIPS_ROUTE_PATH, "clips");
      });
    }

    window.addEventListener("hashchange", () => {
      applyView(getRouteFromPath(`${window.location.pathname}${window.location.search}${window.location.hash}`));
      scrollToRouteTop();
    });

    window.addEventListener("popstate", () => {
      applyView(getRouteFromPath(`${window.location.pathname}${window.location.search}${window.location.hash}`));
      scrollToRouteTop();
    });

    window.addEventListener("storage", (event) => {
      const changedKey = String(event.key || "");
      if (!changedKey) {
        return;
      }

      if (changedKey === KARY_STATE_KEY) {
        loadKaryState();
        renderKaryLiveState();
        return;
      }

      if (
        changedKey === ADMIN_ACCOUNTS_KEY ||
        changedKey === CCI_BASE_MEMBER_OVERRIDES_KEY ||
        changedKey === CCI_MEMBERS_KEY ||
        changedKey === CCI_MEMBERS_ORDER_KEY ||
        changedKey === KARY_CENNIK_KEY ||
        changedKey === TIMERY_CONFIG_KEY ||
        changedKey === LICZNIKI_CONFIG_KEY
      ) {
        adminAccounts = loadAdminAccounts();
        baseMemberOverrides = loadBaseMemberOverrides();
        baseMembers = loadBaseMembersFromGrid();
        customMembers = loadCustomMembers();
        membersOrder = loadMembersOrder();
        refreshMembersOrder(false);
        loadKaryCennikItems();
        loadTimeryConfig();
        loadLicznikiConfig();
        renderPublicKaryCennik();
        renderAdminKaryCennikTable();
        renderCustomMembersCards();
        renderAdminMembersTable();
        renderAdminAccountsTable();
        applyTimeryConfig();
        applyLicznikiConfig();
        return;
      }

      if (changedKey === WHEEL_SYNC_STORAGE_KEY) {
        if (event.newValue) {
          try {
            const payload = JSON.parse(event.newValue);
            consumeWheelSyncMessage(payload, "storage");
          } catch (_error) {
            // Ignore malformed wheel sync payload.
          }
        }
        return;
      }

      if (changedKey === WHEEL_CONFIG_STORAGE_KEY) {
        renderWheelStats();
      }

    });

    window.addEventListener("takuu:wheel-history-updated", (event) => {
      const entry = event && event.detail ? event.detail.entry : null;
      if (entry) {
        applyWheelHistoryEntryToStatsCache(entry);
        renderWheelStats();
        return;
      }
      void fetchWheelStatsFromApiOnce().finally(() => {
        renderWheelStats();
      });
    });

    window.addEventListener("takuu:wheel-config-updated", () => {
      renderWheelStats();
    });

    if (statsRefreshBtnEl) {
      statsRefreshBtnEl.addEventListener("click", () => {
        void fetchWheelStatsFromApiOnce().finally(() => {
          renderWheelStats();
        });
      });
    }

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        if (lastAppliedRouteName === "stats") {
          startWheelStatsLiveUpdates();
        }
        void syncAdminStateFromApiOnce({ force: true });
        void syncKaryStateFromApiOnce({ force: true });
        void syncKaryStatsFromApiOnce({ force: true });
        updateFriendsLiveBadges();
        void updateKickFollowersBadge(true);
        return;
      }
      stopWheelStatsLiveUpdates();
    });
    window.addEventListener("focus", () => {
      if (document.hidden) {
        return;
      }
      void updateKickFollowersBadge(true);
    });

    bindInternalRouteLinks();

    // Apply route view immediately so layout is visible even if later init fails.
    applyView(getRouteFromPath(`${window.location.pathname}${window.location.search}${window.location.hash}`));
    void fetchKickOAuthStatus();
    void updateKickFollowersBadge();

    if (adminRememberMeEl) {
      adminRememberMeEl.checked = isRememberMeEnabled();
    }
    clearLegacyWheelHistoryStorage();
    clearAdminSessionOnReload();
    adminAccounts = loadAdminAccounts();
    baseMemberOverrides = loadBaseMemberOverrides();
    baseMembers = loadBaseMembersFromGrid();
    customMembers = loadCustomMembers();
    membersOrder = loadMembersOrder();
    refreshMembersOrder();
    setMemberFormEditingState("");
    loadKaryCennikItems();
    migrateDuplicatedKicksyPrices();
    loadKaryState();
    loadKaryStats();
    startKaryStateSyncBridge();
    startKaryStatsSyncBridge();
    bindExternalTimerBridge();
    startWheelSyncBridge();
    void fetchWheelStatsFromApiOnce().finally(() => {
      renderWheelStats();
    });
    loadTimeryConfig();
    loadStreamObsTimeryConfig();
    loadStreamObsLicznikiConfig();
    loadLicznikiConfig();
    saveAdminAccounts();
    restoreAdminSession();
    startAdminStateSyncBridge();
    renderPublicKaryCennik();
    renderAdminKaryCennikTable();
    resetAdminCennikForm();
    populateKaryAdminControls();
    applyTimeryConfig();
    applyStreamObsTimeryConfig();
    applyStreamObsLicznikiConfig();
    applyLicznikiConfig();
    renderKaryLiveState();
    renderKaryStats();
    startKaryTimerTick();
    renderCustomMembersCards();
    startFriendsLivePolling();
    consumeKickOAuthResultFromUrl();
    startKickOAuthStatusPolling();
    startKickFollowersPolling();
    renderAdminMembersTable();
    renderAdminAccountsTable();
    setActiveAdminTab(activeAdminTab);

    if (adminTabsWrapEl) {
      adminTabsWrapEl.addEventListener("click", (event) => {
        const button = event.target.closest(".admin-tab-btn");
        if (!button) {
          return;
        }
        setActiveAdminTab(button.dataset.tab || "members");
      });
    }

    if (kickOauthConnectBtnEl) {
      kickOauthConnectBtnEl.addEventListener("click", () => {
        if (!hasBindingsAccess()) {
          setKickOAuthPanelStatus("Brak permisji do zakładki Powiązania.", "error");
          return;
        }
        setKickOAuthPanelStatus("Przekierowanie do logowania Kick...", "info");
        startKickOAuthConnectionFlow();
      });
    }

    if (kickOauthRefreshBtnEl) {
      kickOauthRefreshBtnEl.addEventListener("click", () => {
        setKickOAuthPanelStatus("Odswiezanie statusu Kick OAuth...", "info");
        void fetchKickOAuthStatus(true).then(() => {
          void updateKickFollowersBadge(true);
        });
      });
    }

    if (kickOauthUnlinkBtnEl) {
      kickOauthUnlinkBtnEl.addEventListener("click", () => {
        if (!hasBindingsAccess()) {
          setKickOAuthPanelStatus("Brak permisji do zakładki Powiązania.", "error");
          return;
        }
        void unlinkKickOAuthConnection().then(() => {
          void fetchKickOAuthStatus(true);
          void updateKickFollowersBadge(true);
        });
      });
    }

    if (adminMemberFormEl) {
      adminMemberFormEl.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(adminMemberFormEl);
        const name = String(formData.get("memberName") || "").trim();
        const kickInput = String(formData.get("memberKick") || "").trim();
        const avatar = String(formData.get("memberAvatar") || "").trim();
        const url = sanitizeMemberUrl(kickInput);

        if (!name || !url) {
          setPanelStatus(adminMemberStatusEl, "Podaj nazwe i profil Kick.", "error");
          return;
        }

        if (editingMemberId) {
          const existingMember = getAllMembers().find((member) => member.id === editingMemberId) || null;
          if (!existingMember) {
            stopMemberEdit({ resetForm: true });
            setPanelStatus(adminMemberStatusEl, "Nie znaleziono członka do edycji.", "error");
            return;
          }

          const nextAvatar = avatar || CHANNEL_AVATAR_FALLBACK;
          const editIndex = customMembers.findIndex((member) => member.id === editingMemberId);
          let updatedMember = null;

          if (editIndex >= 0) {
            updatedMember = {
              ...customMembers[editIndex],
              name,
              url,
              avatar: nextAvatar
            };
            customMembers[editIndex] = updatedMember;
          } else {
            baseMemberOverrides[editingMemberId] = {
              ...(baseMemberOverrides[editingMemberId] || {}),
              name,
              url,
              avatar: nextAvatar,
              deleted: false
            };
            saveBaseMemberOverrides();
            baseMembers = baseMembers.map((member) => {
              if (member.id !== editingMemberId) {
                return member;
              }
              return {
                ...member,
                name,
                url,
                avatar: nextAvatar
              };
            });
            updatedMember = getAllMembers().find((member) => member.id === editingMemberId) || {
              id: editingMemberId,
              name,
              url,
              avatar: nextAvatar,
              builtIn: true
            };
          }

          refreshMembersOrder(true);
          renderCustomMembersCards();
          renderAdminMembersTable();
          stopMemberEdit({ resetForm: true });
          setPanelStatus(adminMemberStatusEl, "Zapisano zmiany członka CCI.", "success");
          sendAdminWebhookEvent("member_edit", updatedMember.name, {
            id: updatedMember.id,
            name: updatedMember.name,
            url: updatedMember.url,
            avatar: updatedMember.avatar,
            builtIn: Boolean(updatedMember.builtIn)
          });
          return;
        }

        const newMember = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name,
          url,
          avatar: avatar || CHANNEL_AVATAR_FALLBACK
        };

        customMembers.push(newMember);
        membersOrder = [...membersOrder, newMember.id];
        refreshMembersOrder(true);
        renderCustomMembersCards();
        renderAdminMembersTable();
        adminMemberFormEl.reset();
        setPanelStatus(adminMemberStatusEl, "Dodano członka CCI.", "success");
        sendAdminWebhookEvent("member_add", newMember.name, {
          id: newMember.id,
          name: newMember.name,
          url: newMember.url,
          avatar: newMember.avatar
        });
      });
    }

    if (adminMembersTableBodyEl) {
      adminMembersTableBodyEl.addEventListener("click", (event) => {
        const target = event.target instanceof HTMLElement ? event.target : null;
        if (!target) {
          return;
        }

        const editButton = target.closest("[data-member-edit]");
        if (editButton) {
          const memberId = String(editButton.dataset.memberEdit || "");
          startMemberEdit(memberId);
          return;
        }

        const removeButton = target.closest("[data-member-remove]");
        if (!removeButton) {
          return;
        }

        const memberId = String(removeButton.dataset.memberRemove || "");
        const removedMember = getAllMembers().find((member) => member.id === memberId) || null;
        if (!removedMember) {
          return;
        }

        if (removedMember.builtIn) {
          baseMemberOverrides[memberId] = {
            ...(baseMemberOverrides[memberId] || {}),
            deleted: true
          };
          saveBaseMemberOverrides();
          baseMembers = baseMembers.filter((member) => member.id !== memberId);
        } else {
          customMembers = customMembers.filter((member) => member.id !== memberId);
        }

        if (editingMemberId === memberId) {
          stopMemberEdit({ resetForm: true });
        }
        membersOrder = membersOrder.filter((id) => id !== memberId);
        refreshMembersOrder(true);
        renderCustomMembersCards();
        renderAdminMembersTable();
        setPanelStatus(adminMemberStatusEl, "Usunięto członka CCI.", "info");
        sendAdminWebhookEvent("member_remove", removedMember.name, {
          id: removedMember.id,
          name: removedMember.name,
          url: removedMember.url,
          builtIn: Boolean(removedMember.builtIn)
        });
      });

      adminMembersTableBodyEl.addEventListener("dragstart", (event) => {
        const target = event.target instanceof HTMLElement ? event.target : null;
        const handle = target ? target.closest("[data-member-drag-handle]") : null;
        if (!handle) {
          event.preventDefault();
          return;
        }

        const row = handle.closest("tr[data-member-id]");
        if (!row) {
          event.preventDefault();
          return;
        }

        const memberId = String(row.dataset.memberId || "").trim();
        if (!memberId) {
          event.preventDefault();
          return;
        }

        draggingMemberId = memberId;
        draggingMemberRow = row;
        draggingMemberRow.style.opacity = "0.55";

        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData("text/plain", memberId);
        }
      });

      adminMembersTableBodyEl.addEventListener("dragover", (event) => {
        if (!draggingMemberRow || !draggingMemberId) {
          return;
        }
        event.preventDefault();

        const dropTarget = findDropTargetMemberRow(event.clientY);
        if (!dropTarget) {
          adminMembersTableBodyEl.appendChild(draggingMemberRow);
          return;
        }

        if (dropTarget !== draggingMemberRow) {
          adminMembersTableBodyEl.insertBefore(draggingMemberRow, dropTarget);
        }
      });

      adminMembersTableBodyEl.addEventListener("drop", (event) => {
        if (!draggingMemberRow || !draggingMemberId) {
          return;
        }
        event.preventDefault();

        draggingMemberRow.style.opacity = "";
        const changed = applyMembersOrderFromDom();
        draggingMemberRow = null;
        draggingMemberId = "";
        if (changed) {
          renderCustomMembersCards();
          renderAdminMembersTable();
          setPanelStatus(adminMemberStatusEl, "Zmieniono kolejność członków CCI.", "success");
          sendAdminWebhookEvent("member_reorder", "Członkowie CCI", {
            order: membersOrder
          });
        }
      });

      adminMembersTableBodyEl.addEventListener("dragend", () => {
        if (draggingMemberRow) {
          draggingMemberRow.style.opacity = "";
        }
        draggingMemberRow = null;
        draggingMemberId = "";
      });
    }

    if (adminTimerFormEl) {
      if (adminTimerSelectEl) {
        adminTimerSelectEl.addEventListener("change", () => {
          updateTimerQuickActionButtons();
        });
      }

      adminTimerFormEl.addEventListener("click", (event) => {
        const actionButton = event.target.closest("[data-timer-action]");
        if (!actionButton) {
          return;
        }
        event.preventDefault();
        const action = String(actionButton.dataset.timerAction || "");
        const formData = new FormData(adminTimerFormEl);
        applyTimerAction(action, formData);
      });
    }

    if (adminCounterFormEl) {
      adminCounterFormEl.addEventListener("click", (event) => {
        const actionButton = event.target.closest("[data-counter-action]");
        if (!actionButton) {
          return;
        }
        event.preventDefault();
        const action = String(actionButton.dataset.counterAction || "");
        const formData = new FormData(adminCounterFormEl);
        applyCounterAction(action, formData);
      });
    }

    if (adminCennikFormEl) {
      adminCennikFormEl.addEventListener("submit", (event) => {
        event.preventDefault();
        upsertKaryCennikFromForm();
      });
    }

    if (adminCennikCancelBtnEl) {
      adminCennikCancelBtnEl.addEventListener("click", () => {
        resetAdminCennikForm();
        setKaryCennikStatus("Wyczyszczono formularz.", "info");
      });
    }

    if (adminCennikTableBodyEl) {
      adminCennikTableBodyEl.addEventListener("click", (event) => {
        const editButton = event.target.closest("[data-cennik-edit]");
        if (editButton) {
          const itemId = String(editButton.dataset.cennikEdit || "");
          const matched = karyCennikItems.find((item) => item.id === itemId);
          if (matched) {
            fillAdminCennikForm(matched);
            setKaryCennikStatus("Tryb edycji pozycji cennika.", "info");
          }
          return;
        }

        const removeButton = event.target.closest("[data-cennik-remove]");
        if (!removeButton) {
          return;
        }

        const itemId = String(removeButton.dataset.cennikRemove || "");
        const removedItem = karyCennikItems.find((item) => item.id === itemId) || null;
        const before = karyCennikItems.length;
        karyCennikItems = karyCennikItems.filter((item) => item.id !== itemId);
        if (karyCennikItems.length === before) {
          return;
        }

        saveKaryCennikItems();
        renderPublicKaryCennik();
        renderAdminKaryCennikTable();
        resetAdminCennikForm();
        setKaryCennikStatus("Usunięto pozycję cennika.", "success");
        if (removedItem) {
          sendAdminWebhookEvent("cennik_remove", removedItem.name, {
            section: removedItem.section,
            description: removedItem.description,
            pricePln: removedItem.pricePln,
            priceSuby: removedItem.priceSuby,
            priceKicksy: removedItem.priceKicksy
          });
        }
      });

      adminCennikTableBodyEl.addEventListener("dragstart", (event) => {
        const target = event.target instanceof HTMLElement ? event.target : null;
        const handle = target ? target.closest("[data-cennik-drag-handle]") : null;
        if (!handle) {
          event.preventDefault();
          return;
        }

        const row = handle.closest("tr.admin-cennik-row[data-cennik-id]");
        if (!row) {
          event.preventDefault();
          return;
        }

        const itemId = String(row.dataset.cennikId || "").trim();
        const section = normalizeKarySection(row.dataset.cennikSection);
        if (!itemId || !section) {
          event.preventDefault();
          return;
        }

        draggingCennikId = itemId;
        draggingCennikSection = section;
        draggingCennikRow = row;
        draggingCennikRow.classList.add("is-dragging");

        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData("text/plain", itemId);
        }
      });

      adminCennikTableBodyEl.addEventListener("dragover", (event) => {
        if (!draggingCennikRow || !draggingCennikId || !draggingCennikSection) {
          return;
        }
        event.preventDefault();

        const dropTarget = findDropTargetCennikRow(event.clientY, draggingCennikSection);
        clearCennikDragTargetRows();

        if (!dropTarget) {
          moveDraggingCennikRowToSectionEnd(draggingCennikSection);
          return;
        }

        dropTarget.classList.add("is-drag-target");
        if (dropTarget !== draggingCennikRow) {
          adminCennikTableBodyEl.insertBefore(draggingCennikRow, dropTarget);
        }
      });

      adminCennikTableBodyEl.addEventListener("drop", (event) => {
        if (!draggingCennikRow || !draggingCennikId || !draggingCennikSection) {
          return;
        }
        event.preventDefault();

        const droppedSection = draggingCennikSection;
        clearCennikDragTargetRows();
        draggingCennikRow.classList.remove("is-dragging");

        const changed = applyCennikOrderFromDom(droppedSection);

        draggingCennikRow = null;
        draggingCennikId = "";
        draggingCennikSection = "";

        if (!changed) {
          return;
        }

        saveKaryCennikItems();
        renderPublicKaryCennik();
        renderAdminKaryCennikTable();
        setKaryCennikStatus("Zmieniono kolejność pozycji cennika.", "success");

        const sectionLabel = droppedSection === "hard" ? "Tortury" : "Opcje widza";
        const order = getSortedKaryCennikItems()
          .filter((item) => item.section === droppedSection)
          .map((item) => item.name);
        sendAdminWebhookEvent("cennik_reorder", sectionLabel, {
          section: droppedSection,
          order
        });
      });

      adminCennikTableBodyEl.addEventListener("dragend", () => {
        clearCennikDragTargetRows();
        if (draggingCennikRow) {
          draggingCennikRow.classList.remove("is-dragging");
        }
        draggingCennikRow = null;
        draggingCennikId = "";
        draggingCennikSection = "";
      });
    }

    if (adminAccountFormEl) {
      adminAccountFormEl.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!hasOwnerAdminAccess()) {
          setPanelStatus(adminAccountStatusEl, "Brak permisji do zakładki Panel Admina.", "error");
          return;
        }

        const formData = new FormData(adminAccountFormEl);
        const login = String(formData.get("accountLogin") || "").trim();
        const password = String(formData.get("accountPassword") || "").trim();
        const discordUserId = normalizeDiscordUserId(formData.get("accountDiscordId"));
        const canAccessAdmin = formData.get("accountAccessAdmin") === "on";
        const canAccessStreamObs = formData.get("accountAccessStreamObs") === "on";
        const canAccessBindings = formData.get("accountAccessBindings") === "on";
        const isDiscordAccount = Boolean(discordUserId);
        let accountAction = "account_add";

        if (!login && !discordUserId) {
          setPanelStatus(adminAccountStatusEl, "Podaj login albo Discord ID.", "error");
          return;
        }
        if (!password && !discordUserId) {
          setPanelStatus(adminAccountStatusEl, "Podaj hasło dla konta lokalnego.", "error");
          return;
        }

        const normalizedLogin = login || `discord:${discordUserId}`;
        const normalizedPassword = password || "DISCORD_ONLY";
        const existingIndex = adminAccounts.findIndex(
          (item) =>
            item.login.toLowerCase() === normalizedLogin.toLowerCase() ||
            (discordUserId && normalizeDiscordUserId(item.discordUserId) === discordUserId)
        );
        if (existingIndex !== -1) {
          if (adminAccounts[existingIndex].isRoot) {
            setPanelStatus(adminAccountStatusEl, "Tego konta nie można edytować.", "error");
            return;
          }

          adminAccounts[existingIndex] = {
            ...adminAccounts[existingIndex],
            login: normalizedLogin,
            password: normalizedPassword,
            discordUserId: discordUserId || "",
            discordName: String(adminAccounts[existingIndex].discordName || ""),
            canAccessAdmin,
            canAccessStreamObs,
            canAccessBindings,
            isDiscordAccount
          };
          accountAction = "account_update";
          setPanelStatus(adminAccountStatusEl, "Zaktualizowano konto admina.", "success");
        } else {
          const newAccount = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            login: normalizedLogin,
            password: normalizedPassword,
            discordUserId: discordUserId || "",
            discordName: "",
            canAccessAdmin,
            canAccessStreamObs,
            canAccessBindings,
            isRoot: false,
            isDiscordAccount
          };
          adminAccounts.push(newAccount);
          setPanelStatus(adminAccountStatusEl, "Dodano nowe konto admina.", "success");
        }

        saveAdminAccounts();
        renderAdminAccountsTable();
        adminAccountFormEl.reset();
        sendAdminWebhookEvent(accountAction, normalizedLogin, {
          login: normalizedLogin,
          discordUserId: discordUserId || "",
          canAccessAdmin,
          canAccessStreamObs,
          canAccessBindings
        });
      });
    }

    if (adminAccountsTableBodyEl) {
      adminAccountsTableBodyEl.addEventListener("click", (event) => {
        if (!hasOwnerAdminAccess()) {
          setPanelStatus(adminAccountStatusEl, "Brak permisji do zakładki Panel Admina.", "error");
          return;
        }

        const toggleBtn = event.target.closest("[data-account-toggle]");
        if (toggleBtn) {
          const accountId = String(toggleBtn.dataset.accountToggle || "");
          const account = adminAccounts.find((item) => item.id === accountId);
          if (!account || account.isRoot) {
            return;
          }
          if (visibleAdminPasswords.has(accountId)) {
            visibleAdminPasswords.delete(accountId);
          } else {
            visibleAdminPasswords.add(accountId);
          }
          renderAdminAccountsTable();
          return;
        }

        const removeBtn = event.target.closest("[data-account-remove]");
        if (!removeBtn) {
          return;
        }

        const accountId = String(removeBtn.dataset.accountRemove || "");
        const accountToDelete = adminAccounts.find((item) => item.id === accountId);
        adminAccounts = adminAccounts.filter((item) => item.id !== accountId);
        visibleAdminPasswords.delete(accountId);
        saveAdminAccounts();
        renderAdminAccountsTable();
        setPanelStatus(adminAccountStatusEl, "Usunięto konto admina.", "info");
        if (accountToDelete) {
          sendAdminWebhookEvent("account_remove", accountToDelete.login, {
            login: accountToDelete.login,
            discordUserId: normalizeDiscordUserId(accountToDelete.discordUserId),
            canAccessAdmin: accountToDelete.canAccessAdmin,
            canAccessStreamObs: accountToDelete.canAccessStreamObs,
            canAccessBindings: accountToDelete.canAccessBindings
          });
        }

        if (
          accountToDelete &&
          (
            accountToDelete.login === currentAdminLogin ||
            (
              activeDiscordSession &&
              normalizeDiscordUserId(accountToDelete.discordUserId) === normalizeDiscordUserId(activeDiscordSession.id)
            )
          )
        ) {
          logoutAdmin();
        }
      });

      adminAccountsTableBodyEl.addEventListener("change", (event) => {
        const permissionCheckbox = event.target.closest("[data-account-permission-checkbox]");
        if (!permissionCheckbox) {
          return;
        }

        if (!hasOwnerAdminAccess()) {
          renderAdminAccountsTable();
          setPanelStatus(adminAccountStatusEl, "Brak permisji do zakładki Panel Admina.", "error");
          return;
        }

        const accountId = String(permissionCheckbox.dataset.accountId || "");
        const permissionKey = String(permissionCheckbox.dataset.accountPermissionCheckbox || "").trim().toLowerCase();
        const account = adminAccounts.find((item) => item.id === accountId);
        if (!account || account.isRoot) {
          renderAdminAccountsTable();
          return;
        }

        const permissionFieldByKey = {
          admin: "canAccessAdmin",
          streamobs: "canAccessStreamObs",
          bindings: "canAccessBindings"
        };
        const successMessageByKey = {
          admin: permissionCheckbox.checked ? "Nadano permisję do Panelu Admina." : "Odebrano permisję do Panelu Admina.",
          streamobs: permissionCheckbox.checked ? "Nadano permisję do StreamOBS." : "Odebrano permisję do StreamOBS.",
          bindings: permissionCheckbox.checked ? "Nadano permisję do Powiązań." : "Odebrano permisję do Powiązań."
        };
        const webhookActionByKey = {
          admin: "account_access_admin_change",
          streamobs: "account_access_streamobs_change",
          bindings: "account_access_bindings_change"
        };

        const permissionField = permissionFieldByKey[permissionKey];
        if (!permissionField) {
          renderAdminAccountsTable();
          return;
        }

        account[permissionField] = Boolean(permissionCheckbox.checked);
        saveAdminAccounts();
        renderAdminAccountsTable();
        setPanelStatus(adminAccountStatusEl, successMessageByKey[permissionKey], "success");
        sendAdminWebhookEvent(webhookActionByKey[permissionKey], account.login, {
          login: account.login,
          discordUserId: normalizeDiscordUserId(account.discordUserId),
          canAccessAdmin: account.canAccessAdmin,
          canAccessStreamObs: account.canAccessStreamObs,
          canAccessBindings: account.canAccessBindings
        });
      });
    }

    if (adminLogoutBtnEl) {
      adminLogoutBtnEl.addEventListener("click", logoutAdmin);
    }

    if (adminRememberMeEl) {
      adminRememberMeEl.addEventListener("change", () => {
        setRememberMeEnabled(adminRememberMeEl.checked);
      });
    }

    if (adminLoginFormEl) {
      adminLoginFormEl.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(adminLoginFormEl);
        const login = String(formData.get("login") || "").trim();
        const password = String(formData.get("password") || "").trim();
        const passwordInput = adminLoginPasswordEl || adminLoginFormEl.querySelector('input[name="password"]');

        if (!login || !password) {
          setAdminStatus("Wpisz login i hasło.", "error");
          return;
        }

        const rootLoginMatch = login.toLowerCase() === ROOT_ADMIN_LOGIN.toLowerCase() && password === ROOT_ADMIN_PASSWORD;
        let matched = adminAccounts.find(
          (item) => item.login === login && item.password === password && canAccountAccessAnyAdminArea(item)
        );
        if (!matched && rootLoginMatch) {
          matched =
            adminAccounts.find((item) => item.id === ROOT_ADMIN_ID) || {
              id: ROOT_ADMIN_ID,
              login: ROOT_ADMIN_LOGIN,
              password: ROOT_ADMIN_PASSWORD,
              discordUserId: ROOT_ADMIN_DISCORD_ID,
              canAccessAdmin: true,
              canAccessStreamObs: true,
              canAccessBindings: true,
              isRoot: true,
              isDiscordAccount: false
            };
        }

        if (!matched) {
          isAdminAuthenticated = false;
          currentAdminLogin = "";
          activeDiscordSession = null;
          try {
            window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
          } catch (_error) {
            // Ignore session storage failures.
          }
          if (window.TakuuWebhook && typeof window.TakuuWebhook.clearDiscordSession === "function") {
            window.TakuuWebhook.clearDiscordSession();
          }

          if (passwordInput) {
            passwordInput.value = "";
            passwordInput.focus();
          }
          setAdminStatus("Nieprawidłowy login lub hasło.", "error");
          sendAdminWebhookEvent("admin_login_failed", "Panel Administratora", {
            loginAttempt: login
          });
          return;
        }

        isAdminAuthenticated = true;
        currentAdminLogin = matched.login;
        activeDiscordSession = null;
        const shouldRememberAdmin = Boolean(adminRememberMeEl && adminRememberMeEl.checked);
        try {
          window.sessionStorage.setItem(ADMIN_SESSION_KEY, matched.login);
        } catch (_error) {
          // Ignore session storage failures.
        }
        if (window.TakuuWebhook && typeof window.TakuuWebhook.clearDiscordSession === "function") {
          window.TakuuWebhook.clearDiscordSession();
        }

        adminLoginFormEl.reset();
        setRememberMeEnabled(shouldRememberAdmin);
        setLoginPasswordVisibility(false);
        setAdminStatus(`Zalogowano jako ${matched.login}.`, "success");
        setDiscordStatus("", "info");
        sendAdminWebhookEvent("admin_login_local", "Panel Administratora", {
          login: matched.login
        });
        navigateTo(ADMIN_ROUTE_PATH, "admin");
      });
    }

    if (adminPasswordToggleEl) {
      adminPasswordToggleEl.addEventListener("click", () => {
        const nextVisible = !(adminLoginPasswordEl && adminLoginPasswordEl.type === "text");
        setLoginPasswordVisibility(nextVisible);
        if (adminLoginPasswordEl) {
          try {
            adminLoginPasswordEl.focus({ preventScroll: true });
          } catch (_error) {
            adminLoginPasswordEl.focus();
          }
        }
      });
    }

    if (adminShowPasswordEl && adminShowPasswordEl.type === "checkbox") {
      adminShowPasswordEl.addEventListener("change", () => {
        setLoginPasswordVisibility(adminShowPasswordEl.checked);
      });
    }

    setLoginPasswordVisibility(Boolean(adminLoginPasswordEl && adminLoginPasswordEl.type === "text"));

    if (adminDiscordLoginBtnEl) {
      if (window.TakuuWebhook && typeof window.TakuuWebhook.isDiscordLoginAvailable === "function") {
        const availability = window.TakuuWebhook.isDiscordLoginAvailable();
        if (!availability.ok) {
          adminDiscordLoginBtnEl.disabled = true;
          setDiscordStatus(availability.error || "Logowanie Discord jest niedostepne.", "error");
        }
      } else {
        adminDiscordLoginBtnEl.disabled = true;
        setDiscordStatus("Brak webhook.js lub konfiguracji Discord.", "error");
      }

      adminDiscordLoginBtnEl.addEventListener("click", () => {
        startDiscordLoginFlow();
      });
    }

    // Signal that native login handlers are fully bound.
    window.__takuuNativeLoginReady = true;

    if (karyCurrencySwitchEl) {
      karyCurrencySwitchEl.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-currency]");
        if (!button) {
          return;
        }
        setKaryCurrency(button.dataset.currency);
      });
      setKaryCurrency("pln");
      window.__takuuNativeKaryCurrencyReady = true;
    }

    if (karyOpenWindowButtonEls.length) {
      karyOpenWindowButtonEls.forEach((button) => {
        button.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (typeof event.stopImmediatePropagation === "function") {
            event.stopImmediatePropagation();
          }

          const target = String(button.dataset.karyOpenWindow || "").toLowerCase();
          const hrefPath = String(button.getAttribute("href") || "").trim();
          const routePath =
            (IS_FILE_PROTOCOL
              ? (target === "liczniki" ? LICZNIKI_ROUTE_PATH : target === "timery" ? TIMERY_ROUTE_PATH : "")
              : (hrefPath || (target === "liczniki" ? LICZNIKI_ROUTE_PATH : target === "timery" ? TIMERY_ROUTE_PATH : "")));
          if (!routePath) {
            return;
          }
          let absoluteRoute = routePath;
          try {
            absoluteRoute = new URL(routePath, IS_FILE_PROTOCOL ? window.location.href : window.location.origin).href;
          } catch (_error) {
            absoluteRoute = routePath;
          }
          const popupWidth = 1240;
          const popupHeight = target === "liczniki" ? 760 : 920;
          const left = Math.max(0, Math.floor((window.screen.availWidth - popupWidth) / 2));
          const top = Math.max(0, Math.floor((window.screen.availHeight - popupHeight) / 2));
          const popupName = target === "liczniki" ? "takuu_liczniki_popup" : "takuu_timery_popup";
          const popupFeatures = [
            "popup=yes",
            `width=${popupWidth}`,
            `height=${popupHeight}`,
            `left=${left}`,
            `top=${top}`,
            "resizable=yes",
            "scrollbars=yes"
          ].join(",");

          let popup = target === "liczniki" ? licznikiPopupRef : timeryPopupRef;
          if (popup && popup.closed) {
            popup = null;
          }

          if (popup) {
            try {
              popup.opener = null;
              popup.location.href = absoluteRoute;
              popup.focus();
            } catch (_error) {
              // Ignore popup focus/opener errors.
            }
            return;
          }

          popup = window.open(absoluteRoute, popupName, popupFeatures);
          if (popup) {
            if (target === "liczniki") {
              licznikiPopupRef = popup;
            } else {
              timeryPopupRef = popup;
            }
            try {
              popup.opener = null;
              popup.focus();
            } catch (_error) {
              // Ignore popup focus/opener errors.
            }
            return;
          }

          window.alert("Przegladarka zablokowala nowe okno. Zezwol na popupy dla tej strony.");
        });
      });
    }

    if (karyJumpButtonEls.length) {
      karyJumpButtonEls.forEach((button) => {
        button.addEventListener("click", () => {
          const selector = String(button.dataset.karyJump || "").trim();
          if (!selector) {
            return;
          }
          const target = document.querySelector(selector);
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      });
    }

    if (timeryConfigBtnEl) {
      timeryConfigBtnEl.addEventListener("click", () => {
        timeryConfigState.panelOpen = !timeryConfigState.panelOpen;
        saveTimeryConfig();
        applyTimeryConfig();
      });
    }

    if (timeryLayoutSelectEl) {
      timeryLayoutSelectEl.addEventListener("change", () => {
        const selectedLayout = String(timeryLayoutSelectEl.value || "").toLowerCase();
        timeryConfigState.layout =
          selectedLayout === "grid" || selectedLayout === "compact" ? selectedLayout : "list";
        saveTimeryConfig();
        applyTimeryConfig();
      });
    }

    if (timeryBgColorInputEl) {
      timeryBgColorInputEl.addEventListener("input", () => {
        const color = String(timeryBgColorInputEl.value || "").trim();
        if (!/^#[\da-f]{6}$/i.test(color)) {
          return;
        }
        timeryConfigState.bgColor = color;
        saveTimeryConfig();
        applyTimeryConfig();
      });
    }

    if (timeryShowTitleEl) {
      timeryShowTitleEl.addEventListener("change", () => {
        timeryConfigState.showTitle = timeryShowTitleEl.checked;
        saveTimeryConfig();
        applyTimeryConfig();
      });
    }

    if (timeryShowProgressEl) {
      timeryShowProgressEl.addEventListener("change", () => {
        timeryConfigState.showProgress = timeryShowProgressEl.checked;
        saveTimeryConfig();
        applyTimeryConfig();
      });
    }

    if (timeryShowStatusEl) {
      timeryShowStatusEl.addEventListener("change", () => {
        timeryConfigState.showStatus = timeryShowStatusEl.checked;
        saveTimeryConfig();
        applyTimeryConfig();
      });
    }

    if (streamObsTimeryConfigToggleEl) {
      streamObsTimeryConfigToggleEl.addEventListener("click", () => {
        streamObsTimeryConfigState.panelOpen = !streamObsTimeryConfigState.panelOpen;
        saveStreamObsTimeryConfig();
        applyStreamObsTimeryConfig();
        sendAdminWebhookEvent("streamobs_timer_config_toggle", "StreamOBS - Timery OBS", {
          panelOpen: streamObsTimeryConfigState.panelOpen
        });
      });
    }

    if (streamObsTimeryLayoutSelectEl) {
      streamObsTimeryLayoutSelectEl.addEventListener("change", () => {
        const nextLayout = String(streamObsTimeryLayoutSelectEl.value || "").toLowerCase();
        streamObsTimeryConfigState.layout = nextLayout === "horizontal" ? "horizontal" : "vertical";
        saveStreamObsTimeryConfig();
        applyStreamObsTimeryConfig();
        sendAdminWebhookEvent("streamobs_timer_layout_change", "StreamOBS - Timery OBS", {
          layout: streamObsTimeryConfigState.layout
        });
      });
    }

    if (streamObsTimeryColorInputEl) {
      streamObsTimeryColorInputEl.addEventListener("input", () => {
        const color = String(streamObsTimeryColorInputEl.value || "").trim();
        if (!/^#[\da-f]{6}$/i.test(color)) {
          return;
        }
        streamObsTimeryConfigState.color = color;
        saveStreamObsTimeryConfig();
        applyStreamObsTimeryConfig();
      });
      streamObsTimeryColorInputEl.addEventListener("change", () => {
        const color = String(streamObsTimeryColorInputEl.value || "").trim();
        if (!/^#[\da-f]{6}$/i.test(color)) {
          return;
        }
        sendAdminWebhookEvent("streamobs_timer_color_change", "StreamOBS - Timery OBS", {
          color
        });
      });
    }

    if (streamObsTimeryProgressColorInputEl) {
      streamObsTimeryProgressColorInputEl.addEventListener("input", () => {
        const color = String(streamObsTimeryProgressColorInputEl.value || "").trim();
        if (!/^#[\da-f]{6}$/i.test(color)) {
          return;
        }
        streamObsTimeryConfigState.progressColor = color;
        saveStreamObsTimeryConfig();
        applyStreamObsTimeryConfig();
      });
      streamObsTimeryProgressColorInputEl.addEventListener("change", () => {
        const color = String(streamObsTimeryProgressColorInputEl.value || "").trim();
        if (!/^#[\da-f]{6}$/i.test(color)) {
          return;
        }
        sendAdminWebhookEvent("streamobs_timer_progress_color_change", "StreamOBS - Timery OBS", {
          progressColor: color
        });
      });
    }

    if (streamObsLicznikiConfigToggleEl) {
      streamObsLicznikiConfigToggleEl.addEventListener("click", () => {
        streamObsLicznikiConfigState.panelOpen = !streamObsLicznikiConfigState.panelOpen;
        saveStreamObsLicznikiConfig();
        applyStreamObsLicznikiConfig();
        sendAdminWebhookEvent("streamobs_counter_config_toggle", "StreamOBS - Liczniki OBS", {
          panelOpen: streamObsLicznikiConfigState.panelOpen
        });
      });
    }

    if (streamObsLicznikiLayoutSelectEl) {
      streamObsLicznikiLayoutSelectEl.addEventListener("change", () => {
        const nextLayout = String(streamObsLicznikiLayoutSelectEl.value || "").toLowerCase();
        streamObsLicznikiConfigState.layout = nextLayout === "horizontal" ? "horizontal" : "vertical";
        saveStreamObsLicznikiConfig();
        applyStreamObsLicznikiConfig();
        sendAdminWebhookEvent("streamobs_counter_layout_change", "StreamOBS - Liczniki OBS", {
          layout: streamObsLicznikiConfigState.layout
        });
      });
    }

    if (streamObsLicznikiColorInputEl) {
      streamObsLicznikiColorInputEl.addEventListener("input", () => {
        const color = String(streamObsLicznikiColorInputEl.value || "").trim();
        if (!/^#[\da-f]{6}$/i.test(color)) {
          return;
        }
        streamObsLicznikiConfigState.color = color;
        saveStreamObsLicznikiConfig();
        applyStreamObsLicznikiConfig();
      });
      streamObsLicznikiColorInputEl.addEventListener("change", () => {
        const color = String(streamObsLicznikiColorInputEl.value || "").trim();
        if (!/^#[\da-f]{6}$/i.test(color)) {
          return;
        }
        sendAdminWebhookEvent("streamobs_counter_color_change", "StreamOBS - Liczniki OBS", {
          color
        });
      });
    }

    if (licznikiConfigBtnEl) {
      licznikiConfigBtnEl.addEventListener("click", () => {
        licznikiConfigState.panelOpen = !licznikiConfigState.panelOpen;
        saveLicznikiConfig();
        applyLicznikiConfig();
      });
    }

    if (licznikiLayoutSelectEl) {
      licznikiLayoutSelectEl.addEventListener("change", () => {
        const selectedLayout = String(licznikiLayoutSelectEl.value || "").toLowerCase();
        licznikiConfigState.layout =
          selectedLayout === "list" || selectedLayout === "compact" ? selectedLayout : "grid";
        saveLicznikiConfig();
        applyLicznikiConfig();
      });
    }

    if (licznikiBgColorInputEl) {
      licznikiBgColorInputEl.addEventListener("input", () => {
        const color = String(licznikiBgColorInputEl.value || "").trim();
        if (!/^#[\da-f]{6}$/i.test(color)) {
          return;
        }
        licznikiConfigState.bgColor = color;
        saveLicznikiConfig();
        applyLicznikiConfig();
      });
    }

    if (licznikiShowTitleEl) {
      licznikiShowTitleEl.addEventListener("change", () => {
        licznikiConfigState.showTitle = licznikiShowTitleEl.checked;
        saveLicznikiConfig();
        applyLicznikiConfig();
      });
    }

    if (licznikiShowStatusEl) {
      licznikiShowStatusEl.addEventListener("change", () => {
        licznikiConfigState.showStatus = licznikiShowStatusEl.checked;
        saveLicznikiConfig();
        applyLicznikiConfig();
      });
    }

    if (licznikiShowValueEl) {
      licznikiShowValueEl.addEventListener("change", () => {
        licznikiConfigState.showValue = licznikiShowValueEl.checked;
        saveLicznikiConfig();
        applyLicznikiConfig();
      });
    }

    // Signal that native timery/liczniki config handlers are fully bound.
    window.__takuuNativeConfigReady = true;

    if (refreshBtn) {
      refreshBtn.addEventListener("click", loadClips);
    }
    window.addEventListener("beforeunload", () => {
      saveReloadSourcePath(window.location.pathname);
      persistLastRoutePath(window.location.pathname);
    });
    window.addEventListener("pagehide", () => {
      saveReloadSourcePath(window.location.pathname);
    });

    handleDiscordOAuthCallback().finally(() => {
      const restoredPath = getRestorableRoutePath();
      if (restoredPath && !OBS_OVERLAY_MODE) {
        const restoredRoute = getRouteFromPath(restoredPath);
        try {
          window.history.replaceState({ view: restoredRoute }, "", restoredPath);
        } catch (_error) {
          window.location.href = restoredPath;
          return;
        }
        applyView(restoredRoute);
        return;
      }

      const initialPathRoute = OBS_OVERLAY_MODE ? "admin" : getRouteFromPath(window.location.pathname);
      const popupHintRoute = getPopupRouteHint();
      const hasExplicitRoute = Boolean(
        getRouteFromSearch(window.location.search) || getRouteFromHash(window.location.hash)
      );

      if (
        !OBS_OVERLAY_MODE &&
        !IS_FILE_PROTOCOL &&
        popupHintRoute &&
        !hasExplicitRoute &&
        initialPathRoute === "home"
      ) {
        try {
          window.name = "";
        } catch (_error) {
          // Ignore popup name write failures.
        }
        navigateTo(popupHintRoute === "liczniki" ? LICZNIKI_ROUTE_PATH : TIMERY_ROUTE_PATH, popupHintRoute);
        return;
      }

      applyView(initialPathRoute);
      if (initialPathRoute === "home") {
        window.setTimeout(() => {
          if (!window.__takuuIntroTypingTriggered) {
            queueIntroTypingAnimation(0);
          }
        }, 140);
      }
    });


/* INLINE_FALLBACK_MOVED_FROM_INDEX */
    (function () {
      "use strict";

      function detectRoute() {
        var path = String(window.location.pathname || "").toLowerCase();
        var params = new URLSearchParams(window.location.search || "");
        var view = String(params.get("view") || "").toLowerCase();

        if (/\/kary\/?$/.test(path) || view === "kary") return "kary";
        if (/\/timery\/?$/.test(path) || view === "timery" || view === "timers") return "timery";
        if (/\/liczniki\/?$/.test(path) || view === "liczniki" || view === "counters") return "liczniki";
        if (/\/(klipy|clips)\/?$/.test(path) || view === "klipy" || view === "clips") return "clips";
        if (/\/(soon|wkrotce)\/?$/.test(path) || view === "soon" || view === "wkrotce") return "soon";
        if (/\/(stats|statystyki)\/?$/.test(path) || view === "stats" || view === "statystyki") return "stats";
        if (/\/(logowanie|login)\/?$/.test(path) || view === "logowanie" || view === "login") return "login";
        if (/\/admin\/?$/.test(path) || view === "admin") return "admin";
        return "home";
      }

      function setVisible(el, show, displayValue) {
        if (!el) return;
        el.hidden = !show;
        el.style.display = show ? (displayValue || "") : "none";
      }

      function bindConfigToggle(buttonId, panelId, storageKey) {
        var button = document.getElementById(buttonId);
        var panel = document.getElementById(panelId);
        if (!button || !panel) return;

        button.textContent = panel.hidden ? "Konfiguracja" : "Ukryj konfigurację";

        button.addEventListener("click", function (event) {
          event.preventDefault();
          if (typeof event.stopImmediatePropagation === "function") {
            event.stopImmediatePropagation();
          }
          event.stopPropagation();

          var shouldOpen = Boolean(panel.hidden);
          panel.hidden = !shouldOpen;
          button.textContent = shouldOpen ? "Ukryj konfigurację" : "Konfiguracja";

          try {
            var raw = window.localStorage.getItem(storageKey);
            var parsed = raw ? JSON.parse(raw) : {};
            if (!parsed || typeof parsed !== "object") {
              parsed = {};
            }
            parsed.panelOpen = shouldOpen;
            window.localStorage.setItem(storageKey, JSON.stringify(parsed));
          } catch (_error) {
            // Ignore storage errors.
          }
        }, true);
      }

      function readConfig(storageKey, fallback) {
        try {
          var raw = window.localStorage.getItem(storageKey);
          if (!raw) return fallback;
          var parsed = JSON.parse(raw);
          if (!parsed || typeof parsed !== "object") return fallback;
          return parsed;
        } catch (_error) {
          return fallback;
        }
      }

      function saveConfig(storageKey, config) {
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(config));
        } catch (_error) {
          // Ignore storage errors.
        }
      }

      function applyTimeryConfigFallback(config) {
        var panel = document.getElementById("timeryPanel");
        if (!panel) return;

        var layout = String(config.layout || "list").toLowerCase();
        var isGrid = layout === "grid";
        var isCompact = layout === "compact";
        var bgColor = /^#[\da-f]{6}$/i.test(String(config.bgColor || "")) ? String(config.bgColor) : "#101420";
        var showTitle = config.showTitle !== false;
        var showProgress = config.showProgress !== false;
        var showStatus = config.showStatus !== false;

        panel.classList.toggle("timery-layout-grid", isGrid);
        panel.classList.toggle("timery-layout-compact", isCompact);
        panel.classList.toggle("timery-hide-title", !showTitle);
        panel.classList.toggle("timery-hide-progress", !showProgress);
        panel.classList.toggle("timery-hide-status", !showStatus);
        panel.style.setProperty("--timery-card-bg", bgColor);
      }

      function applyLicznikiConfigFallback(config) {
        var panel = document.getElementById("licznikiPanel");
        if (!panel) return;

        var layout = String(config.layout || "grid").toLowerCase();
        var isList = layout === "list";
        var isCompact = layout === "compact";
        var isGrid = !isList && !isCompact;
        var bgColor = /^#[\da-f]{6}$/i.test(String(config.bgColor || "")) ? String(config.bgColor) : "#101420";
        var showTitle = config.showTitle !== false;
        var showStatus = config.showStatus !== false;
        var showValue = config.showValue !== false;

        panel.classList.toggle("liczniki-layout-list", isList);
        panel.classList.toggle("liczniki-layout-grid", isGrid);
        panel.classList.toggle("liczniki-layout-compact", isCompact);
        panel.classList.toggle("liczniki-hide-title", !showTitle);
        panel.classList.toggle("liczniki-hide-status", !showStatus);
        panel.classList.toggle("liczniki-hide-value", !showValue);
        panel.style.setProperty("--liczniki-card-bg", bgColor);
      }

      function bindTimeryConfigControlsFallback() {
        var storageKey = "takuu_timery_view_config";
        var defaultConfig = {
          panelOpen: false,
          layout: "list",
          bgColor: "#101420",
          showTitle: true,
          showProgress: true,
          showStatus: true
        };
        var config = readConfig(storageKey, defaultConfig);
        applyTimeryConfigFallback(config);

        var layoutSelect = document.getElementById("timeryLayoutSelect");
        var colorInput = document.getElementById("timeryBgColorInput");
        var showTitle = document.getElementById("timeryShowTitle");
        var showProgress = document.getElementById("timeryShowProgress");
        var showStatus = document.getElementById("timeryShowStatus");

        if (layoutSelect) {
          layoutSelect.value = String(config.layout || "list");
          layoutSelect.addEventListener("change", function () {
            config.layout = String(layoutSelect.value || "list").toLowerCase();
            saveConfig(storageKey, config);
            applyTimeryConfigFallback(config);
          });
        }

        if (colorInput) {
          colorInput.value = /^#[\da-f]{6}$/i.test(String(config.bgColor || "")) ? String(config.bgColor) : "#101420";
          colorInput.addEventListener("input", function () {
            if (!/^#[\da-f]{6}$/i.test(String(colorInput.value || ""))) return;
            config.bgColor = String(colorInput.value);
            saveConfig(storageKey, config);
            applyTimeryConfigFallback(config);
          });
        }

        if (showTitle) {
          showTitle.checked = config.showTitle !== false;
          showTitle.addEventListener("change", function () {
            config.showTitle = !!showTitle.checked;
            saveConfig(storageKey, config);
            applyTimeryConfigFallback(config);
          });
        }

        if (showProgress) {
          showProgress.checked = config.showProgress !== false;
          showProgress.addEventListener("change", function () {
            config.showProgress = !!showProgress.checked;
            saveConfig(storageKey, config);
            applyTimeryConfigFallback(config);
          });
        }

        if (showStatus) {
          showStatus.checked = config.showStatus !== false;
          showStatus.addEventListener("change", function () {
            config.showStatus = !!showStatus.checked;
            saveConfig(storageKey, config);
            applyTimeryConfigFallback(config);
          });
        }
      }

      function bindLicznikiConfigControlsFallback() {
        var storageKey = "takuu_liczniki_view_config";
        var defaultConfig = {
          panelOpen: false,
          layout: "grid",
          bgColor: "#101420",
          showTitle: true,
          showStatus: true,
          showValue: true
        };
        var config = readConfig(storageKey, defaultConfig);
        applyLicznikiConfigFallback(config);

        var layoutSelect = document.getElementById("licznikiLayoutSelect");
        var colorInput = document.getElementById("licznikiBgColorInput");
        var showTitle = document.getElementById("licznikiShowTitle");
        var showStatus = document.getElementById("licznikiShowStatus");
        var showValue = document.getElementById("licznikiShowValue");

        if (layoutSelect) {
          layoutSelect.value = String(config.layout || "grid");
          layoutSelect.addEventListener("change", function () {
            config.layout = String(layoutSelect.value || "grid").toLowerCase();
            saveConfig(storageKey, config);
            applyLicznikiConfigFallback(config);
          });
        }

        if (colorInput) {
          colorInput.value = /^#[\da-f]{6}$/i.test(String(config.bgColor || "")) ? String(config.bgColor) : "#101420";
          colorInput.addEventListener("input", function () {
            if (!/^#[\da-f]{6}$/i.test(String(colorInput.value || ""))) return;
            config.bgColor = String(colorInput.value);
            saveConfig(storageKey, config);
            applyLicznikiConfigFallback(config);
          });
        }

        if (showTitle) {
          showTitle.checked = config.showTitle !== false;
          showTitle.addEventListener("change", function () {
            config.showTitle = !!showTitle.checked;
            saveConfig(storageKey, config);
            applyLicznikiConfigFallback(config);
          });
        }

        if (showStatus) {
          showStatus.checked = config.showStatus !== false;
          showStatus.addEventListener("change", function () {
            config.showStatus = !!showStatus.checked;
            saveConfig(storageKey, config);
            applyLicznikiConfigFallback(config);
          });
        }

        if (showValue) {
          showValue.checked = config.showValue !== false;
          showValue.addEventListener("change", function () {
            config.showValue = !!showValue.checked;
            saveConfig(storageKey, config);
            applyLicznikiConfigFallback(config);
          });
        }
      }

      function readStorageJsonFallback(key, fallback) {
        try {
          var raw = window.localStorage.getItem(key);
          if (!raw) return fallback;
          var parsed = JSON.parse(raw);
          return parsed == null ? fallback : parsed;
        } catch (_error) {
          return fallback;
        }
      }

      function saveStorageJsonFallback(key, value) {
        try {
          window.localStorage.setItem(key, JSON.stringify(value));
        } catch (_error) {
          // Ignore storage write failures.
        }
      }

      function setInlineLoginStatus(element, text, type) {
        if (!element) return;
        element.textContent = String(text || "");
        element.classList.toggle("is-error", type === "error");
        element.classList.toggle("is-success", type === "success");
      }

      function getAdminRoutePathFallback() {
        return window.location.protocol === "file:" ? "index.html?view=admin" : "/admin";
      }

      function getInlineAdminAccountsFallback() {
        var root = {
          id: "root-admin",
          login: ROOT_ADMIN_LOGIN,
          password: ROOT_ADMIN_PASSWORD,
          canAccessAdmin: true,
          canAccessStreamObs: true,
          canAccessBindings: true,
          isRoot: true
        };
        var stored = readStorageJsonFallback("takuu_admin_accounts", []);
        var list = Array.isArray(stored) ? stored.slice() : [];
        var hasRoot = list.some(function (item) {
          return item && (String(item.id || "") === "root-admin" || String(item.login || "") === ROOT_ADMIN_LOGIN);
        });
        if (!hasRoot) {
          list.unshift(root);
        }
        return list;
      }

      function tryInlineLocalLoginFallback(login, password) {
        var cleanLogin = String(login || "").trim();
        var cleanPassword = String(password || "").trim();
        if (!cleanLogin || !cleanPassword) return null;

        if (cleanLogin.toLowerCase() === String(ROOT_ADMIN_LOGIN || "").toLowerCase() && cleanPassword === ROOT_ADMIN_PASSWORD) {
          return {
            login: ROOT_ADMIN_LOGIN,
            canAccessAdmin: true,
            canAccessStreamObs: true,
            canAccessBindings: true
          };
        }

        var accounts = getInlineAdminAccountsFallback();
        for (var i = 0; i < accounts.length; i += 1) {
          var account = accounts[i] || {};
          if (!(account && (account.canAccessAdmin || account.canAccessStreamObs || account.canAccessBindings || account.isRoot))) continue;
          if (String(account.login || "") === cleanLogin && String(account.password || "") === cleanPassword) {
            return account;
          }
        }
        return null;
      }

      function bindInlineLoginFallback(route) {
        if (window.__takuuNativeLoginReady) return;
        if (route !== "login" && route !== "admin") return;

        var form = document.getElementById("adminLoginForm");
        var passwordInput = document.getElementById("adminLoginPassword");
        var showPasswordInput = document.getElementById("adminShowPassword");
        var passwordToggleBtn = document.getElementById("adminPasswordToggle");
        var passwordToggleIcon = document.getElementById("adminPasswordToggleIcon");
        var rememberInput = document.getElementById("adminRememberMe");
        var loginStatus = document.getElementById("adminLoginStatus");
        var discordStatus = document.getElementById("adminDiscordStatus");
        var discordBtn = document.getElementById("adminDiscordLoginBtn");
        var rememberStorageKey = "takuu_admin_remember_me";
        var rememberMaxAgeMs = 3 * 24 * 60 * 60 * 1000;

        function readRememberFallback() {
          var now = Date.now();
          try {
            var rawValue = String(window.localStorage.getItem(rememberStorageKey) || "").trim();
            if (!rawValue) return false;

            // Backward compatibility for older boolean storage format.
            if (rawValue === "1") {
              var migratedExpiresAt = now + rememberMaxAgeMs;
              window.localStorage.setItem(rememberStorageKey, String(migratedExpiresAt));
              return true;
            }

            var expiresAt = Number(rawValue);
            if (!Number.isFinite(expiresAt) || expiresAt <= now) {
              window.localStorage.removeItem(rememberStorageKey);
              return false;
            }
            return true;
          } catch (_error) {
            return false;
          }
        }

        function saveRememberFallback(enabled) {
          var normalized = Boolean(enabled);
          try {
            if (normalized) {
              var expiresAt = Date.now() + rememberMaxAgeMs;
              window.localStorage.setItem(rememberStorageKey, String(expiresAt));
            } else {
              window.localStorage.removeItem(rememberStorageKey);
            }
          } catch (_error) {
            // Ignore storage write failures.
          }
          if (rememberInput) {
            rememberInput.checked = normalized;
          }
        }

        if (rememberInput) {
          rememberInput.checked = readRememberFallback();
          rememberInput.addEventListener("change", function () {
            saveRememberFallback(rememberInput.checked);
          });
        }

        function setFallbackPasswordVisibility(visible) {
          if (passwordInput) {
            passwordInput.type = visible ? "text" : "password";
          }
          if (showPasswordInput && showPasswordInput.type === "checkbox") {
            showPasswordInput.checked = Boolean(visible);
          }
          if (passwordToggleBtn) {
            passwordToggleBtn.setAttribute("aria-pressed", visible ? "true" : "false");
            passwordToggleBtn.setAttribute("aria-label", visible ? "Ukryj hasło" : "Pokaż hasło");
          }
          if (passwordToggleIcon) {
            passwordToggleIcon.classList.toggle("fa-eye", !visible);
            passwordToggleIcon.classList.toggle("fa-eye-slash", visible);
          }
        }

        if (showPasswordInput && passwordInput && showPasswordInput.type === "checkbox") {
          showPasswordInput.addEventListener("change", function () {
            setFallbackPasswordVisibility(showPasswordInput.checked);
          });
        }

        if (passwordToggleBtn) {
          passwordToggleBtn.addEventListener("click", function () {
            var nextVisible = !(passwordInput && passwordInput.type === "text");
            setFallbackPasswordVisibility(nextVisible);
            if (passwordInput) {
              passwordInput.focus();
            }
          });
        }

        setFallbackPasswordVisibility(Boolean(passwordInput && passwordInput.type === "text"));

        if (form) {
          form.addEventListener(
            "submit",
            function (event) {
              event.preventDefault();

              var formData = new FormData(form);
              var login = String(formData.get("login") || "").trim();
              var password = String(formData.get("password") || "").trim();
              var matched = tryInlineLocalLoginFallback(login, password);

              if (!matched) {
                if (passwordInput) {
                  passwordInput.value = "";
                  passwordInput.focus();
                }
                setInlineLoginStatus(loginStatus, "Nieprawidłowy login lub hasło.", "error");
                return;
              }

              try {
                window.sessionStorage.setItem("takuu_admin_auth", String(matched.login || login));
              } catch (_error) {
                // Ignore session storage failures.
              }

              saveRememberFallback(Boolean(rememberInput && rememberInput.checked));
              setFallbackPasswordVisibility(false);
              setInlineLoginStatus(loginStatus, "Zalogowano pomyślnie.", "success");
              window.location.href = getAdminRoutePathFallback();
            },
            true
          );
        }

        function runDiscordCallbackFallback() {
          if (!window.TakuuWebhook || typeof window.TakuuWebhook.completeDiscordAdminLogin !== "function") return;

          var params = new URLSearchParams(window.location.search || "");
          var hasOAuthParams = params.has("code") || params.has("error");
          if (!hasOAuthParams) return;

          var accounts = getInlineAdminAccountsFallback();
          Promise.resolve(window.TakuuWebhook.completeDiscordAdminLogin(accounts))
            .then(function (result) {
              if (!result || result.skipped) return;

              if (result.accountsChanged) {
                saveStorageJsonFallback("takuu_admin_accounts", accounts);
              }

              var hasAnyAdminAccess = !!(
                result &&
                (result.hasAnyAdminAccess == null ? result.canAccessAdmin : result.hasAnyAdminAccess)
              );
              if (!result.ok || !hasAnyAdminAccess) {
                setInlineLoginStatus(
                  discordStatus,
                  (result && result.error) || "Brak permisji do Panelu Admina, StreamOBS ani Powiązań.",
                  "error"
                );
                return;
              }

              var session = result.session || {};
              var loginValue = session.username ? "discord:" + session.username : "discord";
              try {
                window.sessionStorage.setItem("takuu_admin_auth", loginValue);
              } catch (_error) {
                // Ignore session storage failures.
              }

              setInlineLoginStatus(discordStatus, "Logowanie Discord zakończone pomyślnie.", "success");
              window.location.href = getAdminRoutePathFallback();
            })
            .catch(function () {
              setInlineLoginStatus(discordStatus, "Nie udało się zakończyć logowania Discord.", "error");
            });
        }

        if (discordBtn) {
          if (!window.TakuuWebhook || typeof window.TakuuWebhook.startDiscordLogin !== "function") {
            discordBtn.disabled = true;
            setInlineLoginStatus(discordStatus, "Brak webhook.js lub konfiguracji Discord.", "error");
          } else {
            if (typeof window.TakuuWebhook.isDiscordLoginAvailable === "function") {
              var availability = window.TakuuWebhook.isDiscordLoginAvailable();
              if (!availability.ok) {
                discordBtn.disabled = true;
                setInlineLoginStatus(
                  discordStatus,
                  availability.error || "Logowanie Discord jest niedostepne.",
                  "error"
                );
              }
            }

            discordBtn.addEventListener("click", function () {
              if (discordBtn.disabled) return;
              saveRememberFallback(Boolean(rememberInput && rememberInput.checked));
              setInlineLoginStatus(discordStatus, "Przekierowanie do logowania Discord...", "success");
              Promise.resolve(window.TakuuWebhook.startDiscordLogin()).catch(function () {
                setInlineLoginStatus(discordStatus, "Nie udało się uruchomić logowania Discord.", "error");
              });
            });
          }
        }

        runDiscordCallbackFallback();
      }

      function bindKaryCurrencyFallback() {
        if (window.__takuuNativeKaryCurrencyReady) return;

        var switchEl = document.querySelector(".kary-currency-switch");
        if (!switchEl) return;

        var listChill = document.getElementById("karyPriceListChill");
        var listHard = document.getElementById("karyPriceListHard");
        var emptyChill = document.getElementById("karyPriceEmptyChill");
        var emptyHard = document.getElementById("karyPriceEmptyHard");
        var STORAGE_KEY = "takuu_kary_currency_fallback";

        function parseFirstInteger(value) {
          var match = String(value || "").match(/-?\d+/);
          if (!match) return 0;
          var parsed = Number(match[0]);
          return Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : 0;
        }

        function setCurrency(currency) {
          var clean = String(currency || "").toLowerCase();
          var next = clean === "suby" || clean === "kicksy" ? clean : "pln";

          var buttons = switchEl.querySelectorAll("button[data-currency]");
          buttons.forEach(function (button) {
            var active = String(button.getAttribute("data-currency") || "").toLowerCase() === next;
            button.classList.toggle("is-active", active);
            button.setAttribute("aria-pressed", active ? "true" : "false");
          });

          var dataKey = next === "suby" ? "suby" : next === "kicksy" ? "kicksy" : "pln";
          var priceNodes = document.querySelectorAll(".kary-price-value");
          priceNodes.forEach(function (price) {
            price.classList.toggle("is-pln", dataKey === "pln");
            price.classList.toggle("is-suby", dataKey === "suby");
            price.classList.toggle("is-kicksy", dataKey === "kicksy");
            var nextValue = String(price.dataset[dataKey] || "").trim();
            if (nextValue) {
              price.textContent = nextValue;
              return;
            }
            if (dataKey === "suby") {
              price.textContent = "0 Suby";
              return;
            }
            if (dataKey === "kicksy") {
              price.textContent = "0 Kicksy";
              return;
            }
            price.textContent = "0 PLN";
          });

          var pairs = [
            { list: listChill, empty: emptyChill },
            { list: listHard, empty: emptyHard }
          ];
          pairs.forEach(function (pair) {
            if (!pair.list) return;
            var rows = Array.from(pair.list.querySelectorAll("li"));
            var visible = 0;

            rows.forEach(function (row) {
              var priceEl = row.querySelector(".kary-price-value");
              if (!priceEl) {
                row.hidden = false;
                visible += 1;
                return;
              }

              if (dataKey === "pln") {
                row.hidden = false;
                visible += 1;
                return;
              }

              var valueRaw = String(priceEl.dataset[dataKey] || "");
              var show = parseFirstInteger(valueRaw) > 0;
              row.hidden = !show;
              if (show) visible += 1;
            });

            var hasItems = visible > 0;
            pair.list.hidden = !hasItems;
            pair.list.style.display = hasItems ? "grid" : "none";
            if (pair.empty) {
              pair.empty.hidden = hasItems;
              pair.empty.style.display = hasItems ? "none" : "block";
            }
          });

          try {
            window.localStorage.setItem(STORAGE_KEY, next);
          } catch (_error) {
            // Ignore storage write failures.
          }
        }

        switchEl.addEventListener("click", function (event) {
          var target = event.target;
          if (!target || typeof target.closest !== "function") return;
          var button = target.closest("button[data-currency]");
          if (!button) return;
          event.preventDefault();
          setCurrency(button.getAttribute("data-currency"));
        });

        var initial = "pln";
        try {
          var stored = String(window.localStorage.getItem(STORAGE_KEY) || "").toLowerCase();
          if (stored === "pln" || stored === "suby" || stored === "kicksy") {
            initial = stored;
          }
        } catch (_error) {
          // Ignore storage read failures.
        }
        setCurrency(initial);
      }

      function bindKaryPopupButtons() {
        var buttons = document.querySelectorAll("[data-kary-open-window]");
        if (!buttons || !buttons.length) return;

        buttons.forEach(function (button) {
          button.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (typeof event.stopImmediatePropagation === "function") {
              event.stopImmediatePropagation();
            }

            var target = String(button.getAttribute("data-kary-open-window") || "").toLowerCase();
            var href = String(button.getAttribute("href") || "").trim();
            if (!href) return;

            var absoluteHref = href;
            try {
              absoluteHref = new URL(href, window.location.href).href;
            } catch (_error) {
              absoluteHref = href;
            }

            var popupWidth = 1240;
            var popupHeight = target === "liczniki" ? 760 : 920;
            var left = Math.max(0, Math.floor((window.screen.availWidth - popupWidth) / 2));
            var top = Math.max(0, Math.floor((window.screen.availHeight - popupHeight) / 2));
            var popupName = target === "liczniki" ? "takuu_liczniki_popup" : "takuu_timery_popup";
            var popupFeatures = [
              "popup=yes",
              "noopener=yes",
              "noreferrer=yes",
              "resizable=yes",
              "scrollbars=yes",
              "toolbar=no",
              "location=no",
              "menubar=no",
              "status=no",
              "personalbar=no",
              "directories=no",
              "copyhistory=no",
              "width=" + popupWidth,
              "height=" + popupHeight,
              "left=" + left,
              "top=" + top
            ].join(",");

            var popup = window.open(absoluteHref, popupName, popupFeatures);
            if (popup) {
              try {
                popup.opener = null;
                popup.focus();
              } catch (_error) {
                // Ignore popup focus errors.
              }
              return;
            }

            window.alert("Przegladarka zablokowala nowe okno. Zezwol na popupy dla tej strony.");
          }, true);
        });
      }

      function runIntroTypingFallback(route) {
        if (route !== "home") return;

        window.setTimeout(function () {
          if (window.__takuuIntroTypingTriggered) return;

          var titleEl = document.querySelector(".stream-intro-title");
          var subtitleEl = document.querySelector(".stream-intro-subtitle");
          if (!titleEl || !subtitleEl) return;

          var accentEl = titleEl.querySelector(".stream-intro-title-accent");
          var fullTitle = String(titleEl.textContent || "").replace(/\s+/g, " ").trim();
          var accentText = accentEl ? String(accentEl.textContent || "").replace(/\s+/g, " ").trim() : "";
          var accentIndex = accentText ? fullTitle.indexOf(accentText) : -1;
          var beforeText = accentIndex >= 0 ? fullTitle.slice(0, accentIndex) : fullTitle;
          var afterText = accentIndex >= 0 ? fullTitle.slice(accentIndex + accentText.length) : "";
          var fullSubtitle = String(subtitleEl.textContent || "").replace(/\s+/g, " ").trim();

          if (!fullTitle || !fullSubtitle) return;

          var escapeHtml = function (value) {
            return String(value || "")
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/\"/g, "&quot;")
              .replace(/'/g, "&#39;");
          };

          var titleLen = beforeText.length + accentText.length + afterText.length;
          var subtitleLen = fullSubtitle.length;
          var titleCount = 0;
          var subtitleCount = 0;
          var phase = "title";
          var holdTicks = 0;

          titleEl.style.opacity = "1";
          titleEl.style.transform = "none";
          subtitleEl.style.opacity = "1";
          subtitleEl.style.transform = "none";
          titleEl.innerHTML = "";
          subtitleEl.textContent = "";
          titleEl.classList.add("is-typing");
          subtitleEl.classList.remove("is-typing");

          var timerId = window.setInterval(function () {
            if (phase === "title") {
              if (titleCount < titleLen) {
                titleCount += 1;
                if (titleCount <= beforeText.length) {
                  titleEl.innerHTML = escapeHtml(beforeText.slice(0, titleCount));
                } else if (titleCount <= beforeText.length + accentText.length) {
                  titleEl.innerHTML =
                    escapeHtml(beforeText) +
                    '<span class="stream-intro-title-accent">' +
                    escapeHtml(accentText.slice(0, titleCount - beforeText.length)) +
                    "</span>";
                } else {
                  titleEl.innerHTML =
                    escapeHtml(beforeText) +
                    '<span class="stream-intro-title-accent">' + escapeHtml(accentText) + "</span>" +
                    escapeHtml(afterText.slice(0, titleCount - beforeText.length - accentText.length));
                }
                return;
              }
              phase = "hold";
              titleEl.classList.remove("is-typing");
              holdTicks = 0;
              return;
            }

            if (phase === "hold") {
              holdTicks += 1;
              if (holdTicks < 4) return;
              phase = "subtitle";
              subtitleEl.classList.add("is-typing");
              return;
            }

            if (phase === "subtitle") {
              if (subtitleCount < subtitleLen) {
                subtitleCount += 1;
                subtitleEl.textContent = fullSubtitle.slice(0, subtitleCount);
                return;
              }
              subtitleEl.classList.remove("is-typing");
              window.clearInterval(timerId);
            }
          }, 40);
        }, 700);
      }

      document.addEventListener("DOMContentLoaded", function () {
        if (window.__takuuNativeLoginReady && window.__takuuNativeConfigReady) {
          return;
        }

        var isObsOverlay = Boolean(window.__takuuObsOverlayMode);
        if (!isObsOverlay) {
          try {
            var params = new URLSearchParams(window.location.search || "");
            var obsRaw = String(params.get("obs") || params.get("overlay") || "").trim().toLowerCase();
            isObsOverlay =
              obsRaw === "1" ||
              obsRaw === "true" ||
              obsRaw === "yes" ||
              obsRaw === "on";
          } catch (_error) {
            isObsOverlay = false;
          }
        }
        var route = isObsOverlay ? "admin" : detectRoute();
        var body = document.body;
        if (body) {
          var cleaned = String(body.className || "").replace(/\broute-[^\s]+/g, "").trim();
          body.className = cleaned;
          body.classList.add("route-" + route);
          if (isObsOverlay) {
            body.classList.add("obs-wheel-overlay");
          }
        }

        var mainWrap = document.querySelector("main.wrap");
        var karyPanel = document.getElementById("karyPanel");
        var timeryPanel = document.getElementById("timeryPanel");
        var licznikiPanel = document.getElementById("licznikiPanel");
        var statsPanel = document.getElementById("statsPanel");
        var adminPanel = document.getElementById("adminPanel");
        var adminDashboard = document.getElementById("adminDashboard");
        var adminStreamObsTab = document.getElementById("adminStreamObsTab");
        var routePlaceholder = document.getElementById("routePlaceholder");
        var streamLayout = document.querySelector(".stream-layout");
        var friends = document.getElementById("friends");

        setVisible(mainWrap, route === "clips");
        setVisible(karyPanel, route === "kary");
        setVisible(timeryPanel, route === "timery");
        setVisible(licznikiPanel, route === "liczniki");
        setVisible(statsPanel, route === "stats");
        setVisible(adminPanel, route === "login" && !isObsOverlay);
        setVisible(adminDashboard, route === "admin");
        if (adminStreamObsTab) {
          setVisible(adminStreamObsTab, route === "admin");
          adminStreamObsTab.classList.toggle("is-active", route === "admin");
        }
        setVisible(routePlaceholder, route === "soon");
        setVisible(streamLayout, route === "home", "grid");
        setVisible(friends, route === "home");

        if (isObsOverlay) {
          var tabsToHide = ["adminMembersTab", "adminKaryTab", "adminBindingsTab", "adminAccountsTab"];
          tabsToHide.forEach(function (id) {
            var tab = document.getElementById(id);
            if (!tab) return;
            tab.hidden = true;
            tab.classList.remove("is-active");
          });

          var tabButtons = document.querySelectorAll(".admin-tab-btn");
          tabButtons.forEach(function (button) {
            var active = String(button.getAttribute("data-tab") || "") === "streamobs";
            button.classList.toggle("is-active", active);
            if (!active) {
              button.hidden = true;
            }
          });
        }

        if (!window.__takuuNativeConfigReady) {
          bindConfigToggle("timeryConfigBtn", "timeryConfigPanel", "takuu_timery_view_config");
          bindConfigToggle("licznikiConfigBtn", "licznikiConfigPanel", "takuu_liczniki_view_config");
          bindTimeryConfigControlsFallback();
          bindLicznikiConfigControlsFallback();
        }
        bindInlineLoginFallback(route);
        bindKaryCurrencyFallback();
        bindKaryPopupButtons();
        runIntroTypingFallback(route);
      });
    })();
  










