import { browserPB } from "@/lib/pocketbase/browser-client";
import { queryKeyPrefixes } from "@/lib/tanstack/query/get-query-client";
import { queryOptions } from "@tanstack/react-query";
import { success } from "zod";

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
}
export function dashboardPropertyQueryOptions({
  page = 1,
  limit = 50,
}: DashboardPropertyQueryOptionsProps = {}) {
  return queryOptions({
    queryKey: [queryKeyPrefixes.dashboard, "properties", { page, limit }],
    queryFn: async ({}) => {
      try {
        const res = await browserPB.from("properties").getList(page, limit, {
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
          message: error instanceof Error ? error.message : "Failed to fetch properties",
        };
      }
    },
    meta: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  });
}


interface DashboardFavoritesQueryOptionsProps {
  page?: number;
  limit?: number;
}
export function dashboardFavoritesQueryOptions({
  page = 1,
  limit = 50,
}: DashboardFavoritesQueryOptionsProps = {}) {
  return queryOptions({
    queryKey: [queryKeyPrefixes.dashboard, "favorites", { page, limit }],
    queryFn: async ({}) => {
      try {
        const res = await browserPB.from("favorites").getList(page, limit, {
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
          message: error instanceof Error ? error.message : "Failed to fetch favorites",
        };
      }
    },
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
    meta: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  });
}
