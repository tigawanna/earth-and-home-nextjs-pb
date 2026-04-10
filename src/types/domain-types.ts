import type { InferSelectModel } from "drizzle-orm";
import type { agents, favorites, properties, propertyMessages } from "@/db/schema/app-schema";
import type { user } from "@/db/schema/auth-schema";

export type UserRow = InferSelectModel<typeof user>;
export type PropertyRow = InferSelectModel<typeof properties>;
export type AgentRow = InferSelectModel<typeof agents>;
export type FavoriteRow = InferSelectModel<typeof favorites>;
export type MessageRow = InferSelectModel<typeof propertyMessages>;

export type PropertyType =
  | "house"
  | "apartment"
  | "condo"
  | "townhouse"
  | "duplex"
  | "studio"
  | "villa"
  | "land"
  | "commercial"
  | "industrial"
  | "farm";

export type PropertyStatus = "draft" | "active" | "pending" | "sold" | "rented" | "off_market";
export type ListingType = "sale" | "rent";

export type ParkingType = "" | "garage" | "carport" | "street" | "covered" | "assigned" | "none";
export type HeatingType = "" | "none" | "electric" | "gas" | "oil" | "heat_pump" | "solar" | "geothermal";
export type CoolingType = "" | "none" | "central" | "wall_unit" | "evaporative" | "geothermal";
export type ZoningType =
  | ""
  | "residential"
  | "commercial"
  | "agricultural"
  | "industrial"
  | "mixed_use"
  | "recreational"
  | "other";

export type AgentSpecialization = "" | "general" | "residential" | "commercial" | "land" | "industrial" | "mixed";

export type AgentApprovalStatus = "pending" | "approved" | "rejected";
export type MessageType = "" | "parent" | "reply";

export interface UsersResponse {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  avatar: string;
  is_admin: boolean;
  is_banned: boolean;
  phone: string;
  is_agent: boolean;
  created: string;
  updated: string;
}

export interface PropertiesResponse {
  id: string;
  title: string;
  description: string;
  price: number;
  listing_type: ListingType;
  property_type: PropertyType;
  status: PropertyStatus;
  location: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  dimensions: string;
  building_size_sqft: number;
  baths: number;
  lot_size_sqft: number;
  lot_size_acres: number;
  year_built: number;
  floors: number;
  beds: number;
  parking_spaces: number;
  parking_type: ParkingType;
  heating: HeatingType;
  cooling: CoolingType;
  zoning: ZoningType;
  currency: string;
  sale_price: number;
  rental_price: number;
  security_deposit: number;
  hoa_fee: number;
  annual_taxes: number;
  available_from: string;
  image_url: string;
  images: string | string[];
  video_url: string;
  virtual_tour_url: string;
  amenities?: unknown;
  features: Record<string, unknown> | unknown[] | null;
  utilities: Record<string, unknown> | unknown[] | null;
  owner_id: string;
  is_featured: boolean;
  is_new: boolean;
  location_point: { lat: number; lon: number } | null;
  agent_id: string;
  created: string;
  updated: string;
}

export interface PropertiesCreate {
  id?: string;
  title: string;
  description?: string;
  price?: number;
  listing_type: ListingType;
  property_type: PropertyType;
  status: PropertyStatus;
  location: string;
  street_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  dimensions?: string;
  building_size_sqft?: number;
  baths?: number;
  lot_size_sqft?: number;
  lot_size_acres?: number;
  year_built?: number;
  floors?: number;
  beds?: number;
  parking_spaces?: number;
  parking_type?: ParkingType;
  heating?: HeatingType;
  cooling?: CoolingType;
  zoning?: ZoningType;
  currency?: string;
  sale_price?: number;
  rental_price?: number;
  security_deposit?: number;
  hoa_fee?: number;
  annual_taxes?: number;
  available_from?: string;
  image_url?: string;
  images?: string[];
  video_url?: string;
  virtual_tour_url?: string;
  amenities?: unknown;
  features?: Record<string, unknown> | unknown[] | null;
  utilities?: Record<string, unknown> | unknown[] | null;
  owner_id?: string;
  is_featured?: boolean;
  is_new?: boolean;
  location_point?: { lat: number; lon: number } | null;
  agent_id: string;
}

export interface PropertiesUpdate {
  id?: string;
  title?: string;
  description?: string;
  price?: number;
  listing_type?: ListingType;
  property_type?: PropertyType;
  status?: PropertyStatus;
  location?: string;
  street_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  dimensions?: string;
  building_size_sqft?: number;
  baths?: number;
  lot_size_sqft?: number;
  lot_size_acres?: number;
  year_built?: number;
  floors?: number;
  beds?: number;
  parking_spaces?: number;
  parking_type?: ParkingType;
  heating?: HeatingType;
  cooling?: CoolingType;
  zoning?: ZoningType;
  currency?: string;
  sale_price?: number;
  rental_price?: number;
  security_deposit?: number;
  hoa_fee?: number;
  annual_taxes?: number;
  available_from?: string;
  image_url?: string;
  images?: string[];
  video_url?: string;
  virtual_tour_url?: string;
  amenities?: unknown;
  features?: Record<string, unknown> | unknown[] | null;
  utilities?: Record<string, unknown> | unknown[] | null;
  owner_id?: string;
  is_featured?: boolean;
  is_new?: boolean;
  location_point?: { lat: number; lon: number } | null;
  agent_id?: string;
}

export interface FavoritesResponse {
  id: string;
  user_id: string;
  property_id: string;
  created: string;
  updated: string;
}

export interface AgentsResponse {
  id: string;
  user_id: string;
  agency_name: string;
  license_number: string;
  specialization: AgentSpecialization;
  service_areas: string;
  years_experience: number;
  is_verified: boolean;
  approval_status: AgentApprovalStatus;
  created: string;
  updated: string;
}

export interface AgentsCreate {
  id?: string;
  user_id: string;
  agency_name: string;
  license_number?: string;
  specialization?: AgentSpecialization;
  service_areas?: string;
  years_experience?: number;
  is_verified?: boolean;
  approval_status?: AgentApprovalStatus;
}

export interface AgentsUpdate {
  id?: string;
  user_id?: string;
  agency_name?: string;
  license_number?: string;
  specialization?: AgentSpecialization;
  service_areas?: string;
  years_experience?: number;
  is_verified?: boolean;
  approval_status?: AgentApprovalStatus;
  resubmit?: boolean;
}

export interface PropertyMessagesResponse {
  id: string;
  user_id: string;
  property_id: string;
  type: MessageType;
  body: string;
  parent: string;
  admin_id: string;
  created: string;
  updated: string;
}

export interface PropertyMessagesCreate {
  id?: string;
  user_id: string;
  property_id: string;
  type?: MessageType;
  body: string;
  parent?: string;
  admin_id?: string;
}
