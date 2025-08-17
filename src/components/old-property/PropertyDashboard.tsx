import { PropertyFilters } from "@/components/property/list/PropertyFilters";
import { Button } from "@/components/ui/button";
import { getProperties } from "@/data-access-layer/pocketbase/property-queries";
import { PropertyFilters as PropertyFiltersType, PropertySortBy, SortOrder } from "@/data-access-layer/pocketbase/property-types";
import { Plus } from "lucide-react";
import Link from "next/link";
import { PropertyList } from "./list/PropertyList";

interface PropertyDashboardProps {
  searchParams: { [key: string]: string | string[] | undefined };
  userId?: string;
  showActions?: boolean;
  showFavorite?: boolean;
  title?: string;
  showStatusFilter?: boolean;
  agentFilter?: boolean; // Whether to filter by user's properties only
}

export async function PropertyDashboard({
  searchParams,
  userId,
  showActions = true,
  showFavorite = true,
  title = "Properties",
  showStatusFilter = true,
  agentFilter = false,
}: PropertyDashboardProps) {
  // Convert search params to filters
  const filters: PropertyFiltersType = {
    ...(agentFilter && userId ? { agentId: userId } : {}), // Only add agentId if filtering by user
    search: searchParams?.search as string || "",
    propertyType: searchParams?.propertyType as string || "",
    listingType: searchParams?.listingType as "sale" | "rent",
    status: searchParams?.status as string || "",
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

  // Fetch properties with filters
  const result = await getProperties({
    filters,
    sortBy,
    sortOrder,
    page,
    limit: 20,
    userId,
  });

  const properties = result.success ? result.properties : [];
  const totalCount = result.success ? result.pagination.totalCount : 0;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">
            {totalCount} {totalCount === 1 ? "property" : "properties"} found
          </p>
        </div>
        {showActions && (
          <Button asChild>
            <Link href="/dashboard/properties/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <PropertyFilters 
        showStatusFilter={showStatusFilter}
      />

      {/* Properties List */}
      <PropertyList
        properties={properties}
        showActions={showActions}
        showFavorite={showFavorite}
      />
    </div>
  );
}
