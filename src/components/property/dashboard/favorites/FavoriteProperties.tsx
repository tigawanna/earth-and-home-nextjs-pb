"use client"
import { Searchbar } from "@/components/shared/Searchbar";
import { Suspense } from "react";
import { TablePending } from "@/components/shared/TablePending";
import dynamic from "next/dynamic";
const  FavoritesTable  = dynamic(() => import("./FavoritesTable"),{
  ssr: false, 
  loading: () => <TablePending />
});

interface FavoritePropertiesProps {}

export function FavoriteProperties({}: FavoritePropertiesProps) {
  return (
    <div className="space-y-6">
      <Searchbar />
        <FavoritesTable />
    </div>
  );
}
