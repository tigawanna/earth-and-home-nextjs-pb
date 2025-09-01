"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Heart, Loader, Search } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";
import { useTransition } from "react";

interface FavoritesSerachbarProps {
  className?: string;
}

export function FavoritesSerachbar({ className }: FavoritesSerachbarProps) {
  const [isPending, startTransition] = useTransition();
  const [queryStates, setQueryStates] = useQueryStates(
    {
      q: parseAsString.withDefault(""),
    },
    {
      shallow: false,
      startTransition,
    }
  );

  return (
    <div className={cn("w-full", className)}>
      {/* Mobile layout: stacked */}
      <div className="flex flex-col gap-4 md:hidden">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Favorites</h1>
        </div>
        
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search favorites..."
            value={queryStates.q ?? ""}
            onChange={(e) => setQueryStates({ q: e.target.value })}
            className="pl-10 w-full"
          />
          {isPending && (
            <Loader className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Desktop layout: row */}
      <div className="hidden md:flex items-center justify-between gap-4 pr-4">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Favorites</h1>
        </div>

        <div className="relative w-[60%]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search favorites by property, location or user..."
            value={queryStates.q ?? ""}
            onChange={(e) => setQueryStates({ q: e.target.value })}
            className="pl-10"
          />
          {isPending && (
            <Loader className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </div>
    </div>
  );
}
