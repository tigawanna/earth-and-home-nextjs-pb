"use client";
import { FavoritesStats } from "@/components/property/dashboard/admin-cards/FavoritesStats";
import { PropertiesStats } from "@/components/property/dashboard/admin-cards/PropertiesStats";
import { QuickActionsCard } from "@/components/property/dashboard/admin-cards/QuickAvtionsCard";
import { UsersStats } from "@/components/property/dashboard/admin-cards/UsersStats";
import { RecentPropertiesTable } from "@/components/property/dashboard/recent/RecentPropertiesTable";
import { useLocalViewer } from "@/data-access-layer/pocketbase/auth";

export default function DashboardPage() {
  const { data } = useLocalViewer();
  const isAdmin = data?.viewer?.is_admin;
  return (
    <div className="space-y-6 @container">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">Here's what's happening with your properties today.</p>
      </div>
      {/* Responsive Cards Grid: 1 col small, 2 cols md, 4 cols lg */}
      <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-fr">
        <PropertiesStats />
        <FavoritesStats />
        <UsersStats />
       <QuickActionsCard isAdmin={isAdmin} />
      </div>
      <RecentPropertiesTable />
    </div>
  );
}
