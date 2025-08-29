import type { Schema } from "@/lib/pocketbase/types/pb-types";
import {
  FavoritesResponse,
  PropertiesResponse,
  UsersResponse,
} from "@/lib/pocketbase/types/pb-types";
import type { TypedPocketBase } from "@tigawanna/typed-pocketbase";
import { and, eq, FilterParam, gte, like, lte, or, TypedRecord } from "@tigawanna/typed-pocketbase";
import {
  PropertyFilters,
  PropertySortBy,
  PropertyWithFavorites,
  SortOrder,
} from "./property-types";

// ====================================================
// GET PROPERTIES (with filtering, sorting, pagination)
// ====================================================

export async function baseGetPaginatedProperties({
  client,
  filters = {},
  sortBy = "created",
  sortOrder = "desc",
  page = 1,
  limit = 20,
  userId,
  agentId,
}: {
  client: TypedPocketBase<Schema>;
  filters?: PropertyFilters;
  sortBy?: PropertySortBy;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
  userId?: string; // For checking favorites
  agentId?: string; // For filtering by agent
}) {
  type PropertyStatus = PropertiesResponse["status"];
  type PropertyType = PropertiesResponse["property_type"];

  type PropertyRelations = {
    agent_id: UsersResponse;
    owner_id: UsersResponse;
    favorites_via_property_id: FavoritesResponse;
  };

  type PropertyRecord = TypedRecord<PropertiesResponse, PropertyRelations>;

  try {
    // const client = createServerClient();
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
    if (agentId) {
      conditions.push(eq("agent_id", agentId));
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
      // Now using unified price field
      conditions.push(gte("price", filters.minPrice));
    }

    if (filters.maxPrice) {
      // Now using unified price field
      conditions.push(lte("price", filters.maxPrice));
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
    const sortField = sortBy;
    const sort = propertiesCollection.createSort(`${sortPrefix}${sortField}`);

    // Get properties with pagination using type-safe helpers
    const propertiesResult = await propertiesCollection.getList(page, limit, {
      filter,
      sort,
      select: {
        expand: {
          favorites_via_property_id: true,
          agent_id: true,
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

interface GetPropertyParams {
  client: TypedPocketBase<Schema>;
  propertyId: string;
  userId?: string;
}

interface GetPropertyResult {
  success: boolean;
  result: PropertyWithFavorites | null;
  message?: string;
}

/**
 * Shared property fetching logic that works with both server and browser PocketBase clients
 * @param client - PocketBase client (server or browser)
 * @param params - Property query parameters
 * @returns Property data with agent info and favorite status
 */
export async function baseGetPropertyById({
  client,
  propertyId,
  userId,
}: GetPropertyParams): Promise<GetPropertyResult> {
  try {
    const collection = client.from("properties");

    // Create type-safe filter using createFilter helper
    const filter = collection.createFilter(eq("id", propertyId));

    // Get property with agent info
    const property = await collection.getFirstListItem(filter, {
      select: {
        // title: true,
        expand: {
          favorites_via_property_id: true,
          agent_id: true,
        },
      },
    });

    if (!property) {
      return {
        success: false,
        message: "Property not found",
        result: null,
      };
    }


    return {
      success: true,
      result: property,
    };
  } catch (error) {
    console.error("Error fetching property:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch property",
      result: null,
    };
  }
}

/**
 * Server-side property fetching using the server PocketBase client
 * @param params - Property query parameters
 * @param cookieStore - Next.js cookie store for authentication
 * @returns Property data with agent info and favorite status
 */

export async function baseGetFavoriteProperties({
  client,
  userId,
  page = 1,
  limit = 20,
}: {
  client: TypedPocketBase<Schema>;
  userId?: string;
  page?: number;
  limit?: number;
}) {
  try {
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
              agent_id: true,
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

export async function baseGetPaginatedUsers({
  client,
  page = 1,
  limit = 50,
}: {
  client: TypedPocketBase<Schema>;
  page?: number;
  limit?: number;
}) {
  try {
    const usersCollection = client.from("users");
    const sort = usersCollection.createSort("-created");

    const usersResult = await usersCollection.getList(page, limit, {
      sort,
    });

    return {
      success: true,
      result: usersResult,
    };
  } catch (error) {
    console.error("Error fetching paginated users:", error);
    return {
      success: false,
      result: null,
      message: error instanceof Error ? error.message : "Failed to fetch users",
    };
  }
}

// ====================================================
// GET FAVORITES WITH SEARCH (for dashboard)
// ====================================================

export async function baseGetSearchableFavorites({
  client,
  q = "",
  page = 1,
  limit = 50,
}: {
  client: TypedPocketBase<Schema>;
  q?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const favoritesCollection = client.from("favorites");

    // Create type-safe filter and sort
    const filter = q
      ? favoritesCollection.createFilter(like("property_id.title", `%${q}%`))
      : undefined;
    const sort = favoritesCollection.createSort("-created");

    const favoritesResult = await favoritesCollection.getList(page, limit, {
      filter,
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
      result: favoritesResult,
    };
  } catch (error) {
    console.error("Error fetching searchable favorites:", error);
    return {
      success: false,
      result: null,
      message: error instanceof Error ? error.message : "Failed to fetch favorites",
    };
  }
}

// const propertyStats = {
//   total: propertiesResult.pagination.totalCount,
//   active: properties.filter((p: PropertiesResponse) => p.status === "active").length,
//   sold: properties.filter((p: PropertiesResponse) => p.status === "sold").length,
//   rented: properties.filter((p: PropertiesResponse) => p.status === "rented").length,
//   draft: properties.filter((p: PropertiesResponse) => p.status === "draft").length,
//   featured: properties.filter((p: PropertiesResponse) => p.is_featured).length,
// };

export async function baseGetPropertyStats({
  client,
  page = 1,
  limit = 50,
}: {
  client: TypedPocketBase<Schema>;
  page?: number;
  limit?: number;
}) {
  try {
    client.autoCancellation(false)
    const propertiesCollection = client.from("properties");

    const totalPropertiesResult = await propertiesCollection.getList(1, 50, {
      sort: "-created",
    });
    const activePropertiesResult = await propertiesCollection.getList(1, 1, {
      filter: eq("status", "active"),
    });
    const soldPropertiesResult = await propertiesCollection.getList(1, 1, {
      filter: eq("status", "sold"),
    });
    const rentedPropertiesResult = await propertiesCollection.getList(1, 1, {
      filter: eq("status", "rented"),
    });
    const draftPropertiesResult = await propertiesCollection.getList(1, 1, {
      filter: eq("status", "draft"),
    });
    const featuredPropertiesResult = await propertiesCollection.getList(1, 1, {
      filter: eq("is_featured", true),
    });

    const result = {
      recent: totalPropertiesResult,
      total: totalPropertiesResult.totalItems,
      active: activePropertiesResult.totalItems,
      sold: soldPropertiesResult.totalItems,
      rented: rentedPropertiesResult.totalItems,
      draft: draftPropertiesResult.totalItems,
      featured: featuredPropertiesResult.totalItems,
    };

    return {
      success: true,
      result,
    };
  } catch (error) {
    console.error("Error fetching property stats:", error);
    return {
      success: false,
      result: null,
      message: error instanceof Error ? error.message : "Failed to fetch properties",
    };
  }
}
