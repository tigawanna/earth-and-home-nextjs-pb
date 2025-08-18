import { getProperty } from "@/data-access-layer/pocketbase/property-queries";
import { ReactHotKeyScopeProvider } from "@/lib/react-hot-key/react-hot-key-scope-provider";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Bath,
  Bed,
  Building,
  Calendar,
  Car,
  Mail,
  MapPin,
  Phone,
  Share2,
  Snowflake,
  Square,
  Thermometer
} from "lucide-react";
import Link from "next/link";
import { FavoriteProperty } from "../property/form/FavoriteProperty";
import { SinglePropertyNotFound } from "../property/query-states";
import { PropertyImageGallery } from "./list/PropertyImageGallery";

const sampleImages = [
  {
    url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
    key: "house-1",
    name: "Modern House Front View",
    size: 245760,
    type: "image/jpeg",
  },
  {
    url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
    key: "house-2",
    name: "Living Room Interior",
    size: 189432,
    type: "image/jpeg",
  },
  {
    url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
    key: "house-3",
    name: "Modern Kitchen",
    size: 312567,
    type: "image/jpeg",
  },
  {
    url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
    key: "house-4",
    name: "Master Bedroom",
    size: 198765,
    type: "image/jpeg",
  },
  {
    url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop",
    key: "house-5",
    name: "Bathroom Suite",
    size: 167890,
    type: "image/jpeg",
  },
  {
    url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
    key: "house-6",
    name: "Backyard Garden",
    size: 278432,
    type: "image/jpeg",
  },
  {
    url: "https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=800&h=600&fit=crop",
    key: "house-7",
    name: "Dining Room",
    size: 203456,
    type: "image/jpeg",
  },
  {
    url: "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=800&h=600&fit=crop",
    key: "house-8",
    name: "Home Office",
    size: 156789,
    type: "image/jpeg",
  },
  {
    url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    key: "house-9",
    name: "Garage and Driveway",
    size: 234567,
    type: "image/jpeg",
  },
  {
    url: "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=800&h=600&fit=crop",
    key: "house-10",
    name: "House Exterior Night View",
    size: 289123,
    type: "image/jpeg",
  },
];

interface SinglePropertyProps {
  id: string; // Property ID to fetch details
}

