import { FavoriteProperties } from "@/components/dashboard/favorites/FavoriteProperties";
import { FavoritesSerachbar } from "@/components/dashboard/favorites/FavoritesSerachbar";
import { Searchbar } from "@/components/shared/Searchbar";
import { TablePending } from "@/components/shared/TablePending";
import { Heart } from "lucide-react";
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
      <FavoritesSerachbar className="w-full" />
      <Suspense fallback={<TablePending />}>
        <FavoriteProperties searchParams={sp} />
      </Suspense>
    </section>
  );
}
