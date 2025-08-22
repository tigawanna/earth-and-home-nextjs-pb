import { getRouteApi } from "@tanstack/react-router";

const rootApi = getRouteApi("__root__");

/**
 * Custom hook to access the PocketBase instance from TanStack Router context
 * @returns TypedPocketBase instance or null if not available
 */
export function usePocketbase() {
  const { pb } = rootApi.useRouteContext();
  return pb;
}

/**
 * Custom hook that throws an error if PocketBase is not available
 * Use this when you need to ensure PocketBase is available
 * @returns TypedPocketBase instance (guaranteed to be non-null)
 */
export function useRequiredPocketbase() {
  const pb = usePocketbase();
  if (!pb) {
    throw new Error("PocketBase instance not available in router context");
  }
  return pb;
}
