"use client";

import { Button } from "@/components/ui/button";
import { toggleFavorite } from "@/data-access-layer/pocketbase/favorite-mutations";
import { Heart } from "lucide-react";
import { useTransition } from "react";

interface FavoritePropertyProps {
  propertyId: string;
  userId?: string; // Add userId prop
  isFavorited?: boolean;
}

export function FavoriteProperty({ propertyId, userId }: FavoritePropertyProps) {
  const [isPending, startTransition] = useTransition();
  
  const handleToggleFavorite = () => {
    if (!userId) {
      // TODO: Handle authentication redirect
      console.warn("User not authenticated");
      return;
    }
    
    startTransition(async () => {
      try {
        await toggleFavorite(propertyId, userId);
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
      }
    });
  };

  return (
    <Button onClick={handleToggleFavorite} disabled={isPending} variant="outline" size="icon">
      <Heart data-pending={isPending} className="h-4 w-4 data-[pending=true]:animate-spin" />
    </Button>
  );
}
