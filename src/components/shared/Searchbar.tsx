"use client";

import { Loader, Search } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
interface SearchbarProps {
    label: string;
}

export function Searchbar({ label }: SearchbarProps) {
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
    <div className="relative flex gap-2 justify-center">
      <h1 className="text-xl">{label}</h1>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        placeholder="Search favorites by property, location or user..."
        value={queryStates.q ?? ""}
        onChange={(e) => setQueryStates({ q: e.target.value })}
        className="pl-10 mb-2"
      />
      {isPending && (
        <Loader className="absolute right-3 top-[40%] -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
      )}
    </div>
  );
}
