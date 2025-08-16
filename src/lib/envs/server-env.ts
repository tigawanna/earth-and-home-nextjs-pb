import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().default("postgresql://localhost:5432/earth_and_home"),
  BETTER_AUTH_SECRET: z.string().default("your-secret-key-here-must-be-at-least-32-chars-long"),
  BETTER_AUTH_URL: z.url().default("http://localhost:3000"),
  CLOUDFLARE_ACCOUNT_ID: z.string().default(""),
  R2_ENDPOINT: z.string().default("https://"),
  R2_ACCESS_KEY_ID: z.string().default(""),
  R2_SECRET_ACCESS_KEY: z.string().default(""),
  R2_BUCKET_NAME: z.string().default("earth-and-home"),
  //   API_KEY: z.string().min(32).max(32),
});


const { success, data, error } = serverEnvSchema.safeParse(process.env);
if (!success) {
  console.error("Invalid server environment variables:", z.treeifyError(error));
  throw new Error("Invalid server environment variables");
}


export const serverEnvs = data;


