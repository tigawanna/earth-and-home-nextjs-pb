"use server";

import { user as userTable } from "@/db/schema/auth-schema";
import { getBetterAuthSession } from "@/lib/auth/get-session";
import { getDb } from "@/lib/db/get-db";
import { getPaginatedUsersFromD1 } from "../user/drizzle-user-queries";
import { eq } from "drizzle-orm";

type ActionResult<T = unknown> = { success: true; data: T } | { success: false; message: string };

export async function fetchPaginatedUsers(params: {
  page?: number;
  limit?: number;
  q?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<
  ActionResult<{
    items: unknown[];
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  }>
> {
  try {
    const { page = 1, limit = 50, q = "", sortBy = "created", sortOrder = "desc" } = params;
    const result = await getPaginatedUsersFromD1({ q, page, limit, sortBy, sortOrder });
    return {
      success: true,
      data: {
        items: result.result.items,
        page: result.result.page,
        perPage: result.result.perPage,
        totalItems: result.result.totalItems,
        totalPages: result.result.totalPages,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch users",
    };
  }
}

export async function toggleBanUser(params: {
  userId: string;
  isBanned: boolean;
}): Promise<ActionResult<{ message: string }>> {
  const session = await getBetterAuthSession();
  if (session?.user?.role !== "admin") {
    return { success: false, message: "Unauthorized: Admin access required" };
  }

  const db = await getDb();
  await db
    .update(userTable)
    .set({ banned: !params.isBanned })
    .where(eq(userTable.id, params.userId));

  return { success: true, data: { message: "User status updated successfully" } };
}

export async function toggleAdminUser(params: {
  userId: string;
  isAdmin: boolean;
}): Promise<ActionResult<{ message: string }>> {
  const session = await getBetterAuthSession();
  if (session?.user?.role !== "admin") {
    return { success: false, message: "Unauthorized: Admin access required" };
  }

  const db = await getDb();
  await db
    .update(userTable)
    .set({ role: params.isAdmin ? "user" : "admin" })
    .where(eq(userTable.id, params.userId));

  return { success: true, data: { message: "User status updated successfully" } };
}

export async function deleteUserAction(userId: string): Promise<ActionResult<{ message: string }>> {
  const session = await getBetterAuthSession();
  if (session?.user?.role !== "admin") {
    return { success: false, message: "Unauthorized: Admin access required" };
  }

  if (session.user.id === userId) {
    return { success: false, message: "Cannot delete your own account" };
  }

  const db = await getDb();
  await db.delete(userTable).where(eq(userTable.id, userId));

  return { success: true, data: { message: "User deleted successfully" } };
}
