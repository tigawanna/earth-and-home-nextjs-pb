"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader, Search, Users } from "lucide-react";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { useTransition } from "react";

interface AgentsSearchProps {
  className?: string;
  currentUser: { is_admin: boolean };
}

export function AgentsSearch({ className, currentUser = { is_admin: false } }: AgentsSearchProps) {
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useQueryState("q", {
    defaultValue: "",
    throttleMs: 500,
    startTransition,
    shallow: false
  });

  return (
    <div className={cn("w-full", className)}>
      {/* Mobile layout: stacked */}
      <div className="flex flex-col gap-4 @lg:hidden">
        <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Agents</h1>
        </div>
        
        {currentUser.is_admin && (
          <div className="flex items-center">
            <Link href="/dashboard/agents/new">
              <Button size="sm" className="w-full">Create Agent</Button>
            </Link>
          </div>
        )}
        </div>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-full"
          />
          {isPending && (
            <Loader className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Desktop layout: row */}
      <div className="hidden @lg:flex items-center justify-between gap-4 pr-4">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Agents</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search agents by name, email, phone, or user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            {isPending && (
              <Loader className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
            )}
          </div>
          
          {currentUser.is_admin && (
            <Link href="/dashboard/agents/new">
              <Button>Create Agent</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
