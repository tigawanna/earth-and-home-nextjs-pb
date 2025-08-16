import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Home, Bed, Bath } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PropertyWithAgent } from "@/DAL/drizzle/property-types";
import { EditPropertyLink } from "../dashboard/EditPropertyLink";

interface PropertyCardProps {
  property: PropertyWithAgent;
  customActions?: React.ReactNode;
}

export function PropertyCard({ 
  property, 
  customActions
}: PropertyCardProps) {
  const formatPrice = () => {
    const price = property.salePrice || property.rentalPrice || property.price;
    if (!price) return "Price on request";
    
    const formatted = new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: property.currency || "KES",
      maximumFractionDigits: 0,
    }).format(price);

    return property.listingType === "rent" ? `${formatted}/month` : formatted;
  };

  const defaultActions = (
    <div className="flex gap-2 pt-2">
      <Button asChild variant="outline" size="sm" className="flex-1">
        <Link href={`/properties/${property.slug}`}>View Details</Link>
      </Button>
      <EditPropertyLink id={property.id} />
      {property.isFavorited !== undefined && (
        <Button asChild variant="outline" size="sm">
          <Link href={`/properties/${property.slug}`}>
            <Heart
              className={`h-4 w-4 ${property.isFavorited ? "fill-red-500 text-red-500" : ""}`}
            />
          </Link>
        </Button>
      )}
    </div>
  );

  return (
    <Card className="overflow-hidden group">
      {/* Property Image */}
      <div className="aspect-video relative bg-muted">
        {property.imageUrl ? (
          <Image
            src={property.imageUrl}
            alt={property.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Home className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <Badge
            variant={
              property.status === "active" ? "default" :
              property.status === "sold" ? "destructive" :
              property.status === "rented" ? "secondary" :
              "outline"
            }
          >
            {property.status}
          </Badge>
        </div>

        {/* Listing Type Badge */}
        <div className="absolute top-2 right-2">
          <Badge variant="outline" className="bg-background/80">
            {property.listingType === "sale" ? "For Sale" : "For Rent"}
          </Badge>
        </div>

        {/* Featured Badge */}
        {property.isFeatured && (
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-yellow-500 text-yellow-50">
              ⭐ Featured
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="space-y-2">
          <CardTitle className="line-clamp-1">
            <Link 
              href={`/properties/${property.slug}`}
              className="hover:underline"
            >
              {property.title}
            </Link>
          </CardTitle>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">{property.location}</span>
          </div>

          <div className="text-lg font-bold text-primary">
            {formatPrice()}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Property Details */}
          <div className="flex gap-4 text-sm text-muted-foreground">
            {property.beds && (
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{property.beds} bed{property.beds !== 1 ? "s" : ""}</span>
              </div>
            )}
            {property.baths && (
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{property.baths} bath{property.baths !== 1 ? "s" : ""}</span>
              </div>
            )}
          </div>

          {/* Agent Info */}
          {property.agent && (
            <div className="text-xs text-muted-foreground">
              Listed by {property.agent.name}
            </div>
          )}

          {/* Actions */}
          {customActions || defaultActions}
        </div>
      </CardContent>
    </Card>
  );
}
