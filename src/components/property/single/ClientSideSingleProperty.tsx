import { useQuery } from "@tanstack/react-query";
import { BaseSingleProperty } from "./BaseSingleProperty";
import { dashboardPropertyByIdQueryOptions } from "@/data-access-layer/pocketbase/properties/client-side-property-queries";
import { SinglePropertyLoadingFallback, SinglePropertyNotFound } from "./single-property-query-states";

interface ClientSideSinglePropertyProps {
  propertyId: string;
}

export function ClientSideSingleProperty({ propertyId }: ClientSideSinglePropertyProps) {
  const { data,isPending } = useQuery(dashboardPropertyByIdQueryOptions({ propertyId }));
  const property = data?.result;
    if (isPending) {
      return <SinglePropertyLoadingFallback />;
    }
    if (!property) {
      return <SinglePropertyNotFound />;
    }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <BaseSingleProperty property={property} />
    </div>
  );
}
