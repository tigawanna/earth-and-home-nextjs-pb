# Earth & Home - Real Estate Platform

A modern real estate platform built with Next.js and deployed on Cloudflare Workers.

**Live demo**: [earth-and-home-nextjs.denniskinuthiaw.workers.dev](https://earth-and-home-nextjs.denniskinuthiaw.workers.dev)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack, React Compiler) |
| Language | TypeScript (strict) |
| UI | Tailwind CSS v4 + DaisyUI v5 + shadcn/ui |
| Database | Cloudflare D1 (SQLite) via Drizzle ORM |
| Auth | Better Auth (Google OAuth) |
| Storage | Cloudflare R2 (media) + Cloudflare Images |
| Cache | R2 Incremental Cache with Regional Cache |
| State | TanStack Query |
| Deployment | Cloudflare Workers via OpenNext |

## Prerequisites

- Node.js 20+
- pnpm
- Wrangler CLI (`pnpm add -g wrangler`)
- Cloudflare account (authenticated via `wrangler login`)

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Create a `.env` file:

```bash
NODE_ENV=development
BETTER_AUTH_URL=http://localhost:3010
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3010
BETTER_AUTH_SECRET=<generate-a-random-secret>
GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<your-google-oauth-client-secret>
```

### 3. Set up the local D1 database

```bash
pnpm db:migrate:local
```

### 4. Start the dev server

```bash
pnpm dev
```

Open [http://localhost:3010](http://localhost:3010).

## Scripts

### Development

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start dev server (Turbopack, port 3010). Runs local D1 migrations automatically. |
| `pnpm build` | Production build |
| `pnpm lint` | Lint with oxlint |
| `pnpm format` | Format with oxfmt |

### Database

| Script | Description |
|--------|-------------|
| `pnpm db:generate` | Generate Drizzle migration files from schema changes |
| `pnpm db:migrate:local` | Apply migrations to local D1 |
| `pnpm db:migrate:remote` | Apply migrations to production D1 |
| `pnpm db:studio` | Open Drizzle Studio for local DB |
| `pnpm auth:generate` | Regenerate Better Auth schema after plugin changes |

### Deployment

| Script | Description |
|--------|-------------|
| `pnpm run preview` | Build and preview locally in Workers runtime |
| `pnpm run deploy` | Build and deploy to Cloudflare Workers |
| `pnpm run upload` | Build and upload without making live |
| `pnpm run cf-typegen` | Generate `cloudflare-env.d.ts` types |

### Analysis

| Script | Description |
|--------|-------------|
| `pnpm run analyze` | Bundle size analysis |
| `pnpm run lighthouse` | Lighthouse audit against localhost |

## Deployment

### Cloudflare Resources

The app requires these Cloudflare resources (configured in `wrangler.jsonc`):

| Resource | Binding | Name |
|----------|---------|------|
| D1 Database | `DB` | `earth-and-home-db` |
| R2 Bucket (cache) | `NEXT_INC_CACHE_R2_BUCKET` | `earth-and-home-nextjs-opennext-cache` |
| R2 Bucket (media) | `MEDIA` | `earth-and-home-media` |
| Cloudflare Images | `IMAGES` | — |
| Worker Self-Reference | `WORKER_SELF_REFERENCE` | `earth-and-home-nextjs` |

Create them if deploying to your own account:

```bash
wrangler d1 create earth-and-home-db
wrangler r2 bucket create earth-and-home-nextjs-opennext-cache
wrangler r2 bucket create earth-and-home-media
```

Update the `database_id` in `wrangler.jsonc` with the ID returned by the D1 create command.

### Environment Variables

**Build-time public variables** go in `.env.production`:

```bash
NEXT_PUBLIC_BETTER_AUTH_URL=https://your-worker.workers.dev
```

`NEXT_PUBLIC_*` variables are inlined at build time by Next.js. They do **not** work as Cloudflare runtime secrets.

**Runtime secrets** are set via Wrangler CLI:

```bash
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put BETTER_AUTH_URL
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
```

### Deploy

```bash
# Apply any pending D1 migrations to production
pnpm db:migrate:remote

# Build and deploy
pnpm run deploy
```

The deploy script automatically stubs the `@vercel/og` WASM file (~2 MB) to stay within the 3 MB Worker size limit, then restores it after upload.

### Custom Domains

1. Cloudflare Dashboard → Workers & Pages → Your Worker → Settings → Domains & Routes
2. Add a custom domain or route
3. Update `NEXT_PUBLIC_BETTER_AUTH_URL` in `.env.production` and `BETTER_AUTH_URL` secret to match

## Project Structure

```
├── drizzle/                    # D1 migration files
├── scripts/
│   ├── set-production-secrets.js   # Bulk secret management
│   ├── list-production-secrets.js  # List configured secrets
│   └── stub-resvg-wasm.sh         # WASM stub for bundle size
├── src/
│   ├── app/                    # Next.js App Router pages & API routes
│   ├── components/
│   │   ├── common/             # Reusable UI components
│   │   ├── dashboard/          # Dashboard feature components
│   │   ├── theme/              # Theme provider & toggle
│   │   └── ui/                 # shadcn/ui primitives
│   ├── config/                 # Site configuration
│   ├── data-access-layer/      # Server-side data fetching
│   ├── db/
│   │   └── schema/             # Drizzle schema definitions
│   ├── hooks/                  # React hooks
│   ├── lib/
│   │   ├── auth/               # Better Auth client & server
│   │   ├── db/                 # D1 database connection
│   │   └── tanstack/           # TanStack Query setup
│   ├── services/               # Domain-specific API services
│   └── types/                  # TypeScript type definitions
├── middleware.ts                # Edge middleware (auth guard)
├── open-next.config.ts         # OpenNext caching config
├── wrangler.jsonc              # Cloudflare Worker config
└── drizzle.config.ts           # Drizzle Kit config (local D1)
```

## Caching

The app uses R2 Incremental Cache with Regional Cache (`open-next.config.ts`):

- **Long-lived mode**: ISR/SSG responses cached for up to 30 minutes
- **Lazy background refresh**: Cache updates from R2 happen in the background
- **Cache interception**: Bypasses Next.js server for cached routes, improving cold starts

Static assets are cached via `public/_headers` (1-year immutable for JS/CSS/fonts, 30 days for images).

## Auth

Better Auth handles authentication with Google OAuth. The Edge middleware (`middleware.ts`) protects `/dashboard/*` routes by checking session cookies. In production over HTTPS, cookies are automatically prefixed with `__Secure-` — the middleware handles both prefixed and non-prefixed names.

## Learn More

- [Next.js](https://nextjs.org/docs)
- [OpenNext for Cloudflare](https://opennext.js.org/cloudflare)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Better Auth](https://www.better-auth.com/)
- [DaisyUI](https://daisyui.com/)
- [shadcn/ui](https://ui.shadcn.com/)
