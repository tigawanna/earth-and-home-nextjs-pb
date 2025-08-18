import { ImagesUploadSection } from "@/components/property/form/files/ImagesUploadSection";
import { PropertyCard } from "@/components/property/list/PropertyCard";
import { PropertyImageGallery } from "@/components/property/list/PropertyImageGallery";
import type { PropertiesResponse } from "@/lib/pocketbase/types/pb-types";

// Example usage of updated PocketBase image components

/**
 * Property Detail Page Example
 * Shows full image gallery with thumbnails and fullscreen view
 */
export function PropertyDetailExample({ property }: { property: PropertiesResponse }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image Gallery - Takes 2 columns */}
        <div className="lg:col-span-2">
          <PropertyImageGallery
            property={property}
            videoUrl={property.video_url}
            virtualTourUrl={property.virtual_tour_url}
          />
        </div>
        
        {/* Property Details Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <h1 className="text-2xl font-bold mb-4">{property.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">{property.location}</p>
            {/* Add more property details here */}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Property Listing Grid Example
 * Shows multiple properties as cards with thumbnail images
 */
export function PropertyListingExample({ 
  properties, 
  onFavoriteClick 
}: { 
  properties: PropertiesResponse[];
  onFavoriteClick?: (propertyId: string) => void;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            showFavoriteButton={!!onFavoriteClick}
            onFavoriteClick={onFavoriteClick}
            isFavorited={false} // You would check favorite status here
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Property Form Example
 * Shows image upload functionality for creating/editing properties
 */
export function PropertyFormExample({ 
  existingProperty,
  control 
}: { 
  existingProperty?: PropertiesResponse;
  control: any; // react-hook-form control
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <form className="space-y-6">
        {/* Other form fields would go here */}
        
        {/* Image Upload Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Property Images</h2>
          <ImagesUploadSection
            control={control}
            existingProperty={existingProperty}
          />
        </div>
        
        {/* Form submission buttons would go here */}
      </form>
    </div>
  );
}

/**
 * Featured Properties Section Example
 * Shows a horizontal scroll of featured property cards
 */
export function FeaturedPropertiesExample({ 
  featuredProperties 
}: { 
  featuredProperties: PropertiesResponse[];
}) {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Properties</h2>
        
        <div className="flex gap-6 overflow-x-auto pb-4">
          {featuredProperties.map((property) => (
            <div key={property.id} className="flex-shrink-0 w-80">
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Component usage notes:
/*
1. PropertyImageGallery:
   - Pass the full property record (contains id, collectionId, collectionName needed for PocketBase URLs)
   - Automatically handles both string filenames and File objects
   - Generates optimized thumbnails for navigation
   - Supports keyboard navigation and fullscreen view

2. PropertyCard:
   - Perfect for property listings and grids
   - Shows primary image as thumbnail with hover effects
   - Includes property badges (Featured, New, For Sale/Rent)
   - Optional favorite functionality

3. ImagesUploadSection:
   - Use in property create/edit forms
   - Handles both new File uploads and existing string filenames
   - Supports drag & drop, file selection, and previews
   - Integrates with react-hook-form field arrays

Key Benefits:
- All components work seamlessly with PocketBase file storage
- Type-safe with generated PocketBase types
- Optimized image loading with Next.js Image component
- Consistent UI/UX across the application
- Built-in error handling for missing images
*/
