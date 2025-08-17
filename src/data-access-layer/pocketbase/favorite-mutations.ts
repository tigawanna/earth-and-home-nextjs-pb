import { createBrowserClient } from "@/lib/pocketbase/browser-client";
import { FavoritesCreate } from "@/lib/pocketbase/types/pb-types";
import { mutationOptions } from "@tanstack/react-query";
import { and, eq } from "@tigawanna/typed-pocketbase";

export const toggleFavoriteMutationOptions = mutationOptions({
  mutationFn: async ({ propertyId, userId }: { propertyId: string; userId: string }) => {
    try {
      const client = createBrowserClient();

      // Check if favorite already exists
      try {
        client.from("favorites").getOne("item_id",{
          // this will select everything and especially the expand fields , which is joining to those tables it results in a data response that's {...est_of_data,expand:{property_id:{...property_fields},user_id:{...user_fields}}}
          select:{
            expand:{
              "property_id":true,
              "user_id":true,   
            }
          }
        })
        // get first item that satisfies the filter
       client.from("favorites").getFirstListItem(eq("user_id", userId));
        // get full list options ( use sparingly)
        client.from("favorites").getFullList({
          filter:eq("user_id", userId),
          sort: "-created",
          perPage: 1,
        });
        // paginated list // page , perPage, options
        client.from("favorites").getList(1,24,{
          filter:eq("user_id", userId),
          sort: "-created",
          perPage: 1,
        });

       

        const existingFavorite = await client
          .from("favorites")
          .getFirstListItem(and(eq("property_id", propertyId), eq("user_id", userId)), {});

        // If exists, delete it (unfavorite)
        await client.from("favorites").delete(existingFavorite.id);

        return {
          success: true,
          isFavorited: false,
          message: "Removed from favorites",
        };
      } catch (error) {
        // Favorite doesn't exist, create it
        const favoriteData: FavoritesCreate = {
          property_id: propertyId,
          user_id: userId,
        };

        const newFavorite = await client.from("favorites").create(favoriteData);

        return {
          success: true,
          isFavorited: true,
          message: "Added to favorites",
          favorite: newFavorite,
        };
      }
    } catch (error) {
      return {
        success: false,
        isFavorited: false,
        message: "Failed to toggle favorite",
        code: "favorite/toggle-failed",
      };
    }
  },
});

// For backwards compatibility
export const toggleFavorite = async (propertyId: string, userId: string) => {
  const result = await toggleFavoriteMutationOptions.mutationFn!({ propertyId, userId });
  return result;
};
