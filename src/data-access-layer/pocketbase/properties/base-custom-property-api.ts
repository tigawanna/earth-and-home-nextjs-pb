/**
 * Property API methods using custom PocketBase routes with joins
 * This file provides a clean interface to access property data with agent, owner, and favorite information
 */

import { PropertyFilters, PropertyWithFavorites } from "../property-types";




export interface PaginationInfo {
  page: number; // Current page number
  limit: number; // Items per page
  totalCount: number; // Total number of items
  totalPages: number; // Total number of pages
  hasNextPage: boolean; // Whether there's a next page
  hasPrevPage: boolean; // Whether there's a previous page
}


export interface PocketBaseClient {
  send(path: string, options?: any): Promise<any>;
  authStore: {
    isValid: boolean;
    record?: { id: string; [key: string]: any } | null;
  };
}

export interface PropertiesResponse {
  success: boolean;
  properties: PropertyWithFavorites[];
  pagination: PaginationInfo;
  message?: string;
}

export interface PropertyResponse {
  success: boolean;
  property: PropertyWithFavorites | null;
  message?: string;
}

// ====================================================
// GET PROPERTIES (with filtering, sorting, pagination)
// ====================================================

export interface GetPaginatedPropertiesParams {
  client: PocketBaseClient;
  filters?: PropertyFilters;
  page?: number;
  limit?: number;
}

/**
 * Get paginated properties with agent, owner, and favorite information
 */
export async function getPaginatedProperties({
  client,
  filters = {},
  page = 1,
  limit = 20,
}: GetPaginatedPropertiesParams): Promise<PropertiesResponse> {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: Math.min(limit, 100).toString(),
    });

    // Add filter parameters
    if (filters.search) queryParams.set("search", filters.search);
    if (filters.status) queryParams.set("status", filters.status);
    if (filters.propertyType) queryParams.set("property_type", filters.propertyType);
    if (filters.listingType) queryParams.set("listing_type", filters.listingType);
    if (filters.minPrice) queryParams.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice) queryParams.set("maxPrice", filters.maxPrice.toString());
    if (filters.beds) queryParams.set("beds", filters.beds.toString());
    if (filters.baths) queryParams.set("baths", filters.baths.toString());
    if (filters.city) queryParams.set("city", filters.city);
    if (filters.agentId) queryParams.set("agentId", filters.agentId);
    if (filters.ownerId) queryParams.set("ownerId", filters.ownerId);
    // sort params
    if (filters.sortBy) queryParams.set("sortBy", filters.sortBy);
    if (filters.sortOrder) queryParams.set("sortOrder", filters.sortOrder);
    if (filters.isFeatured !== undefined)
      queryParams.set("isFeatured", filters.isFeatured.toString());


    // Make request to custom route
    const response = await client.send(`/api/properties-with-fav?${queryParams.toString()}`);

    return {
      success: true,
      properties: response.items,
      pagination: {
        page: response.page,
        limit: response.limit,
        totalCount: response.totalCount,
        totalPages: response.totalPages,
        hasNextPage: page < response.totalPages,
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

export interface GetPropertyByIdParams {
  client: PocketBaseClient;
  propertyId: string;
}

/**
 * Get a single property by ID with agent, owner, and favorite information
 */
export async function getPropertyById({
  client,
  propertyId,
}: GetPropertyByIdParams): Promise<PropertyResponse> {
  try {
    if (!propertyId) {
      return {
        success: false,
        message: "Property ID is required",
        property: null,
      };
    }

    // Make request to custom route
    const property = await client.send(`/api/properties-with-fav/${propertyId}`);
    return {
      success: true,
      property,
    };
  } catch (error: any) {
    console.error("Error fetching property:", error);

    // Handle 404 specifically
    if (error.status === 404) {
      return {
        success: false,
        message: "Property not found",
        property: null,
      };
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch property",
      property: null,
    };
  }
}

// ====================================================
// USAGE EXAMPLES
// ====================================================

/*
// Example 1: Get paginated properties with filters
const { success, properties, pagination } = await getPaginatedProperties({
  client: pb,
  filters: {
    status: "active",
    listing_type: "sale",
    search: "luxury",
    property_type: "house",
  },
  page: 1,
  limit: 20,
});

// Example 2: Get single property
const { success, property } = await getPropertyById({
  client: pb,
  propertyId: "abc123",
});

// Example 3: Get properties for sale
const { properties } = await getPropertiesForSale({
  client: pb,
  page: 1,
  limit: 10,
});

// Example 4: Search properties
const { properties } = await searchProperties({
  client: pb,
  searchTerm: "downtown apartment",
  page: 1,
  limit: 15,
});

// Example 5: Get featured properties
const { properties } = await getFeaturedProperties({
  client: pb,
  limit: 5,
});
*/
