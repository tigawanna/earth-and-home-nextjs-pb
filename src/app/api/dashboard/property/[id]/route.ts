import { getPropertyByIdFromD1 } from "@/data-access-layer/properties/drizzle-property-queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const result = await getPropertyByIdFromD1(id);
  return NextResponse.json(result);
}
