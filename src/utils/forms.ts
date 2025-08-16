import { z } from "zod";
import { Control, FieldPath, FieldValues } from "react-hook-form";

// Common form field props type
export interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
}

// Utility to create enum options for select fields
export function createEnumOptions<T extends Record<string, string>>(enumObject: T) {
  return Object.entries(enumObject).map(([key, value]) => ({
    value: key,
    label: value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, ' '),
  }));
}

// Utility to format currency input
export function formatCurrency(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

// Utility to parse currency string to number
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^0-9.-]+/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// Utility to format area (square feet)
export function formatArea(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('en-US').format(num) + ' sq ft';
}

// Utility to validate coordinates
export const coordinateSchema = z.object({
  latitude: z.number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90')
    .optional(),
  longitude: z.number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180')
    .optional(),
});

// Utility to create conditional field validation
export function createConditionalSchema<T>(
  condition: (data: any) => boolean,
  schema: z.ZodSchema<T>
) {
  return z.union([
    z.any().refine((data) => !condition(data), {
      message: "Field is not required for this property type"
    }),
    schema
  ]);
}

// Property type validation helpers
export const PropertyTypes = {
  LAND: ['land'] as const,
  RESIDENTIAL: ['house', 'apartment', 'condo', 'townhouse', 'duplex', 'studio', 'villa'] as const,
  COMMERCIAL: ['commercial', 'industrial', 'farm'] as const,
} as const;

export function isLandProperty(propertyType?: string): boolean {
  return PropertyTypes.LAND.includes(propertyType as any);
}

export function isResidentialProperty(propertyType?: string): boolean {
  return PropertyTypes.RESIDENTIAL.includes(propertyType as any);
}

export function isCommercialProperty(propertyType?: string): boolean {
  return PropertyTypes.COMMERCIAL.includes(propertyType as any);
}

// Form section visibility utilities
export function getVisibleSections(propertyType?: string, listingType?: string) {
  return {
    basicInfo: true,
    location: true,
    pricing: true,
    media: true,
    // Property-specific sections
    buildingInfo: !isLandProperty(propertyType),
    landInfo: isLandProperty(propertyType),
    residential: isResidentialProperty(propertyType),
    utilities: !isLandProperty(propertyType),
    // Listing-specific sections
    rental: listingType === 'rent',
    sale: listingType === 'sale',
  };
}

// Amenities and features options
export const COMMON_AMENITIES = [
  'Swimming Pool',
  'Gym/Fitness Center',
  'Parking',
  'Security',
  'Garden',
  'Balcony',
  'Terrace',
  'WiFi',
  'Air Conditioning',
  'Heating',
  'Laundry',
  'Storage',
  'Elevator',
  'Playground',
  'Basketball Court',
  'Tennis Court',
  'Club House',
  'BBQ Area',
  'Pet Friendly',
  'Furnished',
] as const;

export const COMMON_FEATURES = [
  'Modern Kitchen',
  'Walk-in Closet',
  'En-suite Bathroom',
  'Guest Bathroom',
  'Study Room',
  'Dining Room',
  'Family Room',
  'Servant Quarter',
  'Guest Room',
  'Pantry',
  'Utility Room',
  'Basement',
  'Attic',
  'Garage',
  'Carport',
  'Driveway',
  'Front Yard',
  'Back Yard',
  'Fire Place',
  'Solar Panels',
] as const;

// Utility validation schemas
export const positiveNumberSchema = z.coerce.number().positive().optional().nullable();
export const nonNegativeNumberSchema = z.coerce.number().nonnegative().optional().nullable();
export const requiredStringSchema = z.string().min(1, "This field is required");
export const optionalStringSchema = z.string().optional().nullable();

// Form step utilities
export interface FormStep {
  id: string;
  title: string;
  description: string;
  fields: string[];
  isValid?: boolean;
}

export function createFormSteps(propertyType?: string, listingType?: string): FormStep[] {
  const sections = getVisibleSections(propertyType, listingType);
  
  const steps: FormStep[] = [
    {
      id: 'basic',
      title: 'Basic Information',
      description: 'Property type, title, and description',
      fields: ['title', 'description', 'propertyType', 'listingType'],
    },
    {
      id: 'location',
      title: 'Location Details',
      description: 'Address and geographic information',
      fields: ['location', 'streetAddress', 'city', 'state', 'postalCode', 'country'],
    },
  ];

  if (sections.buildingInfo) {
    steps.push({
      id: 'building',
      title: 'Building Information',
      description: 'Size, structure, and property details',
      fields: ['buildingSizeSqft', 'floors', 'beds', 'baths', 'yearBuilt'],
    });
  }

  if (sections.landInfo) {
    steps.push({
      id: 'land',
      title: 'Land Information',
      description: 'Lot size, zoning, and land details',
      fields: ['lotSizeSqft', 'lotSizeAcres', 'zoning', 'dimensions'],
    });
  }

  steps.push({
    id: 'pricing',
    title: 'Pricing & Availability',
    description: 'Price, fees, and availability information',
    fields: ['price', 'salePrice', 'rentalPrice', 'hoaFee', 'annualTaxes'],
  });

  steps.push({
    id: 'features',
    title: 'Features & Amenities',
    description: 'Property features, amenities, and utilities',
    fields: ['amenities', 'features', 'utilities', 'parking'],
  });

  return steps;
}
