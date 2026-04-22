"use client";

import { QueryClient } from "@tanstack/react-query";

function createClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    return createClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = createClient();
  }

  return browserQueryClient;
}
