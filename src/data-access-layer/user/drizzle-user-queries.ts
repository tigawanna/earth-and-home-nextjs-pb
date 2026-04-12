import "server-only";

import { user as userTable } from "@/db/schema/auth-schema";
import { getDb } from "@/lib/db/get-db";
import { mapUserRowToUsersResponse } from "./drizzle-user-mapper";
import { asc, count, desc, like, or } from "drizzle-orm";

export async function getPaginatedUsersFromD1({
  q = "",
  page = 1,
  limit = 50,
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

  const searchWhere = q.trim()
    ? or(like(userTable.name, `%${q}%`), like(userTable.email, `%${q}%`))
    : undefined;

  const sortCol =
    sortBy === "email"
      ? userTable.email
      : sortBy === "name"
        ? userTable.name
        : userTable.createdAt;

  const order = sortOrder === "asc" ? asc(sortCol) : desc(sortCol);

  const [countRow] = await db
    .select({ n: count() })
    .from(userTable)
    .where(searchWhere);

  const totalItems = Number(countRow?.n ?? 0);
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const userRows = await db
    .select()
    .from(userTable)
    .where(searchWhere)
    .orderBy(order)
    .limit(limit)
    .offset(offset);

  const items = userRows.map(mapUserRowToUsersResponse);

  return {
    success: true as const,
    result: {
      items,
      page,
      perPage: limit,
      totalItems,
      totalPages,
    },
  };
}
