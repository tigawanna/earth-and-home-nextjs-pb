/**
 * Documentation: PocketBase File URL Utilities Refactoring
 * 
 * This document explains the refactoring of PocketBase file URL generation
 * from SDK-based to manual URL construction for improved reliability.
 */

# PocketBase File URL Generation Refactoring

## Overview

The PocketBase file URL utilities have been refactored to use manual URL construction instead of relying on the PocketBase SDK's `getURL` method. This approach follows the official PocketBase documentation recommendations and provides more reliable file URL generation.

## Changes Made

### 1. Manual URL Construction

**Before:**
```typescript
const fileUrl = browserPB.files.getURL(record, filename, queryParams);
```

**After:**
```typescript
const baseUrl = getPocketBaseUrl();
const collection = record.collectionName || record.collectionId;
let fileUrl = `${baseUrl}/api/files/${collection}/${record.id}/${filename}`;
```

### 2. Enhanced Type Safety

- Added `RecordWithFiles` interface for better type checking
- Added `FileUrlParams` interface for query parameters
- Improved TypeScript definitions throughout

### 3. New Utility Functions

- `getProtectedFileUrl()` - For files requiring authentication tokens
- `getMultipleFileUrls()` - Generate URLs for multiple files at once
- `getFirstFileUrl()` - Get URL for the first file in a field (handles arrays)

## URL Format

The manual URL construction follows the official PocketBase format:

```
/api/files/{collectionName}/{recordId}/{filename}?param=value
```

### Supported Query Parameters

- `thumb` - Generate thumbnails (e.g., "100x100", "200x0", "0x150")
- `download` - Force download with Content-Disposition: attachment
- `token` - Access token for protected files

## Usage Examples

### Basic File URL
```typescript
import { getFileUrl } from '@/lib/pocketbase/utils/files';

const imageUrl = getFileUrl(property, 'photo.jpg');
// Result: https://api.example.com/api/files/properties/abc123/photo.jpg
```

### Thumbnail Generation
```typescript
import { getImageThumbnailUrl } from '@/lib/pocketbase/utils/files';

const thumbnailUrl = getImageThumbnailUrl(property, 'photo.jpg', '200x150');
// Result: https://api.example.com/api/files/properties/abc123/photo.jpg?thumb=200x150
```

### Protected Files
```typescript
import { getProtectedFileUrl } from '@/lib/pocketbase/utils/files';

const protectedUrl = getProtectedFileUrl(property, 'document.pdf', token);
// Result: https://api.example.com/api/files/properties/abc123/document.pdf?token=xyz
```

### Multiple Files
```typescript
import { getMultipleFileUrls } from '@/lib/pocketbase/utils/files';

const urls = getMultipleFileUrls(property, ['image1.jpg', 'image2.jpg']);
// Result: Array of full URLs
```

## Benefits

1. **Reliability** - Manual construction ensures consistent URL format
2. **Performance** - No dependency on PocketBase client initialization
3. **Flexibility** - Full control over URL parameters and formatting
4. **Type Safety** - Better TypeScript support and error catching
5. **Documentation** - Clear understanding of URL structure

## Migration Guide

No changes are required for existing code. The API remains the same:

```typescript
// This still works exactly the same
const url = getFileUrl(record, filename, { thumb: '100x100' });
```

The only difference is the internal implementation now uses manual URL construction instead of the PocketBase SDK method.

## Environment Requirements

Ensure `NEXT_PUBLIC_PB_URL` is set in your environment variables:

```env
NEXT_PUBLIC_PB_URL=https://your-pocketbase-api.com
```

## References

- [PocketBase Files API Documentation](https://pocketbase.io/docs/api-files)
- [PocketBase File Handling Guide](https://pocketbase.io/docs/files-handling)
