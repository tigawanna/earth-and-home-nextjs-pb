import "server-only";

import { user as userTable } from "@/db/schema/auth-schema";
import { getDb } from "@/lib/db/get-db";
import { getBetterAuthSession } from "@/lib/auth/get-session";
import { getPaginatedUsersFromD1 } from "../properties/drizzle-property-queries";
import { eq } from "drizzle-orm";

export async function getServerSideUsers({
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
} = {}) {
  try {
    return await getPaginatedUsersFromD1({ q, page, limit, sortBy, sortOrder });
  } catch (error) {
    console.log("error happende = =>\n", "Error fetching users:", error);
    return {
      success: false,
      result: null,
      message: error instanceof Error ? error.message : "Failed to fetch users",
    };
  }
}

export async function updateUserStatus({
  userId,
  updates,
}: {
  userId: string;
  updates: {
    is_banned?: boolean;
    is_admin?: boolean;
    verified?: boolean;
  };
}) {
  try {
    const session = await getBetterAuthSession();
    if (session?.user?.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    const db = await getDb();
    const patch: Partial<typeof userTable.$inferInsert> = {};
    if (updates.is_banned !== undefined) {
      patch.banned = updates.is_banned;
    }
    if (updates.is_admin !== undefined) {
      patch.role = updates.is_admin ? "admin" : "user";
    }
    if (updates.verified !== undefined) {
      patch.emailVerified = updates.verified;
    }

    await db.update(userTable).set(patch).where(eq(userTable.id, userId));

    return {
      success: true,
      message: "User status updated successfully",
    };
  } catch (error) {
    console.log("error happende = =>\n", "Error updating user status:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update user status",
    };
  }
}

export async function deleteUser(userId: string) {
  try {
    const session = await getBetterAuthSession();
    if (session?.user?.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    if (session.user.id === userId) {
      throw new Error("Cannot delete your own account");
    }

    const db = await getDb();
    await db.delete(userTable).where(eq(userTable.id, userId));

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    console.log("error happende = =>\n", "Error deleting user:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete user",
    };
  }
}
