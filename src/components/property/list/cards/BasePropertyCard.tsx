import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PropertyWithFavorites } from "@/data-access-layer/properties/property-types";
import { propertyImageNeedsUnoptimized } from "@/lib/property/property-image-unoptimized";
import { getPrimaryDisplayImageUrl } from "@/lib/property/resolve-thumbnail-url";
import { Home, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BasePropertyCardProps {
  property: PropertyWithFavorites;
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
  } catch {
    return `${currency ?? ""} ${price}`;
  }
}

export function BasePropertyCard({
  property,
  className,
  showFooterActions = false,
  footerActions,
  showViewButton: _showViewButton = true,
  href,
  wrapWithLink = false,
}: BasePropertyCardProps) {
  const {
    title,
    city,
    state,
    country,
    listing_type,
    property_type,
    price,
    currency,
    is_featured,
    is_new,
    status,
  } = property;

  const imageUrl = getPrimaryDisplayImageUrl(property, "400x300");

  // Get main price from the unified price field (previously sale_price/rental_price are now merged into price)
  const mainPrice = price;

  const locationLabel = [city, state, country].filter(Boolean).join(", ");

  // Card content that should be clickable (wrapped in Link)
  const cardContent = (
    <div className="flex flex-col h-full">
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
              unoptimized={propertyImageNeedsUnoptimized(imageUrl)}
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

        {/* Sold/Rented Banner */}
        {(status === "sold" || status === "rented") && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute inset-0 bg-black/50" />
            <div
              className={`
                relative z-10 transform -rotate-12 px-8 py-2 font-bold text-white text-lg uppercase tracking-widest shadow-lg
                ${
                  status === "sold"
                    ? "bg-red-700 border-2 border-red-600"
                    : "bg-blue-700 border-2 border-blue-600"
                }
              `}
              style={{
                textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
              }}
            >
              {status === "sold" ? "SOLD" : "RENTED"}
            </div>
          </div>
        )}

        {/* Status Badges - Keep these in the image for visual hierarchy */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2">
          <div className="flex gap-2 flex-wrap">
            {is_featured ? (
              <Badge className="bg-orange-700 hover:bg-orange-800 text-white border-0 font-medium shadow-sm">
                Featured
              </Badge>
            ) : null}
            {is_new ? (
              <Badge className="bg-green-700 hover:bg-green-800 text-white border-0 font-medium shadow-sm">
                New
              </Badge>
            ) : null}
            <Badge
              className={`border-0 font-medium shadow-sm ${
                listing_type === "sale"
                  ? "bg-blue-700 hover:bg-blue-800 text-white"
                  : "bg-purple-700 hover:bg-purple-800 text-white"
              }`}
            >
              {listing_type === "sale" ? "For Sale" : "For Rent"}
            </Badge>
          </div>
        </div>
      </div>

      <CardContent className="px-4 pt-3 pb-4 space-y-2">
        <div className="flex items-center gap-2">
          {property_type ? (
            <Badge
              variant="outline"
              className="text-[10px] font-semibold uppercase tracking-wider"
            >
              {property_type.replace(/_/g, " ")}
            </Badge>
          ) : null}
        </div>

        <h3 className="font-semibold text-base leading-tight line-clamp-1 group-hover:text-primary transition-colors">
          {title ?? "Untitled Property"}
        </h3>

        <div className="flex items-baseline gap-1">
          <span className="font-bold text-lg text-primary">
            {mainPrice ? formatPrice(currency, mainPrice) : "Price on request"}
          </span>
          {listing_type === "rent" && mainPrice ? (
            <span className="text-xs text-muted-foreground">/month</span>
          ) : null}
        </div>

        <div className="flex items-center text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
          <span className="text-sm line-clamp-1">{locationLabel || "Location not specified"}</span>
        </div>

        {property.description ? (
          <p className="text-sm text-muted-foreground line-clamp-2">{property.description}</p>
        ) : null}
      </CardContent>
    </div>
  );

  return (
    <Card
      className={`group relative py-0 w-full justify-between gap-2 overflow-hidden border border-border/60 bg-card shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}
    >
      {/* Main card content - optionally wrapped with Link */}
      {wrapWithLink && href ? (
        <Link
          href={href}
          className="block"
          aria-label={`View details for ${title || "property"} in ${locationLabel || "unspecified location"} - ${mainPrice ? formatPrice(currency, mainPrice) : "Price on request"}`}
        >
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
