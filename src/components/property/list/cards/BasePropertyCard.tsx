import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getImageThumbnailUrl } from "@/lib/pocketbase/files";
import { PropertiesResponse, UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { formatDistanceToNowStrict } from "date-fns";
import { Bath, Bed, Home, MapPin, Square } from "lucide-react";
import Image from "next/image";

type PropertiesResponseWithExpandedRelations = PropertiesResponse & {
  expand?: {
    owner_id?: UsersResponse[] | undefined;
    agent_id?: UsersResponse[] | undefined;
  } | undefined;
};

interface BasePropertyCardProps {
  property: PropertiesResponseWithExpandedRelations;
  className?: string;
  showFooterActions?: boolean;
  footerActions?: React.ReactNode;
}

function formatPrice(currency: string | undefined, price: number | undefined) {
  if (!price) return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency || "KES",
      maximumFractionDigits: 0,
    }).format(price);
  } catch (e) {
    return `${currency ?? ""} ${price}`;
  }
}

export function BasePropertyCard({ 
  property, 
  className,
  showFooterActions = false,
  footerActions 
}: BasePropertyCardProps) {
  const {
    id,
    title,
    city,
    state,
    country,
    image_url,
    images,
    listing_type,
    property_type,
    beds,
    baths,
    building_size_sqft,
    price,
    currency,
    is_featured,
    is_new,
    created,
    updated,
    owner_id,
    agent_id,
    status,
  } = property;

  const ownerExpanded = property.expand?.owner_id;
  const agentExpanded = property.expand?.agent_id;

  // Get the primary image or first gallery image
  const primaryImageFilename = image_url || 
    (Array.isArray(images) && images.length > 0 
      ? (typeof images[0] === 'string' ? images[0] : null)
      : null);

  const imageUrl = primaryImageFilename 
    ? getImageThumbnailUrl(property, primaryImageFilename, "400x300")
    : null;

  // Get main price based on listing type
  const mainPrice = listing_type === "sale" 
    ? (property.sale_price || price)
    : (property.rental_price || price);

  const locationLabel = [city, state, country].filter(Boolean).join(", ");

  return (
    <Card className={`group relative w-full max-w-sm overflow-hidden border-0 bg-card shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className}`}>
      {/* Image Section with Enhanced Overlay */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={title ?? "Property image"}
              fill
              className="object-cover transition-colors duration-300"
            />
            {/* Gradient overlay for better badge contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-foreground/10" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10 flex items-center justify-center">
            <div className="text-center text-muted-foreground/60">
              <Home className="h-16 w-16 mx-auto mb-2" />
              <p className="text-sm font-medium">No Image</p>
            </div>
          </div>
        )}
        
        {/* Top badges container */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2">
          {/* Left side - Feature badges */}
          <div className="flex gap-2">
            {is_featured && (
              <Badge className="bg-gradient-to-r from-earth-orange-500 to-earth-orange-600 hover:from-earth-orange-600 hover:to-earth-orange-700 text-white border-0 shadow-lg backdrop-blur-sm">
                ⭐ Featured
              </Badge>
            )}
            {is_new && (
              <Badge className="bg-gradient-to-r from-earth-green-500 to-earth-green-600 hover:from-earth-green-600 hover:to-earth-green-700 text-white border-0 shadow-lg backdrop-blur-sm">
                ✨ New
              </Badge>
            )}
          </div>

          {/* Right side - Status badge */}
          <Badge 
            variant={status === "active" ? "default" : "secondary"}
            className={`capitalize shadow-lg backdrop-blur-sm border-0 ${
              status === "active" 
                ? "bg-gradient-to-r from-earth-green-500 to-earth-green-600 text-white" 
                : "bg-card/90 text-muted-foreground"
            }`}
          >
            {status === "active" ? "🟢 Active" : status || "Inactive"}
          </Badge>
        </div>

        {/* Bottom overlay with listing type */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/60 via-foreground/30 to-transparent p-3">
          <Badge variant="outline" className="bg-card/95 backdrop-blur-md border-border/20 text-foreground font-medium shadow-lg">
            🏡 For {listing_type === "sale" ? "Sale" : "Rent"}
          </Badge>
        </div>
      </div>

      {/* Content Section with Enhanced Spacing */}
      <CardContent className="p-5 space-y-4">
        {/* Title and Location */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {title ?? "Untitled Property"}
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0 text-primary/70" />
            <span className="text-sm line-clamp-1 flex-1">
              {locationLabel || "Location not specified"}
            </span>
          </div>
        </div>

        {/* Price with enhanced styling */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg">
              {formatPrice(currency, mainPrice)}
            </div>
            {listing_type === "rent" && (
              <div className="text-sm text-muted-foreground font-medium">/month</div>
            )}
          </div>
        </div>

        {/* Property Details with Better Icons */}
        <div className="flex items-center gap-6 text-sm">
          {beds && beds > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10">
                <Bed className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="font-semibold text-foreground">{beds}</span>
              <span className="text-muted-foreground">bed{beds !== 1 ? 's' : ''}</span>
            </div>
          )}
          {baths && baths > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-chart-2/10">
                <Bath className="h-3.5 w-3.5 text-chart-2" />
              </div>
              <span className="font-semibold text-foreground">{baths}</span>
              <span className="text-muted-foreground">bath{baths !== 1 ? 's' : ''}</span>
            </div>
          )}
          {building_size_sqft && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-chart-4/10">
                <Square className="h-3.5 w-3.5 text-chart-4" />
              </div>
              <span className="font-semibold text-foreground">{building_size_sqft.toLocaleString()}</span>
              <span className="text-muted-foreground text-xs">sqft</span>
            </div>
          )}
        </div>

        {/* Property Type Badge */}
        {property_type && (
          <div className="flex justify-start">
            <Badge variant="outline" className="text-xs bg-muted/50 border-border/20">
              {String(property_type).replace("_", " ").split(" ").map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(" ")}
            </Badge>
          </div>
        )}

        {/* Agent/Owner Info with Enhanced Design */}
        {(ownerExpanded?.[0] || agentExpanded?.[0]) && (
          <div className="flex items-center gap-3 pt-3 border-t border-border/50">
            <Avatar className="h-9 w-9 ring-2 ring-primary/10">
              <AvatarImage 
                src={ownerExpanded?.[0]?.avatar ?? agentExpanded?.[0]?.avatar} 
                alt="Agent/Owner"
              />
              <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                {(ownerExpanded?.[0]?.name ?? agentExpanded?.[0]?.name ?? "Agent")?.[0]?.toUpperCase() ?? "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate text-foreground">
                {ownerExpanded?.[0]?.name ?? agentExpanded?.[0]?.name ?? "Property Owner"}
              </div>
              <div className="text-xs text-muted-foreground">
                {ownerExpanded?.[0] ? "👤 Owner" : "🏢 Agent"}
                {created && (
                  <span className="ml-2">
                    • {formatDistanceToNowStrict(new Date(created), { addSuffix: true })}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Enhanced Footer Actions */}
      {showFooterActions && footerActions && (
        <CardFooter className="px-5 py-4 bg-gradient-to-r from-muted/30 to-muted/20 border-t border-border/50">
          <div className="flex items-center gap-2 w-full">
            {footerActions}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
