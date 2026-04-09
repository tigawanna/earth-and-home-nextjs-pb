import "server-only";

import { agents } from "@/db/schema/app-schema";
import { getDb } from "@/lib/db/get-db";
import { getBetterAuthSession } from "@/lib/auth/get-session";
import { mapAgentRowToAgentsResponse } from "@/data-access-layer/agents/drizzle-agent-mapper";
import { mapSessionUserToUsersResponse } from "@/data-access-layer/user/map-session-user";
import type { UsersResponse } from "@/types/domain-types";
import { eq } from "drizzle-orm";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function getServerSideUser(
  _nextCookies?: ReadonlyRequestCookies,
): Promise<UsersResponse | null> {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return null;
  }
  return mapSessionUserToUsersResponse(session.user);
}

export async function getServerSideUserwithAgent(_nextCookies?: ReadonlyRequestCookies) {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return { user: null as UsersResponse | null, agent: null };
  }
  const user = mapSessionUserToUsersResponse(session.user);
  const db = await getDb();
  const [agentRow] = await db.select().from(agents).where(eq(agents.userId, user.id)).limit(1);
  const agent = agentRow ? mapAgentRowToAgentsResponse(agentRow) : null;
  return { user, agent };
}
