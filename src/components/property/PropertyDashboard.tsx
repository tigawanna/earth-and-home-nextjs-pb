import { PropertyFilters } from "@/components/property/list/PropertyFilters";
import { Button } from "@/components/ui/button";
import { UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { DashboardPropertiesList } from "@/components/property/list/DashboardPropertiesList";
import { PropertiesListLoading } from "@/components/property/query-states/PropertiesListLoading";

interface PropertyDashboardProps {
  user: UsersResponse | null;
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export function PropertyDashboard({ user, searchParams }: PropertyDashboardProps) {
  const isAdmin = user?.is_admin;

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex justify-between items-center">
        {isAdmin && (
          <Button asChild className="fixed bottom-8 right-8 ">
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
      <Suspense fallback={<PropertiesListLoading />}>
        <DashboardPropertiesList user={user} searchParams={searchParams} />
      </Suspense>
      {/* Quick Actions Card */}
    </div>
  );
}
