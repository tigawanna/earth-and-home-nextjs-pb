import { FavoriteProperties } from "@/components/dashboard/favorites/FavoriteProperties";
import { FavoritesSearchbar } from "@/components/dashboard/favorites/FavoritesSearchbar";
import { TablePending } from "@/components/shared/TablePending";
import { Suspense } from "react";

interface FavoritesPageProps {
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
    page?: string;
    q?: string;
  }>;
}

export default async function FavoritesPage({ searchParams }: FavoritesPageProps) {
  const sp = await searchParams;
  return (
    <section className="w-full h-full  flex flex-col gap-2 @container">
      <FavoritesSearchbar className="w-full" />
      <Suspense fallback={<TablePending />}>
        <FavoriteProperties searchParams={sp} />
      </Suspense>
    </section>
  );
}
