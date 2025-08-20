import { Searchbar } from "@/components/shared/Searchbar";
import { Suspense } from "react";
import { TablePending } from "@/components/shared/TablePending";
import { FavoritesTable } from "./FavoritesTable";

interface FavoritePropertiesProps {}

export function FavoriteProperties({}: FavoritePropertiesProps) {
  return (
    <div className="space-y-6">
      <Searchbar />
      <Suspense fallback={<TablePending />}>
        <FavoritesTable />
      </Suspense>
    </div>
  );
}
