import { Building2, MessageSquare, Users } from "lucide-react";
import { StatsCard } from "../cards/StatsCard";

interface AdminDashboardStatsGridProps {
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
  messagesStats: {
    total: number;
    parentMessages: number;
    unrepliedMessages: number;
  };
  className?: string;
}

export function AdminDashboardStatsGrid({
  propertyStats,
  userStats,
  messagesStats,
  className,
}: AdminDashboardStatsGridProps) {
  return (
    <div
      className={`grid grid-cols-1 @sm:grid-cols-2 @2xl:grid-cols-3 gap-4 ${
        className || ""
      }`}>
      <StatsCard
        title="Total Properties"
        value={propertyStats.total}
        description="All listings in system"
        icon={<Building2 className="h-4 w-4" />}
        link={{
          href: "/dashboard/properties",
          label: "Manage Properties"
        }}
      />

      <StatsCard
        title="Total Users"
        value={userStats.total}
        description="Registered users"
        icon={<Users className="h-4 w-4" />}
        link={{
          href: "/dashboard/users",
          label: "Manage Users"
        }}
      />

      <StatsCard
        title="Messages"
        value={messagesStats.total}
        description={`${messagesStats.unrepliedMessages} unreplied inquiries`}
        icon={<MessageSquare className="h-4 w-4" />}
        link={{
          href: "/dashboard/messages",
          label: "View Messages"
        }}
      />
    </div>
  );
}
