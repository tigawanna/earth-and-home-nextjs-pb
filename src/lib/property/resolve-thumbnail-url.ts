import type { PropertiesResponse } from "@/types/domain-types";

function getR2PublicBase(): string {
  return process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.trim().replace(/\/+$/, "") ?? "";
}

export function normalizeStoredPropertyImagePath(ref: string): string {
  const t = ref.trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) {
    try {
      const p = new URL(t).pathname.replace(/\/+/g, "/");
      return p.startsWith("/properties/") ? p : t;
    } catch {
      return "";
    }
  }
  const p = (t.startsWith("/") ? t : `/${t}`).replace(/\/+/g, "/");
  return p.startsWith("/properties/") ? p : "";
}

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
  const path = normalizeStoredPropertyImagePath(trimmed);
  if (!path) {
    return "/apple-icon.png";
  }
  const base = getR2PublicBase();
  if (!base) {
    return path;
  }
  return `${base}${path}`;
}

export function normalizeStoredPropertyImageUrl(ref: string): string {
  return normalizeStoredPropertyImagePath(ref);
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
