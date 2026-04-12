import type { PropertyFormData } from "@/components/property/form/property-form-schema";
import { COMMON_AMENITIES, COMMON_FEATURES } from "@/utils/forms";

const LAND_FEATURE_POOL = [
  "Flat Terrain",
  "Fenced",
  "Road Access",
  "Utilities Available",
  "Buildable",
  "Corner Lot",
  "Agricultural Use",
] as const;

const PROPERTY_TYPES: NonNullable<PropertyFormData["property_type"]>[] = [
  "house",
  "apartment",
  "villa",
  "condo",
  "townhouse",
  "studio",
  "land",
  "commercial",
];

const AREAS = [
  { label: "Westlands", city: "Nairobi", county: "Nairobi", postal: "00800" },
  { label: "Karen", city: "Nairobi", county: "Nairobi", postal: "00502" },
  { label: "Kilimani", city: "Nairobi", county: "Nairobi", postal: "00100" },
  { label: "Nyali", city: "Mombasa", county: "Mombasa", postal: "80100" },
  { label: "Milimani", city: "Kisumu", county: "Kisumu", postal: "40100" },
  { label: "Runda", city: "Nairobi", county: "Kiambu", postal: "00618" },
  { label: "Thika Road", city: "Nairobi", county: "Nairobi", postal: "00623" },
  { label: "Eldoret Town", city: "Eldoret", county: "Uasin Gishu", postal: "30100" },
];

const DESCRIPTIONS = [
  "Bright, well-maintained unit with good natural light and solid finishing. Close to schools, shopping, and main commuter routes. Ideal for professionals or small families looking for a calm neighborhood with urban convenience.",
  "Spacious layout with practical flow between living and sleeping areas. Secure compound, reliable water, and easy access to public transport. Viewing by appointment; title and service charge details available on request.",
  "Quiet setting with mature trees and room to entertain. Recently refreshed interiors; kitchen and wet areas in good order. Strong rental history in this block—suitable for end-users or a long-term investment hold.",
  "Prime positioning near business hubs and dining. High ceilings, ample storage, and dedicated parking. HOA/community rules apply; serious inquiries only with proof of funds or pre-qualification for financing.",
];

function pick<T>(arr: readonly T[], i: number): T {
  return arr[i % arr.length]!;
}

function subset<T>(arr: readonly T[], seed: number, min: number, max: number): T[] {
  const count = min + (seed % (max - min + 1));
  const out: T[] = [];
  for (let k = 0; k < count; k++) {
    out.push(arr[(seed + k * 7) % arr.length]!);
  }
  return [...new Set(out)];
}

export function buildKenyanPropertyDevSeed(
  sequence: number,
  agentId: string,
): Partial<PropertyFormData> {
  const n = sequence;
  const spot = pick(AREAS, n);
  const property_type = pick(PROPERTY_TYPES, n);
  const listing_type: PropertyFormData["listing_type"] = n % 2 === 0 ? "sale" : "rent";
  const isLand = property_type === "land";

  const title = `${spot.label} ${listing_type === "sale" ? "Sale" : "Rent"} — sample #${n}`;
  const description = [
    pick(DESCRIPTIONS, n),
    `Located in ${spot.label}, ${spot.city}. Reference seed ${n}. Replace this text and add your real photos before going live.`,
  ].join(" ");

  const price =
    listing_type === "sale"
      ? 8_500_000 + (n % 120) * 750_000
      : 35_000 + (n % 80) * 2_500;

  const base: Partial<PropertyFormData> = {
    agent_id: agentId,
    property_type,
    listing_type,
    status: "draft",
    title,
    description,
    currency: "KES",
    price,
    location: `${spot.label}, ${spot.city}`,
    street_address: `Plot ${100 + (n % 900)}, ${spot.label} Road`,
    city: spot.city,
    state: spot.county,
    postal_code: spot.postal,
    country: "Kenya",
    image_url: "",
    images: [],
    featured_image_index: 0,
    video_url: "",
    virtual_tour_url: "",
    is_featured: n % 5 === 0,
    is_new: true,
    amenities: subset(COMMON_AMENITIES, n, 2, 5) as unknown as PropertyFormData["amenities"],
    features: subset(COMMON_FEATURES, n + 3, 3, 7) as unknown as PropertyFormData["features"],
    utilities: {
      electricity: true,
      water: true,
      sewer: true,
      internet: true,
      gas: n % 3 === 0,
      trash: true,
    } as PropertyFormData["utilities"],
  };

  if (isLand) {
    return {
      ...base,
      amenities: [],
      features: subset(LAND_FEATURE_POOL, n, 3, 6) as unknown as PropertyFormData["features"],
      dimensions: `${40 + (n % 40)}m × ${60 + (n % 50)}m`,
      lot_size_sqft: 5_000 + (n % 40) * 1_200,
      lot_size_acres: Math.round((0.15 + (n % 20) * 0.08) * 100) / 100,
      zoning: n % 2 === 0 ? "residential" : "mixed_use",
      building_size_sqft: undefined,
      beds: undefined,
      baths: undefined,
      year_built: undefined,
      floors: undefined,
      parking_spaces: undefined,
      parking_type: "",
      heating: "",
      cooling: "",
      sale_price: listing_type === "sale" ? price : undefined,
      rental_price: listing_type === "rent" ? price : undefined,
      security_deposit: listing_type === "rent" ? Math.round(price * 1.5) : undefined,
      available_from: listing_type === "rent" ? new Date(Date.now() + 86400000 * 14).toISOString() : "",
      hoa_fee: undefined,
      annual_taxes: listing_type === "sale" ? Math.round(price * 0.0012) : undefined,
      location_point: { lat: -1.286 + (n % 50) * 0.001, lon: 36.817 + (n % 50) * 0.001 },
    };
  }

  return {
    ...base,
    building_size_sqft: 1_100 + (n % 35) * 120,
    beds: 2 + (n % 4),
    baths: 2 + (n % 3),
    year_built: 1998 + (n % 26),
    floors: 1 + (n % 3),
    parking_spaces: 1 + (n % 3),
    parking_type: n % 2 === 0 ? "garage" : "covered",
    heating: "electric",
    cooling: "central",
    zoning: "residential",
    lot_size_sqft: 4_000 + (n % 20) * 500,
    dimensions: `${25 + (n % 15)}m frontage`,
    sale_price: listing_type === "sale" ? price : undefined,
    rental_price: listing_type === "rent" ? price : undefined,
    security_deposit: listing_type === "rent" ? Math.round(price * 2) : undefined,
    available_from: listing_type === "rent" ? new Date(Date.now() + 86400000 * 10).toISOString() : "",
    hoa_fee: n % 4 === 0 ? 4500 + (n % 10) * 200 : undefined,
    annual_taxes: listing_type === "sale" ? Math.round(price * 0.008) : undefined,
    location_point: { lat: -1.28 + (n % 40) * 0.002, lon: 36.82 + (n % 40) * 0.002 },
  };
}
