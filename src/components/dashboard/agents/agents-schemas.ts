import { z } from "zod";

// Agent form validation schema
export const agentFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  user_id: z.string().min(1, "User is required"),
});

export type AgentFormData = z.infer<typeof agentFormSchema>;

// Edit agent form schema (allows updating without user_id)
export const editAgentFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  user_id: z.string().optional(),
});

export type EditAgentFormData = z.infer<typeof editAgentFormSchema>;
