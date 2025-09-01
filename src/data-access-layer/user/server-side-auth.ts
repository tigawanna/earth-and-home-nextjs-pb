import "server-only";

import { createServerClient } from "@/lib/pocketbase/clients/server-client";
import { UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { eq } from "@tigawanna/typed-pocketbase";

export async function getServerSideUser(nextCookies?: ReadonlyRequestCookies) {
  const cookieStore = nextCookies || (await cookies());
  const client = await createServerClient(cookieStore);
  const { authStore } = client;
  const user = authStore.record as UsersResponse | null;
  return user;
}

export async function getServerSideUserwithAgent(nextCookies?: ReadonlyRequestCookies) {
  const cookieStore = nextCookies || (await cookies());
  const client = await createServerClient(cookieStore);
  const { authStore } = client;
  const user = authStore.record as UsersResponse | null;
  const agent = user?.id
    ? await client
        .from("agents")
        .getFirstListItem(eq("user_id",user?.id))
        .then((res) => res)
        .catch(() => null)
    : null;
  return { user, agent, client };
}
