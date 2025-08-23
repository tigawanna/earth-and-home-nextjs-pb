import { getServerSidePropertyById } from "@/data-access-layer/pocketbase/properties/server-side-property-queries";

import { getServerSideUser } from "@/data-access-layer/pocketbase/user/server-side-auth";
import { BaseSingleProperty } from "./BaseSingleProperty";
import { SinglePropertyNotFound } from "./single-property-query-states";


interface ServersideSinglePropertyProps {
  propertyId: string;
}

export async function ServersideSingleProperty({ propertyId }: ServersideSinglePropertyProps) {
  const result = await getServerSidePropertyById(propertyId);
  const user = await getServerSideUser();

  if (!result.success || !result.property) {
    return <SinglePropertyNotFound />;
  }

  const property = result.property;

  return (
    <div className="w-full h-full">
      <BaseSingleProperty property={property} user={user} />
    </div>
  );
}
