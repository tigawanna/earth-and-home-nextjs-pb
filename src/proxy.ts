import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getBetterAuthSession } from "@/lib/auth/get-session";
import { mapSessionUserToUsersResponse } from "@/data-access-layer/user/map-session-user";

const adminOnlyPatterns: RegExp[] = [
  /^\/dashboard\/properties\/add$/,
  /^\/dashboard\/users(?:\/.*)?$/,
  /^\/dashboard\/properties\/[^/]+\/edit$/,
];

export async function proxy(request: NextRequest) {
  const pathname = new URL(request.url).pathname;
  const session = await getBetterAuthSession();
  const user = session?.user ? mapSessionUserToUsersResponse(session.user) : null;

  if (!user) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
  if (user.is_banned) {
    return NextResponse.redirect(new URL("/banned", request.url));
  }
  if (adminOnlyPatterns.some((re) => re.test(pathname))) {
    const isAdmin = !!user.is_admin;
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
