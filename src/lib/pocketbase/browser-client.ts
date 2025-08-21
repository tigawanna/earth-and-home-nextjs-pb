import { TypedPocketBase } from "@tigawanna/typed-pocketbase";
import { Schema } from "./types/pb-types";

let singletonClient: TypedPocketBase<Schema> | null = null;

// export const _pb = new TypedPocketBase<Schema>(process.env.NEXT_PUBLIC_PB_URL);

export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_PB_URL;
  if (!url) {
    throw new Error("Pocketbase API url not defined !");
  }

  const createNewClient = () => new TypedPocketBase<Schema>(url)

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


// const cookie = pb_auth:"%7B%22token%22%3A%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJfcGJfdXNlcnNfYXV0aF8iLCJleHAiOjE3NTYzNjMxMDgsImlkIjoiaWQ1cW9iZjB0eWg0YnhuIiwicmVmcmVzaGFibGUiOnRydWUsInR5cGUiOiJhdXRoIn0.WzDszBNAXBTgfZzVPNcPZCm0A6vxld7sST9Zte5LnJ8%22%2C%22record%22%3A%7B%22avatar%22%3A%22%22%2C%22collectionId%22%3A%22_pb_users_auth_%22%2C%22collectionName%22%3A%22users%22%2C%22created%22%3A%222025-08-21%2006%3A37%3A54.018Z%22%2C%22email%22%3A%22user1%40email.com%22%2C%22emailVisibility%22%3Afalse%2C%22id%22%3A%22id5qobf0tyh4bxn%22%2C%22is_admin%22%3Afalse%2C%22is_banned%22%3Afalse%2C%22name%22%3A%22%22%2C%22updated%22%3A%222025-08-21%2006%3A37%3A54.018Z%22%2C%22verified%22%3Afalse%7D%7D"
