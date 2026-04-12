"use server";

import { agents, properties } from "@/db/schema/app-schema";
import { mapAgentRowToAgentsResponse } from "@/data-access-layer/agents/drizzle-agent-mapper";
import { mapSessionUserToUsersResponse } from "@/data-access-layer/user/map-session-user";
import { getBetterAuthSession } from "@/lib/auth/get-session";
import { getDb } from "@/lib/db/get-db";
import { canManageProperty } from "@/lib/property/can-manage-property";
import type { PropertiesCreate, PropertiesResponse, PropertiesUpdate } from "@/types/domain-types";
import { eq } from "drizzle-orm";
import {
  getPaginatedPropertiesFromD1,
  getPropertyByIdFromD1,
  getSearchableFavoritesFromD1,
} from "../properties/drizzle-property-queries";
import { getFeaturedPropertiesFromD1 } from "../properties/drizzle-featured-queries";
import type { PropertyFilters, PropertySortBy, PropertyWithFavorites, SortOrder } from "../properties/property-types";

type ActionResult<T = unknown> = { success: true; data: T } | { success: false; message: string };

const toStr = (v: unknown): string | null => (v != null ? String(v) : null);
const toNum = (v: unknown): number | null => (v != null ? Number(v) : null);

export async function fetchPaginatedProperties(params: {
  page?: number;
  limit?: number;
  q?: string;
  filters?: PropertyFilters;
  sortBy?: PropertySortBy;
  sortOrder?: SortOrder;
  agentId?: string;
}): Promise<
  ActionResult<{
    items: PropertiesResponse[];
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  }>
> {
  try {
    const {
      page = 1,
      limit = 50,
      q = "",
      filters = {},
      sortBy = "created",
      sortOrder = "desc",
      agentId,
    } = params;

    const mergedFilters = { ...filters, search: q || filters.search || "" };

    const result = await getPaginatedPropertiesFromD1({
      filters: mergedFilters,
      sortBy,
      sortOrder,
      page,
      limit,
      agentId,
    });

    return {
      success: true,
      data: {
        items: result.properties,
        page: result.pagination.page,
        perPage: result.pagination.limit,
        totalItems: result.pagination.totalCount,
        totalPages: result.pagination.totalPages,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch properties",
    };
  }
}

export async function fetchPropertyById(
  propertyId: string,
): Promise<ActionResult<PropertyWithFavorites>> {
  try {
    const result = await getPropertyByIdFromD1(propertyId);
    if (!result.success) {
      return { success: false, message: result.message };
    }
    return { success: true, data: result.result };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch property",
    };
  }
}

export async function fetchSearchableFavorites(params: {
  q?: string;
  page?: number;
  limit?: number;
}): Promise<ActionResult<{ items: unknown[]; page: number; perPage: number; totalItems: number; totalPages: number }>> {
  try {
    const { q = "", page = 1, limit = 50 } = params;
    const result = await getSearchableFavoritesFromD1({ q, page, limit });
    return { success: true, data: result.result };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch favorites",
    };
  }
}

export async function fetchFeaturedProperties(params: {
  limit?: number;
}): Promise<ActionResult<{ properties: PropertiesResponse[]; totalCount: number }>> {
  try {
    const result = await getFeaturedPropertiesFromD1(params.limit ?? 12);
    return { success: true, data: { properties: result.properties, totalCount: result.totalCount } };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch featured properties",
    };
  }
}

