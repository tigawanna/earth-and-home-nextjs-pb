import { PropertyDashboard } from "@/components/property/PropertyDashboard";
import { getServerSideUserwithAgent } from "@/data-access-layer/user/server-side-auth";

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { user, agent } = await getServerSideUserwithAgent();
  const params = await searchParams;
  return <PropertyDashboard user={user} agent={agent} searchParams={params} />;
}
