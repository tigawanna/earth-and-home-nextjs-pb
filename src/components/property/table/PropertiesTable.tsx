"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PropertiesResponse } from "@/lib/pocketbase/types/pb-types";
import { getImageThumbnailUrl } from "@/lib/pocketbase/utils/files";
import { Edit, Eye, MoreHorizontal, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

interface PropertiesTableProps {
  properties: PropertiesResponse[];
}

export function PropertiesTable({ properties }: PropertiesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return (properties || []).filter((p) => {
      const title = (p.title || "").toString().toLowerCase();
      const location = [p.city, p.state, p.country]
        .filter(Boolean)
        .join(", ")
        .toLowerCase();
      const matchesSearch =
        title.includes(searchTerm.toLowerCase()) ||
        location.includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || (p.status || "").toLowerCase() === statusFilter;
      const matchesType =
        typeFilter === "all" || (p.property_type || "").toLowerCase() === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [properties, searchTerm, statusFilter, typeFilter]);

  function formatPrice(price?: number, currency?: string) {
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

  function getStatusClass(status?: string) {
    switch ((status || "").toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "sold":
      case "rented":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-muted/10 text-muted-foreground";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
            <SelectItem value="rented">Rented</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {/* Common types - keep lowercase to match filtering */}
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="condo">Condo</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => {
              const primary =
                p.image_url ||
                (Array.isArray(p.images) && p.images.length > 0 && typeof p.images[0] === "string"
                  ? p.images[0]
                  : null);
              const imageUrl = primary
                ? getImageThumbnailUrl(p as PropertiesResponse, primary, "120x90")
                : null;
              const mainPrice =
                p.listing_type === "sale" ? (p.sale_price || p.price) : (p.rental_price || p.price);
              const location = [p.city, p.state, p.country].filter(Boolean).join(", ");

              return (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-muted/40">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={p.title || "property"}
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
                        <div className="font-medium">{p.title || "Untitled"}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {location}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {p.is_featured ? (
                            <Badge variant="secondary" className="text-xs">
                              Featured
                            </Badge>
                          ) : null}
                          {p.is_new ? (
                            <Badge variant="secondary" className="text-xs">
                              New
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="capitalize">
                      {(p.property_type || "").replace(/_/g, " ")}
                    </div>
                    <div className="text-sm text-muted-foreground capitalize">
                      For {p.listing_type}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge className={getStatusClass(p.status)}>
                      {p.status || "unknown"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="font-medium">
                      {p.listing_type === "sale" && p.sale_price
                        ? formatPrice(p.sale_price, p.currency)
                        : p.rental_price
                        ? `${formatPrice(p.rental_price, p.currency)}/mo`
                        : p.price
                        ? formatPrice(p.price, p.currency)
                        : "Price on request"}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm">
                      {p.created ? new Date(p.created).toLocaleDateString() : "-"}
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/properties/${p.id}`}
                            className="flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No properties found matching your criteria.
        </div>
      )}
    </div>
  );
}
