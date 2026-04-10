import type { AgentsResponse, UsersResponse } from "@/types/domain-types";

export function canCreatePropertyListings(
  user: Pick<UsersResponse, "is_admin">,
  agent: Pick<AgentsResponse, "approval_status"> | null,
): boolean {
  if (!agent) {
    return false;
  }
  if (user.is_admin) {
    return true;
  }
  return agent.approval_status === "approved";
}

export function showBecomeAgentNav(agent: Pick<AgentsResponse, "approval_status"> | null): boolean {
  return !agent || agent.approval_status === "rejected";
}
