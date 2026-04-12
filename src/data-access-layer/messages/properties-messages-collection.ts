import type {
  PropertiesResponse,
  PropertyMessagesResponse,
  UsersResponse,
} from "@/types/domain-types";
import {
  createPropertyMessage as createPropertyMessageAction,
} from "../actions/message-actions";

export type PropertyMessageWithExpansion = PropertyMessagesResponse & {
  expand?: {
    property_id?: PropertiesResponse;
    user_id?: UsersResponse;
  };
};

export type MessageWithProperty = PropertyMessagesResponse & {
  expand?:
    | {
        user_id?: UsersResponse | undefined;
        property_id?: PropertiesResponse | undefined;
      }
    | undefined;
};

export type PropertyMessageSummary = {
  property: PropertiesResponse;
  latestMessage: PropertyMessageWithExpansion;
  messageCount: number;
  lastActivity: string;
};

export async function createPropertyMessage(data: {
  property_id: string;
  user_id: string;
  body: string;
  type?: "parent" | "reply";
}): Promise<PropertyMessagesResponse | null> {
  const result = await createPropertyMessageAction({
    property_id: data.property_id,
    user_id: data.user_id,
    body: data.body,
    type: data.type || "parent",
  });
  if (!result.success) return null;
  return result.data;
}
