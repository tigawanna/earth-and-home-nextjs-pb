import { queryKeyPrefixes } from "@/lib/tanstack/query/get-query-client";
import { queryOptions } from "@tanstack/react-query";
import type { PropertiesResponse } from "@/lib/pocketbase/types/pb-types";
import { PropertyFilters, PropertySortBy, SortOrder } from "./property-types";

type DashboardPropertiesApiSuccess = {
  success: true;
  properties: PropertiesResponse[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
};

type DashboardPropertiesApiFail = {
  success: false;
  message?: string;
};

type DashboardFavoritesApiSuccess = {
  success: true;
  result: {
    items: unknown[];
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
};

type DashboardUsersApiSuccess = {
  success: true;
  result: {
    items: unknown[];
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
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
    queryFn: async () => {
      const mergedFilters = {
        ...filters,
        search: q || filters.search || "",
      };
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sortBy,
        sortOrder,
        filters: JSON.stringify(mergedFilters),
      });
      const res = await fetch(`/api/dashboard/properties?${params.toString()}`);
      if (!res.ok) {
        return {
          success: false,
          result: null,
          message: `Request failed: ${res.status}`,
        };
      }
      const result = (await res.json()) as DashboardPropertiesApiSuccess | DashboardPropertiesApiFail;
      if (!result.success) {
        return {
          success: false,
          result: null,
          message: result.message,
        };
      }
      return {
        success: true,
        result: {
          items: result.properties,
          page: result.pagination.page,
          perPage: result.pagination.limit,
          totalItems: result.pagination.totalCount,
          totalPages: result.pagination.totalPages,
        },
        message: undefined,
      };
    },
    placeholderData: (previousData) => previousData,
    meta: {
      staleTime: 1000 * 60 * 5,
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
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        q,
      });
      const res = await fetch(`/api/dashboard/favorites?${params.toString()}`);
      if (!res.ok) {
        return {
          success: false,
          result: null,
          message: `Request failed: ${res.status}`,
        };
      }
      return (await res.json()) as DashboardFavoritesApiSuccess | { success: false; result: null; message?: string };
    },
    placeholderData: (previousData) => previousData,
    meta: {
      staleTime: 1000 * 60 * 5,
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
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      const res = await fetch(`/api/dashboard/users?${params.toString()}`);
      if (!res.ok) {
        return {
          success: false,
          result: null,
          message: `Request failed: ${res.status}`,
        };
      }
      return (await res.json()) as DashboardUsersApiSuccess | { success: false; result: null; message?: string };
    },
    placeholderData: (previousData) => previousData,
    meta: {
      staleTime: 1000 * 60 * 5,
    },
  });
}

interface DashboardPropertyByIdQueryOptionsProps {
  propertyId: string;
  userId?: string;
}

export function dashboardPropertyByIdQueryOptions({
  propertyId,
  userId: _userId,
}: DashboardPropertyByIdQueryOptionsProps) {
  return queryOptions({
    queryKey: [queryKeyPrefixes.dashboard, "property", propertyId],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/property/${encodeURIComponent(propertyId)}`);
      if (!res.ok) {
        return {
          success: false,
          property: null,
          message: `Request failed: ${res.status}`,
        };
      }
      const data = (await res.json()) as {
        success: boolean;
        result?: unknown;
        message?: string;
      };
      if (data.success && data.result) {
        return {
          success: true,
          property: data.result,
          message: undefined,
        };
      }
      return {
        success: false,
        property: null,
        message: data.message ?? "Failed to fetch property",
      };
    },
    placeholderData: (previousData) => previousData,
    meta: {
      staleTime: 1000 * 60 * 5,
    },
  });
}
