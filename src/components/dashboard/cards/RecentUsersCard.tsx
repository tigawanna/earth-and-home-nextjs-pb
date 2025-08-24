import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { Clock, Users } from "lucide-react";
import Link from "next/link";

interface RecentUsersCardProps {
  users: UsersResponse[];
  className?: string;
}

export function RecentUsersCard({ users, className }: RecentUsersCardProps) {
  return (
    <Card className={`${className || ""}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Users className="h-4 w-4" />
          Recent Users
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {users.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent users</p>
        ) : (
          users.map((user) => (
            <div key={user.id} className="flex items-center justify-between gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm line-clamp-1">
                    {user.name || "Unnamed User"}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {user.email}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {new Date(user.created).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge 
                  variant={user.verified ? "default" : "secondary"}
                  className="text-xs"
                >
                  {user.verified ? "Verified" : "Unverified"}
                </Badge>
                {user.is_admin && (
                  <Badge variant="destructive" className="text-xs">
                    Admin
                  </Badge>
                )}
              </div>
            </div>
          ))
        )}
        {users.length > 0 && (
          <Link 
            href="/dashboard/users"
            className="block text-center text-xs text-primary hover:underline pt-2 border-t"
          >
            View all users
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
