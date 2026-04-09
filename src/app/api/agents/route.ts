import { agents } from "@/db/schema/app-schema";
import { getBetterAuthSession } from "@/lib/auth/get-session";
import { getDb } from "@/lib/db/get-db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const now = new Date();
  const id = crypto.randomUUID();

  const db = await getDb();
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
      isVerified: Boolean(body.is_verified ?? false),
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return NextResponse.json({ success: true, result: row });
}
