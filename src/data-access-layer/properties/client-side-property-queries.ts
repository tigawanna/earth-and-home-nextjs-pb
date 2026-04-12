import { queryKeyPrefixes } from "@/lib/tanstack/query/get-query-client";
import { queryOptions } from "@tanstack/react-query";
import type { PropertiesResponse } from "@/types/domain-types";
import {
  fetchPaginatedProperties,
  fetchPropertyById,
  fetchSearchableFavorites,
} from "../actions/property-actions";
import { fetchPaginatedUsers } from "../actions/user-actions";
import type { PropertyFilters, PropertySortBy, PropertyWithFavorites, SortOrder } from "./property-types";

type PaginatedResult<T> = {
  success: boolean;
  result: {
    items: T[];
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  } | null;
  message?: string;
};

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
    queryFn: async (): Promise<PaginatedResult<PropertiesResponse>> => {
      const result = await fetchPaginatedProperties({ page, limit, q, filters, sortBy, sortOrder });
      if (!result.success) {
        return { success: false, result: null, message: result.message };
      }
      return { success: true, result: result.data };
    },
    placeholderData: (previousData) => previousData,
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
    queryFn: async () => {
      const result = await fetchSearchableFavorites({ q, page, limit });
      if (!result.success) {
        return { success: false, result: null, message: result.message };
      }
      return { success: true, result: result.data };
    },
    placeholderData: (previousData) => previousData,
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
    queryFn: async () => {
      const result = await fetchPaginatedUsers({ page, limit });
      if (!result.success) {
        return { success: false, result: null, message: result.message };
      }
      return { success: true, result: result.data };
    },
    placeholderData: (previousData) => previousData,
  });
}

interface DashboardPropertyByIdQueryOptionsProps {
  propertyId: string;
}

export function dashboardPropertyByIdQueryOptions({
  propertyId,
}: DashboardPropertyByIdQueryOptionsProps) {
  return queryOptions({
    queryKey: [queryKeyPrefixes.dashboard, "property", propertyId],
    queryFn: async (): Promise<{
      success: boolean;
      property: PropertyWithFavorites | null;
      message?: string;
    }> => {
      const result = await fetchPropertyById(propertyId);
      if (!result.success) {
        return { success: false, property: null, message: result.message };
      }
      return { success: true, property: result.data };
    },
    placeholderData: (previousData) => previousData,
  });
}
