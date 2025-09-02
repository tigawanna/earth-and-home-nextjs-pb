import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";
// import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

export default defineCloudflareConfig({
  // R2 Incremental Cache with Regional Cache for better performance
  incrementalCache: withRegionalCache(r2IncrementalCache, {
    mode: "long-lived", // Responses re-used for up to 30 minutes for ISR/SSG
    shouldLazilyUpdateOnCacheHit: true, // Background refresh from R2
  }),
  
  // Use default memory queue for development (comment out for production)
  // For production, uncomment the doQueue import and use: queue: doQueue,
  
  // Enable cache interception for better performance (disable for PPR)
  enableCacheInterception: true,
  
  // Note: D1 Tag Cache can be added later for on-demand revalidation
  // Requires: npx wrangler d1 create earth-and-home-tag-cache
  // tagCache: d1NextTagCache,
});
