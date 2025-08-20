"use client"

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toggleFavorite } from "@/data-access-layer/pocketbase/favorite-mutations";
import { getImageThumbnailUrl } from "@/lib/pocketbase/files";
import { FavoritesResponse, PropertiesResponse, UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { Eye, MoreHorizontal, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface FavoritesTableProps {
  favorites: FavoritesResponse[];
}

export function FavoritesTable({ favorites = [] }: FavoritesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(() => {
    return (favorites || []).filter((f) => {
      const prop = (f.expand && (f.expand as any).property_id) as PropertiesResponse | undefined;
      const user = (f.expand && (f.expand as any).user_id) as UsersResponse | undefined;
      const title = (prop?.title || "").toString().toLowerCase();
      const location = ([prop?.city, prop?.state, prop?.country].filter(Boolean).join(", ") || "").toLowerCase();
      const userLabel = (user?.name || user?.email || "").toString().toLowerCase();

      const q = searchTerm.toLowerCase();
      return (
        title.includes(q) ||
        location.includes(q) ||
        userLabel.includes(q) ||
        (prop?.id || "").includes(q)
      );
    });
  }, [favorites, searchTerm]);

  async function handleRemoveFavorite(fav: FavoritesResponse) {
    const propertyId = typeof fav.property_id === "string" ? fav.property_id : (fav.property_id as any)?.id;
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

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search favorites..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
      </div>

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
            {filtered.map((f) => {
              const prop = (f.expand && (f.expand as any).property_id) as PropertiesResponse | undefined;
              const user = (f.expand && (f.expand as any).user_id) as UsersResponse | undefined;
              const primary = prop?.image_url || (Array.isArray(prop?.images) && prop!.images.length > 0 && typeof prop!.images[0] === "string" ? prop!.images[0] : null);
              const imageUrl = primary ? getImageThumbnailUrl(prop as PropertiesResponse, primary, "120x90") : null;

              const location = prop ? [prop.city, prop.state, prop.country].filter(Boolean).join(", ") : "";

              return (
                <TableRow key={f.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-muted/40">
                        {imageUrl ? (
                          <Image src={imageUrl} alt={prop?.title || "property"} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
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
                    <div className="text-sm">{f.created ? new Date(f.created).toLocaleDateString() : "-"}</div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={prop ? `/properties/${prop.id}` : '#'} className="inline-block">
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
                            <Link href={prop ? `/properties/${prop.id}` : '#'} className="flex items-center">
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

      {filtered.length === 0 && <div className="text-center py-8 text-muted-foreground">No favorites found.</div>}
    </div>
  );
}
