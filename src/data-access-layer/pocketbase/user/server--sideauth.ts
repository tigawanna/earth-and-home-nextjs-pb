import "server-only"

import { createServerClient } from "@/lib/pocketbase/clients/server-client";
import { UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function getServerSideUser(nextCookies?: ReadonlyRequestCookies) {
  const cookieStore = nextCookies || (await cookies());
  const client = createServerClient(cookieStore);
  const { authStore } = client;
  const user = authStore.record as UsersResponse | null;
  return user;
}
