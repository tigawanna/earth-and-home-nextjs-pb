import { browserPB } from "@/lib/pocketbase/browser-client";
import { PropertiesResponse } from "@/lib/pocketbase/types/pb-types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { eq } from "@tigawanna/typed-pocketbase";
import { BasePropertyCard } from "../../list/BasePropertyCard";

interface FavoritePropertiesListProps {}

export function FavoritePropertiesList({}: FavoritePropertiesListProps) {
  const user = browserPB.authStore.record!;
  const { data } = useSuspenseQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async () => {
      try {
        const result = await browserPB.from("favorites").getList(1, 100, {
          filter: eq("user_id", user?.id),
          sort: "-created",
          select: {
            expand: {
              property_id: true,
            },
          },
        });
        return {
          success: true,
          result,
        };
      } catch (error: unknown) {
        return {
          success: false,
          result: null,
          message: error instanceof Error ? error.message : String(error),
        };
      }
    },
  });

  const favorites = data.success ? data?.result?.items : [];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {favorites?.map((property) => {
          if (!property.expand?.property_id) {
            return null; // Skip if no property data
          }
          return (
            <BasePropertyCard
              key={property.id}
              property={property.expand?.property_id as any as PropertiesResponse}
            />
          );
        })}
      </div>
    </div>
  );
}
