import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  STUDENT_SESSION_COOKIE,
  verifySessionToken,
} from "@/lib/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin area: only the sign-in page is public.
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!(await verifySessionToken(token))) {
      const loginUrl = new URL("/admin/login", request.url);
      if (pathname !== "/admin") loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Student area: only the sign-in page is public.
  if (pathname.startsWith("/student") && pathname !== "/student/login") {
    const token = request.cookies.get(STUDENT_SESSION_COOKIE)?.value;
    if (!(await verifySessionToken(token))) {
      return NextResponse.redirect(new URL("/student/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*"],
};