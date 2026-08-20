/**
 * Session & credential helpers.
 *
 * Pure functions using the Web Crypto API (no Node-only imports) so they work
 * both in Server Components/Actions and in the Edge/Node middleware.
 */

export const SESSION_COOKIE = "learnhub_admin_session";
export const STUDENT_SESSION_COOKIE = "learnhub_student_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const encoder = new TextEncoder();
const decoder = new TextDecoder();

/** Seeded demo admin credentials. Override any with env vars. */
export function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL ?? "umer@gmail.com",
    password: process.env.ADMIN_PASSWORD ?? "123456",
  };
}

function getAuthSecret(): string {
  return process.env.AUTH_SECRET ?? "learnhub-demo-secret-change-me";
}

/** Secure comparison of two strings (constant time). */
function safeEqual(a: string, b: string): boolean {
  const ab = encoder.encode(a);
  const bb = encoder.encode(b);
  if (ab.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ab.length; i++) diff |= ab[i] ^ bb[i];
  return diff === 0;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let str = "";
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const b64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "===".slice((b64.length + 3) % 4);
  const str = atob(padded);
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
  return bytes;
}

export async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(input));
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function signHmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getAuthSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(data)
  );
  return bytesToBase64Url(new Uint8Array(signature));
}

/** Check an email + password against the seeded admin credentials. */
export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<boolean> {
  const creds = getAdminCredentials();
  const emailOk =
    email.trim().toLowerCase() === creds.email.trim().toLowerCase();
  const passwordOk =
    (await sha256Hex(password)) === (await sha256Hex(creds.password));
  return emailOk && safeEqual(password, creds.password) && passwordOk;
}

/** Who is signed in — carried inside the (signed) session token. */
export interface SessionIdentity {
  uid?: string;
  name?: string;
  email?: string;
  /** Which area this identity grants access to. */
  role?: "admin" | "student";
}

/** Create a signed, expiring session token, optionally with the admin identity. */
export async function createSessionToken(
  identity?: SessionIdentity
): Promise<string> {
  const payload = bytesToBase64Url(
    encoder.encode(
      JSON.stringify({ exp: Date.now() + SESSION_TTL_MS, ...identity })
    )
  );
  const signature = await signHmac(payload);
  return `${payload}.${signature}`;
}

/** Decode + verify a token, returning the signed-in identity (or null). */
export async function readSessionIdentity(
  token: string | undefined | null
): Promise<SessionIdentity | null> {
  if (!token) return null;
  const idx = token.lastIndexOf(".");
  if (idx < 0) return null;
  const payload = token.slice(0, idx);
  const signature = token.slice(idx + 1);

  const expected = await signHmac(payload);
  if (!safeEqual(signature, expected)) return null;

  try {
    const parsed = JSON.parse(decoder.decode(base64UrlToBytes(payload)));
    if (
      typeof parsed.exp !== "number" ||
      !Number.isFinite(parsed.exp) ||
      Date.now() >= parsed.exp
    ) {
      return null;
    }
    return {
      uid: typeof parsed.uid === "string" ? parsed.uid : undefined,
      name: typeof parsed.name === "string" ? parsed.name : undefined,
      email: typeof parsed.email === "string" ? parsed.email : undefined,
      role: parsed.role === "student" ? "student" : parsed.role === "admin" ? "admin" : undefined,
    };
  } catch {
    return null;
  }
}

/** Verify a session token's signature and expiry (used by middleware + guards). */
export async function verifySessionToken(
  token: string | undefined | null
): Promise<boolean> {
  return readSessionIdentity(token) !== null;
}

/* ----------------------- admin password hashing helpers ----------------------- */

function randomHex(bytes = 16): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return [...arr].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Hash a plaintext password into a salted `salt:hash` string for the admins table. */
export async function hashAdminPassword(password: string): Promise<string> {
  const salt = randomHex();
  const hash = await sha256Hex(`${salt}:${password}`);
  return `${salt}:${hash}`;
}

/** Verify a plaintext password against a stored `salt:hash` string. */
export async function verifyAdminPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const check = await sha256Hex(`${salt}:${password}`);
  return safeEqual(check, hash);
}

/* -------- shared password helpers (students + admins use the same) -------- */

/** Alias used for student accounts. */
export const hashPassword = hashAdminPassword;
/** Alias used for student accounts. */
export const verifyPassword = verifyAdminPassword;