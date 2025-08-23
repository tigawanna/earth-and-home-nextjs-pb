"use client";

import { Button } from "@/components/ui/button";
import { browserPB } from "@/lib/pocketbase/clients/browser-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { and, eq } from "@tigawanna/typed-pocketbase";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface FavoritePropertyProps {
  propertyId: string;
  userId?: string;
  is_favorited?: boolean | null; // New API field
}

export function FavoriteProperty({ 
  propertyId, 
  userId, 
  is_favorited 
}: FavoritePropertyProps) {
  const queryClient = useQueryClient();
  const [currentUserId, setCurrentUserId] = useState<string | null>(userId || null);
  const [favoriteState, setFavoriteState] = useState( is_favorited || false);

  // Get current user from PocketBase auth if not provided
  useEffect(() => {
    if (!userId && browserPB.authStore.isValid) {
      setCurrentUserId(browserPB.authStore.record?.id || null);
    }
  }, [userId]);

  const { mutate: toggleFavorite, isPending } = useMutation({
    mutationFn: async ({ user_id, property_id }: { user_id: string; property_id: string }) => {
      try {
        const existingFavorite = await browserPB
          .from("favorites")
          .getFirstListItem(and(eq("property_id", property_id), eq("user_id", user_id)));
        
        if (existingFavorite) {
          // If favorite exists, delete it (unfavorite)
          await browserPB.from("favorites").delete(existingFavorite.id);
          return { action: 'unfavorited', isFavorited: false };
        }
      } catch (error) {
        // Favorite doesn't exist, so we'll create it
      }
      
      // Create favorite
      await browserPB.from("favorites").create({ property_id, user_id });
      return { action: 'favorited', isFavorited: true };
    },
    onSuccess: (result) => {
      // Update local state
      setFavoriteState(result.isFavorited);
      
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ 
        queryKey: ["dashboard", "property", propertyId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["dashboard", "properties"] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["dashboard", "favorites"] 
      });
    },
  });

  // If no user is logged in, show login link
  if (!currentUserId) {
    return (
      <Link href="/auth/signin">
        <Button
          variant="outline"
          size="icon"
          title="Sign in to favorite properties"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </Link>
    );
  }

  return (
    <Button
      onClick={() => toggleFavorite({ user_id: currentUserId, property_id: propertyId })}
      disabled={isPending}
      variant="outline"
      size="icon"
      title={favoriteState ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart 
        data-pending={isPending} 
        className={`h-4 w-4 transition-colors ${
          favoriteState ? "fill-red-500 text-red-500" : ""
        } ${isPending ? "animate-pulse" : ""}`}
      />
    </Button>
  );
}
