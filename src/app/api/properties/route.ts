import { mapSessionUserToUsersResponse } from "@/data-access-layer/user/map-session-user";
import { agents, properties } from "@/db/schema/app-schema";
import { getBetterAuthSession } from "@/lib/auth/get-session";
import { getDb } from "@/lib/db/get-db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const toStr = (v: unknown): string | null => (v != null ? String(v) : null);
const toNum = (v: unknown): number | null => (v != null ? Number(v) : null);
export async function POST(request: NextRequest) {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const authUser = mapSessionUserToUsersResponse(session.user);
  const body = (await request.json()) as Record<string, unknown>;
  const locationPoint = body.location_point as { lat?: number; lon?: number } | undefined;
  const now = new Date();
  const id = crypto.randomUUID();


  const agentId = String(body.agent_id);
  const db = await getDb();
  const [agentRow] = await db.select().from(agents).where(eq(agents.id, agentId)).limit(1);
  if (!agentRow) {
    return NextResponse.json({ success: false, message: "Invalid agent" }, { status: 400 });
  }
  if (agentRow.userId !== session.user.id && !authUser.is_admin) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }
  if (!authUser.is_admin && agentRow.approvalStatus !== "approved") {
    return NextResponse.json(
      { success: false, message: "Agent account is not approved to list properties" },
      { status: 403 },
    );
  }

  const [row] = await db
    .insert(properties)
    .values({
      id,
      title: String(body.title),
      description: toStr(body.description),
      price: toNum(body.price),
      listingType: String(body.listing_type),
      propertyType: String(body.property_type),
      status: String(body.status),
      location: String(body.location),
      streetAddress: toStr(body.street_address),
      city: toStr(body.city),
      state: toStr(body.state),
      postalCode: toStr(body.postal_code),
      country: toStr(body.country),
      dimensions: toStr(body.dimensions),
      buildingSizeSqft: toNum(body.building_size_sqft),
      baths: toNum(body.baths),
      lotSizeSqft: toNum(body.lot_size_sqft),
      lotSizeAcres: toNum(body.lot_size_acres),
      yearBuilt: toNum(body.year_built),
      floors: toNum(body.floors),
      beds: toNum(body.beds),
      parkingSpaces: toNum(body.parking_spaces),
      parkingType: toStr(body.parking_type),
      heating: toStr(body.heating),
      cooling: toStr(body.cooling),
      zoning: toStr(body.zoning),
      currency: toStr(body.currency) ?? "KES",
      salePrice: toNum(body.sale_price),
      rentalPrice: toNum(body.rental_price),
      securityDeposit: toNum(body.security_deposit),
      hoaFee: toNum(body.hoa_fee),
      annualTaxes: toNum(body.annual_taxes),
      availableFrom: toStr(body.available_from),
      imageUrl: toStr(body.image_url),
      images: (body.images as string[] | null) ?? null,
      videoUrl: toStr(body.video_url),
      virtualTourUrl: toStr(body.virtual_tour_url),
      amenities: body.amenities ?? null,
      features: body.features ?? null,
      utilities: body.utilities ?? null,
      ownerId: toStr(body.owner_id) ?? session.user.id,
      isFeatured: Boolean(body.is_featured ?? false),
      isNew: Boolean(body.is_new ?? true),
      locationLat: locationPoint?.lat ?? null,
      locationLon: locationPoint?.lon ?? null,
      agentId,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return NextResponse.json({ success: true, record: row, message: "Property created successfully" });
}
