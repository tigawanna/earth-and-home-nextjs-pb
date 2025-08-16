"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Filter } from "lucide-react";

export function PropertySearch() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [size, setSize] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (location) params.set("search", location);
    if (propertyType && propertyType !== "any") params.set("propertyType", propertyType);
    if (bedrooms && bedrooms !== "any") params.set("beds", bedrooms);
    if (bathrooms && bathrooms !== "any") params.set("baths", bathrooms);
    
    // Handle price range
    if (priceRange && priceRange !== "any") {
      const [min, max] = priceRange.split("-");
      if (min) params.set("minPrice", min);
      if (max && max !== "+") params.set("maxPrice", max);
    }
    
    // Navigate to properties page with search params
    router.push(`/properties?${params.toString()}`);
  };
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-playfair font-bold text-foreground mb-4">
            Find Your Perfect Property
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Use our advanced search to discover properties that match your exact requirements
          </p>
        </div>

        {/* Search form */}
        <div className="bg-card text-card-foreground rounded-2xl shadow-xl border boredr-base-200 p-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Location */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Enter city, neighborhood, or ZIP code"
                  className="pl-10 h-12"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Property Type
              </label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Any Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Type</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Price Range
              </label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Any Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Price</SelectItem>
                  <SelectItem value="0-300000">KES 0 - 300K</SelectItem>
                  <SelectItem value="300000-500000">KES 300K - 500K</SelectItem>
                  <SelectItem value="500000-750000">KES 500K - 750K</SelectItem>
                  <SelectItem value="750000-1000000">KES 750K - 1M</SelectItem>
                  <SelectItem value="1000000+">KES 1M+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <Button 
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleSearch}
              >
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
            </div>
          </div>

          {/* Advanced filters */}
          <div className="mt-6 pt-6 border-t boredr-base-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger>
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Bedrooms</SelectItem>
                  <SelectItem value="1">1+ Bed</SelectItem>
                  <SelectItem value="2">2+ Beds</SelectItem>
                  <SelectItem value="3">3+ Beds</SelectItem>
                  <SelectItem value="4">4+ Beds</SelectItem>
                  <SelectItem value="5">5+ Beds</SelectItem>
                </SelectContent>
              </Select>

              <Select value={bathrooms} onValueChange={setBathrooms}>
                <SelectTrigger>
                  <SelectValue placeholder="Bathrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Bathrooms</SelectItem>
                  <SelectItem value="1">1+ Bath</SelectItem>
                  <SelectItem value="2">2+ Baths</SelectItem>
                  <SelectItem value="3">3+ Baths</SelectItem>
                  <SelectItem value="4">4+ Baths</SelectItem>
                </SelectContent>
              </Select>

              <Select value={size} onValueChange={setSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Size (sq ft)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Size</SelectItem>
                  <SelectItem value="500-1000">500-1,000</SelectItem>
                  <SelectItem value="1000-1500">1,000-1,500</SelectItem>
                  <SelectItem value="1500-2000">1,500-2,000</SelectItem>
                  <SelectItem value="2000-3000">2,000-3,000</SelectItem>
                  <SelectItem value="3000+">3,000+</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                className="border-accent text-accent-foreground hover:bg-accent/20"
                onClick={handleSearch}
              >
                <Filter className="mr-2 h-4 w-4" />
                Search with Filters
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


