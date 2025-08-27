import { createCollection, eq, useLiveQuery } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { queryClient } from "@/lib/tanstack/query/get-query-client";
import { browserPB } from "@/lib/pocketbase/clients/browser-client";
import z from "zod";

const pbMessagesCollection = browserPB.from("property_messages");
// Define a collection that loads data using TanStack Query
export const messageCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["messages"],
    queryFn: async () => {
      const result = await pbMessagesCollection.getList(1, 100, {
        sort: "+created",
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
