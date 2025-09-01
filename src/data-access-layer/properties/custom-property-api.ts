// /**
//  * Property API methods using custom PocketBase routes with joins
//  * This file provides a clean interface to access property data with agent, owner, and favorite information
//  */

// // ====================================================
// // TYPES AND INTERFACES
// // ====================================================

// export type PropertyStatus = 'active' | 'draft' | 'pending' | 'sold' | 'rented' | 'off_market';
// export type PropertyType = 'house' | 'apartment' | 'condo' | 'townhouse' | 'villa' | 'land' | 'commercial' | 'other';
// export type ListingType = 'sale' | 'rent';

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

// export interface PaginationInfo {
//   page: number; // Current page number
//   limit: number; // Items per page
//   totalCount: number; // Total number of items
//   totalPages: number; // Total number of pages
//   hasNextPage: boolean; // Whether there's a next page
//   hasPrevPage: boolean; // Whether there's a previous page
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
//   city: string; // City
//   state: string; // State
//   price: number; // Unified price field (replaces sale_price/rental_price)
//   beds: number; // Number of bedrooms
//   baths: number; // Number of bathrooms
//   building_size_sqft: number; // Building size in square feet
//   is_featured: boolean; // Whether property is featured
//   is_new: boolean; // Whether property is new
//   created: string; // Creation timestamp
//   updated: string; // Update timestamp
//   agent: Agent | null; // Agent information
//   owner: Owner | null; // Owner information
//   is_favorited: boolean; // Whether current user has favorited this property
//   favorite_timestamp: string | null; // When the property was favorited
// }

// export interface PocketBaseClient {
//   send(path: string, options?: any): Promise<any>;
// }

// export interface PropertiesResponse {
//   success: boolean;
//   properties: PropertyWithRelations[];
//   pagination: PaginationInfo;
//   message?: string;
// }

// export interface PropertyResponse {
//   success: boolean;
//   property: PropertyWithRelations | null;
//   message?: string;
// }

// // ====================================================
// // GET PROPERTIES (with filtering, sorting, pagination)
// // ====================================================

// export interface GetPaginatedPropertiesParams {
//   client: PocketBaseClient;
//   filters?: PropertyFilters;
//   page?: number;
//   limit?: number;
// }

// /**
//  * Get paginated properties with agent, owner, and favorite information
//  */
// export async function getPaginatedProperties({
//   client,
//   filters = {},
//   page = 1,
//   limit = 20,
// }: GetPaginatedPropertiesParams): Promise<PropertiesResponse> {
//   try {
//     // Build query parameters
//     const queryParams = new URLSearchParams({
//       page: page.toString(),
//       limit: Math.min(limit, 100).toString(),
//     });

//     // Add filter parameters
//     if (filters.search) queryParams.set("search", filters.search);
//     if (filters.status) queryParams.set("status", filters.status);
//     if (filters.property_type) queryParams.set("property_type", filters.property_type);
//     if (filters.listing_type) queryParams.set("listing_type", filters.listing_type);

//     // Make request to custom route
//     const response = await client.send(`/api/properties-with-fav?${queryParams.toString()}`);

//     return {
//       success: true,
//       properties: response.items,
//       pagination: {
//         page: response.page,
//         limit: response.limit,
//         totalCount: response.totalCount,
//         totalPages: response.totalPages,
//         hasNextPage: page < response.totalPages,
//         hasPrevPage: page > 1,
//       },
//     };
//   } catch (error) {
//     console.log("error happende = =>\n","Error fetching properties:", error);
//     return {
//       success: false,
//       message: error instanceof Error ? error.message : "Failed to fetch properties",
//       properties: [],
//       pagination: {
//         page: 1,
//         limit,
//         totalCount: 0,
//         totalPages: 0,
//         hasNextPage: false,
//         hasPrevPage: false,
//       },
//     };
//   }
// }

// // ====================================================
// // GET SINGLE PROPERTY
// // ====================================================

// export interface GetPropertyByIdParams {
//   client: PocketBaseClient;
//   propertyId: string;
// }

// /**
//  * Get a single property by ID with agent, owner, and favorite information
//  */
// export async function getPropertyById({
//   client,
//   propertyId,
// }: GetPropertyByIdParams): Promise<PropertyResponse> {
//   try {
//     if (!propertyId) {
//       return {
//         success: false,
//         message: "Property ID is required",
//         property: null,
//       };
//     }

//     // Make request to custom route
//     const property = await client.send(`/api/properties-with-fav/${propertyId}`);

//     return {
//       success: true,
//       property,
//     };
//   } catch (error: any) {
//     console.log("error happende = =>\n","Error fetching property:", error);
    
//     // Handle 404 specifically
//     if (error.status === 404) {
//       return {
//         success: false,
//         message: "Property not found",
//         property: null,
//       };
//     }

//     return {
//       success: false,
//       message: error instanceof Error ? error.message : "Failed to fetch property",
//       property: null,
//     };
//   }
// }



// // ====================================================
// // USAGE EXAMPLES
// // ====================================================

// /*
// // Example 1: Get paginated properties with filters
// const { success, properties, pagination } = await getPaginatedProperties({
//   client: pb,
//   filters: {
//     status: "active",
//     listing_type: "sale",
//     search: "luxury",
//     property_type: "house",
//   },
//   page: 1,
//   limit: 20,
// });

// // Example 2: Get single property
// const { success, property } = await getPropertyById({
//   client: pb,
//   propertyId: "abc123",
// });

// // Example 3: Get properties for sale
// const { properties } = await getPropertiesForSale({
//   client: pb,
//   page: 1,
//   limit: 10,
// });

// // Example 4: Search properties
// const { properties } = await searchProperties({
//   client: pb,
//   searchTerm: "downtown apartment",
//   page: 1,
//   limit: 15,
// });

// // Example 5: Get featured properties
// const { properties } = await getFeaturedProperties({
//   client: pb,
//   limit: 5,
// });
// */
