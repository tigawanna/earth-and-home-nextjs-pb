"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQueryState } from "nuqs";
import { useTransition } from "react";

export function AgentsSearch() {
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useQueryState("q", {
    defaultValue: "",
    throttleMs: 3000,
    startTransition,
    shallow: false
  });

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search agents by name, email, phone, or user..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-9"
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        {isPending && <span className="text-sm text-muted-foreground">Searching...</span>}
      </div>
    </div>
  );
}
