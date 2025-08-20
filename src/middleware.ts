import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from './lib/pocketbase/server-client';

// Protect app routes by redirecting unauthenticated users to /auth
export async function middleware(request: NextRequest) {
  const redirectPath = '/auth/signin';

  const cookieStore = await cookies();

  const client = createServerClient(cookieStore);
  const { authStore } = client;

  if (!authStore.isValid) {
    const url = new URL(redirectPath, request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
