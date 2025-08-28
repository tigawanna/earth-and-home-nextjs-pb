export const pocketbaseFriendlyUUID = () => {
  // Generate a random UUID and clean it up for PocketBase
  const initialId = crypto.randomUUID();
  // Remove hyphens, convert to lowercase, and take first 15 characters
  return initialId.replace(/-/g, "").toLowerCase().slice(0, 15);
};

export function addLocalfirstPocketbaseMetadata<T extends Record<string, any>>(
  item: T
): T & {
  id: string;
  created: string;
  updated: string;
  collectionId: string;
} {
  const now = new Date().toISOString();

  return {
    ...item,
    id: item.id || pocketbaseFriendlyUUID(),
    created: item.created || now,
    updated: item.updated || now,
    collectionId: item?.collectionId!,
  };
}

export const stripLocalOnlyMetadata = <T extends Record<string, any>>(item: T): T => {
  const { id, created, updated, collectionId, ...rest } = item;
  return rest as T;
};
