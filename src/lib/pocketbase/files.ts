import { createBrowserClient } from './browser-client';

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
  const pb = createBrowserClient();
  return pb.files.getURL(record, filename, queryParams);
}

/**
 * Generate file URLs for multiple files
 * @param record The record containing the files
 * @param filenames Array of filenames from the file field
 * @param queryParams Optional query parameters (thumb, download, etc.)
 * @returns Array of full URLs to the files
 */
export function getFileUrls(
  record: { id: string; collectionId: string; collectionName: string },
  filenames: string[],
  queryParams?: { thumb?: string; download?: boolean; token?: string }
): string[] {
  return filenames.map(filename => getFileUrl(record, filename, queryParams));
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
