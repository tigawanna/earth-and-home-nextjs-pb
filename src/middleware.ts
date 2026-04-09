import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const adminOnlyPatterns: RegExp[] = [
  /^\/dashboard\/properties\/add$/,
  /^\/dashboard\/users(?:\/.*)?$/,
  /^\/dashboard\/properties\/[^/]+\/edit$/,
];

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  const pathname = request.nextUrl.pathname;
  if (adminOnlyPatterns.some((re) => re.test(pathname))) {
    const sessionData = request.cookies.get("better-auth.session_data")?.value;
    if (sessionData) {
      try {
        const decoded = JSON.parse(atob(sessionData.split(".")[0]));
        if (decoded?.user?.role !== "admin") {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      } catch {
        /* session data parsing failed, allow through - server will handle authorization */
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
