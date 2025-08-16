"use client";

import { Button } from "@/components/ui/button";
import { toggleFavorite } from "@/DAL/drizzle/property-mutations";
import { Heart } from "lucide-react";
import { useTransition } from "react";

interface FavoritePropertyProps {
  propertyId: string;
  isFavorited?:boolean //TODO fix thi
}

export function FavoriteProperty({ propertyId }: FavoritePropertyProps) {
  const [isPending, startTransition] = useTransition();
  const handleToggleFavorite = () => {
    startTransition(() => {
      toggleFavorite(propertyId);
    });
  };

  return (
    <Button onClick={handleToggleFavorite} disabled={isPending} variant="outline" size="icon">
      <Heart data-pending={isPending} className="h-4 w-4 data-[pending=true]:animate-spin" />
    </Button>
  );
}
