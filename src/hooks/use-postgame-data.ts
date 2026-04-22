"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/query-keys";
import type { PostGameData } from "@/types/app";
import { fetchJson } from "@/utils/fetch-json";

export function usePostgameData(matchId?: string) {
  return useQuery({
    queryKey: queryKeys.postgame(matchId),
    queryFn: () =>
      fetchJson<PostGameData>(`/api/postgame?matchId=${encodeURIComponent(matchId ?? "")}`),
  });
}
