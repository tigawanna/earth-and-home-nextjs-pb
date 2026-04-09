import type { PropertiesCreate, PropertiesUpdate } from "@/types/domain-types";
import { mutationOptions } from "@tanstack/react-query";

export const createPropertyMutationOptions = mutationOptions({
  mutationFn: async (data: PropertiesCreate) => {
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { success: boolean; record?: unknown; message?: string };
      if (!res.ok || !json.success) {
        return {
          record: null,
          success: false,
          message: json.message ?? "Failed to create property",
          code: "property/create-failed",
        };
      }
      return {
        record: json.record,
        success: true,
        message: "Property created successfully",
      };
    } catch {
      return {
        record: null,
        success: false,
        message: "Failed to create property",
        code: "property/create-failed",
      };
    }
  },
});

export const updatePropertyMutationOptions = mutationOptions({
  mutationFn: async (data: PropertiesUpdate) => {
    try {
      if (!data.id) {
        throw new Error("Property ID is required for update");
      }
      const res = await fetch(`/api/properties/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { success: boolean; record?: unknown; message?: string };
      if (!res.ok || !json.success) {
        return {
          record: null,
          success: false,
          message: json.message ?? "Failed to update property",
          code: "property/update-failed",
        };
      }
      return {
        record: json.record ?? null,
        success: true,
        message: "Property updated successfully",
      };
    } catch {
      return {
        record: null,
        success: false,
        message: "Failed to update property",
        code: "property/update-failed",
      };
    }
  },
});

export const deletePropertyMutationOptions = mutationOptions({
  mutationFn: async (id: string) => {
    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      const json = (await res.json()) as { success: boolean; record?: unknown; message?: string };
      if (!res.ok || !json.success) {
        return {
          record: null,
          success: false,
          message: json.message ?? "Failed to delete property",
          code: "property/delete-failed",
        };
      }
      return {
        record: null,
        success: true,
        message: "Property deleted successfully",
      };
    } catch {
      return {
        record: null,
        success: false,
        message: "Failed to delete property",
        code: "property/delete-failed",
      };
    }
  },
});

export const deleteProperty = async (id: string) => {
  const result = await deletePropertyMutationOptions.mutationFn!(id);
  return result;
};
