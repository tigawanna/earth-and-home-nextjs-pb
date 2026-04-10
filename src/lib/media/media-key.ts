export function isSafeMediaObjectKey(key: string): boolean {
  if (!key.startsWith("properties/")) return false;
  if (key.includes("..") || key.includes("\\")) return false;
  return true;
}
