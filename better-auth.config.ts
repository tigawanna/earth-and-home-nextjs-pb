import { createClient } from "@libsql/client";
import { config } from "dotenv";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/libsql";
import { admin } from "better-auth/plugins";
import * as schema from "./src/db/schema/index";

config({ path: ".env" });
config({ path: ".dev.vars" });

const client = createClient({ url: ":memory:" });
const db = drizzle(client, { schema });

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET ?? "01234567890123456789012345678901",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  trustedOrigins: [
    process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  ],
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  emailAndPassword: { enabled: false },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "cli-placeholder",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "cli-placeholder",
    },
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
  ],
});
