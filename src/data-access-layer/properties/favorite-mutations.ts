import { mutationOptions } from "@tanstack/react-query";
import { toggleFavorite as toggleFavoriteAction } from "../actions/favorite-actions";

export const toggleFavoriteMutationOptions = mutationOptions({
  mutationFn: async ({ propertyId, userId }: { propertyId: string; userId: string }) => {
    return toggleFavoriteAction({ propertyId, userId });
  },
});

export async function toggleFavorite(propertyId: string, userId: string) {
  return toggleFavoriteAction({ propertyId, userId });
}
