import type { PropertiesResponse } from "@/types/domain-types";

export function resolvePropertyThumbnailUrl(
  _property: PropertiesResponse,
  filenameOrUrl: string,
  _thumbSize = "400x300",
): string {
  if (filenameOrUrl.startsWith("http://") || filenameOrUrl.startsWith("https://")) {
    return filenameOrUrl;
  }
  return filenameOrUrl || "/apple-icon.png";
}
