import { browserPB } from "@/lib/pocketbase/clients/browser-client";
import { createCollectionFactory } from "@/lib/tanstack/db/query-collection-factory";
import { queryClient } from "@/lib/tanstack/query/get-query-client";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import { and, eq as pBeq } from "@tigawanna/typed-pocketbase";

// ====================================================
// TANSTACK COLLECTIONS
// ====================================================

export const pbMessagesCollection = browserPB.from("property_messages");

// Filter for parent messages (main conversations, not replies)

export const pbMessagesCollectionFilter = (propertyId: string) =>
  pbMessagesCollection.createFilter(and(pBeq("parent", propertyId)));

// Select with expanded relations
export const pbMessagesCollectionSelect = pbMessagesCollection.createSelect({
  expand: {
    property_id: true,
    user_id: true,
  },
});

// Messages for a specific property
export const createSinglePropertyMessagesCollection = ({ propertyId }: { propertyId: string }) => {
  console.log("Creating collection for propertyId:", propertyId);
  return createCollection(
    queryCollectionOptions({
      queryKey: ["property_messages", propertyId],
      queryFn: async () => {
        const result = await pbMessagesCollection.getList(1, 50, {
          sort: "-created",
          filter: pbMessagesCollectionFilter(propertyId),
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
};

// Create the factory using our new utility.
export const singlePropertyMessagesCollection = createCollectionFactory(
  createSinglePropertyMessagesCollection
);

// CRITICAL: Memoize the params object so its reference is stable across re-renders.
// This ensures the WeakMap factory returns the same collection instance.
//   const sourceParams = useMemo(() => ({ date: dateString }), [dateString]);
