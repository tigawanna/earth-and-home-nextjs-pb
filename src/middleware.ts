import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createServerClient } from "./lib/pocketbase/server-client";
import { storeCookie } from "./lib/pocketbase/next-cookies";
import { UsersResponse } from "./lib/pocketbase/types/pb-types";

const adminOnlyPatterns: RegExp[] = [
  /^\/dashboard\/properties\/add$/, // add page
  /^\/dashboard\/users(?:\/.*)?$/, // users area
  /^\/dashboard\/properties\/[^\/]+\/edit$/, // /dashboard/properties/:id/edit
];

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const client = createServerClient(cookieStore);
  const pathname = new URL(request.url).pathname;
  try {
    client.authStore.isValid && (await client.from("users").authRefresh());
  } catch (_) {
    // clear the auth store on failed refresh
    console.error("Failed to refresh user session, clearing auth store");
    client.authStore.clear();
  }

  const user = client.authStore.record as UsersResponse;

  if (!user) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
  if (user?.is_banned) {
    console.log("User is banned:", user.id);
    await storeCookie(user.id, {} as any);
    return NextResponse.redirect(new URL("/banned", request.url));
  }
  await storeCookie(user.id, user);
  if (adminOnlyPatterns.some((re) => re.test(pathname))) {
    const isAdmin = !!user?.is_admin;
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
