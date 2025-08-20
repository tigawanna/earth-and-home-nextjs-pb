import { browserPB } from "@/lib/pocketbase/browser-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { BasePropertyCard } from "../../list/cards/BasePropertyCard";
import { dashboardPropertyQueryOptions } from "@/data-access-layer/pocketbase/dashboard-queries";
import { Card } from "@/components/ui/card";
import { Home } from "lucide-react";
import { PropertiesEmpty } from "../../query-states/PropertiesEmpty";
import { ListPagination } from "@/lib/react-responsive-pagination/ListPagination";

interface DashboardPropertiesListProps {}

export function DashboardPropertiesList({}: DashboardPropertiesListProps) {
  const [queryState] = useQueryStates(
    {
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
      page: parseAsInteger.withDefault(1),
    },
    {
      throttleMs: 5000, // Better for search inputs
    }
  );

  const { data } = useSuspenseQuery(
    dashboardPropertyQueryOptions({
      page: queryState.page,
      q: queryState.search,
      filters: queryState as any,
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
          <BasePropertyCard key={property.id} property={property} />
        ))}
      </div>
      <ListPagination totalPages={totalPages} />
    </div>
  );
}
