import { getSearchableFavoritesFromD1 } from "@/data-access-layer/properties/drizzle-property-queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const page = Number(sp.get("page") || 1);
  const limit = Number(sp.get("limit") || 50);
  const q = sp.get("q") || "";

  const result = await getSearchableFavoritesFromD1({ q, page, limit });
  return NextResponse.json(result);
}
