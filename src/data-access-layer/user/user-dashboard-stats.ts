import "server-only";

import { createServerClient } from "@/lib/pocketbase/clients/server-client";
import type { PropertiesResponse } from "@/lib/pocketbase/types/pb-types";

export interface UserDashboardStats {
  totalFavorites: number;
  recentFavorites: {
    id: string;
    property: PropertiesResponse[];
    created: string;
  }[];
}

export async function getUserDashboardStats(userId: string) {
  if (!userId) {
    return {
      totalFavorites: 0,
      recentFavorites: [],
    };
  }

  try {
    const client = await createServerClient();

    // Get total favorites count
    const totalFavoritesResult = await client.from("favorites").getList(1, 1, {
      filter: `user_id = "${userId}"`,
    });

    // Get recent favorites with property details (limit to 5 most recent)
    const recentFavoritesResult = await client.from("favorites").getList(1, 5, {
      filter: `user_id = "${userId}"`,
      sort: "-created",
      select: {
        expand: {
          property_id: true,
        },
      },
    });

    const recentFavorites = recentFavoritesResult.items
      .map((favorite) => {
        const property = favorite.expand?.property_id;
        if (!property) return null;

        return {
          id: favorite.id,
          property,
          created: favorite.created,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    return {
      totalFavorites: totalFavoritesResult.totalItems,
      recentFavorites,
    };
  } catch (error) {
    console.error("Error fetching user dashboard stats:", error);
    return {
      totalFavorites: 0,
      recentFavorites: [],
    };
  }
}

export async function getUserFavoriteProperties(userId: string, page = 1, limit = 10) {
  if (!userId) {
    return {
      items: [],
      totalItems: 0,
      totalPages: 0,
      page: 1,
    };
  }

  try {
    const client = await createServerClient();

    const result = await client.from("favorites").getList(page, limit, {
      filter: `user_id = "${userId}"`,
      sort: "-created",
      select: {
        expand: {
          property_id: true,
        },
      },
    });

    const items = result.items
      .map((favorite) => {
        const property = favorite.expand?.property_id;
        if (!property) return null;

        return {
          id: favorite.id,
          property,
          created: favorite.created,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    return {
      items,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      page: result.page,
    };
  } catch (error) {
    console.error("Error fetching user favorite properties:", error);
    return {
      items: [],
      totalItems: 0,
      totalPages: 0,
      page: 1,
    };
  }
}
