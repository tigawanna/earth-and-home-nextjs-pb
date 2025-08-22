"use client";
import { browserPB } from "@/lib/pocketbase/browser-client";
import nextDynamic from "next/dynamic";
import { router } from "./router";

const RouterProvider = nextDynamic(
  () => import("@tanstack/react-router").then((mod) => mod.RouterProvider),
  {
    ssr: false,
  }
);

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function ClientRouter() {
  return (
    <RouterProvider
      router={router}
      context={{
        pb: browserPB,
      }}
    />
  );
}
