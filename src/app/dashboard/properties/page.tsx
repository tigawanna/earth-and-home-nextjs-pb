import { PropertyDashboard } from "@/components/dashboard/properties/PropertyDashboard";
import { getServerSideUser } from "@/data-access-layer/pocketbase/user/server--sideauth";
import { createServerClient } from "@/lib/pocketbase/clients/server-client";
import { UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { cookies } from "next/headers";

export default async function PropertiesPage({}: {}) {
  const user = await getServerSideUser();
  return <PropertyDashboard user={user} />;
}
