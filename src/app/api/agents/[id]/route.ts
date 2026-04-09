import { agents } from "@/db/schema/app-schema";
import { getBetterAuthSession } from "@/lib/auth/get-session";
import { getDb } from "@/lib/db/get-db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json()) as Record<string, unknown>;
  const now = new Date();

  const db = await getDb();
  const updates: Record<string, unknown> = { updatedAt: now };

  if (body.agency_name !== undefined) updates.agencyName = body.agency_name;
  if (body.license_number !== undefined) updates.licenseNumber = body.license_number;
  if (body.specialization !== undefined) updates.specialization = body.specialization;
  if (body.service_areas !== undefined) updates.serviceAreas = body.service_areas;
  if (body.years_experience !== undefined) updates.yearsExperience = body.years_experience;
  if (body.is_verified !== undefined) updates.isVerified = body.is_verified;

  const [row] = await db.update(agents).set(updates).where(eq(agents.id, id)).returning();

  if (!row) {
    return NextResponse.json({ success: false, message: "Agent not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, result: row });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const db = await getDb();
  await db.delete(agents).where(eq(agents.id, id));

  return NextResponse.json({ success: true });
}
