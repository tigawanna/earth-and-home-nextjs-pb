import "server-only";

import { mapAgentRowToAgentsResponse } from "@/data-access-layer/agents/drizzle-agent-mapper";
import { mapUserRowToUsersResponse } from "@/data-access-layer/user/drizzle-user-mapper";
import { agents } from "@/db/schema/app-schema";
import { user as userTable } from "@/db/schema/auth-schema";
import { getDb } from "@/lib/db/get-db";
import type { AgentsResponse, UsersResponse } from "@/types/domain-types";
import { desc, eq } from "drizzle-orm";

export type PendingAgentRow = {
  agent: AgentsResponse;
  user: UsersResponse;
};

export async function getPendingAgentApplications(): Promise<PendingAgentRow[]> {
  const db = await getDb();
  const rows = await db
    .select({ a: agents, u: userTable })
    .from(agents)
    .innerJoin(userTable, eq(agents.userId, userTable.id))
    .where(eq(agents.approvalStatus, "pending"))
    .orderBy(desc(agents.createdAt));

  return rows.map((row) => ({
    agent: mapAgentRowToAgentsResponse(row.a),
    user: mapUserRowToUsersResponse(row.u),
  }));
}
