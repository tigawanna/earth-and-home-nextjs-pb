import { PropertyFilters } from "@/components/property/list/PropertyFilters";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@/lib/pocketbase/browser-client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DashboardPropertiesList } from "./list/DashboardPropertiesList";
import { useLocalViewer } from "@/data-access-layer/pocketbase/auth";

interface PropertyDashboardProps {}

export function PropertyDashboard({}: PropertyDashboardProps) {
  const client = createBrowserClient();
  const { data } = useLocalViewer();
  const isAdmin = data?.viewer?.is_admin;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        {isAdmin && (
          <Button asChild>
            <Link href="/dashboard/properties/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Link>
          </Button>
        )}
      </div>
      {/* Filters */}
      <PropertyFilters showStatusFilter={isAdmin} />
      {/* Properties List */}
      <DashboardPropertiesList />
    </div>
  );
}
