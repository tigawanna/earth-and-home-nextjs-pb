const R2_BASE = (
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.trim().replace(/\/+$/, "") ?? ""
);

export function isValidStoredImagePath(path: string): boolean {
  return path.startsWith("/properties/") && !path.includes("..");
}

export function storedPathToPublicUrl(storedPath: string): string {
  if (!storedPath) return "";
  if (storedPath.startsWith("http://") || storedPath.startsWith("https://")) {
    return storedPath;
  }
  if (!R2_BASE) return storedPath;
  return `${R2_BASE}${storedPath}`;
}

export function sanitizeStoredPath(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const pathname = new URL(trimmed).pathname;
      return isValidStoredImagePath(pathname) ? pathname : "";
    } catch {
      return "";
    }
  }
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return isValidStoredImagePath(path) ? path : "";
}
