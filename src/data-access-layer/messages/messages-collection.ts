import { createCollection, eq, useLiveQuery } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { queryClient } from "@/lib/tanstack/query/get-query-client";
import { browserPB } from "@/lib/pocketbase/clients/browser-client";
import { eq as pBeq } from "@tigawanna/typed-pocketbase";

export const pbMessagesCollection = browserPB.from("property_messages");
export const pbMessagesCollectionFilter = pbMessagesCollection.createFilter(pBeq("type", "parent"));
export const pbMessagesCollectionSelect = pbMessagesCollection.createSelect({
  expand: {
    property_id: true,
  },
});

// Define a collection that loads data using TanStack Query
export const propertiesMessageCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["property_messages"],
    queryFn: async () => {
      const result = await pbMessagesCollection.getList(1, 100, {
        sort: "+created",
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
