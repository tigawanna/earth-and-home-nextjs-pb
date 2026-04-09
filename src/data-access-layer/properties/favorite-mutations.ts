import { mutationOptions } from "@tanstack/react-query";

export const toggleFavoriteMutationOptions = mutationOptions({
  mutationFn: async ({ propertyId, userId }: { propertyId: string; userId: string }) => {
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, userId }),
      });
      const json = (await res.json()) as { success: boolean; isFavorited?: boolean; message?: string };
      if (!res.ok || !json.success) {
        return {
          success: false,
          isFavorited: false,
          message: json.message ?? "Failed to toggle favorite",
          code: "favorite/toggle-failed",
        };
      }
      return {
        success: true,
        isFavorited: json.isFavorited as boolean,
        message: json.message as string,
      };
    } catch {
      return {
        success: false,
        isFavorited: false,
        message: "Failed to toggle favorite",
        code: "favorite/toggle-failed",
      };
    }
  },
});

export const toggleFavorite = async (propertyId: string, userId: string) => {
  const result = await toggleFavoriteMutationOptions.mutationFn!({ propertyId, userId });
  return result;
};
