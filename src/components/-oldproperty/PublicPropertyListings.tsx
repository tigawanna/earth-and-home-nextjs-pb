import { PropertyCard } from "@/components/-oldproperty/list/PropertyCard";
import { Card } from "@/components/ui/card";
import { getProperties } from "@/DAL/pocketbase/property-queries";
import { PropertyFilters as PropertyFiltersType, PropertySortBy, SortOrder } from "@/DAL/pocketbase/property-types";
import { Home } from "lucide-react";

export const dynamic = "force-dynamic";

interface PublicPropertyListingsProps {
  searchParams: { [key: string]: string | string[] | undefined };
  limit?: number; // Optional limit for pagination
}

export async function PublicPropertyListings({
  searchParams,
  limit,
}: PublicPropertyListingsProps) {

  // Convert search params to filters
  const filters: PropertyFiltersType = {
    search: searchParams?.search as string || "",
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

  const sortBy = (searchParams?.sortBy as PropertySortBy) || "createdAt";
  const sortOrder = (searchParams?.sortOrder as SortOrder) || "desc";
  const page = searchParams?.page ? Number(searchParams?.page) : 1;

  // Get properties with filters
  const result = await getProperties({
    filters,
    sortBy,
    sortOrder,
    page,
    limit: limit || 24,
  });

  const properties = result.success ? result.properties : [];
  const totalCount = result.success ? result.pagination.totalCount : 0;

  // Render empty state if no properties
  if (properties.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <p className="text-muted-foreground">
            {totalCount} {totalCount === 1 ? "property" : "properties"} available
          </p>
        </div>

        <Card className="p-8 text-center">
          <div className="space-y-4">
            <Home className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">No properties found</h3>
              <p className="text-muted-foreground">
                No properties match your current filters.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Properties</h1>
        <p className="text-muted-foreground">
          {totalCount} {totalCount === 1 ? "property" : "properties"} available
        </p>
      </div>

      {/* Properties Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
          />
        ))}
      </div>
    </div>
  );
}
