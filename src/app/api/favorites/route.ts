import { favorites } from "@/db/schema/app-schema";
import { getBetterAuthSession } from "@/lib/auth/get-session";
import { getDb } from "@/lib/db/get-db";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { propertyId, userId } = (await request.json()) as { propertyId: string; userId: string };
  const db = await getDb();

  const [existing] = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.propertyId, propertyId), eq(favorites.userId, userId)))
    .limit(1);

  if (existing) {
    await db.delete(favorites).where(eq(favorites.id, existing.id));
    return NextResponse.json({
      success: true,
      isFavorited: false,
      message: "Removed from favorites",
    });
  }

  const now = new Date();
  const id = crypto.randomUUID();
  await db.insert(favorites).values({
    id,
    propertyId,
    userId,
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json({
    success: true,
    isFavorited: true,
    message: "Added to favorites",
  });
}
