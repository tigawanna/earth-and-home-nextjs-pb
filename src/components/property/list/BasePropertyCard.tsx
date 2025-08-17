import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { PropertiesResponse } from "@/lib/pocketbase/types/pb-types";
import { UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { formatDistanceToNowStrict } from "date-fns";

type PropertiesResponseWithExpandedRelations = PropertiesResponse & {
  expand?: {
    owner_id?: UsersResponse[] | undefined;
    agent_id?: UsersResponse[] | undefined;
  } | undefined;
};

interface BasePropertyCardProps {
  property: PropertiesResponseWithExpandedRelations;
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

export function BasePropertyCard({ property }: BasePropertyCardProps) {
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

  const imageSrc =
    image_url ||
    (Array.isArray(images) && images.length ? images[0] : undefined) ||
    "/apple-icon.png";

  const locationLabel = [city, state, country].filter(Boolean).join(", ");

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0">
        <AspectRatio ratio={16 / 11} className="w-full overflow-hidden rounded-t-md">
          <img
            src={imageSrc}
            alt={title ?? "Property image"}
            className="object-cover w-full h-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/apple-icon.png";
            }}
          />
        </AspectRatio>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate">{title ?? "Untitled property"}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {locationLabel || "Location not set"}
            </p>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <span className="text-lg font-semibold">{formatPrice(currency, price)}</span>
            <div className="flex items-center gap-2">
              {listing_type && (
                <Badge variant="secondary" className="capitalize">
                  {listing_type}
                </Badge>
              )}
              {status && (
                <Badge variant="outline" className="capitalize">
                  {status}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-medium">{beds ?? 0}</span>
            <span>bd</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{baths ?? 0}</span>
            <span>ba</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{building_size_sqft ?? "—"}</span>
            <span>sqft</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={ownerExpanded?.[0]?.avatar ?? agentExpanded?.[0]?.avatar} />
              <AvatarFallback>
                {(ownerExpanded?.[0]?.name ?? agentExpanded?.[0]?.name)?.[0] ?? "AG"}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <div className="font-medium">
                {ownerExpanded?.[0]?.name ?? agentExpanded?.[0]?.name ?? "Owner"}
              </div>
              <div className="text-muted-foreground text-xs">
                {property_type ? String(property_type).replace("_", " ") : "Property"}
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            <div>
              Added{" "}
              {created ? formatDistanceToNowStrict(new Date(created), { addSuffix: true }) : "—"}
            </div>
            {updated && (
              <div>
                Updated{" "}
                {updated ? formatDistanceToNowStrict(new Date(updated), { addSuffix: true }) : "—"}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {is_featured && <Badge variant="destructive">Featured</Badge>}
          {is_new && <Badge variant="outline">New</Badge>}
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost">
            Save
          </Button>
          <Button size="sm">View</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
