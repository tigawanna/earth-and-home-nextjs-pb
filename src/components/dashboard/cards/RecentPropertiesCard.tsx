import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PropertiesResponse } from "@/lib/pocketbase/types/pb-types";
import { Building2, Clock, MapPin } from "lucide-react";
import Link from "next/link";

interface RecentPropertiesCardProps {
  properties: PropertiesResponse[];
  className?: string;
}

export function RecentPropertiesCard({ properties, className }: RecentPropertiesCardProps) {
  return (
    <Card className={`${className || ""}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Recent Properties
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {properties.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent properties</p>
        ) : (
          properties.map((property) => (
            <div key={property.id} className="flex items-start justify-between gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
              <div className="flex-1 min-w-0">
                <Link 
                  href={`/properties/${property.id}`}
                  className="font-medium text-sm hover:text-primary transition-colors line-clamp-1"
                >
                  {property.title}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {property.location}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {new Date(property.created).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge 
                  variant={property.status === "active" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {property.status}
                </Badge>
                {property.price && (
                  <span className="text-xs font-medium">
                    ${property.price.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
        {properties.length > 0 && (
          <Link 
            href="/dashboard/properties"
            className="block text-center text-xs text-primary hover:underline pt-2 border-t"
          >
            View all properties
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
