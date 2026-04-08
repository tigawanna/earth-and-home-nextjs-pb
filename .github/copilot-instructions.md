# Next.js Property Management Project

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
  - AVOID HARDCODING CSS COLORS use the provided css variables in `src/app/globals.css` instead unless absolutely necessary

## Backend

- Target stack: Cloudflare D1 (Drizzle), Better Auth, R2. Legacy PocketBase clients and types under `src/lib/pocketbase/` remain until the migration is finished.
- Dashboard auth proxy: `src/proxy.ts`

## File Structure

- `/src/lib` has utils and configs for third party libraries
- `/src/components` contains reusable components
- `/src/utils` contains utility functions and types that doesn't rely on any specific framework or library

## Preferences & Conventions

- use `pnpm`
- Avoid using `any` except when absolutely necessary
- Components should never exceed 150 lines - break into smaller components if needed
- Main page components should not exceed 70 lines - extract sections into separate components
- If a component exceeds ~180 lines, break it into smaller components
- Never use useEffect for data fetching - use server components and async/await instead or tanstack query if the component is a client component
- Avoid hardcoding colors i the markup and use the css variables defined in `src/app/globals.css` instead instead i==of bg-white, text-black, etc use bg-foreground, text-foreground, etc unless under unique circumstances

## Next.js App Router Guidelines

- Place route-related components in a `_components` folder adjacent to the route
- Use `nuqs` for client-side search params in client components so server components re-fetch based on URL search params
  - Example: Server component lists properties; search box is a client component that updates URL via `nuqs`
- Next.js App Router + RSCs guidance:
  - Prefer server components for data fetching. Wrap server-rendered async components in `<Suspense>`
  - If a client component needs data, prefetch in the server component and pass as props
  - When creating usage examples and documentation put in `/doc/the-feature` and use markdown
  - Forms should use `react-hook-form` for better validation and error handling
    - Use `FormErrorDisplay` to show form errors
    - Use `FormStateDebug` to debug form state in development
    - Form validation: use Zod schemas in `src/lib/pocketbase/types/pb-zod.ts` where applicable
- do NOT document features unless if asked to leave sparse comments here and ther but do not create a markdown file unless asked

## Dev Tooling

- Run type checks: `npx tsc --noEmit`
- Only run the linter when explicitly requested: `npm run lint`

## Notes

## Image Handling Rules

### Property images (legacy PocketBase URLs during migration)

#### ✅ Correct Pattern:

```tsx
import { getImageThumbnailUrl } from "@/lib/pocketbase/utils/files";
import Image from "next/image";

// Get the first available image
const primaryImage =
  property.image_url ||
  (Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : null);
const imageUrl =
  primaryImage && typeof primaryImage === "string"
    ? getImageThumbnailUrl(property, primaryImage, "80x80")
    : null;

// Use Next.js Image component with relative container
<div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted">
  {imageUrl ? (
    <Image src={imageUrl} alt={property.title} fill className="object-cover" sizes="80px" />
  ) : (
    <div className="w-full h-full flex items-center justify-center">
      <Building2 className="h-5 w-5 text-muted-foreground" />
    </div>
  )}
</div>;
```

#### ❌ Avoid:

- Direct PocketBase URL construction: `${process.env.NEXT_PUBLIC_POCKETBASE_API_URL}/api/files/...`
- Using `<img>` tag instead of Next.js `<Image>`
- Not handling fallback cases
- Missing `relative` positioning on container

#### ✅ Always:

- Use `getImageThumbnailUrl()` utility function
- Use Next.js `<Image>` component with `fill` prop
- Set appropriate `sizes` attribute
- Include fallback UI with icons
- Use `relative` positioning on container div
