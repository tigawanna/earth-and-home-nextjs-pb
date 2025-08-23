"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { dashboardPropertyQueryOptions } from "@/data-access-layer/pocketbase/properties/client-side-property-queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Home } from "lucide-react";

interface PropertiesStatsProps {}

export function PropertiesStats({}: PropertiesStatsProps) {
  const { data, isPending } = useSuspenseQuery(dashboardPropertyQueryOptions());
  const total = data?.result?.totalItems ?? 0;

  return (
    <Card
      className="relative w-full bg-card/95 border border-border/60 shadow-sm overflow-hidden group transition-colors rounded-lg"
      aria-busy={isPending}
      aria-live="polite">
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(circle at 85% 20%, color-mix(in oklch, var(--color-primary) 18%, transparent) 0%, transparent 60%)",
        }}
      />
      <CardContent className="relative p-3 flex flex-col min-h-[140px]">
        <div className="flex items-start justify-between gap-3 flex-1">
          <div className="flex flex-col justify-between min-h-[100px] flex-1">
            <div className="flex items-start gap-2.5">
              <div className="relative">
                <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20">
                  <Home className="h-4 w-4" aria-hidden />
                </div>
                <div className="absolute -inset-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity bg-primary/5 blur-sm" />
              </div>
              <h3 className="text-sm font-medium tracking-wide text-muted-foreground group-hover:text-foreground transition-colors pt-1">
                Properties
              </h3>
            </div>
            {isPending ? (
              <div className="h-10 w-20 rounded bg-muted motion-safe:animate-pulse" />
            ) : (
              <p className="text-4xl ml-6  font-bold leading-none text-foreground tabular-nums">
                {total}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Manage properties"
            className="gap-1 text-xs font-medium hover:bg-primary/10 hover:text-primary h-6 px-2 shrink-0 self-start">
            Manage <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
