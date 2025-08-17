# PocketBase Client — Quick Reference

A concise reference for using the official PocketBase JavaScript SDK and the typed-pocketbase wrapper (`@tigawanna/typed-pocketbase`). The typed client provides stronger TypeScript safety and structured query builders (createFilter, createSort, createSelect) and uses `db.from('...')` instead of `pb.collection('...')`.

---

## Contents
- Overview
- Official SDK (pb.collection)
  - Installation
  - Common usage
  - Tips & caveats
- typed-pocketbase (db.from)
  - Why use it
  - Examples: select, filter, sort, expand
  - Helpers: createSelect, createFilter, createSort, batch
- Migration examples
- Best practices

---

## Overview

PocketBase exposes a small JS SDK for browser and Node environments. It provides record CRUD, file handling, authStore helpers, realtime, and collection management.

For TypeScript-first projects prefer the typed-pocketbase client which offers compile-time types for collections and safer query builders.

---

## Official PocketBase JS SDK (pb.collection)

### Installation

```bash
npm install pocketbase
```

### Basic usage

```js
import PocketBase from 'pocketbase';
const pb = new PocketBase('http://127.0.0.1:8090');

// authenticate
await pb.collection('users').authWithPassword(email, password);

// paginated list
const page = await pb.collection('properties').getList(1, 20, {
  filter: "city='Austin' && price > 100000",
  sort: '-created',
  expand: 'owner_id',
});

// get single
const rec = await pb.collection('properties').getOne('RECORD_ID', { expand: 'owner_id' });

// create / update / delete
await pb.collection('properties').create({ title: 'My prop', price: 100000 });
await pb.collection('properties').update('RECORD_ID', { price: 120000 });
await pb.collection('properties').delete('RECORD_ID');
```

### Helpful SDK features
- pb.filter(expr, params) — safely bind params into the filter string to avoid injection.
- getList/getFullList/getOne/getFirstListItem — record fetching helpers.
- pb.authStore — token + record store helpers (loadFromCookie / exportToCookie) for SSR flows.
- realtime subscriptions via pb.collection(...).subscribe(...).

### Caveats & tips
- Filters and expand/fields are string-based. When accepting untrusted input, use `pb.filter(expr, params)` to avoid injection.
- For SSR, create a new PocketBase instance per request and hydrate authStore from cookies:
  - `pb.authStore.loadFromCookie(cookieString)`
  - after actions: `res.setHeader('set-cookie', pb.authStore.exportToCookie())`
- File uploads accept `FormData` or plain objects with `File`/`Blob` fields.
- Use `pb.autoCancellation(false)` to disable auto-cancel of duplicate requests if desired.

---

## typed-pocketbase (@tigawanna/typed-pocketbase) — preferred for TypeScript

Why use typed-pocketbase?
- Strongly-typed collection/record models (you can generate `pb-types.ts`).
- Structured query builders (no ad-hoc filter strings).
- Cleaner selects/expands with compile-time checks.
- Use `.from('collection')` instead of `.collection('collection')`.

### Installation

```bash
npm install @tigawanna/typed-pocketbase
```

### Basic typed usage

```ts
import { createClient } from '@tigawanna/typed-pocketbase';
const db = createClient({ baseURL: 'http://127.0.0.1:8090' });
```

### Selecting fields and expanding relations

```ts
await db.from('properties').getFullList({
  select: {
    id: true,
    title: true,
    price: true,
    expand: {
      owner_id: { name: true, email: true }
    }
  }
});
```

### Filtering with helpers (no string filters)

```ts
import { and, or, eq, gt, lt } from '@tigawanna/typed-pocketbase';

// city = 'Austin' AND price > 100000
await db.from('properties').getList(1, 30, {
  filter: and(eq('city', 'Austin'), gt('price', 100000))
});

// combine helpers
await db.from('posts').getFullList({
  filter: or(['published', '=', true], eq('author.name', 'me'))
});
```

Relation fields are supported (PocketBase supports up to 6 levels of expands).

### Sorting

```ts
await db.from('posts').getFullList({ sort: ['-date', '+title'] });
```

### createSelect / createFilter / createSort helpers

```ts
const select = db.from('posts').createSelect({
  id: true,
  title: true,
  expand: {
    owner: { name: true, avatar: true },
    comments_via_post: true
  }
});

const filter = db.from('posts').createFilter(or(eq('content', 'hello'), eq('published', true)));
const sort = db.from('posts').createSort('-created', '+title');

await db.from('posts').getList(1, 20, { select, filter, sort });
```

### Batch APIs

```ts
const batch = db.fromBatch();
batch.from('users').create({ ... });
batch.from('posts').update('recordId', { ... });
await batch.send();
```

### Impersonate (admin)

```ts
const impersonated = await db.impersonate('_superusers', 'user_id_to_impersonate', 3600);
await impersonated.from('posts').create({ ... });
```

### Expand & fetch helpers (typed-pocketbase examples)

Below are concrete typed-pocketbase examples using `client.from(...)` (aka `db.from(...)`) that demonstrate expanding relations and different fetch helpers.

