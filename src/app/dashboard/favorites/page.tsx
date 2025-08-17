import { FavoriteProperties } from "@/components/property/dashboard/favorites/FavoriteProperties";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

function LoadingFallback() {
  return (
    <Card>
      <CardContent className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading favorites...</span>
      </CardContent>
    </Card>
  );
}

export default function FavoritesPage({}: {}) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <FavoriteProperties />
    </Suspense>
  );
}
