import "server-only";

import { agents, favorites, properties, propertyMessages } from "@/db/schema/app-schema";
import { user as userTable } from "@/db/schema/auth-schema";
import { getDb } from "@/lib/db/get-db";
import type { FavoritesResponse, PropertiesResponse } from "@/lib/pocketbase/types/pb-types";
import { mapAgentRowToAgentsResponse } from "@/data-access-layer/agents/drizzle-agent-mapper";
import { mapUserRowToUsersResponse } from "@/data-access-layer/user/drizzle-user-mapper";
import { mapDrizzleRowToPropertiesResponse } from "./drizzle-property-mapper";
import {
  PropertyFilters,
  PropertySortBy,
  PropertyWithFavorites,
  SortOrder,
} from "./property-types";
import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  like,
  lte,
  or,
} from "drizzle-orm";

function sortColumn(sortBy: PropertySortBy) {
  const map = {
    created: properties.createdAt,
    updated: properties.updatedAt,
    title: properties.title,
    price: properties.price,
    beds: properties.beds,
    baths: properties.baths,
    year_built: properties.yearBuilt,
    building_size_sqft: properties.buildingSizeSqft,
    lot_size_sqft: properties.lotSizeSqft,
    is_featured: properties.isFeatured,
    city: properties.city,
    state: properties.state,
  } as const;
  return map[sortBy] ?? properties.createdAt;
}

function buildPropertyWhere(filters: PropertyFilters, agentId?: string) {
  const parts = [];

  if (filters.search) {
    const p = `%${filters.search}%`;
    parts.push(
      or(
        like(properties.title, p),
        like(properties.description, p),
        like(properties.location, p),
      ),
    );
  }
  if (agentId) {
    parts.push(eq(properties.agentId, agentId));
  }
  if (filters.propertyType) {
    parts.push(eq(properties.propertyType, filters.propertyType));
  }
  if (filters.listingType) {
    parts.push(eq(properties.listingType, filters.listingType));
  }
  if (filters.status) {
    parts.push(eq(properties.status, filters.status));
  }
  if (filters.minPrice != null) {
    parts.push(gte(properties.price, filters.minPrice));
  }
  if (filters.maxPrice != null) {
    parts.push(lte(properties.price, filters.maxPrice));
  }
  if (filters.beds != null) {
    parts.push(gte(properties.beds, filters.beds));
  }
  if (filters.baths != null) {
    parts.push(gte(properties.baths, filters.baths));
  }
  if (filters.city) {
    parts.push(like(properties.city, `%${filters.city}%`));
  }
  if (filters.agentId) {
    parts.push(eq(properties.agentId, filters.agentId));
  }
  if (filters.ownerId) {
    parts.push(eq(properties.ownerId, filters.ownerId));
  }
  if (filters.isFeatured !== undefined) {
    parts.push(eq(properties.isFeatured, filters.isFeatured));
  }

  if (parts.length === 0) {
    return undefined;
  }
  if (parts.length === 1) {
    return parts[0];
  }
  return and(...parts);
}

