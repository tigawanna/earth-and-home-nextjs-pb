"use server";

import { properties, propertyMessages } from "@/db/schema/app-schema";
import { user as userTable } from "@/db/schema/auth-schema";
import { mapDrizzleRowToPropertiesResponse } from "../properties/drizzle-property-mapper";
import { mapUserRowToUsersResponse } from "../user/drizzle-user-mapper";
import { getBetterAuthSession } from "@/lib/auth/get-session";
import { getDb } from "@/lib/db/get-db";
import {
  drizzleGetDirectMessagesForConversation,
  drizzleInsertDirectMessage,
  drizzleInsertDirectMessageWithRecipient,
  drizzleListDirectConversations,
} from "../messages/drizzle-direct-messages";
import type {
  PropertyMessagesCreate,
  PropertyMessagesResponse,
  DirectConversationListItem,
  DirectMessageResponse,
  DirectMessageCreatePayload,
} from "@/types/domain-types";
import { and, desc, eq } from "drizzle-orm";

type ActionResult<T = unknown> = { success: true; data: T } | { success: false; message: string };

export async function createPropertyMessage(
  data: PropertyMessagesCreate,
): Promise<ActionResult<PropertyMessagesResponse>> {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return { success: false, message: "Unauthorized" };
  }

  const now = new Date();
  const id = data.id ?? crypto.randomUUID();
  const db = await getDb();

  const [row] = await db
    .insert(propertyMessages)
    .values({
      id,
      userId: data.user_id,
      propertyId: data.property_id,
      type: data.type || "parent",
      body: data.body,
      parent: data.parent ?? null,
      adminId: data.admin_id ?? null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  const mapped: PropertyMessagesResponse = {
    id: row.id,
    user_id: row.userId,
    property_id: row.propertyId,
    type: (row.type ?? "") as PropertyMessagesResponse["type"],
    body: row.body,
    parent: row.parent ?? "",
    admin_id: row.adminId ?? "",
    created: row.createdAt ? new Date(row.createdAt).toISOString() : "",
    updated: row.updatedAt ? new Date(row.updatedAt).toISOString() : "",
  };

  return { success: true, data: mapped };
}

export async function fetchPropertyMessageThread(
  propertyId: string,
  userId: string,
): Promise<ActionResult<PropertyMessagesResponse | null>> {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return { success: false, message: "Unauthorized" };
  }

  const db = await getDb();
  const [row] = await db
    .select()
    .from(propertyMessages)
    .where(
      and(
        eq(propertyMessages.propertyId, propertyId),
        eq(propertyMessages.userId, userId),
        eq(propertyMessages.type, "parent"),
      ),
    )
    .limit(1);

  if (!row) {
    return { success: true, data: null };
  }

  const mapped: PropertyMessagesResponse = {
    id: row.id,
    user_id: row.userId,
    property_id: row.propertyId,
    type: (row.type ?? "") as PropertyMessagesResponse["type"],
    body: row.body,
    parent: row.parent ?? "",
    admin_id: row.adminId ?? "",
    created: row.createdAt ? new Date(row.createdAt).toISOString() : "",
    updated: row.updatedAt ? new Date(row.updatedAt).toISOString() : "",
  };

  return { success: true, data: mapped };
}

export async function fetchMessageReplies(
  parentId: string,
): Promise<ActionResult<PropertyMessagesResponse[]>> {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return { success: false, message: "Unauthorized" };
  }

  const db = await getDb();
  const rows = await db
    .select()
    .from(propertyMessages)
    .where(eq(propertyMessages.parent, parentId))
    .orderBy(propertyMessages.createdAt);

  const mapped: PropertyMessagesResponse[] = rows.map((row) => ({
    id: row.id,
    user_id: row.userId,
    property_id: row.propertyId,
    type: (row.type ?? "") as PropertyMessagesResponse["type"],
    body: row.body,
    parent: row.parent ?? "",
    admin_id: row.adminId ?? "",
    created: row.createdAt ? new Date(row.createdAt).toISOString() : "",
    updated: row.updatedAt ? new Date(row.updatedAt).toISOString() : "",
  }));

  return { success: true, data: mapped };
}

export async function fetchConversationMessages(
  conversationId: string,
): Promise<ActionResult<DirectMessageResponse[]>> {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return { success: false, message: "Unauthorized" };
  }

  const messages = await drizzleGetDirectMessagesForConversation(conversationId, session.user.id);
  if (messages === null) {
    return { success: false, message: "Not found" };
  }

  return { success: true, data: messages };
}

export async function fetchDirectConversations(): Promise<
  ActionResult<DirectConversationListItem[]>
> {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return { success: false, message: "Unauthorized" };
  }

  const items = await drizzleListDirectConversations(session.user.id);
  return { success: true, data: items };
}

export async function sendDirectMessage(
  payload: DirectMessageCreatePayload,
): Promise<ActionResult<DirectMessageResponse>> {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return { success: false, message: "Unauthorized" };
  }

  const text = payload.body.trim();
  if (!text) {
    return { success: false, message: "Message body required" };
  }

  const conversationId = payload.conversation_id ?? undefined;
  const recipientUserId = payload.recipient_user_id ?? undefined;

  if ((conversationId && recipientUserId) || (!conversationId && !recipientUserId)) {
    return { success: false, message: "Provide either conversation_id or recipient_user_id" };
  }

  if (recipientUserId && recipientUserId === session.user.id) {
    return { success: false, message: "Invalid recipient" };
  }

  let row = null;
  if (conversationId) {
    row = await drizzleInsertDirectMessage({
      conversationId,
      senderUserId: session.user.id,
      body: text,
    });
  } else if (recipientUserId) {
    row = await drizzleInsertDirectMessageWithRecipient({
      senderUserId: session.user.id,
      recipientUserId,
      body: text,
    });
  }

  if (!row) {
    return { success: false, message: "Failed to send message" };
  }

  return { success: true, data: row as DirectMessageResponse };
}

export type ParentMessageWithExpansion = PropertyMessagesResponse & {
  expand?: {
    property_id?: ReturnType<typeof mapDrizzleRowToPropertiesResponse>;
    user_id?: ReturnType<typeof mapUserRowToUsersResponse>;
  };
};

export async function fetchParentMessages(): Promise<
  ActionResult<ParentMessageWithExpansion[]>
> {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return { success: false, message: "Unauthorized" };
  }

  const db = await getDb();
  const rows = await db
    .select({
      m: propertyMessages,
      prop: properties,
      usr: userTable,
    })
    .from(propertyMessages)
    .innerJoin(properties, eq(propertyMessages.propertyId, properties.id))
    .innerJoin(userTable, eq(propertyMessages.userId, userTable.id))
    .where(eq(propertyMessages.type, "parent"))
    .orderBy(desc(propertyMessages.createdAt));

  const items: ParentMessageWithExpansion[] = rows.map(({ m, prop, usr }) => ({
    id: m.id,
    user_id: m.userId,
    property_id: m.propertyId,
    type: (m.type ?? "") as PropertyMessagesResponse["type"],
    body: m.body,
    parent: m.parent ?? "",
    admin_id: m.adminId ?? "",
    created: m.createdAt ? new Date(m.createdAt).toISOString() : "",
    updated: m.updatedAt ? new Date(m.updatedAt).toISOString() : "",
    expand: {
      property_id: mapDrizzleRowToPropertiesResponse(prop),
      user_id: mapUserRowToUsersResponse(usr),
    },
  }));

  return { success: true, data: items };
}
