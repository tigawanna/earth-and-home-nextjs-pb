import "server-only";

import { directConversations, directMessages } from "@/db/schema/app-schema";
import { user as userTable } from "@/db/schema/auth-schema";
import { mapUserRowToUsersResponse } from "@/data-access-layer/user/drizzle-user-mapper";
import { getDb } from "@/lib/db/get-db";
import type {
  DirectConversationListItem,
  DirectConversationResponse,
  DirectMessageResponse,
  UsersResponse,
} from "@/types/domain-types";
import { and, desc, eq, or } from "drizzle-orm";

function sortedUserPair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

function mapConversationRow(row: typeof directConversations.$inferSelect): DirectConversationResponse {
  const created = row.createdAt ? new Date(row.createdAt).toISOString() : "";
  const updated = row.updatedAt ? new Date(row.updatedAt).toISOString() : created;
  return {
    id: row.id,
    user_lower_id: row.userLowerId,
    user_higher_id: row.userHigherId,
    created,
    updated,
  };
}

function mapMessageRow(row: typeof directMessages.$inferSelect): DirectMessageResponse {
  const created = row.createdAt ? new Date(row.createdAt).toISOString() : "";
  const updated = row.updatedAt ? new Date(row.updatedAt).toISOString() : created;
  return {
    id: row.id,
    conversation_id: row.conversationId,
    sender_user_id: row.senderUserId,
    body: row.body,
    created,
    updated,
  };
}

function otherParticipantUserId(
  conv: typeof directConversations.$inferSelect,
  viewerUserId: string,
): string {
  if (conv.userLowerId === viewerUserId) {
    return conv.userHigherId;
  }
  if (conv.userHigherId === viewerUserId) {
    return conv.userLowerId;
  }
  return "";
}

export async function drizzleGetOrCreateDirectConversationId(
  currentUserId: string,
  otherUserId: string,
): Promise<string> {
  if (currentUserId === otherUserId) {
    throw new Error("Invalid participants");
  }
  const [lower, higher] = sortedUserPair(currentUserId, otherUserId);
  const db = await getDb();

  const [existing] = await db
    .select()
    .from(directConversations)
    .where(
      and(eq(directConversations.userLowerId, lower), eq(directConversations.userHigherId, higher)),
    )
    .limit(1);

  if (existing) {
    return existing.id;
  }

  const id = crypto.randomUUID();
  const now = new Date();
  const [created] = await db
    .insert(directConversations)
    .values({
      id,
      userLowerId: lower,
      userHigherId: higher,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  if (!created) {
    throw new Error("Failed to create conversation");
  }
  return created.id;
}

export async function drizzleGetDirectConversationContext(
  conversationId: string,
  viewerUserId: string,
): Promise<{ conversation: DirectConversationResponse; other_user: UsersResponse } | null> {
  const db = await getDb();
  const [conv] = await db
    .select()
    .from(directConversations)
    .where(eq(directConversations.id, conversationId))
    .limit(1);

  if (!conv) {
    return null;
  }

  const otherId = otherParticipantUserId(conv, viewerUserId);
  if (!otherId) {
    return null;
  }

  const [otherRow] = await db.select().from(userTable).where(eq(userTable.id, otherId)).limit(1);
  if (!otherRow) {
    return null;
  }

  return {
    conversation: mapConversationRow(conv),
    other_user: mapUserRowToUsersResponse(otherRow),
  };
}

export async function drizzleListDirectConversations(
  viewerUserId: string,
): Promise<DirectConversationListItem[]> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(directConversations)
    .where(
      or(
        eq(directConversations.userLowerId, viewerUserId),
        eq(directConversations.userHigherId, viewerUserId),
      ),
    )
    .orderBy(desc(directConversations.updatedAt));

  const result: DirectConversationListItem[] = [];

  for (const conv of rows) {
    const otherId = otherParticipantUserId(conv, viewerUserId);
    if (!otherId) {
      continue;
    }
    const [otherRow] = await db.select().from(userTable).where(eq(userTable.id, otherId)).limit(1);
    if (!otherRow) {
      continue;
    }

    const [lastMsgRow] = await db
      .select()
      .from(directMessages)
      .where(eq(directMessages.conversationId, conv.id))
      .orderBy(desc(directMessages.createdAt))
      .limit(1);

    result.push({
      conversation: mapConversationRow(conv),
      other_user: mapUserRowToUsersResponse(otherRow),
      last_message: lastMsgRow ? mapMessageRow(lastMsgRow) : null,
    });
  }

  return result;
}

export async function drizzleGetDirectMessagesForConversation(
  conversationId: string,
  viewerUserId: string,
): Promise<DirectMessageResponse[] | null> {
  const db = await getDb();
  const [conv] = await db
    .select()
    .from(directConversations)
    .where(eq(directConversations.id, conversationId))
    .limit(1);

  if (!conv) {
    return null;
  }

  if (conv.userLowerId !== viewerUserId && conv.userHigherId !== viewerUserId) {
    return null;
  }

  const rows = await db
    .select()
    .from(directMessages)
    .where(eq(directMessages.conversationId, conversationId))
    .orderBy(directMessages.createdAt);

  return rows.map(mapMessageRow);
}

export async function drizzleInsertDirectMessage(params: {
  conversationId: string;
  senderUserId: string;
  body: string;
}): Promise<DirectMessageResponse | null> {
  const db = await getDb();
  const [conv] = await db
    .select()
    .from(directConversations)
    .where(eq(directConversations.id, params.conversationId))
    .limit(1);

  if (!conv) {
    return null;
  }

  if (conv.userLowerId !== params.senderUserId && conv.userHigherId !== params.senderUserId) {
    return null;
  }

  const id = crypto.randomUUID();
  const now = new Date();
  const [row] = await db
    .insert(directMessages)
    .values({
      id,
      conversationId: params.conversationId,
      senderUserId: params.senderUserId,
      body: params.body.trim(),
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  if (!row) {
    return null;
  }

  await db
    .update(directConversations)
    .set({ updatedAt: now })
    .where(eq(directConversations.id, params.conversationId));

  return mapMessageRow(row);
}

export async function drizzleInsertDirectMessageWithRecipient(params: {
  senderUserId: string;
  recipientUserId: string;
  body: string;
}): Promise<DirectMessageResponse | null> {
  const conversationId = await drizzleGetOrCreateDirectConversationId(
    params.senderUserId,
    params.recipientUserId,
  );
  return drizzleInsertDirectMessage({
    conversationId,
    senderUserId: params.senderUserId,
    body: params.body,
  });
}
