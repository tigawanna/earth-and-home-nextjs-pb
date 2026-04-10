import { mapAgentRowToAgentsResponse } from "@/data-access-layer/agents/drizzle-agent-mapper";
import { mapSessionUserToUsersResponse } from "@/data-access-layer/user/map-session-user";
import { agents } from "@/db/schema/app-schema";
import { user as userTable } from "@/db/schema/auth-schema";
import { getBetterAuthSession } from "@/lib/auth/get-session";
import { getDb } from "@/lib/db/get-db";
import type { AgentApprovalStatus } from "@/types/domain-types";
import { and, eq, ne } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

function isApprovalStatus(v: unknown): v is AgentApprovalStatus {
  return v === "pending" || v === "approved" || v === "rejected";
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const authUser = mapSessionUserToUsersResponse(session.user);
  const { id } = await params;
  const body = (await request.json()) as Record<string, unknown>;
  const now = new Date();

  const db = await getDb();
  const [existing] = await db.select().from(agents).where(eq(agents.id, id)).limit(1);

  if (!existing) {
    return NextResponse.json({ success: false, message: "Agent not found" }, { status: 404 });
  }

  const ownsAgent = existing.userId === session.user.id;
  if (!authUser.is_admin && !ownsAgent) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  const updates: Record<string, unknown> = { updatedAt: now };

  if (body.agency_name !== undefined) updates.agencyName = body.agency_name;
  if (body.license_number !== undefined) updates.licenseNumber = body.license_number;
  if (body.specialization !== undefined) updates.specialization = body.specialization;
  if (body.service_areas !== undefined) updates.serviceAreas = body.service_areas;
  if (body.years_experience !== undefined) updates.yearsExperience = body.years_experience;

  if (authUser.is_admin) {
    if (body.is_verified !== undefined) {
      updates.isVerified = body.is_verified;
      if (body.is_verified === true) {
        updates.approvalStatus = "approved";
      }
    }
    if (body.approval_status !== undefined && isApprovalStatus(body.approval_status)) {
      updates.approvalStatus = body.approval_status;
    }
  } else if (body.resubmit === true && existing.approvalStatus === "rejected" && ownsAgent) {
    updates.approvalStatus = "pending";
    updates.isVerified = false;
  }

  const [row] = await db.update(agents).set(updates).where(eq(agents.id, id)).returning();

  if (!row) {
    return NextResponse.json({ success: false, message: "Agent not found" }, { status: 404 });
  }

  if (existing.approvalStatus !== row.approvalStatus) {
    if (row.approvalStatus === "approved") {
      await db
        .update(userTable)
        .set({ role: "agent", updatedAt: now })
        .where(and(eq(userTable.id, row.userId), ne(userTable.role, "admin")));
    } else if (row.approvalStatus === "rejected") {
      await db
        .update(userTable)
        .set({ role: "user", updatedAt: now })
        .where(and(eq(userTable.id, row.userId), eq(userTable.role, "agent")));
    }
  }

  return NextResponse.json({
    success: true,
    result: mapAgentRowToAgentsResponse(row),
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

  const authUser = mapSessionUserToUsersResponse(session.user);
  const { id } = await params;
  const db = await getDb();

  const [existing] = await db.select().from(agents).where(eq(agents.id, id)).limit(1);
  if (!existing) {
    return NextResponse.json({ success: false, message: "Agent not found" }, { status: 404 });
  }

  if (!authUser.is_admin && existing.userId !== session.user.id) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  await db.delete(agents).where(eq(agents.id, id));

  return NextResponse.json({ success: true });
}
