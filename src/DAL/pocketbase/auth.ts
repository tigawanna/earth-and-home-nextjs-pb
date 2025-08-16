import { browserPB, createBrowserClient } from "@/lib/pocketbase/browser-client";
import { UsersCreate } from "@/lib/pocketbase/types/pb-zod";
import { queryKeyPrefixes } from "@/lib/tanstack/query/get-query-client";
import { deleteBrowserCookie } from "@/utils/browser-cookie";
import { mutationOptions, queryOptions } from "@tanstack/react-query";



export function viewerQueryOptions() {
  return queryOptions({
    queryKey: [queryKeyPrefixes.viewer] as const,
    queryFn: async ({}) => {
      try {
        const client = createBrowserClient();
        const res = client.from("users").authRefresh();
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
      const client = createBrowserClient();
      await client.authStore.clear();
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
      const client = createBrowserClient();
      const res = await client.from("users").authWithPassword(data.email, data.password);
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
      const client = createBrowserClient();
      const res = await client.from("users").create(data);
      return res;
    },
    meta: {
      invalidates: [[queryKeyPrefixes.viewer]],
    },
  });
}
