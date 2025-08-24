import { Activity, Building2, Heart, Users } from "lucide-react";
import { StatsCard } from "./StatsCard";

interface DashboardStatsGridProps {
  propertyStats: {
    total: number;
    active: number;
  };
  userStats: {
    total: number;
  };
  favoritesStats: {
    total: number;
  };
  className?: string;
}

export function DashboardStatsGrid({ 
  propertyStats, 
  userStats, 
  favoritesStats, 
  className 
}: DashboardStatsGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className || ""}`}>
      <StatsCard
        title="Total Properties"
        value={propertyStats.total}
        description="All listings in system"
        icon={<Building2 className="h-4 w-4" />}
      />
      <StatsCard
        title="Active Properties"
        value={propertyStats.active}
        description="Currently available"
        icon={<Activity className="h-4 w-4" />}
      />
      <StatsCard
        title="Total Users"
        value={userStats.total}
        description="Registered users"
        icon={<Users className="h-4 w-4" />}
      />
      <StatsCard
        title="Total Favorites"
        value={favoritesStats.total}
        description="Properties saved"
        icon={<Heart className="h-4 w-4" />}
      />
    </div>
  );
}
