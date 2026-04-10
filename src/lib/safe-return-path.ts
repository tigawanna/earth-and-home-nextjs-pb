export function getSafeDashboardReturnPath(value: string | null | undefined): string | null {
  if (value == null || typeof value !== "string") return null;
  const t = value.trim();
  if (t === "" || !t.startsWith("/dashboard") || t.startsWith("//")) return null;
  if (/[\r\n]/.test(t)) return null;
  return t;
}
