/**
 * Session & credential helpers.
 *
 * Pure functions using the Web Crypto API (no Node-only imports) so they work
 * both in Server Components/Actions and in the Edge/Node middleware.
 */

export const SESSION_COOKIE = "learnhub_admin_session";
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

/** Create a signed, expiring session token. */
export async function createSessionToken(): Promise<string> {
  const payload = bytesToBase64Url(
    encoder.encode(JSON.stringify({ exp: Date.now() + SESSION_TTL_MS }))
  );
  const signature = await signHmac(payload);
  return `${payload}.${signature}`;
}

/** Verify a session token's signature and expiry. */
export async function verifySessionToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false;
  const idx = token.lastIndexOf(".");
  if (idx < 0) return false;
  const payload = token.slice(0, idx);
  const signature = token.slice(idx + 1);

  const expected = await signHmac(payload);
  if (!safeEqual(signature, expected)) return false;

  try {
    const parsed = JSON.parse(decoder.decode(base64UrlToBytes(payload)));
    return (
      typeof parsed.exp === "number" &&
      Number.isFinite(parsed.exp) &&
      Date.now() < parsed.exp
    );
  } catch {
    return false;
  }
}