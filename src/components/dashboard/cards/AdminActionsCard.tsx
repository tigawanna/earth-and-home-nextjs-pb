import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Building2,
    Heart,
    Plus,
    Settings,
    Shield,
    UserCheck,
    Users
} from "lucide-react";
import Link from "next/link";

interface AdminActionsCardProps {
  isAdmin: boolean;
  className?: string;
}

export function AdminActionsCard({ isAdmin, className }: AdminActionsCardProps) {
  return (
    <Card className={`${className || ""}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* User Actions */}
        <div className="space-y-2">
          <Button 
            variant="outline" 
            asChild 
            size="sm" 
            className="w-full justify-start text-xs"
          >
            <Link href="/dashboard/properties">
              <Building2 className="mr-2 h-3.5 w-3.5" />
              My Properties
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            asChild 
            size="sm" 
            className="w-full justify-start text-xs"
          >
            <Link href="/dashboard/favorites">
              <Heart className="mr-2 h-3.5 w-3.5" />
              Saved Properties
            </Link>
          </Button>
        </div>

        {/* Admin-only Actions */}
        {isAdmin && (
          <>
            <div className="border-t pt-2 mt-3">
              <p className="text-xs text-muted-foreground mb-2 font-medium">Admin Actions</p>
              <div className="space-y-2">
                <Button 
                  asChild 
                  size="sm" 
                  className="w-full justify-start text-xs"
                >
                  <Link href="/dashboard/properties/add">
                    <Plus className="mr-2 h-3.5 w-3.5" />
                    Add Property
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  asChild 
                  size="sm" 
                  className="w-full justify-start text-xs"
                >
                  <Link href="/dashboard/users">
                    <Users className="mr-2 h-3.5 w-3.5" />
                    Manage Users
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  asChild 
                  size="sm" 
                  className="w-full justify-start text-xs"
                >
                  <Link href="/dashboard/settings">
                    <UserCheck className="mr-2 h-3.5 w-3.5" />
                    User Verification
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  asChild 
                  size="sm" 
                  className="w-full justify-start text-xs"
                >
                  <Link href="/dashboard/admin">
                    <Shield className="mr-2 h-3.5 w-3.5" />
                    Admin Panel
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
