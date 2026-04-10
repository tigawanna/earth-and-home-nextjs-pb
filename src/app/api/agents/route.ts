import { mapSessionUserToUsersResponse } from "@/data-access-layer/user/map-session-user";
import { agents } from "@/db/schema/app-schema";
import { getBetterAuthSession } from "@/lib/auth/get-session";
import { getDb } from "@/lib/db/get-db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const now = new Date();
  const db = await getDb();

  const [existing] = await db
    .select()
    .from(agents)
    .where(eq(agents.userId, session.user.id))
    .limit(1);

  if (existing) {
    if (existing.approvalStatus !== "rejected") {
      return NextResponse.json(
        { success: false, message: "An agent profile already exists for this account" },
        { status: 409 },
      );
    }

    const [updated] = await db
      .update(agents)
      .set({
        agencyName: String(body.agency_name),
        licenseNumber: body.license_number ? String(body.license_number) : null,
        specialization: body.specialization ? String(body.specialization) : null,
        serviceAreas: body.service_areas ? String(body.service_areas) : null,
        yearsExperience: body.years_experience != null ? Number(body.years_experience) : null,
        isVerified: false,
        approvalStatus: "pending",
        updatedAt: now,
      })
      .where(eq(agents.id, existing.id))
      .returning();

    return NextResponse.json({ success: true, result: updated });
  }

  const id = crypto.randomUUID();
  const [row] = await db
    .insert(agents)
    .values({
      id,
      userId: session.user.id,
      agencyName: String(body.agency_name),
      licenseNumber: body.license_number ? String(body.license_number) : null,
      specialization: body.specialization ? String(body.specialization) : null,
      serviceAreas: body.service_areas ? String(body.service_areas) : null,
      yearsExperience: body.years_experience != null ? Number(body.years_experience) : null,
      isVerified: false,
      approvalStatus: "pending",
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return NextResponse.json({ success: true, result: row });
}
