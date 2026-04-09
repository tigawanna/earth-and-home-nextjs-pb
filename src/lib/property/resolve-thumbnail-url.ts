import type { PropertiesResponse } from "@/lib/pocketbase/types/pb-types";
import { getImageThumbnailUrl } from "@/lib/pocketbase/utils/files";

export function resolvePropertyThumbnailUrl(
  property: PropertiesResponse,
  filenameOrUrl: string,
  thumbSize = "400x300",
): string {
  if (filenameOrUrl.startsWith("http://") || filenameOrUrl.startsWith("https://")) {
    return filenameOrUrl;
  }
  return getImageThumbnailUrl(property, filenameOrUrl, thumbSize);
}
