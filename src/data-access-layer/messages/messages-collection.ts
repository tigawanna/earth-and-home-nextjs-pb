import { browserPB } from "@/lib/pocketbase/clients/browser-client";
import { PropertiesResponse, PropertyMessagesResponse, UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { queryClient } from "@/lib/tanstack/query/get-query-client";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import { and, eq as pBeq } from "@tigawanna/typed-pocketbase";

// ====================================================
// POCKETBASE COLLECTIONS
// ====================================================

export const pbMessagesCollection = browserPB.from("property_messages");

// Filter for parent messages (main conversations, not replies)
export const pbMessagesCollectionFilter = pbMessagesCollection.createFilter(pBeq("type", "parent"));

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

// Messages for a specific property
export const createPropertySpecificMessagesCollection = (propertyId: string) => 
  createCollection(
    queryCollectionOptions({
      queryKey: ["property_messages", propertyId],
      queryFn: async () => {
        const filter = pbMessagesCollection.createFilter(
          and(pBeq("property_id", propertyId), pBeq("type", "parent"))
        );
        const result = await pbMessagesCollection.getList(1, 100, {
          sort: "-created",
          filter,
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

export type PropertyMessageSummary = {
  property: PropertiesResponse;
  latestMessage: PropertyMessageWithExpansion;
  messageCount: number;
  lastActivity: string;
};

// Get message summaries grouped by property
export async function getPropertyMessageSummaries(): Promise<PropertyMessageSummary[]> {
  try {
    const messages = await pbMessagesCollection.getFullList({
      sort: "-created",
      filter: pbMessagesCollectionFilter,
      select: pbMessagesCollectionSelect,
    });

    // Group messages by property
    const propertyGroups = messages.reduce((acc, message) => {
      const propertyId = message.property_id;
      if (!acc[propertyId]) {
        acc[propertyId] = [];
      }
      acc[propertyId].push(message as PropertyMessageWithExpansion);
      return acc;
    }, {} as Record<string, PropertyMessageWithExpansion[]>);

    // Create summaries
    const summaries: PropertyMessageSummary[] = [];
    
    for (const [propertyId, propertyMessages] of Object.entries(propertyGroups)) {
      const latestMessage = propertyMessages[0]; // Already sorted by -created
      const property = latestMessage.expand?.property_id;
      
      if (property) {
        summaries.push({
          property,
          latestMessage,
          messageCount: propertyMessages.length,
          lastActivity: latestMessage.created,
        });
      }
    }

    // Sort by last activity
    return summaries.sort((a, b) => 
      new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    );
  } catch (error) {
    console.error("Error fetching property message summaries:", error);
    return [];
  }
}

// Get all messages for a specific property (including replies)
export async function getPropertyMessages(propertyId: string): Promise<PropertyMessageWithExpansion[]> {
  try {
    const filter = pbMessagesCollection.createFilter(pBeq("property_id", propertyId));
    const result = await pbMessagesCollection.getFullList({
      sort: "+created", // Chronological order for chat
      filter,
      select: pbMessagesCollectionSelect,
    });

    return result as PropertyMessageWithExpansion[];
  } catch (error) {
    console.error("Error fetching property messages:", error);
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
    console.error("Error creating property message:", error);
    return null;
  }
}
