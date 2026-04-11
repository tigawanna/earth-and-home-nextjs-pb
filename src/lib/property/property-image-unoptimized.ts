export function propertyImageNeedsUnoptimized(src: string): boolean {
  return src.includes(".r2.dev/");
}
