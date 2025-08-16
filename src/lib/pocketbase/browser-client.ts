import {TypedPocketBase} from "@tigawanna/typed-pocketbase"
import { Schema } from "./types/pb-types";

let singletonClient: TypedPocketBase<Schema> | null = null;

export function createBrowserClient() {
  const url = process.env.NEXT_PB_URL;
  if (!url) {
    throw new Error('Pocketbase API url not defined !');
  }

  const createNewClient = () => new TypedPocketBase(url);

  const _client = singletonClient ?? createNewClient();

  if (typeof window === 'undefined') return _client;

  if (!singletonClient) singletonClient = _client;

  singletonClient.authStore.onChange(() => {
    // exportToCookie returns a cookie string (e.g. "pb_auth=...; Path=/; ...").
    // We set document.cookie so the cookie is available to server requests.
    document.cookie = singletonClient!.authStore.exportToCookie({ httpOnly: false });
  });

  return singletonClient;
}
