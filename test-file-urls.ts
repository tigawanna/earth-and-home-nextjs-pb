/**
 * Test file for PocketBase file URL utilities
 * Run with: node -r esbuild-register test-file-urls.ts
 */

// Mock environment variable
process.env.NEXT_PUBLIC_PB_URL = 'https://test.pocketbase.io';

import {
    getFileDownloadUrl,
    getFileUrl,
    getFirstFileUrl,
    getImageThumbnailUrl,
    getMultipleFileUrls,
    getProtectedFileUrl,
    type RecordWithFiles
} from '../src/lib/pocketbase/utils/files';

// Mock property record
const mockProperty: RecordWithFiles = {
  id: 'abc123def456',
  collectionId: 'properties_collection',
  collectionName: 'properties'
};

// Test basic file URL generation
console.log('=== Basic File URL Tests ===');

const basicUrl = getFileUrl(mockProperty, 'house.jpg');
console.log('Basic URL:', basicUrl);
// Expected: https://test.pocketbase.io/api/files/properties/abc123def456/house.jpg

// Test thumbnail generation
console.log('\n=== Thumbnail URL Tests ===');

const thumbnailUrl = getImageThumbnailUrl(mockProperty, 'house.jpg', '300x200');
console.log('Thumbnail URL:', thumbnailUrl);
// Expected: https://test.pocketbase.io/api/files/properties/abc123def456/house.jpg?thumb=300x200

const defaultThumbnailUrl = getImageThumbnailUrl(mockProperty, 'house.jpg');
console.log('Default Thumbnail URL:', defaultThumbnailUrl);
// Expected: https://test.pocketbase.io/api/files/properties/abc123def456/house.jpg?thumb=300x200

// Test download URL
console.log('\n=== Download URL Tests ===');

const downloadUrl = getFileDownloadUrl(mockProperty, 'document.pdf');
console.log('Download URL:', downloadUrl);
// Expected: https://test.pocketbase.io/api/files/properties/abc123def456/document.pdf?download=1

// Test protected file URL
console.log('\n=== Protected File URL Tests ===');

const protectedUrl = getProtectedFileUrl(mockProperty, 'private.pdf', 'token123', { thumb: '100x100' });
console.log('Protected URL:', protectedUrl);
// Expected: https://test.pocketbase.io/api/files/properties/abc123def456/private.pdf?thumb=100x100&token=token123

// Test multiple file URLs
console.log('\n=== Multiple File URL Tests ===');

const multipleUrls = getMultipleFileUrls(mockProperty, ['image1.jpg', 'image2.jpg', 'image3.jpg']);
console.log('Multiple URLs:', multipleUrls);

// Test first file URL
console.log('\n=== First File URL Tests ===');

const firstFromArray = getFirstFileUrl(mockProperty, ['first.jpg', 'second.jpg']);
console.log('First from array:', firstFromArray);

const firstFromString = getFirstFileUrl(mockProperty, 'single.jpg');
console.log('First from string:', firstFromString);

const firstFromEmpty = getFirstFileUrl(mockProperty, null);
console.log('First from null:', firstFromEmpty);

const firstFromEmptyArray = getFirstFileUrl(mockProperty, []);
console.log('First from empty array:', firstFromEmptyArray);

// Test edge cases
console.log('\n=== Edge Case Tests ===');

const emptyFilename = getFileUrl(mockProperty, '');
console.log('Empty filename:', emptyFilename);
// Expected: '' (empty string)

const complexParams = getFileUrl(mockProperty, 'test.jpg', {
  thumb: '400x300',
  download: true,
  token: 'abc123'
});
console.log('Complex params:', complexParams);
// Expected: https://test.pocketbase.io/api/files/properties/abc123def456/test.jpg?thumb=400x300&download=1&token=abc123

console.log('\n=== All Tests Complete ===');
