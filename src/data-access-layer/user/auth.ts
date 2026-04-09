import { authClient } from "@/lib/auth/client";
import { queryKeyPrefixes } from "@/lib/tanstack/query/get-query-client";
import { mutationOptions, queryOptions, useQuery } from "@tanstack/react-query";

export function localViewerQueryOptions() {
  return queryOptions({
    queryKey: [queryKeyPrefixes.viewer] as const,
    queryFn: async () => {
      const session = await authClient.getSession();
      if (!session.data?.user) {
        return null;
      }
      return session.data.user;
    },
  });
}

export const useLocalViewer = () => {
  return useQuery({
    queryKey: [queryKeyPrefixes.viewer] as const,
    queryFn: async () => {
      try {
        const session = await authClient.getSession();
        if (!session.data?.user) {
          throw new Error("No user is currently authenticated");
        }
        return {
          viewer: session.data.user,
          success: true,
        };
      } catch {
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
      staleTime: 1000 * 60 * 5,
    },
  });
};

export function viewerQueryOptions() {
  return queryOptions({
    queryKey: [queryKeyPrefixes.viewer] as const,
    queryFn: async () => {
      const session = await authClient.getSession();
      return session.data ?? null;
    },
  });
}

export function signoutMutationOptions() {
  return mutationOptions({
    mutationFn: async () => {
      await authClient.signOut();
      return true;
    },
    meta: {
      invalidates: [[queryKeyPrefixes.viewer]],
    },
  });
}
