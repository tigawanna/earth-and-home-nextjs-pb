import { FavoriteProperties } from "@/components/dashboard/favorites/FavoriteProperties";
import { Searchbar } from "@/components/shared/Searchbar";
import { TablePending } from "@/components/shared/TablePending";
import { Suspense } from "react";

interface FavoritesPageProps {
  searchParams?: {
    [key: string]: string | string[] | undefined;
    page?: string;
    q?: string;
  };
}

export default async function FavoritesPage({ searchParams }: FavoritesPageProps) {
  const sp = await searchParams;
  return (
    <section className="w-full h-full  flex flex-col gap-2">
      <Searchbar label="Favorites" />
      <Suspense fallback={<TablePending />}>
        <FavoriteProperties searchParams={sp} />
      </Suspense>
    </section>
  );
}
