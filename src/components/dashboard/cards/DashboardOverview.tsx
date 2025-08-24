import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, TrendingUp } from "lucide-react";

interface DashboardOverviewProps {
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
    verified: number;
    admins: number;
    banned: number;
  };
  favoritesStats: {
    total: number;
  };
  className?: string;
}

export function DashboardOverview({ 
  propertyStats, 
  userStats, 
  favoritesStats, 
  className 
}: DashboardOverviewProps) {
  const activePropertyPercentage = propertyStats.total > 0 
    ? (propertyStats.active / propertyStats.total) * 100 
    : 0;
    
  const verifiedUserPercentage = userStats.total > 0 
    ? (userStats.verified / userStats.total) * 100 
    : 0;

  return (
    <Card className={`${className || ""}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4" />
          System Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Properties Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Properties</span>
            <span className="text-sm text-muted-foreground">{propertyStats.total} total</span>
          </div>
          <Progress value={activePropertyPercentage} className="h-2" />
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active:</span>
              <span className="font-medium">{propertyStats.active}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Featured:</span>
              <span className="font-medium">{propertyStats.featured}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sold:</span>
              <span className="font-medium">{propertyStats.sold}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Draft:</span>
              <span className="font-medium">{propertyStats.draft}</span>
            </div>
          </div>
        </div>

        {/* Users Overview */}
        <div className="space-y-2 border-t pt-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Users</span>
            <span className="text-sm text-muted-foreground">{userStats.total} total</span>
          </div>
          <Progress value={verifiedUserPercentage} className="h-2" />
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Verified:</span>
              <span className="font-medium">{userStats.verified}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Admins:</span>
              <span className="font-medium">{userStats.admins}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Banned:</span>
              <span className="font-medium text-red-500">{userStats.banned}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Favorites:</span>
              <span className="font-medium">{favoritesStats.total}</span>
            </div>
          </div>
        </div>

        {/* Growth Indicators */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <TrendingUp className="h-3 w-3 text-green-500" />
          <span className="text-xs text-muted-foreground">
            System health: {activePropertyPercentage.toFixed(1)}% properties active
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
