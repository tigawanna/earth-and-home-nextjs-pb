"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader, LucideIcon, Search } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";
import { ReactNode, useTransition } from "react";

interface SearchbarProps {
  icon: LucideIcon;
  label: string;
  addNewComponent?: ReactNode;
  placeholder?: string;
  className?: string;
}

export function Searchbar({
  icon: Icon,
  label,
  addNewComponent,
  placeholder = "Search...",
  className
}: SearchbarProps) {
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
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Icon className="h-6 w-6" />
          <h1 className="text-2xl font-bold">{label}</h1>
        </div>

        {addNewComponent && (
          <div className="flex items-center gap-2">
            {addNewComponent}
          </div>
        )}
      </div>

      <div className="relative max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
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
