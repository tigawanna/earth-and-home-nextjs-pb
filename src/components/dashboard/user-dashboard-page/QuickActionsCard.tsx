import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MapPin, Search, Settings } from "lucide-react";
import Link from "next/link";

export function QuickActionsCard() {
  const quickActions = [
    {
      title: "Search Properties",
      description: "Find your perfect home",
      icon: Search,
      href: "/properties",
      variant: "default" as const,
    },
    {
      title: "View Favorites",
      description: "See your saved properties",
      icon: Heart,
      href: "/dashboard/favorites",
      variant: "outline" as const,
    },
    {
      title: "Browse by Location",
      description: "Explore different areas",
      icon: MapPin,
      href: "/properties?view=map",
      variant: "outline" as const,
    },
    {
      title: "Account Settings",
      description: "Manage your profile",
      icon: Settings,
      href: "/dashboard/settings",
      variant: "outline" as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <Button
            key={action.title}
            asChild
            variant={action.variant}
            className="h-auto p-4 flex flex-col items-start space-y-2"
          >
            <Link href={action.href}>
              <div className="flex items-center space-x-2 w-full">
                <action.icon className="h-5 w-5" />
                <span className="font-medium">{action.title}</span>
              </div>
              <p className="text-xs text-muted-foreground text-left">
                {action.description}
              </p>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
