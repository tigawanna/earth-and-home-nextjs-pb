import "server-only";

import { property, favorite, user } from "@/lib/drizzle/schema";
import { eq, and, desc, asc, sql, count, ilike } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/drizzle/client";
import { headers } from "next/headers";
import { PropertyFilters, PropertySortBy, PropertyWithAgent, SortOrder } from "./property-types";

// ====================================================
// GET PROPERTIES (with filtering, sorting, pagination)
// ====================================================

export async function getProperties({
  filters = {},
  sortBy = "createdAt",
  sortOrder = "desc",
  page = 1,
  limit = 20,
  userId,
}: {
  filters?: PropertyFilters;
  sortBy?: PropertySortBy;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
  userId?: string; // For checking favorites
} = {}) {
  console.log("=== getProperties filters ===", filters);
  try {
    const offset = (page - 1) * limit;

    // Build WHERE conditions
    const conditions = [];

    if (filters.search) {
      conditions.push(
        sql`(${property.title} ILIKE ${`%${filters.search}%`} OR ${
          property.description
        } ILIKE ${`%${filters.search}%`} OR ${property.location} ILIKE ${`%${filters.search}%`})`
      );
    }

    if (filters.propertyType) {
      conditions.push(eq(property.propertyType, filters.propertyType as any));
    }

    if (filters.listingType) {
      conditions.push(eq(property.listingType, filters.listingType));
    }

    if (filters.status) {
      conditions.push(eq(property.status, filters.status as any));
    }

    if (filters.minPrice) {
      conditions.push(
        sql`COALESCE(${property.salePrice}, ${property.rentalPrice}, ${property.price}) >= ${filters.minPrice}`
      );
    }

    if (filters.maxPrice) {
      conditions.push(
        sql`COALESCE(${property.salePrice}, ${property.rentalPrice}, ${property.price}) <= ${filters.maxPrice}`
      );
    }

    if (filters.beds) {
      conditions.push(eq(property.beds, filters.beds));
    }

    if (filters.baths) {
      conditions.push(eq(property.baths, filters.baths));
    }

    if (filters.city) {
      conditions.push(ilike(property.city, `%${filters.city}%`));
    }

    if (filters.agentId) {
      conditions.push(eq(property.agentId, filters.agentId));
    }

    if (filters.ownerId) {
      conditions.push(eq(property.ownerId, filters.ownerId));
    }

    if (filters.isFeatured !== undefined) {
      conditions.push(eq(property.isFeatured, filters.isFeatured));
    }

    const whereClause = conditions.length > 0 ? sql.join(conditions, sql` AND `) : undefined;

    // Build ORDER BY
    const orderBy = sortOrder === "desc" ? desc(property[sortBy]) : asc(property[sortBy]);

    // Get properties with agent/owner info and favorite status
    const baseQuery = db
      .select({
        property: property,
        agent: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
        isFavorited: userId
          ? sql<boolean>`EXISTS(
          SELECT 1 FROM ${favorite} 
          WHERE ${favorite.propertyId} = ${property.id} 
          AND ${favorite.userId} = ${userId}
        )`
          : sql<boolean>`false`,
      })
      .from(property)
      .leftJoin(user, eq(property.agentId, user.id));

    // Execute query with conditions
    const properties = whereClause
      ? await baseQuery.where(whereClause).orderBy(orderBy).limit(limit).offset(offset)
      : await baseQuery.orderBy(orderBy).limit(limit).offset(offset);

    // Get total count for pagination
    const totalCountQuery = whereClause
      ? await db.select({ count: count() }).from(property).where(whereClause)
      : await db.select({ count: count() }).from(property);

    const totalCount = totalCountQuery[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      properties: properties.map((p) => ({
        ...p.property,
        agent: p.agent,
        isFavorited: p.isFavorited,
      })) as PropertyWithAgent[],
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    // console.error("Error fetching properties:===>>>", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch properties",
      properties: [],
      pagination: {
        page: 1,
        limit,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}

// ====================================================
// GET SINGLE PROPERTY
// ====================================================

export async function getProperty(identifier: string, userId?: string) {
  try {
    // Determine if identifier is ID or slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      identifier
    );
    const condition = isUUID ? eq(property.id, identifier) : eq(property.slug, identifier);

    const result = await db
      .select({
        property: property,
        agent: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
        isFavorited: userId
          ? sql<boolean>`EXISTS(
          SELECT 1 FROM ${favorite} 
          WHERE ${favorite.propertyId} = ${property.id} 
          AND ${favorite.userId} = ${userId}
        )`
          : sql<boolean>`false`,
      })
      .from(property)
      .leftJoin(user, eq(property.agentId, user.id))
      .where(condition)
      .limit(1);

    if (!result.length) {
      return { success: false, message: "Property not found" };
    }

    const propertyData = result[0];

    return {
      success: true,
      property: {
        ...propertyData.property,
        agent: propertyData.agent,
        isFavorited: propertyData.isFavorited,
      } as PropertyWithAgent,
    };
  } catch (error) {
    console.error("Error fetching property:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch property",
    };
  }
}

export async function getFavoriteProperties(userId?: string, page = 1, limit = 20) {
  try {
    if (!userId) {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session?.user?.id) {
        throw new Error("Unauthorized");
      }
      userId = session.user.id;
    }

    const offset = (page - 1) * limit;

    const favorites = await db
      .select({
        property: property,
        agent: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
        favoritedAt: favorite.createdAt,
      })
      .from(favorite)
      .innerJoin(property, eq(favorite.propertyId, property.id))
      .leftJoin(user, eq(property.agentId, user.id))
      .where(eq(favorite.userId, userId))
      .orderBy(desc(favorite.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalCountQuery = await db
      .select({ count: count() })
      .from(favorite)
      .where(eq(favorite.userId, userId));

    const totalCount = totalCountQuery[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      properties: favorites.map((f) => ({
        ...f.property,
        agent: f.agent,
        isFavorited: true,
        favoritedAt: f.favoritedAt,
      })) as (PropertyWithAgent & { favoritedAt: Date })[],
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching favorite properties:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch favorites",
      properties: [],
      pagination: {
        page: 1,
        limit,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}

// ====================================================
// UTILITY ACTIONS
// ====================================================

export async function getPropertyStats(agentId?: string) {
  try {
    const conditions = agentId ? [eq(property.agentId, agentId)] : [];

    const stats = await db
      .select({
        totalProperties: count(),
        activeProperties: count(sql`CASE WHEN ${property.status} = 'active' THEN 1 END`),
        soldProperties: count(sql`CASE WHEN ${property.status} = 'sold' THEN 1 END`),
        rentedProperties: count(sql`CASE WHEN ${property.status} = 'rented' THEN 1 END`),
        draftProperties: count(sql`CASE WHEN ${property.status} = 'draft' THEN 1 END`),
        featuredProperties: count(sql`CASE WHEN ${property.isFeatured} = true THEN 1 END`),
      })
      .from(property)
      .where(conditions.length > 0 ? sql.join(conditions, sql` AND `) : undefined);

    return {
      success: true,
      stats: stats[0] || {
        totalProperties: 0,
        activeProperties: 0,
        soldProperties: 0,
        rentedProperties: 0,
        draftProperties: 0,
        featuredProperties: 0,
      },
    };
  } catch (error) {
    console.error("Error fetching property stats:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch stats",
    };
  }
}
