import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createAuth } from "@/lib/auth/server";

async function handleAuth(request: Request) {
  const { env } = await getCloudflareContext({ async: true });
  const auth = createAuth(env);
  return auth.handler(request);
}

export const GET = handleAuth;
export const POST = handleAuth;
export const PATCH = handleAuth;
export const PUT = handleAuth;
export const DELETE = handleAuth;
