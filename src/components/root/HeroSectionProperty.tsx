import { Button } from "@/components/ui/button";
import { getServerSideFeaturedProperties } from "@/data-access-layer/properties/server-side-property-queries";
import { getImageThumbnailUrl } from "@/lib/pocketbase/utils/files";
import { Bath, Bed, HomeIcon, MapPin, Square } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HeroSectionPropertyProps {
  title?: string;
  showAddButton?: boolean;
}

function formatPrice(currency: string | undefined, price: number | undefined) {
  if (!price) return "Price on request";
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

export async function HeroSectionProperty({ 
  title = "Featured Property", 
  showAddButton = false 
}: HeroSectionPropertyProps) {
  // Fetch featured properties from the backend - we'll just get the top one
  const { success, properties } = await getServerSideFeaturedProperties({ limit: 1 });
  
  // Get the first property if available
  const featuredProperty = success && properties.length > 0 ? properties[0] : null;
  
  // Get image URL if available
  let imageUrl = null;
  if (featuredProperty) {
    const primaryImageFilename = featuredProperty.image_url || 
      (Array.isArray(featuredProperty.images) && featuredProperty.images.length > 0
        ? typeof featuredProperty.images[0] === 'string'
          ? featuredProperty.images[0]
          : null
        : null);
        
    if (primaryImageFilename) {
      imageUrl = getImageThumbnailUrl(featuredProperty, primaryImageFilename, "1200x800");
    }
  }
  
  // Get location string
  const locationLabel = featuredProperty 
    ? [featuredProperty.city, featuredProperty.state, featuredProperty.country].filter(Boolean).join(", ")
    : "";
  
  // Early return with fallback design if no property is found
  if (!featuredProperty) {
    return (
      <section className="w-full py-8">
        <div className="container mx-auto px-4">
          <div className="bg-card text-card-foreground rounded-2xl shadow-2xl overflow-hidden border border-base-200 aspect-video max-h-[800px]">
            <div className="grid md:grid-cols-2 gap-0 h-full">
              {/* Fallback Image Side */}
              <div className="relative h-full w-full bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center">
                {/* Simple geometric shapes */}
                <div className="relative">
                  {/* House-like shape */}
                  <div className="w-32 h-32 bg-primary/20 rounded-lg transform rotate-45 absolute top-8 left-8"></div>
                  <div className="w-24 h-24 bg-accent/30 rounded-full absolute top-16 right-8"></div>
                  <div className="w-16 h-40 bg-primary/15 rounded-lg absolute bottom-8 left-16"></div>
                </div>
              </div>
              
              {/* Placeholder Content Side */}
              <div className="p-8 flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                  <div className="h-4 bg-muted rounded w-4/6"></div>
                  
                  <div className="flex gap-4 pt-4">
                    <div className="h-6 bg-muted rounded w-20"></div>
                    <div className="h-6 bg-muted rounded w-20"></div>
                    <div className="h-6 bg-muted rounded w-24"></div>
                  </div>
                  
                  <div className="pt-4">
                    <div className="h-12 bg-muted rounded w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="w-full py-8 ">
      <div className="container mx-auto px-4">
        {/* Single featured property in a giant card */}
        {featuredProperty ? (
          <div className="bg-card text-card-foreground rounded-2xl shadow-2xl overflow-hidden border border-base-200 aspect-video max-h-[800px]">
            <div className="grid md:grid-cols-2 gap-0 h-full">
              {/* Property Image - Large */}
              <div className="relative h-full w-full">
                {imageUrl ? (
                  <>
                    <Image
                      src={imageUrl}
                      alt={featuredProperty.title ? `${featuredProperty.title} image` : "Featured Property"}
                      fill
                      priority={true}
                      sizes="(max-width:768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    {/* Soft gradient for legibility */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground/60">
                    <div className="text-center">
                      <HomeIcon className="h-20 w-20 mx-auto mb-4 opacity-70" />
                      <p className="text-base font-medium tracking-wide">No Image Available</p>
                    </div>
                  </div>
                )}
                
                <div className="absolute top-4 left-4">
                  <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-background text-foreground px-3 py-1 rounded-full text-sm font-medium border border-base-200">
                    {formatPrice(featuredProperty.currency, featuredProperty.price)}
                    {featuredProperty.listing_type === "rent" ? "/mo" : ""}
                  </span>
                </div>
              </div>
              
              {/* Property Details - Right Side */}
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="text-sm">{locationLabel || "Location not specified"}</span>
                </div>
                
                <h3 className="text-3xl font-semibold text-foreground mb-4">
                  {featuredProperty.title || "Untitled Property"}
                </h3>
                
                <p className="text-muted-foreground text-base mb-6 flex-grow">
                  {featuredProperty.description || 
                   "Discover this exceptional property in a prime location. Contact us for more details about this exclusive offering."}
                </p>
                
                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-8">
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-primary" />
                    <span className="font-medium">{featuredProperty.beds || 0} Beds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-primary" />
                    <span className="font-medium">{featuredProperty.baths || 0} Baths</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Square className="h-5 w-5 text-primary" />
                    <span className="font-medium">{featuredProperty.building_size_sqft || 0} sq ft</span>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Link href={`/properties/${featuredProperty.id}`} className="w-full">
                    <Button size="lg" className="w-full">View Details</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
