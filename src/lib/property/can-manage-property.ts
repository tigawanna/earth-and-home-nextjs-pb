import type { AgentsResponse, PropertiesResponse, UsersResponse } from "@/types/domain-types";

export function canManageProperty(
  user: Pick<UsersResponse, "id" | "is_admin"> | null | undefined,
  agent: Pick<AgentsResponse, "id"> | null | undefined,
  property: Pick<PropertiesResponse, "agent_id" | "owner_id">,
): boolean {
  if (!user) {
    return false;
  }
  if (user.is_admin) {
    return true;
  }
  if (agent?.id && property.agent_id === agent.id) {
    return true;
  }
  if (property.owner_id === user.id) {
    return true;
  }
  return false;
}
