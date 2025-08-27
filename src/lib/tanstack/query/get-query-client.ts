import {
  defaultShouldDehydrateQuery,
  isServer,
  MutationCache,
  QueryClient,
} from "@tanstack/react-query";
import { cache } from "react";

export const queryKeyPrefixes = {
  viewer: "viewer",
  auth: "auth",
  properties: "properties",
  property: "property",
  favorites: "favorites",
  dashboard: "dashboard",
  favorite: "favorite",
  property_messages: "property_messages",
  users: "users",
  user: "user",
  admin: "admin",
  search: "search",
  bookmarks: "bookmarks",
} as const;

export type QueryKey = [
  (typeof queryKeyPrefixes)[keyof typeof queryKeyPrefixes],
  ...(readonly unknown[])
];

interface MyMeta extends Record<string, unknown> {
  invalidates?: [QueryKey[0], ...(readonly unknown[])][];
  [key: string]: unknown;
}

declare module "@tanstack/react-query" {
  interface Register {
    queryKey: QueryKey;
    mutationKey: QueryKey;
    queryMeta: MyMeta;
    mutationMeta: MyMeta;
  }
}

const __DEV__ = process.env.NODE_ENV !== "production";
export const TSQ_CACHE_TIME = __DEV__ ? 1000 : 1000 * 60 * 60 * 72; // 1 sec in dev, 72 hours in production

function makeQueryClient() {
  // local variable that will be assigned the QueryClient instance below.
  // closures (mutationCache.onSuccess) will capture this variable.
  let qc!: QueryClient;

  const mutationCache = new MutationCache({
    onSuccess: async (_, __, ___, mutation) => {
      const invalidates = mutation.meta?.invalidates;
      if (Array.isArray(invalidates)) {
        // Keep intentionally simple and synchronous; invalidations will schedule refetches
        invalidates.forEach((queryKey) => {
          // qc should be assigned by the time a mutation runs
          if (qc) qc.invalidateQueries({ queryKey });
        });
      }
    },
  });

  qc = new QueryClient({
    mutationCache,
    defaultOptions: {
      queries: {
        // With SSR, set a small staleTime to avoid refetching immediately
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        gcTime: TSQ_CACHE_TIME,
      },
      // Include pending queries when dehydrating so streaming works well
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
        shouldRedactErrors: () => {
          // Let Next.js handle server error redaction/digests
          return false;
        },
      },
    },
  });

  return qc;
}

// Server: cache() ensures we don't leak QueryClient between requests
export const getQueryClientForServer = cache(() => makeQueryClient());

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    return getQueryClientForServer();
  }

  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

// Export a default browser singleton for convenience (matches many codebases' expectations)
export const queryClient = ((): QueryClient | undefined => {
  try {
    if (typeof window === "undefined") return getQueryClientForServer();
    return getQueryClient();
  } catch {
    return undefined;
  }
})();
