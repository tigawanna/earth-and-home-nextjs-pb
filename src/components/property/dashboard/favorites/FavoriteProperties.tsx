"use client";
import { Input } from "@/components/ui/input";
import { dashboardFavoritesQueryOptions } from "@/data-access-layer/pocketbase/dashboard-queries";
import { browserPB } from "@/lib/pocketbase/browser-client";
import { ListPagination } from "@/lib/react-responsive-pagination/ListPagination";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { Suspense } from "react";
import { TablePending } from "../../../shared/TablePending";
import { FavoritePropertiesList } from "./FavoritePropertiesList";
import { FavoritesTable } from "./FavoritesTable";

interface FavoritePropertiesProps {}

export function FavoriteProperties({}: FavoritePropertiesProps) {
  const router = useRouter();
  const user = browserPB.authStore.record;
  const [queryStates, setQueryStates] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    q: parseAsString.withDefault(""),
  });
  const { data } = useQuery(
    dashboardFavoritesQueryOptions({
      page: queryStates.page,
      q: queryStates.q,
    })
  );

  if (!user) {
    router.push("/auth/signin");
    return null; // Prevent rendering if user is not authenticated
  }
  const totalPages = data?.result?.totalPages || 1;
  return (
    <div className="space-y-6">
      <FavoritePropertiesList />
      {/* Search bar — updates URL search param `q` via nuqs */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search favorites by property, location or user..."
          value={queryStates.q ?? ""}
          onChange={(e) => setQueryStates({ page: 1, q: e.target.value })}
          className="pl-10 mb-2"
        />
      </div>

      <Suspense fallback={<TablePending />}>
        <FavoritesTable />
      </Suspense>
      <ListPagination totalPages={totalPages} />
    </div>
  );
}
