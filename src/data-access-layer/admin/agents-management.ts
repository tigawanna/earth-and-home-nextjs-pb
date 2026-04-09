import "server-only";

import { drizzleGetServerSideAgents, drizzleGetSingleAgent } from "./drizzle-agents-queries";

export async function getServerSideAgents({
  q = "",
  page = 1,
  limit = 20,
  sortBy = "created",
  sortOrder = "desc",
}: {
  q?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
} = {}) {
  try {
    const result = await drizzleGetServerSideAgents({ q, page, limit, sortBy, sortOrder });
    return {
      success: true,
      result,
    };
  } catch (error) {
    console.log("error happende = =>\n", "Error fetching agents:", error);
    return {
      success: false,
      result: null,
      message: error instanceof Error ? error.message : "Failed to fetch agents",
    };
  }
}

export async function getSingleAgent(agentId: string) {
  try {
    return await drizzleGetSingleAgent(agentId);
  } catch (error) {
    console.log("error happende = =>\n", "Error fetching agent:", error);
    return {
      success: false,
      result: null,
      message: error instanceof Error ? error.message : "Failed to fetch agent",
    };
  }
}
