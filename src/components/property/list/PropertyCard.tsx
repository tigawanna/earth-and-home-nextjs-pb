/**
 * @deprecated Use LinkedPropertyCard for server components or InteractivePropertyCard for client components
 * This component is kept for backward compatibility but will be removed in a future version
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getImageThumbnailUrl } from "@/lib/pocketbase/files";
import type { PropertiesResponse } from "@/lib/pocketbase/types/pb-types";
import { Bath, Bed, Camera, Heart, MapPin, Square } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PropertyCardProps {
  property: PropertiesResponse;
  className?: string;
  showFavoriteButton?: boolean;
  onFavoriteClick?: (propertyId: string) => void;
  isFavorited?: boolean;
}

export function PropertyCard({
  property,
  className,
  showFavoriteButton = false,
  onFavoriteClick,
  isFavorited = false,
}: PropertyCardProps) {
  // Get the primary image or first gallery image
  const primaryImageFilename = property.image_url || 
    (Array.isArray(property.images) && property.images.length > 0 
      ? (typeof property.images[0] === 'string' ? property.images[0] : null)
      : null);

  const imageUrl = primaryImageFilename 
    ? getImageThumbnailUrl(property, primaryImageFilename, "400x300")
    : null;

  // Format price
  const formatPrice = (price: number | null, currency = "KES") => {
    if (!price) return "Price on request";
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const mainPrice =
    property.listing_type === "sale"
      ? property.sale_price || property.price
      : property.rental_price || property.price;

  return (
    <Card className={`group overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      <div className="relative aspect-[4/3] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Camera className="h-12 w-12 text-muted-foreground" />
          </div>
        )}

        {/* Property badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant={property.status === "active" ? "default" : "secondary"}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </Badge>
          {property.is_featured && (
            <Badge variant="destructive">⭐ Featured</Badge>
          )}
          {property.is_new && (
            <Badge className="bg-green-600 hover:bg-green-700">New</Badge>
          )}
        </div>

        {/* Favorite button */}
        {showFavoriteButton && (
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-3 right-3 bg-white/80 hover:bg-white ${
              isFavorited ? "text-red-500" : "text-gray-600"
            }`}
            onClick={(e) => {
              e.preventDefault();
              onFavoriteClick?.(property.id);
            }}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
          </Button>
        )}

        {/* Listing type badge */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="outline" className="bg-white/90">
            For {property.listing_type === "sale" ? "Sale" : "Rent"}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Price */}
          <div>
            <p className="text-2xl font-bold text-primary">
              {formatPrice(mainPrice, property.currency || "KES")}
            </p>
            {property.listing_type === "rent" && (
              <p className="text-sm text-muted-foreground">per month</p>
            )}
          </div>

          {/* Title and Location */}
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              <Link href={`/properties/${property.id}`}>
                {property.title}
              </Link>
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{property.location}</span>
            </div>
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
            {property.building_size_sqft && (
              <div className="flex items-center gap-1">
                <Square className="h-4 w-4" />
                <span>{property.building_size_sqft.toLocaleString()} sqft</span>
              </div>
            )}
          </div>

          {/* View Details Button */}
          <Button asChild className="w-full">
            <Link href={`/properties/${property.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
