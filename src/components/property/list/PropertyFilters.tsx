"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PropertyFilters as PropertyFiltersType } from "@/data-access-layer/properties/property-types";
import { Filter, Loader, Search, X } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { ReactNode, useState, useTransition } from "react";

interface PropertyFiltersProps {
  showStatusFilter?: boolean;
  showMineFilter?: boolean;
  title?: string;
  showAddButton?: boolean;
  addButtonHref?: string;
  addButtonComponent?: ReactNode;
}

export function PropertyFilters({
  showStatusFilter = true,
  showMineFilter = false,
  title: _title = "Properties",
  showAddButton: _showAddButton = false,
  addButtonHref: _addButtonHref = "/dashboard/properties/add",
  addButtonComponent: _addButtonComponent,
}: PropertyFiltersProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"full" | "secondary">("full");
  const [isPending, startTransition] = useTransition();

  const [queryState, setQueryState] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      propertyType: parseAsString,
      listingType: parseAsString,
      status: parseAsString,
      scope: parseAsString.withDefault("all"),
      minPrice: parseAsInteger,
      maxPrice: parseAsInteger,
      beds: parseAsInteger,
      baths: parseAsInteger,
      city: parseAsString,
      featured: parseAsString,
      page: parseAsInteger.withDefault(1),
      sortBy: parseAsString.withDefault("created"),
      sortOrder: parseAsString.withDefault("desc"),
    },
    {
      shallow: false,
      throttleMs: 5000,
      startTransition,
    },
  );

  const {
    search,
    propertyType,
    listingType,
    status,
    minPrice,
    maxPrice,
    beds,
    baths,
    city,
    featured: isFeatured,
    sortBy,
    sortOrder,
    page: currentPage,
    scope,
  } = queryState;

  const filters: PropertyFiltersType = {
    search: search || undefined,
    propertyType: propertyType || undefined,
    listingType: (listingType as "sale" | "rent") || undefined,
    status: status || undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    beds: beds || undefined,
    baths: baths || undefined,
    city: city || undefined,
    isFeatured: isFeatured === "true" ? true : undefined,
  };

  const allFilters = {
    ...filters,
    sortBy: sortBy !== "created" ? sortBy : undefined,
    sortOrder: sortOrder !== "desc" ? sortOrder : undefined,
    scope: showMineFilter && scope === "mine" ? scope : undefined,
  };

  const hasActiveFilters = Object.values(allFilters).some(
    (value) => value !== undefined && value !== "" && value !== null,
  );

  const getActiveFilterCount = () => {
    return Object.values(allFilters).filter(
      (value) => value !== undefined && value !== "" && value !== null,
    ).length;
  };

  const getSecondaryFilterCount = () => {
    let n = 0;
    if (propertyType) n++;
    if (beds) n++;
    if (baths) n++;
    if (minPrice) n++;
    if (maxPrice) n++;
    if (city) n++;
    if (isFeatured === "true") n++;
    if (showStatusFilter && status) n++;
    if (sortBy && sortBy !== "created") n++;
    if (sortOrder && sortOrder !== "desc") n++;
    if (showMineFilter && scope === "mine") n++;
    return n;
  };

  const handleClearFilters = () => {
    setQueryState((prev) => ({
      ...prev,
      search: "",
      propertyType: null,
      listingType: null,
      status: showStatusFilter ? null : prev.status,
      scope: "all",
      minPrice: null,
      maxPrice: null,
      beds: null,
      baths: null,
      city: null,
      featured: null,
      sortBy: "created",
      sortOrder: "desc",
      page: 1,
    }));
  };

  const handleSortChange = (field: "sortBy" | "sortOrder", value: string) => {
    setQueryState((prev) => ({
      ...prev,
      [field]: value,
      page: 1,
    }));
  };

  const openFullDialog = () => {
    setDialogMode("full");
    setDialogOpen(true);
  };

  const openSecondaryDialog = () => {
    setDialogMode("secondary");
    setDialogOpen(true);
  };

  const filterFormBody = (
    <div className="space-y-4 pt-1">
      {showMineFilter ? (
        <div className="space-y-1">
          <Label className="text-xs font-medium text-muted-foreground">Listings</Label>
          <Select
            value={scope}
            onValueChange={(value) => {
              setQueryState((prev) => ({
                ...prev,
                scope: value as "all" | "mine",
                page: 1,
              }));
            }}
          >
            <SelectTrigger
              className="h-9 w-full border-border/50 focus:border-primary rounded-md"
              aria-label="Show all listings or only mine"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent sideOffset={4}>
              <SelectItem value="all">All listings</SelectItem>
              <SelectItem value="mine">Mine</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : null}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label className="text-xs font-medium text-muted-foreground">Property Type</Label>
          <Select
            value={propertyType || "all"}
            onValueChange={(value) => {
              setQueryState((prev) => ({
                ...prev,
                propertyType: value === "all" ? null : value,
                page: 1,
              }));
            }}
          >
            <SelectTrigger
              className="h-9 w-full border-border/50 focus:border-primary rounded-md"
              aria-label="Select property type"
            >
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent sideOffset={4} className="max-h-72 overflow-y-auto">
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="land">Land</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-medium text-muted-foreground">Bedrooms</Label>
          <Select
            value={beds?.toString() || "any"}
            onValueChange={(value) => {
              setQueryState((prev) => ({
                ...prev,
                beds: value === "any" ? null : Number(value),
                page: 1,
              }));
            }}
          >
            <SelectTrigger
              className="h-9 w-full border-border/50 focus:border-primary rounded-md"
              aria-label="Select number of bedrooms"
            >
              <SelectValue placeholder="Any beds" />
            </SelectTrigger>
            <SelectContent sideOffset={4} className="max-h-72 overflow-y-auto">
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-xs font-medium text-muted-foreground">Price Range</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice || ""}
            onChange={(e) => {
              setQueryState((prev) => ({
                ...prev,
                minPrice: e.target.value ? Number(e.target.value) : null,
                page: 1,
              }));
            }}
            className="h-9 border-border/50 focus:border-primary rounded-md text-sm min-w-0 flex-1"
            aria-label="Minimum price"
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice || ""}
            onChange={(e) => {
              setQueryState((prev) => ({
                ...prev,
                maxPrice: e.target.value ? Number(e.target.value) : null,
                page: 1,
              }));
            }}
            className="h-9 border-border/50 focus:border-primary rounded-md text-sm min-w-0 flex-1"
            aria-label="Maximum price"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label className="text-xs font-medium text-muted-foreground">Sort By</Label>
          <Select value={sortBy} onValueChange={(value) => handleSortChange("sortBy", value)}>
            <SelectTrigger
              className="h-9 w-full border-border/50 focus:border-primary rounded-md"
              aria-label="Sort properties by"
            >
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent sideOffset={4} className="max-h-72 overflow-y-auto">
              <SelectItem value="created">Date Created</SelectItem>
              <SelectItem value="updated">Last Updated</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-medium text-muted-foreground">Order</Label>
          <Select
            value={sortOrder}
            onValueChange={(value) => handleSortChange("sortOrder", value)}
          >
            <SelectTrigger
              className="h-9 w-full border-border/50 focus:border-primary rounded-md"
              aria-label="Select sort order"
            >
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent sideOffset={4} className="max-h-72 overflow-y-auto">
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 border-t border-border/50 pt-4">
        <div className="space-y-3">
          <h4 className="font-medium text-foreground text-xs uppercase tracking-wide border-b border-border/50 pb-1">
            Property Details
          </h4>
          <div className="space-y-2">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">Bathrooms</Label>
              <Select
                value={baths?.toString() || "any"}
                onValueChange={(value) => {
                  setQueryState((prev) => ({
                    ...prev,
                    baths: value === "any" ? null : Number(value),
                    page: 1,
                  }));
                }}
              >
                <SelectTrigger
                  className="h-9 border-border/50 focus:border-primary rounded-md"
                  aria-label="Select number of bathrooms"
                >
                  <SelectValue placeholder="Any baths" />
                </SelectTrigger>
                <SelectContent sideOffset={4} className="max-h-72 overflow-y-auto">
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">City</Label>
              <Input
                placeholder="Enter city name"
                value={city || ""}
                onChange={(e) => {
                  setQueryState((prev) => ({
                    ...prev,
                    city: e.target.value || null,
                    page: 1,
                  }));
                }}
                className="h-9 border-border/50 focus:border-primary rounded-md text-sm"
                aria-label="City"
              />
            </div>

            <div className="flex flex-row items-center justify-between gap-3 rounded-lg border border-border/50 bg-muted/30 p-3">
              <Label htmlFor="featured-dialog" className="text-xs font-medium leading-snug cursor-pointer">
                Featured only
              </Label>
              <Switch
                id="featured-dialog"
                checked={isFeatured === "true"}
                onCheckedChange={(checked) => {
                  setQueryState((prev) => ({
                    ...prev,
                    featured: checked ? "true" : null,
                    page: 1,
                  }));
                }}
                className="h-5 w-9 shrink-0"
                aria-label="Show featured properties only"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-foreground text-xs uppercase tracking-wide border-b border-border/50 pb-1">
            Additional Filters
          </h4>
          <div className="space-y-2">
            {showStatusFilter && (
              <div className="space-y-1">
                <Label className="text-xs">Status</Label>
                <Select
                  value={status || "all"}
                  onValueChange={(value) => {
                    setQueryState((prev) => ({
                      ...prev,
                      status: value === "all" ? null : value,
                      page: 1,
                    }));
                  }}
                >
                  <SelectTrigger
                    className="h-9 border-border/50 focus:border-primary rounded-md"
                    aria-label="Select property status"
                  >
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent sideOffset={4} className="max-h-72 overflow-y-auto">
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                    <SelectItem value="off_market">Off Market</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-1">
              <Label className="text-xs">More Types</Label>
              <Select
                value={propertyType || "all"}
                onValueChange={(value) => {
                  setQueryState((prev) => ({
                    ...prev,
                    propertyType: value === "all" ? null : value,
                    page: 1,
                  }));
                }}
              >
                <SelectTrigger
                  className="h-9 border-border/50 focus:border-primary rounded-md"
                  aria-label="Select extended property type"
                >
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent sideOffset={4} className="max-h-72 overflow-y-auto">
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="duplex">Duplex</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="farm">Farm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const dialogSearchListing = (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        {isPending && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader className="h-3 w-3 animate-spin text-primary" />
          </div>
        )}
        <Input
          placeholder="Search by title, description, or location..."
          value={search}
          onChange={(e) => {
            setQueryState((prev) => ({
              ...prev,
              search: e.target.value || "",
              page: 1,
            }));
          }}
          className="pl-10 pr-10 h-10 text-sm border-border/50 focus:border-primary focus-visible:ring-1 rounded-lg transition-colors"
          aria-label="Search properties"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs font-medium text-muted-foreground">Listing Type</Label>
        <Select
          value={listingType || "all"}
          onValueChange={(value) => {
            setQueryState((prev) => ({
              ...prev,
              listingType: value === "all" ? null : value,
              page: 1,
            }));
          }}
        >
          <SelectTrigger
            className="h-9 w-full border-border/50 focus:border-primary rounded-md"
            aria-label="Select listing type"
          >
            <SelectValue placeholder="All listings" />
          </SelectTrigger>
          <SelectContent sideOffset={4} className="max-h-72 overflow-y-auto">
            <SelectItem value="all">All listings</SelectItem>
            <SelectItem value="sale">Sale</SelectItem>
            <SelectItem value="rent">Rent</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <section className="space-y-4" role="search" aria-label="Property search and filters">
      <div className="md:hidden rounded-lg border p-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 flex-1 gap-2 border-border/50 text-primary hover:bg-primary/5 hover:border-primary"
            onClick={openFullDialog}
            aria-label="Open property filters"
          >
            <Filter className="h-4 w-4 shrink-0" />
            <span className="font-medium">Filters</span>
            {getActiveFilterCount() > 0 && (
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-md"
              >
                {getActiveFilterCount()}
              </Badge>
            )}
          </Button>
          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="h-10 shrink-0 border-border/50 hover:border-primary rounded-md px-3"
              aria-label="Clear all property filters"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="hidden md:flex md:flex-row md:items-center md:gap-2 rounded-lg border p-3 min-w-0">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          {isPending && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
              <Loader className="h-3 w-3 animate-spin text-primary" />
            </div>
          )}
          <Input
            placeholder="Search properties..."
            value={search}
            onChange={(e) => {
              setQueryState((prev) => ({
                ...prev,
                search: e.target.value || "",
                page: 1,
              }));
            }}
            className="h-9 pl-8 pr-8 text-sm border-border/50 focus:border-primary focus-visible:ring-1 rounded-md"
            aria-label="Search properties"
          />
        </div>

        <Select
          value={listingType || "all"}
          onValueChange={(value) => {
            setQueryState((prev) => ({
              ...prev,
              listingType: value === "all" ? null : value,
              page: 1,
            }));
          }}
        >
          <SelectTrigger
            className="h-9 w-[7.25rem] shrink-0 border-border/50 focus:border-primary rounded-md px-2 text-xs"
            aria-label="Listing type"
          >
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent sideOffset={4} className="max-h-72 overflow-y-auto">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="sale">Sale</SelectItem>
            <SelectItem value="rent">Rent</SelectItem>
          </SelectContent>
        </Select>

        {showMineFilter ? (
          <Select
            value={scope}
            onValueChange={(value) => {
              setQueryState((prev) => ({
                ...prev,
                scope: value as "all" | "mine",
                page: 1,
              }));
            }}
          >
            <SelectTrigger
              className="h-9 w-[7.5rem] shrink-0 border-border/50 focus:border-primary rounded-md px-2 text-xs"
              aria-label="All listings or mine"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent sideOffset={4}>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="mine">Mine</SelectItem>
            </SelectContent>
          </Select>
        ) : null}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 shrink-0 gap-1.5 border-border/50 px-2.5 text-xs text-primary hover:bg-primary/5 hover:border-primary"
          onClick={openSecondaryDialog}
          aria-label="Open more property filters"
        >
          <Filter className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">More filters</span>
          <span className="lg:hidden">More</span>
          {getSecondaryFilterCount() > 0 && (
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary text-[10px] px-1.5 py-0 h-5 min-w-5"
            >
              {getSecondaryFilterCount()}
            </Badge>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="h-9 shrink-0 border-border/50 hover:border-primary rounded-md px-2.5"
            aria-label="Clear all property filters"
          >
            <X className="h-3.5 w-3.5 sm:mr-1" />
            <span className="hidden xl:inline text-xs">Clear</span>
          </Button>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          showCloseButton
          className="max-h-[min(90vh,720px)] overflow-y-auto gap-0 p-4 sm:max-w-lg sm:p-6"
        >
          <DialogHeader className="pb-3 text-left">
            <DialogTitle>{dialogMode === "full" ? "Filters" : "More filters"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {dialogMode === "full" && dialogSearchListing}
            {filterFormBody}
          </div>
        </DialogContent>
      </Dialog>

      {currentPage > 1 && (
        <div className="rounded-lg border bg-card shadow-sm p-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-muted rounded-md">
                <span className="text-xs font-medium">Page {currentPage}</span>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQueryState((prev) => ({ ...prev, page: currentPage - 1 }))}
                disabled={currentPage <= 1}
                className="px-3 py-1.5 border-border/50 hover:border-primary rounded-md disabled:opacity-50 disabled:cursor-not-allowed h-8 text-xs"
                aria-label="Go to previous page"
              >
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setQueryState((prev) => ({ ...prev, page: currentPage + 1 }))}
                className="px-3 py-1.5 border-border/50 hover:border-primary rounded-md h-8 text-xs"
                aria-label="Go to next page"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
