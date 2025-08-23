/**
 * Property API methods using custom PocketBase routes with joins
 * This file provides a clean interface to access property data with agent, owner, and favorite information
 */

import { PropertyFilters, PropertyWithFavorites } from "../property-types";

// ====================================================
// TYPES AND INTERFACES
// ====================================================

// export type PropertyStatus = "draft" | "active" | "pending" | "sold" | "rented" | "off_market";
// export type PropertyType =
//   | "house"
//   | "apartment"
//   | "condo"
//   | "townhouse"
//   | "duplex"
//   | "studio"
//   | "villa"
//   | "land"
//   | "commercial"
//   | "industrial"
//   | "farm";
// export type ListingType = "sale" | "rent";
// export type ParkingType = "garage" | "carport" | "street" | "covered" | "assigned" | "none";
// export type HeatingType =
//   | "none"
//   | "electric"
//   | "gas"
//   | "oil"
//   | "heat_pump"
//   | "solar"
//   | "geothermal";
// export type CoolingType = "none" | "central" | "wall_unit" | "evaporative" | "geothermal";
// export type ZoningType =
//   | "residential"
//   | "commercial"
//   | "agricultural"
//   | "industrial"
//   | "mixed_use"
//   | "recreational"
//   | "other";

// export interface PropertyFilters {
//   search?: string; // Search in title, description, location
//   status?: PropertyStatus; // Property status
//   property_type?: PropertyType; // Type of property
//   listing_type?: ListingType; // Listing type
//   minPrice?: number; // Minimum price
//   maxPrice?: number; // Maximum price
//   beds?: number; // Minimum number of bedrooms
//   baths?: number; // Minimum number of bathrooms
//   city?: string; // City filter
//   agentId?: string; // Filter by agent ID
//   ownerId?: string; // Filter by owner ID
//   isFeatured?: boolean; // Filter featured properties
// }


// export interface Agent {
//   id: string; // Agent ID
//   name: string; // Agent name
//   email: string; // Agent email
// }

// export interface Owner {
//   id: string; // Owner ID
//   name: string; // Owner name
//   email: string; // Owner email
// }

// export interface PropertyWithRelations {
//   id: string; // Property ID
//   title: string; // Property title
//   description: string; // Property description
//   status: PropertyStatus; // Property status
//   listing_type: ListingType; // Listing type
//   property_type: PropertyType; // Property type
//   location: string; // Location
//   street_address: string; // Street address
//   city: string; // City
//   state: string; // State
//   postal_code: string; // Postal code
//   country: string; // Country
//   dimensions: string; // Dimensions
//   building_size_sqft: number; // Building size in square feet
//   lot_size_sqft: number; // Lot size in square feet
//   lot_size_acres: number; // Lot size in acres
//   year_built: number; // Year built
//   floors: number; // Number of floors
//   beds: number; // Number of bedrooms
//   baths: number; // Number of bathrooms
//   parking_spaces: number; // Number of parking spaces
//   parking_type: ParkingType; // Parking type
//   heating: HeatingType; // Heating type
//   cooling: CoolingType; // Cooling type
//   zoning: ZoningType; // Zoning
//   currency: string; // Currency
//   price: number; // Price
//   sale_price: number; // Sale price
//   rental_price: number; // Rental price
//   security_deposit: number; // Security deposit
//   hoa_fee: number; // HOA fee
//   annual_taxes: number; // Annual taxes
//   available_from: string; // Available from date
//   image_url: string; // Main image URL
//   images: string; // Images (JSON string or file references)
//   video_url: string; // Video URL
//   virtual_tour_url: string; // Virtual tour URL
//   amenities: any; // Amenities (JSON)
//   features: any; // Features (JSON)
//   utilities: any; // Utilities (JSON)
//   is_featured: boolean; // Whether property is featured
//   is_new: boolean; // Whether property is new
//   location_point: any; // Location point (geo coordinates)
//   created: string; // Creation timestamp
//   updated: string; // Update timestamp
//   agent: Agent | null; // Agent information
//   owner: Owner | null; // Owner information
//   is_favorited: boolean; // Whether current user has favorited this property
//   favorite_timestamp: string | null; // When the property was favorited
// }


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
    if (filters.property_type) queryParams.set("property_type", filters.property_type);
    if (filters.listing_type) queryParams.set("listing_type", filters.listing_type);
    if (filters.minPrice) queryParams.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice) queryParams.set("maxPrice", filters.maxPrice.toString());
    if (filters.beds) queryParams.set("beds", filters.beds.toString());
    if (filters.baths) queryParams.set("baths", filters.baths.toString());
    if (filters.city) queryParams.set("city", filters.city);
    if (filters.agentId) queryParams.set("agentId", filters.agentId);
    if (filters.ownerId) queryParams.set("ownerId", filters.ownerId);
    if (filters.isFeatured !== undefined)
      queryParams.set("isFeatured", filters.isFeatured.toString());

    console.log("Fetching properties with authstore :===>> ", client.authStore.record);
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
