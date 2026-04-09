import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createAuth } from "@/lib/auth/server";
import { headers } from "next/headers";

export async function getBetterAuthInstance() {
  const { env } = await getCloudflareContext({ async: true });
  return createAuth(env);
}

export async function getBetterAuthSession() {
  const auth = await getBetterAuthInstance();
  const h = await headers();
  return auth.api.getSession({ headers: h });
}
