"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/query-keys";
import type { LiveData } from "@/types/app";
import { fetchJson } from "@/utils/fetch-json";

interface UseLiveDataParams {
  gameName?: string;
  tagLine?: string;
}

export function useLiveData({ gameName, tagLine }: UseLiveDataParams = {}) {
  return useQuery({
    queryKey: queryKeys.live(gameName, tagLine),
    queryFn: () =>
      fetchJson<LiveData>(
        `/api/live?gameName=${encodeURIComponent(gameName ?? "")}&tagLine=${encodeURIComponent(tagLine ?? "")}`,
      ),
    refetchInterval: 8_000,
  });
}
