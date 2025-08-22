"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardPropertyQueryOptions } from "@/data-access-layer/pocketbase/properties/client-side-property-queries";
import { cn } from "@/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface RecentPropertiesTableProps {
  limit?: number;
  className?: string;
}

export function RecentPropertiesTable({ limit = 10, className }: RecentPropertiesTableProps) {
  const { data, isPending } = useSuspenseQuery(dashboardPropertyQueryOptions({ page: 1, limit }));
  const items = data?.result?.items ?? [];

  return (
    <Card className={cn("bg-card/95 border border-border/60 shadow-sm", className)} aria-busy={isPending}>
      <CardHeader className="py-4 px-5 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold">Recent Properties</CardTitle>
        <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
          <Link href="/dashboard/properties">View all <ArrowRight className="h-3 w-3" /></Link>
        </Button>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wide text-muted-foreground/70 border-b border-border/60">
              <tr className="h-9">
                <th className="text-left font-medium px-4">Title</th>
                <th className="text-left font-medium px-4 hidden sm:table-cell">Location</th>
                <th className="text-left font-medium px-4 hidden md:table-cell">Price</th>
                <th className="text-left font-medium px-4 hidden lg:table-cell">Created</th>
              </tr>
            </thead>
            <tbody>
              {isPending && (
                <tr>
                  <td colSpan={4} className="py-8 text-center">
                    <div className="h-5 w-28 mx-auto rounded bg-muted animate-pulse" />
                  </td>
                </tr>
              )}
              {!isPending && items.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground text-xs">No properties found.</td>
                </tr>
              )}
              {!isPending && items.map(p => {
                // Assuming structure has fields: title, location(city?), price, created
                const created = p.created ? formatDistanceToNow(new Date(p.created), { addSuffix: true }) : "";
                return (
                  <tr key={p.id} className="border-b last:border-b-0 border-border/40 hover:bg-muted/30 transition-colors h-10">
                    <td className="px-4 py-1.5 font-medium text-foreground max-w-[180px] truncate">
                      <Link href={`/properties/${p.id}`} className="hover:text-primary">{p.title || "Untitled"}</Link>
                    </td>
                    <td className="px-4 py-1.5 text-muted-foreground hidden sm:table-cell max-w-[140px] truncate">{(p as any).city || (p as any).location || "-"}</td>
                    <td className="px-4 py-1.5 text-foreground hidden md:table-cell">{p.price ? Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(p.price)) : "-"}</td>
                    <td className="px-4 py-1.5 text-muted-foreground hidden lg:table-cell whitespace-nowrap">{created}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
