This is a Next.js project that uses

## Features
- List all properties
- Allow users to search properties by location, price, and other criteria
- Allow users to view property details
- Allow users to bookmark properties
- Allow users to contact property owners
- Allow the admins to add, edit, and delete properties
- Allow the admins to manage users
- Allow the admins to manage bookings
- Allow the admins to manage reviews

## Frontend
- Tailwind CSS + shadcn/ui for the UI
  - global styles: `src/app/globals.css`

## Backend (single source)
- PocketBase is used as the single backend solution and will handle:
  - Database (collections, records)
  - Authentication (users, sessions, tokens)
  - File storage (uploads, served files)

- PocketBase integration points:
  - Browser client: `src/lib/pocketbase/browser-client.ts`
  - Server client: `src/lib/pocketbase/server-client.ts`
  - Middleware guard: `src/middleware.ts`
  - Environment variable: `NEXT_PUBLIC_POCKETBASE_API_URL` must point to your PocketBase API (e.g. http://127.0.0.1:8090)
  - Optional: generate typed models with `pocketbase-typegen` into `src/types/pocketbase-types.ts`

## Uploads
- Use PocketBase file storage for property images/files. Replace any previous R2/code for uploads with PocketBase upload flows and the existing upload UI components.

## Preferences & Conventions
- Avoid using `any` except when absolutely necessary.
- Place route-related components in a `_components` folder adjacent to the route.
- Use `nuqs` for client-side search params in client components so server components re-fetch based on URL search params.
  - Example: Server component lists properties; search box is a client component that updates URL via `nuqs`.
- If a component exceeds ~250 lines, break it into smaller components.
- Next.js App Router + RSCs guidance:
  - Prefer server components for data fetching. Wrap server-rendered async components in `<Suspense>`.
  - If a client component needs data, prefetch in the server component and pass as props.

## Dev tooling
- Run type checks: `npx tsc --noEmit`
- Only run the linter when explicitly requested: `npm run lint`

## Notes
- Migrating from previous backend libraries: remove or ignore Drizzle / Better Auth / AWS-specific code now that PocketBase covers DB/auth/files.
- If you want, I can add a typed `src/lib/pocketbase/client.ts` that exports both `createBrowserClient` and `createServerClient`, and update examples for common operations (listings fetch, bookmarks, auth flows).
