import { TypedPocketBase } from "@tigawanna/typed-pocketbase";
import { getPublicPocketBaseUrl } from "../public-url";
import { Schema } from "../types/pb-types";

let singletonClient: TypedPocketBase<Schema> | null = null;

export function createBrowserClient() {
  const url = getPublicPocketBaseUrl();

  const createNewClient = () => new TypedPocketBase<Schema>(url);

  const _client = singletonClient ?? createNewClient();
  if (typeof window === "undefined") return _client;

  _client.authStore.loadFromCookie(document.cookie);
  if (!singletonClient) singletonClient = _client;

  singletonClient.authStore.onChange(() => {
    // exportToCookie returns a cookie string (e.g. "pb_auth=...; Path=/; ...").
    // We set document.cookie so the cookie is available to server requests.
    document.cookie = singletonClient!.authStore.exportToCookie({ httpOnly: false });
  });

  return singletonClient;
}

export const browserPB = createBrowserClient();
