import { PropertyFilters } from "@/components/property/list/PropertyFilters";
import { PublicPropertiesList } from "@/components/property/list/PublicPropertiesList";
import { PropertiesListLoading } from "@/components/property/query-states/PropertiesListLoading";
import { siteinfo } from "@/config/siteinfo";
import type { Metadata } from "next";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  
  // Extract search parameters for dynamic metadata
  const search = params.search as string;
  const propertyType = params.propertyType as string;
  const listingType = params.listingType as string;
  const city = params.city as string;
  const minPrice = params.minPrice as string;
  const maxPrice = params.maxPrice as string;
  const beds = params.beds as string;
  const baths = params.baths as string;

  // Build dynamic title and description
  let title = "Properties";
  let description = `Browse our collection of available properties for sale and rent. Find your perfect home with ${siteinfo.title}`;
  
  const titleParts: string[] = [];
  const descriptionParts: string[] = [];

  if (search) {
    titleParts.push(`"${search}"`);
    descriptionParts.push(`matching "${search}"`);
  }

  if (propertyType) {
    const formattedType = propertyType.charAt(0).toUpperCase() + propertyType.slice(1) + 's';
    titleParts.push(formattedType);
    descriptionParts.push(formattedType.toLowerCase());
  }

  if (listingType) {
    const formattedListing = listingType === 'sale' ? 'for Sale' : 'for Rent';
    titleParts.push(formattedListing);
    descriptionParts.push(formattedListing.toLowerCase());
  }

  if (city) {
    titleParts.push(`in ${city}`);
    descriptionParts.push(`located in ${city}`);
  }

  if (beds) {
    titleParts.push(`${beds}+ Bed${parseInt(beds) > 1 ? 's' : ''}`);
    descriptionParts.push(`with ${beds}+ bedroom${parseInt(beds) > 1 ? 's' : ''}`);
  }

  if (baths) {
    titleParts.push(`${baths}+ Bath${parseInt(baths) > 1 ? 's' : ''}`);
    descriptionParts.push(`and ${baths}+ bathroom${parseInt(baths) > 1 ? 's' : ''}`);
  }

  if (minPrice || maxPrice) {
    const priceRange = [];
    if (minPrice) priceRange.push(`$${parseInt(minPrice).toLocaleString()}+`);
    if (maxPrice) priceRange.push(`under $${parseInt(maxPrice).toLocaleString()}`);
    const priceText = priceRange.join(' - ');
    titleParts.push(priceText);
    descriptionParts.push(`priced ${priceText}`);
  }

  if (titleParts.length > 0) {
    title = titleParts.join(' ') + ' | Properties';
  }

  if (descriptionParts.length > 0) {
    description = `Browse ${descriptionParts.join(' ')} with ${siteinfo.title}. Find your perfect home from our curated selection of real estate listings.`;
  }

  // Build keywords array
  const keywords = [
    "properties for sale",
    "properties for rent", 
    "real estate listings",
    "homes for sale",
    "apartments for rent",
    "property search",
    siteinfo.title
  ];

  if (propertyType) keywords.push(`${propertyType} for sale`, `${propertyType} for rent`);
  if (city) keywords.push(`properties in ${city}`, `real estate ${city}`);
  if (listingType) keywords.push(`${listingType === 'sale' ? 'buy' : 'rent'} property`);

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: `${title} | ${siteinfo.title}`,
      description,
      type: "website",
    },
    twitter: {
      title: `${title} | ${siteinfo.title}`,
      description,
    },
    alternates: {
      canonical: "/properties",
    },
  };
}

export default async function PublicPropertiesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="container mx-auto py-8">
      <PropertyFilters showStatusFilter={false} />
      <Suspense fallback={<PropertiesListLoading />}>
        <PublicPropertiesList searchParams={params} showPages />
      </Suspense>
    </div>
  );
}
