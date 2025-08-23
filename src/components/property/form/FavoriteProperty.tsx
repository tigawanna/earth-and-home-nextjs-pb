"use client";

import { Button } from "@/components/ui/button";
import { browserPB } from "@/lib/pocketbase/clients/browser-client";
import { useMutation } from "@tanstack/react-query";
import { and, eq } from "@tigawanna/typed-pocketbase";
import { Heart } from "lucide-react";
import Link from "next/link";

interface FavoritePropertyProps {
  propertyId: string;
  userId?: string; // Add userId prop
  isFavorited?: boolean;
}

export function FavoriteProperty({ propertyId, userId }: FavoritePropertyProps) {
  const { mutate: toggleFavorite, isPending } = useMutation({
    mutationFn: async ({ user_id, property_id }: { user_id: string; property_id: string }) => {
      const existingFavorite = await browserPB
        .from("favorites")
        .getFirstListItem(and(eq("property_id", property_id), eq("user_id", user_id)));
      if (existingFavorite) {
        // If favorite exists, delete it (unfavorite)
        await browserPB.from("favorites").delete(existingFavorite.id);
      } else {
        // If favorite doesn't exist, create it (favorite)
        await browserPB.from("favorites").create({ property_id, user_id });
      }
    },
  });
  if (!userId) {
    return (
      <Link href="/ai=uth/login">
        <Button
          onClick={() => toggleFavorite({ user_id: userId || "", property_id: propertyId })}
          disabled={isPending}
          variant="outline"
          size="icon">
          <Heart data-pending={isPending} className="h-4 w-4 data-[pending=true]:animate-spin" />
        </Button>
      </Link>
    );
  }

  return (
    <Button
      onClick={() => toggleFavorite({ user_id: userId, property_id: propertyId })}
      disabled={isPending}
      variant="outline"
      size="icon">
      <Heart data-pending={isPending} className="h-4 w-4 data-[pending=true]:animate-spin" />
    </Button>
  );
}
