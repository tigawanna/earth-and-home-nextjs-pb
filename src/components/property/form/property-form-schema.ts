import { PropertiesUpdateZodSchema } from "@/lib/pocketbase/types/pb-zod";
import z from "zod";

export const PropertyFormSchema = PropertiesUpdateZodSchema

.extend({
  // allow either an array of strings (uploaded file URLs) or an array that contains File objects (local uploads)
  id: z.string().optional(),
  images: z.array(z.union([z.string(), z.instanceof(File)])).nullable(),
});


export type PropertyFormData = z.infer<typeof PropertyFormSchema>;
