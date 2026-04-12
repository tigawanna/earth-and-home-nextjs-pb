import "server-only";

import { getBetterAuthSession } from "@/lib/auth/get-session";
import {
  countPropertyMessagesFromD1,
  getPropertyStatsFromD1,
  getRecentActivitiesFromD1,
} from "../properties/drizzle-property-queries";
import { getPaginatedUsersFromD1 } from "../user/drizzle-user-queries";

export async function getAdminDashboardStats() {
  try {
    const usersResult = await getPaginatedUsersFromD1({ limit: 50, page: 1 });

    const propertiesResult = await getPropertyStatsFromD1();

    const parentMessagesResult = await countPropertyMessagesFromD1("parent");
    const allMessagesResult = await countPropertyMessagesFromD1("all");

    const propertyStats = {
      total: propertiesResult.result?.recent?.totalItems || 0,
      active: propertiesResult.result?.active || 0,
      sold: propertiesResult.result?.sold || 0,
      rented: propertiesResult.result?.rented || 0,
      draft: propertiesResult.result?.draft || 0,
      featured: propertiesResult.result?.featured || 0,
    };

    const userStats = {
      total: usersResult?.result?.totalItems || 0,
    };

    const messagesStats = {
      total: allMessagesResult || 0,
      parentMessages: parentMessagesResult || 0,
      unrepliedMessages: parentMessagesResult || 0,
    };

    const recentProperties = propertiesResult.result?.recent?.items || [];

    const recentUsers = usersResult?.result?.items;

    return {
      success: true,
      data: {
        propertyStats,
        userStats,
        messagesStats,
        recentProperties,
        recentUsers,
        totalRevenue: 0,
        monthlyGrowth: 0,
      },
    };
  } catch (error) {
    console.log("error happende = =>\n", "Error fetching dashboard stats:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch dashboard stats",
      data: null,
    };
  }
}

export async function getQuickActionsData() {
  try {
    const session = await getBetterAuthSession();
    const u = session?.user;
    const isAdmin = u?.role === "admin";

    return {
      success: true,
      data: {
        isAdmin,
        userId: u?.id ?? null,
      },
    };
  } catch (error) {
    console.log("error happende = =>\n", "Error fetching quick actions data:", error);
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

export async function getRecentActivities() {
  try {
    return await getRecentActivitiesFromD1();
  } catch (error) {
    console.log("error happende = =>\n", "Error fetching recent activities:", error);
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
