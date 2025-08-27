# Managing Dynamic Collections with a `WeakMap` Factory

This document summarizes a pattern for efficiently managing dynamic, partitioned collections in TanStack DB, based on a discussion from the official repository. The key takeaway is the use of a `WeakMap`-based factory to prevent memory leaks and simplify state management.

## The Problem: Dynamic Collections and Memory Leaks

A common use case is fetching a subset of a large collection based on dynamic parameters, such as a `propertyId`, `projectId`, or a date range. A naive approach is to create a new collection instance whenever the parameters change.

A better approach is to create a factory function that caches and reuses collection instances. However, using a standard JavaScript `Map` for this cache leads to a significant problem:

- A `Map` holds **strong references** to its keys and values.
- Even after a component unmounts and the collection is no longer in use, the `Map`'s strong reference prevents JavaScript's garbage collector from cleaning it up.
- This results in a **memory leak**, where unused collection instances accumulate over time.

While manual cleanup logic can be implemented (using `setTimeout` and subscribing to the collection's `cleaned-up` status), it is complex and error-prone.

## The Solution: A `WeakMap` Factory

A `WeakMap` provides a more elegant and robust solution. Unlike a `Map`, a `WeakMap` holds **weak references** to its keys. This has a crucial implication for garbage collection:

> If an object is used as a key in a `WeakMap`, and it's the *only* reference to that object left in the application, the garbage collector is free to destroy it and remove it from memory. The `WeakMap` entry will be removed automatically.

This is the perfect behavior for our caching factory.

### 1. The Factory Implementation

We can create a higher-order function, `createCollectionFactory`, that takes a "creator" function and returns a new factory that uses a `WeakMap` for caching.

**Key points:**
- The `WeakMap` key **must be an object**. We use the parameters object for this.
- The factory checks if a collection for the given `params` object already exists in the cache.
- If it exists, it's returned. If not, a new one is created, stored in the cache, and then returned.

```typescript
// src/lib/tanstack/db/create-collection-factory.ts
import { Collection } from '@tanstack/react-db';

// The key for the WeakMap MUST be an object.
type ParamsObject = Record<string, any>;

export function createCollectionFactory<TItem, TParams extends ParamsObject>(
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
```

### 2. Using the Factory in a React Component

When using the factory in a component, there is one **critical rule**: the `params` object passed to the factory must have a stable reference across re-renders. If you create a new params object on every render (`{ propertyId: '123' }`), the `WeakMap` will see a new key each time and will fail to return the cached collection.

The solution is to memoize the `params` object using the `useMemo` hook.

```tsx
// In your component file
import { useMemo } from 'react';
import { getPropertySpecificMessagesCollection } from '@/data-access-layer/messages/single-property-messages';

function MessagesComponent({ propertyId }: { propertyId: string }) {
  // CRITICAL: Memoize the params object so its reference is stable.
  // This ensures the WeakMap factory returns the same collection instance
  // for the same propertyId across re-renders.
  const sourceParams = useMemo(() => ({ propertyId }), [propertyId]);

  // Pass the stable params object to the factory.
  const messagesCollection = getPropertySpecificMessagesCollection(sourceParams);

  // Now you can use the collection with useLiveQuery, etc.
  // ...
}
```

By following this pattern, you can efficiently manage dynamic collections without manual cleanup or memory leaks, letting the JavaScript garbage collector and `WeakMap` handle the lifecycle automatically.
