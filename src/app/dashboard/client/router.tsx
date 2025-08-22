import { Schema } from "@/lib/pocketbase/types/pb-types";
import { createRouter } from "@tanstack/react-router";
import { TypedPocketBase } from "@tigawanna/typed-pocketbase";
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
