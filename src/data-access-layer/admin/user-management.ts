import "server-only";

import { createServerClient } from "@/lib/pocketbase/clients/server-client";
import { UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { Sort } from "@tigawanna/typed-pocketbase";
import { baseGetPaginatedUsers } from "../properties/base-property-queries";
// ====================================================
// GET USERS WITH SEARCH AND PAGINATION
// ====================================================

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
    const client = await createServerClient();

    // If there's a search query, use a custom query
    if (q) {
      const usersCollection = client.from("users");
      const filter = usersCollection.createFilter(`name ~ "${q}" || email ~ "${q}"`);

      const sort = usersCollection
        .createSort
        (
            `${sortOrder === "desc" ? "-" : "+"}${sortBy}` as Sort<UsersResponse>

        );

      const result = await usersCollection.getList(page, limit, {
        filter,
        sort,
      });

      return {
        success: true,
        result,
      };
    }

    // Use the base function for standard pagination
    return await baseGetPaginatedUsers({ client, page, limit });
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      result: null,
      message: error instanceof Error ? error.message : "Failed to fetch users",
    };
  }
}

// ====================================================
// USER MANAGEMENT ACTIONS
// ====================================================

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
    const client = await createServerClient();
    
    // Check if current user is admin
    const currentUser = client.authStore.record;
    if (!currentUser?.is_admin) {
      throw new Error("Unauthorized: Admin access required");
    }
    
    const usersCollection = client.from("users");
    await usersCollection.update(userId, updates);
    
    return {
      success: true,
      message: "User status updated successfully",
    };
  } catch (error) {
    console.error("Error updating user status:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update user status",
    };
  }
}

export async function deleteUser(userId: string) {
  try {
    const client = await createServerClient();
    
    // Check if current user is admin
    const currentUser = client.authStore.record;
    if (!currentUser?.is_admin) {
      throw new Error("Unauthorized: Admin access required");
    }
    
    // Prevent admin from deleting themselves
    if (currentUser.id === userId) {
      throw new Error("Cannot delete your own account");
    }
    
    const usersCollection = client.from("users");
    await usersCollection.delete(userId);
    
    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete user",
    };
  }
}
