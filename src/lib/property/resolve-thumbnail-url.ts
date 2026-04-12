import { sanitizeStoredPath, storedPathToPublicUrl } from "@/data-access-layer/media/image-url";
import type { PropertiesResponse } from "@/types/domain-types";

const FALLBACK = "/apple-icon.png";

export function resolvePropertyThumbnailUrl(
  _property: PropertiesResponse,
  storedPath: string,
  _thumbSize?: string,
): string {
  const clean = sanitizeStoredPath(storedPath);
  if (!clean) return FALLBACK;
  return storedPathToPublicUrl(clean);
}

export function normalizeStoredPropertyImageUrl(ref: string): string {
  return sanitizeStoredPath(ref);
}

export function normalizeStoredPropertyImagePath(ref: string): string {
  return sanitizeStoredPath(ref);
}

export function getPrimaryDisplayImageUrl(
  property: PropertiesResponse,
  _thumbSize?: string,
): string | null {
  const candidates = [
    property.image_url,
    ...(Array.isArray(property.images) ? property.images : []),
  ];
  for (const item of candidates) {
    if (typeof item !== "string" || !item.trim()) continue;
    const url = resolvePropertyThumbnailUrl(property, item);
    if (url !== FALLBACK) return url;
  }
  return null;
}
