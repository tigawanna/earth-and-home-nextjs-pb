import type { PropertiesResponse } from "@/lib/pocketbase/types/pb-types";
import { properties } from "@/db/schema/app-schema";
import type { InferSelectModel } from "drizzle-orm";

export type PropertyRow = InferSelectModel<typeof properties>;

export function mapDrizzleRowToPropertiesResponse(row: PropertyRow): PropertiesResponse {
  const created = row.createdAt ? new Date(row.createdAt).toISOString() : new Date().toISOString();
  const updated = row.updatedAt ? new Date(row.updatedAt).toISOString() : created;

  const listingType = row.listingType === "rent" ? "rent" : "sale";

  const imagesList = row.images ?? [];
  const imagesNormalized = Array.isArray(imagesList) ? imagesList : [];

  return {
    id: row.id,
    collectionId: "",
    collectionName: "properties",
    created,
    updated,
    title: row.title,
    description: row.description ?? "",
    price: row.price ?? 0,
    listing_type: listingType,
    property_type: row.propertyType as PropertiesResponse["property_type"],
    status: row.status as PropertiesResponse["status"],
    location: row.location,
    street_address: row.streetAddress ?? "",
    city: row.city ?? "",
    state: row.state ?? "",
    postal_code: row.postalCode ?? "",
    country: row.country ?? "",
    dimensions: row.dimensions ?? "",
    building_size_sqft: row.buildingSizeSqft ?? 0,
    baths: row.baths ?? 0,
    lot_size_sqft: row.lotSizeSqft ?? 0,
    lot_size_acres: row.lotSizeAcres ?? 0,
    year_built: row.yearBuilt ?? 0,
    floors: row.floors ?? 0,
    beds: row.beds ?? 0,
    parking_spaces: row.parkingSpaces ?? 0,
    parking_type: (row.parkingType ?? "") as PropertiesResponse["parking_type"],
    heating: (row.heating ?? "") as PropertiesResponse["heating"],
    cooling: (row.cooling ?? "") as PropertiesResponse["cooling"],
    zoning: (row.zoning ?? "") as PropertiesResponse["zoning"],
    currency: row.currency ?? "KES",
    sale_price: row.salePrice ?? 0,
    rental_price: row.rentalPrice ?? 0,
    security_deposit: row.securityDeposit ?? 0,
    hoa_fee: row.hoaFee ?? 0,
    annual_taxes: row.annualTaxes ?? 0,
    available_from: row.availableFrom ?? "",
    image_url: row.imageUrl ?? "",
    images: imagesNormalized,
    video_url: row.videoUrl ?? "",
    virtual_tour_url: row.virtualTourUrl ?? "",
    amenities: undefined,
    features: row.features ?? null,
    utilities: row.utilities ?? null,
    owner_id: row.ownerId ?? "",
    is_featured: row.isFeatured ?? false,
    is_new: row.isNew ?? false,
    location_point:
      row.locationLat != null && row.locationLon != null
        ? { lat: row.locationLat, lon: row.locationLon }
        : null,
    agent_id: row.agentId,
  };
}
