# Property Card Architecture

This document outlines the new property card architecture that separates server-side and client-side concerns for better performance and maintainability.

## Overview

The property card system is built on a layered architecture:

1. **BasePropertyCard** - Pure presentational component
2. **LinkedPropertyCard** - Server-side wrapper with navigation
3. **InteractivePropertyCard** - Client-side wrapper with interactions

## Components

### 🎨 BasePropertyCard (Presentational)

**File**: `src/components/property/list/BasePropertyCard.tsx`
**Type**: Presentational component (can be used in server or client components)

The foundation component that renders property information without any interactivity.

```tsx
<BasePropertyCard 
  property={property}
  className="custom-styles"
  showFooterActions={true}
  footerActions={<CustomButtons />}
/>
```

**Features:**
- Uses PocketBase image URLs with optimized thumbnails
- Displays property details (price, location, bed/bath, etc.)
- Shows property badges (Featured, New, Status)
- Optional footer with custom actions
- Fully accessible and responsive

---

### 🔗 LinkedPropertyCard (Server Components)

**File**: `src/components/property/list/LinkedPropertyCard.tsx`
**Type**: Server component

Wraps BasePropertyCard with Next.js Link for navigation. Perfect for property listings.

```tsx
// Standard property listing
<LinkedPropertyCard property={property} />

// Custom destination
<LinkedPropertyCard 
  property={property} 
  href="/custom/path" 
/>

// Dashboard variant
<DashboardLinkedPropertyCard property={property} />
```

**Use Cases:**
- Public property listings (`/properties`)
- Search results pages
- Related properties sections
- Agent portfolio pages

**Benefits:**
- Server-side rendering for better SEO
- Automatic link prefetching
- Static optimization possible
- No JavaScript required for basic functionality

---

### ⚡ InteractivePropertyCard (Client Components)

**File**: `src/components/property/list/InteractivePropertyCard.tsx`  
**Type**: Client component

Wraps BasePropertyCard with interactive features like favorites, editing, and custom actions.

```tsx
// Basic interactive card with favorites
<FavoriteablePropertyCard
  property={property}
  isFavorited={true}
  onFavoriteToggle={handleFavorite}
/>

// Full dashboard card with management actions
<DashboardPropertyCard
  property={property}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onView={handleView}
  onFavoriteToggle={handleFavorite}
/>

// Custom interactive card
<InteractivePropertyCard
  property={property}
  showFavoriteButton={true}
  customActions={<ShareButton />}
  onFavoriteToggle={handleFavorite}
/>
```

**Features:**
- Favorite/unfavorite functionality
- Property management actions (edit, delete, view)
- Loading states and error handling
- Custom action support
- Toast notifications
- Confirmation dialogs

---

## Usage Patterns

### Server Components (Static, SEO-friendly)

```tsx
// app/properties/page.tsx
import { LinkedPropertyCard } from "@/components/property/list";

export default function PropertiesPage({ properties }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {properties.map(property => (
        <LinkedPropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
```

### Client Components (Interactive)

```tsx
// app/dashboard/favorites/page.tsx
"use client";
import { FavoriteablePropertyCard } from "@/components/property/list";

export default function FavoritesPage({ properties }) {
  const handleFavoriteToggle = async (id, isFavorited) => {
    // API call to toggle favorite
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {properties.map(property => (
        <FavoriteablePropertyCard
          key={property.id}
          property={property}
          isFavorited={property.isFavorited}
          onFavoriteToggle={handleFavoriteToggle}
        />
      ))}
    </div>
  );
}
```

## Migration Guide

### From Old PropertyCard

**Before:**
```tsx
<PropertyCard 
  property={property}
  showFavoriteButton={true}
  onFavoriteClick={handleFavorite}
/>
```

**After (Server Component):**
```tsx
<LinkedPropertyCard property={property} />
```

**After (Client Component):**
```tsx
<FavoriteablePropertyCard 
  property={property}
  onFavoriteToggle={handleFavorite}
/>
```

## PocketBase Integration

All components use the PocketBase file helpers for optimized image handling:

```tsx
// Automatic thumbnail generation
const imageUrl = getImageThumbnailUrl(property, filename, "400x300");

// Full-size image
const fullUrl = getFileUrl(property, filename);
```

**Image Handling:**
- Primary image from `property.image_url`
- Fallback to first item in `property.images` array
- Supports both string filenames and File objects
- Automatic fallback to placeholder for missing images

## Performance Benefits

### Server Components
- **Static rendering** - Cards can be rendered at build time
- **No JavaScript** - Basic functionality works without JS
- **SEO-friendly** - Content is available to crawlers
- **Fast initial load** - No client-side hydration needed

### Client Components
- **Selective hydration** - Only interactive parts need JavaScript
- **Optimistic updates** - Immediate UI feedback
- **Error boundaries** - Graceful error handling
- **Progressive enhancement** - Works with JS disabled

## Styling and Customization

All components accept `className` props and support Tailwind CSS:

```tsx
<LinkedPropertyCard 
  property={property}
  className="hover:scale-105 transition-transform"
/>
```

**Consistent Design:**
- shadcn/ui components
- Responsive breakpoints
- Dark mode support
- Accessible color contrasts

## Best Practices

### When to Use Each Component

| Component | Use Case | Environment |
|-----------|----------|-------------|
| `BasePropertyCard` | Custom wrappers, special layouts | Any |
| `LinkedPropertyCard` | Property listings, search results | Server |
| `DashboardLinkedPropertyCard` | Admin property lists | Server |
| `FavoriteablePropertyCard` | Public listings with favorites | Client |
| `DashboardPropertyCard` | Property management | Client |
| `InteractivePropertyCard` | Custom interactive features | Client |

### Performance Tips

1. **Use server components by default** - Only add client components when interactivity is needed
2. **Batch API calls** - Group favorite/delete operations
3. **Optimistic updates** - Update UI immediately, sync with server
4. **Image optimization** - Use appropriate thumbnail sizes
5. **Lazy loading** - Implement virtualization for large lists

### Accessibility

All components include:
- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management

## Future Enhancements

- [ ] Virtual scrolling for large property lists
- [ ] Image lazy loading with placeholder blur
- [ ] Property comparison functionality
- [ ] Advanced filtering and sorting
- [ ] Real-time updates via WebSockets
- [ ] Property card analytics tracking
