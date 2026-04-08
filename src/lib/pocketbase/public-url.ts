const DEFAULT_POCKETBASE_URL = "http://127.0.0.1:8090";

export function getPublicPocketBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_PB_URL;
  if (!raw || raw.trim() === "") {
    return DEFAULT_POCKETBASE_URL;
  }
  return raw.replace(/\/$/, "");
}
