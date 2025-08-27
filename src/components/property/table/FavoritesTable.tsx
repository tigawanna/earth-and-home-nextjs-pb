"use client";

import { TableEmpty } from "@/components/shared/TableEmpty";
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
import { dashboardFavoritesQueryOptions } from "@/data-access-layer/properties/client-side-property-queries";
import { toggleFavorite } from "@/data-access-layer/properties/favorite-mutations";
import { getNuqsQueryParamKeys } from "@/lib/nuqs/get-keys";
import {
  FavoritesResponse,
  PropertiesResponse,
  UsersResponse,
} from "@/lib/pocketbase/types/pb-types";
import { getImageThumbnailUrl } from "@/lib/pocketbase/utils/files";
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
    return <TableEmpty querykeys={getNuqsQueryParamKeys(queryStates)} />;
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
              const property = f.expand?.property_id as any as PropertiesResponse | undefined;
              const user = f.expand?.user_id as any as UsersResponse | undefined;
              const primary = property?.images?.[0];

              const imageUrl = primary
                ? getImageThumbnailUrl(property as PropertiesResponse, primary, "120x90")
                : null;

              const location = property
                ? [property.city, property.state, property.country].filter(Boolean).join(", ")
                : "";

              return (
                <TableRow key={f.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-muted/40">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={property?.title || "property"}
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
                        <div className="font-medium">{property?.title || "Untitled"}</div>
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
                      <Link href={property ? `/properties/${property.id}` : "#"} className="inline-block">
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
                              href={property ? `/properties/${property.id}` : "#"}
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
