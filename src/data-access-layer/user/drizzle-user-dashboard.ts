import "server-only";

import { favorites, properties, propertyMessages } from "@/db/schema/app-schema";
import { getDb } from "@/lib/db/get-db";
import type { PropertiesResponse, PropertyMessagesResponse } from "@/types/domain-types";
import { mapDrizzleRowToPropertiesResponse } from "@/data-access-layer/properties/drizzle-property-mapper";
import { count, desc, eq } from "drizzle-orm";

export async function drizzleGetUserDashboardStats(userId: string) {
  const db = await getDb();

  const [tf] = await db
    .select({ n: count() })
    .from(favorites)
    .where(eq(favorites.userId, userId));

  const totalFavorites = Number(tf?.n ?? 0);

  const favRows = await db
    .select()
    .from(favorites)
    .where(eq(favorites.userId, userId))
    .orderBy(desc(favorites.createdAt))
    .limit(5);

  const recentFavorites: {
    id: string;
    property: PropertiesResponse;
    created: string;
  }[] = [];

  for (const f of favRows) {
    const [prop] = await db.select().from(properties).where(eq(properties.id, f.propertyId)).limit(1);
    if (prop) {
      recentFavorites.push({
        id: f.id,
        property: mapDrizzleRowToPropertiesResponse(prop),
        created: f.createdAt ? new Date(f.createdAt).toISOString() : "",
      });
    }
  }

  return { totalFavorites, recentFavorites };
}

export async function drizzleGetUserFavoriteProperties(
  userId: string,
  page = 1,
  limit = 10,
) {
  const db = await getDb();
  const offset = (page - 1) * limit;

  const [tc] = await db
    .select({ n: count() })
    .from(favorites)
    .where(eq(favorites.userId, userId));
  const totalItems = Number(tc?.n ?? 0);
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const favRows = await db
    .select()
    .from(favorites)
    .where(eq(favorites.userId, userId))
    .orderBy(desc(favorites.createdAt))
    .limit(limit)
    .offset(offset);

  const items: {
    id: string;
    property: PropertiesResponse;
    created: string;
  }[] = [];

  for (const f of favRows) {
    const [prop] = await db.select().from(properties).where(eq(properties.id, f.propertyId)).limit(1);
    if (prop) {
      items.push({
        id: f.id,
        property: mapDrizzleRowToPropertiesResponse(prop),
        created: f.createdAt ? new Date(f.createdAt).toISOString() : "",
      });
    }
  }

  return {
    items,
    totalItems,
    totalPages,
    page,
  };
}

export async function drizzleGetUserMessages(userId: string, limit = 50, page = 1) {
  const db = await getDb();
  const offset = (page - 1) * limit;

  const rows = await db
    .select({
      m: propertyMessages,
      prop: properties,
    })
    .from(propertyMessages)
    .innerJoin(properties, eq(propertyMessages.propertyId, properties.id))
    .where(eq(propertyMessages.userId, userId))
    .orderBy(desc(propertyMessages.createdAt))
    .limit(limit)
    .offset(offset);

  return rows.map(({ m, prop }) => {
    const created = m.createdAt ? new Date(m.createdAt).toISOString() : "";
    const updated = m.updatedAt ? new Date(m.updatedAt).toISOString() : created;
    const base: PropertyMessagesResponse = {
      id: m.id,
      user_id: m.userId,
      property_id: m.propertyId,
      type: (m.type ?? "") as PropertyMessagesResponse["type"],
      body: m.body,
      parent: m.parent ?? "",
      admin_id: m.adminId ?? "",
      created,
      updated,
    };
    return {
      ...base,
      expand: {
        property_id: mapDrizzleRowToPropertiesResponse(prop),
      },
    };
  });
}
