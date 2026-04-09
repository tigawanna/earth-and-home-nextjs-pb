import "server-only";

import type { PropertiesResponse } from "@/lib/pocketbase/types/pb-types";
import {
  drizzleGetUserDashboardStats,
  drizzleGetUserFavoriteProperties,
  drizzleGetUserMessages,
} from "./drizzle-user-dashboard";

export interface UserDashboardStats {
  totalFavorites: number;
  recentFavorites: {
    id: string;
    property: PropertiesResponse;
    created: string;
  }[];
}

interface QueryProps {
  userId: string;
  page?: number;
  limit?: number;
}

export async function getUserDashboardStats({ userId }: QueryProps) {
  if (!userId) {
    return {
      totalFavorites: 0,
      recentFavorites: [],
    };
  }

  try {
    const { totalFavorites, recentFavorites } = await drizzleGetUserDashboardStats(userId);
    return {
      totalFavorites,
      recentFavorites: recentFavorites.map((r) => ({
        id: r.id,
        property: r.property,
        created: r.created,
      })),
    };
  } catch (error) {
    console.log("error happende = =>\n", "Error fetching user dashboard stats:", error);
    return {
      totalFavorites: 0,
      recentFavorites: [],
    };
  }
}

export async function getUserFavoriteProperties({ userId, page = 1, limit = 10 }: QueryProps) {
  if (!userId) {
    return {
      items: [],
      totalItems: 0,
      totalPages: 0,
      page: 1,
    };
  }

  try {
    return await drizzleGetUserFavoriteProperties(userId, page, limit);
  } catch (error) {
    console.log("error happende = =>\n", "Error fetching user favorite properties:", error);
    return {
      items: [],
      totalItems: 0,
      totalPages: 0,
      page: 1,
    };
  }
}

export async function getUserMessages({ userId, limit = 50, page = 1 }: QueryProps) {
  if (!userId) {
    return [];
  }

  try {
    return await drizzleGetUserMessages(userId, limit, page);
  } catch (error) {
    console.log("error happende = =>\n", "Error fetching user messages:", error);
    return [];
  }
}
