// Property Card Components
export { BasePropertyCard } from "./BasePropertyCard";
export {
    DashboardPropertyCard,
    FavoriteablePropertyCard, InteractivePropertyCard
} from "./InteractivePropertyCard";
export { DashboardLinkedPropertyCard, LinkedPropertyCard } from "./LinkedPropertyCard";

// For backward compatibility (deprecated)
export { PropertyCard } from "./PropertyCard";

// Component usage guide:
/*
## Architecture Overview

### BasePropertyCard
- Pure presentational component (no interactivity)
- Can be used in both server and client components
- Accepts optional footer actions via props

### LinkedPropertyCard (Server Components)
- Wraps BasePropertyCard with Next.js Link
- Use for property listings in server components
- Automatically navigates to property detail page
- Variants: LinkedPropertyCard, DashboardLinkedPropertyCard

### InteractivePropertyCard (Client Components)  
- Wraps BasePropertyCard with interactive features
- Favorites, edit controls, delete actions
- Use in dashboard areas and client-side lists
- Variants: InteractivePropertyCard, DashboardPropertyCard, FavoriteablePropertyCard

## Usage Examples

```tsx
// Server component - property listing page
import { LinkedPropertyCard } from "@/components/property/list";

export default function PropertiesPage({ properties }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map(property => (
        <LinkedPropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}

// Client component - dashboard with favorites
"use client";
import { FavoriteablePropertyCard } from "@/components/property/list";

export function FavoritesGrid({ properties, onFavoriteToggle }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map(property => (
        <FavoriteablePropertyCard
          key={property.id}
          property={property}
          isFavorited={property.isFavorited}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  );
}

// Client component - dashboard property management
"use client";
import { DashboardPropertyCard } from "@/components/property/list";

export function PropertyManagement({ properties, ...actions }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map(property => (
        <DashboardPropertyCard
          key={property.id}
          property={property}
          onEdit={actions.onEdit}
          onDelete={actions.onDelete}
          onView={actions.onView}
          onFavoriteToggle={actions.onFavoriteToggle}
        />
      ))}
    </div>
  );
}
```

## Benefits

1. **Server/Client Separation**: Clear distinction between server-side and client-side usage
2. **Performance**: Server components can be statically rendered, client components only where needed
3. **Reusability**: Base component can be composed with different wrappers
4. **Type Safety**: All components use proper PocketBase types
5. **Maintainability**: Single source of truth for card layout and styling
*/
