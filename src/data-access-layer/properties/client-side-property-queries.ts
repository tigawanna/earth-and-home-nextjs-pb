import { browserPB } from "@/lib/pocketbase/clients/browser-client";
import { queryKeyPrefixes } from "@/lib/tanstack/query/get-query-client";
import { queryOptions } from "@tanstack/react-query";
import { PropertyFilters, PropertySortBy, SortOrder } from "./property-types";

import {
  baseGetPaginatedProperties,
  baseGetPaginatedUsers,
  baseGetPropertyById,
  baseGetSearchableFavorites,
} from "./base-property-queries";



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
      page,
      limit,
      q,
      filters,
      sortBy,
      sortOrder,
    ],
    queryFn: async ({}) => {
      // Merge search term with filters
      const mergedFilters = {
        ...filters,
        search: q || filters.search || "",
      };

      try {
      const result = await baseGetPaginatedProperties({
        client: browserPB,
        filters: mergedFilters,
        page,
        limit,
      });
        // const result = await getPaginatedProperties({
        //   client: browserPB,
        //   filters: mergedFilters,
        //   page,
        //   limit,
        // });

        return {
          success: result.success,
          result: result.success
            ? {
                items: result.properties,
                page: result.pagination.page,
                perPage: result.pagination.limit,
                totalItems: result.pagination.totalCount,
                totalPages: result.pagination.totalPages,
              }
            : null,
          message: result.success ? undefined : result.message,
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
  q?: string;
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
      return await baseGetSearchableFavorites({
        client: browserPB,
        q,
        page,
        limit,
      });
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
      return await baseGetPaginatedUsers({
        client: browserPB,
        page,
        limit,
      });
    },
    placeholderData: (previousData) => previousData,
    meta: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  });
}

interface DashboardPropertyByIdQueryOptionsProps {
  propertyId: string;
  userId?: string;
}

export function dashboardPropertyByIdQueryOptions({
  propertyId,
  userId,
}: DashboardPropertyByIdQueryOptionsProps) {
  return queryOptions({
    queryKey: [queryKeyPrefixes.dashboard, "property", propertyId, userId],
    queryFn: async ({}) => {
      try {
        const { result, success, message } = await baseGetPropertyById({
          client: browserPB,
          propertyId,
        });
        return {
          success,
          property: result,
          message,
        };
      } catch (error) {
        return {
          success: false,
          result: null,
          message: error instanceof Error ? error.message : "Failed to fetch property",
        };
      }
    },
    placeholderData: (previousData) => previousData,
    meta: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  });
}
