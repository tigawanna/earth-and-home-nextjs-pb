import { PropertyDashboard } from "@/components/dashboard/properties/PropertyDashboard";
import { getServerSideUser } from "@/data-access-layer/pocketbase/user/server-side-auth";

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await getServerSideUser();
  const params = await searchParams;
  return <PropertyDashboard user={user} searchParams={params} />;
}
