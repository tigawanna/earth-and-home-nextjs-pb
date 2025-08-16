import { PropertyList } from "./list/PropertyList";
import { PropertyFilters } from "@/components/property/list/PropertyFilters";
import { getFavoriteProperties } from "@/DAL/drizzle/property-queries";

interface FavoritesDashboardProps {
  searchParams: { [key: string]: string | string[] | undefined };
  userId: string;
}

export async function FavoritesDashboard({
  searchParams,
  userId,
}: FavoritesDashboardProps) {
  const page = searchParams.page ? Number(searchParams.page) : 1;

  // Get user's favorite properties
  const result = await getFavoriteProperties(userId, page, 20);

  const properties = result.success ? result.properties : [];
  const totalCount = result.success ? result.pagination.totalCount : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Favorites</h1>
          <p className="text-muted-foreground">
            {totalCount} {totalCount === 1 ? "property" : "properties"} found
          </p>
        </div>
      </div>

      {/* Filters - Hide status filter for favorites */}
      <PropertyFilters 
        showStatusFilter={false}
      />

      {/* Properties List */}
      <PropertyList
        properties={properties}
        showActions={false}
        showFavorite={true}
      />
    </div>
  );
}
