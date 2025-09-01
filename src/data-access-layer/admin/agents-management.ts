import "server-only";

import { createServerClient } from "@/lib/pocketbase/clients/server-client";

// ====================================================
// GET AGENTS WITH SEARCH AND PAGINATION
// ====================================================

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
    const client = await createServerClient();
    const agentsCollection = client.from("agents");

    // Build filter for search
    let filter = null;
    if (q) {
      filter = agentsCollection.createFilter(
        `agency_name ~ "${q}" || license_number ~ "${q}" || specialization ~ "${q}" || service_areas ~ "${q}" || user_id.name ~ "${q}" || user_id.email ~ "${q}"`
      );
    }

    const sort = agentsCollection.createSort(
      `${sortOrder === "desc" ? "-" : "+"}${sortBy}` as any
    );

    const result = await agentsCollection.getList(page, limit, {
      filter,
      sort,
      select: {
        expand: {
          user_id: true,
        },
      },
    });

    return {
      success: true,
      result,
    };
  } catch (error) {
    console.log("error happende = =>\n","Error fetching agents:", error);
    return {
      success: false,
      result: null,
      message: error instanceof Error ? error.message : "Failed to fetch agents",
    };
  }
}

// ====================================================
// GET SINGLE AGENT
// ====================================================

export async function getSingleAgent(agentId: string) {
  try {
    const client = await createServerClient();
    const agentsCollection = client.from("agents");

    const agent = await agentsCollection.getOne(agentId, {
      select: {
        expand: {
          user_id: true,
        },
      },
    });

    return {
      success: true,
      result: agent,
    };
  } catch (error) {
    console.log("error happende = =>\n","Error fetching agent:", error);
    return {
      success: false,
      result: null,
      message: error instanceof Error ? error.message : "Failed to fetch agent",
    };
  }
}

