import { browserPB } from '../clients/browser-client';

// Cache for file URLs to avoid regenerating the same URLs
const fileUrlCache = new Map<string, string>();

/**
 * Generate a file URL for a PocketBase record file
 * @param record The record containing the file
 * @param filename The filename from the file field
 * @param queryParams Optional query parameters (thumb, download, etc.)
 * @returns Full URL to the file
 */
export function getFileUrl(
  record: { id: string; collectionId: string; collectionName: string },
  filename: string,
  queryParams?: { thumb?: string; download?: boolean; token?: string }
): string {
  // Create cache key
  const cacheKey = `${record.collectionName}-${record.id}-${filename}-${JSON.stringify(queryParams || {})}`;
  
  // Check cache first
  if (fileUrlCache.has(cacheKey)) {
    return fileUrlCache.get(cacheKey)!;
  }
  
  // console.log("Generating file URL for:", record.id, filename, queryParams);
  const fileUrl = browserPB.files.getURL(record, filename, queryParams);
  
  // Cache the URL for future use
  fileUrlCache.set(cacheKey, fileUrl);

  return fileUrl;
}


/**
 * Generate a thumbnail URL for an image file
 * @param record The record containing the file
 * @param filename The filename from the file field
 * @param thumbSize Thumbnail size (e.g., "100x100", "200x0", "0x150")
 * @returns Full URL to the thumbnail
 */
export function getImageThumbnailUrl(
  record: { id: string; collectionId: string; collectionName: string },
  filename: string,
  thumbSize: string = "300x200"
): string {
  return getFileUrl(record, filename, { thumb: thumbSize });
}

/**
 * Generate a download URL for a file
 * @param record The record containing the file
 * @param filename The filename from the file field
 * @returns Full URL with download=1 parameter
 */
export function getFileDownloadUrl(
  record: { id: string; collectionId: string; collectionName: string },
  filename: string
): string {
  return getFileUrl(record, filename, { download: true });
}
