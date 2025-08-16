"use server";

import { PropertyFormData } from "@/components/property/form/property-form-schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/drizzle/client";
import { favorite, property } from "@/lib/drizzle/schema";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { deleteAllPropertyFiles } from "../r2/delete-object-action";


// ====================================================
// CREATE PROPERTY
// ====================================================

export async function createProperty(data: PropertyFormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id || session?.user?.role !== "admin") {
      return {
        success:false,
        message:"Not authorized"
      }
    }

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    // Create the property
    const [newProperty] = await db
      .insert(property)
      .values({
        ...data,
        slug: `${slug}-${Date.now()}`, // Add timestamp to ensure uniqueness
        agentId: session.user.id,
        ownerId: data.ownerId || session.user.id,
        lotSizeAcres: data.lotSizeAcres ? data.lotSizeAcres.toString() : null,
        locationGeom:
          data.latitude && data.longitude
            ? sql`ST_SetSRID(ST_MakePoint(${data.longitude}, ${data.latitude}), 4326)`
            : undefined,
      })
      .returning();

    revalidatePath("/dashboard/properties");
    revalidatePath("/properties");

    return {
      success: true,
      property: newProperty,
      message: "Property created successfully",
    };
  } catch (error) {
    console.error("Error creating property:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create property",
    };
  }
}

// ====================================================
// UPDATE PROPERTY
// ====================================================

export async function updateProperty(propertyId: string, data: Partial<PropertyFormData>) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Check if user owns the property or is admin
    const existingProperty = await db
      .select()
      .from(property)
      .where(eq(property.id, propertyId))
      .limit(1);

    if (!existingProperty.length) {
      throw new Error("Property not found");
    }

    const prop = existingProperty[0];
    if (
      session?.user?.role !== "admin" ||
      (prop.agentId !== session.user.id && prop.ownerId !== session.user.id)
    ) {
      throw new Error("You don't have permission to update this property");
    }

    // Update slug if title changed
    const updates: Record<string, any> = { ...data, updatedAt: new Date() };
    if (data.title && data.title !== prop.title) {
      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      updates.slug = `${slug}-${Date.now()}`;
    }

    // Convert lotSizeAcres to string if provided
    if (data.lotSizeAcres !== undefined) {
      updates.lotSizeAcres = data.lotSizeAcres ? data.lotSizeAcres.toString() : null;
    }

    // Update location geometry if coordinates changed
    if (data.latitude && data.longitude) {
      updates.locationGeom = sql`ST_SetSRID(ST_MakePoint(${data.longitude}, ${data.latitude}), 4326)`;
    }

    const [updatedProperty] = await db
      .update(property)
      .set(updates)
      .where(eq(property.id, propertyId))
      .returning();

    revalidatePath("/dashboard/properties");
    revalidatePath("/properties");
    revalidatePath(`/properties/${prop.slug}`);

    return {
      success: true,
      property: updatedProperty,
      message: "Property updated successfully",
    };
  } catch (error) {
    console.error("Error updating property:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update property",
    };
  }
}

// ====================================================
// DELETE PROPERTY
// ====================================================

export async function deleteProperty(propertyId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Check if user owns the property or is admin
    const existingProperty = await db
      .select()
      .from(property)
      .where(eq(property.id, propertyId))
      .limit(1);

    if (!existingProperty.length) {
      throw new Error("Property not found");
    }

    const prop = existingProperty[0];
    if (
      (prop.agentId !== session.user.id && prop.ownerId !== session.user.id) ||
      session?.user?.role !== "admin"
    ) {
      throw new Error("You don't have permission to delete this property");
    }

    // Delete associated files from R2 (if title exists)
    if (prop.title) {
      const propertyTitle = prop.title.replace(/\s+/g, "-").toLowerCase();
      await deleteAllPropertyFiles(propertyTitle);
    }

    // Delete the property (cascades to favorites)
    await db.delete(property).where(eq(property.id, propertyId));

    revalidatePath("/dashboard/favorites");
    revalidatePath("/dashboard/properties");
    revalidatePath(`/properties}`);
    revalidatePath(`/properties/${propertyId}`);

    return {
      success: true,
      message: "Property and associated files deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting property:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete property",
    };
  }
}

// ====================================================
// FAVORITE ACTIONS
// ====================================================

export async function toggleFavorite(propertyId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      throw new Error("You must be logged in to favorite properties");
    }

    const userId = session.user.id;

    // Check if already favorited
    const existing = await db
      .select()
      .from(favorite)
      .where(and(eq(favorite.userId, userId), eq(favorite.propertyId, propertyId)))
      .limit(1);

    if (existing.length > 0) {
      // Remove favorite
      await db
        .delete(favorite)
        .where(and(eq(favorite.userId, userId), eq(favorite.propertyId, propertyId)));

      revalidatePath("/dashboard/favorites");
      revalidatePath("/dashboard/properties");
      revalidatePath(`/properties}`);
      revalidatePath(`/properties/${propertyId}`);
      return { success: true, isFavorited: false, message: "Removed from favorites" };
    } else {
      // Add favorite
      await db.insert(favorite).values({
        userId,
        propertyId,
      });

      revalidatePath("/dashboard/favorites");
      revalidatePath("/dashboard/properties");
      revalidatePath(`/properties}`);
      revalidatePath(`/properties/${propertyId}`);
      return { success: true, isFavorited: true, message: "Added to favorites" };
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update favorite",
    };
  }
}
