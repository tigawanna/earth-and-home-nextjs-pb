import { TypedPocketBase } from '@tigawanna/typed-pocketbase';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { Schema } from '../types/pb-types';

export function createServerClient(cookieStore?: ReadonlyRequestCookies) {
  const url = process.env.NEXT_PUBLIC_PB_URL;
  if (!url) {
    throw new Error('Pocketbase API url not defined !');
  }

  if (typeof window !== 'undefined') {
    throw new Error('This method is only supposed to call from the Server environment');
  }

  const client = new TypedPocketBase<Schema>(url);

  if (cookieStore) {
    const authCookie = cookieStore.get('pb_auth');

    if (authCookie) {
      // loadFromCookie expects a cookie string like "pb_auth=<value>"
      client.authStore.loadFromCookie(`${authCookie.name}=${authCookie.value}`);
    }
  }

  return client;
}
