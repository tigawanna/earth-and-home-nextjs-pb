# PocketBase Image Handling - Migration Complete

This document outlines the completed migration from AWS R2/Cloudflare to PocketBase for property image handling.

## Overview

All property image handling now uses PocketBase's built-in file storage system. This provides:

- Unified backend for database and file storage
- Built-in file upload, download, and thumbnail generation
- Simpler deployment and configuration
- Type-safe file handling with TypeScript

## Components Updated

### 1. Image Upload Components

**Location**: `src/components/property/form/files/ImagesUploadSection.tsx`

- Handles both File objects (new uploads) and string filenames (existing files)
- Supports drag & drop, file selection, and preview
- Featured image selection functionality
- Automatic validation (file type, size limits)
- Compatible with react-hook-form field arrays

**Usage**:
```tsx
<ImagesUploadSection 
  control={control} 
  existingProperty={property} // Optional, for edit mode
/>
```

### 2. Image Display Components

**Location**: `src/components/property/list/PropertyImageGallery.tsx`

- Full-screen image gallery with carousel
- Thumbnail navigation
- Keyboard navigation (arrow keys)
- Responsive design
- Handles missing images gracefully

**Usage**:
```tsx
<PropertyImageGallery 
  property={property} 
  videoUrl={property.video_url}
  virtualTourUrl={property.virtual_tour_url}
/>
```

**Location**: `src/components/property/list/PropertyCard.tsx`

- Property card with thumbnail image
- Price, location, and property details
- Favorite functionality (optional)
- Responsive design

**Usage**:
```tsx
<PropertyCard 
  property={property}
  showFavoriteButton={true}
  onFavoriteClick={handleFavorite}
  isFavorited={isFavorited}
/>
```

## File Helper Functions

**Location**: `src/lib/pocketbase/files.ts`

### `getFileUrl(record, filename, queryParams?)`
Generate full URL to a file in PocketBase storage.

### `getImageThumbnailUrl(record, filename, thumbSize?)`
Generate thumbnail URL with specified dimensions.

### `getFileDownloadUrl(record, filename)`
Generate download URL with download=1 parameter.

**Example**:
```typescript
import { getFileUrl, getImageThumbnailUrl } from '@/lib/pocketbase/files';

// Get full image URL
const imageUrl = getFileUrl(property, 'image.jpg');

// Get thumbnail (300x200)
const thumbUrl = getImageThumbnailUrl(property, 'image.jpg', '300x200');

// Get download URL
const downloadUrl = getFileDownloadUrl(property, 'document.pdf');
```

## Data Flow

### Creating Properties
1. User selects images in `ImagesUploadSection`
2. Files are stored as `File[]` in form state
3. On form submit, `File[]` is sent to PocketBase API
4. PocketBase stores files and returns string filenames
5. Filenames are saved in the `images` field

### Editing Properties
1. Existing images are loaded as string filenames
2. User can add new `File` objects or remove existing strings
3. Form submission handles mixed array of `File[]` and `string[]`
4. PocketBase processes updates with `+` and `-` modifiers

### Displaying Properties
1. Component receives property record with string filenames
2. `getFileUrl()` generates full URLs for display
3. `getImageThumbnailUrl()` generates optimized thumbnails
4. Images are displayed with Next.js Image component

## PocketBase Schema

The `properties` collection has these image-related fields:

```typescript
interface PropertiesResponse {
  image_url: string;           // Primary/featured image filename
  images: string[];            // Gallery image filenames
  video_url: string;           // Video URL (external)
  virtual_tour_url: string;    // Virtual tour URL (external)
}
```

## Benefits of Migration

1. **Simplified Architecture**: Single backend for data and files
2. **Built-in Thumbnails**: Automatic thumbnail generation
3. **Better Performance**: Optimized file serving
4. **Easier Deployment**: No separate file storage configuration
5. **Type Safety**: Full TypeScript support
6. **Cost Effective**: No separate cloud storage costs

## Usage Examples

### Basic Property Listing
```tsx
import { PropertyCard } from '@/components/property/list/PropertyCard';

function PropertyList({ properties }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
```

### Property Detail Page
```tsx
import { PropertyImageGallery } from '@/components/property/list/PropertyImageGallery';

function PropertyDetail({ property }) {
  return (
    <div>
      <PropertyImageGallery property={property} />
      {/* Other property details */}
    </div>
  );
}
```

### Property Form
```tsx
import { ImagesUploadSection } from '@/components/property/form/files/ImagesUploadSection';

function PropertyForm({ property }) {
  return (
    <form>
      {/* Other form fields */}
      <ImagesUploadSection 
        control={control}
        existingProperty={property} // For edit mode
      />
    </form>
  );
}
```

## Migration Notes

- Old R2/AWS upload components have been replaced
- Image URLs now use PocketBase file serving
- All components handle both File and string types
- Thumbnails are automatically generated by PocketBase
- File validation is handled at the component level
- Error handling includes file size and type validation

The migration is complete and all image functionality now uses PocketBase exclusively.
