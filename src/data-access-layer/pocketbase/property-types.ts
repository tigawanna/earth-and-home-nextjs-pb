import { PropertiesResponse, UsersResponse } from "@/lib/pocketbase/types/pb-types";

export type PropertyWithAgent = PropertiesResponse & {
  agent?: Pick<UsersResponse, "id" | "name" | "email" | "avatar"> | null;
  owner?: Pick<UsersResponse, "id" | "name" | "email" | "avatar"> | null;
  isFavorited?: boolean;
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
};

export type PropertySortBy = "created" | "updated" | "price" | "title";
export type SortOrder = "asc" | "desc";
