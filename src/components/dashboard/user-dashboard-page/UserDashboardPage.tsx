import { getServerSideUser } from "@/data-access-layer/user/server-side-auth";
import { getUserDashboardStats } from "@/data-access-layer/user/user-dashboard";
import { Calendar, Heart, Home, TrendingUp } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { QuickActionsCard } from "./QuickActionsCard";
import { RecentFavoritesCard } from "./RecentFavoritesCard";
import { StatCard } from "./StatCard";

interface UserDashboardPageProps {}

async function DashboardContent() {
  const user = await getServerSideUser();
  
  if (!user) {
    redirect("/auth/signin");
  }

  const stats = await getUserDashboardStats({ userId: user.id });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Favorites"
          value={stats.totalFavorites}
          description="Properties you've saved"
          icon={Heart}
        />
        <StatCard
          title="Recent Activity"
          value={stats.recentFavorites.length}
          description="Favorites this week"
          icon={TrendingUp}
        />
        <StatCard
          title="Account Type"
          value="User"
          description="Standard member"
          icon={Home}
        />
        <StatCard
          title="Member Since"
          value={new Date(user.created).getFullYear()}
          description="Year joined"
          icon={Calendar}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Favorites */}
        <RecentFavoritesCard favorites={stats.recentFavorites} />
        
        {/* Quick Actions */}
        <QuickActionsCard />
      </div>
    </div>
  );
}

export function UserDashboardPage({}: UserDashboardPageProps) {
  return (
    <div className="w-full">
      <Suspense fallback={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-muted rounded animate-pulse" />
            <div className="h-96 bg-muted rounded animate-pulse" />
          </div>
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
