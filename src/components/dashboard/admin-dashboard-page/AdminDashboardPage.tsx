import { getAdminDashboardStats } from "@/data-access-layer/admin/admin-stats";
import { RecentPropertiesCard } from "./RecentPropertiesCard";
import { RecentUsersCard } from "./RecentUsersCard";
import { AdminDashboardStatsGrid } from "./AdminDashboardStatsGrid";

interface AdminDashboardPageProps {
  
}

export async function AdminDashboardPage({  }: AdminDashboardPageProps) {

  const dashboardData = await getAdminDashboardStats();

  if (!dashboardData.success || !dashboardData.data) {
    return (
      <section className="w-full h-full flex flex-col items-center justify-center">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </section>
    );
  }

  const { propertyStats, userStats, favoritesStats, recentProperties, recentUsers } =
    dashboardData.data;
  return (
    <div className="w-full h-full p-6 space-y-6 @container">
      {/* Welcome Section */}

      {/* Stats Grid */}
      <AdminDashboardStatsGrid
        propertyStats={propertyStats}
        userStats={userStats}
        favoritesStats={favoritesStats}
      />
      <div className="w-full flex flex-col @2xl:flex-row gap-6">
        <RecentPropertiesCard properties={recentProperties} />
        <RecentUsersCard users={recentUsers} />
      </div>
    </div>
  );
}
