import "server-only";

import { properties, propertyMessages } from "@/db/schema/app-schema";
import { user as userTable } from "@/db/schema/auth-schema";
import { getDb } from "@/lib/db/get-db";
import { mapDrizzleRowToPropertiesResponse } from "@/data-access-layer/properties/drizzle-property-mapper";
import { mapUserRowToUsersResponse } from "@/data-access-layer/user/drizzle-user-mapper";
import type { PropertyMessagesResponse } from "@/types/domain-types";
import { eq } from "drizzle-orm";

export async function drizzleGetSinglePropertyMessage(msgId: string) {
  const db = await getDb();
  const [row] = await db
    .select({
      m: propertyMessages,
      prop: properties,
      usr: userTable,
    })
    .from(propertyMessages)
    .innerJoin(properties, eq(propertyMessages.propertyId, properties.id))
    .innerJoin(userTable, eq(propertyMessages.userId, userTable.id))
    .where(eq(propertyMessages.id, msgId))
    .limit(1);

  if (!row) {
    return { success: false as const, result: null, message: "Message not found" };
  }

  const created = row.m.createdAt ? new Date(row.m.createdAt).toISOString() : "";
  const updated = row.m.updatedAt ? new Date(row.m.updatedAt).toISOString() : created;

  const base: PropertyMessagesResponse = {
    id: row.m.id,
    user_id: row.m.userId,
    property_id: row.m.propertyId,
    type: (row.m.type ?? "") as PropertyMessagesResponse["type"],
    body: row.m.body,
    parent: row.m.parent ?? "",
    admin_id: row.m.adminId ?? "",
    created,
    updated,
  };

  const response = {
    ...base,
    expand: {
      user_id: mapUserRowToUsersResponse(row.usr),
      property_id: mapDrizzleRowToPropertiesResponse(row.prop),
    },
  };

  return { success: true as const, result: response };
}
