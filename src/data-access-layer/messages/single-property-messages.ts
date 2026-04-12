import type { PropertyMessagesCreate, PropertyMessagesResponse } from "@/types/domain-types";
import { queryOptions } from "@tanstack/react-query";
import {
  fetchMessageReplies,
  createPropertyMessage as createPropertyMessageAction,
} from "../actions/message-actions";

export function singlePropertyMessagesQueryOptions(parentId: string) {
  return queryOptions({
    queryKey: ["property_messages", parentId],
    queryFn: async () => {
      const result = await fetchMessageReplies(parentId);
      if (!result.success) return [];
      return result.data;
    },
  });
}

export async function createMessageViaAction(
  data: PropertyMessagesCreate,
): Promise<PropertyMessagesResponse | null> {
  const result = await createPropertyMessageAction(data);
  if (!result.success) return null;
  return result.data;
}
