import { getPaginatedUsersFromD1 } from "@/data-access-layer/properties/drizzle-property-queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const page = Number(sp.get("page") || 1);
  const limit = Number(sp.get("limit") || 50);
  const q = sp.get("q") || "";
  const sortBy = sp.get("sortBy") || "created";
  const sortOrder = (sp.get("sortOrder") || "desc") as "asc" | "desc";

  const result = await getPaginatedUsersFromD1({ q, page, limit, sortBy, sortOrder });
  return NextResponse.json(result);
}