export async function createProperty(
  data: PropertiesCreate & { id?: string },
): Promise<ActionResult<{ record: unknown }>> {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return { success: false, message: "Unauthorized" };
  }

  const authUser = mapSessionUserToUsersResponse(session.user);
  const agentId = String(data.agent_id);
  const db = await getDb();

  const [agentRow] = await db.select().from(agents).where(eq(agents.id, agentId)).limit(1);
  if (!agentRow) {
    return { success: false, message: "Invalid agent" };
  }
  if (agentRow.userId !== session.user.id && !authUser.is_admin) {
    return { success: false, message: "Forbidden" };
  }
  if (!authUser.is_admin && agentRow.approvalStatus !== "approved") {
    return { success: false, message: "Agent account is not approved to list properties" };
  }

  const now = new Date();
  let id = data.id?.trim() || crypto.randomUUID();
  const [collision] = await db
    .select({ id: properties.id })
    .from(properties)
    .where(eq(properties.id, id))
    .limit(1);
  if (collision) {
    id = `${id}-${crypto.randomUUID().slice(0, 8)}`;
  }
  const locationPoint = data.location_point;

  const [row] = await db
    .insert(properties)
    .values({
      id,
      title: data.title,
      description: toStr(data.description),
      price: toNum(data.price),
      listingType: data.listing_type,
      propertyType: data.property_type,
      status: data.status,
      location: data.location,
      streetAddress: toStr(data.street_address),
      city: toStr(data.city),
      state: toStr(data.state),
      postalCode: toStr(data.postal_code),
      country: toStr(data.country),
      dimensions: toStr(data.dimensions),
      buildingSizeSqft: toNum(data.building_size_sqft),
      baths: toNum(data.baths),
      lotSizeSqft: toNum(data.lot_size_sqft),
      lotSizeAcres: toNum(data.lot_size_acres),
      yearBuilt: toNum(data.year_built),
      floors: toNum(data.floors),
      beds: toNum(data.beds),
      parkingSpaces: toNum(data.parking_spaces),
      parkingType: toStr(data.parking_type),
      heating: toStr(data.heating),
      cooling: toStr(data.cooling),
      zoning: toStr(data.zoning),
      currency: toStr(data.currency) ?? "KES",
      salePrice: toNum(data.sale_price),
      rentalPrice: toNum(data.rental_price),
      securityDeposit: toNum(data.security_deposit),
      hoaFee: toNum(data.hoa_fee),
      annualTaxes: toNum(data.annual_taxes),
      availableFrom: toStr(data.available_from),
      imageUrl: toStr(data.image_url),
      images: data.images ?? null,
      videoUrl: toStr(data.video_url),
      virtualTourUrl: toStr(data.virtual_tour_url),
      amenities: data.amenities ?? null,
      features: data.features ?? null,
      utilities: data.utilities ?? null,
      ownerId: toStr(data.owner_id) ?? session.user.id,
      isFeatured: Boolean(data.is_featured ?? false),
      isNew: Boolean(data.is_new ?? true),
      locationLat: locationPoint?.lat ?? null,
      locationLon: locationPoint?.lon ?? null,
      agentId,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return { success: true, data: { record: row } };
}

export async function updateProperty(
  data: PropertiesUpdate & { id: string },
): Promise<ActionResult<{ record: unknown }>> {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return { success: false, message: "Unauthorized" };
  }

  const user = mapSessionUserToUsersResponse(session.user);
  const db = await getDb();
  const [agentRow] = await db.select().from(agents).where(eq(agents.userId, user.id)).limit(1);
  const agent = agentRow ? mapAgentRowToAgentsResponse(agentRow) : null;

  const [existing] = await db
    .select({ agentId: properties.agentId, ownerId: properties.ownerId })
    .from(properties)
    .where(eq(properties.id, data.id))
    .limit(1);

  if (!existing) {
    return { success: false, message: "Property not found" };
  }

  if (!canManageProperty(user, agent, { agent_id: existing.agentId, owner_id: existing.ownerId ?? "" })) {
    return { success: false, message: "Forbidden" };
  }

  const now = new Date();
  const updates: Record<string, unknown> = { updatedAt: now };

  const fieldMap: Record<string, string> = {
    title: "title",
    description: "description",
    price: "price",
    listing_type: "listingType",
    property_type: "propertyType",
    status: "status",
    location: "location",
    street_address: "streetAddress",
    city: "city",
    state: "state",
    postal_code: "postalCode",
    country: "country",
    dimensions: "dimensions",
    building_size_sqft: "buildingSizeSqft",
    baths: "baths",
    lot_size_sqft: "lotSizeSqft",
    lot_size_acres: "lotSizeAcres",
    year_built: "yearBuilt",
    floors: "floors",
    beds: "beds",
    parking_spaces: "parkingSpaces",
    parking_type: "parkingType",
    heating: "heating",
    cooling: "cooling",
    zoning: "zoning",
    currency: "currency",
    sale_price: "salePrice",
    rental_price: "rentalPrice",
    security_deposit: "securityDeposit",
    hoa_fee: "hoaFee",
    annual_taxes: "annualTaxes",
    available_from: "availableFrom",
    image_url: "imageUrl",
    images: "images",
    video_url: "videoUrl",
    virtual_tour_url: "virtualTourUrl",
    amenities: "amenities",
    features: "features",
    utilities: "utilities",
    owner_id: "ownerId",
    is_featured: "isFeatured",
    is_new: "isNew",
    agent_id: "agentId",
  };

  const body = data as unknown as Record<string, unknown>;
  if (!user.is_admin) {
    delete body.owner_id;
    delete body.agent_id;
  }

  for (const [snakeKey, camelKey] of Object.entries(fieldMap)) {
    if (body[snakeKey] !== undefined) {
      updates[camelKey] = body[snakeKey];
    }
  }

  if (data.location_point !== undefined) {
    updates.locationLat = data.location_point?.lat ?? null;
    updates.locationLon = data.location_point?.lon ?? null;
  }

  const [row] = await db.update(properties).set(updates).where(eq(properties.id, data.id)).returning();
  if (!row) {
    return { success: false, message: "Property not found" };
  }

  return { success: true, data: { record: row } };
}

