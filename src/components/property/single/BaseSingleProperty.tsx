import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PropertyWithFavorites } from "@/data-access-layer/properties/property-types";
import { UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { ReactHotKeyScopeProvider } from "@/lib/react-hot-key/react-hot-key-scope-provider";
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
  Thermometer,
} from "lucide-react";
import Link from "next/link";
import { FavoriteProperty } from "../form/FavoriteProperty";
import { PropertyContactForm } from "../form/PropertyContactForm";
import { PropertyImageGallery } from "../list/PropertyImageGallery";

interface SinglePropertyProps {
  property: PropertyWithFavorites;
  basePath?: "/" | "/dashboard/";
  user: UsersResponse | null;
}

export function BaseSingleProperty({ property, basePath = "/", user }: SinglePropertyProps) {
  // Format price with currency
  const formatPrice = (price: number | null, currency = "KES") => {
    if (!price) return "Price on request";
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get the main price from unified price field
  const mainPrice = property.price;

  const rawImages = Array.isArray(property.images) ? property.images : [];
  const amenities = Array.isArray(property.amenities) ? property.amenities : [];
  const features = Array.isArray(property.features) ? property.features : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container mx-auto px-4 py-4 border-b">
        <Button variant="ghost" asChild>
          <Link href={`${basePath}properties`}>
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
                  property={property}
                  videoUrl={property.video_url}
                  virtualTourUrl={property.virtual_tour_url}
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
                        {property.listing_type === "rent" ? (
                          <p className="text-sm text-muted-foreground">per month</p>
                        ) : null}
                        {(property.security_deposit && property.listing_type === "rent") ? (
                          <p className="text-sm text-muted-foreground">
                            Security deposit: {formatPrice(property.security_deposit, property.currency || "KES")}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex gap-2">
                        <PropertyContactForm
                          propertyId={property.id}
                          propertyTitle={property.title}
                        >
                          <Button className="flex-1">
                            <Phone className="h-4 w-4 mr-2" />
                            Contact About Property
                          </Button>
                        </PropertyContactForm>
                        {/* <Button variant="outline" size="icon">
                          <Heart className="h-4 w-4" />
                        </Button> */}
                        <FavoriteProperty
                          userId={user?.id}
                          property={property}
                        />
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
                    {property.beds && property.beds > 0 ? (
                      <div className="flex items-center gap-2">
                        <Bed className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{property.beds} Beds</span>
                      </div>
                    ) : null}
                    {property.baths && property.baths > 0 ? (
                      <div className="flex items-center gap-2">
                        <Bath className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{property.baths} Baths</span>
                      </div>
                    ) : null}
                    {property.building_size_sqft ? (
                      <div className="flex items-center gap-2">
                        <Square className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{property.building_size_sqft.toLocaleString()} sqft</span>
                      </div>
                    ) : null}
                    {(property.parking_spaces && property.parking_spaces > 0) ? (
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{property.parking_spaces} Parking</span>
                      </div>
                    ) : null}
                    {property.year_built ? (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Built {property.year_built}</span>
                      </div>
                    ) : null}
                    {property.floors ? (
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{property.floors} Floors</span>
                      </div>
                    ) : null}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                    {property.city ? (
                      <p className="text-sm text-muted-foreground ml-6">{property.city}, {property.state}</p>
                    ) : null}
                  </div>

                  <Separator />

                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">
                      {property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1)}
                    </Badge>
                    <Badge variant="outline">
                      For {property.listing_type.charAt(0).toUpperCase() + property.listing_type.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Agent Info - Takes right column on larger containers */}
              {property.agent ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Listed By</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={property.agent.avatar || undefined} />
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
              ) : null}
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
                {property.is_featured ? (
                  <Badge className="bg-orange-500 hover:bg-orange-600">Featured</Badge>
                ) : null}
                {property.is_new ? (
                  <Badge className="bg-green-500 hover:bg-green-600">New</Badge>
                ) : null}
                <Badge variant={property.listing_type === "sale" ? "default" : "secondary"}>
                  {property.listing_type === "sale" ? "For Sale" : "For Rent"}
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
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">{property.description}</p>
            ) : (
              <p className="text-muted-foreground italic">No description provided for this property.</p>
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
              {property.beds && property.beds > 0 ? (
                <div className="flex items-center">
                  <Bed className="w-5 h-5 mr-3 text-primary" />
                  <div>
                    <div className="font-semibold">{property.beds}</div>
                    <div className="text-sm text-muted-foreground">Bedroom{property.beds !== 1 ? "s" : ""}</div>
                  </div>
                </div>
              ) : null}
              {property.baths && property.baths > 0 ? (
                <div className="flex items-center">
                  <Bath className="w-5 h-5 mr-3 text-primary" />
                  <div>
                    <div className="font-semibold">{property.baths}</div>
                    <div className="text-sm text-muted-foreground">Bathroom{property.baths !== 1 ? "s" : ""}</div>
                  </div>
                </div>
              ) : null}
              {property.parking_spaces && property.parking_spaces > 0 ? (
                <div className="flex items-center">
                  <Car className="w-5 h-5 mr-3 text-primary" />
                  <div>
                    <div className="font-semibold">{property.parking_spaces}</div>
                    <div className="text-sm text-muted-foreground">Parking</div>
                  </div>
                </div>
              ) : null}
              {property.building_size_sqft ? (
                <div className="flex items-center">
                  <Square className="w-5 h-5 mr-3 text-primary" />
                  <div>
                    <div className="font-semibold">{property.building_size_sqft.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Sq Ft</div>
                  </div>
                </div>
              ) : null}
              {property.year_built ? (
                <div className="flex items-center">
                  <Building className="w-5 h-5 mr-3 text-primary" />
                  <div>
                    <div className="font-semibold">{property.year_built}</div>
                    <div className="text-sm text-muted-foreground">Year Built</div>
                  </div>
                </div>
              ) : null}
              {property.floors ? (
                <div className="flex items-center">
                  <Building className="w-5 h-5 mr-3 text-primary" />
                  <div>
                    <div className="font-semibold">{property.floors}</div>
                    <div className="text-sm text-muted-foreground">Floor{property.floors !== 1 ? "s" : ""}</div>
                  </div>
                </div>
              ) : null}
              {(property.heating && property.heating !== "none") ? (
                <div className="flex items-center">
                  <Thermometer className="w-5 h-5 mr-3 text-primary" />
                  <div>
                    <div className="font-semibold capitalize">{property.heating.replace("_", " ")}</div>
                    <div className="text-sm text-muted-foreground">Heating</div>
                  </div>
                </div>
              ) : null}
              {(property.cooling && property.cooling !== "none") ? (
                <div className="flex items-center">
                  <Snowflake className="w-5 h-5 mr-3 text-primary" />
                  <div>
                    <div className="font-semibold capitalize">{property.cooling.replace("_", " ")}</div>
                    <div className="text-sm text-muted-foreground">Cooling</div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Additional Property Details */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {property.lot_size_sqft ? (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Lot Size</p>
                  <p className="text-sm text-muted-foreground">{property.lot_size_sqft.toLocaleString()} sqft</p>
                </div>
              ) : null}

              {(property.parking_type && property.parking_type !== "none") ? (
                <div className="space-y-1">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Parking Type
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">{property.parking_type.replace("_", " ")}</p>
                </div>
              ) : null}

              {property.zoning ? (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Zoning</p>
                  <p className="text-sm text-muted-foreground capitalize">{property.zoning.replace("_", " ")}</p>
                </div>
              ) : null}

              {property.hoa_fee ? (
                <div className="space-y-1">
                  <p className="text-sm font-medium">HOA Fee</p>
                  <p className="text-sm text-muted-foreground">{formatPrice(property.hoa_fee, property.currency || "KES")}/month</p>
                </div>
              ) : null}

              {property.annual_taxes ? (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Annual Taxes</p>
                  <p className="text-sm text-muted-foreground">{formatPrice(property.annual_taxes, property.currency || "KES")}</p>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {/* Amenities and Features - Flattened Layout */}
        {(amenities.length > 0 || features.length > 0) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Amenities */}
            {amenities.length > 0 ? (
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
            ) : null}

            {/* Features */}
            {features.length > 0 ? (
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
            ) : null}
          </div>
        ) : null}

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
                    <p className="text-sm text-muted-foreground">{property.street_address || property.location}</p>
                  </div>
                  {property.city ? (
                    <div>
                      <p className="text-sm font-medium">City</p>
                      <p className="text-sm text-muted-foreground">{property.city}</p>
                    </div>
                  ) : null}
                  {property.state ? (
                    <div>
                      <p className="text-sm font-medium">State/Province</p>
                      <p className="text-sm text-muted-foreground">{property.state}</p>
                    </div>
                  ) : null}
                </div>
                <div className="space-y-3">
                  {property.postal_code ? (
                    <div>
                      <p className="text-sm font-medium">Postal Code</p>
                      <p className="text-sm text-muted-foreground">{property.postal_code}</p>
                    </div>
                  ) : null}
                  {property.country ? (
                    <div>
                      <p className="text-sm font-medium">Country</p>
                      <p className="text-sm text-muted-foreground">{property.country}</p>
                    </div>
                  ) : null}
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
