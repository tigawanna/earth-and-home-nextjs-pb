"use client";

import { Button } from "@/components/ui/button";
import { toggleFavorite as toggleFavoriteAction } from "@/data-access-layer/actions/favorite-actions";
import { PropertyWithFavorites } from "@/data-access-layer/properties/property-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface FavoritePropertyProps {
  userId?: string;
  property: PropertyWithFavorites;
}

interface ToggleFavoriteResponse {
  success: boolean;
  isFavorited: boolean;
  message: string;
}

export function FavoriteProperty({ userId, property }: FavoritePropertyProps) {
  const propertyId = property.id;
  const is_favorited =
    property.expand?.favorites_via_property_id?.some((fav) => fav.user_id === userId) || false;
  const queryClient = useQueryClient();
  const [favoriteState, setFavoriteState] = useState(is_favorited || false);

  const { mutate: toggleFavorite, isPending } = useMutation({
    mutationFn: async ({ user_id, property_id }: { user_id: string; property_id: string }) => {
      const result = await toggleFavoriteAction({ propertyId: property_id, userId: user_id });
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: (result) => {
      setFavoriteState(result.isFavorited);

      queryClient.invalidateQueries({
        queryKey: ["dashboard", "property", propertyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "properties"],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "favorites"],
      });
    },
  });

  if (!userId) {
    return (
      <Link href="/auth/signin">
        <Button
          variant="outline"
          size="icon"
          title="Sign in to favorite properties"
          aria-label="Sign in to favorite properties"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </Link>
    );
  }

  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite({ user_id: userId, property_id: propertyId });
      }}
      disabled={isPending}
      variant="outline"
      size="icon"
      title={favoriteState ? "Remove from favorites" : "Add to favorites"}
      aria-label={
        favoriteState
          ? `Remove ${property.title || "property"} from favorites`
          : `Add ${property.title || "property"} to favorites`
      }
    >
      <Heart
        data-pending={isPending}
        className={`h-4 w-4 transition-colors ${favoriteState ? "fill-red-500 text-red-500" : ""} ${
          isPending ? "animate-spin" : ""
        }`}
      />
    </Button>
  );
}
