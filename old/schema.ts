// @ts-nocheck
import { sql } from "drizzle-orm";
import { serial, uuid, varchar } from "drizzle-orm/pg-core";
import { pgTable, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
// Add advanced column types and enums
import { pgEnum, jsonb, numeric, doublePrecision } from "drizzle-orm/pg-core";
// PostGIS geometry + index
import { index } from "drizzle-orm/pg-core";
// Custom PostGIS types (workaround for Drizzle geometry bug)
import { multiPolygon, point } from "./postgis-types";

// ====================================================

// AUTH SCHEMA

// ====================================================

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => /* @__PURE__ */ new Date()),
});

// ====================================================

// PROPERTIES SCHEMA

// ====================================================

// Enums for listings and property details
export const listingTypeEnum = pgEnum("listing_type", ["sale", "rent"]);
export const propertyTypeEnum = pgEnum("property_type", [
  "house",
  "apartment",
  "condo",
  "townhouse",
  "duplex",
  "studio",
  "villa",
  "land",
  "commercial",
  "industrial",
  "farm",
]);
export const propertyStatusEnum = pgEnum("property_status", [
  "draft",
  "active",
  "pending",
  "sold",
  "rented",
  "off_market",
]);
export const parkingTypeEnum = pgEnum("parking_type", [
  "garage",
  "carport",
  "street",
  "covered",
  "assigned",
  "none",
]);
export const heatingTypeEnum = pgEnum("heating_type", [
  "none",
  "electric",
  "gas",
  "oil",
  "heat_pump",
  "solar",
  "geothermal",
]);
export const coolingTypeEnum = pgEnum("cooling_type", [
  "none",
  "central",
  "wall_unit",
  "evaporative",
  "geothermal",
]);
export const zoningEnum = pgEnum("zoning", [
  "residential",
  "commercial",
  "agricultural",
  "industrial",
  "mixed_use",
  "recreational",
  "other",
]);

export const property = pgTable(
  "property",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuid_generate_v7()`),

    // Basic info
    title: text("title").notNull(),
    description: text("description"),
    slug: text("slug").unique(),

    // Classification
    listingType: listingTypeEnum("listing_type").notNull().default("sale"),
    propertyType: propertyTypeEnum("property_type").notNull(),
    status: propertyStatusEnum("status").notNull().default("active"),

    // Location
    location: text("location").notNull(), // human-readable
    streetAddress: text("street_address"),
    city: text("city"),
    state: text("state"),
    postalCode: text("postal_code"),
    country: text("country"),
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    // PostGIS geometry point (WGS84) using custom type
    locationGeom: point("location_geom"),

    // Size & structure
    dimensions: text("dimensions"),
    buildingSizeSqft: integer("building_size_sqft"),
    lotSizeSqft: integer("lot_size_sqft"),
    lotSizeAcres: numeric("lot_size_acres", { precision: 10, scale: 2 }),
    yearBuilt: integer("year_built"),
    floors: integer("floors"),
    beds: integer("beds"),
    baths: integer("baths"),
    parkingSpaces: integer("parking_spaces"),
    parkingType: parkingTypeEnum("parking_type"),
    heating: heatingTypeEnum("heating"),
    cooling: coolingTypeEnum("cooling"),
    zoning: zoningEnum("zoning"), // useful for land

    // Pricing (either sale or rent)
    currency: text("currency").default("KES"),
    price: integer("price"), // generic price if you need a single field
    salePrice: integer("sale_price"),
    rentalPrice: integer("rental_price"),
    securityDeposit: integer("security_deposit"),
    hoaFee: integer("hoa_fee"),
    annualTaxes: integer("annual_taxes"),
    availableFrom: timestamp("available_from"),

    // Media & metadata
    imageUrl: text("image_url"), // primary image
    images: jsonb("images").default(sql`'[]'::jsonb`),
    videoUrl: text("video_url"),
    virtualTourUrl: text("virtual_tour_url"),
    amenities: jsonb("amenities").default(sql`'[]'::jsonb`),
    features: jsonb("features").default(sql`'[]'::jsonb`),
    utilities: jsonb("utilities").default(sql`'{}'::jsonb`),

    // Relations
    agentId: text("agent_id").references(() => user.id, { onDelete: "set null" }),
    ownerId: text("owner_id").references(() => user.id, { onDelete: "set null" }),

    // Flags
    isFeatured: boolean("is_featured")
      .$defaultFn(() => false)
      .notNull(),
    isNew: boolean("is_new")
      .$defaultFn(() => false)
      .notNull(),

    // Timestamps
    createdAt: timestamp("created_at")
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (t) => [
    // Spatial index for efficient geo queries
    index("property_location_geom_gix").using("gist", t.locationGeom),
  ]
);

export const kenyaWards = pgTable(
  "kenya_wards",
  {
    id: serial("id").primaryKey(),
    wardCode: varchar("ward_code", { length: 10 }).notNull(),
    ward: text("ward").notNull(),
    county: text("county").notNull(),
    countyCode: integer("county_code").notNull(),
    subCounty: text("sub_county"),
    constituency: text("constituency").notNull(),
    constituencyCode: integer("constituency_code").notNull(),
    geometry: multiPolygon("geometry").notNull(),
  },
  (t) => [index("kenya_wards_geometry_gix").using("gist", t.geometry)]
);

// If you need to create a spatial index (recommended for performance):
// CREATE INDEX idx_kenya_wards_geometry ON kenya_wards USING GIST(geometry);

// User favorites/bookmarks for properties
export const favorite = pgTable(
  "favorite",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuid_generate_v7()`),
    
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    
    propertyId: uuid("property_id")
      .notNull()
      .references(() => property.id, { onDelete: "cascade" }),
    
    createdAt: timestamp("created_at")
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (t) => [
    // Unique constraint to prevent duplicate favorites
    index("favorite_user_property_unique").on(t.userId, t.propertyId)
  ]
);
