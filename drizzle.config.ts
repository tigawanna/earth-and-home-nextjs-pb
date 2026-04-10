import { defineConfig } from "drizzle-kit";

const localD1Sqlite =
  process.env.DRIZZLE_STUDIO_DB_URL ??
  "file:.wrangler/state/v3/d1/miniflare-D1DatabaseObject/2981305cef37cdd243afba27f7a6a3a923b95a618d4a7a614789755fb76a5742.sqlite";

const dbCredentials = process.env.USE_REMOTE_D1
  ? {
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
      databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
      token: process.env.CLOUDFLARE_D1_TOKEN!,
    }
  : {
      url: localD1Sqlite,
    };

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials,
});
