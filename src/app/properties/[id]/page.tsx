
import { ServersideSingleProperty } from "@/components/property/single/ServersideSingleProperty";
import { SinglePropertyLoadingFallback } from "@/components/property/single/single-property-query-states";
import { siteinfo } from "@/config/siteinfo";
import { getServerSidePropertyById } from "@/data-access-layer/properties/server-side-property-queries";
import { getImageThumbnailUrl } from "@/lib/pocketbase/utils/files";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  
  const { success, property } = await getServerSidePropertyById(id);
  
  if (!success || !property) {
    return {
      title: "Property Not Found",
      description: "The requested property could not be found.",
    };
  }

  const primaryImage = property.image_url || (Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : null);
  const imageUrl = primaryImage && typeof primaryImage === 'string' 
    ? getImageThumbnailUrl(property, primaryImage, "800x600")
    : null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: property.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const priceText = formatPrice(property.price);
  const typeText = property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1);
  const listingTypeText = property.listing_type === 'sale' ? 'for Sale' : 'for Rent';
  
  const title = `${property.title} - ${priceText} | ${siteinfo.title}`;
  const description = `${typeText} ${listingTypeText} in ${property.city}, ${property.state}. ${property.beds} beds, ${property.baths} baths, ${property.building_size_sqft?.toLocaleString()} sq ft. ${property.description.slice(0, 100)}...`;

  return {
    title,
    description,
    keywords: [
      property.property_type,
      property.listing_type === 'sale' ? 'for sale' : 'for rent',
      property.city,
      property.state,
      `${property.beds} bedroom`,
      `${property.baths} bathroom`,
      'real estate',
      siteinfo.title
    ],
    openGraph: {
      title,
      description,
      type: "article",
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: property.title,
        }
      ] : [],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: {
      canonical: `/properties/${id}`,
    },
    other: {
      "property:price": priceText,
      "property:type": property.property_type,
      "property:listing_type": property.listing_type,
      "property:beds": property.beds.toString(),
      "property:baths": property.baths.toString(),
      "property:sqft": property.building_size_sqft?.toString() || "",
      "property:city": property.city,
      "property:state": property.state,
    },
  };
}

export default async function DashboardSinglePropertyPage({ params }: PageProps) {
  const { id } = await params;
  
  // Check if property exists for proper 404 handling
  const { success, property } = await getServerSidePropertyById(id);
  
  if (!success || !property) {
    notFound();
  }
  
  return (
    <section className="w-full min-h-screen">
      <Suspense fallback={<SinglePropertyLoadingFallback />}>
        <ServersideSingleProperty propertyId={id} />
      </Suspense>
    </section>
  );
}
