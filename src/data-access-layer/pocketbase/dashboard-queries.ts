import { browserPB } from "@/lib/pocketbase/browser-client";
import { queryKeyPrefixes } from "@/lib/tanstack/query/get-query-client";
import { queryOptions } from "@tanstack/react-query";
import { and, eq, gte, like, lte, or } from "@tigawanna/typed-pocketbase";
import { PropertyFilters, PropertySortBy, SortOrder } from "./property-types";

export function userDashboardQueryOptions() {
	return queryOptions({
		queryKey: [queryKeyPrefixes.admin, "stats"] as const,
		queryFn: async ({}) => {
			try {
				const res = await browserPB.collection("users").getFullList(200, {
					sort: "-created",
				});
				return res;
			} catch (error) {
				return [];
			}
		},
		meta: {
			staleTime: 1000 * 60 * 5, // 5 minutes
		},
	});
}

interface DashboardPropertyQueryOptionsProps {
	page?: number;
	limit?: number;
	q?: string;
  filters?: PropertyFilters;
  sortBy?: PropertySortBy;
  sortOrder?: SortOrder;
}
export function dashboardPropertyQueryOptions({
	page = 1,
	limit = 50,
	q = "",
	filters = {},
	sortBy = "created",
	sortOrder = "desc",
}: DashboardPropertyQueryOptionsProps = {}) {
	return queryOptions({
    queryKey: [
      queryKeyPrefixes.dashboard,
      "properties",
       page, limit, q, filters, sortBy, sortOrder ,
    ],
    queryFn: async ({}) => {
      try {
        const collection = browserPB.from("properties");

        // Build filter conditions similar to getProperties
        const conditions: any[] = [];

        const searchTerm = q || filters.search || "";
        if (searchTerm) {
          conditions.push(
            or(
              like("title", `%${searchTerm}%`),
              like("description", `%${searchTerm}%`),
              like("location", `%${searchTerm}%`)
            )
          );
        }

        if (filters.propertyType) {
          conditions.push(eq("property_type", filters.propertyType));
        }

        if (filters.listingType) {
          conditions.push(eq("listing_type", filters.listingType));
        }

        if (filters.status) {
          conditions.push(eq("status", filters.status));
        }

        if (filters.minPrice !== undefined && filters.minPrice !== null) {
          conditions.push(
            or(
              gte("sale_price", filters.minPrice),
              gte("rental_price", filters.minPrice),
              gte("price", filters.minPrice)
            )
          );
        }

        if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
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

        if (typeof filters.isFeatured !== "undefined") {
          conditions.push(eq("is_featured", filters.isFeatured));
        }

        // Create type-safe filter using createFilter helper
        const filter =
          conditions.length > 0 ? collection.createFilter(and(...conditions) as any) : undefined;

        // Create type-safe sort using createSort helper
        const sortPrefix = sortOrder === "desc" ? "-" : "+";
        const sortField = sortBy;
        const sort = collection.createSort(`${sortPrefix}${sortField}`);

        const res = await collection.getList(page, limit, {
          filter,
          sort,
          select: {
            expand: {
              agent_id: true,
            },
          },
        });

        return {
          success: true,
          result: res,
        };
      } catch (error) {
        return {
          success: false,
          result: null,
          message: error instanceof Error ? error.message : "Failed to fetch properties",
        };
      }
    },
    placeholderData: (previousData) => previousData,
    meta: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  });
}


interface DashboardFavoritesQueryOptionsProps {
	q?:string;
	page?: number;
	limit?: number;
}
export function dashboardFavoritesQueryOptions({
	page = 1,
	limit = 50,
	q = "",
}: DashboardFavoritesQueryOptionsProps = {}) {
	return queryOptions({
    queryKey: [queryKeyPrefixes.dashboard, "favorites", { page, limit, q }],
    queryFn: async ({}) => {
      try {
        const res = await browserPB.from("favorites").getList(page, limit, {
          filter: like("property_id.title", `%${q}%`),
          sort: "-created",
          select: {
            expand: {
              property_id: true,
              user_id: true,
            },
          },
        });
        return {
          success: true,
          result: res,
        };
      } catch (error) {
        return {
          success: false,
          result: null,
          message: error instanceof Error ? error.message : "Failed to fetch favorites",
        };
      }
    },
    placeholderData: (previousData) => previousData,
    meta: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  });
}


interface DashboardUsersQueryOptionsProps {
	page?: number;
	limit?: number;
}
export function dashboardUsersQueryOptions({
	page = 1,
	limit = 50,
}: DashboardUsersQueryOptionsProps = {}) {
	return queryOptions({
    queryKey: [queryKeyPrefixes.dashboard, "users", { page, limit }],
    queryFn: async ({}) => {
      try {
        const res = await browserPB.from("users").getList(page, limit, {
          sort: "-created",
        });
        return {
          success: true,
          result: res,
        };
      } catch (error) {
        return {
          success: false,
          result: null,
          message: error instanceof Error ? error.message : "Failed to fetch users",
        };
      }
    },
    placeholderData: (previousData) => previousData,
    meta: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  });
}
