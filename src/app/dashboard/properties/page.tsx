import { PropertyDashboard } from "@/components/dashboard/properties/PropertyDashboard";
import { createServerClient } from "@/lib/pocketbase/clients/server-client";
import { UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { cookies } from "next/headers";

export default async function PropertiesPage({}: {}) {
    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
    const client = createServerClient(cookieStore);
    const { authStore } = client;
    const user = authStore.record as UsersResponse | null;
    console.log("Authenticated user in PropertiesPage:", user);
  return <PropertyDashboard />;
}
