import { PropertyFilters } from "@/components/property/list/PropertyFilters";
import { createBrowserClient } from "@/lib/pocketbase/browser-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PropertyList } from "./list/PropertyList";

interface FavoritesDashboardProps {

}

export function FavoritesDashboard({}: FavoritesDashboardProps) {


  // Get user's favorite properties
  const { data } = useSuspenseQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      try {
        const client = createBrowserClient();
        const result = await client.from("favorites").getList(1, 100, {
          sort: "-created",
          select:{
            expand:{
              "property_id":true
            }
          }
        });
        return {
          success: true,
          result,
        };
      } catch (error: unknown) {
        return {
          success: false,
          result:null,
          message: error instanceof Error ? error.message : String(error),
        };
      }
    },
  })

  const properties = data.success ? data?.result?.items : [];
  const totalCount = data.success ? data?.result?.totalItems : 0;

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
