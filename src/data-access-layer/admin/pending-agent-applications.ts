import "server-only";

import { mapAgentRowToAgentsResponse } from "@/data-access-layer/agents/drizzle-agent-mapper";
import { mapUserRowToUsersResponse } from "@/data-access-layer/user/drizzle-user-mapper";
import { agents } from "@/db/schema/app-schema";
import { user as userTable } from "@/db/schema/auth-schema";
import { getDb } from "@/lib/db/get-db";
import type { AgentsResponse, UsersResponse } from "@/types/domain-types";
import { and, asc, count, desc, eq, like, or } from "drizzle-orm";

export type PendingAgentsSortOrder = "asc" | "desc";

export type PendingAgentRow = {
  agent: AgentsResponse;
  user: UsersResponse;
};

export type PendingAgentsPageResult = {
  items: PendingAgentRow[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

function pendingWhere(q: string) {
  const base = eq(agents.approvalStatus, "pending");
  const term = q.trim();
  if (!term) {
    return base;
  }
  const pattern = `%${term}%`;
  return and(
    base,
    or(
      like(agents.agencyName, pattern),
      like(agents.licenseNumber, pattern),
      like(agents.specialization, pattern),
      like(agents.serviceAreas, pattern),
      like(userTable.name, pattern),
      like(userTable.email, pattern),
    ),
  );
}

export async function getPendingAgentApplicationsPaginated({
  q = "",
  page = 1,
  limit = 10,
  sortOrder = "desc",
}: {
  q?: string;
  page?: number;
  limit?: number;
  sortOrder?: PendingAgentsSortOrder;
}): Promise<PendingAgentsPageResult> {
  const db = await getDb();
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(50, Math.max(1, limit));
  const offset = (safePage - 1) * safeLimit;
  const whereClause = pendingWhere(q);
  const createdOrder =
    sortOrder === "asc" ? asc(agents.createdAt) : desc(agents.createdAt);

  const countBase = db
    .select({ n: count() })
    .from(agents)
    .innerJoin(userTable, eq(agents.userId, userTable.id))
    .where(whereClause);

  const [countRow] = await countBase;
  const totalItems = Number(countRow?.n ?? 0);
  const totalPages = Math.max(1, Math.ceil(totalItems / safeLimit));

  const rows = await db
    .select({ a: agents, u: userTable })
    .from(agents)
    .innerJoin(userTable, eq(agents.userId, userTable.id))
    .where(whereClause)
    .orderBy(createdOrder)
    .limit(safeLimit)
    .offset(offset);

  const items = rows.map((row) => ({
    agent: mapAgentRowToAgentsResponse(row.a),
    user: mapUserRowToUsersResponse(row.u),
  }));

  return {
    items,
    page: safePage,
    limit: safeLimit,
    totalItems,
    totalPages,
  };
}
