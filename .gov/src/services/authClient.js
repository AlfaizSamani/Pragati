/**
 * Supabase-backed auth for PRAGATI.
 *
 * Uses @supabase/supabase-js when VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
 * are configured. Without them, auth runs in a local "preview" mode: accounts
 * are kept in localStorage so the UI flows (sign in, request access, session)
 * can be demonstrated without a backend.
 *
 * Public API: session (subscribe), signIn, signUpRequestAccess, signOutUser,
 * getSession, isRemote.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isRemote = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let supabase = null;
let supabaseInitialization;

async function getSupabaseClient() {
  if (!isRemote) return null;
  if (supabase) return supabase;
  if (!supabaseInitialization) {
    supabaseInitialization = import("@supabase/supabase-js")
      .then(({ createClient }) => {
        supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        listeners.forEach((fn) => fn(getSession()));
        return supabase;
      })
      .catch((error) => {
        supabaseInitialization = null;
        throw new Error(`Supabase client failed to initialize: ${error.message}`);
      });
  }
  return supabaseInitialization;
}

/* ---------------- local preview mode ---------------- */

const LOCAL_KEY = "pragati-auth-session";
const USERS_KEY = "pragati-local-users";
const REQUESTS_KEY = "pragati-access-requests";

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

function localGetSession() {
  return readJson(LOCAL_KEY, null);
}

/* ---------------- session plumbing ---------------- */

const listeners = new Set();

function emit(session) {
  listeners.forEach((fn) => {
    try {
      fn(session);
    } catch {
      /* listener error must not break auth */
    }
  });
}

export function subscribe(fn) {
  listeners.add(fn);
  let active = true;
  let subscription;

  if (isRemote) {
    getSupabaseClient()
      .then(async (client) => {
        if (!active) return;
        const { data } = client.auth.onAuthStateChange((_event, session) => fn(toSession(session)));
        subscription = data?.subscription;
        const { data: sessionData } = await client.auth.getSession();
        if (active) fn(toSession(sessionData.session));
      })
      .catch((error) => console.error(error));
  }

  return () => {
    active = false;
    listeners.delete(fn);
    subscription?.unsubscribe?.();
  };
}

function toSession(s) {
  if (!s?.user) return null;
  const meta = s.user.user_metadata || {};
  return {
    email: s.user.email,
    name: meta.full_name || meta.name || s.user.email?.split("@")[0] || "Officer",
    role: meta.role || "Government Official",
    organization: meta.organization || "",
  };
}

export function getSession() {
  if (isRemote && supabase?.auth) return toSession(supabase.auth.currentUser ?? localGetSession());
  return localGetSession();
}

export async function getAccessToken() {
  if (!isRemote) return null;
  const client = await getSupabaseClient();
  const { data, error } = await client.auth.getSession();
  if (error) throw new Error(error.message);
  return data.session?.access_token ?? null;
}

export async function signIn(email, password) {
  const normalized = String(email || "").trim().toLowerCase();
  if (!normalized || !password) throw new Error("Enter your official email and password.");

  const client = await getSupabaseClient();
  if (client?.auth) {
    const { data, error } = await client.auth.signInWithPassword({ email: normalized, password });
    if (error) throw new Error(error.message);
    const session = toSession(data.session);
    emit(session);
    return session;
  }

  // Local preview mode
  const users = readJson(USERS_KEY, []);
  const user = users.find((u) => u.email === normalized);
  if (!user || user.password !== password) {
    throw new Error("Invalid email or password. Request access first, or use the demo officer.");
  }
  const session = { email: user.email, name: user.name, role: user.role, organization: user.organization };
  writeJson(LOCAL_KEY, session);
  emit(session);
  return session;
}

/** Convenience demo login so reviewers can enter the app instantly. */
export async function signInDemoOfficer() {
  // Local preview mode has no backend to hold the demo account — seed it
  // on first use so the one-click demo login always works.
  if (!isRemote) {
    const users = readJson(USERS_KEY, []);
    if (!users.some((u) => u.email === "a.sharma@mospi.gov.in")) {
      users.push({
        email: "a.sharma@mospi.gov.in",
        password: "pragati-demo",
        name: "A. Sharma",
        role: "Government Official",
        organization: "MoSPI",
      });
      writeJson(USERS_KEY, users);
    }
  }
  return signIn("a.sharma@mospi.gov.in", "pragati-demo");
}

export async function signUpRequestAccess(payload) {
  const email = String(payload.email || "").trim().toLowerCase();
  if (!email) throw new Error("Official email is required.");

  const client = await getSupabaseClient();
  if (client?.auth) {
    const { data, error } = await client.auth.signUp({
      email,
      password: payload.password,
      options: {
        data: {
          access_request_id: payload.requestId,
          full_name: payload.fullName,
          role: payload.role,
          requested_role: payload.role,
          organization: payload.organization,
          phone: payload.phone,
          designation: payload.designation,
          state_ut: payload.stateUt,
          purpose: payload.purpose,
          document_name: payload.document?.name || "",
        },
      },
    });
    if (error) throw new Error(error.message);

    if (payload.document) {
      const safeName = payload.document.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${payload.requestId}/${safeName}`;
      const extension = safeName.split(".").pop()?.toLowerCase();
      const contentType = payload.document.type || ({ pdf: "application/pdf", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png" }[extension] || "application/octet-stream");
      const { error: uploadError } = await client.storage
        .from("access-request-documents")
        .upload(path, payload.document, {
          contentType,
          upsert: false,
        });
      if (uploadError) {
        const uploadFailure = new Error(`Your account was created, but the supporting document could not be uploaded: ${uploadError.message}`);
        uploadFailure.accountCreated = true;
        throw uploadFailure;
      }
    }

    return {
      needsEmailConfirm: !data.session,
    };
  }

  const users = readJson(USERS_KEY, []);
  if (users.some((u) => u.email === email)) throw new Error("An account with this email already exists.");
  users.push({
    email,
    password: payload.password,
    name: payload.fullName || email.split("@")[0],
    role: payload.role || "Government Official",
    organization: payload.organization || "",
  });
  writeJson(USERS_KEY, users);
  const requests = readJson(REQUESTS_KEY, []);
  requests.push({ ...payload, email, submittedAt: new Date().toISOString(), status: "pending" });
  writeJson(REQUESTS_KEY, requests);
  return { needsEmailConfirm: false };
}

export async function signOutUser() {
  const client = await getSupabaseClient();
  if (client?.auth) {
    await client.auth.signOut();
  }
  writeJson(LOCAL_KEY, null);
  emit(null);
}
