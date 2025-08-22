# TanStack Router with PocketBase Context

This guide shows how to use the PocketBase instance through TanStack Router context in your dashboard routes.

## Router Setup

The router is configured with a PocketBase context that makes the client available throughout all routes:

### Router Configuration (`src/app/dashboard/router.tsx`)

```tsx
import { createRouter } from "@tanstack/react-router";
import { TypedPocketBase } from "@tigawanna/typed-pocketbase";
import { Schema } from "@/lib/pocketbase/types/pb-types";
import { routeTree } from "./routeTree.gen";

// Define the router context interface
interface RouterContext {
  pb: TypedPocketBase<Schema> | null;
}

// Create router with context
export const router = createRouter({ 
  routeTree,
  context: { pb: null } as RouterContext, // This will be provided when creating the router provider
});
```

### Router Provider Setup (`src/app/dashboard/page.tsx`)

```tsx
"use client";
import nextDynamic from "next/dynamic";
import { router } from "./router";
import { browserPB } from "@/lib/pocketbase/browser-client";

const RouterProvider = nextDynamic(
  () => import("@tanstack/react-router").then((mod) => mod.RouterProvider),
  {
    ssr: false,
  }
);

export default function ClientRouter() {
  return (
    <RouterProvider 
      router={router} 
      context={{
        pb: browserPB, // Pass the PocketBase instance
      }}
    />
  );
}
```

### Root Route Setup (`src/app/dashboard/_routes/__root.tsx`)

```tsx
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TypedPocketBase } from "@tigawanna/typed-pocketbase";
import { Schema } from "@/lib/pocketbase/types/pb-types";

// Define the router context interface
interface RouterContext {
  pb: TypedPocketBase<Schema> | null;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  // You can access context here if needed
  // const { pb } = Route.useRouteContext();
  
  return (
    <div>
      <Outlet />
    </div>
  );
}
```

## Using PocketBase in Route Components

### Method 1: Using Route Context Hook

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/properties")({
  component: PropertiesPage,
});

function PropertiesPage() {
  const { pb } = Route.useRouteContext();
  
  // Now you can use the pocketbase instance
  const handleFetchProperties = async () => {
    if (!pb) return;
    const properties = await pb.from("properties").getFullList();
    console.log(properties);
  };

  return (
    <div>
      <h1>Properties</h1>
      <button onClick={handleFetchProperties}>
        Fetch Properties
      </button>
    </div>
  );
}
```

### Method 2: Using Route Context in Loaders

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/properties/$id")({
  loader: async ({ context, params }) => {
    // Access PocketBase from context in loader
    if (!context.pb) throw new Error("PocketBase not available");
    
    const property = await context.pb
      .from("properties")
      .getOne(params.id);
    return { property };
  },
  component: PropertyDetailPage,
});

function PropertyDetailPage() {
  const { property } = Route.useLoaderData();
  
  return (
    <div>
      <h1>{property.title}</h1>
      <p>{property.description}</p>
    </div>
  );
}
```

### Method 3: Using with React Query

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/properties")({
  component: PropertiesPage,
});

function PropertiesPage() {
  const { pb } = Route.useRouteContext();
  
  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      if (!pb) throw new Error("PocketBase not available");
      return pb.from("properties").getFullList();
    },
    enabled: !!pb,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Properties</h1>
      {properties?.map((property) => (
        <div key={property.id}>{property.title}</div>
      ))}
    </div>
  );
}
```

### Method 4: Creating Custom Hooks

You can create a custom hook to access the PocketBase instance:

```tsx
// hooks/usePocketbase.ts
import { getRouteApi } from "@tanstack/react-router";

const rootApi = getRouteApi("__root__");

export function usePocketbase() {
  const { pb } = rootApi.useRouteContext();
  return pb;
}

export function useRequiredPocketbase() {
  const pb = usePocketbase();
  if (!pb) {
    throw new Error("PocketBase instance not available in router context");
  }
  return pb;
}
```

Then use it in any component:

```tsx
import { usePocketbase } from "@/hooks/usePocketbase";

function MyComponent() {
  const pb = usePocketbase();
  
  // Use pocketbase instance
  const handleAction = async () => {
    if (!pb) return;
    const data = await pb.from("collection").getFullList();
  };

  return <div>...</div>;
}
```

## Benefits

1. **Type Safety**: Full TypeScript support with your PocketBase schema
2. **Centralized Instance**: One PocketBase instance shared across all routes
3. **Authentication State**: Shared auth state across the entire router
4. **Performance**: No need to create multiple PocketBase instances
5. **Consistency**: Same instance used for all data operations

## Best Practices

1. **Use Loaders**: Fetch data in route loaders when possible for better UX
2. **Combine with React Query**: Use the context PocketBase instance with React Query for caching
3. **Error Handling**: Implement proper error boundaries for PocketBase operations
4. **Authentication**: Check auth state in loaders or route guards
5. **Type Safety**: Always use the typed PocketBase instance for better developer experience
