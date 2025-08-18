import { browserPB } from "@/lib/pocketbase/browser-client";
import { queryKeyPrefixes } from "@/lib/tanstack/query/get-query-client";
import { queryOptions } from "@tanstack/react-query";

export function userDashboardQueryOptions() {
  return queryOptions({
    queryKey: [queryKeyPrefixes.admin,"stats"] as const,
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
