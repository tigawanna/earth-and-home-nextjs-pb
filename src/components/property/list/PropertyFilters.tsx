"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyFilters as PropertyFiltersType } from "@/data-access-layer/property-types";
import { Filter, Loader, Search, X } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useState, useTransition } from "react";

interface PropertyFiltersProps {
  showStatusFilter?: boolean;
}

export function PropertyFilters({ showStatusFilter = true }: PropertyFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  // Combined query states using useQueryStates - batches all updates together
  const [queryState, setQueryState] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      propertyType: parseAsString,
      listingType: parseAsString,
      status: parseAsString,
      minPrice: parseAsInteger,
      maxPrice: parseAsInteger,
      beds: parseAsInteger,
      baths: parseAsInteger,
      city: parseAsString,
      featured: parseAsString,
      page: parseAsInteger.withDefault(1),
      // Sort parameters
      sortBy: parseAsString.withDefault("created"),
      sortOrder: parseAsString.withDefault("desc"),
    },
    {
      shallow: false,
      throttleMs: 5000, // Better for search inputs
      startTransition, // This enables the isPending state
    }
  );

  // Destructure for easier access
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
  } = queryState;

  // Convert query states to filters object for counting active filters
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

  // Include sort parameters in active filters check
  const allFilters = {
    ...filters,
    sortBy: sortBy !== "created" ? sortBy : undefined,
    sortOrder: sortOrder !== "desc" ? sortOrder : undefined,
  };

  const hasActiveFilters = Object.values(allFilters).some(
    (value) => value !== undefined && value !== "" && value !== null
  );

  const getActiveFilterCount = () => {
    return Object.values(allFilters).filter(
      (value) => value !== undefined && value !== "" && value !== null
    ).length;
  };

  const handleClearFilters = () => {
    setQueryState(prev => ({
      ...prev,
      search: "",
      propertyType: null,
      listingType: null,
      status: showStatusFilter ? null : prev.status,
      minPrice: null,
      maxPrice: null,
      beds: null,
      baths: null,
      city: null,
      featured: null,
      // Also clear sort parameters
      sortBy: "created",
      sortOrder: "desc",
      page: 1,
    }));
  };

  const handleSortChange = (field: "sortBy" | "sortOrder", value: string) => {
    setQueryState(prev => ({
      ...prev,
      [field]: value,
      page: 1, // Reset to first page when sort changes
    }));
  };

  return (
    <section className="space-y-4">
      {/* Main Search Card - Always Visible */}
      <div className="rounded-lg border">
        {/* Header - More Compact */}
        <div className="flex flex-col md:flex-row  items-center justify-between gap-3 mb-4">
          <div className="flex w-full flex-3/4 gap-1 relative">
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
                setQueryState(prev => ({
                  ...prev,
                  search: e.target.value || "",
                  page: 1,
                }));
              }}
              className="pl-10 pr-10 h-10 text-sm border-border/50 focus:border-primary focus-visible:ring-1 rounded-lg transition-colors"
              aria-label="Search properties"
            />
          </div>
          {/* Listing Type */}
          <div className="space-y-1 w-full flex-1/4">
            {/* <Label className="text-xs font-medium text-foreground">For</Label> */}
            <Select
              value={listingType || "all"}
              onValueChange={(value) => {
                setQueryState(prev => ({
                  ...prev,
                  listingType: value === "all" ? null : value,
                  page: 1,
                }));
              }}>
              <SelectTrigger className="h-9 w-full border-border/50 focus:border-primary rounded-md">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent sideOffset={4} className="max-h-72 overflow-y-auto">
                <SelectItem value="all">All listings</SelectItem>
                <SelectItem value="sale">Sale</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Bar - More Compact */}
        {/* <div className="mb-4"></div> */}

        {/* Quick Filters Row - Flex Wrap Layout */}
        <div className="flex flex-wrap gap-3 mb-3">
          {/* Property Type */}
          <div className="space-y-1 min-w-[140px] flex-1">
            <Select
              value={propertyType || "all"}
              onValueChange={(value) => {
                setQueryState(prev => ({
                  ...prev,
                  propertyType: value === "all" ? null : value,
                  page: 1,
                }));
              }}>
              <SelectTrigger className="h-9 w-full border-border/50 focus:border-primary rounded-md">
                <SelectValue placeholder="All" />
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

          {/* Bedrooms */}
          <div className="space-y-1 min-w-[120px] flex-1">
            <Select
              value={beds?.toString() || "any"}
              onValueChange={(value) => {
                setQueryState(prev => ({
                  ...prev,
                  beds: value === "any" ? null : Number(value),
                  page: 1,
                }));
              }}>
              <SelectTrigger className="h-9 w-full border-border/50 focus:border-primary rounded-md">
                <SelectValue placeholder="Any" />
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

          {/* Price Range - Responsive Width */}
          <div className="space-y-1 min-w-[180px] flex-[2_1_320px]">
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={minPrice || ""}
                onChange={(e) => {
                  setQueryState(prev => ({
                    ...prev,
                    minPrice: e.target.value ? Number(e.target.value) : null,
                    page: 1,
                  }));
                }}
                className="h-9 border-border/50 focus:border-primary rounded-md text-sm w-1/2 min-w-[70px]"
                aria-label="Minimum price"
              />
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice || ""}
                onChange={(e) => {
                  setQueryState(prev => ({
                    ...prev,
                    maxPrice: e.target.value ? Number(e.target.value) : null,
                    page: 1,
                  }));
                }}
                className="h-9 border-border/50 focus:border-primary rounded-md text-sm w-1/2 min-w-[70px]"
                aria-label="Maximum price"
              />
            </div>
          </div>
        </div>

        {/* Sort Filters Row */}
        <div className="flex flex-wrap gap-3 mb-3">
          {/* Sort By */}
          <div className="space-y-1 min-w-[140px] flex-1">
            <Select
              value={sortBy}
              onValueChange={(value) => handleSortChange("sortBy", value)}>
              <SelectTrigger className="h-9 w-full border-border/50 focus:border-primary rounded-md">
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

          {/* Sort Order */}
          <div className="space-y-1 min-w-[120px] flex-1">
            <Select
              value={sortOrder}
              onValueChange={(value) => handleSortChange("sortOrder", value)}>
              <SelectTrigger className="h-9 w-full border-border/50 focus:border-primary rounded-md">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent sideOffset={4} className="max-h-72 overflow-y-auto">
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters Toggle - Smaller */}
        <div className="flex justify-center pt-1">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="group px-4 py-1.5 rounded-md border-border/50 text-primary hover:bg-primary/5 hover:border-primary flex items-center gap-2 h-8"
                aria-expanded={isOpen}
                aria-controls="advanced-filters">
                <Filter className="h-3 w-3 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-xs">{isOpen ? "Hide" : "More"} Filters</span>
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-md">
                {getActiveFilterCount()}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="group border-border/50 hover:border-primary rounded-md h-8">
                <X className="h-3 w-3 mr-1 group-hover:rotate-90 transition-transform" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Filters Card - More Compact */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent id="advanced-filters">
          <div className="rounded-lg border bg-card shadow-sm p-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-1.5 bg-secondary/10 rounded-lg">
                <Filter className="h-4 w-4 text-secondary-foreground" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-foreground">Advanced Filters</h3>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Refine your search with detailed criteria
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Property Details */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground text-xs uppercase tracking-wide border-b border-border/50 pb-1">
                  Property Details
                </h4>
                <div className="space-y-2">
                  <div className="space-y-1">
    
                    <Select
                      value={baths?.toString() || "any"}
                      onValueChange={(value) => {
                        setQueryState(prev => ({
                          ...prev,
                          baths: value === "any" ? null : Number(value),
                          page: 1,
                        }));
                      }}>
                      <SelectTrigger className="h-9 border-border/50 focus:border-primary rounded-md">
                        <SelectValue placeholder="Any" />
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
 
                    <Input
                      placeholder="Enter city name"
                      value={city || ""}
                      onChange={(e) => {
                        setQueryState(prev => ({
                          ...prev,
                          city: e.target.value || null,
                          page: 1,
                        }));
                      }}
                      className="h-9 border-border/50 focus:border-primary rounded-md text-sm"
                      aria-label="City"
                    />
                  </div>

                  {/* Featured Toggle */}
                  <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md border-border/50">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={isFeatured === "true"}
                      onChange={(e) => {
                        setQueryState(prev => ({
                          ...prev,
                          featured: e.target.checked ? "true" : null,
                          page: 1,
                        }));
                      }}
                      className="w-3 h-3 text-primary bg-background border border-border rounded focus:ring-primary focus-visible:outline-none"
                    />
                    <Label htmlFor="featured" className="text-xs font-medium">
                      Featured only
                    </Label>
                  </div>
                </div>
              </div>

              {/* Status & Extended Properties */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground text-xs uppercase tracking-wide border-b border-border/50 pb-1">
                  Additional Filters
                </h4>
                <div className="space-y-2">
                  {showStatusFilter && (
                    <div className="space-y-1">
                      <Label className="text-xs">Status</Label>                        <Select
                          value={status || "all"}
                          onValueChange={(value) => {
                            setQueryState(prev => ({
                              ...prev,
                              status: value === "all" ? null : value,
                              page: 1,
                            }));
                          }}>
                        <SelectTrigger className="h-9 border-border/50 focus:border-primary rounded-md">
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

                  {/* Extended Property Types */}
                  <div className="space-y-1">
                    <Label className="text-xs">More Types</Label>
                    <Select
                      value={propertyType || "all"}
                      onValueChange={(value) => {
                        setQueryState(prev => ({
                          ...prev,
                          propertyType: value === "all" ? null : value,
                          page: 1,
                        }));
                      }}>
                      <SelectTrigger className="h-9 border-border/50 focus:border-primary rounded-md">
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
        </CollapsibleContent>
      </Collapsible>

      {/* Pagination - More Compact */}
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
                onClick={() => setQueryState(prev => ({ ...prev, page: currentPage - 1 }))}
                disabled={currentPage <= 1}
                className="px-3 py-1.5 border-border/50 hover:border-primary rounded-md disabled:opacity-50 disabled:cursor-not-allowed h-8 text-xs">
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setQueryState(prev => ({ ...prev, page: currentPage + 1 }))}
                className="px-3 py-1.5 border-border/50 hover:border-primary rounded-md h-8 text-xs">
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
