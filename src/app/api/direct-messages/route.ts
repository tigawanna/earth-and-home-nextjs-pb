import {
  drizzleInsertDirectMessage,
  drizzleInsertDirectMessageWithRecipient,
  drizzleListDirectConversations,
} from "@/data-access-layer/messages/drizzle-direct-messages";
import { getBetterAuthSession } from "@/lib/auth/get-session";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const items = await drizzleListDirectConversations(session.user.id);
  return NextResponse.json({ success: true, result: items });
}

export async function POST(request: NextRequest) {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const text = typeof body.body === "string" ? body.body.trim() : "";
  if (!text) {
    return NextResponse.json({ success: false, message: "Message body required" }, { status: 400 });
  }

  const conversationId =
    typeof body.conversation_id === "string" && body.conversation_id.length > 0
      ? body.conversation_id
      : undefined;
  const recipientUserId =
    typeof body.recipient_user_id === "string" && body.recipient_user_id.length > 0
      ? body.recipient_user_id
      : undefined;

  if ((conversationId && recipientUserId) || (!conversationId && !recipientUserId)) {
    return NextResponse.json(
      { success: false, message: "Provide either conversation_id or recipient_user_id" },
      { status: 400 },
    );
  }

  if (recipientUserId && recipientUserId === session.user.id) {
    return NextResponse.json({ success: false, message: "Invalid recipient" }, { status: 400 });
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
    return NextResponse.json({ success: false, message: "Failed to send message" }, { status: 400 });
  }

  return NextResponse.json({ success: true, result: row });
}
