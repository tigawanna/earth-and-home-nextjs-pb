"use client";

import { createBrowserClient } from "@/lib/pocketbase/clients/browser-client";
import { AgentsCreate, AgentsUpdate, UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { eq } from "@tigawanna/typed-pocketbase";

const client = createBrowserClient();

// ====================================================
// CLIENT-SIDE AGENT ACTIONS
// ====================================================

export async function createAgentAction(data: AgentsCreate) {
  try {
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

export async function updateAgentAction(agentId: string, data: AgentsUpdate) {
  try {
    const agentsCollection = client.from("agents");
    
    // Get current agent to check ownership
    const currentAgent = await agentsCollection.getOne(agentId);
    const currentUser = client.authStore.record as any;
    
    // Check authorization
    if (!currentUser?.is_admin && currentUser?.id !== currentAgent.user_id) {
      throw new Error("Unauthorized: You can only update your own agent profile");
    }
    
    // If updating user_id, check if agent already exists for this user
    if (data.user_id && data.user_id !== currentAgent.user_id) {
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

export async function deleteAgentAction(agentId: string) {
  try {
    const currentUser = client.authStore.record as any;
    
    // Check if current user is admin
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


