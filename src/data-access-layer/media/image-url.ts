let _r2BaseCache: string | null = null;

export async function initR2Base(): Promise<void> {
  if (_r2BaseCache !== null) return;
  const fromEnv = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.trim().replace(/\/+$/, "");
  if (fromEnv) {
    _r2BaseCache = fromEnv;
    return;
  }
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    const cfVal = env.NEXT_PUBLIC_R2_PUBLIC_URL;
    if (cfVal) {
      _r2BaseCache = cfVal.trim().replace(/\/+$/, "");
      return;
    }
  } catch {
    // not running on Cloudflare Workers
  }
  _r2BaseCache = "";
}

function getR2Base(): string {
  if (_r2BaseCache !== null) return _r2BaseCache;
  return process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.trim().replace(/\/+$/, "") ?? "";
}

export function isValidStoredImagePath(path: string): boolean {
  return path.startsWith("/properties/") && !path.includes("..");
}

export function storedPathToPublicUrl(storedPath: string): string {
  if (!storedPath) return "";
  if (storedPath.startsWith("http://") || storedPath.startsWith("https://")) {
    return storedPath;
  }
  const base = getR2Base();
  if (!base) return storedPath;
  return `${base}${storedPath}`;
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
