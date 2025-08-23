# Property Card Architecture - Updated Link Pattern

## Overview

The property card components have been refactored to use a more flexible pattern where the Link is embedded directly inside the BasePropertyCard, with interactive elements placed in the footer outside the link area.

## Card Structure

```
┌─ Card Container ─────────────────────────┐
│ ┌─ Link (Clickable Area) ──────────────┐ │
│ │ • Image with status badges           │ │
│ │ • Property type                      │ │
│ │ • Title and price                    │ │
│ │ • Location                           │ │
│ │ • Description                        │ │
│ │ • Available from date                │ │
│ └──────────────────────────────────────┘ │
│ ┌─ Footer (Interactive Area) ──────────┐ │
│ │ • Property stats (bed/bath/sqft)     │ │
│ │ • Favorite button                    │ │
│ │ • Other interactive elements         │ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

## Benefits

1. **Clean Navigation**: The main card content is clickable for navigation
2. **Interactive Elements**: Footer contains buttons and interactions that don't interfere with navigation
3. **Visual Hierarchy**: Stats and actions are clearly separated from descriptive content
4. **Flexibility**: Can customize footer content while maintaining consistent card behavior

## Components

### BasePropertyCard

The base card component that can optionally wrap its content with a Link:

```tsx
<BasePropertyCard
  property={property}
  href="/properties/123"
  wrapWithLink={true}
  showFooterActions={true}
  footerActions={<CustomFooter />}
/>
```

### LinkedPropertyCard

A wrapper that provides default footer content with stats and favorite button:

```tsx
<LinkedPropertyCard
  property={property}
  currentUserId={userId}
  basePath="/dashboard/"
/>
```

## Usage Examples

### Basic Property Listing

```tsx
// Automatically includes stats and favorite button in footer
<LinkedPropertyCard
  property={property}
  currentUserId={currentUser?.id}
/>
```

### Custom Footer Content

```tsx
<LinkedPropertyCard
  property={property}
  currentUserId={currentUser?.id}
  footerActions={
    <div className="flex justify-between w-full">
      <PropertyStats property={property} />
      <div className="flex gap-2">
        <FavoriteButton propertyId={property.id} />
        <ShareButton propertyId={property.id} />
        <EditButton propertyId={property.id} />
      </div>
    </div>
  }
/>
```

### Dashboard Cards

```tsx
// Uses dashboard-specific URLs
<DashboardLinkedPropertyCard
  property={property}
  currentUserId={currentUser?.id}
/>
```

### Non-Linked Cards

```tsx
// No link, just display card (e.g., in modals)
<BasePropertyCard
  property={property}
  wrapWithLink={false}
  showFooterActions={true}
  footerActions={<FooterContent />}
/>
```

## Default Footer Content

The LinkedPropertyCard provides default footer content that includes:

- **Left side**: Property stats (beds, baths, square footage)
- **Right side**: Interactive elements (favorite button)

This can be completely overridden by passing custom `footerActions`.

## Migration

Existing usage of property cards should continue to work, but you can now:

1. Remove external Link wrappers around cards
2. Move interactive elements into the footer
3. Get better separation of concerns between navigation and interaction

## File Locations

- `src/components/property/list/cards/BasePropertyCard.tsx` - Base card component
- `src/components/property/list/cards/LinkedPropertyCard.tsx` - Card with Link and default footer
