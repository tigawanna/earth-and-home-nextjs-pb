import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { dashboardFavoritesQueryOptions } from "@/data-access-layer/pocketbase/dashboard-queries";
import { browserPB } from "@/lib/pocketbase/browser-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";

interface FavoritesCardProps {}

export function FavoritesCard({}: FavoritesCardProps) {
  const { data, isPending } = useSuspenseQuery(dashboardFavoritesQueryOptions());

  const total = data?.result?.totalItems ?? 0;

  return (
    <Card className="w-full max-w-xs bg-card border border-border/60 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary/10 text-primary">
            <Heart className="h-5 w-5" aria-hidden />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">Favorites</h3>
            </div>
            <p className="mt-1 text-2xl font-bold text-foreground">{total}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-4 py-3 border-t border-border/60 bg-muted/10">
        <div className="w-full flex justify-end">
          <Button variant="ghost" size="sm" aria-label="Manage favorites">Manage</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
