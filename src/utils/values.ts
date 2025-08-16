export function emptyStringasNull(value: string | null | undefined): string | null {
  return (!value || value === "") ? null : value;
}
