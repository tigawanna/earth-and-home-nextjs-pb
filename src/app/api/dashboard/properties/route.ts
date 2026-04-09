import { getPaginatedPropertiesFromD1 } from "@/data-access-layer/properties/drizzle-property-queries";
import type { PropertyFilters, PropertySortBy, SortOrder } from "@/data-access-layer/properties/property-types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const page = Number(sp.get("page") || 1);
  const limit = Number(sp.get("limit") || 50);
  const sortBy = (sp.get("sortBy") || "created") as PropertySortBy;
  const sortOrder = (sp.get("sortOrder") || "desc") as SortOrder;

  let filters: PropertyFilters = {};
  const filtersRaw = sp.get("filters");
  if (filtersRaw) {
    try {
      filters = JSON.parse(filtersRaw) as PropertyFilters;
    } catch {
      filters = {};
    }
  }

  const result = await getPaginatedPropertiesFromD1({
    filters,
    sortBy,
    sortOrder,
    page,
    limit,
  });

  return NextResponse.json(result);
}
