import type {
  AgentsResponse,
  FavoritesResponse,
  PropertiesResponse,
  UsersResponse,
} from "@/types/domain-types";

export type FavoriteWithExpand = FavoritesResponse & {
  expand?: {
    property_id?: PropertiesResponse;
    user_id?: UsersResponse;
  };
};

export type PropertyWithFavorites = PropertiesResponse & {
  expand?:
    | {
        agent_id?: AgentsResponse & {
          expand?:
            | {
                user_id?: UsersResponse | undefined;
              }
            | undefined;
        };
        favorites_via_property_id?: FavoritesResponse[] | undefined;
      }
    | undefined;
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
] as const;
export type PropertySortBy = (typeof allowedSortFields)[number];
export type SortOrder = "asc" | "desc";
