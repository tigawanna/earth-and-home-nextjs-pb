"use client";
import { dashboardFavoritesQueryOptions } from "@/data-access-layer/pocketbase/dashboard-queries";
import { browserPB } from "@/lib/pocketbase/browser-client";
import { ListPagination } from "@/lib/react-responsive-pagination/ListPagination";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { Suspense } from "react";
import { TablePending } from "../../../shared/TablePending";
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
      <Suspense fallback={<TablePending />}>
        <FavoritesTable />
      </Suspense>
      <ListPagination totalPages={totalPages} />
    </div>
  );
}
