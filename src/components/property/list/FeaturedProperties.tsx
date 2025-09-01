import { getServerSideFeaturedProperties } from "@/data-access-layer/properties/server-side-property-queries";
import { Building2 } from "lucide-react";
import { LinkedPropertyCard } from "./cards/LinkedPropertyCard";

interface FeaturedPropertiesProps {
  limit?: number;
}

export async function FeaturedPropertiesList({ limit = 10 }: FeaturedPropertiesProps) {
  const result = await getServerSideFeaturedProperties({ limit });

  if (!result.success || result.properties.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center py-8">
        <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No featured properties available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center gap-6">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full">
        {result.properties.map((property) => {
          return <LinkedPropertyCard key={property.id} property={property} />;
        })}
      </div>
    </div>
  );
}
