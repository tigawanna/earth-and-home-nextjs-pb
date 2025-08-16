import { property, user } from "@/lib/drizzle/schema";

export type PropertyWithAgent = typeof property.$inferSelect & {
  agent?: Pick<typeof user.$inferSelect, "id" | "name" | "email" | "image"> | null;
  owner?: Pick<typeof user.$inferSelect, "id" | "name" | "email" | "image"> | null;
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

export type PropertySortBy = "createdAt" | "updatedAt" | "price" | "title";
export type SortOrder = "asc" | "desc";
