import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { Calendar, Shield, User } from "lucide-react";

interface DashboardWelcomeProps {
  user: UsersResponse | null;
  className?: string;
}

export function DashboardWelcome({ user, className }: DashboardWelcomeProps) {
  if (!user) return null;

  return (
    <Card className={`bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20 ${className || ""}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                Welcome back, {user.name || "User"}!
              </h1>
              {user.is_admin && (
                <Badge variant="destructive" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              )}
              {user.verified && (
                <Badge variant="default" className="text-xs">
                  <User className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              Here's what's happening with your properties and account today.
            </p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date().toLocaleDateString()}
            </div>
            <div className="mt-1">
              Member since {new Date(user.created).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
