import { FavoritesResponse, PropertiesResponse, UsersResponse } from "@/lib/pocketbase/types/pb-types";

export type PropertyWithFavorites = PropertiesResponse & {
  expand?:
    | {
        favorites_via_property_id: FavoritesResponse[] | undefined;
        agent_id?: UsersResponse | undefined;
      }
    | undefined;
  is_favorited?: boolean; // Add this for compatibility with new API
  favorite_timestamp?: string | null; // Add this for compatibility with new API
};

export type PropertyFilters = {
  search?: string;
  propertyType?: string;
  listingType?: "sale" | "rent";
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  city?: string;
  agentId?: string;
  ownerId?: string;
  isFeatured?: boolean;
  sortBy?: PropertySortBy;
  sortOrder?: SortOrder;
};

export const allowedSortFields = [
  "created",
  "updated",
  "title",
  "price",
  "beds",
  "baths",
  "year_built",
  "building_size_sqft",
  "lot_size_sqft",
  "is_featured",
  "city",
  "state",
] as const
export type PropertySortBy = typeof allowedSortFields[number];
export type SortOrder = "asc" | "desc";


export type PropertiesResponseWithExpandedRelations = PropertiesResponse & {
  is_favorited?: boolean | null;
  favorite_timestamp?: string | null;
  expand?:
    | {
        favorites_via_property_id:FavoritesResponse[] | undefined;
        agent_id?: UsersResponse | undefined;
      }
    | undefined;
};
