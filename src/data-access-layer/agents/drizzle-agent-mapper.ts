import { agents } from "@/db/schema/app-schema";
import type { AgentsResponse } from "@/types/domain-types";
import type { InferSelectModel } from "drizzle-orm";

export type AgentRow = InferSelectModel<typeof agents>;

export function mapAgentRowToAgentsResponse(row: AgentRow): AgentsResponse {
  const created = row.createdAt ? new Date(row.createdAt).toISOString() : new Date().toISOString();
  const updated = row.updatedAt ? new Date(row.updatedAt).toISOString() : created;

  return {
    id: row.id,
    created,
    updated,
    user_id: row.userId,
    agency_name: row.agencyName,
    license_number: row.licenseNumber ?? "",
    specialization: (row.specialization ?? "") as AgentsResponse["specialization"],
    service_areas: row.serviceAreas ?? "",
    years_experience: row.yearsExperience ?? 0,
    is_verified: row.isVerified ?? false,
  };
}
