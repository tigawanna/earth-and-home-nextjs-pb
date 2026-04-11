import type { PropertiesResponse } from "@/types/domain-types";

export function resolvePropertyThumbnailUrl(
  _property: PropertiesResponse,
  filenameOrUrl: string,
  _thumbSize = "400x300",
): string {
  if (!filenameOrUrl) {
    return "/apple-icon.png";
  }
  const trimmed = filenameOrUrl.trim();
  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
    return trimmed;
  }
  return trimmed || "/apple-icon.png";
}

export function normalizeStoredPropertyImageUrl(ref: string): string {
  if (!ref?.trim()) return ref;
  return resolvePropertyThumbnailUrl({} as PropertiesResponse, ref.trim());
}

export function getPrimaryDisplayImageUrl(
  property: PropertiesResponse,
  thumbSize = "400x300",
): string | null {
  const parts = [
    property.image_url,
    ...(Array.isArray(property.images) ? property.images : []),
  ];
  const seen = new Set<string>();
  for (const item of parts) {
    if (typeof item !== "string") continue;
    const raw = item.trim();
    if (!raw || seen.has(raw)) continue;
    seen.add(raw);
    const u = resolvePropertyThumbnailUrl(property, raw, thumbSize);
    if (u && u !== "/apple-icon.png") return u;
  }
  return null;
}
