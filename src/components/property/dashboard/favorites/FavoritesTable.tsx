"use client";

import { TablePending } from "@/components/shared/TablePending";
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
import { dashboardFavoritesQueryOptions } from "@/data-access-layer/pocketbase/dashboard-queries";
import { toggleFavorite } from "@/data-access-layer/pocketbase/favorite-mutations";
import { getImageThumbnailUrl } from "@/lib/pocketbase/files";
import { FavoritesResponse, PropertiesResponse } from "@/lib/pocketbase/types/pb-types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { toast } from "sonner";

interface FavoritesTableProps {}

export function FavoritesTable({}: FavoritesTableProps) {
  const [queryStates, setQueryStats] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    q: parseAsString.withDefault(""),
  });
  const { data, error, isPending } = useSuspenseQuery(
    dashboardFavoritesQueryOptions({
      page: queryStates.page,
      q: queryStates.q,
    })
  );

  async function handleRemoveFavorite(fav: FavoritesResponse) {
    const propertyId =
      typeof fav.property_id === "string" ? fav.property_id : (fav.property_id as any)?.id;
    const userId = typeof fav.user_id === "string" ? fav.user_id : (fav.user_id as any)?.id;
    if (!propertyId || !userId) return toast.error("Missing identifiers");

    try {
      await toggleFavorite(propertyId, userId);
      toast.success("Toggled favorite");
    } catch (e) {
      console.error(e);
      toast.error("Failed to toggle favorite");
    }
  }

  if (isPending) {
    return <TablePending />;
  }

  const favorites = data?.result?.items || [];
  if (favorites.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No favorites found.</div>;
  }
  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
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
              const prop = f.expand?.property_id?.[0];
              const user = f.expand?.user_id?.[0];
              const primary =
                prop?.image_url ||
                (Array.isArray(prop?.images) &&
                prop!.images.length > 0 &&
                typeof prop!.images[0] === "string"
                  ? prop!.images[0]
                  : null);
              const imageUrl = primary
                ? getImageThumbnailUrl(prop as PropertiesResponse, primary, "120x90")
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
                    <div className="font-medium">{user?.name || user?.email || "-"}</div>
                    <div className="text-sm text-muted-foreground">{user?.email || "-"}</div>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm">
                      {f.created ? new Date(f.created).toLocaleDateString() : "-"}
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={prop ? `/properties/${prop.id}` : "#"} className="inline-block">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>

                      <Button variant="ghost" size="sm" onClick={() => handleRemoveFavorite(f)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={prop ? `/properties/${prop.id}` : "#"}
                              className="flex items-center">
                              <Eye className="w-4 h-4 mr-2" />
                              View property
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash2 className="w-4 h-4 mr-2 text-destructive" />
                            Remove favorite
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
    </div>
  );
}
