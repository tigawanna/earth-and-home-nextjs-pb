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

#### R2 Storage (Optional)
For enhanced caching with Cloudflare R2:
1. Create an R2 bucket in Cloudflare Dashboard
2. Update `wrangler.jsonc` with R2 binding:
```jsonc
{
  "r2_buckets": [
    {
      "binding": "NEXT_INC_CACHE_R2_BUCKET",
      "bucket_name": "your-bucket-name"
    }
  ]
}
```

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
