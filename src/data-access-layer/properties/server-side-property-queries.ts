import "server-only";

import { initR2Base } from "@/data-access-layer/media/image-url";
import { unstable_cache } from "next/cache";
import {
  getFavoritePropertiesFromD1,
  getPaginatedPropertiesFromD1,
  getPropertyByIdFromD1,
  getSearchableFavoritesFromD1,
} from "./drizzle-property-queries";
import { getFeaturedPropertiesFromD1 } from "./drizzle-featured-queries";
import { PropertyFilters, PropertySortBy, SortOrder } from "./property-types";

export async function getProperties({
  filters = {},
  sortBy = "created",
  sortOrder = "desc",
  page = 1,
  limit = 20,
  userId: _userId,
  agentId,
}: {
  filters?: PropertyFilters;
  sortBy?: PropertySortBy;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
  userId?: string;
  agentId?: string;
} = {}) {
  await initR2Base();
  try {
    const cached = unstable_cache(
      async () =>
        getPaginatedPropertiesFromD1({
          filters,
          sortBy,
          sortOrder,
          page,
          limit,
          agentId,
        }),
      ["properties-list", JSON.stringify({ filters, sortBy, sortOrder, page, limit, agentId })],
      { tags: ["properties-list"], revalidate: 60 },
    );
    return await cached();
  } catch (error) {
    console.error("Error fetching properties:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch properties",
      properties: [],
      pagination: {
        page: 1,
        limit,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}

export async function getServerSidePropertyById(identifier: string, _userId?: string) {
  await initR2Base();
  try {
    const cached = unstable_cache(
      async () => getPropertyByIdFromD1(identifier),
      ["property", identifier],
      { tags: ["properties-list", identifier], revalidate: 60 },
    );
    const r = await cached();
    if (!r.success) {
      return { success: false, message: r.message, property: null };
    }
    return { success: true, property: r.result, message: undefined };
  } catch (error) {
    console.error("Error fetching property:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch property",
      property: null,
    };
  }
}

export async function getServerSideFavoriteProperties({
  userId,
  page = 1,
  limit = 20,
}: {
  userId?: string;
  page?: number;
  limit?: number;
}) {
  try {
    if (!userId) {
      return {
        success: false,
        message: "User id required",
        properties: [],
        pagination: {
          page: 1,
          limit,
          totalCount: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }
    return await getFavoritePropertiesFromD1({ userId, page, limit });
  } catch (error) {
    console.error("Error fetching favorite properties:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch favorites",
      properties: [],
      pagination: {
        page: 1,
        limit,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}

export async function getServerSideSearchableFavorites({
  q = "",
  page = 1,
  limit = 50,
}: {
  q?: string;
  page?: number;
  limit?: number;
}) {
  try {
    return await getSearchableFavoritesFromD1({ q, page, limit });
  } catch (error) {
    console.error("Error fetching searchable favorites:", error);
    return {
      success: false,
      result: null,
      message: error instanceof Error ? error.message : "Failed to fetch searchable favorites",
    };
  }
}

export async function getServerSideFeaturedProperties({
  limit = 12,
}: {
  limit?: number;
} = {}) {
  await initR2Base();
  try {
    const cached = unstable_cache(
      async () => getFeaturedPropertiesFromD1(limit),
      ["featured-properties", String(limit)],
      { tags: ["properties-list"], revalidate: 60 },
    );
    return await cached();
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch featured properties",
      properties: [],
      totalCount: 0,
    };
  }
}
