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
    <Card
      className={`group relative w-full overflow-hidden border border-border/60 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85 shadow-sm transition-colors duration-300 ${className}`}
    >
      {/* Media */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted/40">
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={title ? `${title} image` : "Property image"}
              fill
              priority={false}
              sizes="(max-width:768px) 100vw, 400px"
              className="object-cover select-none"
            />
            {/* Soft gradient for legibility */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 via-background/10 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/60">
            <div className="text-center">
              <Home className="h-12 w-12 mx-auto mb-2 opacity-70" />
              <p className="text-xs font-medium tracking-wide uppercase">No Image</p>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2">
          <div className="flex gap-2 flex-wrap">
            {is_featured && (
              <Badge className="bg-primary text-primary-foreground shadow-none hover:bg-primary/90">Featured</Badge>
            )}
            {is_new && (
              <Badge variant="secondary" className="shadow-none">New</Badge>
            )}
          </div>
          <Badge
            variant={status === "active" ? "outline" : "secondary"}
            className={`shadow-none border-border/40 text-xs font-medium ${
              status === "active" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {status === "active" ? "Active" : status || "Inactive"}
          </Badge>
        </div>

        {/* Listing type */}
        <div className="absolute bottom-2 left-2">
          <Badge variant="outline" className="bg-background/60 backdrop-blur-sm border-border/40 text-[10px] uppercase tracking-wide">
            {listing_type === "sale" ? "For Sale" : "For Rent"}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-4">
        <div className="space-y-1.5">
          <h3 className="font-semibold text-base leading-tight line-clamp-2 text-foreground transition-colors group-hover:text-primary">
            {title ?? "Untitled Property"}
          </h3>
          <div className="flex items-center gap-1.5 text-muted-foreground/90 text-xs">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-primary/70" />
            <span className="line-clamp-1 flex-1">{locationLabel || "Location not specified"}</span>
          </div>
        </div>

        <div className="space-y-0.5">
          <div className="flex items-baseline gap-2">
            <div className="text-xl font-bold text-foreground">
              {formatPrice(currency, mainPrice)}
            </div>
            {listing_type === "rent" && (
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">/month</div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-5 text-xs font-medium text-foreground/90">
          {beds && beds > 0 && (
            <div className="flex items-center gap-1.5">
              <Bed className="h-4 w-4 text-primary" />
              <span>{beds}</span>
              <span className="text-muted-foreground">bed{beds !== 1 ? "s" : ""}</span>
            </div>
          )}
          {baths && baths > 0 && (
            <div className="flex items-center gap-1.5">
              <Bath className="h-4 w-4 text-primary" />
              <span>{baths}</span>
              <span className="text-muted-foreground">bath{baths !== 1 ? "s" : ""}</span>
            </div>
          )}
          {building_size_sqft && (
            <div className="flex items-center gap-1.5">
              <Square className="h-4 w-4 text-primary" />
              <span>{building_size_sqft.toLocaleString()}</span>
              <span className="text-muted-foreground">sqft</span>
            </div>
          )}
        </div>

        {property_type && (
            <Badge variant="outline" className="text-[10px] font-medium bg-muted/40 border-border/40 tracking-wide">
              {String(property_type)
                .replace(/_/g, " ")
                .split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </Badge>
        )}

        {(ownerExpanded?.[0] || agentExpanded?.[0]) && (
          <div className="flex items-center gap-3 pt-3 border-t border-border/50">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={ownerExpanded?.[0]?.avatar ?? agentExpanded?.[0]?.avatar}
                alt={ownerExpanded?.[0]?.name ?? agentExpanded?.[0]?.name ?? "Agent"}
              />
              <AvatarFallback className="text-[10px] font-medium">
                {(ownerExpanded?.[0]?.name ?? agentExpanded?.[0]?.name ?? "A")?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate text-foreground group-hover:text-primary">
                {ownerExpanded?.[0]?.name ?? agentExpanded?.[0]?.name ?? "Property Owner"}
              </div>
              <div className="text-[11px] text-muted-foreground leading-none mt-0.5">
                {ownerExpanded?.[0] ? "Owner" : "Agent"}
                {created && (
                  <span className="ml-1">· {formatDistanceToNowStrict(new Date(created), { addSuffix: true })}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {showFooterActions && footerActions && (
        <CardFooter className="px-4 py-3 border-t border-border/60 bg-muted/20">
          <div className="flex items-center gap-2 w-full text-sm">
            {footerActions}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
