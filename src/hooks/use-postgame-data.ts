"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/query-keys";
import type { PostGameData } from "@/types/app";
import { fetchJson } from "@/utils/fetch-json";

interface UsePostgameDataParams {
  gameName?: string;
  tagLine?: string;
  matchId?: string;
}

export function usePostgameData({
  gameName,
  tagLine,
  matchId,
}: UsePostgameDataParams = {}) {
  return useQuery({
    queryKey: queryKeys.postgame(gameName, tagLine, matchId),
    queryFn: () =>
      fetchJson<PostGameData>(
        `/api/postgame?gameName=${encodeURIComponent(gameName ?? "")}&tagLine=${encodeURIComponent(tagLine ?? "")}&matchId=${encodeURIComponent(matchId ?? "")}`,
      ),
  });
}
