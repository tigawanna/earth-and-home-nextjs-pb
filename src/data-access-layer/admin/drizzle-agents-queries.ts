import "server-only";

import { agents } from "@/db/schema/app-schema";
import { user as userTable } from "@/db/schema/auth-schema";
import { getDb } from "@/lib/db/get-db";
import { mapAgentRowToAgentsResponse } from "@/data-access-layer/agents/drizzle-agent-mapper";
import { mapUserRowToUsersResponse } from "@/data-access-layer/user/drizzle-user-mapper";
import { asc, count, desc, eq, like, or } from "drizzle-orm";

export async function drizzleGetServerSideAgents({
  q = "",
  page = 1,
  limit = 20,
  sortBy = "created",
  sortOrder = "desc",
}: {
  q?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  const db = await getDb();
  const offset = (page - 1) * limit;

  const search = q.trim()
    ? or(
        like(agents.agencyName, `%${q}%`),
        like(agents.licenseNumber, `%${q}%`),
        like(agents.specialization, `%${q}%`),
        like(agents.serviceAreas, `%${q}%`),
        like(userTable.name, `%${q}%`),
        like(userTable.email, `%${q}%`),
      )
    : undefined;

  const sortCol =
    sortBy === "agency_name"
      ? agents.agencyName
      : sortBy === "updated"
        ? agents.updatedAt
        : agents.createdAt;

  const order = sortOrder === "asc" ? asc(sortCol) : desc(sortCol);

  const baseFrom = db
    .select({ a: agents, u: userTable })
    .from(agents)
    .innerJoin(userTable, eq(agents.userId, userTable.id));

  const countBase = db
    .select({ n: count() })
    .from(agents)
    .innerJoin(userTable, eq(agents.userId, userTable.id));

  const [countRow] = search ? await countBase.where(search) : await countBase;

  const totalItems = Number(countRow?.n ?? 0);
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const rows = search
    ? await baseFrom.where(search).orderBy(order).limit(limit).offset(offset)
    : await baseFrom.orderBy(order).limit(limit).offset(offset);

  const items = rows.map(({ a, u }) => ({
    ...mapAgentRowToAgentsResponse(a),
    expand: {
      user_id: mapUserRowToUsersResponse(u),
    },
  }));

  return {
    items,
    page,
    perPage: limit,
    totalItems,
    totalPages,
  };
}

export async function drizzleGetSingleAgent(agentId: string) {
  const db = await getDb();
  const [row] = await db
    .select({ a: agents, u: userTable })
    .from(agents)
    .innerJoin(userTable, eq(agents.userId, userTable.id))
    .where(eq(agents.id, agentId))
    .limit(1);

  if (!row) {
    return { success: false as const, result: null, message: "Agent not found" };
  }

  return {
    success: true as const,
    result: {
      ...mapAgentRowToAgentsResponse(row.a),
      expand: {
        user_id: mapUserRowToUsersResponse(row.u),
      },
    },
  };
}
