import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/schema";

const defaultLocalAuthUrl = "http://localhost:3010";

function authSecret(env: CloudflareEnv) {
  const fromEnv = env.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET;
  if (fromEnv) {
    return fromEnv;
  }
  return "01234567890123456789012345678901";
}

function authBaseUrl(env: CloudflareEnv) {
  return (
    env.BETTER_AUTH_URL ||
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    defaultLocalAuthUrl
  );
}

function googleClientId(env: CloudflareEnv) {
  return env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "";
}

function googleClientSecret(env: CloudflareEnv) {
  return env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET || "";
}

export function createAuth(env: CloudflareEnv) {
  const db = drizzle(env.DB, { schema });
  const baseURL = authBaseUrl(env);
  return betterAuth({
    secret: authSecret(env),
    baseURL,
    trustedOrigins: [baseURL],
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema,
    }),
    emailAndPassword: { enabled: false },
    socialProviders: {
      google: {
        clientId: googleClientId(env),
        clientSecret: googleClientSecret(env),
      },
    },
    plugins: [
      nextCookies(),
      admin({
        defaultRole: "user",
        adminRoles: ["admin"],
      }),
    ],
  });
}
