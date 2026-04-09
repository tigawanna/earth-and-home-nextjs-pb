import { propertyMessages } from "@/db/schema/app-schema";
import { getBetterAuthSession } from "@/lib/auth/get-session";
import { getDb } from "@/lib/db/get-db";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const now = new Date();
  const id = body.id ? String(body.id) : crypto.randomUUID();

  const db = await getDb();
  const [row] = await db
    .insert(propertyMessages)
    .values({
      id,
      userId: String(body.user_id),
      propertyId: String(body.property_id),
      type: body.type ? String(body.type) : "parent",
      body: String(body.body),
      parent: body.parent ? String(body.parent) : null,
      adminId: body.admin_id ? String(body.admin_id) : null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return NextResponse.json({ success: true, result: row });
}

export async function GET(request: NextRequest) {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const sp = request.nextUrl.searchParams;
  const propertyId = sp.get("propertyId");
  const userId = sp.get("userId");
  const parentId = sp.get("parentId");

  const db = await getDb();

  if (propertyId && userId) {
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

    return NextResponse.json({ success: !!row, result: row ?? null });
  }

  if (parentId) {
    const rows = await db
      .select()
      .from(propertyMessages)
      .where(eq(propertyMessages.parent, parentId))
      .orderBy(propertyMessages.createdAt);

    return NextResponse.json({ success: true, result: rows });
  }

  return NextResponse.json({ success: false, message: "Missing query parameters" }, { status: 400 });
}
