(() => {
  "use strict";

  const IS_FILE_PROTOCOL = window.location.protocol === "file:";
  const BODY_STREAMER_SLUG = String(
    (document.body && document.body.getAttribute("data-streamer-slug")) || ""
  ).trim();
  const BODY_STORAGE_NAMESPACE = String(
    (document.body && document.body.getAttribute("data-storage-namespace")) || ""
  ).trim();
  const DEFAULT_STREAMER_SLUG = "takuu";
  const STREAMER_SLUG = String(window.STREAMER_SLUG || BODY_STREAMER_SLUG || DEFAULT_STREAMER_SLUG)
    .trim()
    .toLowerCase() || DEFAULT_STREAMER_SLUG;
  const STORAGE_NAMESPACE = String(window.STORAGE_NAMESPACE || BODY_STORAGE_NAMESPACE || STREAMER_SLUG)
    .trim()
    .toLowerCase() || STREAMER_SLUG;
  const STREAMER_TITLE = String(window.STREAMER_TITLE || STREAMER_SLUG).trim() || STREAMER_SLUG;

  if (!window.STREAMER_SLUG) {
    window.STREAMER_SLUG = STREAMER_SLUG;
  }
  if (!window.STORAGE_NAMESPACE) {
    window.STORAGE_NAMESPACE = STORAGE_NAMESPACE;
  }

  function getStorageKey(name) {
    return `${STORAGE_NAMESPACE}_${String(name || "").trim()}`;
  }

  const ROUTES = {
    home: { path: "/", view: "home", title: `${STREAMER_TITLE} - Live` },
    clips: { path: "/klipy", view: "klipy", title: `${STREAMER_TITLE} - Klipy` },
    youtube: { path: "/youtube", view: "youtube", title: `${STREAMER_TITLE} - YouTube` },
    liczniki: { path: "/liczniki", view: "liczniki", title: `${STREAMER_TITLE} - Liczniki` },
    soon: { path: "/soon", view: "soon", title: `${STREAMER_TITLE} - Wkrotce` },
    login: { path: "/logowanie", view: "logowanie", title: `${STREAMER_TITLE} - Logowanie` },
    admin: { path: "/admin", view: "admin", title: `${STREAMER_TITLE} - Admin` }
  };

  const ROUTE_ALIASES = {
    "/": "home",
    "/index.html": "home",
    "/index.htm": "home",
    "/klipy": "clips",
    "/clips": "clips",
    "/youtube": "youtube",
    "/yt": "youtube",
    "/liczniki": "liczniki",
    "/soon": "soon",
    "/wkrotce": "soon",
    "/logowanie": "login",
    "/login": "login",
    "/admin": "admin"
  };

  const VIEW_ALIASES = {
    home: "home",
    klipy: "clips",
    clips: "clips",
    youtube: "youtube",
    yt: "youtube",
    liczniki: "liczniki",
    soon: "soon",
    wkrotce: "soon",
    logowanie: "login",
    login: "login",
    admin: "admin"
  };

  const ROUTE_BODY_CLASSES = Object.keys(ROUTES).map((routeName) => `route-${routeName}`);

  const streamShellEl = document.querySelector(".stream-shell");
  const streamLayoutEl = document.querySelector(".stream-layout");
  const mainWrapEl = document.querySelector("main.wrap");
  const friendsEl = document.getElementById("friends");
  const friendsGridEl = document.getElementById("friendsGrid") || document.querySelector(".friends-grid");
  const routePlaceholderEl = document.getElementById("routePlaceholder");
  const routeBadgeEl = document.getElementById("routeBadge");
  const licznikiPanelEl = document.getElementById("licznikiPanel");
  const youtubePanelEl = document.getElementById("youtubePanel");
  const youtubeChannelsGridEl = document.getElementById("youtubeChannelsGrid");
  const youtubeStatusEl = document.getElementById("youtubeStatus");
  const youtubeSortTabsEl = document.getElementById("youtubeSortTabs");
  const adminPanelEl = document.getElementById("adminPanel");
  const adminDashboardEl = document.getElementById("adminDashboard");
  const adminLoginFormEl = document.getElementById("adminLoginForm");
  const adminLoginStatusEl = document.getElementById("adminLoginStatus");
  const adminDiscordStatusEl = document.getElementById("adminDiscordStatus");
  const adminLoginPasswordEl = document.getElementById("adminLoginPassword");
  const adminPasswordToggleEl = document.getElementById("adminPasswordToggle");
  const adminPasswordToggleIconEl = document.getElementById("adminPasswordToggleIcon");
  const adminRememberMeEl = document.getElementById("adminRememberMe");
  const adminDiscordLoginBtnEl = document.getElementById("adminDiscordLoginBtn");
  const adminLogoutBtnEl = document.getElementById("adminLogoutBtn");
  const adminTabsWrapEl = document.querySelector(".admin-tabs");
  const adminMembersTabEl = document.getElementById("adminMembersTab");
  const adminAccountsTabEl = document.getElementById("adminAccountsTab");
  const adminLicznikiTabEl = document.getElementById("adminLicznikiTab");
  const adminYoutubeTabEl = document.getElementById("adminYoutubeTab");
  const adminBindingsTabEl = document.getElementById("adminBindingsTab");
  const adminMemberFormEl = document.getElementById("adminMemberForm");
  const adminMembersTableBodyEl = document.getElementById("adminMembersTableBody");
  const adminMemberStatusEl = document.getElementById("adminMemberStatus");
  const adminAccountFormEl = document.getElementById("adminAccountForm");
  const adminAccountsTableBodyEl = document.getElementById("adminAccountsTableBody");
  const adminAccountStatusEl = document.getElementById("adminAccountStatus");
  const adminLicznikFormEl = document.getElementById("adminLicznikForm");
  const adminLicznikiTableBodyEl = document.getElementById("adminLicznikiTableBody");
  const adminLicznikStatusEl = document.getElementById("adminLicznikStatus");
  const adminYoutubeFormEl = document.getElementById("adminYoutubeForm");
  const adminYoutubeTableBodyEl = document.getElementById("adminYoutubeTableBody");
  const adminYoutubeStatusEl = document.getElementById("adminYoutubeStatus");
  const adminLicznikFinishPickerModalEl = document.getElementById("adminLicznikFinishPickerModal");
  const adminLicznikFinishInputEl = document.getElementById("adminLicznikFinishInput");
  const adminLicznikFinishPickerStatusEl = document.getElementById("adminLicznikFinishPickerStatus");
  const adminLicznikFinishPickerCancelBtnEl = document.getElementById("adminLicznikFinishPickerCancelBtn");
  const adminLicznikFinishPickerChooseBtnEl = document.getElementById("adminLicznikFinishPickerChooseBtn");
  const adminLicznikFinishConfirmModalEl = document.getElementById("adminLicznikFinishConfirmModal");
  const adminLicznikFinishConfirmTextEl = document.getElementById("adminLicznikFinishConfirmText");
  const adminLicznikFinishConfirmCancelBtnEl = document.getElementById("adminLicznikFinishConfirmCancelBtn");
  const adminLicznikFinishConfirmApproveBtnEl = document.getElementById("adminLicznikFinishConfirmApproveBtn");
  const licznikiGridEl = document.getElementById("licznikiGrid");
  const statusEl = document.getElementById("status");
  const clipsEl = document.getElementById("clips");
  const refreshBtn = document.getElementById("refreshBtn");
  const streamPlayerEl = document.querySelector(".stream-player");
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

  const homeNavEl = document.querySelector(".stream-nav-item-home");
  const clipsNavEl = document.querySelector(".stream-nav-item-clips");
  const youtubeNavEl = document.querySelector(".stream-nav-item-youtube");
  const licznikiNavEl = document.querySelector(".stream-nav-item-liczniki");
  const soonNavEl = document.querySelector(".stream-nav-item-soon");
  const adminNavEl = document.querySelector(".stream-log");

  const CHANNEL_SLUG = STREAMER_SLUG;
  const JINA_PREFIX = "https://r.jina.ai/";
  const ALL_ORIGINS_RAW_PREFIX = "https://api.allorigins.win/raw?url=";
  const CORS_PROXY_PREFIX = "https://corsproxy.io/?";
  const LOCAL_ADMIN_STATE_ENDPOINT = "/api/admin/state";
  const LOCAL_KICK_CLIPS_ENDPOINT = "/api/kick/clips";
  const LOCAL_KICK_CHANNEL_ENDPOINT = "/api/kick/channel";
  const LOCAL_KICK_SUBSCRIPTIONS_ENDPOINT = "/api/kick/subscriptions";
  const LOCAL_KICK_OAUTH_START_ENDPOINT = "/api/kick/oauth/start";
  const LOCAL_KICK_OAUTH_STATUS_ENDPOINT = "/api/kick/oauth/status";
  const LOCAL_KICK_OAUTH_UNLINK_ENDPOINT = "/api/kick/oauth/unlink";
  const LOCAL_YOUTUBE_CHANNEL_ENDPOINT = "/api/youtube/channel";
  const KICK_OAUTH_PRIMARY_ORIGIN = "https://taku-live.pl";
  const KICK_OAUTH_ALLOWED_HOSTS = new Set(["taku-live.pl", "www.taku-live.pl"]);
  const KICK_SUBS_LAST_COUNT_STORAGE_KEY = `${STORAGE_NAMESPACE}:kick:last-subs-goal:${CHANNEL_SLUG}`;
  const CLIPS_MAX_ITEMS = 200; // liczba klipĂłw do zaĹ‚adowania w /klipy
  const CLIPS_FAST_LOAD_ITEMS = 60;
  const CHANNEL_AVATAR_FALLBACK = String(
    (document.body && document.body.getAttribute("data-channel-avatar-fallback")) ||
      "https://files.kick.com/images/user/196056/profile_image/conversion/5ed75600-4d1e-40ed-afb8-b2731a02ba10-fullsize.webp"
  ).trim() || "https://files.kick.com/images/user/196056/profile_image/conversion/5ed75600-4d1e-40ed-afb8-b2731a02ba10-fullsize.webp";
  const MEMBER_AVATAR_FALLBACK = String(window.MEMBER_AVATAR_FALLBACK || "/img/default_profil.png").trim() || "/img/default_profil.png";
  const CLIP_RENDER_BATCH_SIZE = 24;
  const CLIP_POSTER_EAGER_COUNT = 18;
  const CLIP_SOURCE_TIMEOUT_MS = 2600;
  const CLIP_VIEWER_AUTO_HIDE_DELAY_MS = 2000;
  const FRIENDS_LIVE_POLL_MS = 5000;
  const KICK_FOLLOWERS_POLL_MS = 2500;
  const STREAM_PLAYER_AUTO_REFRESH_MS = 2 * 60 * 1000;
  const STREAM_PLAYER_REFRESH_QUERY_KEY = "_streamRefresh";
  const KICK_OAUTH_STATUS_POLL_MS = 2000;
  const ADMIN_STATE_SYNC_DEBOUNCE_MS = 420;
  const ADMIN_STATE_REQUEST_TIMEOUT_MS = 2600;
  const KICK_CHANNEL_REQUEST_TIMEOUT_MS = 1600;
  const KICK_CHANNEL_PROXY_TIMEOUT_MS = 1400;
  const KICK_CHANNEL_JINA_TIMEOUT_MS = 1700;
  const ADMIN_SESSION_KEY = getStorageKey("admin_auth");
  const ADMIN_SESSION_PERSIST_KEY = getStorageKey("admin_auth_persist");
  const ADMIN_ACCOUNTS_KEY = getStorageKey("admin_accounts");
  const ADMIN_ACTIVE_TAB_KEY = getStorageKey("admin_active_tab");
  const ADMIN_REMEMBER_ME_KEY = getStorageKey("admin_remember_me");
  const ADMIN_REMEMBER_ME_MAX_AGE_MS = 3 * 24 * 60 * 60 * 1000;
  const ROOT_ADMIN_ID = "root-admin";
  const CCI_MEMBERS_KEY = getStorageKey("custom_members");
  const LICZNIKI_ITEMS_KEY = getStorageKey("liczniki_items");
  const YOUTUBE_CHANNELS_KEY = getStorageKey("youtube_channels");
  const YOUTUBE_SORT_MODE_KEY = getStorageKey("youtube_sort_mode");
  const YOUTUBE_FEED_FETCH_TIMEOUT_MS = 4200;
  const YOUTUBE_META_FETCH_TIMEOUT_MS = 4200;
  const YOUTUBE_API_FETCH_TIMEOUT_MS = 5200;
  const YOUTUBE_MAX_FEED_ITEMS = 25;
  const YOUTUBE_VISIBLE_VIDEO_COUNT = 5;
  const YOUTUBE_DEFAULT_SORT_MODE = "newest";
  const YOUTUBE_AVATAR_FALLBACK =
    String(window.YOUTUBE_AVATAR_FALLBACK || MEMBER_AVATAR_FALLBACK || "/img/default_profil.png").trim() || "/img/default_profil.png";
  const LICZNIKI_FIXED_UTC_OFFSET_MINUTES = 60;
  const LICZNIKI_FIXED_UTC_OFFSET_MS = LICZNIKI_FIXED_UTC_OFFSET_MINUTES * 60 * 1000;
  const LICZNIKI_MONTH_NAMES_PL = [
    "styczeĹ„",
    "luty",
    "marzec",
    "kwiecieĹ„",
    "maj",
    "czerwiec",
    "lipiec",
    "sierpieĹ„",
    "wrzesieĹ„",
    "paĹşdziernik",
    "listopad",
    "grudzieĹ„"
  ];
  // Keep root credential decoding stable even when STORAGE_NAMESPACE changes per streamer.
  const ADMIN_SECRET_XOR_KEY =
    String(window.ADMIN_SECRET_XOR_KEY || "strona-live_2026").trim() || "strona-live_2026";

  function normalizeMemberAvatar(rawValue) {
    const avatar = String(rawValue || "").trim();
    return avatar || MEMBER_AVATAR_FALLBACK;
  }

  let menuOutsideCloserBound = false;
  let clipViewerState = null;
  let clipViewerOpenSeq = 0;
  let clipPosterObserver = null;
  let clipRenderFrameId = 0;
  let clipRenderToken = 0;
  let clipsLoadSeq = 0;
  let friendsLivePollId = 0;
  let friendsLivePollBusy = false;
  let friendsLiveRequestSeq = 0;
  let kickFollowersPollId = 0;
  let kickFollowersPollBusy = false;
  let streamPlayerAutoRefreshId = 0;
  let streamPlayerBaseSrc = "";
  let lastKickChannelLiveState = false;
  let kickOAuthStatusPollId = 0;
  let kickOAuthStatusBusy = false;
  let cachedKickOAuthStatus = null;
  let kickOAuthHandlersBound = false;
  let lastKnownKickSubsCount = null;
  let loginHandlersBound = false;
  let logoutHandlerBound = false;
  let youtubeSortBound = false;
  let adminTabsBound = false;
  let adminMembersBound = false;
  let adminAccountsBound = false;
  let adminLicznikiBound = false;
  let adminYoutubeBound = false;
  let adminStateSyncTimerId = 0;
  let adminStateSyncInFlight = false;
  let adminStateSyncPending = false;
  let adminStateRemoteUpdatedAt = 0;
  let adminStateRemoteCache = null;
  let adminStateLastSyncError = "";
  let editingMemberId = "";
  let editingLicznikId = "";
  let editingYoutubeChannelId = "";
  let activeAdminTab = "members";
  let draggingMemberId = "";
  let draggingMemberRow = null;
  let draggingLicznikId = "";
  let draggingLicznikRow = null;
  let pendingLicznikFinishContext = null;
  let licznikiTickerId = 0;
  const downloadInProgress = new Set();
  const friendsLiveStateBySlug = new Map();
  let cciMembers = [];
  let adminAccounts = [];
  let licznikiItems = [];
  let youtubeChannels = [];
  let youtubeSortMode = YOUTUBE_DEFAULT_SORT_MODE;
  let youtubeRenderSeq = 0;
  const youtubeChannelDataCache = new Map();
  const visibleAdminPasswords = new Set();

  function normalizePath(pathname) {
    const raw = String(pathname || "").trim().toLowerCase();
    const pathOnly = raw.split("?")[0].split("#")[0];
    let normalized = pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`;

    normalized = normalized.replace(/\/{2,}/g, "/");
    if (normalized.length > 1 && normalized.endsWith("/")) {
      normalized = normalized.slice(0, -1);
    }

    return normalized || "/";
  }

  function normalizeComparableUrl(rawHref) {
    try {
      const url = new URL(rawHref, window.location.href);
      const path = normalizePath(url.pathname);
      return `${url.origin}${path}${url.search}`;
    } catch (_error) {
      return String(rawHref || "");
    }
  }

  function getRouteFromPath(pathname) {
    return ROUTE_ALIASES[normalizePath(pathname)] || "home";
  }

  function getRouteFromView(viewValue) {
    const normalizedView = String(viewValue || "").trim().toLowerCase();
    return VIEW_ALIASES[normalizedView] || "";
  }

  function getRouteFromLocation() {
    const params = new URLSearchParams(window.location.search || "");
    const byView = getRouteFromView(params.get("view"));
    if (byView) {
      return byView;
    }
    return getRouteFromPath(window.location.pathname);
  }

  function getRouteHref(routeName) {
    const route = ROUTES[routeName] || ROUTES.home;
    if (IS_FILE_PROTOCOL) {
      if (routeName === "home") {
        return "index.html";
      }
      return `index.html?view=${encodeURIComponent(route.view)}`;
    }
    return route.path;
  }

  function loadActiveAdminTab() {
    try {
      const stored = String(window.localStorage.getItem(ADMIN_ACTIVE_TAB_KEY) || "")
        .trim()
        .toLowerCase();
      if (
        stored === "members" ||
        stored === "accounts" ||
        stored === "liczniki" ||
        stored === "youtube" ||
        stored === "bindings"
      ) {
        return stored;
      }
    } catch (_error) {
      // Ignore storage errors.
    }
    return "members";
  }

  function saveActiveAdminTab(tabName) {
    try {
      window.localStorage.setItem(ADMIN_ACTIVE_TAB_KEY, String(tabName || "members"));
    } catch (_error) {
      // Ignore storage errors.
    }
  }

  function setAdminTabPanelState(panelEl, isActive) {
    if (!panelEl) {
      return;
    }
    panelEl.hidden = !isActive;
    panelEl.classList.toggle("is-active", Boolean(isActive));
    panelEl.style.display = isActive ? "" : "none";
  }

  function canAccessAdminTab(tabName) {
    const clean = String(tabName || "").trim().toLowerCase();
    if (clean === "accounts") {
      return hasPanelAdminAccess();
    }
    if (clean === "youtube") {
      return hasYouTubeTabAccess();
    }
    if (clean === "bindings") {
      return hasBindingsTabAccess();
    }
    if (clean === "liczniki") {
      return hasLicznikiTabAccess();
    }
    return hasMembersTabAccess();
  }

  function getFirstAccessibleAdminTab(preferredTab = "") {
    const candidates = [preferredTab, "members", "liczniki", "youtube", "accounts", "bindings"]
      .map((value) => String(value || "").trim().toLowerCase())
      .filter((value, index, array) => value && array.indexOf(value) === index);
    const firstAllowed = candidates.find((tabName) => canAccessAdminTab(tabName));
    return firstAllowed || "members";
  }

  function notifyAdminTabAccessDenied(tabName) {
    const clean = String(tabName || "").trim().toLowerCase();
    if (clean === "accounts") {
      setAdminAccountStatus("Brak permisji do zakĹ‚adki Panel Admina.", "error");
      return;
    }
    if (clean === "youtube") {
      setAdminYoutubeStatus("Brak permisji do zakładki YouTube.", "error");
      return;
    }
    if (clean === "bindings") {
      setAdminAccountStatus("Brak permisji do zakĹ‚adki PowiÄ…zania.", "error");
      return;
    }
    if (clean === "liczniki") {
      setAdminLicznikStatus("Brak permisji do zakĹ‚adki Liczniki.", "error");
      return;
    }
    setAdminMemberStatus("Brak permisji do zakĹ‚adki CzĹ‚onkowie CCI.", "error");
  }

  function setActiveAdminTab(tabName, options = {}) {
    const persist = options && options.persist !== false;
    const clean = String(tabName || "").trim().toLowerCase();
    let nextTab =
      clean === "members" || clean === "accounts" || clean === "liczniki" || clean === "youtube" || clean === "bindings"
        ? clean
        : "members";

    if (!canAccessAdminTab(nextTab)) {
      notifyAdminTabAccessDenied(nextTab);
      nextTab = getFirstAccessibleAdminTab(nextTab);
    }

    if (nextTab === "accounts" && !hasPanelAdminAccess()) {
      nextTab = "members";
      setAdminAccountStatus("Brak permisji do zakĹ‚adki Panel Admina.", "error");
    } else if (nextTab === "youtube" && !hasYouTubeTabAccess()) {
      nextTab = "members";
      setAdminYoutubeStatus("Brak permisji do zakĹ‚adki YouTube.", "error");
    } else if (nextTab === "bindings" && !hasBindingsTabAccess()) {
      nextTab = "members";
      setAdminAccountStatus("Brak permisji do zakĹ‚adki PowiÄ…zania.", "error");
    }

    if (adminTabsWrapEl) {
      const buttons = Array.from(adminTabsWrapEl.querySelectorAll(".admin-tab-btn[data-tab]"));
      buttons.forEach((button) => {
        const isActive = String(button.dataset.tab || "").trim().toLowerCase() === nextTab;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    }

    setAdminTabPanelState(adminMembersTabEl, nextTab === "members");
    setAdminTabPanelState(adminAccountsTabEl, nextTab === "accounts");
    setAdminTabPanelState(adminLicznikiTabEl, nextTab === "liczniki");
    setAdminTabPanelState(adminYoutubeTabEl, nextTab === "youtube");
    setAdminTabPanelState(adminBindingsTabEl, nextTab === "bindings");
    if (nextTab !== "liczniki") {
      closeAdminLicznikFinishModals();
    }

    if (nextTab === "bindings") {
      void fetchKickOAuthStatus(true);
    }

    activeAdminTab = nextTab;
    if (persist) {
      saveActiveAdminTab(nextTab);
    }
  }

  function bindAdminTabs() {
    if (!adminTabsWrapEl || adminTabsBound) {
      return;
    }
    adminTabsBound = true;

    adminTabsWrapEl.addEventListener("click", (event) => {
      const button = event.target.closest(".admin-tab-btn[data-tab]");
      if (!button || !adminTabsWrapEl.contains(button)) {
        return;
      }
      event.preventDefault();
      setActiveAdminTab(button.dataset.tab || "members");
    });
  }

  function escapeHtmlText(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function setPanelStatus(element, text, type = "info") {
    if (!element) {
      return;
    }
    element.textContent = String(text || "");
    element.classList.toggle("is-error", type === "error");
    element.classList.toggle("is-success", type === "success");
  }

  function setAdminMemberStatus(text, type = "info") {
    if (!adminMemberStatusEl) {
      return;
    }
    adminMemberStatusEl.textContent = String(text || "");
    adminMemberStatusEl.classList.toggle("is-error", type === "error");
    adminMemberStatusEl.classList.toggle("is-success", type === "success");
  }

  function setAdminAccountStatus(text, type = "info") {
    if (!adminAccountStatusEl) {
      return;
    }
    adminAccountStatusEl.textContent = String(text || "");
    adminAccountStatusEl.classList.toggle("is-error", type === "error");
    adminAccountStatusEl.classList.toggle("is-success", type === "success");
  }

  function setAdminLicznikStatus(text, type = "info") {
    if (!adminLicznikStatusEl) {
      return;
    }
    adminLicznikStatusEl.textContent = String(text || "");
    adminLicznikStatusEl.classList.toggle("is-error", type === "error");
    adminLicznikStatusEl.classList.toggle("is-success", type === "success");
  }

  function setAdminYoutubeStatus(text, type = "info") {
    setPanelStatus(adminYoutubeStatusEl, text, type);
  }

  function setYoutubeStatus(text, type = "info") {
    setPanelStatus(youtubeStatusEl, text, type);
  }

  function setAdminLicznikFinishPickerStatus(text, type = "info") {
    setPanelStatus(adminLicznikFinishPickerStatusEl, text, type);
  }

  function setActiveAdminSyncStatus(text, type = "info") {
    if (activeAdminTab === "members") {
      setAdminMemberStatus(text, type);
      return;
    }
    if (activeAdminTab === "liczniki") {
      setAdminLicznikStatus(text, type);
      return;
    }
    if (activeAdminTab === "youtube") {
      setAdminYoutubeStatus(text, type);
      return;
    }
    setAdminAccountStatus(text, type);
  }

  function normalizeAdminSyncErrorMessage(rawValue) {
    const text = String(rawValue || "").trim();
    if (!text) {
      return "nieznany bĹ‚Ä…d synchronizacji";
    }
    return text
      .replace(/^ADMIN_STATE_[A-Z_0-9]+:\s*/i, "")
      .replace(/^KV_[A-Z_0-9]+:\s*/i, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function notifyAdminStateSyncError(rawError) {
    const message = normalizeAdminSyncErrorMessage(rawError);
    adminStateLastSyncError = message;
    if (getRouteFromLocation() === "admin") {
      setActiveAdminSyncStatus(`BĹ‚Ä…d zapisu do Redis: ${message}`, "error");
    }
  }

  function notifyAdminStateSyncSuccess() {
    if (!adminStateLastSyncError) {
      return;
    }
    adminStateLastSyncError = "";
    if (getRouteFromLocation() === "admin") {
      setActiveAdminSyncStatus("Zmiany zapisane w Redis.", "success");
    }
  }

  function sanitizeMemberUrl(rawValue) {
    const input = String(rawValue || "").trim();
    if (!input) {
      return "";
    }

    let candidate = input;
    if (!/^https?:\/\//i.test(candidate)) {
      if (/^kick\.com\//i.test(candidate)) {
        candidate = `https://${candidate}`;
      } else {
        candidate = `https://kick.com/${candidate.replace(/^@+/, "").replace(/^\/+/, "")}`;
      }
    }

    const slug = getKickSlugFromUrl(candidate);
    if (!slug) {
      return "";
    }
    return `https://kick.com/${encodeURIComponent(slug)}`;
  }

  function createMemberId(seed = "") {
    const cleanSeed = String(seed || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const stamp = Date.now().toString(36);
    const rand = Math.random().toString(36).slice(2, 8);
    return `member-${cleanSeed || "cci"}-${stamp}-${rand}`;
  }

  function extractBaseMembersFromGrid() {
    if (!friendsGridEl) {
      return [];
    }

    const cards = Array.from(friendsGridEl.querySelectorAll(".friend-card"));
    return cards
      .map((card, index) => {
        const name = String(card.querySelector(".friend-name")?.textContent || "").trim();
        const url = sanitizeMemberUrl(card.getAttribute("href") || "");
        const avatar = String(card.querySelector(".friend-avatar")?.getAttribute("src") || "").trim();
        if (!name || !url) {
          return null;
        }
        const slug = getKickSlugFromUrl(url) || `base-${index + 1}`;
        return {
          id: `base-${slug}`,
          name,
          url,
          avatar: normalizeMemberAvatar(avatar)
        };
      })
      .filter(Boolean);
  }

  function normalizeMemberEntry(entry, index = 0) {
    const source = entry && typeof entry === "object" ? entry : {};
    const name = String(source.name || "").trim();
    const url = sanitizeMemberUrl(source.url || source.kick || source.kickUrl || "");
    if (!name || !url) {
      return null;
    }
    const avatar = normalizeMemberAvatar(source.avatar);
    const id = String(source.id || "").trim() || createMemberId(`${getKickSlugFromUrl(url)}-${index}`);
    return { id, name, url, avatar };
  }

  function loadCciMembers() {
    const baseMembers = extractBaseMembersFromGrid();
    const stored = readStorageJsonFallback(CCI_MEMBERS_KEY, null);
    if (!Array.isArray(stored) || !stored.length) {
      return baseMembers;
    }

    const normalizedStored = stored.map((entry, index) => normalizeMemberEntry(entry, index)).filter(Boolean);
    if (!normalizedStored.length) {
      return baseMembers;
    }

    // If storage already contains full list (including base members), trust it.
    // Legacy fix: if a base member avatar was previously rewritten to default fallback,
    // restore explicit avatar from index.html when available.
    if (normalizedStored.some((member) => String(member.id || "").startsWith("base-"))) {
      const baseById = new Map(baseMembers.map((member) => [String(member.id || ""), member]));
      let changed = false;
      const migrated = normalizedStored.map((member) => {
        const memberId = String(member.id || "");
        if (!memberId.startsWith("base-")) {
          return member;
        }

        const baseMember = baseById.get(memberId);
        if (!baseMember) {
          return member;
        }

        const storedAvatar = String(member.avatar || "").trim();
        const baseAvatar = String(baseMember.avatar || "").trim();
        if (
          (!storedAvatar || storedAvatar === MEMBER_AVATAR_FALLBACK) &&
          baseAvatar &&
          baseAvatar !== MEMBER_AVATAR_FALLBACK
        ) {
          changed = true;
          return {
            ...member,
            avatar: baseAvatar
          };
        }

        return member;
      });

      if (changed) {
        saveStorageJsonFallback(CCI_MEMBERS_KEY, migrated);
      }
      return migrated;
    }

    // Backward compatibility: old storage could contain only custom members.
    const byUrl = new Set(baseMembers.map((member) => String(member.url || "").toLowerCase()));
    const merged = [...baseMembers];
    normalizedStored.forEach((member) => {
      const urlKey = String(member.url || "").toLowerCase();
      if (byUrl.has(urlKey)) {
        return;
      }
      byUrl.add(urlKey);
      merged.push(member);
    });
    return merged;
  }

  function saveCciMembers() {
    saveStorageJsonFallback(CCI_MEMBERS_KEY, cciMembers);
    scheduleAdminStateSync();
    void pushAdminStateToRemote();
  }

  function normalizeLicznikMode(modeValue) {
    const cleanMode = String(modeValue || "").trim().toLowerCase();
    return cleanMode === "until" ? "until" : "since";
  }

  function sanitizeLicznikImageUrl(rawValue) {
    const clean = String(rawValue || "").trim();
    if (!clean) {
      return "";
    }

    if (/^data:image\//i.test(clean)) {
      return clean;
    }

    try {
      const parsed = new URL(clean, window.location.href);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return "";
      }
      return parsed.href;
    } catch (_error) {
      return "";
    }
  }

  function getLicznik77LogoUrl() {
    const rawUrl = String(document.body && document.body.getAttribute("data-licznik-77-logo-url") || "").trim();
    return rawUrl || "/img/77logo.webp";
  }

  function getDefaultLicznikImageByTitle(titleValue) {
    const cleanTitle = String(titleValue || "").trim().toLowerCase();
    if (cleanTitle === "77rp 3.0" || cleanTitle === "77rp wl:off") {
      return getLicznik77LogoUrl();
    }
    return "";
  }

  function createLicznikId(seed = "") {
    const cleanSeed = String(seed || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const stamp = Date.now().toString(36);
    const rand = Math.random().toString(36).slice(2, 8);
    return `licznik-${cleanSeed || "item"}-${stamp}-${rand}`;
  }

  function normalizeLegacyLicznikTargetDate(titleValue, targetDateRaw) {
    const title = String(titleValue || "").trim().toLowerCase();
    const rawDate = String(targetDateRaw || "").trim();

    // Legacy fix:
    // Keep base counters in local wall-clock format (without explicit timezone),
    // so all cards behave consistently and are not shifted by DST changes.
    if (
      title === "77rp wl:on 3.0" &&
      (
        /^2023-07-07t00:00(?::00)?$/i.test(rawDate) ||
        /^2023-07-07t00:00(?::00)?\+01:00$/i.test(rawDate) ||
        /^2023-07-07t00:00(?::00)?\+02:00$/i.test(rawDate) ||
        /^2023-07-06t22:00(?::00)?(?:\.000)?z$/i.test(rawDate) ||
        /^2023-07-06t23:00(?::00)?(?:\.000)?z$/i.test(rawDate)
      )
    ) {
      return "2023-07-07T00:00:00";
    }

    // Canonical local values for remaining base counters.
    if (
      title === "77rp wl:off" &&
      (
        /^2025-12-17t18:00(?::00)?$/i.test(rawDate) ||
        /^2025-12-17t18:00(?::00)?\+01:00$/i.test(rawDate) ||
        /^2025-12-17t18:00(?::00)?\+02:00$/i.test(rawDate) ||
        /^2025-12-17t16:00(?::00)?(?:\.000)?z$/i.test(rawDate) ||
        /^2025-12-17t17:00(?::00)?(?:\.000)?z$/i.test(rawDate) ||
        /^2025-12-17t18:00(?::00)?(?:\.000)?z$/i.test(rawDate)
      )
    ) {
      return "2025-12-17T18:00:00";
    }
    if (
      title === "gta vi" &&
      (
        /^2026-11-19t00:00(?::00)?$/i.test(rawDate) ||
        /^2026-11-19t00:00(?::00)?\+01:00$/i.test(rawDate) ||
        /^2026-11-19t00:00(?::00)?\+02:00$/i.test(rawDate) ||
        /^2026-11-18t22:00(?::00)?(?:\.000)?z$/i.test(rawDate) ||
        /^2026-11-18t23:00(?::00)?(?:\.000)?z$/i.test(rawDate)
      )
    ) {
      return "2026-11-19T00:00:00";
    }

    return rawDate;
  }

  function normalizeLicznikEntry(entry, index = 0) {
    const source = entry && typeof entry === "object" ? entry : {};
    const title = String(source.title || source.name || "").trim();
    const mode = normalizeLicznikMode(source.mode || source.type || "since");
    const targetDateRaw = normalizeLegacyLicznikTargetDate(title, source.targetDate || source.date || source.target || "");
    const endDateRaw = String(source.endDate || source.finishDate || source.end || "").trim();
    const parsedTargetDate = parseLicznikDateInputValue(targetDateRaw);
    const parsedDateMs = parsedTargetDate ? parsedTargetDate.getTime() : Number.NaN;
    if (!title || !Number.isFinite(parsedDateMs)) {
      return null;
    }

    const parsedEndDate = parseLicznikDateInputValue(endDateRaw);
    const parsedEndDateMs = parsedEndDate ? parsedEndDate.getTime() : Number.NaN;
    const hasValidEndDate = mode === "since" && Number.isFinite(parsedEndDateMs) && parsedEndDateMs > parsedDateMs;
    const id = String(source.id || "").trim() || createLicznikId(`${title}-${index}`);
    const explicitImageUrl = sanitizeLicznikImageUrl(source.imageUrl || source.image || source.graphic || "");
    return {
      id,
      title,
      mode,
      targetDate: new Date(parsedDateMs).toISOString(),
      endDate: hasValidEndDate ? new Date(parsedEndDateMs).toISOString() : "",
      imageUrl: explicitImageUrl || sanitizeLicznikImageUrl(getDefaultLicznikImageByTitle(title))
    };
  }

  function extractBaseLicznikiFromGrid() {
    if (!licznikiGridEl) {
      return [];
    }

    const cards = Array.from(licznikiGridEl.querySelectorAll("[data-licznik-mode][data-licznik-date]"));
    return cards
      .map((card, index) => {
        const title = String(card.querySelector("h3")?.textContent || "").trim();
        const mode = normalizeLicznikMode(card.getAttribute("data-licznik-mode") || "since");
        const targetDateRaw = String(card.getAttribute("data-licznik-date") || "").trim();
        const endDateRaw = String(card.getAttribute("data-licznik-end-date") || "").trim();
        const parsedTargetDate = parseLicznikDateInputValue(targetDateRaw);
        const parsedDateMs = parsedTargetDate ? parsedTargetDate.getTime() : Number.NaN;
        if (!title || !Number.isFinite(parsedDateMs)) {
          return null;
        }

        const parsedEndDate = parseLicznikDateInputValue(endDateRaw);
        const parsedEndDateMs = parsedEndDate ? parsedEndDate.getTime() : Number.NaN;
        const hasValidEndDate = mode === "since" && Number.isFinite(parsedEndDateMs) && parsedEndDateMs > parsedDateMs;
        const explicitImageUrl = sanitizeLicznikImageUrl(
          card.getAttribute("data-licznik-image") || card.querySelector("img")?.getAttribute("src") || ""
        );
        const imageUrl = explicitImageUrl || sanitizeLicznikImageUrl(getDefaultLicznikImageByTitle(title));

        const idSeed = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        return {
          id: `base-licznik-${idSeed || index + 1}`,
          title,
          mode,
          targetDate: new Date(parsedDateMs).toISOString(),
          endDate: hasValidEndDate ? new Date(parsedEndDateMs).toISOString() : "",
          imageUrl
        };
      })
      .filter(Boolean);
  }

  function getLicznikIdentityKey(entry) {
    const safeEntry = entry && typeof entry === "object" ? entry : {};
    const title = String(safeEntry.title || "").trim().toLowerCase();
    const mode = normalizeLicznikMode(safeEntry.mode || "since");
    const parsedTargetDate = parseLicznikDateInputValue(String(safeEntry.targetDate || "").trim());
    const parsedEndDate = parseLicznikDateInputValue(String(safeEntry.endDate || "").trim());
    const parsedDateMs = parsedTargetDate ? parsedTargetDate.getTime() : Number.NaN;
    const parsedEndDateMs = parsedEndDate ? parsedEndDate.getTime() : Number.NaN;
    const endDateToken =
      mode === "since" && Number.isFinite(parsedEndDateMs) && parsedEndDateMs > parsedDateMs
        ? new Date(parsedEndDateMs).toISOString()
        : "";
    if (!title || !Number.isFinite(parsedDateMs)) {
      return "";
    }
    return `${title}::${mode}::${new Date(parsedDateMs).toISOString()}::${endDateToken}`;
  }

  function mergeMissingBaseLicznikiItems(itemsList) {
    const normalizedList = Array.isArray(itemsList) ? itemsList.filter(Boolean) : [];
    const baseItems = extractBaseLicznikiFromGrid();
    if (!baseItems.length) {
      return normalizedList;
    }
    if (!normalizedList.length) {
      return baseItems;
    }

    const itemsKeys = new Set(normalizedList.map((entry) => getLicznikIdentityKey(entry)).filter(Boolean));
    const missingBaseItems = baseItems.filter((entry) => {
      const key = getLicznikIdentityKey(entry);
      return key && !itemsKeys.has(key);
    });

    return missingBaseItems.length ? [...normalizedList, ...missingBaseItems] : normalizedList;
  }

  function loadLicznikiItems() {
    const stored = readStorageJsonFallback(LICZNIKI_ITEMS_KEY, null);
    if (Array.isArray(stored) && stored.length) {
      const normalizedStored = stored.map((entry, index) => normalizeLicznikEntry(entry, index)).filter(Boolean);
      if (normalizedStored.length) {
        return mergeMissingBaseLicznikiItems(normalizedStored);
      }
    }
    return mergeMissingBaseLicznikiItems([]);
  }

  function saveLicznikiItems() {
    saveStorageJsonFallback(LICZNIKI_ITEMS_KEY, licznikiItems);
    scheduleAdminStateSync();
    void pushAdminStateToRemote();
  }

  function normalizeYouTubeSortMode(modeValue) {
    const clean = String(modeValue || "").trim().toLowerCase();
    if (clean === "popular") {
      return "popular";
    }
    if (clean === "oldest") {
      return "oldest";
    }
    return "newest";
  }

  function formatYouTubeSortModeLabel(modeValue) {
    const mode = normalizeYouTubeSortMode(modeValue);
    if (mode === "popular") {
      return "Popularne";
    }
    if (mode === "oldest") {
      return "Najstarsze";
    }
    return "Najnowsze";
  }

  function normalizeYouTubeChannelId(value) {
    const clean = String(value || "").trim();
    return /^UC[a-zA-Z0-9_-]{22}$/.test(clean) ? clean : "";
  }

  function normalizeYouTubeHandle(value) {
    const clean = String(value || "").trim();
    if (!clean) {
      return "";
    }
    const candidate = clean.startsWith("@") ? clean : `@${clean.replace(/^@+/, "")}`;
    return /^@[a-zA-Z0-9._-]{2,60}$/.test(candidate) ? candidate : "";
  }

  function normalizeYouTubeUserName(value) {
    const clean = String(value || "").trim();
    return /^[a-zA-Z0-9._-]{2,60}$/.test(clean) ? clean : "";
  }

  function parseYouTubeChannelReference(rawValue) {
    const input = String(rawValue || "").trim();
    if (!input) {
      return null;
    }

    const directId = normalizeYouTubeChannelId(input);
    if (directId) {
      return {
        channelId: directId,
        handle: "",
        userName: "",
        channelUrl: `https://www.youtube.com/channel/${directId}`
      };
    }

    const directHandle = normalizeYouTubeHandle(input);
    if (directHandle) {
      return {
        channelId: "",
        handle: directHandle,
        userName: "",
        channelUrl: `https://www.youtube.com/${directHandle}`
      };
    }

    let parsed = null;
    try {
      parsed = new URL(input, "https://www.youtube.com");
    } catch (_error) {
      parsed = null;
    }

    if (!parsed) {
      return null;
    }

    const host = String(parsed.hostname || "").toLowerCase();
    const isYouTubeHost =
      host === "youtube.com" ||
      host === "www.youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtu.be";
    if (!isYouTubeHost) {
      return null;
    }

    const segments = String(parsed.pathname || "/")
      .split("/")
      .map((segment) => segment.trim())
      .filter(Boolean);

    const channelIdFromQuery = normalizeYouTubeChannelId(parsed.searchParams.get("channel_id"));
    if (channelIdFromQuery) {
      return {
        channelId: channelIdFromQuery,
        handle: "",
        userName: "",
        channelUrl: `https://www.youtube.com/channel/${channelIdFromQuery}`
      };
    }

    if (!segments.length) {
      return null;
    }

    const first = segments[0];
    const firstLower = first.toLowerCase();
    if (firstLower === "channel" && segments[1]) {
      const channelId = normalizeYouTubeChannelId(segments[1]);
      if (channelId) {
        return {
          channelId,
          handle: "",
          userName: "",
          channelUrl: `https://www.youtube.com/channel/${channelId}`
        };
      }
    }

    if (firstLower === "user" && segments[1]) {
      const userName = normalizeYouTubeUserName(segments[1]);
      if (userName) {
        return {
          channelId: "",
          handle: "",
          userName,
          channelUrl: `https://www.youtube.com/user/${userName}`
        };
      }
    }

    if (first.startsWith("@")) {
      const handle = normalizeYouTubeHandle(first);
      if (handle) {
        return {
          channelId: "",
          handle,
          userName: "",
          channelUrl: `https://www.youtube.com/${handle}`
        };
      }
    }

    return null;
  }

  function buildCanonicalYouTubeChannelUrl(reference) {
    const source = reference && typeof reference === "object" ? reference : {};
    const channelId = normalizeYouTubeChannelId(source.channelId);
    if (channelId) {
      return `https://www.youtube.com/channel/${channelId}`;
    }

    const handle = normalizeYouTubeHandle(source.handle);
    if (handle) {
      return `https://www.youtube.com/${handle}`;
    }

    const userName = normalizeYouTubeUserName(source.userName);
    if (userName) {
      return `https://www.youtube.com/user/${userName}`;
    }

    const parsed = parseYouTubeChannelReference(source.channelUrl || source.url || "");
    if (parsed) {
      return parsed.channelUrl;
    }

    return "";
  }

  function buildYouTubeFeedUrls(reference) {
    const source = reference && typeof reference === "object" ? reference : {};
    const urls = [];

    const channelId = normalizeYouTubeChannelId(source.channelId);
    if (channelId) {
      urls.push(`https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`);
    }

    const userName = normalizeYouTubeUserName(source.userName);
    if (userName) {
      urls.push(`https://www.youtube.com/feeds/videos.xml?user=${encodeURIComponent(userName)}`);
    }

    const handle = normalizeYouTubeHandle(source.handle);
    const handleAsUser = normalizeYouTubeUserName(handle.replace(/^@+/, ""));
    if (handleAsUser) {
      urls.push(`https://www.youtube.com/feeds/videos.xml?user=${encodeURIComponent(handleAsUser)}`);
    }

    return Array.from(new Set(urls));
  }

  function buildYouTubeFeedUrl(reference) {
    const urls = buildYouTubeFeedUrls(reference);
    return urls[0] || "";
  }

  function createYouTubeChannelId(seed = "") {
    const cleanSeed = String(seed || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const stamp = Date.now().toString(36);
    const rand = Math.random().toString(36).slice(2, 8);
    return `youtube-${cleanSeed || "channel"}-${stamp}-${rand}`;
  }

  function normalizeYouTubeChannelEntry(entry, index = 0) {
    const source = entry && typeof entry === "object" ? entry : {};
    const parsed =
      parseYouTubeChannelReference(
        source.channelInput ||
          source.channelUrl ||
          source.url ||
          source.channel ||
          source.channelId ||
          source.handle ||
          source.userName
      ) || null;

    const channelId = normalizeYouTubeChannelId(source.channelId) || (parsed ? normalizeYouTubeChannelId(parsed.channelId) : "");
    const handle = normalizeYouTubeHandle(source.handle) || (parsed ? normalizeYouTubeHandle(parsed.handle) : "");
    const userName = normalizeYouTubeUserName(source.userName) || (parsed ? normalizeYouTubeUserName(parsed.userName) : "");
    const channelUrl =
      buildCanonicalYouTubeChannelUrl({
        channelId,
        handle,
        userName,
        channelUrl: source.channelUrl || source.url || (parsed && parsed.channelUrl) || ""
      }) || "";
    if (!channelId && !handle && !userName && !channelUrl) {
      return null;
    }

    const displayName = String(source.name || source.title || source.label || "").trim();
    const defaultSortMode = normalizeYouTubeSortMode(source.defaultSortMode || source.sortMode || YOUTUBE_DEFAULT_SORT_MODE);
    const idSeed = channelId || handle || userName || channelUrl || `channel-${index + 1}`;

    return {
      id: String(source.id || "").trim() || createYouTubeChannelId(idSeed),
      name: displayName,
      channelId,
      handle,
      userName,
      channelUrl,
      defaultSortMode
    };
  }

  function buildYouTubeChannelAuditSnapshot(channel) {
    const source = channel && typeof channel === "object" ? channel : {};
    return {
      id: String(source.id || "").trim(),
      name: String(source.name || "").trim(),
      channelId: normalizeYouTubeChannelId(source.channelId),
      handle: normalizeYouTubeHandle(source.handle),
      userName: normalizeYouTubeUserName(source.userName),
      channelUrl: buildCanonicalYouTubeChannelUrl(source),
      defaultSortMode: normalizeYouTubeSortMode(source.defaultSortMode)
    };
  }

  function loadYouTubeChannels() {
    const stored = readStorageJsonFallback(YOUTUBE_CHANNELS_KEY, []);
    return (Array.isArray(stored) ? stored : [])
      .map((entry, index) => normalizeYouTubeChannelEntry(entry, index))
      .filter(Boolean);
  }

  function saveYouTubeChannels() {
    saveStorageJsonFallback(YOUTUBE_CHANNELS_KEY, youtubeChannels);
    youtubeChannelDataCache.clear();
    scheduleAdminStateSync();
    void pushAdminStateToRemote();
  }

  function loadYouTubeSortMode() {
    const stored = readStorageJsonFallback(YOUTUBE_SORT_MODE_KEY, YOUTUBE_DEFAULT_SORT_MODE);
    return normalizeYouTubeSortMode(stored);
  }

  function saveYouTubeSortMode(modeValue) {
    youtubeSortMode = normalizeYouTubeSortMode(modeValue);
    saveStorageJsonFallback(YOUTUBE_SORT_MODE_KEY, youtubeSortMode);
  }

  function decodeEscapedJsonText(rawValue) {
    return String(rawValue || "")
      .replace(/\\\\u0026/g, "&")
      .replace(/\\u0026/g, "&")
      .replace(/\\\\\\//g, "/")
      .replace(/\\\//g, "/")
      .replace(/\\"/g, "\"");
  }

  function normalizeYouTubeViews(rawValue) {
    if (typeof rawValue === "number" && Number.isFinite(rawValue)) {
      return Math.max(0, Math.floor(rawValue));
    }
    const digits = String(rawValue || "").replace(/\D+/g, "");
    if (!digits) {
      return 0;
    }
    const parsed = Number.parseInt(digits, 10);
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
  }

  function formatYouTubeViewsLabel(rawValue) {
    const views = normalizeYouTubeViews(rawValue);
    if (!Number.isFinite(views) || views <= 0) {
      return "";
    }
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1).replace(".", ",")} mln wyświetleń`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1).replace(".", ",")} tys. wyświetleń`;
    }
    return `${views.toLocaleString("pl-PL")} wyświetleń`;
  }

  function formatYouTubeDateLabel(rawValue) {
    const value = String(rawValue || "").trim();
    if (!value) {
      return "";
    }
    const parsed = new Date(value);
    if (!Number.isFinite(parsed.getTime())) {
      return "";
    }
    try {
      return parsed.toLocaleDateString("pl-PL", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch (_error) {
      return "";
    }
  }

  function extractYouTubeFeedXml(rawText) {
    const text = String(rawText || "").trim();
    if (!text) {
      return "";
    }

    const fenced = text.match(/```(?:xml)?\s*([\s\S]*?)\s*```/i);
    const candidate = fenced && fenced[1] ? fenced[1].trim() : text;

    const xmlStart = candidate.indexOf("<?xml");
    const feedStart = candidate.indexOf("<feed");
    const start =
      xmlStart !== -1 && feedStart !== -1 ? Math.min(xmlStart, feedStart) : Math.max(xmlStart, feedStart);
    const end = candidate.lastIndexOf("</feed>");
    if (start !== -1 && end !== -1 && end > start) {
      return candidate.slice(start, end + "</feed>".length);
    }

    return candidate;
  }

  function parseYouTubeChannelMetaFromHtml(rawHtml) {
    const html = String(rawHtml || "");
    if (!html) {
      return {};
    }

    const decodedHtml = decodeEscapedJsonText(html);
    const channelIdPatterns = [
      /"channelId":"(UC[a-zA-Z0-9_-]{22})"/,
      /"externalId":"(UC[a-zA-Z0-9_-]{22})"/,
      /"rssUrl":"[^"]*feeds\/videos\.xml\?channel_id=(UC[a-zA-Z0-9_-]{22})"/,
      /feeds\/videos\.xml\?channel_id=(UC[a-zA-Z0-9_-]{22})/,
      /<meta[^>]+itemprop=["']channelId["'][^>]+content=["'](UC[a-zA-Z0-9_-]{22})["']/i,
      /<link[^>]+rel=["']canonical["'][^>]+href=["'][^"']*\/channel\/(UC[a-zA-Z0-9_-]{22})["']/i
    ];

    let channelId = "";
    channelIdPatterns.some((pattern) => {
      const matched = decodedHtml.match(pattern);
      if (!matched || !matched[1]) {
        return false;
      }
      channelId = normalizeYouTubeChannelId(matched[1]);
      return Boolean(channelId);
    });

    const canonicalMatch =
      decodedHtml.match(/"canonicalBaseUrl":"(\/@[^"]+)"/) ||
      decodedHtml.match(/"vanityChannelUrl":"https?:\/\/www\.youtube\.com(\/@[^"]+)"/) ||
      decodedHtml.match(/<link[^>]+rel=["']canonical["'][^>]+href=["'][^"']*(\/@[^"'/?]+)["']/i);
    const titleMatch = decodedHtml.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
    const descMatch = decodedHtml.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i);
    const subsMatch =
      decodedHtml.match(/"subscriberCountText":\{"simpleText":"([^"]+)"/) ||
      decodedHtml.match(/"subscriberCountText":\{[^{}]*"simpleText":"([^"]+)"/) ||
      decodedHtml.match(/"subscriberCountText":\{[^{}]*"label":"([^"]+)"/);

    let avatarUrl = "";
    const avatarBlock = decodedHtml.match(/"avatar":\{"thumbnails":\[(.*?)\]\}/);
    if (avatarBlock && avatarBlock[1]) {
      const avatarUrls = Array.from(avatarBlock[1].matchAll(/"url":"([^"]+)"/g))
        .map((match) => decodeEscapedJsonText(match[1]))
        .filter(Boolean);
      if (avatarUrls.length) {
        avatarUrl = avatarUrls[avatarUrls.length - 1];
      }
    }
    if (!avatarUrl) {
      const ogImageMatch = decodedHtml.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
      avatarUrl = ogImageMatch && ogImageMatch[1] ? decodeEscapedJsonText(ogImageMatch[1]) : "";
    }

    const handle = canonicalMatch ? normalizeYouTubeHandle(canonicalMatch[1]) : "";
    return {
      channelId,
      handle,
      title: titleMatch ? decodeEscapedJsonText(titleMatch[1]) : "",
      description: descMatch ? decodeEscapedJsonText(descMatch[1]) : "",
      subscribersText: subsMatch ? decodeEscapedJsonText(subsMatch[1]) : "",
      avatarUrl: avatarUrl || ""
    };
  }

  function parseYouTubeFeed(xmlText) {
    const source = extractYouTubeFeedXml(xmlText);
    if (!source) {
      throw new Error("YOUTUBE_FEED_EMPTY");
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(source, "application/xml");
    if (doc.querySelector("parsererror")) {
      throw new Error("YOUTUBE_FEED_PARSE_ERROR");
    }

    const getDirectChildText = (parent, localName) => {
      if (!parent) {
        return "";
      }
      const nodes = Array.from(parent.childNodes || []);
      const matched = nodes.find((node) => {
        return node && node.nodeType === 1 && String(node.localName || node.nodeName || "").toLowerCase() === localName;
      });
      return matched ? String(matched.textContent || "").trim() : "";
    };

    const feedRoot = doc.documentElement;
    const feedTitle = getDirectChildText(feedRoot, "title");
    const feedAuthor = Array.from(feedRoot.getElementsByTagNameNS("*", "author"))[0] || null;
    const authorName = getDirectChildText(feedAuthor, "name");
    const authorUrl = getDirectChildText(feedAuthor, "uri");
    const feedChannelIdNode = Array.from(feedRoot.getElementsByTagNameNS("*", "channelId"))[0] || null;
    const feedChannelId = normalizeYouTubeChannelId(feedChannelIdNode ? feedChannelIdNode.textContent : "");

    const entries = Array.from(feedRoot.getElementsByTagNameNS("*", "entry"))
      .slice(0, YOUTUBE_MAX_FEED_ITEMS)
      .map((entryNode) => {
        const entryTitle = getDirectChildText(entryNode, "title");
        const videoIdNode = Array.from(entryNode.getElementsByTagNameNS("*", "videoId"))[0] || null;
        const videoId = String(videoIdNode ? videoIdNode.textContent || "" : "").trim();
        const publishedAt = getDirectChildText(entryNode, "published");
        const updatedAt = getDirectChildText(entryNode, "updated");
        const links = Array.from(entryNode.getElementsByTagName("link"));
        const alternateLink =
          links.find((linkNode) => String(linkNode.getAttribute("rel") || "").toLowerCase() === "alternate") || links[0] || null;
        const videoUrl =
          String(alternateLink ? alternateLink.getAttribute("href") || "" : "").trim() ||
          (videoId ? `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}` : "");
        const thumbnailNode = Array.from(entryNode.getElementsByTagNameNS("*", "thumbnail"))[0] || null;
        const thumbnailUrl = String(thumbnailNode ? thumbnailNode.getAttribute("url") || "" : "").trim();
        const descNode = Array.from(entryNode.getElementsByTagNameNS("*", "description"))[0] || null;
        const description = String(descNode ? descNode.textContent || "" : "").trim();
        const statsNode = Array.from(entryNode.getElementsByTagNameNS("*", "statistics"))[0] || null;
        const views = normalizeYouTubeViews(statsNode ? statsNode.getAttribute("views") : "");
        const publishedMs = Number.isFinite(new Date(publishedAt).getTime()) ? new Date(publishedAt).getTime() : 0;

        return {
          id: videoId || videoUrl || `yt-entry-${Math.random().toString(36).slice(2, 10)}`,
          title: entryTitle || "Bez tytułu",
          videoId,
          url: videoUrl,
          thumbnailUrl,
          description,
          publishedAt,
          updatedAt,
          publishedMs,
          views
        };
      })
      .filter((entry) => Boolean(entry.url));

    const authorReference = parseYouTubeChannelReference(authorUrl || "");
    return {
      channelId: feedChannelId || (authorReference ? normalizeYouTubeChannelId(authorReference.channelId) : ""),
      title: feedTitle,
      authorName,
      authorUrl,
      entries
    };
  }

  async function withYouTubeTimeout(taskFactory, timeoutMs, timeoutLabel) {
    let timeoutId = 0;
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

  async function fetchYouTubeTextDirect(url, timeoutMs, timeoutLabel) {
    const response = await withYouTubeTimeout(
      () =>
        fetch(url, {
          mode: "cors",
          cache: "no-store",
          headers: {
            Accept: "application/atom+xml, application/xml, text/xml, text/plain;q=0.9, */*;q=0.8"
          }
        }),
      timeoutMs,
      timeoutLabel
    );
    if (!response.ok) {
      throw new Error(`YOUTUBE_HTTP_${response.status}`);
    }
    const text = await response.text();
    if (!String(text || "").trim()) {
      throw new Error("YOUTUBE_EMPTY_RESPONSE");
    }
    return text;
  }

  async function fetchYouTubeTextViaProxy(sourceUrl, proxyPrefix, timeoutMs, timeoutLabel) {
    const response = await withYouTubeTimeout(
      () =>
        fetch(`${proxyPrefix}${encodeURIComponent(sourceUrl)}`, {
          mode: "cors",
          cache: "no-store",
          headers: {
            Accept: "application/xml, text/xml, text/plain;q=0.9, */*;q=0.8"
          }
        }),
      timeoutMs,
      timeoutLabel
    );
    if (!response.ok) {
      throw new Error(`YOUTUBE_PROXY_HTTP_${response.status}`);
    }
    const text = await response.text();
    if (!String(text || "").trim()) {
      throw new Error("YOUTUBE_PROXY_EMPTY_RESPONSE");
    }
    return text;
  }

  async function fetchYouTubeFeedText(feedUrl) {
    const direct = await fetchYouTubeTextDirect(feedUrl, YOUTUBE_FEED_FETCH_TIMEOUT_MS, "YOUTUBE_FEED_TIMEOUT").catch(
      () => ""
    );
    if (direct) {
      return direct;
    }

    const proxyPrefixes = [ALL_ORIGINS_RAW_PREFIX, CORS_PROXY_PREFIX];
    for (const proxyPrefix of proxyPrefixes) {
      try {
        const proxyText = await fetchYouTubeTextViaProxy(
          feedUrl,
          proxyPrefix,
          YOUTUBE_FEED_FETCH_TIMEOUT_MS,
          "YOUTUBE_FEED_PROXY_TIMEOUT"
        );
        if (proxyText) {
          return proxyText;
        }
      } catch (_error) {
        // Try the next proxy.
      }
    }

    const jinaUrl = `${JINA_PREFIX}${feedUrl.replace(/^https:\/\//i, "http://")}`;
    const jinaText = await fetchYouTubeTextDirect(jinaUrl, YOUTUBE_FEED_FETCH_TIMEOUT_MS, "YOUTUBE_FEED_JINA_TIMEOUT");
    if (!jinaText) {
      throw new Error("YOUTUBE_FEED_FETCH_FAILED");
    }
    return jinaText;
  }

  async function fetchYouTubeOEmbedMeta(channelUrl) {
    const cleanChannelUrl = String(channelUrl || "").trim();
    if (!cleanChannelUrl) {
      return {};
    }
    const oembedUrl = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(cleanChannelUrl)}`;

    try {
      const response = await withYouTubeTimeout(
        () =>
          fetch(oembedUrl, {
            mode: "cors",
            cache: "no-store",
            headers: {
              Accept: "application/json, text/plain;q=0.9, */*;q=0.8"
            }
          }),
        YOUTUBE_META_FETCH_TIMEOUT_MS,
        "YOUTUBE_OEMBED_TIMEOUT"
      );
      if (!response.ok) {
        throw new Error(`YOUTUBE_OEMBED_HTTP_${response.status}`);
      }
      const payload = await response.json();
      return payload && typeof payload === "object" ? payload : {};
    } catch (_error) {
      // Fallback below.
    }

    for (const proxyPrefix of [ALL_ORIGINS_RAW_PREFIX, CORS_PROXY_PREFIX]) {
      try {
        const proxyPayload = await fetchViaProxyJson(oembedUrl, proxyPrefix);
        if (proxyPayload && typeof proxyPayload === "object") {
          return proxyPayload;
        }
      } catch (_error) {
        // Try next source.
      }
    }

    try {
      const jinaPayload = await fetchJinaJson(oembedUrl.replace(/^https:\/\//i, "http://"));
      return jinaPayload && typeof jinaPayload === "object" ? jinaPayload : {};
    } catch (_error) {
      return {};
    }
  }

  async function fetchYouTubeChannelPageMeta(channelUrl) {
    const cleanChannelUrl = String(channelUrl || "").trim();
    if (!cleanChannelUrl) {
      return {};
    }

    const direct = await fetchYouTubeTextDirect(cleanChannelUrl, YOUTUBE_META_FETCH_TIMEOUT_MS, "YOUTUBE_META_TIMEOUT").catch(
      () => ""
    );
    if (direct) {
      return parseYouTubeChannelMetaFromHtml(direct);
    }

    for (const proxyPrefix of [ALL_ORIGINS_RAW_PREFIX, CORS_PROXY_PREFIX]) {
      try {
        const proxyText = await fetchYouTubeTextViaProxy(
          cleanChannelUrl,
          proxyPrefix,
          YOUTUBE_META_FETCH_TIMEOUT_MS,
          "YOUTUBE_META_PROXY_TIMEOUT"
        );
        if (proxyText) {
          return parseYouTubeChannelMetaFromHtml(proxyText);
        }
      } catch (_error) {
        // Try next source.
      }
    }

    const jinaUrl = `${JINA_PREFIX}${cleanChannelUrl.replace(/^https:\/\//i, "http://")}`;
    try {
      const jinaText = await fetchYouTubeTextDirect(jinaUrl, YOUTUBE_META_FETCH_TIMEOUT_MS, "YOUTUBE_META_JINA_TIMEOUT");
      return parseYouTubeChannelMetaFromHtml(jinaText);
    } catch (_error) {
      return {};
    }
  }

  function sortYouTubeVideos(videosList, modeValue) {
    const mode = normalizeYouTubeSortMode(modeValue);
    const entries = Array.isArray(videosList) ? [...videosList] : [];
    if (mode === "oldest") {
      entries.sort((left, right) => (left.publishedMs || 0) - (right.publishedMs || 0));
      return entries;
    }
    if (mode === "popular") {
      entries.sort((left, right) => {
        const byViews = (right.views || 0) - (left.views || 0);
        if (byViews !== 0) {
          return byViews;
        }
        return (right.publishedMs || 0) - (left.publishedMs || 0);
      });
      return entries;
    }

    entries.sort((left, right) => (right.publishedMs || 0) - (left.publishedMs || 0));
    return entries;
  }

  function getYouTubeChannelCacheKey(channelEntry, sortMode) {
    const source = channelEntry && typeof channelEntry === "object" ? channelEntry : {};
    const normalizedSort = normalizeYouTubeSortMode(sortMode || source.defaultSortMode || YOUTUBE_DEFAULT_SORT_MODE);
    return [
      String(source.id || "").trim().toLowerCase(),
      normalizeYouTubeChannelId(source.channelId),
      normalizeYouTubeHandle(source.handle),
      normalizeYouTubeUserName(source.userName),
      String(source.channelUrl || "").trim().toLowerCase(),
      normalizedSort
    ].join("::");
  }

  async function fetchYouTubeChannelDataFromApi(channelEntry, sortMode) {
    const source = channelEntry && typeof channelEntry === "object" ? channelEntry : {};
    const params = new URLSearchParams();
    const channelId = normalizeYouTubeChannelId(source.channelId);
    const handle = normalizeYouTubeHandle(source.handle);
    const userName = normalizeYouTubeUserName(source.userName);
    const channelUrl = buildCanonicalYouTubeChannelUrl(source);

    if (channelId) {
      params.set("channelId", channelId);
    }
    if (handle) {
      params.set("handle", handle);
    }
    if (userName) {
      params.set("userName", userName);
    }
    if (channelUrl) {
      params.set("channelUrl", channelUrl);
    }
    params.set("sort", normalizeYouTubeSortMode(sortMode || source.defaultSortMode || YOUTUBE_DEFAULT_SORT_MODE));
    params.set("limit", String(YOUTUBE_VISIBLE_VIDEO_COUNT));

    const endpoint = `${LOCAL_YOUTUBE_CHANNEL_ENDPOINT}?${params.toString()}`;
    const response = await withYouTubeTimeout(
      () =>
        fetch(endpoint, {
          method: "GET",
          headers: {
            Accept: "application/json"
          },
          cache: "no-store"
        }),
      YOUTUBE_API_FETCH_TIMEOUT_MS,
      "YOUTUBE_API_TIMEOUT"
    );

    let payload = null;
    try {
      payload = await response.json();
    } catch (_error) {
      throw new Error(`YOUTUBE_API_INVALID_JSON:${response.status}`);
    }

    if (!response.ok || !payload || payload.ok !== true || !payload.channel || typeof payload.channel !== "object") {
      const errorText = String(payload && payload.error || "").trim();
      throw new Error(errorText || `YOUTUBE_API_HTTP_${response.status}`);
    }

    return payload.channel;
  }

  async function loadYouTubeChannelCardDataLegacy(channelEntry, sortMode) {
    const source = normalizeYouTubeChannelEntry(channelEntry);
    if (!source) {
      throw new Error("YOUTUBE_CHANNEL_INVALID");
    }

    const mode = normalizeYouTubeSortMode(sortMode || source.defaultSortMode || YOUTUBE_DEFAULT_SORT_MODE);
    let mergedChannelId = normalizeYouTubeChannelId(source.channelId);
    let mergedHandle = normalizeYouTubeHandle(source.handle);
    let mergedUserName = normalizeYouTubeUserName(source.userName);
    let mergedChannelUrl = buildCanonicalYouTubeChannelUrl(source);
    let channelTitle = String(source.name || "").trim();
    let subscribersText = "";
    let description = "";
    let avatarUrl = "";

    const oembed = await fetchYouTubeOEmbedMeta(mergedChannelUrl);
    if (oembed && typeof oembed === "object") {
      channelTitle = channelTitle || String(oembed.title || oembed.author_name || "").trim();
      avatarUrl = String(oembed.thumbnail_url || "").trim();
      const authorUrl = String(oembed.author_url || "").trim();
      if (authorUrl) {
        mergedChannelUrl = buildCanonicalYouTubeChannelUrl({ channelUrl: authorUrl }) || mergedChannelUrl;
        const fromAuthor = parseYouTubeChannelReference(authorUrl);
        if (fromAuthor) {
          mergedChannelId = mergedChannelId || normalizeYouTubeChannelId(fromAuthor.channelId);
          mergedHandle = mergedHandle || normalizeYouTubeHandle(fromAuthor.handle);
          mergedUserName = mergedUserName || normalizeYouTubeUserName(fromAuthor.userName);
        }
      }
    }

    const pageMeta = await fetchYouTubeChannelPageMeta(mergedChannelUrl);
    if (pageMeta && typeof pageMeta === "object") {
      mergedChannelId = mergedChannelId || normalizeYouTubeChannelId(pageMeta.channelId);
      mergedHandle = mergedHandle || normalizeYouTubeHandle(pageMeta.handle);
      channelTitle = channelTitle || String(pageMeta.title || "").trim();
      subscribersText = String(pageMeta.subscribersText || "").trim();
      description = String(pageMeta.description || "").trim();
      avatarUrl = String(pageMeta.avatarUrl || "").trim() || avatarUrl;
    }

    if (!mergedUserName && mergedHandle) {
      mergedUserName = normalizeYouTubeUserName(String(mergedHandle || "").replace(/^@+/, ""));
    }

    const feedUrls = buildYouTubeFeedUrls({
      channelId: mergedChannelId,
      handle: mergedHandle,
      userName: mergedUserName,
      channelUrl: mergedChannelUrl
    });
    if (!feedUrls.length) {
      throw new Error("YOUTUBE_CHANNEL_ID_REQUIRED");
    }

    let feed = null;
    let feedError = null;
    for (const feedUrl of feedUrls) {
      try {
        const feedText = await fetchYouTubeFeedText(feedUrl);
        const parsedFeed = parseYouTubeFeed(feedText);
        if (parsedFeed && typeof parsedFeed === "object") {
          feed = parsedFeed;
          break;
        }
      } catch (error) {
        feedError = error;
      }
    }
    if (!feed) {
      throw feedError || new Error("YOUTUBE_FEED_FETCH_FAILED");
    }

    const authorRef = parseYouTubeChannelReference(feed.authorUrl || "");
    mergedChannelId = mergedChannelId || normalizeYouTubeChannelId(feed.channelId) || normalizeYouTubeChannelId(authorRef && authorRef.channelId);
    mergedHandle = mergedHandle || normalizeYouTubeHandle(authorRef && authorRef.handle);
    mergedChannelUrl =
      buildCanonicalYouTubeChannelUrl({
        channelId: mergedChannelId,
        handle: mergedHandle,
        userName: mergedUserName,
        channelUrl: mergedChannelUrl || feed.authorUrl || source.channelUrl
      }) || mergedChannelUrl;

    const sortedVideos = sortYouTubeVideos(feed.entries, mode).slice(0, YOUTUBE_VISIBLE_VIDEO_COUNT);
    return {
      id: source.id,
      name: channelTitle || feed.authorName || "Kanał YouTube",
      channelId: mergedChannelId,
      handle: mergedHandle,
      userName: mergedUserName,
      channelUrl: mergedChannelUrl,
      subscribersText,
      description,
      avatarUrl: avatarUrl || YOUTUBE_AVATAR_FALLBACK,
      sortMode: mode,
      videos: sortedVideos
    };
  }

  async function loadYouTubeChannelCardData(channelEntry, sortMode) {
    const source = normalizeYouTubeChannelEntry(channelEntry);
    if (!source) {
      throw new Error("YOUTUBE_CHANNEL_INVALID");
    }

    const mode = normalizeYouTubeSortMode(sortMode || source.defaultSortMode || YOUTUBE_DEFAULT_SORT_MODE);
    const cacheKey = getYouTubeChannelCacheKey(source, mode);
    const cached = youtubeChannelDataCache.get(cacheKey);
    if (cached && typeof cached === "object" && Date.now() - Number(cached.cachedAt || 0) < 120000) {
      return cached.value;
    }

    let result = null;
    let apiError = null;
    try {
      const apiChannel = await fetchYouTubeChannelDataFromApi(source, mode);
      const mergedChannelId = normalizeYouTubeChannelId(apiChannel.channelId) || normalizeYouTubeChannelId(source.channelId);
      const mergedHandle = normalizeYouTubeHandle(apiChannel.handle) || normalizeYouTubeHandle(source.handle);
      const mergedUserName =
        normalizeYouTubeUserName(apiChannel.userName) ||
        normalizeYouTubeUserName(source.userName) ||
        normalizeYouTubeUserName(String(mergedHandle || "").replace(/^@+/, ""));
      const mergedChannelUrl =
        buildCanonicalYouTubeChannelUrl({
          channelId: mergedChannelId,
          handle: mergedHandle,
          userName: mergedUserName,
          channelUrl: apiChannel.channelUrl || source.channelUrl
        }) || buildCanonicalYouTubeChannelUrl(source);

      const sortedVideos = sortYouTubeVideos(apiChannel.videos, mode).slice(0, YOUTUBE_VISIBLE_VIDEO_COUNT);
      result = {
        id: source.id,
        name: String(source.name || apiChannel.name || "Kanał YouTube").trim() || "Kanał YouTube",
        channelId: mergedChannelId,
        handle: mergedHandle,
        userName: mergedUserName,
        channelUrl: mergedChannelUrl,
        subscribersText: String(apiChannel.subscribersText || "").trim(),
        description: String(apiChannel.description || "").trim(),
        avatarUrl: String(apiChannel.avatarUrl || "").trim() || YOUTUBE_AVATAR_FALLBACK,
        sortMode: mode,
        videos: sortedVideos
      };
    } catch (error) {
      apiError = error;
    }

    if (!result) {
      try {
        result = await loadYouTubeChannelCardDataLegacy(source, mode);
      } catch (legacyError) {
        if (apiError) {
          throw new Error(`${String(apiError.message || apiError)} | ${String(legacyError.message || legacyError)}`);
        }
        throw legacyError;
      }
    }

    youtubeChannelDataCache.set(cacheKey, {
      cachedAt: Date.now(),
      value: result
    });
    return result;
  }

  function renderYouTubeSortButtons() {
    if (!youtubeSortTabsEl) {
      return;
    }
    const normalized = normalizeYouTubeSortMode(youtubeSortMode);
    const buttons = Array.from(youtubeSortTabsEl.querySelectorAll("button[data-youtube-sort]"));
    buttons.forEach((button) => {
      const mode = normalizeYouTubeSortMode(button.getAttribute("data-youtube-sort"));
      const active = mode === normalized;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function bindYouTubeSortControls() {
    if (!youtubeSortTabsEl || youtubeSortBound) {
      return;
    }
    youtubeSortBound = true;

    youtubeSortTabsEl.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-youtube-sort]");
      if (!button || !youtubeSortTabsEl.contains(button)) {
        return;
      }
      event.preventDefault();
      const nextSort = normalizeYouTubeSortMode(button.getAttribute("data-youtube-sort"));
      if (nextSort === normalizeYouTubeSortMode(youtubeSortMode)) {
        return;
      }
      saveYouTubeSortMode(nextSort);
      renderYouTubeSortButtons();
      void renderPublicYouTubeCards({ force: true });
    });
  }

  function buildYouTubeVideoMetaLabel(videoEntry) {
    const entry = videoEntry && typeof videoEntry === "object" ? videoEntry : {};
    const parts = [];
    const dateLabel = formatYouTubeDateLabel(entry.publishedAt || entry.updatedAt);
    if (dateLabel) {
      parts.push(dateLabel);
    }
    const viewsLabel = formatYouTubeViewsLabel(entry.views);
    if (viewsLabel) {
      parts.push(viewsLabel);
    }
    return parts.join(" • ");
  }

  function buildYouTubeChannelCardHtml(channelData) {
    const source = channelData && typeof channelData === "object" ? channelData : {};
    const channelUrl = String(source.channelUrl || "").trim() || "#";
    const safeChannelUrl = escapeHtmlText(channelUrl);
    const channelName = escapeHtmlText(source.name || "Kanał YouTube");
    const channelHandle = escapeHtmlText(source.handle || "");
    const subscribersText = escapeHtmlText(source.subscribersText || "");
    const description = escapeHtmlText(source.description || "");
    const avatarUrl = escapeHtmlText(source.avatarUrl || YOUTUBE_AVATAR_FALLBACK);

    const metaParts = [channelHandle, subscribersText].filter(Boolean);
    const metaLine = metaParts.join(" • ");

    const videos = Array.isArray(source.videos) ? source.videos : [];
    const videosHtml = videos.length
      ? `
        <ul class="youtube-videos-list">
          ${videos
            .map((video) => {
              const videoUrl = escapeHtmlText(String(video && video.url || "").trim() || "#");
              const videoTitle = escapeHtmlText(String(video && video.title || "Bez tytułu").trim() || "Bez tytułu");
              const videoThumb = escapeHtmlText(String(video && video.thumbnailUrl || "").trim());
              const videoMeta = escapeHtmlText(buildYouTubeVideoMetaLabel(video));
              return `
                <li class="youtube-video-item">
                  <a class="youtube-video-link" href="${videoUrl}" target="_blank" rel="noopener noreferrer">
                    ${
                      videoThumb
                        ? `<img class="youtube-video-thumb" src="${videoThumb}" alt="">`
                        : `<span class="youtube-video-thumb" aria-hidden="true"></span>`
                    }
                    <span class="youtube-video-copy">
                      <strong class="youtube-video-title">${videoTitle}</strong>
                      ${videoMeta ? `<span class="youtube-video-meta">${videoMeta}</span>` : ""}
                    </span>
                  </a>
                </li>
              `;
            })
            .join("")}
        </ul>
      `
      : `<p class="youtube-video-empty">Brak dostępnych filmów dla tego kanału.</p>`;

    return `
      <article class="youtube-channel-card">
        <div class="youtube-channel-main">
          <section class="youtube-channel-profile">
            <img class="youtube-channel-avatar" src="${avatarUrl}" alt="${channelName}">
            <div class="youtube-channel-copy">
              <div class="youtube-channel-top">
                <h3 class="youtube-channel-name">${channelName}</h3>
                <a class="youtube-channel-subscribe" href="${safeChannelUrl}" target="_blank" rel="noopener noreferrer">
                  <i class="fab fa-youtube" aria-hidden="true"></i>
                  Subskrybuj
                </a>
              </div>
              ${metaLine ? `<p class="youtube-channel-meta">${metaLine}</p>` : ""}
              ${description ? `<p class="youtube-channel-description">${description}</p>` : ""}
            </div>
          </section>
          <section class="youtube-videos">
            ${videosHtml}
          </section>
        </div>
      </article>
    `;
  }

  async function renderPublicYouTubeCards(options = {}) {
    if (!youtubeChannelsGridEl || !youtubePanelEl) {
      return;
    }

    const forceReload = Boolean(options && options.force);
    const channels = Array.isArray(youtubeChannels) ? youtubeChannels : [];
    bindYouTubeSortControls();
    renderYouTubeSortButtons();

    if (!channels.length) {
      youtubeChannelsGridEl.innerHTML = `
        <article class="youtube-channel-card">
          <div class="youtube-channel-main">
            <section class="youtube-channel-profile">
              <img class="youtube-channel-avatar" src="${escapeHtmlText(YOUTUBE_AVATAR_FALLBACK)}" alt="YouTube">
              <div class="youtube-channel-copy">
                <h3 class="youtube-channel-name">Brak kanałów YouTube</h3>
                <p class="youtube-channel-description">Administrator nie dodał jeszcze żadnych kanałów.</p>
              </div>
            </section>
            <section class="youtube-videos">
              <p class="youtube-video-empty">Po dodaniu kanałów zobaczysz tutaj 5 filmów.</p>
            </section>
          </div>
        </article>
      `;
      setYoutubeStatus("Brak kanałów YouTube do wyświetlenia.", "info");
      return;
    }

    const activeSortMode = normalizeYouTubeSortMode(youtubeSortMode);
    const renderToken = ++youtubeRenderSeq;
    if (forceReload) {
      youtubeChannelDataCache.clear();
    }

    youtubeChannelsGridEl.innerHTML = channels
      .map((channel) => {
        const label = escapeHtmlText(channel && (channel.name || channel.handle || channel.channelId) || "Kanał YouTube");
        return `
          <article class="youtube-channel-card is-loading">
            <div class="youtube-channel-main">
              <section class="youtube-channel-profile">
                <img class="youtube-channel-avatar" src="${escapeHtmlText(YOUTUBE_AVATAR_FALLBACK)}" alt="${label}">
                <div class="youtube-channel-copy">
                  <h3 class="youtube-channel-name">${label}</h3>
                  <p class="youtube-channel-description">Ładowanie danych kanału i filmów...</p>
                </div>
              </section>
              <section class="youtube-videos">
                <p class="youtube-video-empty">Ładowanie 5 filmów...</p>
              </section>
            </div>
          </article>
        `;
      })
      .join("");
    setYoutubeStatus("Ładowanie kanałów YouTube...", "info");

    const results = await Promise.all(
      channels.map(async (channel) => {
        try {
          const payload = await loadYouTubeChannelCardData(channel, activeSortMode || channel.defaultSortMode);
          return {
            ok: true,
            payload
          };
        } catch (error) {
          return {
            ok: false,
            channel,
            error
          };
        }
      })
    );

    if (renderToken !== youtubeRenderSeq) {
      return;
    }

    let successCount = 0;
    youtubeChannelsGridEl.innerHTML = results
      .map((result) => {
        if (result.ok) {
          successCount += 1;
          return buildYouTubeChannelCardHtml(result.payload);
        }

        const channel = normalizeYouTubeChannelEntry(result.channel) || {};
        const fallbackPayload = {
          id: String(channel.id || "").trim(),
          name: String(channel.name || channel.handle || channel.channelId || "Kanał YouTube").trim(),
          channelId: normalizeYouTubeChannelId(channel.channelId),
          handle: normalizeYouTubeHandle(channel.handle),
          userName: normalizeYouTubeUserName(channel.userName),
          channelUrl: buildCanonicalYouTubeChannelUrl(channel),
          subscribersText: "",
          description: "Nie udało się pobrać danych tego kanału.",
          avatarUrl: YOUTUBE_AVATAR_FALLBACK,
          sortMode: activeSortMode,
          videos: []
        };
        return buildYouTubeChannelCardHtml(fallbackPayload);
      })
      .join("");

    if (!successCount) {
      setYoutubeStatus("Nie udało się pobrać kanałów YouTube.", "error");
      return;
    }

    if (successCount < channels.length) {
      setYoutubeStatus(`Załadowano ${successCount}/${channels.length} kanałów YouTube.`, "info");
      return;
    }

    setYoutubeStatus(`Załadowano ${successCount} kanałów YouTube.`, "success");
  }

  function setYouTubeFormEditingState(channelId = "") {
    editingYoutubeChannelId = String(channelId || "").trim();
    if (!adminYoutubeFormEl) {
      return;
    }
    const submitBtn = adminYoutubeFormEl.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = editingYoutubeChannelId ? "Zapisz zmiany kanału" : "Dodaj kanał YouTube";
    }
  }

  function renderAdminYoutubeTable() {
    if (!adminYoutubeTableBodyEl) {
      return;
    }

    adminYoutubeTableBodyEl.innerHTML = "";
    if (!youtubeChannels.length) {
      adminYoutubeTableBodyEl.innerHTML = `
        <tr>
          <td colspan="3" class="admin-table-empty">Brak dodanych kanałów YouTube.</td>
        </tr>
      `;
      return;
    }

    youtubeChannels.forEach((channel) => {
      const channelUrl = buildCanonicalYouTubeChannelUrl(channel);
      const channelLabel = String(channel.name || channel.handle || channel.channelId || channel.userName || "Kanał YouTube").trim();
      const row = document.createElement("tr");
      row.dataset.youtubeId = String(channel.id || "").trim();
      row.innerHTML = `
        <td>
          <strong>${escapeHtmlText(channelLabel)}</strong>
          ${
            channelUrl
              ? `<div><a href="${escapeHtmlText(channelUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtmlText(channelUrl)}</a></div>`
              : ""
          }
        </td>
        <td>${escapeHtmlText(formatYouTubeSortModeLabel(channel.defaultSortMode))}</td>
        <td>
          <span class="admin-account-actions">
            <button class="admin-row-btn" type="button" data-youtube-edit="${escapeHtmlText(channel.id)}">Edytuj</button>
            <button class="admin-row-btn admin-row-btn-danger" type="button" data-youtube-remove="${escapeHtmlText(channel.id)}">Usuń</button>
          </span>
        </td>
      `;
      adminYoutubeTableBodyEl.appendChild(row);
    });
  }

  function bindAdminYoutubeFeature() {
    if (adminYoutubeBound) {
      return;
    }
    adminYoutubeBound = true;

    if (adminYoutubeFormEl) {
      adminYoutubeFormEl.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!hasYouTubeTabAccess()) {
          setAdminYoutubeStatus("Brak permisji do zakładki YouTube.", "error");
          sendAdminAuditEvent("admin_youtube_access_denied", {
            operation: "submit_youtube_form"
          });
          return;
        }

        const formData = new FormData(adminYoutubeFormEl);
        const channelInput = String(formData.get("youtubeChannelInput") || "").trim();
        const name = String(formData.get("youtubeChannelName") || "").trim();
        const defaultSortMode = normalizeYouTubeSortMode(formData.get("youtubeSortMode"));
        const parsed = parseYouTubeChannelReference(channelInput);
        if (!parsed) {
          setAdminYoutubeStatus("Podaj poprawny URL kanału, @handle lub ID kanału (UC...).", "error");
          return;
        }

        const normalizedChannel = normalizeYouTubeChannelEntry({
          id: editingYoutubeChannelId || "",
          name,
          channelId: parsed.channelId,
          handle: parsed.handle,
          userName: parsed.userName,
          channelUrl: parsed.channelUrl,
          defaultSortMode
        });
        if (!normalizedChannel) {
          setAdminYoutubeStatus("Nie udało się zapisać kanału YouTube.", "error");
          return;
        }

        const duplicate = youtubeChannels.find((entry) => {
          if (!entry || String(entry.id || "").trim() === String(editingYoutubeChannelId || "").trim()) {
            return false;
          }
          if (normalizedChannel.channelId && normalizeYouTubeChannelId(entry.channelId) === normalizedChannel.channelId) {
            return true;
          }
          if (
            normalizedChannel.handle &&
            normalizeYouTubeHandle(entry.handle).toLowerCase() === normalizedChannel.handle.toLowerCase()
          ) {
            return true;
          }
          const entryUrl = buildCanonicalYouTubeChannelUrl(entry).toLowerCase();
          const nextUrl = buildCanonicalYouTubeChannelUrl(normalizedChannel).toLowerCase();
          return Boolean(nextUrl && entryUrl && nextUrl === entryUrl);
        });
        if (duplicate) {
          setAdminYoutubeStatus("Ten kanał YouTube jest już dodany.", "error");
          return;
        }

        if (editingYoutubeChannelId) {
          const index = youtubeChannels.findIndex((entry) => String(entry.id || "").trim() === editingYoutubeChannelId);
          if (index === -1) {
            setYouTubeFormEditingState("");
            setAdminYoutubeStatus("Nie znaleziono kanału do edycji.", "error");
            return;
          }

          const beforeEntry = { ...youtubeChannels[index] };
          youtubeChannels[index] = {
            ...youtubeChannels[index],
            ...normalizedChannel,
            id: editingYoutubeChannelId
          };
          saveYouTubeChannels();
          renderAdminYoutubeTable();
          setYouTubeFormEditingState("");
          adminYoutubeFormEl.reset();
          setAdminYoutubeStatus("Zaktualizowano kanał YouTube.", "success");
          sendAdminAuditEvent("admin_youtube_channel_updated", {
            before: buildYouTubeChannelAuditSnapshot(beforeEntry),
            after: buildYouTubeChannelAuditSnapshot(youtubeChannels[index])
          });
        } else {
          youtubeChannels.push(normalizedChannel);
          saveYouTubeChannels();
          renderAdminYoutubeTable();
          setYouTubeFormEditingState("");
          adminYoutubeFormEl.reset();
          setAdminYoutubeStatus("Dodano kanał YouTube.", "success");
          sendAdminAuditEvent("admin_youtube_channel_added", {
            channel: buildYouTubeChannelAuditSnapshot(normalizedChannel),
            channelsCount: youtubeChannels.length
          });
        }

        void renderPublicYouTubeCards({ force: true });
      });
    }

    if (adminYoutubeTableBodyEl) {
      adminYoutubeTableBodyEl.addEventListener("click", (event) => {
        if (!hasYouTubeTabAccess()) {
          setAdminYoutubeStatus("Brak permisji do zakładki YouTube.", "error");
          sendAdminAuditEvent("admin_youtube_access_denied", {
            operation: "click_youtube_table"
          });
          return;
        }

        const editBtn = event.target.closest("[data-youtube-edit]");
        if (editBtn) {
          const channelId = String(editBtn.getAttribute("data-youtube-edit") || "").trim();
          const entry = youtubeChannels.find((item) => String(item.id || "").trim() === channelId);
          if (!entry || !adminYoutubeFormEl) {
            setAdminYoutubeStatus("Nie znaleziono kanału do edycji.", "error");
            return;
          }

          const inputEl = adminYoutubeFormEl.querySelector('input[name="youtubeChannelInput"]');
          const nameEl = adminYoutubeFormEl.querySelector('input[name="youtubeChannelName"]');
          const sortEl = adminYoutubeFormEl.querySelector('select[name="youtubeSortMode"]');
          if (inputEl) {
            inputEl.value = buildCanonicalYouTubeChannelUrl(entry);
          }
          if (nameEl) {
            nameEl.value = String(entry.name || "").trim();
          }
          if (sortEl) {
            sortEl.value = normalizeYouTubeSortMode(entry.defaultSortMode);
          }

          setYouTubeFormEditingState(channelId);
          setAdminYoutubeStatus("Tryb edycji kanału YouTube.", "info");
          return;
        }

        const removeBtn = event.target.closest("[data-youtube-remove]");
        if (!removeBtn) {
          return;
        }

        const channelId = String(removeBtn.getAttribute("data-youtube-remove") || "").trim();
        const removedEntry = youtubeChannels.find((item) => String(item.id || "").trim() === channelId) || null;
        const beforeCount = youtubeChannels.length;
        youtubeChannels = youtubeChannels.filter((item) => String(item.id || "").trim() !== channelId);
        if (youtubeChannels.length === beforeCount) {
          setAdminYoutubeStatus("Nie znaleziono kanału do usunięcia.", "error");
          return;
        }

        saveYouTubeChannels();
        renderAdminYoutubeTable();
        if (editingYoutubeChannelId === channelId) {
          setYouTubeFormEditingState("");
          if (adminYoutubeFormEl) {
            adminYoutubeFormEl.reset();
          }
        }
        setAdminYoutubeStatus("Usunięto kanał YouTube.", "success");
        sendAdminAuditEvent("admin_youtube_channel_removed", {
          channel: buildYouTubeChannelAuditSnapshot(removedEntry),
          channelsCount: youtubeChannels.length
        });
        void renderPublicYouTubeCards({ force: true });
      });
    }
  }

  function formatLicznikModeLabel(modeValue) {
    return normalizeLicznikMode(modeValue) === "until" ? "Do daty" : "Od daty";
  }

  function formatLicznikImageLabel(item) {
    const itemTitle = item && typeof item === "object" ? item.title : "";
    const imageUrl = sanitizeLicznikImageUrl(item && item.imageUrl) || sanitizeLicznikImageUrl(getDefaultLicznikImageByTitle(itemTitle));
    return imageUrl ? "Tak" : "Nie";
  }

  function padLicznikDateSegment(value) {
    return String(value).padStart(2, "0");
  }

  function getLicznikUtcPlusOnePartsFromTimestamp(timestampMs) {
    const sourceMs = Number(timestampMs);
    if (!Number.isFinite(sourceMs)) {
      return null;
    }

    const localDate = new Date(sourceMs);
    if (!Number.isFinite(localDate.getTime())) {
      return null;
    }

    return {
      year: localDate.getFullYear(),
      month: localDate.getMonth() + 1,
      day: localDate.getDate(),
      hour: localDate.getHours(),
      minute: localDate.getMinutes(),
      second: localDate.getSeconds()
    };
  }

  function getLicznikUtcPlusOneParts(dateObj) {
    if (!(dateObj instanceof Date) || !Number.isFinite(dateObj.getTime())) {
      return null;
    }
    return getLicznikUtcPlusOnePartsFromTimestamp(dateObj.getTime());
  }

  function createLicznikDateFromUtcPlusOneParts(year, month, day, hour = 0, minute = 0, second = 0, millisecond = 0) {
    const localDate = new Date(year, month - 1, day, hour, minute, second, millisecond);
    if (!Number.isFinite(localDate.getTime())) {
      return null;
    }
    return localDate;
  }

  function getLicznikUtcPlusOneDayOfWeek(year, month, day) {
    const localDate = new Date(year, month - 1, day, 12, 0, 0, 0);
    if (!Number.isFinite(localDate.getTime())) {
      return Number.NaN;
    }
    return localDate.getDay();
  }

  function addDaysToLicznikUtcPlusOneDateParts(year, month, day, deltaDays) {
    const localDate = new Date(year, month - 1, day + deltaDays, 12, 0, 0, 0);
    if (!Number.isFinite(localDate.getTime())) {
      return null;
    }
    return {
      year: localDate.getFullYear(),
      month: localDate.getMonth() + 1,
      day: localDate.getDate()
    };
  }

  function formatLicznikDateLabel(dateValue) {
    const parsedDate = parseLicznikDateInputValue(String(dateValue || "").trim());
    if (!parsedDate || !Number.isFinite(parsedDate.getTime())) {
      return "-";
    }
    const parts = getLicznikUtcPlusOneParts(parsedDate);
    if (!parts) {
      return "-";
    }
    return `${padLicznikDateSegment(parts.day)}.${padLicznikDateSegment(parts.month)}.${parts.year}, ${padLicznikDateSegment(
      parts.hour
    )}:${padLicznikDateSegment(parts.minute)}`;
  }

  function formatLicznikEndDateLabel(item) {
    const safeItem = item && typeof item === "object" ? item : {};
    if (normalizeLicznikMode(safeItem.mode) !== "since") {
      return "-";
    }

    const parsedEndDate = parseLicznikDateInputValue(String(safeItem.endDate || "").trim());
    if (!parsedEndDate || !Number.isFinite(parsedEndDate.getTime())) {
      return "Brak";
    }
    return formatLicznikDateLabel(parsedEndDate.toISOString());
  }

  function isLicznikFinished(item, nowCivilMs = getLicznikCivilMs(new Date())) {
    const safeItem = item && typeof item === "object" ? item : {};
    if (normalizeLicznikMode(safeItem.mode) !== "since" || !Number.isFinite(nowCivilMs)) {
      return false;
    }

    const parsedTargetDate = parseLicznikDateInputValue(String(safeItem.targetDate || "").trim());
    const parsedEndDate = parseLicznikDateInputValue(String(safeItem.endDate || "").trim());
    const targetDateMs = getLicznikCivilMs(parsedTargetDate);
    const endDateMs = getLicznikCivilMs(parsedEndDate);
    if (!Number.isFinite(targetDateMs) || !Number.isFinite(endDateMs) || endDateMs <= targetDateMs) {
      return false;
    }
    return nowCivilMs >= endDateMs;
  }

  function toLicznikDateInputValue(dateValue) {
    const parsedDate = parseLicznikDateInputValue(String(dateValue || "").trim());
    if (!parsedDate || !Number.isFinite(parsedDate.getTime())) {
      return "";
    }
    const parts = getLicznikUtcPlusOneParts(parsedDate);
    if (!parts) {
      return "";
    }
    return `${parts.year}-${padLicznikDateSegment(parts.month)}-${padLicznikDateSegment(parts.day)}T${padLicznikDateSegment(
      parts.hour
    )}:${padLicznikDateSegment(parts.minute)}`;
  }

  function toLicznikDateInputValueFromDate(dateObj) {
    if (!(dateObj instanceof Date) || !Number.isFinite(dateObj.getTime())) {
      return "";
    }
    return toLicznikDateInputValue(dateObj.toISOString());
  }

  function parseLicznikDateInputValue(inputValue) {
    const clean = String(inputValue || "").trim();
    if (!clean) {
      return null;
    }

    const match = clean.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
    if (match) {
      const year = Number.parseInt(match[1], 10);
      const month = Number.parseInt(match[2], 10);
      const day = Number.parseInt(match[3], 10);
      const hour = Number.parseInt(match[4], 10);
      const minute = Number.parseInt(match[5], 10);
      const second = Number.parseInt(match[6] || "0", 10);
      const isInRange =
        Number.isFinite(year) &&
        Number.isFinite(month) &&
        Number.isFinite(day) &&
        Number.isFinite(hour) &&
        Number.isFinite(minute) &&
        Number.isFinite(second) &&
        month >= 1 &&
        month <= 12 &&
        day >= 1 &&
        day <= 31 &&
        hour >= 0 &&
        hour <= 23 &&
        minute >= 0 &&
        minute <= 59 &&
        second >= 0 &&
        second <= 59;
      if (isInRange) {
        const parsedDate = createLicznikDateFromUtcPlusOneParts(year, month, day, hour, minute, second, 0);
        const parsedParts = getLicznikUtcPlusOneParts(parsedDate);
        if (
          parsedParts &&
          parsedParts.year === year &&
          parsedParts.month === month &&
          parsedParts.day === day &&
          parsedParts.hour === hour &&
          parsedParts.minute === minute &&
          parsedParts.second === second
        ) {
          return parsedDate;
        }
      }
    }

    const parsedMs = Date.parse(clean);
    if (!Number.isFinite(parsedMs)) {
      return null;
    }
    return new Date(parsedMs);
  }

  function formatLicznikDateDisplay(dateObj) {
    if (!(dateObj instanceof Date) || !Number.isFinite(dateObj.getTime())) {
      return "";
    }
    const parts = getLicznikUtcPlusOneParts(dateObj);
    if (!parts) {
      return "";
    }
    return `${padLicznikDateSegment(parts.day)}.${padLicznikDateSegment(parts.month)}.${parts.year} ${padLicznikDateSegment(
      parts.hour
    )}:${padLicznikDateSegment(parts.minute)}`;
  }

  function readImageFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      if (!(file instanceof File)) {
        resolve("");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Nie udaĹ‚o siÄ™ wczytaÄ‡ pliku graficznego."));
      reader.readAsDataURL(file);
    });
  }

  function resolveLicznikDatePresetMs(presetKey) {
    const now = Date.now();
    const hourMs = 60 * 60 * 1000;
    const dayMs = 24 * hourMs;
    const cleanPreset = String(presetKey || "").trim().toLowerCase();

    if (!cleanPreset) {
      return Number.NaN;
    }

    if (cleanPreset === "in_30m") {
      return now + 30 * 60 * 1000;
    }
    if (cleanPreset === "in_1h") {
      return now + hourMs;
    }
    if (cleanPreset === "in_6h") {
      return now + 6 * hourMs;
    }
    if (cleanPreset === "in_1d") {
      return now + dayMs;
    }
    if (cleanPreset === "in_7d") {
      return now + 7 * dayMs;
    }
    if (cleanPreset === "next_midnight") {
      const nowParts = getLicznikUtcPlusOnePartsFromTimestamp(now);
      if (!nowParts) {
        return Number.NaN;
      }
      const nextMidnight = createLicznikDateFromUtcPlusOneParts(
        nowParts.year,
        nowParts.month,
        nowParts.day + 1,
        0,
        0,
        0,
        0
      );
      return nextMidnight ? nextMidnight.getTime() : Number.NaN;
    }

    return Number.NaN;
  }

  function bindAdminLicznikSingleDateControl(options = {}) {
    if (!adminLicznikFormEl) {
      return;
    }

    const dateInputSelector = String(options.dateInputSelector || "").trim();
    const dateDisplaySelector = String(options.dateDisplaySelector || "").trim();
    const openButtonSelector = String(options.openButtonSelector || "").trim();
    const pickerId = String(options.pickerId || "").trim();
    const pickerAttrPrefix = String(options.pickerAttrPrefix || "").trim();
    const presetSelectSelector = String(options.presetSelectSelector || "").trim();

    if (!dateInputSelector || !dateDisplaySelector || !pickerId || !pickerAttrPrefix) {
      return;
    }

    const dateInput = adminLicznikFormEl.querySelector(dateInputSelector);
    const dateDisplayInput = adminLicznikFormEl.querySelector(dateDisplaySelector);
    const presetSelect = presetSelectSelector ? adminLicznikFormEl.querySelector(presetSelectSelector) : null;
    const openPickerBtn = openButtonSelector ? adminLicznikFormEl.querySelector(openButtonSelector) : null;
    const pickerEl = document.getElementById(pickerId);
    const pickerMonthEl = pickerEl ? pickerEl.querySelector(`[data-${pickerAttrPrefix}-month]`) : null;
    const pickerGridEl = pickerEl ? pickerEl.querySelector(`[data-${pickerAttrPrefix}-grid]`) : null;
    const pickerPrevBtn = pickerEl ? pickerEl.querySelector(`[data-${pickerAttrPrefix}-prev]`) : null;
    const pickerNextBtn = pickerEl ? pickerEl.querySelector(`[data-${pickerAttrPrefix}-next]`) : null;
    const pickerYearPrevBtn = pickerEl ? pickerEl.querySelector(`[data-${pickerAttrPrefix}-year-prev]`) : null;
    const pickerYearNextBtn = pickerEl ? pickerEl.querySelector(`[data-${pickerAttrPrefix}-year-next]`) : null;
    const pickerYearInput = pickerEl ? pickerEl.querySelector(`[data-${pickerAttrPrefix}-year-input]`) : null;
    const pickerHourInput = pickerEl ? pickerEl.querySelector(`[data-${pickerAttrPrefix}-hour]`) : null;
    const pickerMinuteInput = pickerEl ? pickerEl.querySelector(`[data-${pickerAttrPrefix}-minute]`) : null;
    const pickerApplyBtn = pickerEl ? pickerEl.querySelector(`[data-${pickerAttrPrefix}-apply]`) : null;
    const pickerNowBtn = pickerEl ? pickerEl.querySelector(`[data-${pickerAttrPrefix}-now]`) : null;
    if (
      !dateInput ||
      !dateDisplayInput ||
      !pickerEl ||
      !pickerMonthEl ||
      !pickerGridEl ||
      !pickerPrevBtn ||
      !pickerNextBtn ||
      !pickerYearPrevBtn ||
      !pickerYearNextBtn ||
      !pickerYearInput ||
      !pickerHourInput ||
      !pickerMinuteInput ||
      !pickerApplyBtn ||
      !pickerNowBtn
    ) {
      return;
    }

    const dayAttr = `data-${pickerAttrPrefix}-day`;
    const daySelector = `[${dayAttr}]`;
    const clamp = (value, min, max, fallback) => {
      const numeric = Number.parseInt(String(value || "").trim(), 10);
      if (!Number.isFinite(numeric)) {
        return fallback;
      }
      return Math.min(max, Math.max(min, numeric));
    };

    function createNowUtcPlusOneDate() {
      const nowParts = getLicznikUtcPlusOneParts(new Date());
      if (!nowParts) {
        return new Date();
      }
      return (
        createLicznikDateFromUtcPlusOneParts(nowParts.year, nowParts.month, nowParts.day, nowParts.hour, nowParts.minute, 0, 0) ||
        new Date()
      );
    }

    let selectedDate = parseLicznikDateInputValue(dateInput.value) || createNowUtcPlusOneDate();
    let selectedParts = getLicznikUtcPlusOneParts(selectedDate) || getLicznikUtcPlusOneParts(new Date());
    let viewYear = selectedParts ? selectedParts.year : new Date().getUTCFullYear();
    let viewMonth = selectedParts ? selectedParts.month - 1 : 0;
    const clampYear = (value) => clamp(value, 1970, 2100, viewYear);

    function setPickerTimeFromSelected() {
      const parts = getLicznikUtcPlusOneParts(selectedDate);
      if (!parts) {
        return;
      }
      pickerHourInput.value = padLicznikDateSegment(parts.hour);
      pickerMinuteInput.value = padLicznikDateSegment(parts.minute);
    }

    function renderPickerGrid() {
      const monthLabel = String(LICZNIKI_MONTH_NAMES_PL[viewMonth] || "");
      pickerMonthEl.textContent = monthLabel ? monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1) : "";
      pickerYearInput.value = String(viewYear);
      pickerGridEl.innerHTML = "";

      const firstDayDow = getLicznikUtcPlusOneDayOfWeek(viewYear, viewMonth + 1, 1);
      const startOffset = (firstDayDow + 6) % 7; // Monday first
      const todayParts = getLicznikUtcPlusOneParts(new Date());
      const activeParts = getLicznikUtcPlusOneParts(selectedDate);

      for (let i = 0; i < 42; i += 1) {
        const dayParts = addDaysToLicznikUtcPlusOneDateParts(viewYear, viewMonth + 1, 1, i - startOffset);
        if (!dayParts) {
          continue;
        }
        const dayBtn = document.createElement("button");
        dayBtn.type = "button";
        dayBtn.className = "admin-date-picker-day";
        dayBtn.textContent = String(dayParts.day);
        dayBtn.setAttribute(
          dayAttr,
          `${dayParts.year}-${padLicznikDateSegment(dayParts.month)}-${padLicznikDateSegment(dayParts.day)}`
        );
        if (dayParts.month !== viewMonth + 1) {
          dayBtn.classList.add("is-outside");
        }
        if (
          todayParts &&
          dayParts.year === todayParts.year &&
          dayParts.month === todayParts.month &&
          dayParts.day === todayParts.day
        ) {
          dayBtn.classList.add("is-today");
        }
        if (
          activeParts &&
          dayParts.year === activeParts.year &&
          dayParts.month === activeParts.month &&
          dayParts.day === activeParts.day
        ) {
          dayBtn.classList.add("is-selected");
        }
        pickerGridEl.appendChild(dayBtn);
      }
    }

    function openPicker() {
      pickerEl.hidden = false;
      renderPickerGrid();
      setPickerTimeFromSelected();
    }

    function closePicker() {
      pickerEl.hidden = true;
    }

    function applyPickerSelection(closeAfterApply = true) {
      const currentParts = getLicznikUtcPlusOneParts(selectedDate);
      if (!currentParts) {
        return;
      }
      const hours = clamp(pickerHourInput.value, 0, 23, currentParts.hour);
      const minutes = clamp(pickerMinuteInput.value, 0, 59, currentParts.minute);
      selectedDate =
        createLicznikDateFromUtcPlusOneParts(
          currentParts.year,
          currentParts.month,
          currentParts.day,
          hours,
          minutes,
          0,
          0
        ) || selectedDate;

      dateInput.value = toLicznikDateInputValueFromDate(selectedDate);
      dateDisplayInput.value = formatLicznikDateDisplay(selectedDate);
      if (presetSelect) {
        presetSelect.value = "";
      }
      if (closeAfterApply) {
        closePicker();
      }
    }

    function syncFromHiddenDateInput() {
      const parsed = parseLicznikDateInputValue(dateInput.value);
      if (!parsed) {
        selectedDate = createNowUtcPlusOneDate();
        const nowParts = getLicznikUtcPlusOneParts(selectedDate);
        if (nowParts) {
          viewYear = nowParts.year;
          viewMonth = nowParts.month - 1;
        }
        dateDisplayInput.value = "";
        return;
      }
      selectedDate = parsed;
      const parts = getLicznikUtcPlusOneParts(selectedDate);
      if (parts) {
        viewYear = parts.year;
        viewMonth = parts.month - 1;
      }
      dateDisplayInput.value = formatLicznikDateDisplay(selectedDate);
      setPickerTimeFromSelected();
      renderPickerGrid();
    }

    syncFromHiddenDateInput();

    if (openPickerBtn) {
      openPickerBtn.addEventListener("click", (event) => {
        event.preventDefault();
        openPicker();
      });
    }

    dateDisplayInput.addEventListener("click", (event) => {
      event.preventDefault();
      openPicker();
    });

    pickerPrevBtn.addEventListener("click", () => {
      viewMonth -= 1;
      if (viewMonth < 0) {
        viewMonth = 11;
        viewYear -= 1;
      }
      renderPickerGrid();
    });

    pickerNextBtn.addEventListener("click", () => {
      viewMonth += 1;
      if (viewMonth > 11) {
        viewMonth = 0;
        viewYear += 1;
      }
      renderPickerGrid();
    });

    pickerYearPrevBtn.addEventListener("click", () => {
      viewYear = clampYear(viewYear - 1);
      renderPickerGrid();
    });

    pickerYearNextBtn.addEventListener("click", () => {
      viewYear = clampYear(viewYear + 1);
      renderPickerGrid();
    });

    pickerYearInput.addEventListener("change", () => {
      viewYear = clampYear(pickerYearInput.value);
      renderPickerGrid();
    });

    pickerYearInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        viewYear = clampYear(pickerYearInput.value);
        renderPickerGrid();
      }
    });

    pickerYearInput.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        const step = event.deltaY < 0 ? 1 : -1;
        const multiplier = event.shiftKey ? 10 : 1;
        viewYear = clampYear(viewYear + step * multiplier);
        renderPickerGrid();
      },
      { passive: false }
    );

    pickerGridEl.addEventListener("click", (event) => {
      const dayBtn = event.target.closest(daySelector);
      if (!dayBtn) {
        return;
      }
      const rawDate = String(dayBtn.getAttribute(dayAttr) || "").trim();
      const match = rawDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (!match) {
        return;
      }
      const year = Number.parseInt(match[1], 10);
      const month = Number.parseInt(match[2], 10);
      const day = Number.parseInt(match[3], 10);
      const currentParts = getLicznikUtcPlusOneParts(selectedDate);
      const fallbackHour = currentParts ? currentParts.hour : 0;
      const fallbackMinute = currentParts ? currentParts.minute : 0;
      const hours = clamp(pickerHourInput.value, 0, 23, fallbackHour);
      const minutes = clamp(pickerMinuteInput.value, 0, 59, fallbackMinute);
      selectedDate = createLicznikDateFromUtcPlusOneParts(year, month, day, hours, minutes, 0, 0) || selectedDate;
      viewYear = year;
      viewMonth = month - 1;
      renderPickerGrid();
    });

    pickerNowBtn.addEventListener("click", () => {
      selectedDate = createNowUtcPlusOneDate();
      const parts = getLicznikUtcPlusOneParts(selectedDate);
      if (parts) {
        viewYear = parts.year;
        viewMonth = parts.month - 1;
      }
      setPickerTimeFromSelected();
      renderPickerGrid();
      applyPickerSelection(true);
    });

    pickerApplyBtn.addEventListener("click", () => {
      applyPickerSelection(true);
    });

    dateInput.addEventListener("change", syncFromHiddenDateInput);
    dateInput.addEventListener("input", syncFromHiddenDateInput);

    adminLicznikFormEl.addEventListener("reset", () => {
      window.setTimeout(() => {
        selectedDate = createNowUtcPlusOneDate();
        const parts = getLicznikUtcPlusOneParts(selectedDate);
        if (parts) {
          viewYear = parts.year;
          viewMonth = parts.month - 1;
        }
        dateDisplayInput.value = "";
        setPickerTimeFromSelected();
        renderPickerGrid();
        closePicker();
      }, 0);
    });

    document.addEventListener("mousedown", (event) => {
      if (pickerEl.hidden) {
        return;
      }
      const target = event.target;
      if (pickerEl.contains(target) || dateDisplayInput.contains(target) || (openPickerBtn && openPickerBtn.contains(target))) {
        return;
      }
      closePicker();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !pickerEl.hidden) {
        closePicker();
      }
    });

    if (presetSelect) {
      presetSelect.addEventListener("change", () => {
        const presetMs = resolveLicznikDatePresetMs(presetSelect.value);
        if (!Number.isFinite(presetMs)) {
          openPicker();
          return;
        }
        const presetParts = getLicznikUtcPlusOnePartsFromTimestamp(presetMs);
        if (!presetParts) {
          return;
        }
        selectedDate =
          createLicznikDateFromUtcPlusOneParts(
            presetParts.year,
            presetParts.month,
            presetParts.day,
            presetParts.hour,
            presetParts.minute,
            0,
            0
          ) || selectedDate;
        viewYear = presetParts.year;
        viewMonth = presetParts.month - 1;
        setPickerTimeFromSelected();
        renderPickerGrid();
        applyPickerSelection(false);
      });
    }
  }

  function bindAdminLicznikDateControls() {
    bindAdminLicznikSingleDateControl({
      dateInputSelector: 'input[name="licznikDate"]',
      dateDisplaySelector: 'input[name="licznikDateDisplay"]',
      openButtonSelector: "[data-licznik-date-open]",
      pickerId: "adminLicznikDatePicker",
      pickerAttrPrefix: "licznik-picker",
      presetSelectSelector: 'select[name="licznikDatePreset"]'
    });
  }

  function renderPublicLicznikiCards() {
    if (!licznikiGridEl) {
      return;
    }

    licznikiGridEl.innerHTML = "";
    if (!licznikiItems.length) {
      licznikiGridEl.innerHTML = `
        <article class="kary-counter-card liczniki-card">
          <p class="kary-card-state">BRAK DANYCH</p>
          <h3>Brak licznikĂłw</h3>
          <span class="kary-counter-pill">--</span>
        </article>
      `;
      return;
    }

    licznikiItems.forEach((item) => {
      const imageUrl = sanitizeLicznikImageUrl(item.imageUrl) || sanitizeLicznikImageUrl(getDefaultLicznikImageByTitle(item.title));
      const safeImageUrl = escapeHtmlText(imageUrl);
      const mode = normalizeLicznikMode(item.mode);
      const parsedTargetDate = parseLicznikDateInputValue(String(item.targetDate || "").trim());
      const parsedEndDate = parseLicznikDateInputValue(String(item.endDate || "").trim());
      const parsedTargetDateMs = parsedTargetDate ? parsedTargetDate.getTime() : Number.NaN;
      const parsedEndDateMs = parsedEndDate ? parsedEndDate.getTime() : Number.NaN;
      const hasValidEndDate =
        mode === "since" && Number.isFinite(parsedTargetDateMs) && Number.isFinite(parsedEndDateMs) && parsedEndDateMs > parsedTargetDateMs;
      const card = document.createElement("article");
      card.className = "kary-counter-card liczniki-card";
      if (imageUrl) {
        card.classList.add("has-image");
        card.setAttribute("data-licznik-image", imageUrl);
      } else {
        card.removeAttribute("data-licznik-image");
      }
      card.setAttribute("data-licznik-mode", mode);
      card.setAttribute("data-licznik-date", String(item.targetDate || ""));
      if (hasValidEndDate) {
        card.setAttribute("data-licznik-end-date", new Date(parsedEndDateMs).toISOString());
      } else {
        card.removeAttribute("data-licznik-end-date");
      }
      card.innerHTML = `
        ${
          imageUrl
            ? `
              <span class="liczniki-card-media" aria-hidden="true">
                <img class="liczniki-card-image" src="${safeImageUrl}" alt="">
              </span>
            `
            : ""
        }
        <div class="liczniki-card-content">
          <p class="kary-card-state" data-licznik-state>${mode === "until" ? "DO STARTU" : "OD STARTU"}</p>
          <h3>${escapeHtmlText(item.title)}</h3>
          <span class="kary-counter-pill" data-licznik-value>00:00:00</span>
        </div>
      `;
      licznikiGridEl.appendChild(card);
    });
  }

  function renderAdminLicznikiTable() {
    if (!adminLicznikiTableBodyEl) {
      return;
    }

    adminLicznikiTableBodyEl.innerHTML = "";
    if (!licznikiItems.length) {
      adminLicznikiTableBodyEl.innerHTML = `
        <tr>
          <td colspan="6" class="admin-table-empty">Brak licznikĂłw.</td>
        </tr>
      `;
      return;
    }

    const nowCivilMs = getLicznikCivilMs(new Date());
    licznikiItems.forEach((item) => {
      const imageUrl = sanitizeLicznikImageUrl(item.imageUrl) || sanitizeLicznikImageUrl(getDefaultLicznikImageByTitle(item.title));
      const mode = normalizeLicznikMode(item.mode);
      const isFinished = isLicznikFinished(item, nowCivilMs);
      const canScheduleFinish = mode === "since" && !isFinished;
      const row = document.createElement("tr");
      row.className = "admin-licznik-row";
      row.dataset.licznikId = item.id;
      row.innerHTML = `
        <td>
          <button
            class="admin-row-btn admin-cennik-drag-handle"
            type="button"
            draggable="true"
            data-licznik-drag-handle="${escapeHtmlText(item.id)}"
            title="PrzeciÄ…gnij, aby ustawiÄ‡ kolejnoĹ›Ä‡ licznikĂłw"
            aria-label="PrzeciÄ…gnij, aby ustawiÄ‡ kolejnoĹ›Ä‡ licznikĂłw"
          >
            <img class="admin-drag-icon" src="/img/drag%26drop.ico" alt="" aria-hidden="true">
          </button>
          ${escapeHtmlText(item.title)}
        </td>
        <td>${escapeHtmlText(formatLicznikModeLabel(item.mode))}</td>
        <td>${escapeHtmlText(formatLicznikDateLabel(item.targetDate))}</td>
        <td>${escapeHtmlText(formatLicznikEndDateLabel(item))}</td>
        <td>
          ${
            imageUrl
              ? `<span class="admin-licznik-image-pill"><img src="${escapeHtmlText(imageUrl)}" alt="Grafika licznika"></span>`
              : `${escapeHtmlText(formatLicznikImageLabel(item))}`
          }
        </td>
        <td>
          <span class="admin-account-actions">
            ${
              isFinished
                ? `
                  <button class="admin-row-btn admin-row-btn-resume" type="button" data-licznik-resume="${escapeHtmlText(item.id)}">WznĂłw</button>
                `
                : `
                  <button
                    class="admin-row-btn admin-row-btn-finish"
                    type="button"
                    data-licznik-finish="${escapeHtmlText(item.id)}"
                    ${canScheduleFinish ? "" : "disabled"}
                  >ZakoĹ„cz</button>
                `
            }
            <button class="admin-row-btn" type="button" data-licznik-edit="${escapeHtmlText(item.id)}">Edytuj</button>
            <button class="admin-row-btn admin-row-btn-danger" type="button" data-licznik-remove="${escapeHtmlText(item.id)}">UsuĹ„</button>
          </span>
        </td>
      `;
      adminLicznikiTableBodyEl.appendChild(row);
    });
  }

  function closeAdminLicznikFinishPickerModal() {
    if (adminLicznikFinishPickerModalEl) {
      adminLicznikFinishPickerModalEl.hidden = true;
    }
    setAdminLicznikFinishPickerStatus("", "info");
  }

  function closeAdminLicznikFinishConfirmModal() {
    if (adminLicznikFinishConfirmModalEl) {
      adminLicznikFinishConfirmModalEl.hidden = true;
    }
  }

  function closeAdminLicznikFinishModals(options = {}) {
    const clearContext = options && options.clearContext === false ? false : true;
    closeAdminLicznikFinishPickerModal();
    closeAdminLicznikFinishConfirmModal();
    if (clearContext) {
      pendingLicznikFinishContext = null;
    }
  }

  function openAdminLicznikFinishPickerModal(licznikId) {
    const cleanId = String(licznikId || "").trim();
    if (!cleanId || !adminLicznikFinishPickerModalEl || !adminLicznikFinishInputEl) {
      return;
    }

    const licznik = licznikiItems.find((item) => String(item && item.id || "").trim() === cleanId);
    if (!licznik) {
      setAdminLicznikStatus("Nie znaleziono licznika do zakoĹ„czenia odliczania.", "error");
      return;
    }
    if (normalizeLicznikMode(licznik.mode) !== "since") {
      setAdminLicznikStatus("Opcja zakoĹ„czenia dziaĹ‚a tylko dla licznikĂłw w trybie Od daty.", "error");
      return;
    }

    const parsedTargetDate = parseLicznikDateInputValue(String(licznik.targetDate || "").trim());
    const targetDateMs = parsedTargetDate ? parsedTargetDate.getTime() : Number.NaN;
    if (!Number.isFinite(targetDateMs)) {
      setAdminLicznikStatus("Ten licznik ma nieprawidĹ‚owÄ… datÄ™ startu.", "error");
      return;
    }

    const parsedExistingEndDate = parseLicznikDateInputValue(String(licznik.endDate || "").trim());
    const existingEndDateMs = parsedExistingEndDate ? parsedExistingEndDate.getTime() : Number.NaN;
    const minEndDateMs = targetDateMs + 60 * 1000;
    const defaultEndDateMs =
      Number.isFinite(existingEndDateMs) && existingEndDateMs > targetDateMs
        ? existingEndDateMs
        : Math.max(minEndDateMs, Date.now() + 60 * 1000);

    const minValue = toLicznikDateInputValue(new Date(minEndDateMs).toISOString());
    const defaultValue = toLicznikDateInputValue(new Date(defaultEndDateMs).toISOString()) || minValue;
    if (minValue) {
      adminLicznikFinishInputEl.setAttribute("min", minValue);
    } else {
      adminLicznikFinishInputEl.removeAttribute("min");
    }
    adminLicznikFinishInputEl.value = defaultValue;

    pendingLicznikFinishContext = {
      licznikId: cleanId,
      selectedEndDateIso: ""
    };
    setAdminLicznikFinishPickerStatus("", "info");
    closeAdminLicznikFinishConfirmModal();
    adminLicznikFinishPickerModalEl.hidden = false;
    window.requestAnimationFrame(() => {
      adminLicznikFinishInputEl.focus();
      adminLicznikFinishInputEl.select();
    });
  }

  function confirmAdminLicznikFinishSelection() {
    if (!pendingLicznikFinishContext || !adminLicznikFinishInputEl) {
      return;
    }

    const licznikId = String(pendingLicznikFinishContext.licznikId || "").trim();
    const licznik = licznikiItems.find((item) => String(item && item.id || "").trim() === licznikId);
    if (!licznik) {
      closeAdminLicznikFinishModals();
      setAdminLicznikStatus("Nie znaleziono licznika do zakoĹ„czenia odliczania.", "error");
      return;
    }

    const targetDate = parseLicznikDateInputValue(String(licznik.targetDate || "").trim());
    const targetDateMs = targetDate ? targetDate.getTime() : Number.NaN;
    const selectedRawValue = String(adminLicznikFinishInputEl.value || "").trim();
    const selectedDate = parseLicznikDateInputValue(selectedRawValue);
    const selectedDateMs = selectedDate ? selectedDate.getTime() : Number.NaN;
    if (!selectedDate || !Number.isFinite(selectedDateMs)) {
      setAdminLicznikFinishPickerStatus("Wybierz poprawnÄ… datÄ™ i godzinÄ™ zakoĹ„czenia.", "error");
      return;
    }
    if (!Number.isFinite(targetDateMs) || selectedDateMs <= targetDateMs) {
      setAdminLicznikFinishPickerStatus("Data zakoĹ„czenia musi byÄ‡ pĂłĹşniejsza niĹĽ data startu licznika.", "error");
      return;
    }

    const selectedEndDateIso = selectedDate.toISOString();
    pendingLicznikFinishContext.selectedEndDateIso = selectedEndDateIso;
    if (adminLicznikFinishConfirmTextEl) {
      adminLicznikFinishConfirmTextEl.textContent = `Czy napewno chcesz zakoĹ„czyÄ‡ odliczanie wtedy ${formatLicznikDateLabel(selectedEndDateIso)}?`;
    }

    closeAdminLicznikFinishPickerModal();
    if (adminLicznikFinishConfirmModalEl) {
      adminLicznikFinishConfirmModalEl.hidden = false;
      window.requestAnimationFrame(() => {
        if (adminLicznikFinishConfirmApproveBtnEl) {
          adminLicznikFinishConfirmApproveBtnEl.focus();
        }
      });
    }
  }

  function applyAdminLicznikFinishSelection() {
    if (!pendingLicznikFinishContext) {
      return;
    }

    const licznikId = String(pendingLicznikFinishContext.licznikId || "").trim();
    const selectedEndDateIso = String(pendingLicznikFinishContext.selectedEndDateIso || "").trim();
    const index = licznikiItems.findIndex((item) => String(item && item.id || "").trim() === licznikId);
    if (index === -1) {
      closeAdminLicznikFinishModals();
      setAdminLicznikStatus("Nie znaleziono licznika do zakoĹ„czenia odliczania.", "error");
      return;
    }

    const beforeLicznik = { ...licznikiItems[index] };
    if (normalizeLicznikMode(beforeLicznik.mode) !== "since") {
      closeAdminLicznikFinishModals();
      setAdminLicznikStatus("Opcja zakoĹ„czenia dziaĹ‚a tylko dla licznikĂłw w trybie Od daty.", "error");
      return;
    }

    const targetDate = parseLicznikDateInputValue(String(beforeLicznik.targetDate || "").trim());
    const targetDateMs = targetDate ? targetDate.getTime() : Number.NaN;
    const selectedDate = parseLicznikDateInputValue(selectedEndDateIso);
    const selectedDateMs = selectedDate ? selectedDate.getTime() : Number.NaN;
    if (!selectedDate || !Number.isFinite(selectedDateMs)) {
      closeAdminLicznikFinishModals();
      setAdminLicznikStatus("Wybrano nieprawidĹ‚owÄ… datÄ™ zakoĹ„czenia odliczania.", "error");
      return;
    }
    if (!Number.isFinite(targetDateMs) || selectedDateMs <= targetDateMs) {
      closeAdminLicznikFinishModals();
      setAdminLicznikStatus("Data zakoĹ„czenia musi byÄ‡ pĂłĹşniejsza niĹĽ data startu licznika.", "error");
      return;
    }

    licznikiItems[index] = {
      ...licznikiItems[index],
      endDate: selectedDate.toISOString()
    };

    saveLicznikiItems();
    renderPublicLicznikiCards();
    renderAdminLicznikiTable();
    renderLicznikiPanel();
    closeAdminLicznikFinishModals();
    setAdminLicznikStatus(
      `Ustawiono zakoĹ„czenie odliczania na ${formatLicznikDateLabel(licznikiItems[index].endDate)}.`,
      "success"
    );
    sendAdminAuditEvent("admin_licznik_finish_scheduled", {
      licznikId,
      before: buildLicznikAuditSnapshot(beforeLicznik),
      after: buildLicznikAuditSnapshot(licznikiItems[index])
    });
  }

  function bindAdminLicznikFinishModalControls() {
    if (!adminLicznikFinishPickerModalEl || !adminLicznikFinishConfirmModalEl) {
      return;
    }

    if (adminLicznikFinishPickerCancelBtnEl) {
      adminLicznikFinishPickerCancelBtnEl.addEventListener("click", () => {
        closeAdminLicznikFinishModals();
      });
    }
    if (adminLicznikFinishPickerChooseBtnEl) {
      adminLicznikFinishPickerChooseBtnEl.addEventListener("click", () => {
        confirmAdminLicznikFinishSelection();
      });
    }
    if (adminLicznikFinishConfirmCancelBtnEl) {
      adminLicznikFinishConfirmCancelBtnEl.addEventListener("click", () => {
        closeAdminLicznikFinishModals();
      });
    }
    if (adminLicznikFinishConfirmApproveBtnEl) {
      adminLicznikFinishConfirmApproveBtnEl.addEventListener("click", () => {
        applyAdminLicznikFinishSelection();
      });
    }

    adminLicznikFinishPickerModalEl.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.hasAttribute("data-admin-modal-close")) {
        closeAdminLicznikFinishModals();
      }
    });
    adminLicznikFinishConfirmModalEl.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.hasAttribute("data-admin-modal-close")) {
        closeAdminLicznikFinishModals();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") {
        return;
      }
      const pickerOpen = Boolean(adminLicznikFinishPickerModalEl && !adminLicznikFinishPickerModalEl.hidden);
      const confirmOpen = Boolean(adminLicznikFinishConfirmModalEl && !adminLicznikFinishConfirmModalEl.hidden);
      if (!pickerOpen && !confirmOpen) {
        return;
      }
      event.preventDefault();
      closeAdminLicznikFinishModals();
    });
  }

  function findDropTargetLicznikRow(clientY) {
    if (!adminLicznikiTableBodyEl) {
      return null;
    }

    const rows = Array.from(
      adminLicznikiTableBodyEl.querySelectorAll("tr.admin-licznik-row[data-licznik-id]:not(.is-dragging)")
    );
    let dropTarget = null;
    let bestOffset = Number.NEGATIVE_INFINITY;
    rows.forEach((row) => {
      const box = row.getBoundingClientRect();
      const offset = clientY - box.top - box.height / 2;
      if (offset < 0 && offset > bestOffset) {
        bestOffset = offset;
        dropTarget = row;
      }
    });
    return dropTarget;
  }

  function applyLicznikiOrderFromDom() {
    if (!adminLicznikiTableBodyEl || !licznikiItems.length) {
      return false;
    }

    const licznikIds = Array.from(adminLicznikiTableBodyEl.querySelectorAll("tr.admin-licznik-row[data-licznik-id]"))
      .map((row) => String(row.dataset.licznikId || "").trim())
      .filter(Boolean);
    if (!licznikIds.length) {
      return false;
    }

    const byId = new Map(licznikiItems.map((item) => [String(item.id || "").trim(), item]));
    const nextItems = licznikIds.map((id) => byId.get(id)).filter(Boolean);
    if (nextItems.length !== licznikiItems.length) {
      return false;
    }

    const changed = nextItems.some((item, index) => String(item?.id || "") !== String(licznikiItems[index]?.id || ""));
    if (!changed) {
      return false;
    }

    licznikiItems = nextItems;
    return true;
  }

  function resetLicznikDragState() {
    if (draggingLicznikRow) {
      draggingLicznikRow.classList.remove("is-dragging");
      draggingLicznikRow.style.opacity = "";
    }
    draggingLicznikRow = null;
    draggingLicznikId = "";
  }

  function setLicznikFormEditingState(licznikId = "") {
    editingLicznikId = String(licznikId || "").trim();
    if (!adminLicznikFormEl) {
      return;
    }
    const submitBtn = adminLicznikFormEl.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = editingLicznikId ? "Zapisz zmiany" : "Dodaj licznik";
    }
  }

  function bindAdminLicznikiFeature() {
    if (adminLicznikiBound) {
      return;
    }
    adminLicznikiBound = true;
    bindAdminLicznikDateControls();
    bindAdminLicznikFinishModalControls();

    if (adminLicznikFormEl) {
      adminLicznikFormEl.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!hasLicznikiTabAccess()) {
          setAdminLicznikStatus("Brak permisji do zakĹ‚adki Liczniki.", "error");
          sendAdminAuditEvent("admin_liczniki_access_denied", {
            operation: "submit_licznik_form"
          });
          return;
        }

        const formData = new FormData(adminLicznikFormEl);
        const title = String(formData.get("licznikTitle") || "").trim();
        const mode = normalizeLicznikMode(formData.get("licznikMode"));
        const dateInputRaw = String(formData.get("licznikDate") || "").trim();
        const imageUrlInput = sanitizeLicznikImageUrl(formData.get("licznikImageUrl"));
        let auditAction = "";
        let auditDetails = {};
        const parsedTargetDate = parseLicznikDateInputValue(dateInputRaw);
        const parsedDateMs = parsedTargetDate ? parsedTargetDate.getTime() : Number.NaN;
        if (!title || !parsedTargetDate || !Number.isFinite(parsedDateMs)) {
          setAdminLicznikStatus("Podaj nazwÄ™ i poprawnÄ… datÄ™ licznika.", "error");
          return;
        }
        const targetDate = parsedTargetDate.toISOString();
        let endDate = "";
        if (editingLicznikId) {
          const existingLicznik = licznikiItems.find((item) => item.id === editingLicznikId);
          endDate = String(existingLicznik && existingLicznik.endDate || "").trim();
        }
        if (mode !== "since") {
          endDate = "";
        }
        const imageFileInput = adminLicznikFormEl.querySelector('input[name="licznikImageFile"]');
        const selectedImageFile =
          imageFileInput && imageFileInput.files && imageFileInput.files.length ? imageFileInput.files[0] : null;
        let imageUrl = imageUrlInput;

        if (selectedImageFile) {
          if (!selectedImageFile.type || !selectedImageFile.type.startsWith("image/")) {
            setAdminLicznikStatus("Wybrany plik nie jest obrazem.", "error");
            return;
          }
          if (selectedImageFile.size > 1_500_000) {
            setAdminLicznikStatus("Plik grafiki jest za duĹĽy (max 1.5 MB).", "error");
            return;
          }
          try {
            imageUrl = sanitizeLicznikImageUrl(await readImageFileAsDataUrl(selectedImageFile));
          } catch (_error) {
            setAdminLicznikStatus("Nie udaĹ‚o siÄ™ wczytaÄ‡ pliku grafiki.", "error");
            return;
          }
        }
        imageUrl = imageUrl || sanitizeLicznikImageUrl(getDefaultLicznikImageByTitle(title));

        if (editingLicznikId) {
          const index = licznikiItems.findIndex((item) => item.id === editingLicznikId);
          if (index === -1) {
            setLicznikFormEditingState("");
            setAdminLicznikStatus("Nie znaleziono licznika do edycji.", "error");
            return;
          }
          const beforeLicznik = { ...licznikiItems[index] };
          licznikiItems[index] = {
            ...licznikiItems[index],
            title,
            mode,
            targetDate,
            endDate,
            imageUrl
          };
          auditAction = "admin_licznik_updated";
          auditDetails = {
            licznikId: String(beforeLicznik.id || "").trim(),
            before: buildLicznikAuditSnapshot(beforeLicznik),
            after: buildLicznikAuditSnapshot(licznikiItems[index])
          };
          setAdminLicznikStatus("Zaktualizowano licznik.", "success");
        } else {
          const createdLicznik = {
            id: createLicznikId(title),
            title,
            mode,
            targetDate,
            endDate,
            imageUrl
          };
          licznikiItems.push(createdLicznik);
          auditAction = "admin_licznik_added";
          auditDetails = {
            licznik: buildLicznikAuditSnapshot(createdLicznik),
            licznikiCount: licznikiItems.length
          };
          setAdminLicznikStatus("Dodano licznik.", "success");
        }

        saveLicznikiItems();
        renderPublicLicznikiCards();
        renderAdminLicznikiTable();
        renderLicznikiPanel();
        setLicznikFormEditingState("");
        adminLicznikFormEl.reset();
        sendAdminAuditEvent(auditAction || "admin_licznik_saved", auditDetails);
      });
    }

    if (adminLicznikiTableBodyEl) {
      adminLicznikiTableBodyEl.addEventListener("click", (event) => {
        if (!hasLicznikiTabAccess()) {
          setAdminLicznikStatus("Brak permisji do zakĹ‚adki Liczniki.", "error");
          sendAdminAuditEvent("admin_liczniki_access_denied", {
            operation: "click_liczniki_table"
          });
          return;
        }

        const target = event.target.closest(
          "button[data-licznik-edit], button[data-licznik-remove], button[data-licznik-drag-handle], button[data-licznik-finish], button[data-licznik-resume]"
        );
        if (!target) {
          return;
        }

        const dragHandleId = String(target.getAttribute("data-licznik-drag-handle") || "").trim();
        if (dragHandleId) {
          setAdminLicznikStatus("PrzeciÄ…gnij uchwyt, aby ustawiÄ‡ kolejnoĹ›Ä‡ licznikĂłw.", "info");
          return;
        }

        const resumeId = String(target.getAttribute("data-licznik-resume") || "").trim();
        if (resumeId) {
          const licznikId = resumeId;
          const index = licznikiItems.findIndex((item) => String(item && item.id || "").trim() === licznikId);
          if (index === -1) {
            setAdminLicznikStatus("Nie znaleziono licznika do wznowienia.", "error");
            return;
          }

          const beforeLicznik = { ...licznikiItems[index] };
          if (!isLicznikFinished(beforeLicznik)) {
            setAdminLicznikStatus("Ten licznik nie jest jeszcze zakoĹ„czony.", "error");
            return;
          }

          licznikiItems[index] = {
            ...licznikiItems[index],
            endDate: ""
          };
          if (pendingLicznikFinishContext && String(pendingLicznikFinishContext.licznikId || "").trim() === licznikId) {
            closeAdminLicznikFinishModals();
          }

          saveLicznikiItems();
          renderPublicLicznikiCards();
          renderAdminLicznikiTable();
          renderLicznikiPanel();
          setAdminLicznikStatus(`Wznowiono odliczanie licznika: ${beforeLicznik.title}.`, "success");
          sendAdminAuditEvent("admin_licznik_finish_resumed", {
            licznikId,
            before: buildLicznikAuditSnapshot(beforeLicznik),
            after: buildLicznikAuditSnapshot(licznikiItems[index])
          });
          return;
        }

        const finishId = String(target.getAttribute("data-licznik-finish") || "").trim();
        if (finishId) {
          openAdminLicznikFinishPickerModal(finishId);
          return;
        }

        const editId = String(target.getAttribute("data-licznik-edit") || "").trim();
        if (editId) {
          const licznikId = editId;
          const licznik = licznikiItems.find((item) => item.id === licznikId);
          if (!licznik || !adminLicznikFormEl) {
            setAdminLicznikStatus("Nie znaleziono licznika do edycji.", "error");
            return;
          }

          const titleInput = adminLicznikFormEl.querySelector('input[name="licznikTitle"]');
          const modeInput = adminLicznikFormEl.querySelector('select[name="licznikMode"]');
          const presetInput = adminLicznikFormEl.querySelector('select[name="licznikDatePreset"]');
          const dateInput = adminLicznikFormEl.querySelector('input[name="licznikDate"]');
          const imageUrlInput = adminLicznikFormEl.querySelector('input[name="licznikImageUrl"]');
          const imageFileInput = adminLicznikFormEl.querySelector('input[name="licznikImageFile"]');
          if (titleInput) {
            titleInput.value = licznik.title;
          }
          if (modeInput) {
            modeInput.value = normalizeLicznikMode(licznik.mode);
          }
          if (presetInput) {
            presetInput.value = "";
          }
          if (dateInput) {
            dateInput.value = toLicznikDateInputValue(licznik.targetDate);
            dateInput.dispatchEvent(new Event("change"));
          }
          if (imageUrlInput) {
            imageUrlInput.value = sanitizeLicznikImageUrl(licznik.imageUrl);
          }
          if (imageFileInput) {
            imageFileInput.value = "";
          }

          setLicznikFormEditingState(licznik.id);
          setAdminLicznikStatus("Tryb edycji licznika.", "info");
          return;
        }

        const removeId = String(target.getAttribute("data-licznik-remove") || "").trim();
        if (!removeId) {
          return;
        }

        const licznikId = removeId;
        const removedLicznik = licznikiItems.find((item) => item.id === licznikId) || null;
        const beforeCount = licznikiItems.length;
        licznikiItems = licznikiItems.filter((item) => item.id !== licznikId);
        if (licznikiItems.length === beforeCount) {
          setAdminLicznikStatus("Nie znaleziono licznika do usuniÄ™cia.", "error");
          return;
        }
        if (pendingLicznikFinishContext && String(pendingLicznikFinishContext.licznikId || "").trim() === licznikId) {
          closeAdminLicznikFinishModals();
        }

        saveLicznikiItems();
        renderPublicLicznikiCards();
        renderAdminLicznikiTable();
        renderLicznikiPanel();

        if (editingLicznikId === licznikId) {
          setLicznikFormEditingState("");
          if (adminLicznikFormEl) {
            adminLicznikFormEl.reset();
          }
        }
        sendAdminAuditEvent("admin_licznik_removed", {
          licznikId,
          licznik: buildLicznikAuditSnapshot(removedLicznik),
          licznikiCount: licznikiItems.length
        });
        setAdminLicznikStatus("UsuniÄ™to licznik.", "success");
      });

      adminLicznikiTableBodyEl.addEventListener("dragstart", (event) => {
        if (!hasLicznikiTabAccess()) {
          event.preventDefault();
          setAdminLicznikStatus("Brak permisji do zakĹ‚adki Liczniki.", "error");
          sendAdminAuditEvent("admin_liczniki_access_denied", {
            operation: "dragstart_liczniki_table"
          });
          return;
        }

        const handle = event.target.closest("[data-licznik-drag-handle]");
        if (!handle) {
          event.preventDefault();
          return;
        }

        const row = handle.closest("tr.admin-licznik-row[data-licznik-id]");
        const licznikId = String(row?.dataset.licznikId || "").trim();
        if (!row || !licznikId) {
          event.preventDefault();
          return;
        }

        draggingLicznikId = licznikId;
        draggingLicznikRow = row;
        row.classList.add("is-dragging");
        row.style.opacity = "0.55";

        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.dropEffect = "move";
          try {
            event.dataTransfer.setData("text/plain", licznikId);
          } catch (_error) {
            // Ignore browsers that block setting drag payload.
          }
        }
      });

      adminLicznikiTableBodyEl.addEventListener("dragover", (event) => {
        if (!hasLicznikiTabAccess()) {
          return;
        }

        if (!draggingLicznikRow || !draggingLicznikId) {
          return;
        }

        event.preventDefault();
        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = "move";
        }

        const dropTarget = findDropTargetLicznikRow(event.clientY);
        if (!dropTarget) {
          adminLicznikiTableBodyEl.appendChild(draggingLicznikRow);
          return;
        }

        if (dropTarget !== draggingLicznikRow) {
          adminLicznikiTableBodyEl.insertBefore(draggingLicznikRow, dropTarget);
        }
      });

      adminLicznikiTableBodyEl.addEventListener("drop", (event) => {
        if (!hasLicznikiTabAccess()) {
          event.preventDefault();
          resetLicznikDragState();
          setAdminLicznikStatus("Brak permisji do zakĹ‚adki Liczniki.", "error");
          sendAdminAuditEvent("admin_liczniki_access_denied", {
            operation: "drop_liczniki_table"
          });
          return;
        }

        if (!draggingLicznikRow || !draggingLicznikId) {
          return;
        }
        event.preventDefault();

        const changed = applyLicznikiOrderFromDom();
        resetLicznikDragState();
        if (!changed) {
          return;
        }

        saveLicznikiItems();
        renderPublicLicznikiCards();
        renderAdminLicznikiTable();
        renderLicznikiPanel();
        sendAdminAuditEvent("admin_liczniki_reordered", {
          orderedLicznikIds: licznikiItems.map((item) => String(item.id || "").trim()).filter(Boolean),
          licznikiCount: licznikiItems.length
        });
        setAdminLicznikStatus("Zmieniono kolejnoĹ›Ä‡ licznikĂłw.", "success");
      });

      adminLicznikiTableBodyEl.addEventListener("dragend", () => {
        resetLicznikDragState();
      });
    }
  }

  function renderPublicMembersCards() {
    if (!friendsGridEl) {
      return;
    }

    friendsGridEl.innerHTML = "";
    cciMembers.forEach((member) => {
      const memberAvatar = normalizeMemberAvatar(member.avatar);
      const card = document.createElement("a");
      card.className = "friend-card";
      card.href = member.url;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.innerHTML = `
        <span class="friend-avatar-wrap">
          <img class="friend-avatar" src="${escapeHtmlText(memberAvatar)}" alt="${escapeHtmlText(member.name)}">
          <img class="friend-k" src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/webp/kick.webp" alt="">
        </span>
        <span class="friend-name">${escapeHtmlText(member.name)}</span>
      `;
      const avatarEl = card.querySelector(".friend-avatar");
      if (avatarEl) {
        avatarEl.addEventListener(
          "error",
          () => {
            const currentSrc = String(avatarEl.getAttribute("src") || "").trim();
            if (currentSrc === MEMBER_AVATAR_FALLBACK) {
              return;
            }
            avatarEl.setAttribute("src", MEMBER_AVATAR_FALLBACK);
          },
          { once: true }
        );
      }
      friendsGridEl.appendChild(card);
    });
  }

  function renderAdminMembersTable() {
    if (!adminMembersTableBodyEl) {
      return;
    }

    adminMembersTableBodyEl.innerHTML = "";
    if (!cciMembers.length) {
      adminMembersTableBodyEl.innerHTML = `
        <tr>
          <td colspan="3" class="admin-table-empty">Brak dodanych czĹ‚onkĂłw.</td>
        </tr>
      `;
      return;
    }

    cciMembers.forEach((member) => {
      const memberAvatar = normalizeMemberAvatar(member.avatar);
      const row = document.createElement("tr");
      row.className = "admin-member-row";
      row.dataset.memberId = member.id;
      row.innerHTML = `
        <td>
          <span class="admin-member-name-cell">
            <button
              class="admin-row-btn admin-cennik-drag-handle"
              type="button"
              draggable="true"
              data-member-drag-handle="${escapeHtmlText(member.id)}"
              title="PrzeciÄ…gnij, aby ustawiÄ‡ kolejnoĹ›Ä‡ czĹ‚onkĂłw CCI"
              aria-label="PrzeciÄ…gnij, aby ustawiÄ‡ kolejnoĹ›Ä‡ czĹ‚onkĂłw CCI"
            >
              <img class="admin-drag-icon" src="/img/drag%26drop.ico" alt="" aria-hidden="true">
            </button>
            <img class="admin-member-avatar" src="${escapeHtmlText(memberAvatar)}" alt="">
            <span class="admin-member-name-text">${escapeHtmlText(member.name)}</span>
          </span>
        </td>
        <td><a href="${escapeHtmlText(member.url)}" target="_blank" rel="noopener noreferrer">${escapeHtmlText(member.url)}</a></td>
        <td>
          <span class="admin-account-actions">
            <button class="admin-row-btn" type="button" data-member-edit="${escapeHtmlText(member.id)}">Edytuj</button>
            <button class="admin-row-btn admin-row-btn-danger" type="button" data-member-remove="${escapeHtmlText(member.id)}">UsuĹ„</button>
          </span>
        </td>
      `;
      const rowAvatarEl = row.querySelector(".admin-member-avatar");
      if (rowAvatarEl) {
        rowAvatarEl.addEventListener(
          "error",
          () => {
            const currentSrc = String(rowAvatarEl.getAttribute("src") || "").trim();
            if (currentSrc === MEMBER_AVATAR_FALLBACK) {
              return;
            }
            rowAvatarEl.setAttribute("src", MEMBER_AVATAR_FALLBACK);
          },
          { once: true }
        );
      }
      adminMembersTableBodyEl.appendChild(row);
    });
  }

  function setMemberFormEditingState(memberId = "") {
    editingMemberId = String(memberId || "").trim();
    if (!adminMemberFormEl) {
      return;
    }
    const submitBtn = adminMemberFormEl.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = editingMemberId ? "Zapisz zmiany" : "Dodaj czĹ‚onka CCI";
    }
  }

  function findDropTargetMemberRow(clientY) {
    if (!adminMembersTableBodyEl) {
      return null;
    }

    const rows = Array.from(
      adminMembersTableBodyEl.querySelectorAll("tr.admin-member-row[data-member-id]:not(.is-dragging)")
    );
    let dropTarget = null;
    let bestOffset = Number.NEGATIVE_INFINITY;
    rows.forEach((row) => {
      const box = row.getBoundingClientRect();
      const offset = clientY - box.top - box.height / 2;
      if (offset < 0 && offset > bestOffset) {
        bestOffset = offset;
        dropTarget = row;
      }
    });
    return dropTarget;
  }

  function applyMembersOrderFromDom() {
    if (!adminMembersTableBodyEl || !cciMembers.length) {
      return false;
    }

    const memberIds = Array.from(adminMembersTableBodyEl.querySelectorAll("tr.admin-member-row[data-member-id]"))
      .map((row) => String(row.dataset.memberId || "").trim())
      .filter(Boolean);
    if (!memberIds.length) {
      return false;
    }

    const byId = new Map(cciMembers.map((member) => [String(member.id || "").trim(), member]));
    const nextMembers = memberIds.map((id) => byId.get(id)).filter(Boolean);
    if (nextMembers.length !== cciMembers.length) {
      return false;
    }

    const changed = nextMembers.some(
      (member, index) => String(member?.id || "") !== String(cciMembers[index]?.id || "")
    );
    if (!changed) {
      return false;
    }

    cciMembers = nextMembers;
    return true;
  }

  function resetMemberDragState() {
    if (draggingMemberRow) {
      draggingMemberRow.classList.remove("is-dragging");
      draggingMemberRow.style.opacity = "";
    }
    draggingMemberRow = null;
    draggingMemberId = "";
  }

  function bindAdminMembersFeature() {
    if (adminMembersBound) {
      return;
    }
    adminMembersBound = true;

    if (adminMemberFormEl) {
      adminMemberFormEl.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!hasMembersTabAccess()) {
          setAdminMemberStatus("Brak permisji do zakĹ‚adki CzĹ‚onkowie CCI.", "error");
          sendAdminAuditEvent("admin_members_access_denied", {
            operation: "submit_member_form"
          });
          return;
        }

        const formData = new FormData(adminMemberFormEl);
        const name = String(formData.get("memberName") || "").trim();
        const url = sanitizeMemberUrl(formData.get("memberKick") || "");
        const avatarInput = String(formData.get("memberAvatar") || "").trim();
        const avatar = normalizeMemberAvatar(avatarInput);
        let auditAction = "";
        let auditDetails = {};

        if (!name || !url) {
          setAdminMemberStatus("Podaj nazwÄ™ i profil Kick.", "error");
          return;
        }

        if (editingMemberId) {
          const index = cciMembers.findIndex((member) => member.id === editingMemberId);
          if (index === -1) {
            setMemberFormEditingState("");
            setAdminMemberStatus("Nie znaleziono czĹ‚onka do edycji.", "error");
            return;
          }
          const beforeMember = { ...cciMembers[index] };
          cciMembers[index] = {
            ...cciMembers[index],
            name,
            url,
            avatar
          };
          auditAction = "admin_member_updated";
          auditDetails = {
            memberId: String(beforeMember.id || "").trim(),
            before: buildMemberAuditSnapshot(beforeMember),
            after: buildMemberAuditSnapshot(cciMembers[index])
          };
          setAdminMemberStatus("Zaktualizowano czĹ‚onka CCI.", "success");
        } else {
          const createdMember = {
            id: createMemberId(getKickSlugFromUrl(url)),
            name,
            url,
            avatar
          };
          cciMembers.push(createdMember);
          auditAction = "admin_member_added";
          auditDetails = {
            member: buildMemberAuditSnapshot(createdMember),
            membersCount: cciMembers.length
          };
          setAdminMemberStatus("Dodano nowego czĹ‚onka CCI.", "success");
        }

        saveCciMembers();
        renderPublicMembersCards();
        renderAdminMembersTable();
        setMemberFormEditingState("");
        adminMemberFormEl.reset();
        void updateFriendsLiveBadges(true);
        sendAdminAuditEvent(auditAction || "admin_member_saved", auditDetails);
      });
    }

    if (adminMembersTableBodyEl) {
      adminMembersTableBodyEl.addEventListener("click", (event) => {
        if (!hasMembersTabAccess()) {
          setAdminMemberStatus("Brak permisji do zakĹ‚adki CzĹ‚onkowie CCI.", "error");
          sendAdminAuditEvent("admin_members_access_denied", {
            operation: "click_members_table"
          });
          return;
        }

        const target = event.target.closest("button[data-member-edit], button[data-member-remove], button[data-member-drag-handle]");
        if (!target) {
          return;
        }

        const dragHandleId = String(target.getAttribute("data-member-drag-handle") || "").trim();
        if (dragHandleId) {
          setAdminMemberStatus("PrzeciÄ…gnij uchwyt, aby ustawiÄ‡ kolejnoĹ›Ä‡ czĹ‚onkĂłw CCI.", "info");
          return;
        }

        const editId = String(target.getAttribute("data-member-edit") || "").trim();
        if (editId) {
          const member = cciMembers.find((item) => item.id === editId);
          if (!member || !adminMemberFormEl) {
            setAdminMemberStatus("Nie znaleziono czĹ‚onka do edycji.", "error");
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
            avatarInput.value = String(member.avatar || "").trim() === MEMBER_AVATAR_FALLBACK
              ? ""
              : String(member.avatar || "").trim();
          }
          setMemberFormEditingState(member.id);
          setAdminMemberStatus("Tryb edycji czĹ‚onka CCI.", "info");
          return;
        }

        const removeId = String(target.getAttribute("data-member-remove") || "").trim();
        if (removeId) {
          const removedMember = cciMembers.find((member) => member.id === removeId) || null;
          const beforeCount = cciMembers.length;
          cciMembers = cciMembers.filter((member) => member.id !== removeId);
          if (cciMembers.length === beforeCount) {
            setAdminMemberStatus("Nie znaleziono czĹ‚onka do usuniÄ™cia.", "error");
            return;
          }
          saveCciMembers();
          renderPublicMembersCards();
          renderAdminMembersTable();
          if (editingMemberId === removeId) {
            setMemberFormEditingState("");
            if (adminMemberFormEl) {
              adminMemberFormEl.reset();
            }
          }
          setAdminMemberStatus("UsuniÄ™to czĹ‚onka CCI.", "success");
          void updateFriendsLiveBadges(true);
          sendAdminAuditEvent("admin_member_removed", {
            memberId: removeId,
            member: buildMemberAuditSnapshot(removedMember),
            membersCount: cciMembers.length
          });
          return;
        }
      });

      adminMembersTableBodyEl.addEventListener("dragstart", (event) => {
        if (!hasMembersTabAccess()) {
          event.preventDefault();
          setAdminMemberStatus("Brak permisji do zakĹ‚adki CzĹ‚onkowie CCI.", "error");
          sendAdminAuditEvent("admin_members_access_denied", {
            operation: "dragstart_members_table"
          });
          return;
        }

        const handle = event.target.closest("[data-member-drag-handle]");
        if (!handle) {
          event.preventDefault();
          return;
        }

        const row = handle.closest("tr.admin-member-row[data-member-id]");
        const memberId = String(row?.dataset.memberId || "").trim();
        if (!row || !memberId) {
          event.preventDefault();
          return;
        }

        draggingMemberId = memberId;
        draggingMemberRow = row;
        row.classList.add("is-dragging");
        row.style.opacity = "0.55";

        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.dropEffect = "move";
          try {
            event.dataTransfer.setData("text/plain", memberId);
          } catch (_error) {
            // Ignore browsers that block setting drag payload.
          }
        }
      });

      adminMembersTableBodyEl.addEventListener("dragover", (event) => {
        if (!hasMembersTabAccess()) {
          return;
        }

        if (!draggingMemberRow || !draggingMemberId) {
          return;
        }

        event.preventDefault();
        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = "move";
        }

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
        if (!hasMembersTabAccess()) {
          event.preventDefault();
          resetMemberDragState();
          setAdminMemberStatus("Brak permisji do zakĹ‚adki CzĹ‚onkowie CCI.", "error");
          sendAdminAuditEvent("admin_members_access_denied", {
            operation: "drop_members_table"
          });
          return;
        }

        if (!draggingMemberRow || !draggingMemberId) {
          return;
        }
        event.preventDefault();

        const changed = applyMembersOrderFromDom();
        resetMemberDragState();
        if (!changed) {
          return;
        }

        saveCciMembers();
        renderPublicMembersCards();
        renderAdminMembersTable();
        setAdminMemberStatus("Zmieniono kolejnoĹ›Ä‡ czĹ‚onkĂłw CCI.", "success");
        void updateFriendsLiveBadges(true);
        sendAdminAuditEvent("admin_members_reordered", {
          orderedMemberIds: cciMembers.map((member) => String(member.id || "").trim()).filter(Boolean),
          membersCount: cciMembers.length
        });
      });

      adminMembersTableBodyEl.addEventListener("dragend", () => {
        resetMemberDragState();
      });
    }
  }

  function renderAdminAccountsTable() {
    if (!adminAccountsTableBodyEl) {
      return;
    }

    const accounts = getInlineAdminAccountsFallback();
    adminAccountsTableBodyEl.innerHTML = "";

    if (!accounts.length) {
      adminAccountsTableBodyEl.innerHTML = `
        <tr>
          <td colspan="11" class="admin-table-empty">Brak kont administracyjnych.</td>
        </tr>
      `;
      return;
    }

    accounts.forEach((account) => {
      const accountId = String(account.id || "").trim();
      const discordUserId = normalizeDiscordUserId(account.discordUserId);
      const discordName = String(account.discordName || "").trim();
      const visiblePassword = !account.isRoot && visibleAdminPasswords.has(accountId);
      const permissionsEnabledCount =
        (account.canAccessMembers ? 1 : 0) +
        (account.canAccessLiczniki ? 1 : 0) +
        (account.canAccessYoutube ? 1 : 0) +
        (account.canAccessAdmin ? 1 : 0) +
        (account.canAccessBindings ? 1 : 0);
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${escapeHtmlText(account.login || "-")}</td>
        <td>${escapeHtmlText(discordUserId || "-")}</td>
        <td>${escapeHtmlText(discordName || "-")}</td>
        <td>${escapeHtmlText(visiblePassword ? account.password : "********")}</td>
        <td>
          ${
            account.isRoot
              ? "-"
              : `<button class="admin-row-btn" type="button" data-account-toggle="${escapeHtmlText(accountId)}">${visiblePassword ? "Ukryj" : "PokaĹĽ"}</button>`
          }
        </td>
        <td>${account.canAccessMembers ? "Tak" : "Nie"}</td>
        <td>${account.canAccessLiczniki ? "Tak" : "Nie"}</td>
        <td>${account.canAccessYoutube ? "Tak" : "Nie"}</td>
        <td>${account.canAccessAdmin ? "Tak" : "Nie"}</td>
        <td>${account.canAccessBindings ? "Tak" : "Nie"}</td>
        <td>
          ${
            account.isRoot
              ? "-"
              : `
                <div class="admin-account-actions">
                  <details class="admin-permissions-details">
                    <summary class="admin-row-btn admin-permissions-summary">
                      Permisje (${permissionsEnabledCount}/5)
                    </summary>
                    <ul class="admin-permissions-list">
                      <li class="admin-permission-item">
                        <label>
                          <span>CzĹ‚onkowie CCI</span>
                          <input
                            class="admin-access-checkbox"
                            type="checkbox"
                            data-account-permission-checkbox="members"
                            data-account-id="${escapeHtmlText(accountId)}"
                            ${account.canAccessMembers ? "checked" : ""}
                          >
                        </label>
                      </li>
                      <li class="admin-permission-item">
                        <label>
                          <span>Liczniki</span>
                          <input
                            class="admin-access-checkbox"
                            type="checkbox"
                            data-account-permission-checkbox="liczniki"
                            data-account-id="${escapeHtmlText(accountId)}"
                            ${account.canAccessLiczniki ? "checked" : ""}
                          >
                        </label>
                      </li>
                      <li class="admin-permission-item">
                        <label>
                          <span>Panel Admina</span>
                          <input
                            class="admin-access-checkbox"
                            type="checkbox"
                            data-account-permission-checkbox="admin"
                            data-account-id="${escapeHtmlText(accountId)}"
                            ${account.canAccessAdmin ? "checked" : ""}
                          >
                        </label>
                      </li>
                      <li class="admin-permission-item">
                        <label>
                          <span>YouTube</span>
                          <input
                            class="admin-access-checkbox"
                            type="checkbox"
                            data-account-permission-checkbox="youtube"
                            data-account-id="${escapeHtmlText(accountId)}"
                            ${account.canAccessYoutube ? "checked" : ""}
                          >
                        </label>
                      </li>
                      <li class="admin-permission-item">
                        <label>
                          <span>PowiÄ…zania</span>
                          <input
                            class="admin-access-checkbox"
                            type="checkbox"
                            data-account-permission-checkbox="bindings"
                            data-account-id="${escapeHtmlText(accountId)}"
                            ${account.canAccessBindings ? "checked" : ""}
                          >
                        </label>
                      </li>
                    </ul>
                  </details>
                  <button class="admin-row-btn admin-row-btn-danger" type="button" data-account-remove="${escapeHtmlText(accountId)}">UsuĹ„</button>
                </div>
              `
          }
        </td>
      `;
      adminAccountsTableBodyEl.appendChild(row);
    });
  }

  function bindAdminAccountsFeature() {
    if (adminAccountsBound) {
      return;
    }
    adminAccountsBound = true;

    if (adminAccountFormEl) {
      adminAccountFormEl.addEventListener("submit", (event) => {
        event.preventDefault();
        let auditAction = "";
        let auditDetails = {};

        if (!hasPanelAdminAccess()) {
          setAdminAccountStatus("Brak permisji do zakĹ‚adki Panel Admina.", "error");
          sendAdminAuditEvent("admin_accounts_access_denied", {
            operation: "submit_account_form"
          });
          return;
        }

        const formData = new FormData(adminAccountFormEl);
        const login = String(formData.get("accountLogin") || "").trim();
        const password = String(formData.get("accountPassword") || "").trim();
        const discordUserId = normalizeDiscordUserId(formData.get("accountDiscordId"));
        const canAccessMembers = formData.get("accountAccessMembers") === "on";
        const canAccessLiczniki = formData.get("accountAccessLiczniki") === "on";
        const canAccessYoutube = formData.get("accountAccessYoutube") === "on";
        const canAccessAdmin = formData.get("accountAccessAdmin") === "on";
        const canAccessBindings = formData.get("accountAccessBindings") === "on";
        const isDiscordAccount = Boolean(discordUserId);

        if (!login && !discordUserId) {
          setAdminAccountStatus("Podaj login albo Discord ID.", "error");
          return;
        }

        if (!password && !discordUserId) {
          setAdminAccountStatus("Podaj haslo dla konta lokalnego.", "error");
          return;
        }

        const normalizedLogin = login || `discord:${discordUserId}`;
        const normalizedPassword = password || "DISCORD_ONLY";
        const existingIndex = adminAccounts.findIndex(
          (account) =>
            String(account.login || "").trim().toLowerCase() === normalizedLogin.toLowerCase() ||
            (discordUserId && normalizeDiscordUserId(account.discordUserId) === discordUserId)
        );

        if (existingIndex !== -1) {
          if (adminAccounts[existingIndex].isRoot) {
            setAdminAccountStatus("Tego konta nie mozna edytowac.", "error");
            return;
          }

          const beforeAccount = { ...adminAccounts[existingIndex] };
          adminAccounts[existingIndex] = {
            ...adminAccounts[existingIndex],
            login: normalizedLogin,
            password: normalizedPassword,
            discordUserId: discordUserId || "",
            discordName: String(adminAccounts[existingIndex].discordName || ""),
            canAccessMembers,
            canAccessLiczniki,
            canAccessYoutube,
            canAccessAdmin,
            canAccessBindings,
            isDiscordAccount
          };
          auditAction = "admin_account_updated";
          auditDetails = {
            before: buildAdminAccountAuditSnapshot(beforeAccount),
            after: buildAdminAccountAuditSnapshot(adminAccounts[existingIndex])
          };
          setAdminAccountStatus("Zaktualizowano konto admina.", "success");
        } else {
          const createdAccount = {
            id: createAdminAccountId(normalizedLogin),
            login: normalizedLogin,
            password: normalizedPassword,
            discordUserId: discordUserId || "",
            discordName: "",
            canAccessMembers,
            canAccessLiczniki,
            canAccessYoutube,
            canAccessAdmin,
            canAccessBindings,
            isRoot: false,
            isDiscordAccount
          };
          adminAccounts.push(createdAccount);
          auditAction = "admin_account_added";
          auditDetails = {
            account: buildAdminAccountAuditSnapshot(createdAccount)
          };
          setAdminAccountStatus("Dodano nowe konto admina.", "success");
        }

        saveAdminAccounts();
        renderAdminAccountsTable();
        adminAccountFormEl.reset();
        sendAdminAuditEvent(auditAction || "admin_account_saved", auditDetails);
        if (!canAccessAdminTab(activeAdminTab)) {
          setActiveAdminTab(getFirstAccessibleAdminTab(activeAdminTab));
        }
      });
    }

    if (adminAccountsTableBodyEl) {
      adminAccountsTableBodyEl.addEventListener("click", (event) => {
        if (!hasPanelAdminAccess()) {
          setAdminAccountStatus("Brak permisji do zakĹ‚adki Panel Admina.", "error");
          sendAdminAuditEvent("admin_accounts_access_denied", {
            operation: "click_accounts_table"
          });
          return;
        }

        const toggleBtn = event.target.closest("[data-account-toggle]");
        if (toggleBtn) {
          const accountId = String(toggleBtn.getAttribute("data-account-toggle") || "").trim();
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
          sendAdminAuditEvent("admin_account_password_visibility_toggled", {
            account: buildAdminAccountAuditSnapshot(account),
            visible: visibleAdminPasswords.has(accountId)
          });
          return;
        }

        const removeBtn = event.target.closest("[data-account-remove]");
        if (!removeBtn) {
          return;
        }

        const accountId = String(removeBtn.getAttribute("data-account-remove") || "").trim();
        const accountToDelete = adminAccounts.find((item) => item.id === accountId);
        if (!accountToDelete || accountToDelete.isRoot) {
          return;
        }

        adminAccounts = adminAccounts.filter((item) => item.id !== accountId);
        visibleAdminPasswords.delete(accountId);
        saveAdminAccounts();
        renderAdminAccountsTable();
        setAdminAccountStatus("UsuniÄ™to konto admina.", "success");
        sendAdminAuditEvent("admin_account_removed", {
          account: buildAdminAccountAuditSnapshot(accountToDelete),
          accountsCount: adminAccounts.length
        });

        const currentLogin = getCurrentAdminSessionLogin().toLowerCase();
        const currentDiscordId = normalizeDiscordUserId(getActiveDiscordSession()?.id);
        const deletedLogin = String(accountToDelete.login || "").trim().toLowerCase();
        const deletedDiscordId = normalizeDiscordUserId(accountToDelete.discordUserId);

        if (
          (currentLogin && deletedLogin === currentLogin) ||
          (currentDiscordId && deletedDiscordId === currentDiscordId)
        ) {
          logoutAdmin();
        }
      });

      adminAccountsTableBodyEl.addEventListener("change", (event) => {
        const permissionCheckbox = event.target.closest("[data-account-permission-checkbox]");
        if (!permissionCheckbox) {
          return;
        }

        if (!hasPanelAdminAccess()) {
          renderAdminAccountsTable();
          setAdminAccountStatus("Brak permisji do zakĹ‚adki Panel Admina.", "error");
          sendAdminAuditEvent("admin_accounts_access_denied", {
            operation: "change_permissions"
          });
          return;
        }

        const accountId = String(permissionCheckbox.getAttribute("data-account-id") || "").trim();
        const permissionKey = String(permissionCheckbox.getAttribute("data-account-permission-checkbox") || "")
          .trim()
          .toLowerCase();
        const account = adminAccounts.find((item) => item.id === accountId);
        if (!account || account.isRoot) {
          renderAdminAccountsTable();
          return;
        }

        const permissionFieldByKey = {
          members: "canAccessMembers",
          liczniki: "canAccessLiczniki",
          youtube: "canAccessYoutube",
          admin: "canAccessAdmin",
          bindings: "canAccessBindings"
        };
        const successMessageByKey = {
          members: permissionCheckbox.checked ? "Nadano permisje do CzĹ‚onkĂłw CCI." : "Odebrano permisje do CzĹ‚onkĂłw CCI.",
          liczniki: permissionCheckbox.checked ? "Nadano permisje do LicznikĂłw." : "Odebrano permisje do LicznikĂłw.",
          youtube: permissionCheckbox.checked ? "Nadano permisje do YouTube." : "Odebrano permisje do YouTube.",
          admin: permissionCheckbox.checked ? "Nadano permisje do Panelu Admina." : "Odebrano permisje do Panelu Admina.",
          bindings: permissionCheckbox.checked ? "Nadano permisje do PowiÄ…zaĹ„." : "Odebrano permisje do PowiÄ…zaĹ„."
        };

        const permissionField = permissionFieldByKey[permissionKey];
        if (!permissionField) {
          renderAdminAccountsTable();
          return;
        }

        const previousValue = Boolean(account[permissionField]);
        account[permissionField] = Boolean(permissionCheckbox.checked);
        saveAdminAccounts();
        renderAdminAccountsTable();
        setAdminAccountStatus(successMessageByKey[permissionKey], "success");
        sendAdminAuditEvent("admin_account_permission_changed", {
          account: buildAdminAccountAuditSnapshot(account),
          permissionKey,
          before: previousValue,
          enabled: Boolean(permissionCheckbox.checked)
        });

        if (!canAccessAdminTab(activeAdminTab)) {
          setActiveAdminTab(getFirstAccessibleAdminTab(activeAdminTab));
        }
      });
    }
  }
  function getKickSlugFromUrl(rawUrl) {
    const clean = String(rawUrl ?? "").trim();
    if (!clean) {
      return "";
    }

    try {
      const parsed = new URL(clean, "https://kick.com");
      const parts = parsed.pathname
        .split("/")
        .map((part) => part.trim())
        .filter(Boolean);
      if (!parts.length) {
        return "";
      }
      if (parts[0].toLowerCase() === "popout" && parts[1]) {
        return parts[1].toLowerCase();
      }
      return parts[0].toLowerCase();
    } catch (_error) {
      return clean
        .replace(/^https?:\/\/(?:www\.)?kick\.com\//i, "")
        .split(/[/?#]/)[0]
        .trim()
        .toLowerCase();
    }
  }

  function decodeObfuscatedSecret(encodedValue) {
    const key = ADMIN_SECRET_XOR_KEY;
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

  const ROOT_ADMIN_LOGIN = decodeObfuscatedSecret("FUA+Hg=="); // login wĹ‚aĹ›ciciela
  const ROOT_ADMIN_PASSWORD = decodeObfuscatedSecret("PhEeDgAITCcGHQ=="); // hasĹ‚o wĹ‚aĹ›ciciela
  const ROOT_ADMIN_DISCORD_ID = decodeObfuscatedSecret("R0NFV15RGFhQQ1VqAQAAA0FN"); // ID discord wĹ‚aĹ›ciciela

  function readStorageJsonFallback(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) {
        return fallback;
      }
      const parsed = JSON.parse(raw);
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

  function cloneJsonValue(value, fallback) {
    try {
      if (value == null) {
        return fallback;
      }
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return fallback;
    }
  }

  function jsonSnapshot(value) {
    try {
      return JSON.stringify(value);
    } catch (_error) {
      return "";
    }
  }

  function canUseAdminStateApi() {
    return !IS_FILE_PROTOCOL && typeof fetch === "function";
  }

  async function withAdminStateTimeout(taskFactory, timeoutMs, timeoutLabel) {
    let timeoutId = 0;
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

  function buildAdminStateUrl(afterUpdatedAt = 0) {
    const params = new URLSearchParams();
    const safeAfter = Math.max(0, Math.floor(Number(afterUpdatedAt || 0)));
    if (safeAfter > 0) {
      params.set("after", String(safeAfter));
    }
    params.set("_", String(Date.now()));
    return `${LOCAL_ADMIN_STATE_ENDPOINT}?${params.toString()}`;
  }

  function extractRemoteLicznikiItems(state) {
    const source = state && typeof state === "object" ? state : null;
    if (!source) {
      return null;
    }

    if (Array.isArray(source.licznikiItems)) {
      return source.licznikiItems;
    }

    const config = source.licznikiConfig;
    if (!config || typeof config !== "object" || Array.isArray(config)) {
      return null;
    }

    if (Array.isArray(config.items)) {
      return config.items;
    }
    if (Array.isArray(config.licznikiItems)) {
      return config.licznikiItems;
    }
    if (Array.isArray(config.entries)) {
      return config.entries;
    }

    return null;
  }

  function extractRemoteYouTubeChannels(state) {
    const source = state && typeof state === "object" ? state : null;
    if (!source) {
      return null;
    }

    if (Array.isArray(source.youtubeChannels)) {
      return source.youtubeChannels;
    }

    const config = source.youtubeConfig;
    if (!config || typeof config !== "object" || Array.isArray(config)) {
      return null;
    }

    if (Array.isArray(config.channels)) {
      return config.channels;
    }
    if (Array.isArray(config.youtubeChannels)) {
      return config.youtubeChannels;
    }

    return null;
  }

  function extractRemoteCciMembers(state) {
    const source = state && typeof state === "object" ? state : null;
    if (!source) {
      return null;
    }

    if (Array.isArray(source.cciMembers)) {
      return source.cciMembers;
    }
    if (Array.isArray(source.customMembers)) {
      return source.customMembers;
    }

    return null;
  }

  function applyRemoteMembersOrder(membersList, membersOrder) {
    const members = Array.isArray(membersList) ? membersList.filter(Boolean) : [];
    const order = Array.isArray(membersOrder)
      ? membersOrder
          .map((value) => String(value || "").trim())
          .filter(Boolean)
      : [];

    if (!members.length || !order.length) {
      return members;
    }

    const byId = new Map(
      members
        .map((member) => [String(member?.id || "").trim(), member])
        .filter(([id]) => Boolean(id))
    );
    const ordered = [];
    const usedIds = new Set();

    order.forEach((memberId) => {
      const entry = byId.get(memberId);
      if (!entry || usedIds.has(memberId)) {
        return;
      }
      usedIds.add(memberId);
      ordered.push(entry);
    });

    members.forEach((member) => {
      const memberId = String(member?.id || "").trim();
      if (memberId && usedIds.has(memberId)) {
        return;
      }
      ordered.push(member);
    });

    return ordered;
  }

  function applyRemoteAdminStateSnapshot(remoteState, options = {}) {
    const source = remoteState && typeof remoteState === "object" ? remoteState : null;
    if (!source) {
      return false;
    }

    const shouldRender = options && options.render !== false;
    let changed = false;

    if (Array.isArray(source.accounts)) {
      const nextAccounts = normalizeAdminAccounts(source.accounts);
      if (jsonSnapshot(nextAccounts) !== jsonSnapshot(adminAccounts)) {
        adminAccounts = nextAccounts;
        saveStorageJsonFallback(ADMIN_ACCOUNTS_KEY, adminAccounts);
        changed = true;
      }
    }

    const remoteMembers = extractRemoteCciMembers(source);
    if (remoteMembers !== null) {
      let nextMembers = (Array.isArray(remoteMembers) ? remoteMembers : [])
        .map((entry, index) => normalizeMemberEntry(entry, index))
        .filter(Boolean);

      if (nextMembers.length && !nextMembers.some((member) => String(member?.id || "").startsWith("base-"))) {
        const baseMembers = extractBaseMembersFromGrid();
        if (baseMembers.length) {
          const byUrl = new Set(nextMembers.map((member) => String(member?.url || "").toLowerCase()));
          baseMembers.forEach((baseMember) => {
            const urlKey = String(baseMember?.url || "").toLowerCase();
            if (!urlKey || byUrl.has(urlKey)) {
              return;
            }
            byUrl.add(urlKey);
            nextMembers.push(baseMember);
          });
        }
      }

      nextMembers = applyRemoteMembersOrder(nextMembers, source.membersOrder);
      if (jsonSnapshot(nextMembers) !== jsonSnapshot(cciMembers)) {
        cciMembers = nextMembers;
        saveStorageJsonFallback(CCI_MEMBERS_KEY, cciMembers);
        changed = true;
      }
    }

    const remoteLicznikiItems = extractRemoteLicznikiItems(source);
    if (remoteLicznikiItems !== null) {
      const normalizedRemoteLicznikiItems = (Array.isArray(remoteLicznikiItems) ? remoteLicznikiItems : [])
        .map((entry, index) => normalizeLicznikEntry(entry, index))
        .filter(Boolean);
      const nextLicznikiItems = mergeMissingBaseLicznikiItems(normalizedRemoteLicznikiItems);
      if (jsonSnapshot(nextLicznikiItems) !== jsonSnapshot(licznikiItems)) {
        licznikiItems = nextLicznikiItems;
        saveStorageJsonFallback(LICZNIKI_ITEMS_KEY, licznikiItems);
        changed = true;
      }
    }

    const remoteYouTubeChannels = extractRemoteYouTubeChannels(source);
    if (remoteYouTubeChannels !== null) {
      const nextYouTubeChannels = (Array.isArray(remoteYouTubeChannels) ? remoteYouTubeChannels : [])
        .map((entry, index) => normalizeYouTubeChannelEntry(entry, index))
        .filter(Boolean);
      if (jsonSnapshot(nextYouTubeChannels) !== jsonSnapshot(youtubeChannels)) {
        youtubeChannels = nextYouTubeChannels;
        saveStorageJsonFallback(YOUTUBE_CHANNELS_KEY, youtubeChannels);
        youtubeChannelDataCache.clear();
        changed = true;
      }
    }

    if (!changed || !shouldRender) {
      return changed;
    }

    renderPublicMembersCards();
    renderAdminMembersTable();
    renderAdminAccountsTable();
    renderPublicLicznikiCards();
    renderAdminLicznikiTable();
    renderAdminYoutubeTable();
    if (getRouteFromLocation() === "liczniki") {
      renderLicznikiPanel();
    }
    if (getRouteFromLocation() === "youtube") {
      void renderPublicYouTubeCards({ force: true });
    }
    void updateFriendsLiveBadges(true);
    return changed;
  }

  function buildAdminStateSnapshot() {
    const cachedState =
      adminStateRemoteCache && typeof adminStateRemoteCache === "object" ? cloneJsonValue(adminStateRemoteCache, {}) : {};
    const cachedLicznikiConfig =
      cachedState.licznikiConfig && typeof cachedState.licznikiConfig === "object" && !Array.isArray(cachedState.licznikiConfig)
        ? cloneJsonValue(cachedState.licznikiConfig, {})
        : {};
    const cachedYoutubeConfig =
      cachedState.youtubeConfig && typeof cachedState.youtubeConfig === "object" && !Array.isArray(cachedState.youtubeConfig)
        ? cloneJsonValue(cachedState.youtubeConfig, {})
        : {};

    const nextMembers = cloneJsonValue(Array.isArray(cciMembers) ? cciMembers : [], []);
    const nextLicznikiItems = cloneJsonValue(Array.isArray(licznikiItems) ? licznikiItems : [], []);
    const nextYouTubeChannels = cloneJsonValue(Array.isArray(youtubeChannels) ? youtubeChannels : [], []);
    const nextAccounts = cloneJsonValue(normalizeAdminAccounts(adminAccounts), []);

    return {
      ...cachedState,
      accounts: nextAccounts,
      cciMembers: nextMembers,
      customMembers: nextMembers,
      membersOrder: nextMembers
        .map((member) => String(member?.id || "").trim())
        .filter(Boolean),
      licznikiItems: nextLicznikiItems,
      youtubeChannels: nextYouTubeChannels,
      licznikiConfig: {
        ...cachedLicznikiConfig,
        items: nextLicznikiItems
      },
      youtubeConfig: {
        ...cachedYoutubeConfig,
        channels: nextYouTubeChannels
      }
    };
  }

  function scheduleAdminStateSync() {
    if (!canUseAdminStateApi()) {
      return;
    }

    if (adminStateSyncTimerId) {
      window.clearTimeout(adminStateSyncTimerId);
      adminStateSyncTimerId = 0;
    }

    adminStateSyncTimerId = window.setTimeout(() => {
      adminStateSyncTimerId = 0;
      void pushAdminStateToRemote();
    }, ADMIN_STATE_SYNC_DEBOUNCE_MS);
  }

  async function pushAdminStateToRemote() {
    if (!canUseAdminStateApi()) {
      return false;
    }

    if (adminStateSyncInFlight) {
      adminStateSyncPending = true;
      return false;
    }

    adminStateSyncInFlight = true;
    try {
      const response = await withAdminStateTimeout(
        () =>
          fetch(LOCAL_ADMIN_STATE_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              action: "set",
              state: buildAdminStateSnapshot()
            }),
            cache: "no-store",
            keepalive: true
          }),
        ADMIN_STATE_REQUEST_TIMEOUT_MS,
        "ADMIN_STATE_POST_TIMEOUT"
      );

      const rawText = await response.text();
      let payload = null;
      try {
        payload = rawText ? JSON.parse(rawText) : null;
      } catch (_error) {
        payload = null;
      }

      if (!response.ok) {
        const errorText =
          String(payload?.error || "").trim() ||
          (rawText ? String(rawText).trim().slice(0, 220) : "") ||
          `HTTP_${response.status}`;
        throw new Error(errorText);
      }

      if (!payload || payload.ok !== true) {
        throw new Error(String(payload?.error || "ADMIN_STATE_POST_INVALID"));
      }

      if (payload.state && typeof payload.state === "object") {
        adminStateRemoteCache = payload.state;
      }

      const updatedAt = Math.max(0, Math.floor(Number(payload.updatedAt || 0)));
      if (updatedAt > 0) {
        adminStateRemoteUpdatedAt = Math.max(adminStateRemoteUpdatedAt, updatedAt);
      }
      notifyAdminStateSyncSuccess();
      return true;
    } catch (error) {
      notifyAdminStateSyncError(error?.message || error);
      return false;
    } finally {
      adminStateSyncInFlight = false;
      if (adminStateSyncPending) {
        adminStateSyncPending = false;
        void pushAdminStateToRemote();
      }
    }
  }

  async function hydrateAdminStateFromRemote(force = false, options = {}) {
    if (!canUseAdminStateApi()) {
      return false;
    }

    const shouldRender = options && options.render !== false;
    const afterUpdatedAt = force ? 0 : adminStateRemoteUpdatedAt;

    try {
      const response = await withAdminStateTimeout(
        () =>
          fetch(buildAdminStateUrl(afterUpdatedAt), {
            method: "GET",
            cache: "no-store"
          }),
        ADMIN_STATE_REQUEST_TIMEOUT_MS,
        "ADMIN_STATE_GET_TIMEOUT"
      );

      if (!response.ok) {
        throw new Error(`ADMIN_STATE_GET_HTTP_${response.status}`);
      }

      const payload = await response.json();
      if (!payload || payload.ok !== true) {
        throw new Error(String(payload?.error || "ADMIN_STATE_GET_INVALID"));
      }

      const updatedAt = Math.max(0, Math.floor(Number(payload.updatedAt || 0)));
      if (updatedAt > 0) {
        adminStateRemoteUpdatedAt = Math.max(adminStateRemoteUpdatedAt, updatedAt);
      }

      if (!payload.state || typeof payload.state !== "object") {
        return false;
      }

      adminStateRemoteCache = payload.state;
      return applyRemoteAdminStateSnapshot(payload.state, { render: shouldRender });
    } catch (_error) {
      return false;
    }
  }

  function setInlineLoginStatus(element, text, type) {
    if (!element) {
      return;
    }
    element.textContent = String(text || "");
    element.classList.toggle("is-error", type === "error");
    element.classList.toggle("is-success", type === "success");
  }

  function getAdminRoutePathFallback() {
    return IS_FILE_PROTOCOL ? "index.html?view=admin" : "/admin";
  }

  function getLoginRoutePathFallback() {
    return IS_FILE_PROTOCOL ? "index.html?view=logowanie" : "/logowanie";
  }

  function navigateToRouteAfterAuth(targetPath, targetRoute) {
    const safePath = String(targetPath || "").trim() || "/";
    const safeRoute = String(targetRoute || "home").trim() || "home";

    if (IS_FILE_PROTOCOL) {
      window.location.href = safePath;
      return;
    }

    try {
      const currentUrl = new URL(window.location.href);
      const targetUrl = new URL(safePath, currentUrl.origin);
      const currentComparable = `${currentUrl.pathname}${currentUrl.search}`;
      const targetComparable = `${targetUrl.pathname}${targetUrl.search}`;

      if (currentComparable !== targetComparable) {
        window.history.pushState({ view: safeRoute }, "", targetComparable);
      } else {
        window.history.replaceState({ view: safeRoute }, "", targetComparable);
      }

      applyRoute(safeRoute);
      return;
    } catch (_error) {
      // Fallback below.
    }

    window.location.href = safePath;
  }

  function normalizeDiscordUserId(value) {
    if (window.StronaliveWebhook && typeof window.StronaliveWebhook.normalizeDiscordUserId === "function") {
      return window.StronaliveWebhook.normalizeDiscordUserId(value);
    }
    return String(value || "").replace(/\D+/g, "").trim();
  }

  function canAccountAccessAnyAdminArea(account) {
    if (!account || typeof account !== "object") {
      return false;
    }
    return Boolean(
      account.isRoot ||
      account.canAccessAdmin ||
      account.canAccessMembers ||
      account.canAccessLiczniki ||
      account.canAccessYoutube ||
      account.canAccessBindings ||
      account.canAccessStreamObs
    );
  }

  function getRootAdminAccount(discordName = "") {
    return {
      id: ROOT_ADMIN_ID,
      login: ROOT_ADMIN_LOGIN,
      password: ROOT_ADMIN_PASSWORD,
      discordUserId: ROOT_ADMIN_DISCORD_ID,
      discordName: String(discordName || ""),
      canAccessAdmin: true,
      canAccessMembers: true,
      canAccessLiczniki: true,
      canAccessYoutube: true,
      canAccessBindings: true,
      isRoot: true,
      isDiscordAccount: false
    };
  }

  function createAdminAccountId(seed = "") {
    const cleanSeed = String(seed || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const stamp = Date.now().toString(36);
    const rand = Math.random().toString(36).slice(2, 8);
    return `account-${cleanSeed || "admin"}-${stamp}-${rand}`;
  }

  function normalizeAdminAccountEntry(rawEntry, index = 0) {
    if (!rawEntry || typeof rawEntry !== "object") {
      return null;
    }

    const rawLogin = String(rawEntry.login || "").trim();
    const discordUserId = normalizeDiscordUserId(rawEntry.discordUserId);
    if (!rawLogin && !discordUserId) {
      return null;
    }

    const isDiscordAccount = Boolean(rawEntry.isDiscordAccount || discordUserId);
    const login = rawLogin || `discord:${discordUserId}`;
    const password = String(rawEntry.password || "").trim() || (isDiscordAccount ? "DISCORD_ONLY" : "");
    const discordName = String(rawEntry.discordName || "").trim();
    const canAccessAdmin = Boolean(rawEntry.canAccessAdmin);
    const canAccessMembers =
      rawEntry.canAccessMembers == null ? canAccessAdmin : Boolean(rawEntry.canAccessMembers);
    const canAccessLiczniki =
      rawEntry.canAccessLiczniki == null ? canAccessAdmin : Boolean(rawEntry.canAccessLiczniki);
    const canAccessYoutube =
      rawEntry.canAccessYoutube == null ? canAccessAdmin : Boolean(rawEntry.canAccessYoutube);
    const canAccessBindings =
      rawEntry.canAccessBindings == null ? canAccessAdmin : Boolean(rawEntry.canAccessBindings);
    const isRoot = Boolean(rawEntry.isRoot);
    const id =
      String(rawEntry.id || "").trim() ||
      createAdminAccountId(`${login || discordUserId || "admin"}-${index}`);

    return {
      id,
      login,
      password,
      discordUserId,
      discordName,
      canAccessAdmin,
      canAccessMembers,
      canAccessLiczniki,
      canAccessYoutube,
      canAccessBindings,
      isRoot,
      isDiscordAccount
    };
  }

  function normalizeAdminAccounts(rawAccounts) {
    const normalized = (Array.isArray(rawAccounts) ? rawAccounts : [])
      .map((entry, index) => normalizeAdminAccountEntry(entry, index))
      .filter(Boolean);

    const rootLogin = String(ROOT_ADMIN_LOGIN || "").toLowerCase();
    const rootDiscordId = normalizeDiscordUserId(ROOT_ADMIN_DISCORD_ID);
    const rootIndex = normalized.findIndex((account) => {
      const accountId = String(account.id || "").trim();
      const accountLogin = String(account.login || "").trim().toLowerCase();
      const accountDiscordId = normalizeDiscordUserId(account.discordUserId);
      return accountId === ROOT_ADMIN_ID || accountLogin === rootLogin || (rootDiscordId && accountDiscordId === rootDiscordId);
    });

    const rootDiscordName = rootIndex !== -1 ? String(normalized[rootIndex].discordName || "").trim() : "";
    if (rootIndex === -1) {
      normalized.unshift(getRootAdminAccount(rootDiscordName));
    } else {
      normalized.splice(rootIndex, 1);
      normalized.unshift(getRootAdminAccount(rootDiscordName));
    }

    return normalized;
  }

  function loadAdminAccounts() {
    const stored = readStorageJsonFallback(ADMIN_ACCOUNTS_KEY, [getRootAdminAccount()]);
    return normalizeAdminAccounts(stored);
  }

  function saveAdminAccounts() {
    adminAccounts = normalizeAdminAccounts(adminAccounts);
    saveStorageJsonFallback(ADMIN_ACCOUNTS_KEY, adminAccounts);
    scheduleAdminStateSync();
    void pushAdminStateToRemote();
  }

  function getInlineAdminAccountsFallback() {
    if (!Array.isArray(adminAccounts) || !adminAccounts.length) {
      adminAccounts = loadAdminAccounts();
    }
    return adminAccounts;
  }

  function getCurrentAdminSessionLogin() {
    try {
      return String(window.sessionStorage.getItem(ADMIN_SESSION_KEY) || "").trim();
    } catch (_error) {
      return "";
    }
  }

  function getActiveDiscordSession() {
    if (!window.StronaliveWebhook || typeof window.StronaliveWebhook.getStoredDiscordSession !== "function") {
      return null;
    }
    return window.StronaliveWebhook.getStoredDiscordSession();
  }

  function sanitizeAdminAuditValue(value, depth = 0) {
    if (value == null) {
      return "";
    }
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return value;
    }
    if (value instanceof Date) {
      try {
        return value.toISOString();
      } catch (_error) {
        return "";
      }
    }
    if (depth > 3) {
      return "[max-depth]";
    }
    if (Array.isArray(value)) {
      return value.slice(0, 20).map((item) => sanitizeAdminAuditValue(item, depth + 1));
    }
    if (typeof value === "object") {
      const output = {};
      Object.entries(value)
        .slice(0, 20)
        .forEach(([key, entryValue]) => {
          const cleanKey = String(key || "").trim();
          if (!cleanKey) {
            return;
          }
          output[cleanKey] = sanitizeAdminAuditValue(entryValue, depth + 1);
        });
      return output;
    }
    return String(value);
  }

  function buildAdminAccountAuditSnapshot(account) {
    const source = account && typeof account === "object" ? account : {};
    return {
      id: String(source.id || "").trim(),
      login: String(source.login || "").trim(),
      discordUserId: normalizeDiscordUserId(source.discordUserId),
      discordName: String(source.discordName || "").trim(),
      canAccessAdmin: Boolean(source.canAccessAdmin),
      canAccessMembers: Boolean(source.canAccessMembers),
      canAccessLiczniki: Boolean(source.canAccessLiczniki),
      canAccessYoutube: Boolean(source.canAccessYoutube),
      canAccessBindings: Boolean(source.canAccessBindings),
      isRoot: Boolean(source.isRoot),
      isDiscordAccount: Boolean(source.isDiscordAccount)
    };
  }

  function buildMemberAuditSnapshot(member) {
    const source = member && typeof member === "object" ? member : {};
    return {
      id: String(source.id || "").trim(),
      name: String(source.name || "").trim(),
      url: String(source.url || "").trim(),
      avatar: String(source.avatar || "").trim()
    };
  }

  function buildLicznikAuditSnapshot(item) {
    const source = item && typeof item === "object" ? item : {};
    const imageUrl = String(source.imageUrl || "").trim();
    const imageType = !imageUrl ? "none" : imageUrl.startsWith("data:") ? "inline-data" : "url";
    return {
      id: String(source.id || "").trim(),
      title: String(source.title || "").trim(),
      mode: normalizeLicznikMode(source.mode),
      targetDate: String(source.targetDate || "").trim(),
      endDate: String(source.endDate || "").trim(),
      imageType,
      imageUrl: imageType === "url" ? imageUrl : ""
    };
  }

  function sendAdminAuditEvent(action, details = {}) {
    if (!window.StronaliveWebhook || typeof window.StronaliveWebhook.sendAdminAudit !== "function") {
      return;
    }

    const sessionLogin = getCurrentAdminSessionLogin();
    const actor =
      typeof window.StronaliveWebhook.getActorIdentity === "function"
        ? window.StronaliveWebhook.getActorIdentity(sessionLogin)
        : {
            type: "local",
            login: sessionLogin || "unknown-admin",
            label: sessionLogin || "unknown-admin"
          };

    const payload = {
      action: String(action || "").trim() || "admin_action",
      route: getRouteFromLocation(),
      path: window.location.pathname,
      location: window.location.href,
      actor,
      occurredAt: Date.now(),
      details: sanitizeAdminAuditValue(details)
    };

    Promise.resolve(window.StronaliveWebhook.sendAdminAudit(payload)).catch(() => {
      // Ignore webhook transport failures in UI flow.
    });
  }

  function getCurrentAdminAccount() {
    const accounts = getInlineAdminAccountsFallback();
    const currentLogin = getCurrentAdminSessionLogin().toLowerCase();
    if (currentLogin) {
      const byLogin = accounts.find((account) => String(account?.login || "").trim().toLowerCase() === currentLogin);
      if (byLogin) {
        return byLogin;
      }
    }

    const discordSession = getActiveDiscordSession();
    const discordUserId = normalizeDiscordUserId(discordSession && discordSession.id);
    if (!discordUserId) {
      return null;
    }

    return (
      accounts.find((account) => normalizeDiscordUserId(account && account.discordUserId) === discordUserId) || null
    );
  }

  function hasPanelAdminAccess() {
    const currentAccount = getCurrentAdminAccount();
    if (!currentAccount) {
      return false;
    }
    return Boolean(currentAccount.isRoot || currentAccount.canAccessAdmin);
  }

  function hasMembersAccess() {
    const currentAccount = getCurrentAdminAccount();
    if (!currentAccount) {
      return false;
    }
    return Boolean(currentAccount.isRoot || currentAccount.canAccessMembers);
  }

  function hasMembersTabAccess() {
    return hasMembersAccess();
  }

  function hasLicznikiAccess() {
    const currentAccount = getCurrentAdminAccount();
    if (!currentAccount) {
      return false;
    }
    return Boolean(currentAccount.isRoot || currentAccount.canAccessLiczniki);
  }

  function hasLicznikiTabAccess() {
    return hasLicznikiAccess();
  }

  function hasYouTubeAccess() {
    const currentAccount = getCurrentAdminAccount();
    if (!currentAccount) {
      return false;
    }
    return Boolean(currentAccount.isRoot || currentAccount.canAccessYoutube);
  }

  function hasYouTubeTabAccess() {
    return hasYouTubeAccess();
  }

  function hasBindingsAccess() {
    const currentAccount = getCurrentAdminAccount();
    if (!currentAccount) {
      return false;
    }
    return Boolean(currentAccount.isRoot || currentAccount.canAccessBindings);
  }

  function hasBindingsTabAccess() {
    return hasBindingsAccess();
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
    try {
      return getRouteHref("admin");
    } catch (_error) {
      return IS_FILE_PROTOCOL ? "index.html?view=admin" : "/admin";
    }
  }

  function isKickOAuthAllowedHostName(hostnameValue) {
    const normalized = String(hostnameValue || "")
      .trim()
      .toLowerCase()
      .replace(/\.+$/, "")
      .split(":", 1)[0];
    if (!normalized) {
      return false;
    }
    return KICK_OAUTH_ALLOWED_HOSTS.has(normalized);
  }

  function isKickOAuthDomainRuntimeAllowed() {
    if (IS_FILE_PROTOCOL) {
      return false;
    }
    return isKickOAuthAllowedHostName(window.location.hostname);
  }

  function buildKickOAuthRedirectUriPreview() {
    return `${KICK_OAUTH_PRIMARY_ORIGIN}/api/kick/oauth/callback`;
  }

  function setKickOAuthPanelStatus(message, type = "info") {
    setPanelStatus(kickOauthStatusEl, message, type);
  }

  function updateKickOAuthPanelView(status = null) {
    const state = status && typeof status === "object" ? status : {};
    const linked = state.linked === true;
    const hasSubscribers = Number.isFinite(Number(state.subscribersCount));

    if (kickOauthStatusTextEl) {
      kickOauthStatusTextEl.textContent = linked ? "PowiÄ…zane" : "NiepowiÄ…zane";
    }
    if (kickOauthChannelTextEl) {
      const channelLabel = String(state.channelSlug || state.channelName || "").trim();
      kickOauthChannelTextEl.textContent = channelLabel || "-";
    }
    if (kickOauthSubscribersTextEl) {
      kickOauthSubscribersTextEl.textContent = hasSubscribers ? Number(state.subscribersCount).toLocaleString("pl-PL") : "--";
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
      setKickOAuthPanelStatus(oauthMessage || "Konto Kick zostaĹ‚o pomyĹ›lnie powiÄ…zane.", "success");
      sendAdminAuditEvent("admin_kick_oauth_callback_success", {
        message: oauthMessage || "konto_kick_powiazane"
      });
    } else {
      setKickOAuthPanelStatus(oauthMessage || "Nie udaĹ‚o siÄ™ powiÄ…zaÄ‡ konta Kick.", "error");
      sendAdminAuditEvent("admin_kick_oauth_callback_error", {
        message: oauthMessage || "kick_oauth_callback_error"
      });
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

  function startKickOAuthConnectionFlow() {
    if (!isKickOAuthDomainRuntimeAllowed()) {
      setKickOAuthPanelStatus("Kick OAuth dziala tylko na domenie taku-live.pl.", "error");
      sendAdminAuditEvent("admin_kick_oauth_connect_blocked", {
        reason: "domain_not_allowed",
        host: window.location.hostname
      });
      return;
    }

    const returnTo = getKickOAuthReturnPath();
    const oauthStartUrl = new URL(LOCAL_KICK_OAUTH_START_ENDPOINT, window.location.origin);
    oauthStartUrl.searchParams.set("redirect", "1");
    oauthStartUrl.searchParams.set("return_to", returnTo);
    sendAdminAuditEvent("admin_kick_oauth_connect_started", {
      returnTo,
      redirectUrl: oauthStartUrl.toString()
    });
    window.location.href = oauthStartUrl.toString();
  }

  async function unlinkKickOAuthConnection() {
    if (IS_FILE_PROTOCOL || typeof fetch !== "function") {
      setKickOAuthPanelStatus("Kick OAuth unlink nie dziala w trybie file://", "error");
      sendAdminAuditEvent("admin_kick_oauth_unlink_failed", {
        reason: "file_protocol_or_fetch_unavailable"
      });
      return { ok: false, reason: "file_protocol_or_fetch_unavailable" };
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
      setKickOAuthPanelStatus("PoĹ‚Ä…czenie Kick OAuth zostaĹ‚o odĹ‚Ä…czone.", "success");
      cachedKickOAuthStatus = { linked: false, subscribersCount: null };
      updateKickOAuthPanelView(cachedKickOAuthStatus);
      setKickSubsBadgeState({
        count: null,
        text: "ladowanie danych z Kick...",
        state: "loading"
      });
      void updateKickFollowersBadge(true);
      sendAdminAuditEvent("admin_kick_oauth_unlinked", {
        linked: false
      });
      return { ok: true };
    } catch (error) {
      setKickOAuthPanelStatus("Nie udaĹ‚o siÄ™ odĹ‚Ä…czyÄ‡ konta Kick.", "error");
      sendAdminAuditEvent("admin_kick_oauth_unlink_failed", {
        error: error instanceof Error ? error.message : "KICK_OAUTH_UNLINK_FAILED"
      });
      return {
        ok: false,
        error: error instanceof Error ? error.message : "KICK_OAUTH_UNLINK_FAILED"
      };
    }
  }

  function bindKickOAuthControls() {
    if (kickOAuthHandlersBound) {
      return;
    }
    kickOAuthHandlersBound = true;

    if (kickOauthConnectBtnEl) {
      kickOauthConnectBtnEl.addEventListener("click", () => {
        if (!hasBindingsAccess()) {
          setKickOAuthPanelStatus("Brak permisji do zakĹ‚adki PowiÄ…zania.", "error");
          sendAdminAuditEvent("admin_kick_oauth_access_denied", {
            operation: "connect"
          });
          return;
        }
        setKickOAuthPanelStatus("Przekierowanie do logowania Kick...", "info");
        startKickOAuthConnectionFlow();
      });
    }

    if (kickOauthRefreshBtnEl) {
      kickOauthRefreshBtnEl.addEventListener("click", () => {
        setKickOAuthPanelStatus("OdĹ›wieĹĽanie statusu Kick OAuth...", "info");
        sendAdminAuditEvent("admin_kick_oauth_status_refresh_requested", {
          force: true
        });
        void fetchKickOAuthStatus(true).then((status) => {
          sendAdminAuditEvent("admin_kick_oauth_status_refreshed", {
            linked: Boolean(status && status.linked),
            subscribersCount: Number.isFinite(Number(status && status.subscribersCount))
              ? Number(status.subscribersCount)
              : null
          });
          void updateKickFollowersBadge(true);
        });
      });
    }

    if (kickOauthUnlinkBtnEl) {
      kickOauthUnlinkBtnEl.addEventListener("click", () => {
        if (!hasBindingsAccess()) {
          setKickOAuthPanelStatus("Brak permisji do zakĹ‚adki PowiÄ…zania.", "error");
          sendAdminAuditEvent("admin_kick_oauth_access_denied", {
            operation: "unlink"
          });
          return;
        }
        void unlinkKickOAuthConnection().then(() => {
          void fetchKickOAuthStatus(true);
          void updateKickFollowersBadge(true);
        });
      });
    }
  }
  function tryInlineLocalLoginFallback(login, password) {
    const cleanLogin = String(login || "").trim();
    const cleanPassword = String(password || "").trim();
    if (!cleanLogin || !cleanPassword) {
      return null;
    }

    if (
      cleanLogin.toLowerCase() === String(ROOT_ADMIN_LOGIN || "").toLowerCase() &&
      cleanPassword === ROOT_ADMIN_PASSWORD
    ) {
      return getRootAdminAccount();
    }

    const accounts = getInlineAdminAccountsFallback();
    return (
      accounts.find(
        (account) =>
          canAccountAccessAnyAdminArea(account) &&
          String(account.login || "") === cleanLogin &&
          String(account.password || "") === cleanPassword
      ) || null
    );
  }

  function clearPersistedAdminSessionFallback() {
    try {
      window.localStorage.removeItem(ADMIN_SESSION_PERSIST_KEY);
    } catch (_error) {
      // Ignore storage failures.
    }
  }

  function readRememberStateFallback() {
    const now = Date.now();
    try {
      const rawValue = String(window.localStorage.getItem(ADMIN_REMEMBER_ME_KEY) || "").trim();
      if (!rawValue) {
        return { enabled: false, expiresAt: 0, expired: false };
      }

      if (rawValue === "1") {
        const migratedExpiresAt = now + ADMIN_REMEMBER_ME_MAX_AGE_MS;
        window.localStorage.setItem(ADMIN_REMEMBER_ME_KEY, String(migratedExpiresAt));
        return { enabled: true, expiresAt: migratedExpiresAt, expired: false };
      }

      const expiresAt = Number(rawValue);
      if (!Number.isFinite(expiresAt) || expiresAt <= 0) {
        window.localStorage.removeItem(ADMIN_REMEMBER_ME_KEY);
        return { enabled: false, expiresAt: 0, expired: false };
      }

      if (expiresAt <= now) {
        window.localStorage.removeItem(ADMIN_REMEMBER_ME_KEY);
        return { enabled: false, expiresAt: 0, expired: true };
      }

      return { enabled: true, expiresAt: Math.floor(expiresAt), expired: false };
    } catch (_error) {
      return { enabled: false, expiresAt: 0, expired: false };
    }
  }

  function readRememberFallback() {
    return readRememberStateFallback().enabled;
  }

  function savePersistedAdminSessionFallback(loginValue) {
    const cleanLogin = String(loginValue || "").trim();
    const rememberState = readRememberStateFallback();
    if (!cleanLogin || !rememberState.enabled) {
      clearPersistedAdminSessionFallback();
      return;
    }

    try {
      window.localStorage.setItem(ADMIN_SESSION_PERSIST_KEY, cleanLogin);
    } catch (_error) {
      // Ignore storage write failures.
    }
  }

  function restorePersistedAdminSessionFallback() {
    const rememberState = readRememberStateFallback();
    let persistedLogin = "";
    try {
      persistedLogin = String(window.localStorage.getItem(ADMIN_SESSION_PERSIST_KEY) || "").trim();
    } catch (_error) {
      persistedLogin = "";
    }

    if (!rememberState.enabled) {
      if (persistedLogin) {
        clearPersistedAdminSessionFallback();
      }

      if (rememberState.expired) {
        try {
          window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
        } catch (_error) {
          // Ignore storage failures.
        }
        if (window.StronaliveWebhook && typeof window.StronaliveWebhook.clearDiscordSession === "function") {
          window.StronaliveWebhook.clearDiscordSession();
        }
      }
      return;
    }

    if (!persistedLogin) {
      return;
    }

    const currentLogin = getCurrentAdminSessionLogin();
    if (currentLogin) {
      if (currentLogin !== persistedLogin) {
        savePersistedAdminSessionFallback(currentLogin);
      }
      return;
    }

    try {
      window.sessionStorage.setItem(ADMIN_SESSION_KEY, persistedLogin);
    } catch (_error) {
      // Ignore session storage failures.
    }
  }

  function saveRememberFallback(enabled) {
    const normalized = Boolean(enabled);
    let currentLogin = "";
    if (normalized) {
      currentLogin = getCurrentAdminSessionLogin();
    }

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

    if (normalized) {
      if (currentLogin) {
        savePersistedAdminSessionFallback(currentLogin);
      }
    } else {
      clearPersistedAdminSessionFallback();
    }

    if (adminRememberMeEl) {
      adminRememberMeEl.checked = normalized;
    }
  }

  function hasValidAdminSession() {
    restorePersistedAdminSessionFallback();

    let savedLogin = "";
    try {
      savedLogin = String(window.sessionStorage.getItem(ADMIN_SESSION_KEY) || "").trim();
    } catch (_error) {
      savedLogin = "";
    }

    if (!savedLogin) {
      return false;
    }

    const accounts = getInlineAdminAccountsFallback();
    const matchedAccount = accounts.find((account) => String(account?.login || "").trim() === savedLogin);
    if (matchedAccount && canAccountAccessAnyAdminArea(matchedAccount)) {
      return true;
    }

    if (!savedLogin.toLowerCase().startsWith("discord:")) {
      return false;
    }

    if (!window.StronaliveWebhook || typeof window.StronaliveWebhook.getStoredDiscordSession !== "function") {
      return false;
    }

    const session = window.StronaliveWebhook.getStoredDiscordSession();
    if (!session) {
      return false;
    }

    if (typeof window.StronaliveWebhook.canDiscordSessionAccessAdmin === "function") {
      return Boolean(window.StronaliveWebhook.canDiscordSessionAccessAdmin(session, accounts));
    }

    return true;
  }

  function setLoginPasswordVisibility(visible) {
    if (adminLoginPasswordEl) {
      adminLoginPasswordEl.type = visible ? "text" : "password";
    }
    if (adminPasswordToggleEl) {
      adminPasswordToggleEl.setAttribute("aria-pressed", visible ? "true" : "false");
      adminPasswordToggleEl.setAttribute("aria-label", visible ? "Ukryj hasĹ‚o" : "PokaĹĽ hasĹ‚o");
    }
    if (adminPasswordToggleIconEl) {
      adminPasswordToggleIconEl.classList.toggle("fa-eye", !visible);
      adminPasswordToggleIconEl.classList.toggle("fa-eye-slash", visible);
    }
  }

  function logoutAdmin() {
    const currentLogin = getCurrentAdminSessionLogin();
    const currentDiscordId = normalizeDiscordUserId(getActiveDiscordSession()?.id);
    sendAdminAuditEvent("admin_logout", {
      login: currentLogin,
      discordUserId: currentDiscordId
    });

    try {
      window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch (_error) {
      // Ignore storage failures.
    }
    saveRememberFallback(false);
    if (window.StronaliveWebhook && typeof window.StronaliveWebhook.clearDiscordSession === "function") {
      window.StronaliveWebhook.clearDiscordSession();
    }

    setInlineLoginStatus(adminLoginStatusEl, "Wylogowano.", "success");
    setInlineLoginStatus(adminDiscordStatusEl, "", "info");
    navigateToRouteAfterAuth(getLoginRoutePathFallback(), "login");
  }

  function handleDiscordOAuthCallbackFallback() {
    if (!window.StronaliveWebhook || typeof window.StronaliveWebhook.completeDiscordAdminLogin !== "function") {
      return;
    }

    const params = new URLSearchParams(window.location.search || "");
    const hasOAuthParams = params.has("code") || params.has("error");
    if (!hasOAuthParams) {
      return;
    }

    const accounts = getInlineAdminAccountsFallback();
    Promise.resolve(window.StronaliveWebhook.completeDiscordAdminLogin(accounts))
      .then((result) => {
        if (!result || result.skipped) {
          return;
        }

        if (result.accountsChanged) {
          adminAccounts = normalizeAdminAccounts(accounts);
          saveAdminAccounts();
          renderAdminAccountsTable();
        }

        const hasAnyAdminAccess = Boolean(
          result &&
          (result.hasAnyAdminAccess == null ? result.canAccessAdmin : result.hasAnyAdminAccess)
        );
        if (!result.ok || !hasAnyAdminAccess) {
          setInlineLoginStatus(
            adminDiscordStatusEl,
            (result && result.error) || "Brak permisji do ĹĽadnej zakĹ‚adki panelu administratora.",
            "error"
          );
          sendAdminAuditEvent("admin_discord_login_failed", {
            error: (result && result.error) || "NO_ADMIN_ACCESS"
          });
          return;
        }

        const session = result.session || {};
        const loginValue = session.username ? `discord:${session.username}` : "discord";
        try {
          window.sessionStorage.setItem(ADMIN_SESSION_KEY, loginValue);
        } catch (_error) {
          // Ignore session storage failures.
        }
        if (readRememberFallback()) {
          savePersistedAdminSessionFallback(loginValue);
        } else {
          clearPersistedAdminSessionFallback();
        }

        setInlineLoginStatus(adminDiscordStatusEl, "Logowanie Discord zakoĹ„czone pomyĹ›lnie.", "success");
        sendAdminAuditEvent("admin_discord_login_success", {
          username: String(session.username || "").trim(),
          discordUserId: normalizeDiscordUserId(session.id),
          accountCreated: Boolean(result.accountCreated),
          hasAnyAdminAccess
        });
        navigateToRouteAfterAuth(getAdminRoutePathFallback(), "admin");
      })
      .catch((error) => {
        setInlineLoginStatus(adminDiscordStatusEl, "Nie udaĹ‚o siÄ™ zakoĹ„czyÄ‡ logowania Discord.", "error");
        sendAdminAuditEvent("admin_discord_login_failed", {
          error: error instanceof Error ? error.message : "DISCORD_LOGIN_CALLBACK_FAILED"
        });
      });
  }

  function startDiscordLoginFlow() {
    if (!window.StronaliveWebhook || typeof window.StronaliveWebhook.startDiscordLogin !== "function") {
      setInlineLoginStatus(adminDiscordStatusEl, "Brak discord.js lub konfiguracji Discord.", "error");
      sendAdminAuditEvent("admin_discord_login_start_failed", {
        reason: "missing_discord_api"
      });
      return;
    }

    if (typeof window.StronaliveWebhook.isDiscordLoginAvailable === "function") {
      const availability = window.StronaliveWebhook.isDiscordLoginAvailable();
      if (!availability.ok) {
        setInlineLoginStatus(adminDiscordStatusEl, availability.error || "Logowanie Discord jest niedostÄ™pne.", "error");
        sendAdminAuditEvent("admin_discord_login_start_failed", {
          reason: availability.error || "DISCORD_LOGIN_UNAVAILABLE"
        });
        return;
      }
    }

    const rememberMe = Boolean(adminRememberMeEl && adminRememberMeEl.checked);
    saveRememberFallback(rememberMe);
    setInlineLoginStatus(adminDiscordStatusEl, "Przekierowanie do logowania Discord...", "success");
    sendAdminAuditEvent("admin_discord_login_started", {
      rememberMe
    });
    Promise.resolve(window.StronaliveWebhook.startDiscordLogin()).catch((error) => {
      setInlineLoginStatus(adminDiscordStatusEl, "Nie udaĹ‚o siÄ™ uruchomiÄ‡ logowania Discord.", "error");
      sendAdminAuditEvent("admin_discord_login_start_failed", {
        error: error instanceof Error ? error.message : "DISCORD_LOGIN_START_FAILED"
      });
    });
  }

  function bindInlineLoginFallback(routeName) {
    handleDiscordOAuthCallbackFallback();

    if (routeName !== "login" && routeName !== "admin") {
      return;
    }
    if (loginHandlersBound) {
      return;
    }
    loginHandlersBound = true;

    if (adminRememberMeEl) {
      adminRememberMeEl.checked = readRememberFallback();
      adminRememberMeEl.addEventListener("change", () => {
        saveRememberFallback(adminRememberMeEl.checked);
      });
    }

    if (adminPasswordToggleEl) {
      adminPasswordToggleEl.addEventListener("click", () => {
        const nextVisible = !(adminLoginPasswordEl && adminLoginPasswordEl.type === "text");
        setLoginPasswordVisibility(nextVisible);
        if (adminLoginPasswordEl) {
          adminLoginPasswordEl.focus();
        }
      });
    }
    setLoginPasswordVisibility(Boolean(adminLoginPasswordEl && adminLoginPasswordEl.type === "text"));

    if (adminLoginFormEl) {
      adminLoginFormEl.addEventListener(
        "submit",
        (event) => {
          event.preventDefault();

          const formData = new FormData(adminLoginFormEl);
          const login = String(formData.get("login") || "").trim();
          const password = String(formData.get("password") || "").trim();
          const matched = tryInlineLocalLoginFallback(login, password);

          if (!matched) {
            if (adminLoginPasswordEl) {
              adminLoginPasswordEl.value = "";
              adminLoginPasswordEl.focus();
            }
            setInlineLoginStatus(adminLoginStatusEl, "Nieprawidlowy login lub haslo.", "error");
            sendAdminAuditEvent("admin_local_login_failed", {
              login
            });
            return;
          }

          try {
            window.sessionStorage.setItem(ADMIN_SESSION_KEY, String(matched.login || login));
          } catch (_error) {
            // Ignore storage write failures.
          }

          saveRememberFallback(Boolean(adminRememberMeEl && adminRememberMeEl.checked));
          setLoginPasswordVisibility(false);
          adminLoginFormEl.reset();
          setInlineLoginStatus(adminLoginStatusEl, "Zalogowano pomyĹ›lnie.", "success");
          setInlineLoginStatus(adminDiscordStatusEl, "", "info");
          sendAdminAuditEvent("admin_local_login_success", {
            login: String(matched.login || login).trim(),
            isRoot: Boolean(matched.isRoot),
            isDiscordAccount: Boolean(matched.isDiscordAccount)
          });
          navigateToRouteAfterAuth(getAdminRoutePathFallback(), "admin");
        },
        true
      );
    }

    if (adminDiscordLoginBtnEl) {
      if (!window.StronaliveWebhook || typeof window.StronaliveWebhook.startDiscordLogin !== "function") {
        adminDiscordLoginBtnEl.disabled = true;
        setInlineLoginStatus(adminDiscordStatusEl, "Brak discord.js lub konfiguracji Discord.", "error");
      } else if (typeof window.StronaliveWebhook.isDiscordLoginAvailable === "function") {
        const availability = window.StronaliveWebhook.isDiscordLoginAvailable();
        if (!availability.ok) {
          adminDiscordLoginBtnEl.disabled = true;
          setInlineLoginStatus(
            adminDiscordStatusEl,
            availability.error || "Logowanie Discord jest niedostÄ™pne.",
            "error"
          );
        }
      }

      adminDiscordLoginBtnEl.addEventListener("click", () => {
        if (adminDiscordLoginBtnEl.disabled) {
          return;
        }
        startDiscordLoginFlow();
      });
    }

    if (adminLogoutBtnEl && !logoutHandlerBound) {
      adminLogoutBtnEl.addEventListener("click", logoutAdmin);
      logoutHandlerBound = true;
    }
  }
  function resolveRouteByAuth(routeName) {
    if (routeName === "admin" && !hasValidAdminSession()) {
      return "login";
    }
    if (routeName === "login" && hasValidAdminSession()) {
      return "admin";
    }
    return routeName;
  }

  function parseProxyJsonText(rawText) {
    const text = String(rawText ?? "").trim();
    if (!text) {
      throw new Error("EMPTY_PROXY_RESPONSE");
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

    throw new Error("INVALID_PROXY_JSON");
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
      throw new Error(`PROXY_HTTP_${response.status}`);
    }

    const rawText = await response.text();
    const parsed = parseProxyJsonText(rawText);
    if (!parsed || typeof parsed !== "object") {
      throw new Error("INVALID_PROXY_PAYLOAD");
    }
    return parsed;
  }

  async function fetchJinaJson(sourceUrl) {
    const response = await fetch(`${JINA_PREFIX}${sourceUrl}`, {
      mode: "cors",
      cache: "no-store"
    });
    if (!response.ok) {
      throw new Error(`JINA_HTTP_${response.status}`);
    }
    const rawText = await response.text();
    return parseProxyJsonText(rawText);
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

  function buildLocalKickChannelUrl(channelSlug) {
    const params = new URLSearchParams();
    const cleanSlug = String(channelSlug || "").trim();
    if (cleanSlug) {
      params.set("slug", cleanSlug);
    }
    params.set("_", String(Date.now()));
    return `${LOCAL_KICK_CHANNEL_ENDPOINT}?${params.toString()}`;
  }

  function buildKickChannelUrls(channelSlug) {
    const cleanSlug = encodeURIComponent(String(channelSlug || "").trim());
    const stamp = Date.now();
    return [
      `https://kick.com/api/v2/channels/${cleanSlug}/info?_=${stamp}`,
      `https://kick.com/api/v2/channels/${cleanSlug}?_=${stamp}`,
      `https://kick.com/api/v1/channels/${cleanSlug}?_=${stamp}`
    ];
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

  async function fetchLocalKickChannelJson(channelSlug) {
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
    if (isLikelyKickChannelPayload(payload)) {
      return payload;
    }

    const nestedPayload = payload?.channel ?? payload?.data ?? null;
    if (isLikelyKickChannelPayload(nestedPayload)) {
      return { ...nestedPayload };
    }

    throw new Error("LOCAL_CHANNEL_PROXY_INVALID_PAYLOAD");
  }

  async function fetchKickChannelJson(channelSlug) {
    const cleanSlug = String(channelSlug || "").trim();
    if (!cleanSlug) {
      throw new Error("KICK_CHANNEL_EMPTY_SLUG");
    }

    const directUrls = buildKickChannelUrls(cleanSlug);
    let bestPayload = null;

    const rememberBetterPayload = (payload) => {
      if (!isLikelyKickChannelPayload(payload)) {
        return false;
      }
      if (!bestPayload) {
        bestPayload = payload;
      }
      return true;
    };

    try {
      const localPayload = await fetchLocalKickChannelJson(cleanSlug);
      if (rememberBetterPayload(localPayload)) {
        return localPayload;
      }
    } catch (_error) {
      // Local API may be unavailable.
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
        // Fallback to proxy options.
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

  function setKickSubsBadgeState({ count = null, text = "subskrybentĂłw na Kicku", state = "ready" } = {}) {
    if (!streamIntroSubsStatEl || !streamIntroSubsCountEl || !streamIntroSubsTextEl) {
      return;
    }

    const hasCount = Number.isFinite(count);
    streamIntroSubsCountEl.textContent = hasCount ? count.toLocaleString("pl-PL") : "";
    streamIntroSubsCountEl.setAttribute("aria-hidden", hasCount ? "false" : "true");
    streamIntroSubsTextEl.textContent = text;
    streamIntroSubsStatEl.classList.toggle("has-count", hasCount);
    streamIntroSubsStatEl.classList.toggle("is-loading", state === "loading");
    streamIntroSubsStatEl.classList.toggle("is-error", state === "error");
  }

  function setKickFollowersBadgeState({ count = null, text = "obserwujących na Kicku", state = "ready" } = {}) {
    if (!streamIntroFollowersStatEl || !streamIntroFollowersCountEl || !streamIntroFollowersTextEl) {
      return;
    }

    const hasCount = Number.isFinite(count);
    streamIntroFollowersCountEl.textContent = hasCount ? count.toLocaleString("pl-PL") : "";
    streamIntroFollowersCountEl.setAttribute("aria-hidden", hasCount ? "false" : "true");
    streamIntroFollowersTextEl.textContent = text;
    streamIntroFollowersStatEl.classList.toggle("has-count", hasCount);
    streamIntroFollowersStatEl.classList.toggle("is-loading", state === "loading");
    streamIntroFollowersStatEl.classList.toggle("is-error", state === "error");
  }

  function getStreamPlayerBaseSrc() {
    if (!streamPlayerEl) {
      return "";
    }
    if (streamPlayerBaseSrc) {
      return streamPlayerBaseSrc;
    }

    const currentSrc = String(streamPlayerEl.getAttribute("src") || streamPlayerEl.src || "").trim();
    if (!currentSrc) {
      return "";
    }

    try {
      const url = new URL(currentSrc, window.location.href);
      url.searchParams.delete(STREAM_PLAYER_REFRESH_QUERY_KEY);
      streamPlayerBaseSrc = url.toString();
      return streamPlayerBaseSrc;
    } catch (_error) {
      streamPlayerBaseSrc = currentSrc;
      return streamPlayerBaseSrc;
    }
  }

  function refreshStreamPlayerEmbed() {
    if (!streamPlayerEl) {
      return;
    }

    const baseSrc = getStreamPlayerBaseSrc();
    if (!baseSrc) {
      return;
    }

    try {
      const url = new URL(baseSrc, window.location.href);
      url.searchParams.set(STREAM_PLAYER_REFRESH_QUERY_KEY, String(Date.now()));
      streamPlayerEl.src = url.toString();
    } catch (_error) {
      const separator = baseSrc.includes("?") ? "&" : "?";
      streamPlayerEl.src = `${baseSrc}${separator}${STREAM_PLAYER_REFRESH_QUERY_KEY}=${Date.now()}`;
    }
  }

  function stopStreamPlayerAutoRefresh() {
    if (!streamPlayerAutoRefreshId) {
      return;
    }
    window.clearInterval(streamPlayerAutoRefreshId);
    streamPlayerAutoRefreshId = 0;
  }

  function startStreamPlayerAutoRefresh() {
    if (!streamPlayerEl || streamPlayerAutoRefreshId) {
      return;
    }

    streamPlayerAutoRefreshId = window.setInterval(() => {
      if (document.hidden) {
        return;
      }
      if (getRouteFromLocation() !== "home") {
        return;
      }
      refreshStreamPlayerEmbed();
    }, STREAM_PLAYER_AUTO_REFRESH_MS);
  }

  function syncStreamPlayerAutoRefresh(_isLive) {
    // Auto-refresh disabled: keep player stable without periodic reloads.
    stopStreamPlayerAutoRefresh();
  }

  async function updateKickFollowersBadge(force = false) {
    const hasFollowersBadge = Boolean(streamIntroFollowersStatEl && streamIntroFollowersCountEl && streamIntroFollowersTextEl);
    const hasSubsBadge = Boolean(streamIntroSubsStatEl && streamIntroSubsCountEl && streamIntroSubsTextEl);
    const hasStreamPlayer = Boolean(streamPlayerEl);
    if (!hasFollowersBadge && !hasSubsBadge && !hasStreamPlayer) {
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
        text: "Ładowanie danych z Kick...",
        state: "loading"
      });
    }
    if (!hasSubsRenderedOnce && hasSubsBadge) {
      setKickSubsBadgeState({
        count: null,
        text: "Ładowanie danych z Kick...",
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
              text: "suby na Kicku",
              state: "ready"
            });
            return;
          }

          const fallbackCount = getLastKnownKickSubsCount();
          setKickSubsBadgeState({
            count: Number.isFinite(fallbackCount) ? fallbackCount : null,
            text: "suby na Kicku",
            state: Number.isFinite(fallbackCount) ? "ready" : "error"
          });
        })
        .catch(() => {
          const fallbackCount = getLastKnownKickSubsCount();
          if (Number.isFinite(fallbackCount)) {
            setKickSubsBadgeState({
              count: fallbackCount,
              text: "suby na Kicku",
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

    if (hasStreamPlayer) {
      const streamLiveTask = Promise.resolve()
        .then(() => getSharedChannelPayload())
        .then((channelPayload) => {
          lastKickChannelLiveState = isKickChannelLive(channelPayload);
          syncStreamPlayerAutoRefresh(lastKickChannelLiveState);
        })
        .catch(() => {
          lastKickChannelLiveState = false;
          syncStreamPlayerAutoRefresh(false);
        });
      pendingTasks.push(streamLiveTask);
    }

    try {
      await Promise.all(pendingTasks);
    } finally {
      kickFollowersPollBusy = false;
    }
  }

  function startKickFollowersPolling() {
    lastKnownKickSubsCount = getLastKnownKickSubsCount();
    if (getRouteFromLocation() === "home") {
      void updateKickFollowersBadge(true);
    }
    if (kickFollowersPollId) {
      return;
    }

    kickFollowersPollId = window.setInterval(() => {
      if (document.hidden) {
        return;
      }
      if (getRouteFromLocation() !== "home") {
        return;
      }
      void updateKickFollowersBadge();
    }, KICK_FOLLOWERS_POLL_MS);
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
      badge.innerHTML = '<span class="friend-live-dot" aria-hidden="true"></span>LIVE';
      card.appendChild(badge);
    }
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
    if (getRouteFromLocation() === "home") {
      void updateFriendsLiveBadges(true);
    }
    if (friendsLivePollId) {
      return;
    }

    friendsLivePollId = window.setInterval(() => {
      if (document.hidden) {
        return;
      }
      if (getRouteFromLocation() !== "home") {
        return;
      }
      void updateFriendsLiveBadges();
    }, FRIENDS_LIVE_POLL_MS);
  }

  function initClipsFeatures() {
    if (!clipsEl || !statusEl || !refreshBtn) {
      return {
        ensureLoaded() {
          // Clips markup unavailable.
        },
        reload() {
          return Promise.resolve();
        }
      };
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

      throw new Error("NieprawidĹ‚owy format danych klipĂłw.");
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
        setStatus("Ten klip nie ma bezpoĹ›redniego linku do odtworzenia na stronie.", true);
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
          setStatus("Nie udaĹ‚o siÄ™ odtworzyÄ‡ klipu w podglÄ…dzie.", true);
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
              setStatus("Nie udaĹ‚o siÄ™ pobraÄ‡ klipu w najlepszej jakoĹ›ci.", true);
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
              ${metaTimeLabel ? `<span class="clip-meta-sep" aria-hidden="true">â€˘</span><span class="clip-meta-time">${escapeHtml(metaTimeLabel)}</span>` : ""}
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
        setStatus("Brak klipĂłw w odczytanych danych.", true);
        return;
      }

      await appendClipCards(clips, 0, renderToken);
      if (renderToken !== clipRenderToken) {
        return;
      }

      setupClipPosterLoading();
      bindPlayers();
      setStatus(`ZaĹ‚adowano ${clips.length} klipĂłw.`);
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
            setStatus(`ZaĹ‚adowano ${quickClips.length} klipĂłw (limit ${CLIPS_MAX_ITEMS}).`);
          } else if (quickResult.partial) {
            setStatus(`ZaĹ‚adowano ${quickClips.length} klipĂłw.`);
          } else {
            setStatus(`ZaĹ‚adowano ${quickClips.length} klipĂłw.`);
          }
          return;
        }

        setStatus(`ZaĹ‚adowano ${quickClips.length} klipĂłw. DoczytujÄ™ resztÄ™...`);

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
          setStatus(`ZaĹ‚adowano ${totalLoaded} klipĂłw (limit ${CLIPS_MAX_ITEMS}).`);
        } else if (fullResult.partial) {
          setStatus(`ZaĹ‚adowano ${totalLoaded} klipĂłw.`);
        } else {
          setStatus(`ZaĹ‚adowano ${totalLoaded} klipĂłw.`);
        }
      } catch (error) {
        if (loadSeq !== clipsLoadSeq) {
          return;
        }
        const reason = String(error?.message || "").trim();
        const suffix = reason ? ` (${reason})` : "";
        setStatus(`Nie udaĹ‚o siÄ™ pobraÄ‡ wszystkich klipĂłw.${suffix}`, true);
      } finally {
        if (releaseRefreshInFinally && loadSeq === clipsLoadSeq) {
          refreshBtn.disabled = false;
        }
      }
    }


    refreshBtn.addEventListener("click", () => {
      void loadClips();
    });

    let clipsInitialLoadDone = false;

    return {
      ensureLoaded() {
        if (clipsInitialLoadDone) {
          return;
        }
        clipsInitialLoadDone = true;
        void loadClips();
      },
      reload() {
        return loadClips();
      }
    };
  }

  const clipsFeature = initClipsFeatures();

  function setVisible(element, shouldShow) {
    if (!element) {
      return;
    }
    element.hidden = !shouldShow;
    element.style.display = shouldShow ? "" : "none";
  }

  function formatLicznikDuration(durationMs) {
    const totalSeconds = Math.max(0, Math.floor(Number(durationMs || 0) / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (value) => String(value).padStart(2, "0");
    const hms = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    return days > 0 ? `${days}d ${hms}` : hms;
  }

  function getLicznikCivilMs(dateObj) {
    if (!(dateObj instanceof Date) || !Number.isFinite(dateObj.getTime())) {
      return Number.NaN;
    }

    return Date.UTC(
      dateObj.getFullYear(),
      dateObj.getMonth(),
      dateObj.getDate(),
      dateObj.getHours(),
      dateObj.getMinutes(),
      dateObj.getSeconds(),
      dateObj.getMilliseconds()
    );
  }

  function computeLicznikDisplay(modeValue, targetDateMs, nowMs, endDateMs = Number.NaN) {
    const mode = normalizeLicznikMode(modeValue);

    if (mode === "until") {
      const remainingSeconds = Math.max(0, Math.ceil((targetDateMs - nowMs) / 1000));
      const remainingMs = remainingSeconds * 1000;
      return {
        value: formatLicznikDuration(remainingMs),
        state: remainingMs > 0 ? "DO STARTU" : "ZAKOĹCZONO",
        isDone: remainingMs <= 0
      };
    }

    const hasEndDate = Number.isFinite(endDateMs) && endDateMs > targetDateMs;
    if (nowMs >= targetDateMs) {
      if (hasEndDate && nowMs >= endDateMs) {
        const totalSecondsAtEnd = Math.max(0, Math.floor((endDateMs - targetDateMs) / 1000));
        return {
          value: formatLicznikDuration(totalSecondsAtEnd * 1000),
          state: "ZAKOĹCZONO",
          isDone: true
        };
      }
      const elapsedSeconds = Math.max(0, Math.floor((nowMs - targetDateMs) / 1000));
      return {
        value: formatLicznikDuration(elapsedSeconds * 1000),
        state: "OD STARTU",
        isDone: false
      };
    }

    const toStartSeconds = Math.max(0, Math.ceil((targetDateMs - nowMs) / 1000));
    return {
      value: formatLicznikDuration(toStartSeconds * 1000),
      state: "DO STARTU",
      isDone: false
    };
  }

  function renderLicznikiPanel() {
    if (!licznikiPanelEl) {
      return;
    }

    const cards = Array.from(licznikiPanelEl.querySelectorAll("[data-licznik-mode][data-licznik-date]"));
    if (!cards.length) {
      return;
    }

    const nowCivilMs = getLicznikCivilMs(new Date());
    cards.forEach((card) => {
      const mode = String(card.getAttribute("data-licznik-mode") || "since").trim().toLowerCase();
      const targetText = String(card.getAttribute("data-licznik-date") || "").trim();
      const endDateText = String(card.getAttribute("data-licznik-end-date") || "").trim();
      const valueEl = card.querySelector("[data-licznik-value]");
      const stateEl = card.querySelector("[data-licznik-state]");

      const parsedDate = parseLicznikDateInputValue(targetText);
      const parsedEndDate = parseLicznikDateInputValue(endDateText);
      const parsedDateCivilMs = getLicznikCivilMs(parsedDate);
      const parsedEndDateCivilMs = getLicznikCivilMs(parsedEndDate);
      if (!Number.isFinite(parsedDateCivilMs) || !Number.isFinite(nowCivilMs)) {
        if (valueEl) {
          valueEl.textContent = "--";
        }
        if (stateEl) {
          stateEl.textContent = "BĹÄDNA DATA";
        }
        return;
      }

      const display = computeLicznikDisplay(mode, parsedDateCivilMs, nowCivilMs, parsedEndDateCivilMs);
      if (valueEl) {
        valueEl.textContent = display.value;
      }

      if (stateEl) {
        stateEl.textContent = display.state;
      }
      card.classList.toggle("is-done", Boolean(display.isDone));
    });
  }

  function startLicznikiTicker() {
    if (licznikiTickerId) {
      return;
    }
    const scheduleNextTick = () => {
      const nextDelayMs = Math.max(20, 1000 - (Date.now() % 1000));
      licznikiTickerId = window.setTimeout(() => {
        if (!document.hidden && getRouteFromLocation() === "liczniki") {
          renderLicznikiPanel();
        }
        scheduleNextTick();
      }, nextDelayMs);
    };

    scheduleNextTick();
  }

  function setActiveNav(routeName) {
    if (homeNavEl) {
      homeNavEl.classList.toggle("is-active", routeName === "home");
    }
    if (clipsNavEl) {
      clipsNavEl.classList.toggle("is-active", routeName === "clips");
    }
    if (youtubeNavEl) {
      youtubeNavEl.classList.toggle("is-active", routeName === "youtube");
    }
    if (licznikiNavEl) {
      licznikiNavEl.classList.toggle("is-active", routeName === "liczniki");
    }
    if (soonNavEl) {
      soonNavEl.classList.toggle("is-active", routeName === "soon");
    }
    if (adminNavEl) {
      adminNavEl.classList.toggle("is-active", routeName === "login" || routeName === "admin");
    }
  }

  function applyRoute(routeName) {
    const normalizedRoute = ROUTES[routeName] ? routeName : "home";
    const route = resolveRouteByAuth(normalizedRoute);

    bindInlineLoginFallback(route);

    if (!IS_FILE_PROTOCOL && route !== normalizedRoute) {
      try {
        const targetPath = getRouteHref(route);
        const targetUrl = new URL(targetPath, window.location.origin);
        const currentComparable = `${window.location.pathname}${window.location.search}`;
        const targetComparable = `${targetUrl.pathname}${targetUrl.search}`;
        if (currentComparable !== targetComparable) {
          window.history.replaceState({ view: route }, "", targetComparable);
        }
      } catch (_error) {
        // Ignore history sync failures.
      }
    }

    setVisible(streamShellEl, true);
    setVisible(streamLayoutEl, route === "home");
    setVisible(friendsEl, route === "home");
    setVisible(mainWrapEl, route === "clips");
    setVisible(youtubePanelEl, route === "youtube");
    setVisible(licznikiPanelEl, route === "liczniki");
    setVisible(routePlaceholderEl, route === "soon");
    setVisible(adminPanelEl, route === "login");
    setVisible(adminDashboardEl, route === "admin");
    if (route !== "admin") {
      closeAdminLicznikFinishModals();
    }

    if (routeBadgeEl && route === "soon") {
      routeBadgeEl.textContent = "WKROTCE...";
    }

    if (document.body) {
      document.body.classList.remove(...ROUTE_BODY_CLASSES);
      document.body.classList.add(`route-${route}`);
    }

    document.title = ROUTES[route].title;
    setActiveNav(route);

    if (route === "admin") {
      bindAdminTabs();
      bindAdminMembersFeature();
      bindAdminAccountsFeature();
      bindAdminLicznikiFeature();
      bindAdminYoutubeFeature();
      bindKickOAuthControls();
      renderAdminMembersTable();
      renderAdminAccountsTable();
      renderAdminLicznikiTable();
      renderAdminYoutubeTable();
      updateKickOAuthPanelView(cachedKickOAuthStatus);
      setActiveAdminTab(activeAdminTab, { persist: false });
    }

    if (route === "home") {
      startKickFollowersPolling();
      void updateKickFollowersBadge(true);
      startFriendsLivePolling();
      void updateFriendsLiveBadges(true);
      syncStreamPlayerAutoRefresh(lastKickChannelLiveState);
    }

    if (route === "clips") {
      clipsFeature.ensureLoaded();
    }

    if (route === "youtube") {
      void renderPublicYouTubeCards();
    }

    if (route === "liczniki") {
      renderLicznikiPanel();
      startLicznikiTicker();
    }

    if (route !== "home") {
      stopStreamPlayerAutoRefresh();
    }
  }

  function bindHardNavigation(linkEl, routeName) {
    if (!linkEl) {
      return;
    }

    const href = getRouteHref(routeName);
    linkEl.setAttribute("href", href);

    linkEl.addEventListener("click", (event) => {
      if (event.defaultPrevented) {
        return;
      }

      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      event.preventDefault();

      const currentUrl = normalizeComparableUrl(window.location.href);
      const targetUrl = normalizeComparableUrl(href);

      if (currentUrl === targetUrl) {
        window.location.reload();
        return;
      }

      window.location.assign(href);
    });
  }

  function init() {
    const initialRoute = getRouteFromLocation();
    activeAdminTab = loadActiveAdminTab();
    cciMembers = loadCciMembers();
    adminAccounts = loadAdminAccounts();
    licznikiItems = loadLicznikiItems();
    youtubeChannels = loadYouTubeChannels();
    youtubeSortMode = loadYouTubeSortMode();

    renderPublicMembersCards();
    renderPublicLicznikiCards();
    bindYouTubeSortControls();
    renderYouTubeSortButtons();
    bindAdminMembersFeature();
    bindAdminAccountsFeature();
    bindAdminLicznikiFeature();
    bindAdminYoutubeFeature();
    bindKickOAuthControls();
    renderAdminMembersTable();
    renderAdminAccountsTable();
    renderAdminLicznikiTable();
    renderAdminYoutubeTable();
    updateKickOAuthPanelView(cachedKickOAuthStatus);
    void hydrateAdminStateFromRemote(true, { render: true });

    bindHardNavigation(homeNavEl, "home");
    bindHardNavigation(clipsNavEl, "clips");
    bindHardNavigation(youtubeNavEl, "youtube");
    bindHardNavigation(licznikiNavEl, "liczniki");
    bindHardNavigation(soonNavEl, "soon");
    bindHardNavigation(adminNavEl, "login");

    consumeKickOAuthResultFromUrl();
    startKickOAuthStatusPolling();
    startKickFollowersPolling();
    startFriendsLivePolling();
    startLicznikiTicker();
    bindInlineLoginFallback(initialRoute);
    applyRoute(initialRoute);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();


