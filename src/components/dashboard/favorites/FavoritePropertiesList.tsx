import { FavoritesResponse, PropertiesResponse } from "@/types/domain-types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BasePropertyCard } from "../../property/list/cards/BasePropertyCard";

interface FavoritePropertiesListProps {
  userId: string;
}

type FavoriteWithProperty = FavoritesResponse & {
  expand?: {
    property_id?: PropertiesResponse;
  };
};

interface FavoritesApiResponse {
  success: boolean;
  result: {
    items: FavoriteWithProperty[];
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export function FavoritePropertiesList({ userId }: FavoritePropertiesListProps) {
  const { data } = useSuspenseQuery({
    queryKey: ["favorites", userId],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/favorites?page=1&limit=100&q=`);
      if (!res.ok) {
        throw new Error("Failed to fetch favorites");
      }
      return res.json() as Promise<FavoritesApiResponse>;
    },
  });

  const favorites = data.success ? data.result?.items : [];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {favorites?.map((property) => {
          if (!property.expand?.property_id) {
            return null;
          }
          return (
            <BasePropertyCard
              key={property.id}
              property={property.expand.property_id}
            />
          );
        })}
      </div>
    </div>
  );
}
