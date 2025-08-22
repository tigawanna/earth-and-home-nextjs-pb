import { FavoriteProperties } from "@/components/property/dashboard/favorites/FavoriteProperties";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/favorites")({
  component: FavoritesPage,
});

function FavoritesPage() {
  return (
    <div className="space-y-6">
      <FavoriteProperties />
    </div>
  );
}
