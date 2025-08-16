"use server";

import { s3Client } from "../../lib/cloudflare/r2/r2";
import { DeleteObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { serverEnvs } from "@/lib/envs/server-env";

/**
 * Delete a single object from R2 bucket
 */
export async function deleteObject(objectKey: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: serverEnvs.R2_BUCKET_NAME,
      Key: objectKey,
    });

    await s3Client.send(command);
    
    return { success: true, message: "Object deleted successfully" };
  } catch (error) {
    console.error("Error deleting object:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to delete object" 
    };
  }
}

/**
 * Delete all objects with a specific prefix from R2 bucket
 */
export async function deleteObjectsByPrefix(prefix: string) {
  try {
    // First, list all objects with the prefix
    const listCommand = new ListObjectsV2Command({
      Bucket: serverEnvs.R2_BUCKET_NAME,
      Prefix: prefix,
    });

    const listResponse = await s3Client.send(listCommand);
    
    if (!listResponse.Contents || listResponse.Contents.length === 0) {
      return { 
        success: true, 
        message: "No objects found with the specified prefix",
        deletedCount: 0 
      };
    }

    // Prepare objects for batch deletion (max 1000 objects per request)
    const objectsToDelete = listResponse.Contents.map(obj => ({ Key: obj.Key! }));
    
    // Split into chunks of 1000 (AWS S3/R2 limit)
    const chunks = [];
    for (let i = 0; i < objectsToDelete.length; i += 1000) {
      chunks.push(objectsToDelete.slice(i, i + 1000));
    }

    let totalDeleted = 0;

    // Delete each chunk
    for (const chunk of chunks) {
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: serverEnvs.R2_BUCKET_NAME,
        Delete: {
          Objects: chunk,
          Quiet: true, // Don't return details about each deleted object
        },
      });

      const deleteResponse = await s3Client.send(deleteCommand);
      totalDeleted += chunk.length;

      // Log any errors from the batch delete
      if (deleteResponse.Errors && deleteResponse.Errors.length > 0) {
        console.error("Some objects failed to delete:", deleteResponse.Errors);
      }
    }

    return { 
      success: true, 
      message: `Successfully deleted ${totalDeleted} objects with prefix "${prefix}"`,
      deletedCount: totalDeleted 
    };

  } catch (error) {
    console.error("Error deleting objects by prefix:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to delete objects",
      deletedCount: 0 
    };
  }
}

/**
 * Delete all images for a specific property
 */
export async function deletePropertyImages(propertyTitle: string) {
  const prefix = `properties/${propertyTitle}/`;
  return await deleteObjectsByPrefix(prefix);
}

/**
 * Delete all documents for a specific property
 */
export async function deletePropertyDocuments(propertyTitle: string) {
  const prefix = `documents/${propertyTitle}/`;
  return await deleteObjectsByPrefix(prefix);
}

/**
 * Delete all files (images + documents) for a specific property
 */
export async function deleteAllPropertyFiles(propertyTitle: string) {
  try {
    const [imagesResult, documentsResult] = await Promise.all([
      deletePropertyImages(propertyTitle),
      deletePropertyDocuments(propertyTitle)
    ]);

    const totalDeleted = (imagesResult.deletedCount || 0) + (documentsResult.deletedCount || 0);
    
    if (imagesResult.success && documentsResult.success) {
      return {
        success: true,
        message: `Successfully deleted ${totalDeleted} files for property "${propertyTitle}"`,
        deletedCount: totalDeleted,
        details: {
          images: imagesResult.deletedCount || 0,
          documents: documentsResult.deletedCount || 0
        }
      };
    } else {
      return {
        success: false,
        message: "Some files failed to delete",
        deletedCount: totalDeleted,
        errors: {
          images: !imagesResult.success ? imagesResult.message : null,
          documents: !documentsResult.success ? documentsResult.message : null
        }
      };
    }
  } catch (error) {
    console.error("Error deleting all property files:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to delete property files",
      deletedCount: 0 
    };
  }
}
