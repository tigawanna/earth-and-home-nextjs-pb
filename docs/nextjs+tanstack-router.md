Client-Side Routing in NextJS 15 (TanStack Router integration)
==============================================================

Attribution links
[![Cubode Team](https://miro.medium.com/v2/resize:fill:64:64/1*QdD4LRlQWd9yhrp-ZVdpQw.jpeg)](https://medium.com/@cubode?source=post_page---byline--d2e3ce1c6f56---------------------------------------)

[Cubode Team](https://medium.com/@cubode?source=post_page---byline--d2e3ce1c6f56---------------------------------------)

[nameless link](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fp%2Fd2e3ce1c6f56&operation=register&redirect=https%3A%2F%2Fmedium.com%2F%40cubode%2Fclient-side-routing-in-nextjs-15-tanstack-router-integration-d2e3ce1c6f56&user=Cubode+Team&userId=e7122ec76c33&source=---header_actions--d2e3ce1c6f56---------------------clap_footer------------------)

[nameless link](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2Fd2e3ce1c6f56&operation=register&redirect=https%3A%2F%2Fmedium.com%2F%40cubode%2Fclient-side-routing-in-nextjs-15-tanstack-router-integration-d2e3ce1c6f56&source=---header_actions--d2e3ce1c6f56---------------------bookmark_footer------------------)


Table of Contents
=================

*   [Introduction](#a3ed)
*   [Inspiration & Solution](#52d2)
*   [Setup](#71ad)
*   [Drawbacks](#c912)

Introduction
============

NextJS is fantastic when used to create products that benefit significantly from its server-centric architecture. Think about e-commerce sites where product pages can be rendered server-side and cached aggressively; cache it once for one user, and that same fast response is available for everyone hitting that page. Or consider applications with large amounts of public content, like blogs or documentation sites, where server rendering and static generation are invaluable for SEO and initial load performance, ensuring content is easily crawled by search engines.

But what happens when the core of your application lives behind a login screen? What if the vast majority of the content is private, dynamic, and highly specific to the logged-in user? In these scenarios, the traditional benefits of server-side rendering and server caching diminish rapidly. If every piece of data is unique to the user interacting with it, server-side caches offer little advantage, and the overhead of server rendering might not yield the same performance gains compared to a purely client-rendered approach for subsequent interactions. Choosing to stick to the traditional NextJS server-centric approach in this scenario would yield suboptimal and sluggish solutions.

[Wendi](http://iamwendi.ai) fit this description perfectly. Its core functionality is gated by authentication, the UI is highly interactive (meaning the`"use client"` directive would be common regardless), and the data shown is unique to each user. We could have built it using a traditional CSR framework. However, we also had an eye on the future, anticipating sections with public, static content where NextJS' server rendering and caching would be genuinely advantageous. To maintain a single codebase and avoid the additional maintenance overhead of spinning up a separate NextJS instance later just for those parts, we needed a way to get the best of client-side performance within our existing NextJS project.

Inspiration & Solution
======================

Fortunately, full client-routing inside NextJS was something that had already seen success in a production-grade application. [T3.chat](https://t3.chat), a greatly optimised AI chat app that brings all the best AI models into one app, does exactly this using [React Router](https://reactrouter.com/) and manages to achieve an experience significantly faster & more stable than using the same models on their own native platforms.

Inspired by this approach, we opted for a hybrid solution where we would use [TanStack Router](https://tanstack.com/router/latest) for the core client-side app, & the traditional NextJS router for the rest as needed which would allow us to effectively get the best of both worlds.

We tested both [React Router](https://reactrouter.com/) and [TanStack Router](https://tanstack.com/router/latest) but decided to go with the latter as its file-based configuration fit in a bit more seamlessly & because we were planning to use other parts of the TanStack ecosystem anyway (see [TanStack Query](https://tanstack.com/query/latest)). But either choice would’ve worked for our goals.

Setup
=====

This setup covers the use case of developing this hybrid solution in a new product, however it can be just as easily integrated into an existing traditional NextJS project with some adjustment to the route configurations.

1.  Install the dependencies:

```
pnpm i @tanstack/react-router
pnpm i -D @tanstack/router-cli concurrently
```

2. Create the folder structure

```
app
  (client-router)
    _routes
      __root.tsx
      index.tsx
      about.tsx
    router.tsx
    page.tsx
  (server-router)
    login
      page.tsx
    register
      page.tsx
  layout.tsx
```

NextJS [route groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups) allows us to compartmentalise the client router away from the rest of the NextJS implementation.

3. Configure [TanStack Router](https://tanstack.com/router/latest) for the custom integration

Create a `tsr.config.json` file at the root of your project.

```
{
  "routesDirectory": "./app/(client-router)/_routes",
  "generatedRouteTree": "./app/(client-router)/routeTree.gen.ts",
}
```

By default [TanStack Router](https://tanstack.com/router/latest) watches a `routes` folder to generate all its routes, but we don’t want NextJS to watch this folder — so we can create a [private folder](https://nextjs.org/docs/app/getting-started/project-structure#private-folders), `_routes` , by using the underscore syntax. The `routesDirectory` tells [TanStack Router](https://tanstack.com/router/latest) where the custom location is.

The generated routes live in a `routeTree.gen.ts` file, which also needs its path to be included in the config.

4. Setup `router.tsx`

```
import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
export const router = createRouter({ routeTree });
```

5. Setup `(client-router)/page.tsx`

```
'use client';
import nextDynamic from 'next/dynamic';
import { router } from './router';
const RouterProvider = nextDynamic(
  () => import('@tanstack/react-router').then(mod => mod.RouterProvider),
  {
    ssr: false,
  }
);
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
export default function ClientRouter() {
  return <RouterProvider router={router} />;
}
```

The RouterProvider needs to be dynamically imported with SSR disabled in order to not throw errors.

6. Setup your client routes

```
// __root.tsx
// This is effectively the equivalent of a root layout.tsx in NextJS
import { createRootRoute, Outlet, Link } from '@tanstack/react-router';
export const Route = createRootRoute({
  component: Root
})
function Root() {
  return (
    <>
      <Link to="/about">About</Link>
      <Link to="/">Home</Link>
      <Outlet />
    </>
  );
}
``````
// index.tsx
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/')({
  component: Index,
});
function Index() {
  return <h3>Index</h3>
}
``````
// about.tsx
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/about')({
  component: About,
});
function About() {
  return <h3>About</h3>
}
```

[TanStack Router](https://tanstack.com/router/latest) requires you to specifically export your route configuration in every file. Although a little less seamless than NextJS, it allows for powerful type safety and offers configs for valuable features like client-sided route preloading.

7. Configure `next.config.ts` for the custom setup

```
import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  rewrites: async () => [    {
      source: '/:path*',
      destination: '/',
    },
  ],
};
export default nextConfig;
```

Since the client side routes do not exist as far as NextJS is concerned, we need to create a rewrite rule which sends those paths to our `(client-router)/page.tsx` where [TanStack Router](https://tanstack.com/router/latest) will take it from there.

8. Configure `package.json` to use the TanStack Router CLI

```
{
  "scripts": {
    "generate-routes": "tsr generate",
    "watch-routes": "tsr watch",
    "dev": "concurrently \"pnpm run watch-routes\" \"next dev --turbopack\"",
    "build": "pnpm run generate-routes && next build",
  }
}
```

Now TanStack Router will automatically generate the routes during build and development 👍.

Drawbacks
=========

Due to the different router architectures, we lose the ability to perform client-sided routing from TanStack Router > NextJS Router. So it is important to use regular anchor tags to perform this type of routing, but it’s a small price to pay for the performance wins once inside the client router sandbox.

The bigger issue is that NextJS Router conflicts with TanStack Router as they both compete for usage of the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) and start throwing errors during routing. You can easily solve this by using the TanStack Router [memory history type](https://tanstack.com/router/latest/docs/framework/react/guide/history-types), but URL based history is not something we want to compromise on. So our solution was to patch NextJS to perform an early return on its router methods when `window.NEXT_ROUTER_DISABLED === true` . This has worked perfectly for us so far, but I won’t go into details on this method at the moment as I anticipate I’ll be moving to a more robust solution in the future which does not require patching NextJS — however if you’re still interested in the details of this solution do reach out!
