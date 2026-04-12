"use server";

import { favorites } from "@/db/schema/app-schema";
import { getBetterAuthSession } from "@/lib/auth/get-session";
import { getDb } from "@/lib/db/get-db";
import { and, eq } from "drizzle-orm";

type ToggleFavoriteResult =
  | { success: true; isFavorited: boolean; message: string }
  | { success: false; isFavorited: false; message: string };

export async function toggleFavorite(params: {
  propertyId: string;
  userId: string;
}): Promise<ToggleFavoriteResult> {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return { success: false, isFavorited: false, message: "Unauthorized" };
  }

  const { propertyId, userId } = params;
  const db = await getDb();

  const [existing] = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.propertyId, propertyId), eq(favorites.userId, userId)))
    .limit(1);

  if (existing) {
    await db.delete(favorites).where(eq(favorites.id, existing.id));
    return { success: true, isFavorited: false, message: "Removed from favorites" };
  }

  const now = new Date();
  const id = crypto.randomUUID();
  await db.insert(favorites).values({ id, propertyId, userId, createdAt: now, updatedAt: now });
  return { success: true, isFavorited: true, message: "Added to favorites" };
}
