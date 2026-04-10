import type { PropertiesResponse } from "@/types/domain-types";

function tryPublicMediaUrlToProxy(src: string): string | null {
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/+$/, "");
  if (base && src.startsWith(`${base}/`)) {
    const rest = src.slice(base.length + 1);
    const segments = rest.split("/").filter(Boolean);
    if (segments.length > 0 && segments[0] === "properties") {
      return `/api/media/${segments.map(encodeURIComponent).join("/")}`;
    }
  }
  try {
    const u = new URL(src);
    if (!u.hostname.endsWith(".r2.dev")) return null;
    const segments = u.pathname.split("/").filter(Boolean);
    if (segments.length > 0 && segments[0] === "properties") {
      return `/api/media/${segments.map(encodeURIComponent).join("/")}`;
    }
  } catch {
    return null;
  }
  return null;
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
    const proxy = tryPublicMediaUrlToProxy(trimmed);
    if (proxy) return proxy;
    return trimmed;
  }
  if (trimmed.startsWith("/api/media/")) {
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
  const candidates: string[] = [];
  const push = (s: string | null | undefined) => {
    const t = typeof s === "string" ? s.trim() : "";
    if (t) candidates.push(t);
  };
  push(property.image_url);
  if (Array.isArray(property.images)) {
    for (const img of property.images) {
      push(typeof img === "string" ? img : null);
    }
  }
  const seen = new Set<string>();
  for (const raw of candidates) {
    if (seen.has(raw)) continue;
    seen.add(raw);
    const u = resolvePropertyThumbnailUrl(property, raw, thumbSize);
    if (u && u !== "/apple-icon.png") return u;
  }
  return null;
}