export async function getPaginatedPropertiesFromD1({
  filters = {},
  sortBy = "created",
  sortOrder = "desc",
  page = 1,
  limit = 20,
  agentId,
}: {
  filters?: PropertyFilters;
  sortBy?: PropertySortBy;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
  agentId?: string;
}) {
  const db = await getDb();
  const whereClause = buildPropertyWhere(filters, agentId);
  const col = sortColumn(sortBy);
  const order = sortOrder === "asc" ? asc(col) : desc(col);
  const offset = (page - 1) * limit;

  const [countRow] = await db
    .select({ n: count() })
    .from(properties)
    .where(whereClause);

  const totalItems = Number(countRow?.n ?? 0);
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const rows = await db
    .select()
    .from(properties)
    .where(whereClause)
    .orderBy(order)
    .limit(limit)
    .offset(offset);

  const mapped = rows.map(mapDrizzleRowToPropertiesResponse);

  return {
    success: true as const,
    properties: mapped,
    pagination: {
      page,
      limit,
      totalCount: totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export async function getPropertyByIdFromD1(
  propertyId: string,
): Promise<{ success: true; result: PropertyWithFavorites } | { success: false; result: null; message: string }> {
  const db = await getDb();
  const [row] = await db.select().from(properties).where(eq(properties.id, propertyId)).limit(1);

  if (!row) {
    return { success: false, result: null, message: "Property not found" };
  }

  const mapped = mapDrizzleRowToPropertiesResponse(row);

  const [agentRow] = await db
    .select()
    .from(agents)
    .where(eq(agents.id, mapped.agent_id))
    .limit(1);

  const expand: PropertyWithFavorites["expand"] = {};
  if (agentRow) {
    const agentMapped = mapAgentRowToAgentsResponse(agentRow);
    const [ownerUser] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, agentRow.userId))
      .limit(1);
    expand.agent_id = {
      ...agentMapped,
      expand: ownerUser ? { user_id: mapUserRowToUsersResponse(ownerUser) } : undefined,
    };
  }

  const result: PropertyWithFavorites = {
    ...mapped,
    expand: Object.keys(expand).length ? expand : undefined,
  };

  return { success: true, result };
}

export async function getFavoritePropertiesFromD1({
  userId,
  page = 1,
  limit = 20,
}: {
  userId: string;
  page?: number;
  limit?: number;
}) {
  const db = await getDb();
  const offset = (page - 1) * limit;

  const whereFav = eq(favorites.userId, userId);

  const [countRow] = await db.select({ n: count() }).from(favorites).where(whereFav);
  const totalItems = Number(countRow?.n ?? 0);
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const favRows = await db
    .select({ f: favorites })
    .from(favorites)
    .where(whereFav)
    .orderBy(desc(favorites.createdAt))
    .limit(limit)
    .offset(offset);

  const out: PropertiesResponse[] = [];
  for (const { f } of favRows) {
    const [prop] = await db.select().from(properties).where(eq(properties.id, f.propertyId)).limit(1);
    if (prop) {
      out.push(mapDrizzleRowToPropertiesResponse(prop));
    }
  }

  return {
    success: true as const,
    properties: out,
    pagination: {
      page,
      limit,
      totalCount: totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export async function getSearchableFavoritesFromD1({
  q = "",
  page = 1,
  limit = 50,
}: {
  q?: string;
  page?: number;
  limit?: number;
}) {
  const db = await getDb();
  const offset = (page - 1) * limit;

  const searchCond = q.trim()
    ? like(properties.title, `%${q.trim()}%`)
    : undefined;

  const countJoin = db
    .select({ n: count() })
    .from(favorites)
    .innerJoin(properties, eq(favorites.propertyId, properties.id));

  const [countRow] = searchCond
    ? await countJoin.where(searchCond)
    : await countJoin;

  const totalItems = Number(countRow?.n ?? 0);
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const baseJoin = db
    .select({
      fav: favorites,
      prop: properties,
      usr: userTable,
    })
    .from(favorites)
    .innerJoin(properties, eq(favorites.propertyId, properties.id))
    .innerJoin(userTable, eq(favorites.userId, userTable.id));

  const rows = searchCond
    ? await baseJoin
        .where(searchCond)
        .orderBy(desc(favorites.createdAt))
        .limit(limit)
        .offset(offset)
    : await baseJoin.orderBy(desc(favorites.createdAt)).limit(limit).offset(offset);

  const items: (FavoritesResponse & {
    expand?: {
      property_id: PropertiesResponse;
      user_id: ReturnType<typeof mapUserRowToUsersResponse>;
    };
  })[] = rows.map(({ fav, prop, usr }) => ({
    id: fav.id,
    collectionId: "",
    collectionName: "favorites",
    created: fav.createdAt ? new Date(fav.createdAt).toISOString() : "",
    updated: fav.updatedAt ? new Date(fav.updatedAt).toISOString() : "",
    user_id: fav.userId,
    property_id: fav.propertyId,
    expand: {
      property_id: mapDrizzleRowToPropertiesResponse(prop),
      user_id: mapUserRowToUsersResponse(usr),
    },
  }));

  return {
    success: true as const,
    result: {
      items,
      page,
      perPage: limit,
      totalItems,
      totalPages,
    },
  };
}

export async function getPaginatedUsersFromD1({
  q = "",
  page = 1,
  limit = 50,
  sortBy = "created",
  sortOrder = "desc",
}: {
  q?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  const db = await getDb();
  const offset = (page - 1) * limit;

  const searchWhere = q.trim()
    ? or(like(userTable.name, `%${q}%`), like(userTable.email, `%${q}%`))
    : undefined;

  const sortCol =
    sortBy === "email"
      ? userTable.email
      : sortBy === "name"
        ? userTable.name
        : userTable.createdAt;

  const order = sortOrder === "asc" ? asc(sortCol) : desc(sortCol);

  const whereClause = searchWhere;

  const [countRow] = await db
    .select({ n: count() })
    .from(userTable)
    .where(whereClause);

  const totalItems = Number(countRow?.n ?? 0);
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const userRows = await db
    .select()
    .from(userTable)
    .where(whereClause)
    .orderBy(order)
    .limit(limit)
    .offset(offset);

  const items = userRows.map(mapUserRowToUsersResponse);

  return {
    success: true as const,
    result: {
      items,
      page,
      perPage: limit,
      totalItems,
      totalPages,
    },
  };
}

export async function getPropertyStatsFromD1() {
  const db = await getDb();

  const statusCounts = await db
    .select({
      status: properties.status,
      n: count(),
    })
    .from(properties)
    .groupBy(properties.status);

  const byStatus = Object.fromEntries(statusCounts.map((r) => [r.status, Number(r.n)]));

  const [totalRow] = await db.select({ n: count() }).from(properties);
  const total = Number(totalRow?.n ?? 0);

  const [featuredRow] = await db
    .select({ n: count() })
    .from(properties)
    .where(eq(properties.isFeatured, true));
  const featured = Number(featuredRow?.n ?? 0);

  const recentRows = await db
    .select()
    .from(properties)
    .orderBy(desc(properties.createdAt))
    .limit(50);

  const recent = recentRows.map(mapDrizzleRowToPropertiesResponse);

  return {
    success: true as const,
    result: {
      recent: { items: recent, totalItems: total },
      total,
      active: byStatus.active ?? 0,
      sold: byStatus.sold ?? 0,
      rented: byStatus.rented ?? 0,
      draft: byStatus.draft ?? 0,
      featured,
    },
  };
}

export async function countPropertyMessagesFromD1(filter?: "parent" | "all") {
  const db = await getDb();
  if (filter === "parent") {
    const [row] = await db
      .select({ n: count() })
      .from(propertyMessages)
      .where(eq(propertyMessages.type, "parent"));
    return Number(row?.n ?? 0);
  }
  const [row] = await db.select({ n: count() }).from(propertyMessages);
  return Number(row?.n ?? 0);
}

export async function getRecentActivitiesFromD1() {
  const db = await getDb();

  const recentPropertyRows = await db
    .select()
    .from(properties)
    .orderBy(desc(properties.createdAt))
    .limit(10);

  const favRows = await db
    .select({
      f: favorites,
      prop: properties,
      usr: userTable,
    })
    .from(favorites)
    .innerJoin(properties, eq(favorites.propertyId, properties.id))
    .innerJoin(userTable, eq(favorites.userId, userTable.id))
    .orderBy(desc(favorites.createdAt))
    .limit(10);

  const msgRows = await db
    .select({
      m: propertyMessages,
      prop: properties,
      usr: userTable,
    })
    .from(propertyMessages)
    .innerJoin(properties, eq(propertyMessages.propertyId, properties.id))
    .innerJoin(userTable, eq(propertyMessages.userId, userTable.id))
    .orderBy(desc(propertyMessages.createdAt))
    .limit(10);

  const recentFavorites = favRows.map(({ f, prop, usr }) => ({
    id: f.id,
    collectionId: "",
    collectionName: "favorites" as const,
    created: f.createdAt ? new Date(f.createdAt).toISOString() : "",
    updated: f.updatedAt ? new Date(f.updatedAt).toISOString() : "",
    user_id: f.userId,
    property_id: f.propertyId,
    expand: {
      property_id: mapDrizzleRowToPropertiesResponse(prop),
      user_id: mapUserRowToUsersResponse(usr),
    },
  }));

  const recentMessages = msgRows.map(({ m, prop, usr }) => ({
    id: m.id,
    collectionId: "",
    collectionName: "property_messages" as const,
    created: m.createdAt ? new Date(m.createdAt).toISOString() : "",
    updated: m.updatedAt ? new Date(m.updatedAt).toISOString() : "",
    user_id: m.userId,
    property_id: m.propertyId,
    type: (m.type ?? "") as "parent" | "reply" | "",
    body: m.body,
    parent: m.parent ?? "",
    admin_id: m.adminId ?? "",
    expand: {
      property_id: mapDrizzleRowToPropertiesResponse(prop),
      user_id: mapUserRowToUsersResponse(usr),
    },
  }));

  return {
    success: true as const,
    data: {
      recentProperties: recentPropertyRows.map(mapDrizzleRowToPropertiesResponse),
      recentFavorites,
      recentMessages,
    },
  };
}
