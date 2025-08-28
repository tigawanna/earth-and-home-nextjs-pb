import "server-only";

import { createServerClient } from "@/lib/pocketbase/clients/server-client";
import { AgentsCreate, AgentsUpdate } from "@/lib/pocketbase/types/pb-types";
import { eq } from "@tigawanna/typed-pocketbase";

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
        `name ~ "${q}" || email ~ "${q}" || phone ~ "${q}"`
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
    console.error("Error fetching agents:", error);
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
    console.error("Error fetching agent:", error);
    return {
      success: false,
      result: null,
      message: error instanceof Error ? error.message : "Failed to fetch agent",
    };
  }
}

// ====================================================
// CREATE AGENT
// ====================================================

export async function createAgent(data: AgentsCreate) {
  try {
    const client = await createServerClient();
    
    // Check if current user is admin
    const currentUser = client.authStore.record;
    if (!currentUser?.is_admin) {
      throw new Error("Unauthorized: Admin access required");
    }
    
    const agentsCollection = client.from("agents");
    
    // Check if agent already exists for this user
    if (data.user_id) {
      try {
        const existingAgent = await agentsCollection.getFirstListItem(eq("user_id", data.user_id));
        if (existingAgent) {
          throw new Error("An agent profile already exists for this user");
        }
      } catch (error) {
        // If getFirstListItem throws an error because no record found, that's fine
        // Only re-throw if it's our custom error about existing agent
        if (error instanceof Error && error.message.includes("agent profile already exists")) {
          throw error;
        }
      }
    }
    
    const agent = await agentsCollection.create(data);
    
    return {
      success: true,
      result: agent,
      message: "Agent created successfully",
    };
  } catch (error) {
    console.error("Error creating agent:", error);
    return {
      success: false,
      result: null,
      message: error instanceof Error ? error.message : "Failed to create agent",
    };
  }
}

// ====================================================
// UPDATE AGENT
// ====================================================

export async function updateAgent(agentId: string, data: AgentsUpdate) {
  try {
    const client = await createServerClient();
    
    // Check if current user is admin or owns the agent profile
    const currentUser = client.authStore.record;
    const agent = await client.from("agents").getOne(agentId);
    
    if (!currentUser?.is_admin && currentUser?.id !== agent.user_id) {
      throw new Error("Unauthorized: You can only update your own agent profile");
    }
    
    const agentsCollection = client.from("agents");
    
    // If updating user_id, check if agent already exists for this user
    if (data.user_id && data.user_id !== agent.user_id) {
      try {
        const existingAgent = await agentsCollection.getFirstListItem(eq("user_id", data.user_id));
        if (existingAgent && existingAgent.id !== agentId) {
          throw new Error("An agent profile already exists for this user");
        }
      } catch (error) {
        // If getFirstListItem throws an error because no record found, that's fine
        // Only re-throw if it's our custom error about existing agent
        if (error instanceof Error && error.message.includes("agent profile already exists")) {
          throw error;
        }
      }
    }
    
    const updatedAgent = await agentsCollection.update(agentId, data);
    
    return {
      success: true,
      result: updatedAgent,
      message: "Agent updated successfully",
    };
  } catch (error) {
    console.error("Error updating agent:", error);
    return {
      success: false,
      result: null,
      message: error instanceof Error ? error.message : "Failed to update agent",
    };
  }
}

// ====================================================
// DELETE AGENT
// ====================================================

export async function deleteAgent(agentId: string) {
  try {
    const client = await createServerClient();
    
    // Check if current user is admin
    const currentUser = client.authStore.record;
    if (!currentUser?.is_admin) {
      throw new Error("Unauthorized: Admin access required");
    }
    
    const agentsCollection = client.from("agents");
    await agentsCollection.delete(agentId);
    
    return {
      success: true,
      message: "Agent deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting agent:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete agent",
    };
  }
}

// ====================================================
// GET AVAILABLE USERS (users without agent profiles)
// ====================================================

export async function getAvailableUsers() {
  try {
    const client = await createServerClient();
    
    // Get all users
    const usersCollection = client.from("users");
    const users = await usersCollection.getFullList({
      sort: "-name",
    });
    
    // Get all agent user_ids
    const agentsCollection = client.from("agents");
    const agents = await agentsCollection.getFullList({
      select: {
        user_id: true,
      },
    });
    
    const agentUserIds = new Set(agents.map(agent => agent.user_id));
    
    // Filter out users who already have agent profiles
    const availableUsers = users.filter(user => !agentUserIds.has(user.id));
    
    return {
      success: true,
      result: availableUsers,
    };
  } catch (error) {
    console.error("Error fetching available users:", error);
    return {
      success: false,
      result: [],
      message: error instanceof Error ? error.message : "Failed to fetch available users",
    };
  }
}
