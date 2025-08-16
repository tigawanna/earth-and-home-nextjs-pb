import { cache } from "react";
import {
  QueryClient,
  isServer,
  defaultShouldDehydrateQuery,
} from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, set a small staleTime to avoid refetching immediately
        staleTime: 60 * 1000,
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
