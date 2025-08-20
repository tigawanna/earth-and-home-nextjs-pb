"use client"
import { Searchbar } from "@/components/shared/Searchbar";
import { TablePending } from "@/components/shared/TablePending";
import dynamic from "next/dynamic";
import { Suspense } from "react";
const  FavoritesTable  = dynamic(() => import("./FavoritesTable"),{
  ssr: false, 
  loading: () => <TablePending />
});

interface FavoritePropertiesProps {}

export function FavoriteProperties({}: FavoritePropertiesProps) {
  return (
    <div className="space-y-6">
      <Searchbar label="Favorites" />
      <Suspense fallback={<TablePending />}>
        <FavoritesTable />
      </Suspense>
    </div>
  );
}
