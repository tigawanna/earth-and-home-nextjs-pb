import { Card, CardContent } from "@/components/ui/card";

interface PropertiesListLoadingProps {}

export function PropertiesListLoading({}: PropertiesListLoadingProps) {
  const placeholders = Array.from({ length: 6 }).map((_, i) => i + 1);

  return (
    <div className="w-full  flex flex-col items-center">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full">
        {placeholders.map((p) => (
          <Card key={p} className="overflow-hidden border border-border/60 bg-card shadow-sm">
            {/* media */}
            <div className="relative aspect-[4/3] bg-muted/40 animate-pulse" />

            <CardContent className="p-4">
              {/* type badge */}
              <div className="mb-2">
                <div className="inline-block h-4 w-20 rounded bg-muted/30 animate-pulse" />
              </div>

              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="h-5 w-40 rounded bg-muted/30 animate-pulse mb-2" />
                  <div className="h-4 w-24 rounded bg-muted/30 animate-pulse" />
                </div>
                <div className="ml-4">
                  <div className="h-6 w-20 rounded bg-muted/30 animate-pulse" />
                </div>
              </div>

              <div className="flex items-center text-muted-foreground mb-3">
                <div className="h-4 w-28 rounded bg-muted/30 animate-pulse" />
              </div>

              <div className="h-3 w-full rounded bg-muted/30 animate-pulse mb-2" />
              <div className="h-3 w-5/6 rounded bg-muted/30 animate-pulse mb-4" />

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="h-4 w-12 rounded bg-muted/30 animate-pulse" />
                <div className="h-4 w-12 rounded bg-muted/30 animate-pulse" />
                <div className="h-4 w-16 rounded bg-muted/30 animate-pulse" />
              </div>

              <div className="h-4 w-32 rounded bg-muted/30 animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
