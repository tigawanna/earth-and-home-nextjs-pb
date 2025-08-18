# PocketBase Images Upload Component

A React component for uploading and managing images using PocketBase file handling. This component handles both new file uploads (File objects) and existing images (string filenames).

## Features

- **File Upload**: Drag & drop or click to select multiple images
- **File Validation**: Checks file type and size limits
- **Image Preview**: Shows thumbnails for both new and existing images
- **Featured Image**: Mark one image as featured
- **Remove Images**: Remove individual images
- **PocketBase Integration**: Works with PocketBase file fields

## Usage

```tsx
import { PocketBaseImagesUpload } from '@/components/property/form/PocketBaseImagesUpload';
import { useForm } from 'react-hook-form';

interface PropertyFormData {
  images: (File | string)[];
  // ... other fields
}

function PropertyForm() {
  const { control } = useForm<PropertyFormData>();
  
  // For existing property (editing)
  const existingProperty = {
    id: "property_record_id",
    collectionId: "properties_collection_id", 
    collectionName: "properties",
    images: ["filename1.jpg", "filename2.png"] // existing filenames
  };
  
  return (
    <form>
      <PocketBaseImagesUpload
        control={control}
        propertyTitle="My Property"
        existingProperty={existingProperty} // Optional, for editing
      />
    </form>
  );
}
```

## How it works with PocketBase

### Creating a new property
When creating a new property, the `images` field will contain `File[]` objects:

```ts
const formData = new FormData();
formData.append('title', 'My Property');

// Files are automatically handled by PocketBase
images.forEach(file => {
  if (file instanceof File) {
    formData.append('images', file);
  }
});

await pb.collection('properties').create(formData);
```

### Updating an existing property
When updating, you can mix existing filenames with new files:

```ts
const formData = new FormData();

// Keep existing images and add new ones
images.forEach(item => {
  if (item instanceof File) {
    formData.append('images+', item); // + means append
  }
});

// To remove specific images, use the - suffix:
// formData.append('images-', ['old_filename.jpg']);

await pb.collection('properties').update(recordId, formData);
```

### Getting image URLs
Use the helper functions from `@/lib/pocketbase/files`:

```ts
import { getImageThumbnailUrl, getFileUrl } from '@/lib/pocketbase/files';

// For thumbnails
const thumbUrl = getImageThumbnailUrl(property, 'filename.jpg', '300x200');

// For full size
const fullUrl = getFileUrl(property, 'filename.jpg');
```

## Component Props

```ts
interface PocketBaseImagesUploadProps {
  control: Control<PropertyFormData>;
  propertyTitle: string;
  existingProperty?: {
    id: string;
    collectionId: string; 
    collectionName: string;
    images?: string[];
  };
}
```

## File Validation

- **Supported formats**: JPEG, PNG, WebP, GIF
- **Maximum file size**: 5MB per image
- **Multiple files**: Unlimited (within PocketBase limits)

## Tips

1. For new properties, don't pass `existingProperty`
2. For editing, pass the existing property record to show current images
3. The component handles both File objects and string filenames seamlessly
4. Use FormData when submitting to preserve file uploads
5. PocketBase automatically handles file storage and URL generation
