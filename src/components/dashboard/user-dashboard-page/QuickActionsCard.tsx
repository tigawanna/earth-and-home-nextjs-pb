import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MapPin, Search } from "lucide-react";
import Link from "next/link";

export function QuickActionsCard() {
  const quickActions = [
    {
      title: "Search Properties",
      description: "Find your perfect home",
      icon: Search,
      href: "/properties",
    },
    {
      title: "View Favorites",
      description: "See your saved properties",
      icon: Heart,
      href: "/dashboard/favorites",
    },
    {
      title: "Browse by Location",
      description: "Explore different areas",
      icon: MapPin,
      href: "/properties?view=map",
    },
  ];

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {quickActions.map((action) => (
          <Button
            key={action.title}
            asChild
            variant="outline"
            className="h-auto w-full justify-start p-4"
          >
            <Link href={action.href} className="flex w-full flex-row items-start gap-3">
              <action.icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
              <span className="flex min-w-0 flex-col items-start gap-1 text-left">
                <span className="font-medium leading-tight">{action.title}</span>
                <span className="text-xs leading-snug text-muted-foreground">{action.description}</span>
              </span>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
