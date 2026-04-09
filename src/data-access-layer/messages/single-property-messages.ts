import type { PropertyMessagesCreate, PropertyMessagesResponse } from "@/types/domain-types";
import { queryClient } from "@/lib/tanstack/query/get-query-client";
import { queryOptions } from "@tanstack/react-query";

export function singlePropertyMessagesQueryOptions(parentId: string) {
  return queryOptions({
    queryKey: ["property_messages", parentId],
    queryFn: async () => {
      const res = await fetch(`/api/messages?parentId=${encodeURIComponent(parentId)}`);
      const json = (await res.json()) as { success: boolean; result: PropertyMessagesResponse[] };
      if (!json.success) return [];
      return json.result;
    },
  });
}

export async function createMessageViaApi(
  data: PropertyMessagesCreate,
): Promise<PropertyMessagesResponse | null> {
  const res = await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = (await res.json()) as { success: boolean; result: PropertyMessagesResponse | null };
  if (!json.success) return null;
  return json.result;
}

export function invalidateMessages(parentId: string) {
  queryClient?.invalidateQueries({ queryKey: ["property_messages", parentId] });
}
