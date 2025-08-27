// src/lib/createCollectionFactory.ts (FINAL, MOST ELEGANT VERSION)
import { Collection } from "@tanstack/react-db";

// The key for the WeakMap MUST be an object.
type ParamsObject = Record<string, any>;

// The factory creator now uses a WeakMap.
export function createCollectionFactory<TItem extends object, TParams extends ParamsObject>(
  creatorFn: (params: TParams) => Collection<TItem>
) {
  // The cache now uses a WeakMap.
  // The key is the params object, the value is the collection.
  const cache = new WeakMap<TParams, Collection<TItem>>();

  return (params: TParams): Collection<TItem> => {
    // If the collection is already in the cache for this params object, return it.
    if (cache.has(params)) {
      return cache.get(params)!;
    }

    // Otherwise, create a new collection instance.
    const newCollection = creatorFn(params);

    // Store it in the WeakMap with the params object as the key.
    cache.set(params, newCollection);

    return newCollection;
  };
}
