import type { UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { user as userTable } from "@/db/schema/auth-schema";
import type { InferSelectModel } from "drizzle-orm";

export type UserRow = InferSelectModel<typeof userTable>;

export function mapUserRowToUsersResponse(row: UserRow): UsersResponse {
  const created = row.createdAt ? new Date(row.createdAt).toISOString() : new Date().toISOString();
  const updated = row.updatedAt ? new Date(row.updatedAt).toISOString() : created;

  return {
    collectionName: "users",
    collectionId: "",
    id: row.id,
    username: row.email,
    tokenKey: "",
    email: row.email,
    emailVisibility: true,
    verified: row.emailVerified ?? false,
    name: row.name,
    avatar: row.image ?? "",
    is_admin: row.role === "admin",
    is_banned: row.banned ?? false,
    phone: "",
    is_agent: false,
    created,
    updated,
  };
}
