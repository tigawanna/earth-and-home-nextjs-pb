import PocketBase from 'pocketbase';

let singletonClient: PocketBase | null = null;

export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_POCKETBASE_API_URL;
  if (!url) {
    throw new Error('Pocketbase API url not defined !');
  }

  const createNewClient = () => new PocketBase(url);

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
