"use client";

import * as React from "react";
import {
  QueryClientProvider,
  isServer,
  QueryClient,
} from "@tanstack/react-query";
import { getQueryClient } from "./get-query-client";

export function TanstackQueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