export async function deleteProperty(id: string): Promise<ActionResult<null>> {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return { success: false, message: "Unauthorized" };
  }

  const user = mapSessionUserToUsersResponse(session.user);
  const db = await getDb();
  const [agentRow] = await db.select().from(agents).where(eq(agents.userId, user.id)).limit(1);
  const agent = agentRow ? mapAgentRowToAgentsResponse(agentRow) : null;

  const [existing] = await db
    .select({ agentId: properties.agentId, ownerId: properties.ownerId })
    .from(properties)
    .where(eq(properties.id, id))
    .limit(1);

  if (!existing) {
    return { success: false, message: "Property not found" };
  }

  if (!canManageProperty(user, agent, { agent_id: existing.agentId, owner_id: existing.ownerId ?? "" })) {
    return { success: false, message: "Forbidden" };
  }

  await db.delete(properties).where(eq(properties.id, id));
  return { success: true, data: null };
}

export async function updatePropertyImages(
  propertyId: string,
  images: string[],
  imageUrl: string,
): Promise<ActionResult<null>> {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return { success: false, message: "Unauthorized" };
  }

  const user = mapSessionUserToUsersResponse(session.user);
  const db = await getDb();
  const [agentRow] = await db.select().from(agents).where(eq(agents.userId, user.id)).limit(1);
  const agent = agentRow ? mapAgentRowToAgentsResponse(agentRow) : null;

  const [existing] = await db
    .select({ agentId: properties.agentId, ownerId: properties.ownerId })
    .from(properties)
    .where(eq(properties.id, propertyId))
    .limit(1);

  if (!existing) {
    return { success: false, message: "Property not found" };
  }

  if (!canManageProperty(user, agent, { agent_id: existing.agentId, owner_id: existing.ownerId ?? "" })) {
    return { success: false, message: "Forbidden" };
  }

  await db
    .update(properties)
    .set({ images, imageUrl, updatedAt: new Date() })
    .where(eq(properties.id, propertyId));

  return { success: true, data: null };
}
