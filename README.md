# Earth & Home - Real Estate Platform

A modern real estate platform built with Next.js, PocketBase, and deployed on Cloudflare Workers using OpenNext.

## Tech Stack

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: PocketBase (database, auth, file storage)
- **Deployment**: Cloudflare Workers via OpenNext
- **State Management**: TanStack Query for server state

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: use Node 20+)
- pnpm package manager
- PocketBase server running

### Environment Setup

1. Copy environment variables:
```bash
cp .env-example .env
```

2. Update `.env` with your PocketBase configuration:
```bash
# PocketBase Configuration
NEXT_PUBLIC_POCKETBASE_API_URL=http://127.0.0.1:8090
# Add other required environment variables
```

### Development Server

```bash
# Install dependencies
pnpm install

# Generate PocketBase types and collections (runs automatically before dev)
pnpm run pb-types        # Generate TypeScript types from PocketBase
pnpm run pb-collections  # Generate collection structure

# Start development server with Turbopack
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

### Development
```bash
pnpm dev                 # Start development server with Turbopack
pnpm build              # Build for production
pnpm start              # Start production server locally
pnpm lint               # Run ESLint
```

### PocketBase Integration
```bash
pnpm run pb-types       # Generate TypeScript types from PocketBase schema
pnpm run pb-collections # Generate collection structure documentation
```

### Performance & Analysis
```bash
pnpm run analyze        # Analyze bundle size with webpack-bundle-analyzer
pnpm run lighthouse     # Run Lighthouse performance audit
pnpm run perf:build     # Build and analyze bundle in one command
```

## OpenNext Cloudflare Deployment

This project is configured for deployment on Cloudflare Workers using OpenNext.

### Key OpenNext Commands

```bash
# Preview build locally in Workers runtime (recommended for testing)
pnpm run preview
# This command:
# 1. Builds the Next.js app
# 2. Transforms it for Cloudflare Workers
# 3. Starts a local preview server

# Deploy to Cloudflare Workers
pnpm run deploy
# This command:
# 1. Builds the Next.js app for production
# 2. Transforms it for Cloudflare Workers
# 3. Deploys directly to your Cloudflare account

# Upload new version without deploying (for staged deployments)
pnpm run upload
# This command:
# 1. Builds and transforms the app
# 2. Uploads a new version to Cloudflare
# 3. Does not make it live (manual activation required)

# Generate Cloudflare environment types
pnpm run cf-typegen
# Generates cloudflare-env.d.ts with proper types for Workers runtime
```

### Deployment Setup

1. **Install Wrangler CLI** (if not already installed):
```bash
npm install -g wrangler
# or
pnpm add -g wrangler
```

2. **Authenticate with Cloudflare**:
```bash
wrangler login
```

3. **Configure your worker name** in `wrangler.jsonc`:
```jsonc
{
  "name": "your-app-name", // Change this to your preferred worker name
  "compatibility_date": "2024-12-30"
}
```

4. **Deploy**:
```bash
pnpm run deploy
```

### Important Deployment Notes

#### Environment Variables
- Set production environment variables in Cloudflare Dashboard
- Go to: Workers & Pages → Your Worker → Settings → Variables
- Add `NEXT_PUBLIC_POCKETBASE_API_URL` and other required variables

#### Custom Domains
1. In Cloudflare Dashboard: Workers & Pages → Your Worker → Triggers
2. Add Custom Domain or Route
3. Configure DNS records if using external domain

#### Caching Configuration ✅ Implemented
The application now uses Cloudflare R2 for advanced caching with regional cache optimization:

**Current Setup (Production-Ready)**
- ✅ R2 Incremental Cache with Regional Cache enabled
- ✅ Long-lived cache mode (30-min cache for ISR/SSG)
- ✅ Lazy background cache updates from R2
- ✅ Cache interception for better cold start performance
- ✅ Static asset caching optimized for 1-year immutable assets

**R2 Bucket Configuration**
The app is configured with R2 bucket `earth-and-home-cache` for incremental caching:
```jsonc
// wrangler.jsonc
{
  "r2_buckets": [
    {
      "binding": "NEXT_INC_CACHE_R2_BUCKET",
      "bucket_name": "earth-and-home-cache"
    }
  ]
}
```

**OpenNext Caching Configuration**
```typescript
// open-next.config.ts
export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(r2IncrementalCache, {
    mode: "long-lived", // 30-min cache for ISR/SSG responses
    shouldLazilyUpdateOnCacheHit: true, // Background R2 refresh
  }),
  enableCacheInterception: true, // Better cold start performance
});
```

**Creating Your Own R2 Bucket**
If deploying to your own Cloudflare account:
```bash
# Create R2 bucket for caching
npx wrangler r2 bucket create your-app-cache

# Update wrangler.jsonc with your bucket name
# Update bucket_name in the r2_buckets configuration
```

### Deployment Commands ✅ Tested

All OpenNext commands have been tested and are working:

```bash
# Build the Next.js app
pnpm run build

