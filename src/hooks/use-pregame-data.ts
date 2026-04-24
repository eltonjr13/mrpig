"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/query-keys";
import type { PregameData } from "@/types/app";
import { fetchJson } from "@/utils/fetch-json";

interface UsePregameDataParams {
  gameName?: string;
  tagLine?: string;
  champion?: string;
  enemyChampion?: string;
  lane?: string;
}

export function usePregameData({
  gameName,
  tagLine,
  champion,
  enemyChampion,
  lane,
}: UsePregameDataParams = {}) {
  return useQuery({
    queryKey: queryKeys.pregame(gameName, tagLine, champion, enemyChampion, lane),
    queryFn: () =>
      fetchJson<PregameData>(
        `/api/pregame?gameName=${encodeURIComponent(gameName ?? "")}&tagLine=${encodeURIComponent(tagLine ?? "")}&champion=${encodeURIComponent(champion ?? "")}&enemyChampion=${encodeURIComponent(enemyChampion ?? "")}&lane=${encodeURIComponent(lane ?? "")}`,
      ),
  });
}
