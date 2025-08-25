import { AdminActionsCard } from "@/components/dashboard/cards/AdminActionsCard";
import { DashboardOverview } from "@/components/dashboard/cards/DashboardOverview";
import { DashboardStatsGrid } from "@/components/dashboard/cards/DashboardStatsGrid";
import { DashboardWelcome } from "@/components/dashboard/cards/DashboardWelcome";
import { RecentPropertiesCard } from "@/components/dashboard/cards/RecentPropertiesCard";
import { RecentUsersCard } from "@/components/dashboard/cards/RecentUsersCard";
import { getDashboardStats } from "@/data-access-layer/admin/admin-stats";
import { getServerSideUser } from "@/data-access-layer/pocketbase/user/server-side-auth";

interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const sp = await searchParams;
  const user = await getServerSideUser();
  const dashboardData = await getDashboardStats();

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
    <section className="w-full h-full p-6 space-y-6">
      {/* Welcome Section */}
      <DashboardWelcome user={user} />

      {/* Stats Grid */}
      <DashboardStatsGrid
        propertyStats={propertyStats}
        userStats={userStats}
        favoritesStats={favoritesStats}
      />

      <RecentPropertiesCard properties={recentProperties} />
      {/* Recent Users Section (Admin Only) */}
      {user?.is_admin && <RecentUsersCard users={recentUsers} />}
    </section>
  );
}
