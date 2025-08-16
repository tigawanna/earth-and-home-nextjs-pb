# PocketBase Property Queries Usage

This document shows how to use the migrated PocketBase property queries.

## Setup

The queries use the typed-pocketbase wrapper for type safety and the server client for authentication.

```typescript
import { getProperties, getProperty, getFavoriteProperties, getPropertyStats } from "@/DAL/pocketbase/property-queries";
```

## Get Properties with Filtering

```typescript
// Get all properties
const result = await getProperties();

// Get properties with filters
const filteredResult = await getProperties({
  filters: {
    search: "apartment",
    propertyType: "apartment",
    listingType: "rent",
    minPrice: 100000,
    maxPrice: 500000,
    beds: 2,
    city: "Nairobi",
    isFeatured: true
  },
  sortBy: "created",
  sortOrder: "desc",
  page: 1,
  limit: 10,
  userId: "user123" // For checking favorites
});

if (filteredResult.success) {
  console.log("Properties:", filteredResult.properties);
  console.log("Pagination:", filteredResult.pagination);
}
```

## Get Single Property

```typescript
// Get by ID
const propertyResult = await getProperty("property-id", "user123");

// Get by slug
const propertyBySlug = await getProperty("my-property-slug", "user123");

if (propertyResult.success) {
  console.log("Property:", propertyResult.property);
  console.log("Is favorited:", propertyResult.property.isFavorited);
  console.log("Agent:", propertyResult.property.agent);
}
```

## Get User's Favorite Properties

```typescript
const favoritesResult = await getFavoriteProperties("user123", 1, 20);

if (favoritesResult.success) {
  console.log("Favorite properties:", favoritesResult.properties);
  favoritesResult.properties.forEach(property => {
    console.log(`Favorited at: ${property.favoritedAt}`);
  });
}
```

## Get Property Statistics

```typescript
// Get stats for all properties
const allStats = await getPropertyStats();

// Get stats for specific agent
const agentStats = await getPropertyStats("agent123");

if (allStats.success) {
  console.log("Total properties:", allStats.stats.totalProperties);
  console.log("Active properties:", allStats.stats.activeProperties);
  console.log("Featured properties:", allStats.stats.featuredProperties);
}
```

## Key Changes from Drizzle

1. **Field Names**: Updated to match PocketBase collection schema
   - `createdAt` → `created`
   - `updatedAt` → `updated`
   - `propertyType` → `property_type`
   - `listingType` → `listing_type`
   - `agentId` → `agent_id`
   - `isFeatured` → `is_featured`

2. **Relations**: Use `expand` to get related data
   - Agent info is expanded via `agent_id` relation
   - Favorites are checked separately due to PocketBase limitations

3. **Filtering**: Use typed-pocketbase filter helpers
   - `and()`, `or()`, `eq()`, `like()`, `gte()`, `lte()`
   - No need for raw SQL

4. **Pagination**: PocketBase provides built-in pagination
   - `getList()` for paginated results
   - `getFullList()` for all results

5. **Authentication**: Uses PocketBase auth store instead of Better Auth
   - Server client handles authentication automatically
   - User context available via `client.authStore`

## Error Handling

All functions return a consistent result object:

```typescript
{
  success: boolean;
  message?: string; // Only present on errors
  properties?: PropertyWithAgent[]; // Only present on success
  property?: PropertyWithAgent; // Only present on success (single property)
  stats?: PropertyStats; // Only present on success (stats)
  pagination?: PaginationInfo; // Only present on success (lists)
}
```

Always check the `success` field before accessing data:

```typescript
const result = await getProperties();

if (result.success) {
  // Use result.properties, result.pagination
} else {
  console.error(result.message);
}
```
