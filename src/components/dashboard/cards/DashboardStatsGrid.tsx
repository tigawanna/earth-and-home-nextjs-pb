import { Activity, Building2, CheckCircle, FileText, Heart, Home, Star, Users } from "lucide-react";
import { StatsCard } from "./StatsCard";

interface DashboardStatsGridProps {
  propertyStats: {
    total: number;
    active: number;
    sold: number;
    rented: number;
    draft: number;
    featured: number;
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
        title="Sold Properties"
        value={propertyStats.sold}
        description="Successfully sold"
        icon={<CheckCircle className="h-4 w-4" />}
      />
      <StatsCard
        title="Rented Properties"
        value={propertyStats.rented}
        description="Currently rented"
        icon={<Home className="h-4 w-4" />}
      />
      <StatsCard
        title="Draft Properties"
        value={propertyStats.draft}
        description="Pending publication"
        icon={<FileText className="h-4 w-4" />}
      />
      <StatsCard
        title="Featured Properties"
        value={propertyStats.featured}
        description="Highlighted listings"
        icon={<Star className="h-4 w-4" />}
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
