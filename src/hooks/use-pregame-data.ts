"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/query-keys";
import type { PregameData } from "@/types/app";
import { fetchJson } from "@/utils/fetch-json";

interface UsePregameDataParams {
  champion?: string;
  enemyChampion?: string;
  lane?: string;
}

export function usePregameData({
  champion,
  enemyChampion,
  lane,
}: UsePregameDataParams = {}) {
  return useQuery({
    queryKey: queryKeys.pregame(champion, enemyChampion, lane),
    queryFn: () =>
      fetchJson<PregameData>(
        `/api/pregame?champion=${encodeURIComponent(champion ?? "")}&enemyChampion=${encodeURIComponent(enemyChampion ?? "")}&lane=${encodeURIComponent(lane ?? "")}`,
      ),
  });
}
