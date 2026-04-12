"use server";

import { agents } from "@/db/schema/app-schema";
import { user as userTable } from "@/db/schema/auth-schema";
import { mapAgentRowToAgentsResponse } from "@/data-access-layer/agents/drizzle-agent-mapper";
import { mapSessionUserToUsersResponse } from "@/data-access-layer/user/map-session-user";
import { getBetterAuthSession } from "@/lib/auth/get-session";
import { getDb } from "@/lib/db/get-db";
import { getPendingAgentApplicationsPaginated } from "../admin/pending-agent-applications";
import type {
  AgentsCreate,
  AgentsResponse,
  AgentsUpdate,
  AgentApprovalStatus,
} from "@/types/domain-types";
import { and, eq, ne } from "drizzle-orm";

type ActionResult<T = unknown> = { success: true; data: T } | { success: false; message: string };

function isApprovalStatus(v: unknown): v is AgentApprovalStatus {
  return v === "pending" || v === "approved" || v === "rejected";
}

export async function createAgent(data: AgentsCreate): Promise<ActionResult<AgentsResponse>> {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return { success: false, message: "Unauthorized" };
  }

  const now = new Date();
  const db = await getDb();

  const [existing] = await db
    .select()
    .from(agents)
    .where(eq(agents.userId, session.user.id))
    .limit(1);

  if (existing) {
    if (existing.approvalStatus !== "rejected") {
      return { success: false, message: "An agent profile already exists for this account" };
    }

    const [updated] = await db
      .update(agents)
      .set({
        agencyName: data.agency_name,
        licenseNumber: data.license_number ?? null,
        specialization: data.specialization ?? null,
        serviceAreas: data.service_areas ?? null,
        yearsExperience: data.years_experience ?? null,
        isVerified: false,
        approvalStatus: "pending",
        updatedAt: now,
      })
      .where(eq(agents.id, existing.id))
      .returning();

    return { success: true, data: mapAgentRowToAgentsResponse(updated) };
  }

  const id = crypto.randomUUID();
  const [row] = await db
    .insert(agents)
    .values({
      id,
      userId: session.user.id,
      agencyName: data.agency_name,
      licenseNumber: data.license_number ?? null,
      specialization: data.specialization ?? null,
      serviceAreas: data.service_areas ?? null,
      yearsExperience: data.years_experience ?? null,
      isVerified: false,
      approvalStatus: "pending",
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return { success: true, data: mapAgentRowToAgentsResponse(row) };
}

export async function updateAgent(
  data: AgentsUpdate & { id: string },
): Promise<ActionResult<AgentsResponse>> {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return { success: false, message: "Unauthorized" };
  }

  const authUser = mapSessionUserToUsersResponse(session.user);
  const now = new Date();
  const db = await getDb();

  const [existing] = await db.select().from(agents).where(eq(agents.id, data.id)).limit(1);
  if (!existing) {
    return { success: false, message: "Agent not found" };
  }

  const ownsAgent = existing.userId === session.user.id;
  if (!authUser.is_admin && !ownsAgent) {
    return { success: false, message: "Forbidden" };
  }

  const updates: Record<string, unknown> = { updatedAt: now };

  if (data.agency_name !== undefined) updates.agencyName = data.agency_name;
  if (data.license_number !== undefined) updates.licenseNumber = data.license_number;
  if (data.specialization !== undefined) updates.specialization = data.specialization;
  if (data.service_areas !== undefined) updates.serviceAreas = data.service_areas;
  if (data.years_experience !== undefined) updates.yearsExperience = data.years_experience;

  if (authUser.is_admin) {
    if (data.is_verified !== undefined) {
      updates.isVerified = data.is_verified;
      if (data.is_verified === true) {
        updates.approvalStatus = "approved";
      }
    }
    if (data.approval_status !== undefined && isApprovalStatus(data.approval_status)) {
      updates.approvalStatus = data.approval_status;
    }
  } else if (data.resubmit === true && existing.approvalStatus === "rejected" && ownsAgent) {
    updates.approvalStatus = "pending";
    updates.isVerified = false;
  }

  const [row] = await db.update(agents).set(updates).where(eq(agents.id, data.id)).returning();
  if (!row) {
    return { success: false, message: "Agent not found" };
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

  return { success: true, data: mapAgentRowToAgentsResponse(row) };
}

export async function deleteAgent(id: string): Promise<ActionResult<null>> {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return { success: false, message: "Unauthorized" };
  }

  const authUser = mapSessionUserToUsersResponse(session.user);
  const db = await getDb();

  const [existing] = await db.select().from(agents).where(eq(agents.id, id)).limit(1);
  if (!existing) {
    return { success: false, message: "Agent not found" };
  }

  if (!authUser.is_admin && existing.userId !== session.user.id) {
    return { success: false, message: "Forbidden" };
  }

  await db.delete(agents).where(eq(agents.id, id));
  return { success: true, data: null };
}

export async function approveAgent(id: string): Promise<ActionResult<null>> {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return { success: false, message: "Unauthorized" };
  }

  const adminUser = mapSessionUserToUsersResponse(session.user);
  if (!adminUser.is_admin) {
    return { success: false, message: "Forbidden" };
  }

  const now = new Date();
  const db = await getDb();

  const [agentRow] = await db.select().from(agents).where(eq(agents.id, id)).limit(1);
  if (!agentRow) {
    return { success: false, message: "Agent not found" };
  }

  await db
    .update(agents)
    .set({ approvalStatus: "approved", isVerified: true, updatedAt: now })
    .where(eq(agents.id, id));

  await db
    .update(userTable)
    .set({ role: "agent", updatedAt: now })
    .where(and(eq(userTable.id, agentRow.userId), ne(userTable.role, "admin")));

  return { success: true, data: null };
}

export async function rejectAgent(id: string): Promise<ActionResult<null>> {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return { success: false, message: "Unauthorized" };
  }

  const adminUser = mapSessionUserToUsersResponse(session.user);
  if (!adminUser.is_admin) {
    return { success: false, message: "Forbidden" };
  }

  const now = new Date();
  const db = await getDb();

  const [agentRow] = await db.select().from(agents).where(eq(agents.id, id)).limit(1);
  if (!agentRow) {
    return { success: false, message: "Agent not found" };
  }

  await db
    .update(agents)
    .set({ approvalStatus: "rejected", isVerified: false, updatedAt: now })
    .where(eq(agents.id, id));

  await db
    .update(userTable)
    .set({ role: "user", updatedAt: now })
    .where(and(eq(userTable.id, agentRow.userId), eq(userTable.role, "agent")));

  return { success: true, data: null };
}

export async function fetchPendingAgents(params: {
  search?: string;
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
}): Promise<ActionResult<Awaited<ReturnType<typeof getPendingAgentApplicationsPaginated>>>> {
  const session = await getBetterAuthSession();
  if (!session?.user) {
    return { success: false, message: "Unauthorized" };
  }

  const adminUser = mapSessionUserToUsersResponse(session.user);
  if (!adminUser.is_admin) {
    return { success: false, message: "Forbidden" };
  }

  const { search: q = "", page = 1, limit = 10, sortOrder = "desc" } = params;
  const result = await getPendingAgentApplicationsPaginated({ q, page, limit, sortOrder });
  return { success: true, data: result };
}