```ts
// a typed client alias (you may have `db` or `client` in your code)
const client = db; // or: const client = createClient({...})

// 1) getOne with expanded relations
// This will include expanded records under `expand` in the returned record
const favorite = await client.from('favorites').getOne('ITEM_ID', {
  select: {
    // select everything and expand the relation fields
    expand: {
      property_id: true, // expands the related property record
      user_id: true,     // expands the related user record
    }
  }
});

// Result shape (simplified):
// {
//   id: '...',
//   user_id: 'user_record_id',
//   property_id: 'property_record_id',
//   ...other_fields,
//   expand: {
//     property_id: { ...property_fields },
//     user_id: { ...user_fields }
//   }
// }

// 2) getFirstListItem — returns the first record that matches the filter
import { eq } from '@tigawanna/typed-pocketbase';
const first = await client.from('favorites').getFirstListItem(eq('user_id', userId));

// 3) getFullList — fetch all matching records (use sparingly for large collections)
const allFavorites = await client.from('favorites').getFullList({
  filter: eq('user_id', userId),
  sort: '-created',
  // perPage param can be provided to control batching; default batch size applies
  perPage: 200,
});

// 4) getList — paginated list (page, perPage, options)
const page1 = await client.from('favorites').getList(1, 24, {
  filter: eq('user_id', userId),
  sort: '-created',
});

// Notes:
// - Use `select.expand` to pull related records into the `expand` object on the returned record(s).
// - Use typed filters (eq, and, or, gt, lt, etc.) to build safe queries rather than string filters.
// - Prefer `getList` for large datasets (paginated) and `getFullList` only when you need to fetch all results.
```

---

## Migration examples — SDK -> typed-pocketbase

- List properties
  - SDK: `pb.collection('properties').getFullList({ sort: '-created' })`
  - Typed: `db.from('properties').getFullList({ sort: db.from('properties').createSort('-created') })`

- Filter by city and price
  - SDK: `pb.collection('properties').getList(1, 30, { filter: "city='Austin' && price > 100000" })`
  - Typed:
    ```ts
    import { and, gt, eq } from '@tigawanna/typed-pocketbase';
    db.from('properties').getList(1, 30, { filter: and(eq('city','Austin'), gt('price', 100000)) });
    ```

- Expand owner relation
  - SDK: `pb.collection('properties').getOne(id, { expand: 'owner_id' })`
  - Typed:
    ```ts
    db.from('properties').getOne(id, { select: { expand: { owner_id: true } } });
    ```

- Safe param binding (SDK)
  - SDK: `pb.filter("title ~ {:title} && price = {:p}", { title: "O'Reilly", p: 100 })`
  - Typed: use `createFilter` helpers instead of manual escaping.

---

## Best practices & hints

- Prefer typed-pocketbase (`db.from(...)`) in app code for type-safety and structured queries.
- All PocketBase endpoints available via `pb.collection(...)` can be used through the typed client as `db.from(...)` — the underlying REST API is the same.
- When you must use the vanilla SDK, always use `pb.filter(expr, params)` to bind user input into filters safely.
- For SSR flows, create a new client per request and hydrate / export the authStore using cookies (see examples above).
- Generate `pb-types.ts` for compile-time record types and to power typed-pocketbase.

### Generated types (pb-types.ts)

When you run `npm run pb-types` the generator will emit TypeScript interfaces and optional Zod schemas (commonly placed in `src/lib/pocketbase/types/pb-types.ts` and `src/lib/pocketbase/types/pb-zod.ts`). These generated types include per-collection descriptors that list the collection name, request/response shapes, and relation fields. The relation entries indicate which related collections are available for expansion when using `select.expand` with the typed client.

Example excerpt from a generated types file:
```ts
export interface PropertiesCollection {
  type: 'base';
  collectionId: string;
  collectionName: 'properties';
  response: PropertiesResponse;
  create: PropertiesCreate;
  update: PropertiesUpdate;
  relations: {
    agent_id: UsersCollection[];
    owner_id: UsersCollection[];
    favorites_via_property_id: FavoritesCollection[];
  };
}
```

The `relations` object makes it explicit which collections you can expand (for example, `owner_id` and `agent_id`), so your IDE and TypeScript will guide you when building `select.expand` shapes.


```ts
// hydrate from cookie (server-side request)
db.authStore.loadFromCookie(cookieString);

// access current auth state
const token = db.authStore.token;
const user = db.authStore.record; // use this, NOT db.authStore.model

// persist back to cookie before sending response
res.setHeader('set-cookie', db.authStore.exportToCookie());
```

---

## Quick reference: common REST equivalents

- List records (paginated): `GET /api/collections/:collection/records?page=1&perPage=30&sort=-created`
- Get single record: `GET /api/collections/:collection/records/:id?expand=owner_id&fields=*`
- Create record: `POST /api/collections/:collection/records` (FormData or JSON)
- Update record: `PATCH /api/collections/:collection/records/:id`
- Delete record: `DELETE /api/collections/:collection/records/:id`

---

If you want, I can also:
- add a short README.md version for the project root,
- or add a tiny migration checklist to convert existing `pb.collection` usages to `db.from` helpers in your codebase.

