import { z } from "zod";
import { propertyInsertSchema } from "@/lib/drizzle/schema-zod";
import { 
  positiveNumberSchema, 
  nonNegativeNumberSchema, 
  requiredStringSchema, 
  optionalStringSchema,
  coordinateSchema,
  createConditionalSchema,
  isLandProperty,
  isResidentialProperty 
} from "@/utils/forms";
import { getLocalCurrency } from "@/utils/locale";

// Base property form schema with conditional validation
export const propertyFormSchema = z.object({
  // Basic Information (Required)
  title: requiredStringSchema,
  description: optionalStringSchema,
  propertyType: z.enum([
    "house", "apartment", "condo", "townhouse", "duplex", 
    "studio", "villa", "land", "commercial", "industrial", "farm"
  ]),
  listingType: z.enum(["sale", "rent"]),
  status: z.enum(["draft", "active", "pending", "sold", "rented", "off_market"]).default("draft"),

  // Location Information (Required)
  location: requiredStringSchema,
  streetAddress: optionalStringSchema,
  city: optionalStringSchema,
  state: optionalStringSchema,
  postalCode: optionalStringSchema,
  country: z.string().default("Kenya"),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),

  // Building Information (Conditional - Not for land)
  buildingSizeSqft: positiveNumberSchema,
  floors: positiveNumberSchema,
  beds: positiveNumberSchema,
  baths: positiveNumberSchema,
  yearBuilt: z.coerce.number().min(1800).max(new Date().getFullYear() + 5).optional().nullable(),

  // Land Information 
  lotSizeSqft: positiveNumberSchema,
  lotSizeAcres: z.coerce.number().positive().optional().nullable(),
  dimensions: optionalStringSchema,
  zoning: z.enum([
    "residential", "commercial", "agricultural", 
    "industrial", "mixed_use", "recreational", "other"
  ]).optional().nullable(),

  // Parking & Utilities
  parkingSpaces: nonNegativeNumberSchema,
  parkingType: z.enum([
    "garage", "carport", "street", "covered", "assigned", "none"
  ]).optional().nullable(),
  heating: z.enum([
    "none", "electric", "gas", "oil", "heat_pump", "solar", "geothermal"
  ]).optional().nullable(),
  cooling: z.enum([
    "none", "central", "wall_unit", "evaporative", "geothermal"
  ]).optional().nullable(),

  // Pricing
  currency: z.string().default("KES"),
  price: positiveNumberSchema,
  salePrice: positiveNumberSchema,
  rentalPrice: positiveNumberSchema,
  securityDeposit: positiveNumberSchema,
  hoaFee: nonNegativeNumberSchema,
  annualTaxes: nonNegativeNumberSchema,
  availableFrom: z.date().optional().nullable(),

  // Media & Features
  images: z.array(z.object({
    url: z.url(),
    key: z.string(),
    name: z.string(),
    size: z.number(),
    type: z.string(),
  })).default([]),
  imageUrl: optionalStringSchema,
  videoUrl: optionalStringSchema,
  virtualTourUrl: optionalStringSchema,
  amenities: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  utilities: z.union([
    z.array(z.string()),
    z.record(z.string(), z.boolean().optional())
  ]).default({}),

  // Ownership
  ownerId: z.string().optional().nullable(),
  
  // Flags
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
}).refine((data) => {
  // Conditional validation: residential properties should have beds/baths
  if (isResidentialProperty(data.propertyType)) {
    return data.beds && data.beds > 0 && data.baths && data.baths > 0;
  }
  return true;
}, {
  message: "Residential properties must have at least 1 bedroom and 1 bathroom",
  path: ["beds"]
}).refine((data) => {
  // Conditional validation: land properties should have lot size
  if (isLandProperty(data.propertyType)) {
    return data.lotSizeSqft && data.lotSizeSqft > 0;
  }
  return true;
}, {
  message: "Land properties must specify lot size",
  path: ["lotSizeSqft"]
}).refine((data) => {
  // Price validation based on listing type
  if (data.listingType === "sale") {
    return data.salePrice && data.salePrice > 0;
  } else if (data.listingType === "rent") {
    return data.rentalPrice && data.rentalPrice > 0;
  }
  return data.price && data.price > 0;
}, {
  message: "Please specify the appropriate price for your listing type",
  path: ["price"]
});

export type PropertyFormData = z.infer<typeof propertyFormSchema>;

// Default form values
export const defaultPropertyFormValues: Partial<PropertyFormData> = {
  listingType: "sale",
  status: "draft",
  country: "Kenya",
  currency: getLocalCurrency(),
  images: [],
  amenities: [],
  features: [],
  utilities: {},
  isFeatured: false,
  isNew: false,
  parkingSpaces: 0,
};
