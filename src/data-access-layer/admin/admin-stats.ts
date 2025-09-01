import "server-only";

import { createServerClient } from "@/lib/pocketbase/clients/server-client";
import {
    baseGetPaginatedProperties,
    baseGetPaginatedUsers,
    baseGetPropertyStats,
} from "../properties/base-property-queries";

// ====================================================
// DASHBOARD STATS & OVERVIEW DATA
// ====================================================

export async function getAdminDashboardStats() {
  try {
    const client = await createServerClient();

    // Get all users
    const usersResult = await baseGetPaginatedUsers({ client, limit: 50 });

    // Get favorites count (commented out to reduce clutter)
    // const favoritesCollection = client.from("favorites");
    // const favoritesResult = await favoritesCollection.getList(1, 1);

    // Get all properties for stats calculation
    const propertiesResult = await baseGetPropertyStats({ client });

    // Get messages stats
    const messagesCollection = client.from("property_messages");
    
    // Get total parent messages (messages with type="parent" and no replies)
    const parentMessagesResult = await messagesCollection.getList(1, 1, {
      filter: 'type = "parent"',
    });

    // Get all messages count
    const allMessagesResult = await messagesCollection.getList(1, 1);

    // Calculate property stats
    const propertyStats = {
      total: propertiesResult.result?.recent?.totalItems || 0,
      active: propertiesResult.result?.active || 0,
      sold: propertiesResult.result?.sold || 0,
      rented: propertiesResult.result?.rented || 0,
      draft: propertiesResult.result?.draft || 0,
      featured: propertiesResult.result?.featured || 0,
    };

    // Calculate user stats
    const userStats = {
      total: usersResult?.result?.totalItems || 0,
    };

    // Calculate favorites stats (commented out to reduce clutter)
    // const favoritesStats = {
    //   total: favoritesResult.totalItems || 0,
    // };

    // Calculate messages stats
    const messagesStats = {
      total: allMessagesResult.totalItems || 0,
      parentMessages: parentMessagesResult.totalItems || 0, // Messages with no replies
      unrepliedMessages: parentMessagesResult.totalItems || 0, // Same as parent messages in this context
    };

    // Get recent activities (last 10 properties and users)
    const recentProperties = propertiesResult.result?.recent?.items || [];

    const recentUsers = usersResult?.result?.items;

    return {
      success: true,
      data: {
        propertyStats,
        userStats,
        // favoritesStats, // commented out to reduce clutter
        messagesStats,
        recentProperties,
        recentUsers,
        totalRevenue: 0, // TODO: Calculate from actual revenue data
        monthlyGrowth: 0, // TODO: Calculate from historical data
      },
    };
  } catch (error) {
    console.log("error happende = =>\n","Error fetching dashboard stats:", error);
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
    console.log("error happende = =>\n","Error fetching quick actions data:", error);
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

    // Get recent messages (last 10)
    const messagesCollection = client.from("property_messages");
    const messagesSort = messagesCollection.createSort("-created");
    const messagesResult = await messagesCollection.getList(1, 10, {
      sort: messagesSort,
      select: {
        expand: {
          property_id: true,
          user_id: true,
          parent: true,
        },
      },
    });

    return {
      success: true,
      data: {
        recentProperties: propertiesResult.properties || [],
        recentFavorites: favoritesResult.items || [],
        recentMessages: messagesResult.items || [],
      },
    };
  } catch (error) {
    console.log("error happende = =>\n","Error fetching recent activities:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch recent activities",
      data: {
        recentProperties: [],
        recentFavorites: [],
        recentMessages: [],
      },
    };
  }
}
