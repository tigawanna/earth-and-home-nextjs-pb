import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32)
    .default("dev-only-better-auth-secret-min-32-chars-long"),
  BETTER_AUTH_URL: z.url().default("http://localhost:3010"),
  GOOGLE_CLIENT_ID: z.string().default(""),
  GOOGLE_CLIENT_SECRET: z.string().default(""),
  CLOUDFLARE_ACCOUNT_ID: z.string().default(""),
  CLOUDFLARE_D1_DATABASE_ID: z.string().default("fce5d319-e0d2-4c33-aea1-31bc18908686"),
  R2_ENDPOINT: z.string().default("https://"),
  R2_ACCESS_KEY_ID: z.string().default(""),
  R2_SECRET_ACCESS_KEY: z.string().default(""),
  R2_BUCKET_NAME: z.string().default("earth-and-home"),
});

const { success, data } = serverEnvSchema.safeParse(process.env);
if (!success) {
  throw new Error("Invalid server environment variables");
}

export const serverEnvs = data;
