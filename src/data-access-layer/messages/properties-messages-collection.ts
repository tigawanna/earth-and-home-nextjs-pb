import type {
  PropertiesResponse,
  PropertyMessagesResponse,
  UsersResponse,
} from "@/types/domain-types";

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

export async function getPropertyMessageSummaries() {
  try {
    const res = await fetch("/api/messages?type=parent");
    const json = (await res.json()) as { success: boolean; result: PropertyMessageWithExpansion[] };
    return {
      result: json.result ?? null,
      success: json.success,
    };
  } catch {
    return {
      result: null,
      success: false,
      error: "Failed to fetch property message summaries",
    };
  }
}

export async function getPropertyMessages(
  propertyId: string,
): Promise<PropertyMessageWithExpansion[]> {
  try {
    const res = await fetch(`/api/messages?propertyId=${encodeURIComponent(propertyId)}`);
    const json = (await res.json()) as { success: boolean; result: PropertyMessageWithExpansion[] };
    return json.result ?? [];
  } catch {
    return [];
  }
}

export async function createPropertyMessage(data: {
  property_id: string;
  user_id: string;
  body: string;
  type?: "parent" | "reply";
}): Promise<PropertyMessagesResponse | null> {
  try {
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        type: data.type || "parent",
      }),
    });
    const json = (await res.json()) as { success: boolean; result: PropertyMessagesResponse | null };
    return json.result ?? null;
  } catch {
    return null;
  }
}
