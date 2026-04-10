export function propertyImageNeedsUnoptimized(src: string): boolean {
  return src.startsWith("/api/media/") || src.includes(".r2.dev/");
}
