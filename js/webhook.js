/* global window, document, fetch, URL, URLSearchParams, crypto, TextEncoder */
(function () {
  "use strict";

  // UZUPELNIJ ta konfiguracje pod swoj serwer Discord i webhook.
  window.TAKUU_WEBHOOK_CONFIG = window.TAKUU_WEBHOOK_CONFIG || {
    webhookEnabled: true,
    webhookUrl: "https://discord.com/api/webhooks/1479604949301203157/-CHwib_Tuh-uWg5zSJrOexlCujeosRMbSlx4o_KG4x6YbUDWCTbJvS3mqxFr2c87me-q", // np. https://discord.com/api/webhooks/ID/TOKEN
    webhookProxyUrl: "", // opcjonalnie: wlasny backend proxy
    webhookUsername: "Takuu Admin Logs",
    webhookAvatarUrl: "https://files.kick.com/images/user/196056/profile_image/conversion/5ed75600-4d1e-40ed-afb8-b2731a02ba10-fullsize.webp",
    discordAuth: {
      enabled: true,
      clientId: "1479604077707919583", // Discord Application Client ID
      guildId: "819127438566096907", // ID serwera Discord
      requiredRoleIds: ["819130111059427348", "819151997864509520", "819151727727083600"], // np. ["123456789012345678"] Owner GĹ‚Ăłwny Administrator Administrator
      // Wszystkie adresy ponizej musza byc dodane 1:1 w Discord Developer Portal -> OAuth2 -> Redirects.
      redirectUri: "http://localhost:5500/logowanie",
      redirectUris: [
        "http://localhost:5500/logowanie",
        "https://<twoj-projekt>.vercel.app/logowanie",
        "https://taku-live.pl/logowanie",
        "https://www.taku-live.pl/logowanie"
      ],
      scopes: ["identify", "guilds.members.read"]
    }
  };

  const DISCORD_API_BASE = "https://discord.com/api/v10";
  const DISCORD_AUTH_URL = "https://discord.com/oauth2/authorize";
  const DISCORD_TOKEN_URL = "https://discord.com/api/oauth2/token";
  const DISCORD_OWNER_ROLE_ID = "819130111059427348";
  const DISCORD_OAUTH_STATE_KEY = "takuu_discord_oauth_state";
  const DISCORD_OAUTH_PKCE_KEY = "takuu_discord_oauth_pkce";
  const DISCORD_SESSION_KEY = "takuu_discord_session";

  const DEFAULT_CONFIG = {
    webhookEnabled: true,
    webhookUrl: "",
    webhookProxyUrl: "",
    webhookUsername: "Takuu Admin Logs",
    webhookAvatarUrl: "",
    discordAuth: {
      enabled: true,
      clientId: "",
      guildId: "",
      requiredRoleIds: [],
      redirectUri: "",
      redirectUris: [],
      scopes: ["identify", "guilds.members.read"]
    }
  };

  function toSafeString(value) {
    return String(value ?? "").trim();
  }

  function cloneArray(value) {
    return Array.isArray(value) ? [...value] : [];
  }

  function mergeConfig(input) {
    const raw = input && typeof input === "object" ? input : {};
    const discordRaw = raw.discordAuth && typeof raw.discordAuth === "object" ? raw.discordAuth : {};

    return {
      webhookEnabled: raw.webhookEnabled !== false,
      webhookUrl: toSafeString(raw.webhookUrl || DEFAULT_CONFIG.webhookUrl),
      webhookProxyUrl: toSafeString(raw.webhookProxyUrl || DEFAULT_CONFIG.webhookProxyUrl),
      webhookUsername: toSafeString(raw.webhookUsername || DEFAULT_CONFIG.webhookUsername),
      webhookAvatarUrl: toSafeString(raw.webhookAvatarUrl || DEFAULT_CONFIG.webhookAvatarUrl),
      discordAuth: {
        enabled: discordRaw.enabled !== false,
        clientId: toSafeString(discordRaw.clientId || DEFAULT_CONFIG.discordAuth.clientId),
        guildId: toSafeString(discordRaw.guildId || DEFAULT_CONFIG.discordAuth.guildId),
        requiredRoleIds: cloneArray(discordRaw.requiredRoleIds || DEFAULT_CONFIG.discordAuth.requiredRoleIds)
          .map((roleId) => toSafeString(roleId))
          .filter(Boolean),
        redirectUri: toSafeString(discordRaw.redirectUri || DEFAULT_CONFIG.discordAuth.redirectUri),
        redirectUris: cloneArray(discordRaw.redirectUris || DEFAULT_CONFIG.discordAuth.redirectUris)
          .map((uri) => toSafeString(uri))
          .filter(Boolean),
        scopes: cloneArray(discordRaw.scopes || DEFAULT_CONFIG.discordAuth.scopes)
          .map((scope) => toSafeString(scope))
          .filter(Boolean)
      }
    };
  }

  const CONFIG = mergeConfig(window.TAKUU_WEBHOOK_CONFIG || {});

  function readSessionJson(key, fallback = null) {
    try {
      const raw = window.sessionStorage.getItem(key);
      if (!raw) {
        return fallback;
      }
      return JSON.parse(raw) ?? fallback;
    } catch (_error) {
      return fallback;
    }
  }

  function writeSessionJson(key, value) {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (_error) {
      return false;
    }
  }

  function removeSessionKey(key) {
    try {
      window.sessionStorage.removeItem(key);
    } catch (_error) {
      // Ignore storage failures.
    }
  }

  function base64UrlFromBytes(bytes) {
    const binary = Array.from(bytes, (item) => String.fromCharCode(item)).join("");
    return window
      .btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  }

  function createRandomToken(size = 32) {
    const buffer = new Uint8Array(size);
    crypto.getRandomValues(buffer);
    return base64UrlFromBytes(buffer);
  }

  async function createPkceChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return base64UrlFromBytes(new Uint8Array(digest));
  }

  function cleanupOAuthParamsInUrl() {
    try {
      const url = new URL(window.location.href);
      const params = url.searchParams;
      const keysToDelete = ["code", "state", "error", "error_description"];
      let changed = false;
      keysToDelete.forEach((key) => {
        if (params.has(key)) {
          params.delete(key);
          changed = true;
        }
      });
      if (!changed) {
        return;
      }
      const query = params.toString();
      const nextUrl = `${url.pathname}${query ? `?${query}` : ""}${url.hash || ""}`;
      window.history.replaceState({}, document.title, nextUrl);
    } catch (_error) {
      // Ignore URL cleanup errors.
    }
  }

  function getDefaultRedirectUri() {
    if (window.location.protocol === "file:") {
      return "";
    }

    try {
      const url = new URL(window.location.href);
      const host = String(url.hostname || "").toLowerCase();
      if (host === "127.0.0.1" || host === "::1" || host === "[::1]") {
        url.hostname = "localhost";
      }
      url.pathname = "/logowanie";
      url.search = "";
      url.hash = "";
      return url.toString();
    } catch (_error) {
      return "";
    }
  }

  function normalizeDiscordRedirectUri(rawUri) {
    const clean = toSafeString(rawUri);
    if (!clean) {
      return "";
    }

    try {
      const parsed = new URL(clean);
      const host = String(parsed.hostname || "").toLowerCase();
      if (host === "127.0.0.1" || host === "::1" || host === "[::1]") {
        parsed.hostname = "localhost";
      }

      const pathname = String(parsed.pathname || "/");
      const lowerPath = pathname.toLowerCase();
      const legacyIndexLoginSuffix = "/index.html/logowanie";
      const legacyLoginSuffix = "/logowanie";
      const indexSuffix = "/index.html";
      const view = toSafeString(parsed.searchParams.get("view")).toLowerCase();

      if (lowerPath.endsWith(legacyIndexLoginSuffix)) {
        parsed.pathname = `${pathname.slice(0, pathname.length - legacyIndexLoginSuffix.length)}${legacyLoginSuffix}` || legacyLoginSuffix;
      } else if (lowerPath.endsWith(indexSuffix) && view === "logowanie") {
        parsed.pathname = `${pathname.slice(0, pathname.length - indexSuffix.length)}${legacyLoginSuffix}` || legacyLoginSuffix;
      } else if (!lowerPath.endsWith(legacyLoginSuffix)) {
        parsed.pathname = legacyLoginSuffix;
      }

      parsed.searchParams.delete("view");
      parsed.searchParams.delete("code");
      parsed.searchParams.delete("state");
      parsed.searchParams.delete("error");
      parsed.searchParams.delete("error_description");
      parsed.hash = "";
      return parsed.toString();
    } catch (_error) {
      return "";
    }
  }

  function getDiscordRedirectUri() {
    const candidates = [];
    const singleConfigured = normalizeDiscordRedirectUri(CONFIG.discordAuth.redirectUri);
    if (singleConfigured) {
      candidates.push(singleConfigured);
    }
    CONFIG.discordAuth.redirectUris.forEach((item) => {
      const normalized = normalizeDiscordRedirectUri(item);
      if (normalized && !candidates.includes(normalized)) {
        candidates.push(normalized);
      }
    });

    if (candidates.length) {
      try {
        const current = new URL(window.location.href);
        const currentHost = String(current.hostname || "").toLowerCase();
        if (currentHost === "127.0.0.1" || currentHost === "::1" || currentHost === "[::1]") {
          current.hostname = "localhost";
        }
        const matchedByOrigin = candidates.find((candidate) => {
          try {
            return new URL(candidate).origin === current.origin;
          } catch (_error) {
            return false;
          }
        });
        if (matchedByOrigin) {
          return matchedByOrigin;
        }
      } catch (_error) {
        // Ignore parsing failures and fallback below.
      }
      return candidates[0];
    }

    return getDefaultRedirectUri();
  }

  function isDiscordLoginAvailable() {
    if (!CONFIG.discordAuth.enabled) {
      return { ok: false, error: "Logowanie Discord jest wyĹ‚Ä…czone." };
    }
    if (window.location.protocol === "file:") {
      return { ok: false, error: "Logowanie Discord wymaga uruchomienia strony przez HTTP/HTTPS." };
    }
    if (!CONFIG.discordAuth.clientId) {
      return { ok: false, error: "Brak konfiguracji Discord Client ID w webhook.js." };
    }
    const redirectUri = getDiscordRedirectUri();
    if (!redirectUri) {
      return { ok: false, error: "Brak redirect URI dla Discord OAuth." };
    }
    try {
      const parsedRedirect = new URL(redirectUri);
      const protocol = String(parsedRedirect.protocol || "").toLowerCase();
      if (protocol !== "http:" && protocol !== "https:") {
        return { ok: false, error: "redirect_uri musi byc adresem HTTP lub HTTPS." };
      }
    } catch (_error) {
      return { ok: false, error: "redirect_uri ma niepoprawny format URL." };
    }
    if (!CONFIG.discordAuth.guildId) {
      return { ok: false, error: "Brak Discord Guild ID w konfiguracji." };
    }
    if (!CONFIG.discordAuth.requiredRoleIds.length) {
      return { ok: false, error: "Brak wymaganych rang Discord (requiredRoleIds)." };
    }
    return { ok: true };
  }

  function getStoredDiscordSession() {
    const session = readSessionJson(DISCORD_SESSION_KEY, null);
    if (!session || typeof session !== "object") {
      return null;
    }
    if (!session.isAuthorized || !session.id || !session.username) {
      return null;
    }
    return session;
  }

  function clearDiscordSession() {
    removeSessionKey(DISCORD_SESSION_KEY);
  }

  async function startDiscordLogin() {
    const availability = isDiscordLoginAvailable();
    if (!availability.ok) {
      return availability;
    }

    const state = createRandomToken(24);
    const verifier = createRandomToken(64);
    const challenge = await createPkceChallenge(verifier);
    const redirectUri = getDiscordRedirectUri();
    const scopes = Array.from(new Set(CONFIG.discordAuth.scopes.concat(["identify", "guilds.members.read"])));

    writeSessionJson(DISCORD_OAUTH_STATE_KEY, { state, createdAt: Date.now() });
    writeSessionJson(DISCORD_OAUTH_PKCE_KEY, { verifier, createdAt: Date.now() });

    const authUrl = new URL(DISCORD_AUTH_URL);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("client_id", CONFIG.discordAuth.clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("scope", scopes.join(" "));
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("code_challenge", challenge);
    authUrl.searchParams.set("code_challenge_method", "S256");
    authUrl.searchParams.set("prompt", "consent");

    window.location.assign(authUrl.toString());
    return { ok: true };
  }

  async function exchangeDiscordCodeForToken(code, verifier, redirectUri) {
    const body = new URLSearchParams();
    body.set("client_id", CONFIG.discordAuth.clientId);
    body.set("grant_type", "authorization_code");
    body.set("code", code);
    body.set("redirect_uri", redirectUri);
    body.set("code_verifier", verifier);

    const response = await fetch(DISCORD_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString()
    });

    if (!response.ok) {
      throw new Error("Nie udalo sie wymienic kodu Discord OAuth na token.");
    }
    return response.json();
  }

  async function fetchDiscordIdentity(accessToken) {
    const response = await fetch(`${DISCORD_API_BASE}/users/@me`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!response.ok) {
      throw new Error("Nie udalo sie pobrac danych uzytkownika Discord.");
    }
    return response.json();
  }

  async function fetchDiscordMember(accessToken, guildId) {
    const response = await fetch(`${DISCORD_API_BASE}/users/@me/guilds/${guildId}/member`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!response.ok) {
      throw new Error("Nie udalo sie pobrac rang Discord dla tego serwera.");
    }
    return response.json();
  }

  function hasAnyRequiredRole(roleIds) {
    const required = Array.from(new Set([DISCORD_OWNER_ROLE_ID, ...CONFIG.discordAuth.requiredRoleIds]));
    const normalizedRoles = Array.isArray(roleIds) ? roleIds.map((roleId) => toSafeString(roleId)) : [];
    return required.some((roleId) => normalizedRoles.includes(roleId));
  }

  function normalizeDiscordUserId(value) {
    const clean = toSafeString(value);
    return /^\d{15,22}$/.test(clean) ? clean : "";
  }

  function isDiscordOwnerSession(session) {
    if (!session || typeof session !== "object") {
      return false;
    }
    const roles = Array.isArray(session.roles) ? session.roles.map((role) => toSafeString(role)) : [];
    return roles.includes(DISCORD_OWNER_ROLE_ID);
  }

  function findAdminAccountByDiscordId(accounts, discordUserId) {
    const normalizedId = normalizeDiscordUserId(discordUserId);
    if (!normalizedId || !Array.isArray(accounts)) {
      return null;
    }
    return accounts.find((account) => normalizeDiscordUserId(account?.discordUserId) === normalizedId) || null;
  }

  function canDiscordSessionAccessAdmin(session, accounts) {
    if (!session || typeof session !== "object") {
      return false;
    }
    if (isDiscordOwnerSession(session)) {
      return true;
    }
    const linkedAccount = findAdminAccountByDiscordId(accounts, session.id);
    return Boolean(linkedAccount && (linkedAccount.canAccessAdmin || linkedAccount.canAccessStreamObs || linkedAccount.canAccessBindings));
  }

  function upsertAdminAccountFromDiscordSession(session, accounts) {
    if (!session || typeof session !== "object" || !Array.isArray(accounts)) {
      return { account: null, changed: false, created: false };
    }

    const discordUserId = normalizeDiscordUserId(session.id);
    if (!discordUserId) {
      return { account: null, changed: false, created: false };
    }

    const ownerAccess = isDiscordOwnerSession(session);
    const generatedLogin = `discord:${toSafeString(session.username || discordUserId) || discordUserId}`;
    const discordName = toSafeString(session.displayName || session.username);
    const existing = findAdminAccountByDiscordId(accounts, discordUserId);

    if (existing) {
      if (typeof existing.canAccessStreamObs === "undefined") {
        existing.canAccessStreamObs = Boolean(existing.canAccessAdmin);
      }
      if (typeof existing.canAccessBindings === "undefined") {
        existing.canAccessBindings = Boolean(existing.canAccessAdmin);
      }
      const previous = JSON.stringify({
        login: existing.login,
        password: existing.password,
        discordUserId: existing.discordUserId,
        discordName: existing.discordName,
        canAccessAdmin: existing.canAccessAdmin,
        canAccessStreamObs: existing.canAccessStreamObs,
        canAccessBindings: existing.canAccessBindings,
        isDiscordAccount: existing.isDiscordAccount
      });

      existing.discordUserId = discordUserId;
      existing.isDiscordAccount = true;
      if (!toSafeString(existing.login)) {
        existing.login = generatedLogin;
      }
      existing.discordName = discordName;
      existing.password = toSafeString(existing.password) || "DISCORD_ONLY";
      if (ownerAccess) {
        existing.canAccessAdmin = true;
        existing.canAccessStreamObs = true;
        existing.canAccessBindings = true;
      }

      const next = JSON.stringify({
        login: existing.login,
        password: existing.password,
        discordUserId: existing.discordUserId,
        discordName: existing.discordName,
        canAccessAdmin: existing.canAccessAdmin,
        canAccessStreamObs: existing.canAccessStreamObs,
        canAccessBindings: existing.canAccessBindings,
        isDiscordAccount: existing.isDiscordAccount
      });

      return { account: existing, changed: previous !== next, created: false };
    }

    const created = {
      id: `discord-${discordUserId}`,
      login: generatedLogin,
      password: "DISCORD_ONLY",
      discordUserId,
      discordName,
      canAccessAdmin: ownerAccess,
      canAccessStreamObs: ownerAccess,
      canAccessBindings: ownerAccess,
      isRoot: false,
      isDiscordAccount: true
    };
    accounts.push(created);
    return { account: created, changed: true, created: true };
  }

  function buildDiscordDisplayName(user) {
    const globalName = toSafeString(user.global_name);
    if (globalName) {
      return globalName;
    }
    const username = toSafeString(user.username);
    const discriminator = toSafeString(user.discriminator);
    if (username && discriminator && discriminator !== "0") {
      return `${username}#${discriminator}`;
    }
    return username || "discord-user";
  }

  async function completeDiscordLoginFromRedirect() {
    let url;
    try {
      url = new URL(window.location.href);
    } catch (_error) {
      return { ok: false, skipped: true };
    }

    const code = toSafeString(url.searchParams.get("code"));
    const state = toSafeString(url.searchParams.get("state"));
    const oauthError = toSafeString(url.searchParams.get("error"));
    const oauthErrorDescription = toSafeString(url.searchParams.get("error_description"));

    if (oauthError) {
      cleanupOAuthParamsInUrl();
      return {
        ok: false,
        handled: true,
        error: oauthErrorDescription || `Discord OAuth error: ${oauthError}`
      };
    }

    if (!code || !state) {
      return { ok: false, skipped: true };
    }

    const availability = isDiscordLoginAvailable();
    if (!availability.ok) {
      cleanupOAuthParamsInUrl();
      return { ok: false, handled: true, error: availability.error };
    }

    const savedState = readSessionJson(DISCORD_OAUTH_STATE_KEY, null);
    const savedPkce = readSessionJson(DISCORD_OAUTH_PKCE_KEY, null);
    removeSessionKey(DISCORD_OAUTH_STATE_KEY);
    removeSessionKey(DISCORD_OAUTH_PKCE_KEY);

    if (!savedState || toSafeString(savedState.state) !== state || !savedPkce || !toSafeString(savedPkce.verifier)) {
      cleanupOAuthParamsInUrl();
      return { ok: false, handled: true, error: "Nieprawidlowy stan logowania Discord (state mismatch)." };
    }

    try {
      const redirectUri = getDiscordRedirectUri();
      const tokenData = await exchangeDiscordCodeForToken(code, toSafeString(savedPkce.verifier), redirectUri);
      const accessToken = toSafeString(tokenData.access_token);
      if (!accessToken) {
        throw new Error("Brak tokenu dostepu Discord.");
      }

      const user = await fetchDiscordIdentity(accessToken);
      const member = await fetchDiscordMember(accessToken, CONFIG.discordAuth.guildId);
      const memberRoles = Array.isArray(member.roles) ? member.roles : [];
      const authorized = hasAnyRequiredRole(memberRoles);
      if (!authorized) {
        clearDiscordSession();
        cleanupOAuthParamsInUrl();
        return { ok: false, handled: true, error: "Brak wymaganej rangi Discord do panelu administratora." };
      }

      const session = {
        isAuthorized: true,
        id: toSafeString(user.id),
        username: toSafeString(user.username),
        displayName: buildDiscordDisplayName(user),
        avatar: toSafeString(user.avatar),
        roles: memberRoles.map((roleId) => toSafeString(roleId)).filter(Boolean),
        loggedAt: Date.now()
      };
      writeSessionJson(DISCORD_SESSION_KEY, session);
      cleanupOAuthParamsInUrl();
      return { ok: true, handled: true, session };
    } catch (error) {
      clearDiscordSession();
      cleanupOAuthParamsInUrl();
      return { ok: false, handled: true, error: error instanceof Error ? error.message : "Blad logowania Discord." };
    }
  }

  async function completeDiscordAdminLogin(accounts) {
    const callbackResult = await completeDiscordLoginFromRedirect();
    if (!callbackResult || callbackResult.skipped) {
      return { ok: false, skipped: true };
    }
    if (!callbackResult.ok) {
      return {
        ok: false,
        handled: Boolean(callbackResult.handled),
        error: callbackResult.error || "Nie udalo sie zalogowac przez Discord."
      };
    }

    const session = callbackResult.session || null;
    if (!session) {
      return { ok: false, handled: true, error: "Nie udalo sie odczytac sesji Discord." };
    }

    const syncResult = upsertAdminAccountFromDiscordSession(session, accounts);
    const linkedAccount = syncResult.account || null;
    const ownerAccess = isDiscordOwnerSession(session);
    const canAccessPanelAdmin = ownerAccess || Boolean(linkedAccount && linkedAccount.canAccessAdmin);
    const canAccessStreamObs = ownerAccess || Boolean(linkedAccount && linkedAccount.canAccessStreamObs);
    const canAccessBindings = ownerAccess || Boolean(linkedAccount && linkedAccount.canAccessBindings);
    const hasAnyAdminAccess = canAccessPanelAdmin || canAccessStreamObs || canAccessBindings;

    return {
      ok: true,
      handled: true,
      session,
      linkedAccount,
      accountsChanged: Boolean(syncResult.changed),
      accountCreated: Boolean(syncResult.created),
      // Backward compatibility: canAccessAdmin means access to any admin tab.
      canAccessAdmin: hasAnyAdminAccess,
      canAccessPanelAdmin,
      canAccessStreamObs,
      canAccessBindings,
      hasAnyAdminAccess
    };
  }

  function stringifyDetails(details) {
    if (!details || typeof details !== "object") {
      return "Brak";
    }
    const safeDetails = { ...details };
    if (Object.prototype.hasOwnProperty.call(safeDetails, "password")) {
      safeDetails.password = "***";
    }
    const json = JSON.stringify(safeDetails, null, 2);
    if (json.length <= 1400) {
      return json;
    }
    return `${json.slice(0, 1397)}...`;
  }

  function getActorIdentity(fallbackLogin = "") {
    const discordSession = getStoredDiscordSession();
    if (discordSession) {
      return {
        type: "discord",
        login: `discord:${discordSession.username}`,
        label: `${discordSession.displayName || discordSession.username} (Discord)`,
        discordId: discordSession.id
      };
    }

    const login = toSafeString(fallbackLogin) || "unknown-admin";
    return {
      type: "local",
      login,
      label: login
    };
  }

  function detectBrowserName() {
    const ua = toSafeString(window.navigator?.userAgent);
    const checks = [
      { name: "Edge", re: /Edg\/([\d.]+)/i },
      { name: "Opera", re: /OPR\/([\d.]+)/i },
      { name: "Firefox", re: /Firefox\/([\d.]+)/i },
      { name: "Chrome", re: /(?:Chrome|CriOS)\/([\d.]+)/i },
      { name: "Safari", re: /Version\/([\d.]+).*Safari/i }
    ];

    for (const item of checks) {
      const match = ua.match(item.re);
      if (match) {
        const version = toSafeString(match[1]).split(".")[0];
        return version ? `${item.name} ${version}` : item.name;
      }
    }

    return "Nieznana";
  }

  function detectDeviceType() {
    const ua = toSafeString(window.navigator?.userAgent);
    if (/(iphone|android.+mobile|windows phone|mobile)/i.test(ua)) {
      return "Telefon";
    }

    const width = Number(window.screen?.width || 0);
    const height = Number(window.screen?.height || 0);
    const maxSide = Math.max(width, height);
    const minSide = Math.min(width, height);
    if (maxSide > 0 && maxSide <= 1600 && minSide <= 1000) {
      return "Laptop";
    }

    return "Komputer";
  }

  function getClientEnvironment() {
    return {
      deviceType: detectDeviceType(),
      browser: detectBrowserName()
    };
  }

  const WEBHOOK_ACTION_TITLE_MAP = Object.freeze({
    admin_change: "Panel Administratora - Zmiana",
    admin_login_discord: "Panel Administratora - Logowanie Discord",
    admin_login_discord_denied: "Panel Administratora - Odrzucone logowanie Discord",
    admin_login_local: "Panel Administratora - Logowanie lokalne",
    admin_login_failed: "Panel Administratora - Nieudane logowanie",
    admin_logout: "Panel Administratora - Wylogowanie",
    cennik_add: "Cennik - Dodano pozycje",
    cennik_update: "Cennik - Zaktualizowano pozycje",
    cennik_remove: "Cennik - Usunieto pozycje",
    cennik_reorder: "Cennik - Zmieniono kolejnosc",
    timer_add_time: "Timery - Dodano czas",
    timer_remove_time: "Timery - Usunieto czas",
    timer_set: "Timery - Ustawiono czas",
    timer_reset: "Timery - Reset timera",
    timer_add_quick: "Timery - Szybkie dodanie czasu",
    timer_remove_quick: "Timery - Szybkie odjecie czasu",
    counter_add: "Liczniki - Dodano wartosc",
    counter_set: "Liczniki - Ustawiono wartosc",
    counter_reset: "Liczniki - Reset licznika",
    counter_plus_one: "Liczniki - Dodano +1",
    counter_minus_one: "Liczniki - Odjeto -1",
    member_add: "CCI - Dodano czlonka",
    member_edit: "CCI - Edytowano czlonka",
    member_remove: "CCI - Usunieto czlonka",
    member_reorder: "CCI - Zmieniono kolejnosc",
    account_add: "Konta admina - Dodano konto",
    account_update: "Konta admina - Zaktualizowano konto",
    account_remove: "Konta admina - Usunieto konto",
    account_access_admin_change: "Konta admina - Zmieniono dostep do panelu",
    account_access_streamobs_change: "Konta admina - Zmieniono dostep do StreamOBS",
    wheel_config_change: "Kolo fortuny - Zmieniono konfiguracje",
    wheel_config_speed_change: "Kolo fortuny - Zmieniono predkosc",
    wheel_config_segment_add: "Kolo fortuny - Dodano segment",
    wheel_config_segment_remove: "Kolo fortuny - Usunieto segment",
    wheel_config_reorder: "Kolo fortuny - Zmieniono kolejnosc segmentow",
    wheel_config_save: "Kolo fortuny - Zapisano konfiguracje",
    wheel_config_set_items: "Kolo fortuny - Ustawiono segmenty",
    streamobs_timer_config_toggle: "StreamOBS Timery - Pokazano lub ukryto konfiguracje",
    streamobs_timer_layout_change: "StreamOBS Timery - Zmieniono uklad",
    streamobs_timer_color_change: "StreamOBS Timery - Zmieniono kolor kart",
    streamobs_timer_progress_color_change: "StreamOBS Timery - Zmieniono kolor paska postepu",
    streamobs_counter_config_toggle: "StreamOBS Liczniki - Pokazano lub ukryto konfiguracje",
    streamobs_counter_layout_change: "StreamOBS Liczniki - Zmieniono uklad",
    streamobs_counter_color_change: "StreamOBS Liczniki - Zmieniono kolor kart"
  });

  function humanizeActionCode(action) {
    const clean = toSafeString(action).toLowerCase();
    if (!clean) {
      return "Nieznana akcja";
    }

    const tokenMap = {
      admin: "admin",
      login: "logowanie",
      logout: "wylogowanie",
      failed: "nieudane",
      denied: "odrzucone",
      local: "lokalne",
      discord: "discord",
      cennik: "cennik",
      account: "konto",
      access: "dostep",
      streamobs: "streamobs",
      member: "czlonek",
      timer: "timer",
      counter: "licznik",
      add: "dodano",
      remove: "usunieto",
      update: "zaktualizowano",
      edit: "edytowano",
      reorder: "zmieniono kolejnosc",
      set: "ustawiono",
      reset: "zresetowano",
      plus: "plus",
      minus: "minus",
      one: "jeden",
      quick: "szybko",
      time: "czas",
      config: "konfiguracja",
      speed: "predkosc",
      segment: "segment",
      save: "zapis",
      items: "elementy",
      change: "zmiana",
      wheel: "kolo",
      layout: "uklad",
      color: "kolor",
      progress: "postep",
      toggle: "pokaz lub ukryj",
      show: "pokaz",
      hide: "ukryj"
    };

    const text = clean
      .split("_")
      .map((token) => tokenMap[token] || token)
      .join(" ")
      .trim();

    if (!text) {
      return "Nieznana akcja";
    }

    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function resolveWebhookTitle(action, target = "") {
    const cleanAction = toSafeString(action).toLowerCase();
    if (!cleanAction) {
      return "Panel Administratora - Zmiana";
    }

    if (Object.prototype.hasOwnProperty.call(WEBHOOK_ACTION_TITLE_MAP, cleanAction)) {
      return WEBHOOK_ACTION_TITLE_MAP[cleanAction];
    }

    const prefixMap = [
      { prefix: "streamobs_", title: "StreamOBS" },
      { prefix: "wheel_", title: "Kolo fortuny" },
      { prefix: "timer_", title: "Timery" },
      { prefix: "counter_", title: "Liczniki" },
      { prefix: "cennik_", title: "Cennik" },
      { prefix: "member_", title: "CCI" },
      { prefix: "account_", title: "Konta admina" },
      { prefix: "admin_", title: "Panel Administratora" }
    ];

    for (const item of prefixMap) {
      if (cleanAction.startsWith(item.prefix)) {
        return `${item.title} - ${humanizeActionCode(cleanAction.slice(item.prefix.length))}`;
      }
    }

    const targetLabel = toSafeString(target) || "Panel Administratora";
    return `${targetLabel} - ${humanizeActionCode(cleanAction)}`;
  }

  async function sendAdminAudit(payload) {
    if (!CONFIG.webhookEnabled) {
      return { ok: false, skipped: true, reason: "Webhook disabled" };
    }
    const endpoint = CONFIG.webhookProxyUrl || CONFIG.webhookUrl;
    if (!endpoint) {
      return { ok: false, skipped: true, reason: "Webhook URL missing" };
    }

    const data = payload && typeof payload === "object" ? payload : {};
    const actor = data.actor && typeof data.actor === "object" ? data.actor : {};
    const actorLabel = toSafeString(actor.label || actor.login || "Nieznany");
    const action = toSafeString(data.action || "admin_change");
    const target = toSafeString(data.target || "Panel Administratora");
    const route = toSafeString(data.route || window.location.href);
    const isLoginAction =
      action === "admin_login_discord" ||
      action === "admin_login_discord_denied" ||
      action === "admin_login_local" ||
      action === "admin_login_failed";
    const environment = getClientEnvironment();
    const detailsPayload = data.details && typeof data.details === "object" ? { ...data.details } : {};
    if (isLoginAction) {
      detailsPayload.deviceType = environment.deviceType;
      detailsPayload.browser = environment.browser;
    }
    const details = stringifyDetails(detailsPayload);
    const webhookTitle = resolveWebhookTitle(action, target);

    const embed = {
      title: webhookTitle,
      color: 5793266,
      description: [
        `**Akcja:** \`${action}\``,
        `**Cel:** ${target}`,
        `**Przez:** ${actorLabel}`,
        `**Czas:** <t:${Math.floor(Date.now() / 1000)}:f>`
      ].join("\n"),
      fields: [
        { name: "Szczegóły", value: `\`\`\`json\n${details}\n\`\`\`` },
        { name: "Środowisko", value: `Urządzenie: ${environment.deviceType}\nPrzeglądarka: ${environment.browser}` },
        { name: "Lokalizacja", value: route.slice(0, 1000) }
      ],
      timestamp: new Date().toISOString()
    };

    const body = {
      username: CONFIG.webhookUsername || "Takuu Admin Logs",
      avatar_url: CONFIG.webhookAvatarUrl || undefined,
      embeds: [embed]
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error("Webhook Discord odrzucil wiadomosc.");
    }
    return { ok: true };
  }

  function sanitizeWheelConfigDetails(details) {
    const raw = details && typeof details === "object" ? details : {};
    const copy = { ...raw };

    if (Array.isArray(copy.segments)) {
      copy.segments = copy.segments
        .slice(0, 16)
        .map((item) => toSafeString(item))
        .filter(Boolean);
      if (Array.isArray(raw.segments) && raw.segments.length > copy.segments.length) {
        copy.segmentsTruncated = true;
      }
    }

    return copy;
  }

  async function sendWheelConfigAudit(action, details = {}) {
    const normalizedAction = toSafeString(action || "wheel_config_change") || "wheel_config_change";
    const payload = {
      action: normalizedAction.startsWith("wheel_") ? normalizedAction : `wheel_${normalizedAction}`,
      target: "Konfiguracja kola",
      details: sanitizeWheelConfigDetails(details),
      actor: getActorIdentity("wheel-config"),
      route: window.location.href
    };
    return sendAdminAudit(payload);
  }

  window.TakuuWebhook = {
    config: CONFIG,
    sendAdminAudit,
    sendWheelConfigAudit,
    getActorIdentity,
    normalizeDiscordUserId,
    isDiscordOwnerSession,
    findAdminAccountByDiscordId,
    canDiscordSessionAccessAdmin,
    upsertAdminAccountFromDiscordSession,
    completeDiscordAdminLogin,
    isDiscordLoginAvailable,
    startDiscordLogin,
    completeDiscordLoginFromRedirect,
    getStoredDiscordSession,
    clearDiscordSession
  };
})();
