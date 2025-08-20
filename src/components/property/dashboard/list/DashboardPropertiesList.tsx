import { browserPB } from "@/lib/pocketbase/browser-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { BasePropertyCard } from "../../list/cards/BasePropertyCard";

interface DashboardPropertiesListProps {}

export function DashboardPropertiesList({}: DashboardPropertiesListProps) {
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
    page: parseAsInteger.withDefault(1),
  });

  const { data } = useSuspenseQuery({
    queryKey: ["properties", "dashboard"],
    queryFn: async () => {
      const response = await browserPB.from("properties").getList(1, 50, {});
      return response;
    },
  });
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Dashboard Properties List</h1>
      <div className="w-full max-w-4xl">
        {data.items.map((property) => (
          <BasePropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
