import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  STUDENT_SESSION_COOKIE,
  createSessionToken,
  readSessionIdentity,
  verifySessionToken,
  type SessionIdentity,
} from "./session";

const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/** Set the admin session cookie, optionally recording who is signed in. */
export async function setAdminSession(
  identity?: SessionIdentity
): Promise<void> {
  const token = await createSessionToken(identity);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

/** Clear the admin session cookie. */
export async function clearAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** The signed-in admin's identity (name + email + uid), or null when anonymous. */
export async function getSessionUser(): Promise<SessionIdentity | null> {
  const store = await cookies();
  return readSessionIdentity(store.get(SESSION_COOKIE)?.value);
}

/** Whether the current request has a valid admin session. */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/* ------------------------------ student sessions ----------------------------- */

/** Set the student session cookie, recording who is signed in. */
export async function setStudentSession(
  identity?: SessionIdentity
): Promise<void> {
  const token = await createSessionToken({ ...identity, role: "student" });
  const store = await cookies();
  store.set(STUDENT_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

/** Clear the student session cookie. */
export async function clearStudentSession(): Promise<void> {
  const store = await cookies();
  store.delete(STUDENT_SESSION_COOKIE);
}

/** The signed-in student's identity, or null when anonymous. */
export async function getStudentSessionUser(): Promise<SessionIdentity | null> {
  const store = await cookies();
  return readSessionIdentity(store.get(STUDENT_SESSION_COOKIE)?.value);
}

/** Whether the current request has a valid student session. */
export async function isStudent(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(STUDENT_SESSION_COOKIE)?.value);
}