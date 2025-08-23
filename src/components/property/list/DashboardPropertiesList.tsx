"use client";
import { dashboardPropertyQueryOptions } from "@/data-access-layer/pocketbase/properties/client-side-property-queries";
import { useQueryPage } from "@/hooks/use-query-page";
import { ListPagination } from "@/lib/react-responsive-pagination/ListPagination";
import { useSuspenseQuery } from "@tanstack/react-query";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { PropertiesEmpty } from "../query-states/PropertiesEmpty";
import { BasePropertyCard } from "./cards/BasePropertyCard";
import { LinkedPropertyCard } from "./cards/LinkedPropertyCard";
import { UsersResponse } from "@/lib/pocketbase/types/pb-types";

interface DashboardPropertiesListProps {
    user: UsersResponse | null;
}

export function DashboardPropertiesList({ user }: DashboardPropertiesListProps) {
  const currentPage = useQueryPage();

  // const [isPending, startTransition] = useTransition();
  const [queryState] = useQueryStates({
    search: parseAsString.withDefault(""),
    propertyType: parseAsString,
    listingType: parseAsString,
    status: parseAsString,
    maxPrice: parseAsInteger,
    beds: parseAsInteger,
    baths: parseAsInteger,
    city: parseAsString,
    featured: parseAsString,
    minPrice: parseAsInteger,
    sortBy: parseAsString.withDefault("created"),
    sortOrder: parseAsString.withDefault("desc"),
  });

  const { data } = useSuspenseQuery(
    dashboardPropertyQueryOptions({
      page: currentPage,
      q: queryState.search,
      filters: queryState as any,
      limit: 50,
    })
  );

  const properties = data?.result?.items || [];
  const totalPages = data?.result?.totalPages || 0;
  // Render empty state if no properties
  if (properties.length === 0) {
    return <PropertiesEmpty />;
  }
  return (
    <div className="w-full h-full flex  flex-col items-center ">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full">
        {properties.map((property) => (
          <LinkedPropertyCard
            href={`/dashboard/properties/${property.id}`}
            key={property.id}
            property={property}
            currentUserId={user?.id}
          />
        ))}
      </div>
      <ListPagination totalPages={totalPages} />
    </div>
  );
}
