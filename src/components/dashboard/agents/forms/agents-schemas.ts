import { AgentsCreateZodSchema, AgentsUpdateZodSchema } from "@/lib/pocketbase/types/pb-zod";
import { z } from "zod";

// Use the auto-generated schemas from pb-zod.ts as base
export const agentFormSchema = AgentsCreateZodSchema.omit({
  id: true,
  created: true,
  updated: true,
}).extend({
  // Make agency_name required for forms
  agency_name: z.string().min(1, "Agency name is required"),
  // Ensure user_id is required 
  user_id: z.string().min(1, "User is required"),
});

export type AgentFormData = z.infer<typeof agentFormSchema>;

// Edit form schema - similar but all fields optional except what we want to enforce
export const editAgentFormSchema = AgentsUpdateZodSchema.omit({
  id: true,
  created: true,
  updated: true,
  'years_experience+': true,
  'years_experience-': true,
}).extend({
  // Make agency_name required for edit forms too
  agency_name: z.string().min(1, "Agency name is required"),
});

export type EditAgentFormData = z.infer<typeof editAgentFormSchema>;
