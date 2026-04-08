(function () {
  const existingApi =
    window.TakuuWebhook && typeof window.TakuuWebhook === "object" ? window.TakuuWebhook : {};
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

  if (!window.STREAMER_SLUG) {
    window.STREAMER_SLUG = STREAMER_SLUG;
  }
  if (!window.STORAGE_NAMESPACE) {
    window.STORAGE_NAMESPACE = STORAGE_NAMESPACE;
  }

  function getStorageKey(name) {
    return `${STORAGE_NAMESPACE}_${String(name || "").trim()}`;
  }

  const DISCORD_API_BASE = "https://discord.com/api/v10";
  const DISCORD_AUTH_URL = "https://discord.com/oauth2/authorize";
  const DISCORD_TOKEN_URL = "https://discord.com/api/oauth2/token";
  // Rola "owner" panelu:
  // - użytkownik z tą rolą dostaje pełny dostęp administracyjny niezależnie od powiązanego konta;
  // - możesz nadpisać to globalnie przez window.TAKUU_DISCORD_OWNER_ROLE_ID;
  // - fallback: "819130111059427348".
  const DISCORD_OWNER_ROLE_ID =
    String(window.TAKUU_DISCORD_OWNER_ROLE_ID || "819130111059427348")
      .replace(/\D+/g, "")
      .trim() || "819130111059427348";

  const DISCORD_OAUTH_STATE_KEY = getStorageKey("discord_oauth_state");
  const DISCORD_OAUTH_PKCE_KEY = getStorageKey("discord_oauth_pkce");
  const DISCORD_SESSION_SESSION_KEY = getStorageKey("discord_session");
  const DISCORD_SESSION_PERSIST_KEY = getStorageKey("discord_session_persist");
  const ADMIN_REMEMBER_ME_KEY = getStorageKey("admin_remember_me");

  function toSafeString(value) {
    return String(value ?? "").trim();
  }

  function cloneArray(value) {
    return Array.isArray(value) ? [...value] : [];
  }

  function parseList(value) {
    if (Array.isArray(value)) {
      return value.map((item) => toSafeString(item)).filter(Boolean);
    }
    const text = toSafeString(value);
    if (!text) {
      return [];
    }
    return text
      .split(/[,\s]+/g)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function safeJsonParse(value) {
    try {
      return JSON.parse(String(value || ""));
    } catch (_error) {
      return null;
    }
  }

  function readStorage(storage, key) {
    try {
      return storage.getItem(key);
    } catch (_error) {
      return "";
    }
  }

  function writeStorage(storage, key, value) {
    try {
      storage.setItem(key, value);
      return true;
    } catch (_error) {
      return false;
    }
  }

  function removeStorage(storage, key) {
    try {
      storage.removeItem(key);
    } catch (_error) {
      // Ignore storage failures.
    }
  }

  function readSessionJson(key, fallback = null) {
    const parsed = safeJsonParse(readStorage(window.sessionStorage, key));
    return parsed == null ? fallback : parsed;
  }

  function writeSessionJson(key, value) {
    return writeStorage(window.sessionStorage, key, JSON.stringify(value));
  }

  function removeSessionKey(key) {
    removeStorage(window.sessionStorage, key);
  }

  function normalizeDiscordUserId(value) {
    const clean = toSafeString(value);
    return /^\d{15,22}$/.test(clean) ? clean : "";
  }

  function normalizeRoleIdList(value) {
    return Array.from(new Set(cloneArray(value).map((item) => normalizeDiscordUserId(item)).filter(Boolean)));
  }

  const rawWebhookConfig =
    window.TAKUU_WEBHOOK_CONFIG && typeof window.TAKUU_WEBHOOK_CONFIG === "object"
      ? window.TAKUU_WEBHOOK_CONFIG
      : {};
  const rawDiscordConfig =
    rawWebhookConfig.discordAuth && typeof rawWebhookConfig.discordAuth === "object"
      ? rawWebhookConfig.discordAuth
      : {};

  // Konfiguracja jak w webhook.js (fallback, gdy nie ma window.TAKUU_WEBHOOK_CONFIG.discordAuth).
  const DEFAULT_DISCORD_AUTH = {
    enabled: true,
    clientId: "1479604077707919583", // Discord Application Client ID
    guildId: "819127438566096907", // ID serwera Discord
    requiredRoleIds: ["819130111059427348", "819151997864509520", "819151727727083600"], // Owner, Główny Administrator, Administrator
    // Wszystkie adresy poniżej muszą być dodane 1:1 w Discord Developer Portal -> OAuth2 -> Redirects.
    redirectUri: "http://localhost:5500/logowanie",
    redirectUris: [
      "http://localhost:5500/logowanie",
      "https://<twoj-projekt>.vercel.app/logowanie",
      "https://taku-live.pl/logowanie",
      "https://www.taku-live.pl/logowanie"
    ],
    scopes: ["identify", "guilds.members.read"]
  };

  const DISCORD_CONFIG = (() => {
    const fromGlobals = {
      clientId: toSafeString(window.TAKUU_DISCORD_CLIENT_ID || ""),
      guildId: toSafeString(window.TAKUU_DISCORD_GUILD_ID || ""),
      redirectUri: toSafeString(window.TAKUU_DISCORD_REDIRECT_URI || ""),
      redirectUris: parseList(window.TAKUU_DISCORD_REDIRECT_URIS || []),
      requiredRoleIds: parseList(window.TAKUU_DISCORD_REQUIRED_ROLE_IDS || []),
      scopes: parseList(window.TAKUU_DISCORD_SCOPES || [])
    };

    const fromWebhookConfig = {
      clientId: toSafeString(rawDiscordConfig.clientId || DEFAULT_DISCORD_AUTH.clientId),
      guildId: toSafeString(rawDiscordConfig.guildId || DEFAULT_DISCORD_AUTH.guildId),
      redirectUri: toSafeString(rawDiscordConfig.redirectUri || DEFAULT_DISCORD_AUTH.redirectUri),
      redirectUris: cloneArray(rawDiscordConfig.redirectUris).map((item) => toSafeString(item)).filter(Boolean),
      requiredRoleIds: cloneArray(rawDiscordConfig.requiredRoleIds)
        .map((item) => toSafeString(item))
        .filter(Boolean),
      scopes: cloneArray(rawDiscordConfig.scopes).map((item) => toSafeString(item)).filter(Boolean)
    };

    if (!fromWebhookConfig.redirectUris.length) {
      fromWebhookConfig.redirectUris = cloneArray(DEFAULT_DISCORD_AUTH.redirectUris);
    }
    if (!fromWebhookConfig.requiredRoleIds.length) {
      fromWebhookConfig.requiredRoleIds = cloneArray(DEFAULT_DISCORD_AUTH.requiredRoleIds);
    }
    if (!fromWebhookConfig.scopes.length) {
      fromWebhookConfig.scopes = cloneArray(DEFAULT_DISCORD_AUTH.scopes);
    }

    const requiredRoleIds = normalizeRoleIdList([
      ...fromGlobals.requiredRoleIds,
      ...fromWebhookConfig.requiredRoleIds
    ]);

    const redirectUris = Array.from(new Set([...fromGlobals.redirectUris, ...fromWebhookConfig.redirectUris]));
    const scopes = Array.from(
      new Set(
        [
          ...fromGlobals.scopes,
          ...fromWebhookConfig.scopes,
          "identify",
          "guilds.members.read"
        ]
          .map((item) => toSafeString(item))
          .filter(Boolean)
      )
    );

    return {
      enabled: rawDiscordConfig.enabled !== false,
      clientId: fromGlobals.clientId || fromWebhookConfig.clientId,
      guildId: fromGlobals.guildId || fromWebhookConfig.guildId,
      requiredRoleIds,
      redirectUri: fromGlobals.redirectUri || fromWebhookConfig.redirectUri,
      redirectUris,
      scopes
    };
  })();

  function isRememberMeEnabled() {
    try {
      const rawValue = String(window.localStorage.getItem(ADMIN_REMEMBER_ME_KEY) || "").trim();
      if (!rawValue) {
        return false;
      }
      if (rawValue === "1") {
        return true;
      }
      const expiresAt = Number(rawValue);
      return Number.isFinite(expiresAt) && expiresAt > Date.now();
    } catch (_error) {
      return false;
    }
  }

  function buildDiscordAvatarUrl(userId, avatarHash) {
    const id = normalizeDiscordUserId(userId);
    const hash = toSafeString(avatarHash);
    if (!id || !hash) {
      return "";
    }
    const extension = hash.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/avatars/${id}/${hash}.${extension}?size=256`;
  }

  function normalizeDiscordSession(rawValue) {
    const source = rawValue && typeof rawValue === "object" ? rawValue : {};
    const id = normalizeDiscordUserId(source.id);
    const username = toSafeString(source.username);
    if (!id || !username) {
      return null;
    }

    const avatarHash = toSafeString(source.avatarHash || source.avatar);
    const roles = Array.isArray(source.roles)
      ? source.roles.map((roleId) => normalizeDiscordUserId(roleId)).filter(Boolean)
      : [];

    return {
      provider: "discord",
      id,
      username,
      displayName: toSafeString(source.displayName || source.global_name || source.globalName || username) || username,
      avatar: avatarHash,
      avatarHash,
      avatarUrl: toSafeString(source.avatarUrl) || buildDiscordAvatarUrl(id, avatarHash),
      email: toSafeString(source.email),
      discriminator: toSafeString(source.discriminator),
      scope: toSafeString(source.scope),
      roles,
      authorizedAt: Math.max(0, Math.floor(Number(source.authorizedAt || source.loggedAt || Date.now()))),
      loggedAt: Math.max(0, Math.floor(Number(source.loggedAt || source.authorizedAt || Date.now()))),
      expiresAt: Math.max(0, Math.floor(Number(source.expiresAt || 0))),
      isAuthorized: source.isAuthorized !== false
    };
  }

  function clearDiscordSession() {
    removeStorage(window.sessionStorage, DISCORD_SESSION_SESSION_KEY);
    removeStorage(window.localStorage, DISCORD_SESSION_PERSIST_KEY);
  }

  function storeDiscordSession(session) {
    const normalized = normalizeDiscordSession(session);
    if (!normalized) {
      clearDiscordSession();
      return false;
    }

    const payload = JSON.stringify(normalized);
    if (isRememberMeEnabled()) {
      removeStorage(window.sessionStorage, DISCORD_SESSION_SESSION_KEY);
      return writeStorage(window.localStorage, DISCORD_SESSION_PERSIST_KEY, payload);
    }

    removeStorage(window.localStorage, DISCORD_SESSION_PERSIST_KEY);
    return writeStorage(window.sessionStorage, DISCORD_SESSION_SESSION_KEY, payload);
  }

  function getStoredDiscordSession() {
    const rawValue =
      readStorage(window.sessionStorage, DISCORD_SESSION_SESSION_KEY) ||
      readStorage(window.localStorage, DISCORD_SESSION_PERSIST_KEY);
    const parsed = normalizeDiscordSession(safeJsonParse(rawValue));
    if (!parsed || !parsed.isAuthorized || !parsed.id || !parsed.username) {
      clearDiscordSession();
      return null;
    }
    return parsed;
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
    window.crypto.getRandomValues(buffer);
    return base64UrlFromBytes(buffer);
  }

  async function createPkceChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(String(verifier || ""));
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return base64UrlFromBytes(new Uint8Array(digest));
  }

  function cleanupOAuthParamsInUrl() {
    try {
      const url = new URL(window.location.href);
      const keysToDelete = ["code", "state", "error", "error_description"];
      let changed = false;

      keysToDelete.forEach((key) => {
        if (url.searchParams.has(key)) {
          url.searchParams.delete(key);
          changed = true;
        }
      });

      if (!changed) {
        return;
      }

      const query = url.searchParams.toString();
      const nextUrl = `${url.pathname}${query ? `?${query}` : ""}${url.hash || ""}`;
      window.history.replaceState({}, document.title, nextUrl);
    } catch (_error) {
      // Ignore URL cleanup failures.
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
        parsed.pathname =
          `${pathname.slice(0, pathname.length - legacyIndexLoginSuffix.length)}${legacyLoginSuffix}` ||
          legacyLoginSuffix;
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
    const singleConfigured = normalizeDiscordRedirectUri(DISCORD_CONFIG.redirectUri);
    if (singleConfigured) {
      candidates.push(singleConfigured);
    }

    DISCORD_CONFIG.redirectUris.forEach((item) => {
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
    if (!DISCORD_CONFIG.enabled) {
      return { ok: false, error: "Logowanie Discord jest wylaczone." };
    }
    if (window.location.protocol === "file:") {
      return { ok: false, error: "Logowanie Discord wymaga uruchomienia strony przez HTTP/HTTPS." };
    }
    if (!DISCORD_CONFIG.clientId) {
      return { ok: false, error: "Brak konfiguracji Discord Client ID." };
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
    if (!DISCORD_CONFIG.guildId) {
      return { ok: false, error: "Brak Discord Guild ID w konfiguracji." };
    }
    if (!DISCORD_CONFIG.requiredRoleIds.length) {
      return { ok: false, error: "Brak wymaganych rang Discord (requiredRoleIds)." };
    }
    return { ok: true };
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
    const scopes = Array.from(new Set(DISCORD_CONFIG.scopes.concat(["identify", "guilds.members.read"])));

    writeSessionJson(DISCORD_OAUTH_STATE_KEY, { state, createdAt: Date.now() });
    writeSessionJson(DISCORD_OAUTH_PKCE_KEY, { verifier, createdAt: Date.now() });

    const authUrl = new URL(DISCORD_AUTH_URL);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("client_id", DISCORD_CONFIG.clientId);
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
    body.set("client_id", DISCORD_CONFIG.clientId);
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
    const required = Array.from(new Set([DISCORD_OWNER_ROLE_ID, ...DISCORD_CONFIG.requiredRoleIds]));
    const normalizedRoles = Array.isArray(roleIds)
      ? roleIds.map((roleId) => normalizeDiscordUserId(roleId)).filter(Boolean)
      : [];
    return required.some((roleId) => normalizedRoles.includes(roleId));
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

  function isDiscordOwnerSession(session) {
    if (!session || typeof session !== "object") {
      return false;
    }
    const roles = Array.isArray(session.roles) ? session.roles.map((roleId) => normalizeDiscordUserId(roleId)) : [];
    return roles.includes(DISCORD_OWNER_ROLE_ID);
  }

  function findAdminAccountByDiscordId(accounts, discordUserId) {
    const normalizedId = normalizeDiscordUserId(discordUserId);
    if (!normalizedId || !Array.isArray(accounts)) {
      return null;
    }
    return accounts.find((account) => normalizeDiscordUserId(account && account.discordUserId) === normalizedId) || null;
  }

  function canDiscordSessionAccessAdmin(session, accounts) {
    if (!session || typeof session !== "object") {
      return false;
    }
    if (isDiscordOwnerSession(session)) {
      return true;
    }
    const linkedAccount = findAdminAccountByDiscordId(accounts, session.id);
    return Boolean(
      linkedAccount &&
      (linkedAccount.canAccessAdmin || linkedAccount.canAccessStreamObs || linkedAccount.canAccessBindings)
    );
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

  async function completeDiscordLoginFromRedirect() {
    let url = null;
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
      const member = await fetchDiscordMember(accessToken, DISCORD_CONFIG.guildId);
      const memberRoles = Array.isArray(member.roles) ? member.roles : [];

      if (!hasAnyRequiredRole(memberRoles)) {
        clearDiscordSession();
        cleanupOAuthParamsInUrl();
        return { ok: false, handled: true, error: "Brak wymaganej rangi Discord do panelu administratora." };
      }

      const session = normalizeDiscordSession({
        isAuthorized: true,
        id: toSafeString(user.id),
        username: toSafeString(user.username),
        displayName: buildDiscordDisplayName(user),
        avatar: toSafeString(user.avatar),
        avatarHash: toSafeString(user.avatar),
        roles: memberRoles.map((roleId) => normalizeDiscordUserId(roleId)).filter(Boolean),
        scope: toSafeString(tokenData.scope),
        authorizedAt: Date.now(),
        loggedAt: Date.now()
      });

      if (!session) {
        throw new Error("Nie udalo sie odczytac sesji Discord.");
      }

      storeDiscordSession(session);
      cleanupOAuthParamsInUrl();
      return { ok: true, handled: true, session };
    } catch (error) {
      clearDiscordSession();
      cleanupOAuthParamsInUrl();
      return {
        ok: false,
        handled: true,
        error: error instanceof Error ? error.message : "Blad logowania Discord."
      };
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
      canAccessAdmin: hasAnyAdminAccess,
      canAccessPanelAdmin,
      canAccessStreamObs,
      canAccessBindings,
      hasAnyAdminAccess
    };
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

  function sendAdminAudit(payload) {
    if (existingApi && typeof existingApi.sendAdminAudit === "function") {
      return existingApi.sendAdminAudit(payload);
    }
    void payload;
    return Promise.resolve({ ok: false, skipped: true });
  }

  const mergedConfig =
    existingApi.config && typeof existingApi.config === "object"
      ? { ...existingApi.config, discordAuth: DISCORD_CONFIG }
      : { discordAuth: DISCORD_CONFIG };

  const api = {
    ...existingApi,
    config: mergedConfig,
    normalizeDiscordUserId,
    findAdminAccountByDiscordId,
    canDiscordSessionAccessAdmin,
    upsertAdminAccountFromDiscordSession,
    getStoredDiscordSession,
    clearDiscordSession,
    getActorIdentity,
    isDiscordOwnerSession,
    sendAdminAudit,
    isDiscordLoginAvailable,
    startDiscordLogin,
    completeDiscordLoginFromRedirect,
    completeDiscordAdminLogin
  };

  window.TakuuWebhook = api;
  window.TakuuDiscord = api;
})();
