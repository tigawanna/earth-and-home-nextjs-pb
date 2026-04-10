import { mapSessionUserToUsersResponse } from "@/data-access-layer/user/map-session-user";
import { agents } from "@/db/schema/app-schema";
import { user as userTable } from "@/db/schema/auth-schema";
import { getBetterAuthSession } from "@/lib/auth/get-session";
import { getDb } from "@/lib/db/get-db";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const adminUser = mapSessionUserToUsersResponse(session.user);
  if (!adminUser.is_admin) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const now = new Date();
  const db = await getDb();

  const [agentRow] = await db.select().from(agents).where(eq(agents.id, id)).limit(1);
  if (!agentRow) {
    return NextResponse.json({ success: false, message: "Agent not found" }, { status: 404 });
  }

  await db
    .update(agents)
    .set({
      approvalStatus: "rejected",
      isVerified: false,
      updatedAt: now,
    })
    .where(eq(agents.id, id));

  await db
    .update(userTable)
    .set({ role: "user", updatedAt: now })
    .where(and(eq(userTable.id, agentRow.userId), eq(userTable.role, "agent")));

  return NextResponse.json({ success: true });
}
