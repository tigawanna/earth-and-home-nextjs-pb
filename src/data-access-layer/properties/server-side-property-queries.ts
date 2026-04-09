import "server-only";

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
  try {
    return await getPaginatedPropertiesFromD1({
      filters,
      sortBy,
      sortOrder,
      page,
      limit,
      agentId,
    });
  } catch (error) {
    console.log("error happende = =>\n", "Error fetching properties:", error);
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
  try {
    const r = await getPropertyByIdFromD1(identifier);
    if (!r.success) {
      return {
        success: false,
        message: r.message,
        property: null,
      };
    }
    return {
      success: true,
      property: r.result,
      message: undefined,
    };
  } catch (error) {
    console.log("error happende = =>\n", "Error fetching property:", error);
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
    console.log("error happende = =>\n", "Error fetching favorite properties:", error);
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
    console.log("error happende = =>\n", "Error fetching searchable favorites:", error);
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
  try {
    return await getFeaturedPropertiesFromD1(limit);
  } catch (error) {
    console.log("Error fetching featured properties:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch featured properties",
      properties: [],
      totalCount: 0,
    };
  }
}
