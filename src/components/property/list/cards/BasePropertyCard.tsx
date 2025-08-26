import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PropertiesResponseWithExpandedRelations } from "@/data-access-layer/property-types";
import { getImageThumbnailUrl } from "@/lib/pocketbase/utils/files";
import { Calendar, Home, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";



interface BasePropertyCardProps {
  property: PropertiesResponseWithExpandedRelations;
  className?: string;
  showFooterActions?: boolean;
  footerActions?: React.ReactNode;
  showViewButton?: boolean;
  href?: string;
  /**
   * When true, wraps the main card content (excluding footer) with a Link
   * The footer remains outside the link for interactive elements
   */
  wrapWithLink?: boolean;
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
  footerActions,
  showViewButton = true,
  href,
  wrapWithLink = false,
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

  // Get the primary image or first gallery image
  const primaryImageFilename =
    image_url ||
    (Array.isArray(images) && images.length > 0
      ? typeof images[0] === "string"
        ? images[0]
        : null
      : null);

  const imageUrl = primaryImageFilename
    ? getImageThumbnailUrl(property, primaryImageFilename, "400x300")
    : null;

  // Get main price from the unified price field (previously sale_price/rental_price are now merged into price)
  const mainPrice = price;

  const locationLabel = [city, state, country].filter(Boolean).join(", ");

  // Card content that should be clickable (wrapped in Link)
  const cardContent = (
    <div className="flex flex-col h-full" >
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
              className="object-cover select-none group-hover:scale-105 transition-transform duration-300"
            />
            {/* Soft gradient for legibility */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/60">
            <div className="text-center">
              <Home className="h-12 w-12 mx-auto mb-2 opacity-70" />
              <p className="text-xs font-medium tracking-wide uppercase">No Image</p>
            </div>
          </div>
        )}

        {/* Status Badges - Keep these in the image for visual hierarchy */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2">
          <div className="flex gap-2 flex-wrap">
            {is_featured ? (
              <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0">
                Featured
              </Badge>
            ) : null}
            {is_new ? (
              <Badge className="bg-green-500 hover:bg-green-600 text-white border-0">New</Badge>
            ) : null}
            <Badge variant={listing_type === "sale" ? "default" : "secondary"} className="border-0">
              {listing_type === "sale" ? "For Sale" : "For Rent"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-1">
        {/* Property Type Badge */}
        {property_type ? (
          <div className="mb-2">
            <Badge
              variant="outline"
              className="border-border/60 bg-background/60 text-[10px] font-medium uppercase tracking-wide">
              {property_type.replace(/_/g, " ")}
            </Badge>
          </div>
        ) : null}

        <div className="flex flex-wrap items-start justify-between mb-3">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {title ?? "Untitled Property"}
          </h3>
          <div className="text-right min-w-fit flex items-center">
            <div className="font-bold text-xl text-primary">
              {mainPrice ? formatPrice(currency, mainPrice) : "Price on request"}
            </div>
            {listing_type === "rent" ? (
              <div className="text-sm text-muted-foreground">/month</div>
            ) : null}
          </div>
        </div>

        <div className="flex items-center text-muted-foreground mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm line-clamp-1">{locationLabel || "Location not specified"}</span>
        </div>

        {property.description ? (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-1">{property.description}</p>
        ) : null}

        {property.available_from ? (
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Available from {new Date(property.available_from).toLocaleDateString()}</span>
          </div>
        ) : null}
      </CardContent>
    </div>
  );

  return (
    <Card
      className={`group relative py-0 w-full justify-between gap-2 overflow-hidden border border-border/60 bg-card shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}>
      {/* Main card content - optionally wrapped with Link */}
      {wrapWithLink && href ? (
        <Link href={href} className="block">
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}

      {/* Footer - Always outside the link for interactive elements */}
      {showFooterActions && footerActions ? (
        <CardFooter className="border-t py-2 border-border/60 bg-muted/20 ">
          {footerActions}
        </CardFooter>
      ) : null}
    </Card>
  );
}
