import { drizzleGetDirectMessagesForConversation } from "@/data-access-layer/messages/drizzle-direct-messages";
import { getBetterAuthSession } from "@/lib/auth/get-session";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ conversationId: string }>;
}

export async function GET(_request: NextRequest, context: RouteParams) {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { conversationId } = await context.params;
  const messages = await drizzleGetDirectMessagesForConversation(conversationId, session.user.id);

  if (messages === null) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, result: messages });
}
