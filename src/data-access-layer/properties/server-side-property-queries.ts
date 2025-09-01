import "server-only";

import { createServerClient } from "@/lib/pocketbase/clients/server-client";
import {
  baseGetFavoriteProperties,
  baseGetFeaturedProperties,
  baseGetPaginatedProperties,
  baseGetPropertyById,
  baseGetSearchableFavorites,
} from "./base-property-queries";
import { PropertyFilters, PropertySortBy, SortOrder } from "./property-types";



// ====================================================
// GET PROPERTIES (with filtering, sorting, pagination)
// ====================================================

export async function getProperties({
  filters = {},
  sortBy = "created",
  sortOrder = "desc",
  page = 1,
  limit = 20,
  userId,
  agentId
}: {
  filters?: PropertyFilters;
  sortBy?: PropertySortBy;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
  userId?: string; // For checking favorites
  agentId?: string; // For filtering by agent
} = {}) {
  try {
    const client = await createServerClient();
    
    const result = await baseGetPaginatedProperties({
      client,
      filters,
      sortBy,
      sortOrder,
      page,
      limit,
      userId,
      agentId
    });
    
    return result;
  } catch (error) {
    console.log("error happende = =>\n","Error fetching properties:", error);
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

// ====================================================
// GET SINGLE PROPERTY
// ====================================================

export async function getServerSidePropertyById(identifier: string, userId?: string) {
  try {
    const client = await createServerClient();

    const {result,success,message} = await baseGetPropertyById({
      client,
      propertyId: identifier,
    });

    return {
      success,
      property: result,
      message,
    };
  } catch (error) {
    console.log("error happende = =>\n","Error fetching property:", error);
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
    const client = await createServerClient();
    return await baseGetFavoriteProperties({ client, userId, page, limit });
  } catch (error) {
    console.log("error happende = =>\n","Error fetching favorite properties:", error);
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

// ====================================================
// GET SEARCHABLE FAVORITES (for dashboard)
// ====================================================

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
    const client = await createServerClient();
    return await baseGetSearchableFavorites({ client, q, page, limit });
  } catch (error) {
    console.log("error happende = =>\n","Error fetching searchable favorites:", error);
    return {
      success: false,
      result: null,
      message: error instanceof Error ? error.message : "Failed to fetch searchable favorites",
    };
  }
}

// ====================================================
// GET FEATURED PROPERTIES (server-side wrapper)
// ====================================================

export async function getServerSideFeaturedProperties({
  limit = 12,
}: {
  limit?: number;
} = {}) {
  try {
    const client = await createServerClient();
    return await baseGetFeaturedProperties({ client, limit });
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



