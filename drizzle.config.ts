import { defineConfig } from "drizzle-kit";

const localD1Sqlite =
  process.env.DRIZZLE_STUDIO_DB_URL ??
  "file:.wrangler/state/v3/d1/miniflare-D1DatabaseObject/2981305cef37cdd243afba27f7a6a3a923b95a618d4a7a614789755fb76a5742.sqlite";

  
export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: localD1Sqlite,
  },
});
