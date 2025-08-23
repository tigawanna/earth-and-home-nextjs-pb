import { PropertyDashboard } from "@/components/dashboard/properties/PropertyDashboard";
import { getServerSideUser } from "@/data-access-layer/pocketbase/user/server-side-auth";

export default async function PropertiesPage({}: {}) {
  const user = await getServerSideUser();
  return <PropertyDashboard user={user} />;
}
