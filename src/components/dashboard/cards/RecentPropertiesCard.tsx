import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PropertiesResponse } from "@/lib/pocketbase/types/pb-types";
import { getImageThumbnailUrl } from "@/lib/pocketbase/utils/files";
import { Building2, Clock, MapPin } from "lucide-react";
import Image from "next/image";
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
          properties.map((property) => {
            // Get the first available image for thumbnail
            const primaryImage = property.image_url || (Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : null);
            const imageUrl = primaryImage && typeof primaryImage === 'string' 
              ? getImageThumbnailUrl(property, primaryImage, "80x80")
              : null;
           
            return (
            <div key={property.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
              {/* Property Image */}
              <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={property.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
              
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
            );
          })
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
