# Property API Migration Guide

This document explains the migration from the old property API to the new custom property API that includes `is_favorited` fields.

## Overview

The property system now supports two API approaches:

1. **Custom Property API** (`base-custom-property-api.ts`) - New API with built-in favorite status
2. **Public Property API** (`public-property-queries.ts`) - Fallback API using standard PocketBase queries

## New Features

### Enhanced Property Data
- `is_favorited`: Boolean indicating if the current user has favorited the property
- `favorite_timestamp`: When the property was favorited (if applicable)
- Better agent/owner information integration

### Automatic Fallback
The system automatically falls back to the public API if the custom routes are not available.

## Usage Examples

### Client-Side Queries

```typescript
import { dashboardPropertyQueryOptions, dashboardPropertyByIdQueryOptions } from '@/data-access-layer/pocketbase/properties/client-side-property-queries';

// Get paginated properties with filters
const propertiesQuery = dashboardPropertyQueryOptions({
  page: 1,
  limit: 20,
  filters: {
    search: 'apartment',
    listing_type: 'rent',
    status: 'active'
  }
});

// Get single property by ID
const propertyQuery = dashboardPropertyByIdQueryOptions({
  propertyId: 'property-id-here'
});
```

### Server-Side Queries

```typescript
import { getProperties, getServerSidePropertyById } from '@/data-access-layer/pocketbase/properties/server-side-property-queries';

// Get properties on server
const { success, properties, pagination } = await getProperties({
  filters: { listing_type: 'sale' },
  page: 1,
  limit: 10
});

// Get single property on server
const { success, property } = await getServerSidePropertyById('property-id');
```

## Component Updates

### FavoriteProperty Component

The `FavoriteProperty` component now:
- Automatically detects the current user from PocketBase auth
- Shows the correct favorite state using `is_favorited` or `isFavorited`
- Provides visual feedback (filled heart for favorited properties)
- Invalidates relevant queries after toggling favorites

```tsx
<FavoriteProperty 
  propertyId={property.id} 
  isFavorited={property.isFavorited}
  is_favorited={property.is_favorited}
/>
```

### Property Display Components

Components like `BaseSingleProperty` now pass the favorite status:

```tsx
// Before
<FavoriteProperty propertyId={property.id} />

// After
<FavoriteProperty 
  propertyId={property.id} 
  isFavorited={property.isFavorited}
  is_favorited={property.is_favorited}
/>
```

## Migration Steps

1. **Update Imports**: Change from old base queries to new custom API
2. **Update Types**: Use `PropertyWithRelations` for new API responses
3. **Update Components**: Pass favorite status to `FavoriteProperty`
4. **Test Fallback**: Ensure fallback works when custom routes aren't available

## Type Compatibility

The system maintains compatibility between:
- `PropertyWithFavorites` (old format)
- `PropertyWithRelations` (new format)

Mapping functions ensure seamless conversion between the two formats.

## Error Handling

The system gracefully handles:
- Missing custom API routes (falls back to public API)
- Network errors
- Authentication issues
- Missing user context

## Performance Notes

- Queries are cached using TanStack Query
- Favorite status is updated optimistically
- Stale time is set to 5 minutes for better UX
