import { browserPB } from "@/lib/pocketbase/clients/browser-client";
import { PropertiesCreate, PropertiesUpdate } from "@/lib/pocketbase/types/pb-types";
import { mutationOptions } from "@tanstack/react-query";

export const createPropertyMutationOptions = mutationOptions({
  mutationFn: async (data: PropertiesCreate) => {
    try {
      const res = await browserPB.from("properties").create(data);
      return {
        record: res,
        success: true,
        message: "Property created successfully",
      };
    } catch (error) {
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
      const res = await browserPB.from("properties").update(data.id, data);
      return {
        record: res ?? null,
        success: true,
        message: "Property updated successfully",
      };
    } catch (error) {
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
      const res = await browserPB.from("properties").delete(id);
      return {
        record: res ?? null,
        success: true,
        message: "Property deleted successfully",
      };
    } catch (error) {
      return {
        record: null,
        success: false,
        message: "Failed to delete property",
        code: "property/delete-failed",
      };
    }
  },
});

// For backwards compatibility
export const deleteProperty = async (id: string) => {
  const result = await deletePropertyMutationOptions.mutationFn!(id);
  return result;
};
