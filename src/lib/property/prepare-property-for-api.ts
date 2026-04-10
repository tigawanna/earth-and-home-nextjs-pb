import type { PropertyFormData } from "@/components/property/form/property-form-schema";
import { normalizeStoredPropertyImageUrl } from "@/lib/property/resolve-thumbnail-url";
import type { PropertiesCreate, PropertiesUpdate } from "@/types/domain-types";

export function preparePropertyFormForApi(
  values: PropertyFormData,
): PropertiesCreate | PropertiesUpdate {
  const rawImages = values.images ?? [];
  const urls = rawImages
    .filter((i): i is string => typeof i === "string")
    .map(normalizeStoredPropertyImageUrl);

  const maxIdx = Math.max(0, urls.length - 1);
  const featuredIdx = Math.min(Math.max(0, values.featured_image_index ?? 0), maxIdx);
  const rawFeatured = urls[featuredIdx] ?? urls[0] ?? values.image_url ?? "";
  const featuredUrl = rawFeatured.trim()
    ? normalizeStoredPropertyImageUrl(rawFeatured.trim())
    : "";

  const { images: _img, featured_image_index: _fi, ...rest } = values;

  return {
    ...rest,
    images: urls.length > 0 ? urls : undefined,
    image_url: featuredUrl || undefined,
  } as PropertiesCreate | PropertiesUpdate;
}
