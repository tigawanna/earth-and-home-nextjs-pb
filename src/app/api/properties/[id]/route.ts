import { properties } from "@/db/schema/app-schema";
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

  const updates: Record<string, unknown> = { updatedAt: now };

  const fieldMap: Record<string, string> = {
    title: "title",
    description: "description",
    price: "price",
    listing_type: "listingType",
    property_type: "propertyType",
    status: "status",
    location: "location",
    street_address: "streetAddress",
    city: "city",
    state: "state",
    postal_code: "postalCode",
    country: "country",
    dimensions: "dimensions",
    building_size_sqft: "buildingSizeSqft",
    baths: "baths",
    lot_size_sqft: "lotSizeSqft",
    lot_size_acres: "lotSizeAcres",
    year_built: "yearBuilt",
    floors: "floors",
    beds: "beds",
    parking_spaces: "parkingSpaces",
    parking_type: "parkingType",
    heating: "heating",
    cooling: "cooling",
    zoning: "zoning",
    currency: "currency",
    sale_price: "salePrice",
    rental_price: "rentalPrice",
    security_deposit: "securityDeposit",
    hoa_fee: "hoaFee",
    annual_taxes: "annualTaxes",
    available_from: "availableFrom",
    image_url: "imageUrl",
    images: "images",
    video_url: "videoUrl",
    virtual_tour_url: "virtualTourUrl",
    amenities: "amenities",
    features: "features",
    utilities: "utilities",
    owner_id: "ownerId",
    is_featured: "isFeatured",
    is_new: "isNew",
    agent_id: "agentId",
  };

  for (const [snakeKey, camelKey] of Object.entries(fieldMap)) {
    if (body[snakeKey] !== undefined) {
      updates[camelKey] = body[snakeKey];
    }
  }

  if (body.location_point !== undefined) {
    const locationPoint = body.location_point as { lat?: number; lon?: number } | undefined;
    updates.locationLat = locationPoint?.lat ?? null;
    updates.locationLon = locationPoint?.lon ?? null;
  }

  const db = await getDb();
  const [row] = await db.update(properties).set(updates).where(eq(properties.id, id)).returning();

  if (!row) {
    return NextResponse.json({ success: false, message: "Property not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    record: row,
    message: "Property updated successfully",
  });
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
  await db.delete(properties).where(eq(properties.id, id));

  return NextResponse.json({
    success: true,
    record: null,
    message: "Property deleted successfully",
  });
}
