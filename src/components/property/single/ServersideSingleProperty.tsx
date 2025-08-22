import { getServerSidePropertyById } from "@/data-access-layer/pocketbase/properties/server-side-property-queries";

import { BaseSingleProperty } from "./BaseSingleProperty";
import { SinglePropertyNotFound } from "./single-property-query-states";


interface ServersideSinglePropertyProps {
  propertyId: string;
}

export async function ServersideSingleProperty({ propertyId }: ServersideSinglePropertyProps) {
  const result = await getServerSidePropertyById(propertyId);

  if (!result.success || !result.property) {
    return <SinglePropertyNotFound />;
  }

  const property = result.property;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <BaseSingleProperty property={property} />
    </div>
  );
}
