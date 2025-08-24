import "server-only";

import { createServerClient } from "@/lib/pocketbase/clients/server-client";
import type { PropertiesResponse, UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { baseGetAllUsers, baseGetPaginatedProperties } from "../pocketbase/properties/base-property-queries";

// ====================================================
// DASHBOARD STATS & OVERVIEW DATA
// ====================================================

export async function getDashboardStats() {
  try {
    const client = await createServerClient();
    
    // Get all properties for stats calculation
    const propertiesResult = await baseGetPaginatedProperties({
      client,
      page: 1,
      limit: 1000, // Large limit to get all for stats
    });

    // Get all users
    const usersResult = await baseGetAllUsers({ client });
    
    // Get favorites count
    const favoritesCollection = client.from("favorites");
    const favoritesResult = await favoritesCollection.getList(1, 1000);

    const properties = propertiesResult.properties || [];
    const users = usersResult.users || [];
    const favorites = favoritesResult.items || [];

    // Calculate property stats
    const propertyStats = {
      total: properties.length,
      active: properties.filter((p: PropertiesResponse) => p.status === "active").length,
      sold: properties.filter((p: PropertiesResponse) => p.status === "sold").length,
      rented: properties.filter((p: PropertiesResponse) => p.status === "rented").length,
      draft: properties.filter((p: PropertiesResponse) => p.status === "draft").length,
      featured: properties.filter((p: PropertiesResponse) => p.is_featured).length,
    };

    // Calculate user stats
    const userStats = {
      total: users.length,
      verified: users.filter((u: UsersResponse) => u.verified).length,
      admins: users.filter((u: UsersResponse) => u.is_admin).length,
      banned: users.filter((u: UsersResponse) => u.is_banned).length,
    };

    // Calculate favorites stats
    const favoritesStats = {
      total: favorites.length,
    };

    // Get recent activities (last 10 properties and users)
    const recentProperties = properties
      .sort((a: PropertiesResponse, b: PropertiesResponse) => new Date(b.created).getTime() - new Date(a.created).getTime())
      .slice(0, 5);
      
    const recentUsers = users
      .sort((a: UsersResponse, b: UsersResponse) => new Date(b.created).getTime() - new Date(a.created).getTime())
      .slice(0, 5);

    return {
      success: true,
      data: {
        propertyStats,
        userStats,
        favoritesStats,
        recentProperties,
        recentUsers,
        totalRevenue: 0, // TODO: Calculate from actual revenue data
        monthlyGrowth: 0, // TODO: Calculate from historical data
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch dashboard stats",
      data: null,
    };
  }
}

// ====================================================
// QUICK ACTIONS DATA
// ====================================================

export async function getQuickActionsData() {
  try {
    const client = await createServerClient();
    
    // Get current user to check admin status
    const authData = client.authStore;
    const isAdmin = authData.record?.role === "admin";
    
    return {
      success: true,
      data: {
        isAdmin,
        userId: authData.record?.id,
      },
    };
  } catch (error) {
    console.error("Error fetching quick actions data:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch quick actions data",
      data: {
        isAdmin: false,
        userId: null,
      },
    };
  }
}

// ====================================================
// RECENT ACTIVITIES DATA
// ====================================================

export async function getRecentActivities() {
  try {
    const client = await createServerClient();
    
    // Get recent properties (last 10)
    const propertiesResult = await baseGetPaginatedProperties({
      client,
      sortBy: "created",
      sortOrder: "desc",
      page: 1,
      limit: 10,
    });

    // Get recent favorites
    const favoritesCollection = client.from("favorites");
    const sort = favoritesCollection.createSort("-created");
    const favoritesResult = await favoritesCollection.getList(1, 10, {
      sort,
      select: {
        expand: {
          property_id: true,
          user_id: true,
        },
      },
    });

    return {
      success: true,
      data: {
        recentProperties: propertiesResult.properties || [],
        recentFavorites: favoritesResult.items || [],
      },
    };
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch recent activities",
      data: {
        recentProperties: [],
        recentFavorites: [],
      },
    };
  }
}
