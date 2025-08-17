import "server-only";

import { createServerClient } from "@/lib/pocketbase/server-client";
import {
  and,
  eq,
  gte,
  like,
  lte,
  or,
  FilterParam,
  TypedRecord,
} from "@tigawanna/typed-pocketbase";
import { PropertyFilters, PropertySortBy, PropertyWithAgent, SortOrder } from "./property-types";
import {
  PropertiesCollection,
  PropertiesResponse,
  UsersResponse,
} from "@/lib/pocketbase/types/pb-types";
import { FavoritesResponse } from "@/lib/pocketbase/types/pb-zod";

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
  type PropertyStatus = PropertiesResponse["status"];
  type PropertyType = PropertiesResponse["property_type"];

  type PropertyRelations = {
    agent_id: UsersResponse;
    owner_id: UsersResponse;
    favorites_via_property_id: FavoritesResponse;
  };

  type PropertyRecord = TypedRecord<PropertiesResponse, PropertyRelations>;

  try {
    const client = createServerClient();
    const propertiesCollection = client.from("properties");

    // Build filter conditions using createFilter helper
    const conditions: FilterParam<PropertyRecord>[] = [];

    if (filters.search) {
      conditions.push(
        or(
          like("title", `%${filters.search}%`),
          like("description", `%${filters.search}%`),
          like("location", `%${filters.search}%`)
        )
      );
    }

    if (filters.propertyType) {
      conditions.push(eq("property_type", filters.propertyType as PropertyType));
    }

    if (filters.listingType) {
      conditions.push(eq("listing_type", filters.listingType));
    }

    if (filters.status) {
      conditions.push(eq("status", filters.status as PropertyStatus));
    }

    if (filters.minPrice) {
      // PocketBase doesn't have COALESCE, so we'll use OR conditions
      conditions.push(
        or(
          gte("sale_price", filters.minPrice),
          gte("rental_price", filters.minPrice),
          gte("price", filters.minPrice)
        )
      );
    }

    if (filters.maxPrice) {
      conditions.push(
        or(
          lte("sale_price", filters.maxPrice),
          lte("rental_price", filters.maxPrice),
          lte("price", filters.maxPrice)
        )
      );
    }

    if (filters.beds) {
      conditions.push(gte("beds", filters.beds));
    }

    if (filters.baths) {
      conditions.push(gte("baths", filters.baths));
    }

    if (filters.city) {
      conditions.push(like("city", `%${filters.city}%`));
    }

    if (filters.agentId) {
      conditions.push(eq("agent_id", filters.agentId));
    }

    if (filters.ownerId) {
      conditions.push(eq("owner_id", filters.ownerId));
    }

    if (filters.isFeatured !== undefined) {
      conditions.push(eq("is_featured", filters.isFeatured));
    }

    // Create type-safe filter using createFilter helper
    const filter =
      conditions.length > 0
        ? propertiesCollection.createFilter(and(...conditions) as any)
        : undefined;

    // Create type-safe sort using createSort helper
    const sortPrefix = sortOrder === "desc" ? "-" : "+";
    const sortField = sortBy === "created" ? "created" : sortBy === "updated" ? "updated" : sortBy;
    const sort = propertiesCollection.createSort(`${sortPrefix}${sortField}`);

    // Get properties with pagination using type-safe helpers
    const propertiesResult = await propertiesCollection.getList(page, limit, {
      filter,
      sort,
      select: {
        expand: {
          agent_id: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return {
      success: true,
      properties: propertiesResult.items,
      pagination: {
        page: propertiesResult.page,
        limit: propertiesResult.perPage,
        totalCount: propertiesResult.totalItems,
        totalPages: propertiesResult.totalPages,
        hasNextPage: page < propertiesResult.totalPages,
        hasPrevPage: page > 1,
      },
    };
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

export async function getProperty(identifier: string, userId?: string) {
  try {
    const client = createServerClient();
    const propertiesCollection = client.from("properties");

    // Create type-safe filter using createFilter helper
    const filter = propertiesCollection.createFilter(eq("id", identifier));

    // Get property with agent info
    const property = await propertiesCollection.getFirstListItem(filter, {
      select: {
        expand: {
          agent_id: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    if (!property) {
      return { success: false, message: "Property not found" };
    }

    // Check if property is favorited by user
    let isFavorited = false;
    if (userId) {
      try {
        const favoritesCollection = client.from("favorites");
        const favoriteFilter = favoritesCollection.createFilter(
          and(eq("property_id", property.id), eq("user_id", userId))
        );

        const favoriteCheck = await favoritesCollection.getFirstListItem(favoriteFilter, {});
        isFavorited = !!favoriteCheck;
      } catch (error) {
        // Favorite not found, isFavorited remains false
        isFavorited = false;
      }
    }

    return {
      success: true,
      property: {
        ...property,
        agent: property.expand?.agent_id || null,
        isFavorited,
      } as PropertyWithAgent,
    };
  } catch (error) {
    console.error("Error fetching property:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch property",
    };
  }
}

export async function getFavoriteProperties({
  userId,
  page = 1,
  limit = 20,
}: {
  userId?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const client = createServerClient();

    if (!userId) {
      // Get user from PocketBase auth
      const authData = client.authStore;
      if (!authData.isValid || !authData.record?.id) {
        throw new Error("Unauthorized");
      }
      userId = authData.record.id;
    }

    const favoritesCollection = client.from("favorites");

    // Create type-safe filter using createFilter helper
    const filter = favoritesCollection.createFilter(eq("user_id", userId));

    // Create type-safe sort using createSort helper
    const sort = favoritesCollection.createSort("-created");

    // Get favorites with property and agent info
    const favoritesResult = await favoritesCollection.getList(page, limit, {
      filter,
      sort,
      select: {
        expand: {
          property_id: {
            expand: {
              agent_id: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      properties: favoritesResult.items,
      pagination: {
        page: favoritesResult.page,
        limit: favoritesResult.perPage,
        totalCount: favoritesResult.totalItems,
        totalPages: favoritesResult.totalPages,
        hasNextPage: page < favoritesResult.totalPages,
        hasPrevPage: page > 1,
      },
    };
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