export async function SingleProperty({ id }: SinglePropertyProps) {
  const result = await getProperty(id);

  if (!result.success || !result.property) {
    return <SinglePropertyNotFound />;
  }

  const property = result.property;

  // Format price with currency
  const formatPrice = (price: number | null, currency = "KES") => {
    if (!price) return "Price on request";
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get the main price based on listing type
  const mainPrice =
    property.listingType === "sale"
      ? property.salePrice || property.price
      : property.rentalPrice || property.price;

  const rawImages = Array.isArray(property.images) ? property.images : [];
  // Combine primary image with gallery images
  const images = property.imageUrl
    ? [property.imageUrl, ...rawImages.filter((img) => img !== property.imageUrl)]
    : rawImages;
  const amenities = Array.isArray(property.amenities) ? property.amenities : [];
  const features = Array.isArray(property.features) ? property.features : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container mx-auto px-4 py-4 border-b">
        <Button variant="ghost" asChild>
          <Link href="/properties">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Link>
        </Button>
      </div>

      {/* Main Content - Edge to Edge */}
      <div className="w-full px-4">
        <div className="grid grid-cols-1  lg:grid-cols-4 gap-0">
          {/* Image Gallery - Full Width */}
          <div className="lg:col-span-3 bg-black">
            <div className="max-w-none max-h-[70vh]">
              <ReactHotKeyScopeProvider scope="property-gallery">
                <PropertyImageGallery
                  // images={[...images, ...sampleImages]}
                  images={[...sampleImages]}
                  title={property.title}
                  videoUrl={property.videoUrl}
                  virtualTourUrl={property.virtualTourUrl}
                  status={property.status}
                  isFeatured={property.isFeatured}
                  isNew={property.isNew}
                />
              </ReactHotKeyScopeProvider>
            </div>
          </div>

          {/* Property Details Sidebar with Container Queries */}
          <div className="p-6 bg-background @container">
            {/* Container for responsive layout - stacks on small, side-by-side on larger containers */}
            <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-6">
              {/* Price and Action Buttons - Spans full width */}
              <div className="@2xl:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <div className="text-3xl font-bold text-primary">
                          {formatPrice(mainPrice, property.currency || "KES")}
                        </div>
                        {property.listingType === "rent" && (
                          <p className="text-sm text-muted-foreground">per month</p>
                        )}
                        {property.securityDeposit && property.listingType === "rent" && (
                          <p className="text-sm text-muted-foreground">
                            Security deposit:{" "}
                            {formatPrice(property.securityDeposit, property.currency || "KES")}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1">
                          <Phone className="h-4 w-4 mr-2" />
                          Contact Agent
                        </Button>
                        {/* <Button variant="outline" size="icon">
                          <Heart className="h-4 w-4" />
                        </Button> */}
                        <FavoriteProperty propertyId={property.id}  />
                        <Button variant="outline" size="icon">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Key Details - Takes left column on larger containers */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Property Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                    {property.beds && (
                      <div className="flex items-center gap-2">
                        <Bed className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{property.beds} Beds</span>
                      </div>
                    )}
                    {property.baths && (
                      <div className="flex items-center gap-2">
                        <Bath className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{property.baths} Baths</span>
                      </div>
                    )}
                    {property.buildingSizeSqft ? (
                      <div className="flex items-center gap-2">
                        <Square className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {property.buildingSizeSqft.toLocaleString()} sqft
                        </span>
                      </div>
                    ) : null}
                    {property.parkingSpaces ? (
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{property.parkingSpaces} Parking</span>
                      </div>
                    ) : null}
                    {property.yearBuilt && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Built {property.yearBuilt}</span>
                      </div>
                    )}
                    {property.floors && (
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{property.floors} Floors</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                    {property.city && (
                      <p className="text-sm text-muted-foreground ml-6">
                        {property.city}, {property.state}
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">
                      {property.propertyType.charAt(0).toUpperCase() +
                        property.propertyType.slice(1)}
                    </Badge>
                    <Badge variant="outline">
                      For{" "}
                      {property.listingType.charAt(0).toUpperCase() + property.listingType.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Agent Info - Takes right column on larger containers */}
              {property.agent && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Listed By</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={property.agent.image || undefined} />
                        <AvatarFallback>
                          {property.agent.name?.charAt(0).toUpperCase() || "A"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{property.agent.name}</p>
                        <p className="text-sm text-muted-foreground">{property.agent.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="flex-1">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Property Information - Full Width Container */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Property Title and Info */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {property.isFeatured && (
                  <Badge className="bg-orange-500 hover:bg-orange-600">Featured</Badge>
                )}
                {property.isNew && <Badge className="bg-green-500 hover:bg-green-600">New</Badge>}
                <Badge variant={property.listingType === "sale" ? "default" : "secondary"}>
                  {property.listingType === "sale" ? "For Sale" : "For Rent"}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{property.title}</h1>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-lg">{property.location}</span>
              </div>
            </div>
          </div>

          <div className="prose prose-sm max-w-none">
            {property.description ? (
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {property.description}
              </p>
            ) : (
              <p className="text-muted-foreground italic">
                No description provided for this property.
              </p>
            )}
          </div>
        </div>

        {/* Property Details Grid */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {property.beds && property.beds > 0 && (
                <div className="flex items-center">
                  <Bed className="w-5 h-5 mr-3 text-primary" />
                  <div>
                    <div className="font-semibold">{property.beds}</div>
                    <div className="text-sm text-muted-foreground">
                      Bedroom{property.beds !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center">
                <Bath className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <div className="font-semibold">{property.baths}</div>
                  <div className="text-sm text-muted-foreground">
                    Bathroom{property.baths !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
              {property.parkingSpaces && property.parkingSpaces > 0 ? (
                <div className="flex items-center">
                  <Car className="w-5 h-5 mr-3 text-primary" />
                  <div>
                    <div className="font-semibold">{property.parkingSpaces}</div>
                    <div className="text-sm text-muted-foreground">Parking</div>
                  </div>
                </div>
              ) : null}
              {property.buildingSizeSqft ? (
                <div className="flex items-center">
                  <Square className="w-5 h-5 mr-3 text-primary" />
                  <div>
                    <div className="font-semibold">
                      {property.buildingSizeSqft.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Sq Ft</div>
                  </div>
                </div>
              ) : null}
              {property.yearBuilt && (
                <div className="flex items-center">
                  <Building className="w-5 h-5 mr-3 text-primary" />
                  <div>
                    <div className="font-semibold">{property.yearBuilt}</div>
                    <div className="text-sm text-muted-foreground">Year Built</div>
                  </div>
                </div>
              )}
              {property.floors && (
                <div className="flex items-center">
                  <Building className="w-5 h-5 mr-3 text-primary" />
                  <div>
                    <div className="font-semibold">{property.floors}</div>
                    <div className="text-sm text-muted-foreground">
                      Floor{property.floors !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              )}
              {property.heating && property.heating !== "none" && (
                <div className="flex items-center">
                  <Thermometer className="w-5 h-5 mr-3 text-primary" />
                  <div>
                    <div className="font-semibold capitalize">
                      {property.heating.replace("_", " ")}
                    </div>
                    <div className="text-sm text-muted-foreground">Heating</div>
                  </div>
                </div>
              )}
              {property.cooling && property.cooling !== "none" && (
                <div className="flex items-center">
                  <Snowflake className="w-5 h-5 mr-3 text-primary" />
                  <div>
                    <div className="font-semibold capitalize">
                      {property.cooling.replace("_", " ")}
                    </div>
                    <div className="text-sm text-muted-foreground">Cooling</div>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Property Details */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {property.lotSizeSqft && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Lot Size</p>
                  <p className="text-sm text-muted-foreground">
                    {property.lotSizeSqft.toLocaleString()} sqft
                  </p>
                </div>
              )}

              {property.parkingType && property.parkingType !== "none" && (
                <div className="space-y-1">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Parking Type
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {property.parkingType.replace("_", " ")}
                  </p>
                </div>
              )}

              {property.zoning && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Zoning</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {property.zoning.replace("_", " ")}
                  </p>
                </div>
              )}

              {property.hoaFee && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">HOA Fee</p>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(property.hoaFee, property.currency || "KES")}/month
                  </p>
                </div>
              )}

              {property.annualTaxes && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Annual Taxes</p>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(property.annualTaxes, property.currency || "KES")}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Amenities and Features - Flattened Layout */}
        {(amenities.length > 0 || features.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Amenities */}
            {amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                        <span className="text-sm">{amenity as string}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                        <span className="text-sm">{feature as string}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Location Details */}
        <Card>
          <CardHeader>
            <CardTitle>Location Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      {property.streetAddress || property.location}
                    </p>
                  </div>
                  {property.city && (
                    <div>
                      <p className="text-sm font-medium">City</p>
                      <p className="text-sm text-muted-foreground">{property.city}</p>
                    </div>
                  )}
                  {property.state && (
                    <div>
                      <p className="text-sm font-medium">State/Province</p>
                      <p className="text-sm text-muted-foreground">{property.state}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {property.postalCode && (
                    <div>
                      <p className="text-sm font-medium">Postal Code</p>
                      <p className="text-sm text-muted-foreground">{property.postalCode}</p>
                    </div>
                  )}
                  {property.country && (
                    <div>
                      <p className="text-sm font-medium">Country</p>
                      <p className="text-sm text-muted-foreground">{property.country}</p>
                    </div>
                  )}
                  {property.latitude && property.longitude && (
                    <div>
                      <p className="text-sm font-medium">Coordinates</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {property.latitude.toFixed(6)}, {property.longitude.toFixed(6)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="mt-6 h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Interactive map coming soon</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
