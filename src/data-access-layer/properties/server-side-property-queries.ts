import "server-only";

import { createServerClient } from "@/lib/pocketbase/clients/server-client";
import {
  baseGetFavoriteProperties,
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
}: {
  filters?: PropertyFilters;
  sortBy?: PropertySortBy;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
  userId?: string; // For checking favorites
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
    });
    
    return result;
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
    const client = await createServerClient();
    return await baseGetFavoriteProperties({ client, userId, page, limit });
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
    console.error("Error fetching searchable favorites:", error);
    return {
      success: false,
      result: null,
      message: error instanceof Error ? error.message : "Failed to fetch searchable favorites",
    };
  }
}






// ====================================================
// UTILITY ACTIONS
// ====================================================
// TODO implement the below as a pocketbase view
// export async function getPropertyStats(agentId?: string) {
//   try {
//     const client = createServerClient();

//     // Build filter condition for agent
//     const filter = agentId ? eq("agent_id", agentId) : undefined;

//     // Get all properties for the agent (or all if no agentId)
//     const propertiesResult = await client.from("properties").getFullList(filter,{

//     });

//     // Calculate stats from the results
//     const stats = {
//       totalProperties: propertiesResult.length,
//       activeProperties: propertiesResult.filter((p) => p.status === "active").length,
//       soldProperties: propertiesResult.filter((p) => p.status === "sold").length,
//       rentedProperties: propertiesResult.filter((p) => p.status === "rented").length,
//       draftProperties: propertiesResult.filter((p) => p.status === "draft").length,
//       featuredProperties: propertiesResult.filter((p) => p.is_featured === true).length,
//     };

//     return {
//       success: true,
//       stats,
//     };
//   } catch (error) {
//     console.error("Error fetching property stats:", error);
//     return {
//       success: false,
//       message: error instanceof Error ? error.message : "Failed to fetch stats",
//     };
//   }
// }
