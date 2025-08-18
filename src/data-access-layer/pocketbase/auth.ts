import { browserPB } from "@/lib/pocketbase/browser-client";
import { UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { UsersCreate } from "@/lib/pocketbase/types/pb-zod";
import { queryKeyPrefixes } from "@/lib/tanstack/query/get-query-client";
import { deleteBrowserCookie } from "@/utils/browser-cookie";
import { mutationOptions, queryOptions, useSuspenseQuery } from "@tanstack/react-query";




export function localViewerQueryOptions() {
  return queryOptions({
    queryKey: [queryKeyPrefixes.viewer] as const,
    queryFn: async ({}) => {
      try {
        const res = browserPB.authStore.record as UsersResponse
        return res;
      } catch (error) {
        return {
            record: null,
            error: {
                message: "Failed to refresh user session",
                code: "auth/refresh-failed",
            },
        }
      }
    },
  });
}

export const useLocalViewer = () => {
  return useSuspenseQuery({
    queryKey: [queryKeyPrefixes.viewer] as const,
    queryFn: async () => {
      try {
        const res = browserPB.authStore.record as UsersResponse;
        if (!res) {
          throw new Error("No user is currently authenticated");
        }
        return {
          viewer: res,
          success: true,
        }
        
      } catch (error) {
        return {
          viewer: null,
          success: false,
          error: {
            message: "Failed to fetch local viewer",
            code: "auth/local-viewer-failed",
          },
        };
      }
    },
    meta: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  });
};




export function viewerQueryOptions() {
  return queryOptions({
    queryKey: [queryKeyPrefixes.viewer] as const,
    queryFn: async ({}) => {
      try {
        const res = browserPB.from("users").authRefresh();
        return res;
      } catch (error) {
        return {
            record: null,
            error: {
                message: "Failed to refresh user session",
                code: "auth/refresh-failed",
            },
        }
      }
    },
  });
}

export function signoutMutationOptions() {
  return mutationOptions({
    mutationFn: async () => {
      await browserPB.authStore.clear();
      deleteBrowserCookie("pb_auth");
      return true;
    },
    meta: {
      invalidates: [[queryKeyPrefixes.viewer]],
    },
  });
}

export function signinMutationOptions() {
  return mutationOptions({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await browserPB.from("users").authWithPassword(data.email, data.password);
      return res;
    },
    meta: {
      invalidates: [[queryKeyPrefixes.viewer]],
    },
  });
}

export function signupMutationOptions() {
  return mutationOptions({
    mutationFn: async (data: UsersCreate) => {
      const res = await browserPB.from("users").create(data);
      return res;
    },
    meta: {
      invalidates: [[queryKeyPrefixes.viewer]],
    },
  });
}
