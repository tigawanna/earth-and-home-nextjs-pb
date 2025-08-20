"use client";

import { Search } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { Input } from "@/components/ui/input";
interface SearchbarProps {}

export function Searchbar({}: SearchbarProps) {
  const [queryStates, setQueryStates] = useQueryStates({
    q: parseAsString.withDefault(""),
  });
  return (
    <div className="relative flex gap-2 justify-center">
      <h1 className="text-3xl">Favorites</h1>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        placeholder="Search favorites by property, location or user..."
        value={queryStates.q ?? ""}
        onChange={(e) => setQueryStates({ q: e.target.value })}
        className="pl-10 mb-2"
      />
    </div>
  );
}