# Build OpenNext worker for Cloudflare
npx opennextjs-cloudflare build

# Preview locally with Wrangler (recommended for testing)
npx opennextjs-cloudflare preview

# Deploy to Cloudflare Workers
npx opennextjs-cloudflare deploy

# Combined build and preview (from package.json)
pnpm run preview

# Combined build and deploy (from package.json)  
pnpm run deploy
```

**Command Explanations:**
- `pnpm run build`: Builds the Next.js application with production optimizations
- `opennextjs-cloudflare build`: Converts Next.js build to Cloudflare Worker format
- `opennextjs-cloudflare preview`: Starts local Wrangler dev server for testing
- `opennextjs-cloudflare deploy`: Uploads worker to Cloudflare and deploys
- `pnpm run preview`: Convenience script that builds and previews in one command
- `pnpm run deploy`: Convenience script that builds and deploys in one command

### Performance Optimizations

#### Static Asset Caching
- The `public/_headers` file configures aggressive caching for static assets
- Next.js static files cached for 1 year (immutable)
- Images cached for 30 days
- Fonts cached for 1 year

#### Build Optimizations
- React Compiler enabled for better performance
- Bundle analyzer available via `pnpm run analyze`
- View Transitions API enabled for smooth page transitions

### Monitoring & Debugging

#### Cloudflare Analytics
- Real User Monitoring available in Cloudflare Dashboard
- Worker Analytics show request patterns and performance

#### Wrangler Tools
```bash
# View worker logs in real-time
wrangler tail

# Test worker locally
wrangler dev

# View worker status
wrangler whoami
```

### Common Issues & Solutions

#### Caching Setup ✅ Working
The app now uses R2 caching successfully. If you encounter caching issues:

**Current Working Configuration:**
- R2 bucket: `earth-and-home-cache` 
- Regional cache with long-lived mode (30 minutes)
- Cache interception enabled for better performance
- Static assets cached via `public/_headers`

#### R2 Caching Errors (Legacy)
**Error**: `No R2 binding "NEXT_INC_CACHE_R2_BUCKET" found!`

**Solution**: This was resolved by properly configuring the R2 bucket and OpenNext config:
1. ✅ **R2 Bucket Created**: `earth-and-home-cache`
2. ✅ **Wrangler Config**: R2 binding properly configured  
3. ✅ **OpenNext Config**: Regional cache with R2 backend enabled
4. ✅ **Testing**: All commands work successfully

**Note**: If deploying to your own account, create your own R2 bucket:
```bash
npx wrangler r2 bucket create your-bucket-name
# Then update bucket_name in wrangler.jsonc
```

#### Advanced Caching Features

**Regional Cache Benefits:**
- `mode: "long-lived"`: ISR/SSG responses cached for up to 30 minutes
- `shouldLazilyUpdateOnCacheHit: true`: Background cache refresh from R2
- Reduced R2 requests and faster response times
- Better performance for frequently accessed content

**Static Asset Optimization:**
- Next.js `/_next/static/*` files: 1-year immutable cache
- Images (PNG, JPG, WebP, SVG): 30-day cache
- Fonts (WOFF, WOFF2, TTF): 1-year immutable cache
- CSS/JS files: 1-year immutable cache
- HTML files: No cache (always fresh)

**Cache Interception:**
- Bypasses Next.js server for cached ISR/SSG routes
- Improves cold start performance
- Reduces JavaScript execution overhead
- Not compatible with PPR (Partial Prerendering)

**Future Enhancements Available:**
- Durable Objects Queue for ISR revalidation (commented in config)
- D1 Tag Cache for on-demand revalidation with `revalidateTag`
- Automatic cache purge for zone-based deployments

#### Build Errors
- Ensure all environment variables are set
- Run `pnpm run pb-types` if PocketBase types are outdated
- Check for any `export const runtime = "edge"` statements (not supported)

#### Deployment Issues
- Verify Wrangler authentication: `wrangler whoami`
- Check worker limits (1MB compressed size for free tier)
- Ensure compatibility_date is recent in `wrangler.jsonc`

#### Performance Issues
- Use `pnpm run preview` to test locally before deploying
- Monitor bundle size with `pnpm run analyze`
- Check Cloudflare Analytics for performance metrics

### File Structure Notes

```
├── public/_headers          # Cloudflare static asset caching rules
├── wrangler.jsonc          # Cloudflare Worker configuration
├── open-next.config.ts     # OpenNext configuration
├── .dev.vars              # Local development environment variables
└── cloudflare-env.d.ts    # Generated Cloudflare runtime types
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [OpenNext Cloudflare Docs](https://opennext.js.org/cloudflare) - Deployment guide
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) - Runtime documentation
- [PocketBase Documentation](https://pocketbase.io/docs/) - Backend API reference
- [shadcn/ui](https://ui.shadcn.com/) - UI component system
