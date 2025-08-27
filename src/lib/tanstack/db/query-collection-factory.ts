// src/lib/createCollectionFactory.ts (FINAL, MOST ELEGANT VERSION)
import { Collection } from "@tanstack/react-db";

// The key for the WeakMap MUST be an object.
type ParamsObject = Record<string, any>;

/**
 * Creates a factory function that returns cached Collection instances based on params objects.
 * Uses WeakMap for automatic garbage collection of unused collections.
 *
 * @example
 * // Ensure the params object has a stable reference using useMemo
 * const sourceParams = useMemo(() => ({ date: dateString }), [dateString]);
 * // or
 * const sourceParams = useMemo(() => ({ propertyId }), [propertyId]);
 *
 * // Create a memoized collection factory
 * const singlePropertyMessagesCollection = createCollectionFactory(
 *   (params: { propertyId: string }) =>
 *     new Collection({
 *       name: `messages_${params.propertyId}`,
 *       // other collection config...
 *     })
 * );
 *
 * // Reuse the same collection instance across re-renders when params are equal by reference
 * const propertyMessagesCollection = singlePropertyMessagesCollection(sourceParams);
 *
 * // Use in a live query
 * const { liveMessages } = useLiveQuery((q) =>
 *   q.from({
 *     messages: propertyMessagesCollection,
 *   })
 * );
 */
export function createCollectionFactory<TCol extends Collection<any>, TParams extends ParamsObject>(
  creatorFn: (params: TParams) => TCol
) {
  // The cache now uses a WeakMap.
  // The key is the params object, the value is the collection.
  const cache = new WeakMap<TParams, TCol>();

  return (params: TParams): TCol => {
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
