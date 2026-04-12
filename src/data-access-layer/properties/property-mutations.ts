import type { PropertiesCreate, PropertiesUpdate } from "@/types/domain-types";
import { mutationOptions } from "@tanstack/react-query";
import {
  createProperty,
  updateProperty,
  deleteProperty,
} from "../actions/property-actions";

export const createPropertyMutationOptions = mutationOptions({
  mutationFn: async (data: PropertiesCreate & { id?: string }) => {
    const result = await createProperty(data);
    if (!result.success) {
      return { record: null, success: false, message: result.message, code: "property/create-failed" };
    }
    return { record: result.data.record, success: true, message: "Property created successfully" };
  },
});

export const updatePropertyMutationOptions = mutationOptions({
  mutationFn: async (data: PropertiesUpdate & { id: string }) => {
    if (!data.id) {
      return { record: null, success: false, message: "Property ID is required for update", code: "property/update-failed" };
    }
    const result = await updateProperty(data);
    if (!result.success) {
      return { record: null, success: false, message: result.message, code: "property/update-failed" };
    }
    return { record: result.data.record, success: true, message: "Property updated successfully" };
  },
});

export const deletePropertyMutationOptions = mutationOptions({
  mutationFn: async (id: string) => {
    const result = await deleteProperty(id);
    if (!result.success) {
      return { record: null, success: false, message: result.message, code: "property/delete-failed" };
    }
    return { record: null, success: true, message: "Property deleted successfully" };
  },
});
