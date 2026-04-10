import { getPendingAgentApplications } from "@/data-access-layer/admin/pending-agent-applications";
import { mapSessionUserToUsersResponse } from "@/data-access-layer/user/map-session-user";
import { getBetterAuthSession } from "@/lib/auth/get-session";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const user = mapSessionUserToUsersResponse(session.user);
  if (!user.is_admin) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }
  const items = await getPendingAgentApplications();
  return NextResponse.json({ success: true, items });
}
