import { relations } from "drizzle-orm";
import { index, integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";

export const agents = sqliteTable(
  "agents",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" })
      .unique(),
    agencyName: text("agency_name").notNull(),
    licenseNumber: text("license_number"),
    specialization: text("specialization"),
    serviceAreas: text("service_areas"),
    yearsExperience: real("years_experience"),
    isVerified: integer("is_verified", { mode: "boolean" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [index("agents_user_id_idx").on(t.userId)],
);

export const properties = sqliteTable("properties", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  price: real("price"),
  listingType: text("listing_type").notNull(),
  propertyType: text("property_type").notNull(),
  status: text("status").notNull(),
  location: text("location").notNull(),
  streetAddress: text("street_address"),
  city: text("city"),
  state: text("state"),
  postalCode: text("postal_code"),
  country: text("country"),
  dimensions: text("dimensions"),
  buildingSizeSqft: real("building_size_sqft"),
  baths: real("baths"),
  lotSizeSqft: real("lot_size_sqft"),
  lotSizeAcres: real("lot_size_acres"),
  yearBuilt: real("year_built"),
  floors: real("floors"),
  beds: real("beds"),
  parkingSpaces: real("parking_spaces"),
  parkingType: text("parking_type"),
  heating: text("heating"),
  cooling: text("cooling"),
  zoning: text("zoning"),
  currency: text("currency"),
  salePrice: real("sale_price"),
  rentalPrice: real("rental_price"),
  securityDeposit: real("security_deposit"),
  hoaFee: real("hoa_fee"),
  annualTaxes: real("annual_taxes"),
  availableFrom: text("available_from"),
  imageUrl: text("image_url"),
  images: text("images", { mode: "json" }).$type<string[] | null>(),
  videoUrl: text("video_url"),
  virtualTourUrl: text("virtual_tour_url"),
  amenities: text("amenities", { mode: "json" }).$type<unknown>(),
  features: text("features", { mode: "json" }).$type<unknown>(),
  utilities: text("utilities", { mode: "json" }).$type<unknown>(),
  ownerId: text("owner_id").references(() => user.id, { onDelete: "set null" }),
  isFeatured: integer("is_featured", { mode: "boolean" }),
  isNew: integer("is_new", { mode: "boolean" }),
  locationLat: real("location_lat"),
  locationLon: real("location_lon"),
  agentId: text("agent_id")
    .notNull()
    .references(() => agents.id, { onDelete: "restrict" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const favorites = sqliteTable(
  "favorites",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    propertyId: text("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [
    uniqueIndex("favorites_user_property_uidx").on(t.userId, t.propertyId),
    index("favorites_user_id_idx").on(t.userId),
  ],
);

export const propertyMessages = sqliteTable(
  "property_messages",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    propertyId: text("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    type: text("type"),
    body: text("body").notNull(),
    parent: text("parent"),
    adminId: text("admin_id").references(() => user.id, { onDelete: "set null" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [
    index("property_messages_property_id_idx").on(t.propertyId),
    index("property_messages_user_id_idx").on(t.userId),
  ],
);

export const agentsRelations = relations(agents, ({ one, many }) => ({
  user: one(user, {
    fields: [agents.userId],
    references: [user.id],
  }),
  properties: many(properties),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  owner: one(user, {
    fields: [properties.ownerId],
    references: [user.id],
  }),
  agent: one(agents, {
    fields: [properties.agentId],
    references: [agents.id],
  }),
  favorites: many(favorites),
  messages: many(propertyMessages),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(user, {
    fields: [favorites.userId],
    references: [user.id],
  }),
  property: one(properties, {
    fields: [favorites.propertyId],
    references: [properties.id],
  }),
}));

export const propertyMessagesRelations = relations(propertyMessages, ({ one }) => ({
  user: one(user, {
    relationName: "property_message_author",
    fields: [propertyMessages.userId],
    references: [user.id],
  }),
  property: one(properties, {
    fields: [propertyMessages.propertyId],
    references: [properties.id],
  }),
  parentMessage: one(propertyMessages, {
    fields: [propertyMessages.parent],
    references: [propertyMessages.id],
  }),
  adminUser: one(user, {
    relationName: "property_message_admin",
    fields: [propertyMessages.adminId],
    references: [user.id],
  }),
}));
