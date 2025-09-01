import { browserPB } from "@/lib/pocketbase/clients/browser-client";
import {
    PropertiesResponse,
    PropertyMessagesResponse,
    UsersResponse,
} from "@/lib/pocketbase/types/pb-types";
import { queryClient } from "@/lib/tanstack/query/get-query-client";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import { and, eq as pBeq } from "@tigawanna/typed-pocketbase";

// ====================================================
// POCKETBASE COLLECTIONS
// ====================================================

export const pbMessagesCollection = browserPB.from("property_messages");

// Filter for parent messages (main conversations, not replies)
export const pbMessagesCollectionFilter = pbMessagesCollection.createFilter(
  and(
    pBeq("type", "parent")
  )
);

// Select with expanded relations
export const pbMessagesCollectionSelect = pbMessagesCollection.createSelect({
  expand: {
    property_id: true,
    user_id: true,
  },
});

// ====================================================
// TANSTACK COLLECTIONS
// ====================================================

// All property messages collection
export const propertyMessagesCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["property_messages"],
    queryFn: async () => {
      const result = await pbMessagesCollection.getList(1, 100, {
        sort: "-created",
        filter: pbMessagesCollectionFilter,
        select: pbMessagesCollectionSelect,
      });
      return result.items;
    },
    getKey: (item) => item.id,
    onInsert: async ({ transaction }) => {
      const { modified } = transaction.mutations[0];
      await pbMessagesCollection.create(modified);
    },
    onUpdate: async ({ transaction }) => {
      const { original, modified } = transaction.mutations[0];
      await pbMessagesCollection.update(original.id, modified);
    },
    onDelete: async ({ transaction }) => {
      const { original } = transaction.mutations[0];
      await pbMessagesCollection.delete(original.id);
    },
    queryClient: queryClient!,
  })
);

// ====================================================
// HELPER FUNCTIONS
// ====================================================

export type PropertyMessageWithExpansion = PropertyMessagesResponse & {
  expand?: {
    property_id?: PropertiesResponse;
    user_id?: UsersResponse;
  };
};




export type MessageWithProperty = PropertyMessagesResponse & {
  expand?: {
    user_id?: UsersResponse | undefined;
    property_id?: PropertiesResponse | undefined;
} | undefined;
};


export type PropertyMessageSummary = {
  property: PropertiesResponse;
  latestMessage: PropertyMessageWithExpansion;
  messageCount: number;
  lastActivity: string;
};

// Get message summaries grouped by property
export async function getPropertyMessageSummaries(){
  try {
    const response = await pbMessagesCollection.getList(1, 50, {
      sort: "-created",
      filter: pbMessagesCollectionFilter,
      select: pbMessagesCollectionSelect,
    });
    return {
      result:response,
      success:true,
    }
  } catch (error) {
    console.log("error happende = =>\n","Error fetching property message summaries:", error);
    return {
      result: null,
      success: false,
      error: "Failed to fetch property message summaries",
    };
  }
}

// Get all messages for a specific property (including replies)
export async function getPropertyMessages(
  propertyId: string
): Promise<PropertyMessageWithExpansion[]> {
  try {
    const filter = pbMessagesCollection.createFilter(pBeq("property_id", propertyId));
    const result = await pbMessagesCollection.getFullList({
      sort: "+created", // Chronological order for chat
      filter,
      select: pbMessagesCollectionSelect,
    });

    return result as PropertyMessageWithExpansion[];
  } catch (error) {
    console.log("error happende = =>\n","Error fetching property messages:", error);
    return [];
  }
}

// Create a new message
export async function createPropertyMessage(data: {
  property_id: string;
  user_id: string;
  body: string;
  type?: "parent" | "reply";
}): Promise<PropertyMessagesResponse | null> {
  try {
    const message = await pbMessagesCollection.create({
      ...data,
      type: data.type || "parent",
    });
    return message;
  } catch (error) {
    console.log("error happende = =>\n","Error creating property message:", error);
    return null;
  }
}
