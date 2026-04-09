import "server-only";

import { properties } from "@/db/schema/app-schema";
import { getDb } from "@/lib/db/get-db";
import type { PropertiesResponse } from "@/lib/pocketbase/types/pb-types";
import { mapDrizzleRowToPropertiesResponse } from "./drizzle-property-mapper";
import { and, desc, eq } from "drizzle-orm";

export async function getFeaturedPropertiesFromD1(limit: number): Promise<{
  success: true;
  properties: PropertiesResponse[];
  totalCount: number;
}> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(properties)
    .where(and(eq(properties.status, "active"), eq(properties.isFeatured, true)))
    .orderBy(desc(properties.createdAt))
    .limit(limit);

  const mapped = rows.map(mapDrizzleRowToPropertiesResponse);
  return {
    success: true,
    properties: mapped,
    totalCount: mapped.length,
  };
}
