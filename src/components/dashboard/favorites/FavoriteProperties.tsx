import { getServerSideSearchableFavorites } from "@/data-access-layer/pocketbase/properties/server-side-property-queries";
import { FavoritesTable } from "./FavoritesTable";

interface FavoritePropertiesProps {
  searchParams?: {
    [key: string]: string | string[] | undefined;
    page?: string;
    q?: string;
  };
}

export async function FavoriteProperties({ searchParams }: FavoritePropertiesProps) {
  const result = await getServerSideSearchableFavorites({
    q: searchParams?.q || "",
    page: typeof searchParams?.page === "string" ? parseInt(searchParams.page, 10) : 1,
    limit: 50,
  });
  console.log("FavoriteProperties result:", searchParams);
  return (
    <div className="space-y-6">
      <FavoritesTable data={result} />
    </div>
  );
}
