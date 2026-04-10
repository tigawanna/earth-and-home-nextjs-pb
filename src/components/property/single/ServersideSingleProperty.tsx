import { getServerSidePropertyById } from "@/data-access-layer/properties/server-side-property-queries";
import { getServerSideUserwithAgent } from "@/data-access-layer/user/server-side-auth";
import { canManageProperty } from "@/lib/property/can-manage-property";
import { BaseSingleProperty } from "./BaseSingleProperty";
import { SinglePropertyNotFound } from "./single-property-query-states";

interface ServersideSinglePropertyProps {
  propertyId: string;
}

export async function ServersideSingleProperty({ propertyId }: ServersideSinglePropertyProps) {
  const result = await getServerSidePropertyById(propertyId);
  const { user, agent } = await getServerSideUserwithAgent();

  if (!result.success || !result.property) {
    return <SinglePropertyNotFound />;
  }

  const property = result.property;
  const canManage = user ? canManageProperty(user, agent, property) : false;

  return (
    <div className="w-full h-full">
      <BaseSingleProperty property={property} user={user} canManage={canManage} />
    </div>
  );
}
