import { z } from "zod";

export const agentFormSchema = z.object({
  id: z.string().optional(),
  user_id: z.string().min(1, "User is required"),
  agency_name: z.string().min(1, "Agency name is required"),
  license_number: z.string().optional(),
  specialization: z.string().optional(),
  service_areas: z.string().optional(),
  years_experience: z.number().optional(),
  is_verified: z.boolean().optional(),
});

export type AgentFormData = z.infer<typeof agentFormSchema>;

export const editAgentFormSchema = z.object({
  agency_name: z.string().min(1, "Agency name is required"),
  license_number: z.string().optional(),
  specialization: z.string().optional(),
  service_areas: z.string().optional(),
  years_experience: z.number().optional(),
  is_verified: z.boolean().optional(),
});

export type EditAgentFormData = z.infer<typeof editAgentFormSchema>;
