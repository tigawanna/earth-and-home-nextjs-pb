import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";
import { PropertyWithAgent } from "@/DAL/drizzle/property-types";
import { ClientPropertyCard } from "./ClientPropertyCard";

interface PropertyListProps {
  properties: PropertyWithAgent[];
  showActions?: boolean;
  showFavorite?: boolean;
}

export function PropertyList({ 
  properties, 
  showActions = true, 
  showFavorite = true
}: PropertyListProps) {
  if (properties.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="space-y-4">
          <Home className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold">No properties found</h3>
            <p className="text-muted-foreground">
              {showActions 
                ? "Create your first property listing to get started."
                : "No properties match your current filters."
              }
            </p>
          </div>
          {showActions && (
            <Button asChild>
              <Link href="/dashboard/properties/new">Add Property</Link>
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <ClientPropertyCard
          key={property.id}
          property={property}
          showActions={showActions}
          showFavorite={showFavorite}
        />
      ))}
    </div>
  );
}
