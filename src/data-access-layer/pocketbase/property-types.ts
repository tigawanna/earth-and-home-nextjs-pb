import { PropertiesResponse, UsersResponse } from "@/lib/pocketbase/types/pb-types";

export type PropertyWithFavorites = PropertiesResponse & {
  agent?: Pick<UsersResponse, "id" | "name" | "email" | "avatar"> | null;
  owner?: Pick<UsersResponse, "id" | "name" | "email" | "avatar"> | null;
  is_favorited?: boolean; // Add this for compatibility with new API
  favorite_timestamp?: string | null; // Add this for compatibility with new API
};

export type PropertyFilters = {
  search?: string;
  propertyType?: string;
  property_type?: string; // Add this for compatibility with new API
  listingType?: "sale" | "rent";
  listing_type?: "sale" | "rent"; // Add this for compatibility with new API
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  city?: string;
  agentId?: string;
  ownerId?: string;
  isFeatured?: boolean;
};

export type PropertySortBy = "created" | "updated" | "price" | "title";
export type SortOrder = "asc" | "desc";
