
import { PropertyDashboard } from "@/components/property/PropertyDashboard";
import { getServerSideUser } from "@/data-access-layer/user/server-side-auth";

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await getServerSideUser();
  const params = await searchParams;
  return <PropertyDashboard user={user} searchParams={params} />;
}
