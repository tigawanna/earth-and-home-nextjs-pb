"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FavoritesResponse, PropertiesResponse, UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { getImageThumbnailUrl } from "@/lib/pocketbase/utils/files";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface FavoriteRowProps {
  fav: FavoritesResponse &{
    expand?: {
      property_id?: PropertiesResponse | undefined;
      user_id?: UsersResponse | undefined;
    } | undefined;
  }
  onRemove: (fav: FavoritesResponse) => void;
}

export function FavoriteRow({ fav, onRemove }: FavoriteRowProps) {
  
  const prop = fav.expand?.property_id;
  const user = fav.expand?.user_id;
  const primary =
    prop?.image_url ||
    (Array.isArray(prop?.images) && prop!.images.length > 0 && typeof prop!.images[0] === "string"
      ? prop!.images[0]
      : null);
  const imageUrl = primary ? getImageThumbnailUrl(prop as PropertiesResponse, primary, "400x300") : null;

  const location = prop ? [prop.city, prop.state, prop.country].filter(Boolean).join(", ") : "";

  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <div className="w-24 h-16 relative rounded-md overflow-hidden bg-muted/40 flex-shrink-0">
          {imageUrl ? (
            <Image src={imageUrl} alt={prop?.title || "property"} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-medium text-sm line-clamp-1">{prop?.title || "Untitled"}</div>
              <div className="text-xs text-muted-foreground line-clamp-1">{location}</div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={prop ? `/properties/${prop.id}` : "#"} className="inline-block" >
                <Button variant="ghost" size="sm" aria-label={`View property ${prop?.title || 'details'}`}>
                  <Eye className="w-4 h-4" />
                </Button>
              </Link>

              <Button variant="ghost" size="sm" onClick={() => onRemove(fav)} aria-label={`Remove ${prop?.title || 'property'} from favorites`}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" aria-label={`More actions for ${prop?.title || 'property'}`}>
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={prop ? `/properties/${prop.id}` : "#"} className="flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      View property
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => onRemove(fav)}>
                    <Trash2 className="w-4 h-4 mr-2 text-destructive" />
                    Remove favorite
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-2 text-xs text-muted-foreground">
            <div className="font-medium">{user?.name || user?.email || "-"}</div>
            <div>{user?.email || "-"}</div>
          </div>

          <div className="mt-3 text-xs text-muted-foreground">{fav.created ? new Date(fav.created).toLocaleDateString() : "-"}</div>
        </div>
      </div>
    </Card>
  );
}
