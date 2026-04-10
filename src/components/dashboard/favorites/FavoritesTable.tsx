"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toggleFavorite } from "@/data-access-layer/properties/favorite-mutations";
import type {
  FavoritesResponse,
  PropertiesResponse,
  UsersResponse,
} from "@/types/domain-types";
import { propertyImageNeedsUnoptimized } from "@/lib/property/property-image-unoptimized";
import { resolvePropertyThumbnailUrl } from "@/lib/property/resolve-thumbnail-url";
import { ListPagination } from "@/lib/react-responsive-pagination/ListPagination";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { FavoriteRow } from "./FavoriteMobileRow";

interface FavoritesTableProps {
  data:
    | {
        success: boolean;
        result: {
          items: (FavoritesResponse & {
            expand?: {
              user_id?: UsersResponse;
              property_id?: PropertiesResponse;
            };
          })[];
          page: number;
          perPage: number;
          totalItems: number;
          totalPages: number;
        };
        message?: undefined;
      }
    | {
        success: boolean;
        result: null;
        message: string;
      };
}

export function FavoritesTable({ data }: FavoritesTableProps) {
  if (!data) return null;

  async function handleRemoveFavorite(fav: FavoritesResponse) {
    const propertyId =
      typeof fav.property_id === "string" ? fav.property_id : (fav.property_id as unknown as { id: string })?.id;
    const userId = typeof fav.user_id === "string" ? fav.user_id : (fav.user_id as unknown as { id: string })?.id;
    if (!propertyId || !userId) return toast.error("Missing identifiers");

    try {
      await toggleFavorite(propertyId, userId);
      toast.success("Toggled favorite");
    } catch (e) {
      console.error(e);
      toast.error("Failed to toggle favorite");
    }
  }

  const favorites = data?.result?.items || [];
  const totalPages = data?.result?.totalPages || 1;

  if (favorites.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8 text-muted-foreground">No favorites found.</div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:hidden">
        {favorites.map((f) => (
          <FavoriteRow key={f.id} fav={f as FavoritesResponse & { expand?: { property_id?: PropertiesResponse; user_id?: UsersResponse } }} onRemove={handleRemoveFavorite} />
        ))}
      </div>

      <div className="hidden md:block border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Favorited</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {favorites.map((f) => {
              const prop = f.expand?.property_id;
              const user = f.expand?.user_id;
              const primary =
                prop?.image_url ||
                (Array.isArray(prop?.images) &&
                prop!.images.length > 0 &&
                typeof prop!.images[0] === "string"
                  ? prop!.images[0]
                  : null);
              const imageUrl = primary && prop
                ? resolvePropertyThumbnailUrl(prop, primary, "400x300")
                : null;

              const location = prop
                ? [prop.city, prop.state, prop.country].filter(Boolean).join(", ")
                : "";

              return (
                <TableRow key={f.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-muted/40">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={prop?.title || "property"}
                            fill
                            className="object-cover"
                            unoptimized={propertyImageNeedsUnoptimized(imageUrl)}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            No image
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{prop?.title || "Untitled"}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{location}</div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="font-medium">
                      {user?.name || user?.email || "-"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user?.email || "-"}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm">
                      {f.created ? new Date(f.created).toLocaleDateString() : "-"}
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={prop ? `/properties/${prop.id}` : "#"}
                        className="inline-block"
                      >
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>

                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreHorizontal className="w-4 h-4" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Link
                              href={prop ? `/properties/${prop.id}` : "#"}
                              className="flex items-center gap-2 w-full"
                            >
                              <Eye className="w-4 h-4" />
                              View Property
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={() => handleRemoveFavorite(f)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                            Remove from Favorites
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <ListPagination totalPages={totalPages} />
    </div>
  );
}
