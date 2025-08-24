
import { getProperties } from "@/data-access-layer/pocketbase/properties/server-side-property-queries";
import { PropertiesResponseWithExpandedRelations, PropertyFilters, PropertySortBy, SortOrder } from "@/data-access-layer/pocketbase/property-types";
import { UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { ListPagination } from "@/lib/react-responsive-pagination/ListPagination";
import { PropertiesEmpty } from "../query-states/PropertiesEmpty";
import { LinkedPropertyCard } from "./cards/LinkedPropertyCard";

interface DashboardPropertiesListProps {
  user: UsersResponse | null;
  limit?: number; // Optional limit for pagination
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export async function DashboardPropertiesList({ user, limit, searchParams }: DashboardPropertiesListProps) {
  // Convert search params to filters
  const filters: PropertyFilters = {
    search: (searchParams?.search as string) || "",
    propertyType: searchParams?.propertyType as string,
    listingType: searchParams?.listingType as "sale" | "rent",
    status: "active", // Only show active properties in public view
    minPrice: searchParams?.minPrice ? Number(searchParams?.minPrice) : undefined,
    maxPrice: searchParams?.maxPrice ? Number(searchParams?.maxPrice) : undefined,
    beds: searchParams?.beds ? Number(searchParams?.beds) : undefined,
    baths: searchParams?.baths ? Number(searchParams?.baths) : undefined,
    city: searchParams?.city as string,
    isFeatured: searchParams?.featured === "true" ? true : undefined,
  };

  const sortBy = (searchParams?.sortBy as PropertySortBy) || "created";
  const sortOrder = (searchParams?.sortOrder as SortOrder) || "desc";
  const page = searchParams?.page ? Number(searchParams?.page) : 1;

  // Get properties with filters
  const result = await getProperties({
    filters,
    sortBy,
    sortOrder,
    page,
    limit: limit || 50, // Default to 50 if no limit provided
  });


  const properties = result.success ? result.properties : [];
  const totalPages = result.success ? result.pagination.totalPages : 0;

  // Render empty state if no properties
  if (properties.length === 0) {
    return <PropertiesEmpty />;
  }
  return (
    <div className="w-full h-full flex  flex-col items-center ">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full">
        {properties.map((property) => (
          <LinkedPropertyCard
            basePath="/dashboard/"
            key={property.id}
            property={property as PropertiesResponseWithExpandedRelations}
            currentUserId={user?.id}
          />
        ))}
      </div>
      <ListPagination totalPages={totalPages} />
    </div>
  );
}
