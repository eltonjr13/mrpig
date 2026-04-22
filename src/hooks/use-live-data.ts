"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/query-keys";
import type { LiveData } from "@/types/app";
import { fetchJson } from "@/utils/fetch-json";

export function useLiveData() {
  return useQuery({
    queryKey: queryKeys.live(),
    queryFn: () => fetchJson<LiveData>("/api/live"),
    refetchInterval: 8_000,
  });
}
