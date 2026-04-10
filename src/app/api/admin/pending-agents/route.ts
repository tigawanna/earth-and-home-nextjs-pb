import { getPendingAgentApplicationsPaginated } from "@/data-access-layer/admin/pending-agent-applications";
import { mapSessionUserToUsersResponse } from "@/data-access-layer/user/map-session-user";
import { getBetterAuthSession } from "@/lib/auth/get-session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const user = mapSessionUserToUsersResponse(session.user);
  if (!user.is_admin) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  const sp = request.nextUrl.searchParams;
  const q = sp.get("search") ?? "";
  const page = Math.max(1, Number(sp.get("page") || 1));
  const limit = Math.min(50, Math.max(1, Number(sp.get("limit") || 10)));
  const rawSort = sp.get("sortOrder");
  const sortOrder = rawSort === "asc" || rawSort === "desc" ? rawSort : "desc";

  const result = await getPendingAgentApplicationsPaginated({ q, page, limit, sortOrder });
  return NextResponse.json({ success: true, ...result });
}
