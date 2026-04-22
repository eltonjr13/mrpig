"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/query-keys";
import type { DashboardData } from "@/types/app";
import { fetchJson } from "@/utils/fetch-json";

interface UseDashboardDataParams {
  gameName?: string;
  tagLine?: string;
}

export function useDashboardData({ gameName, tagLine }: UseDashboardDataParams) {
  return useQuery({
    queryKey: queryKeys.dashboard(gameName, tagLine),
    queryFn: () =>
      fetchJson<DashboardData>(
        `/api/dashboard?gameName=${encodeURIComponent(gameName ?? "")}&tagLine=${encodeURIComponent(tagLine ?? "")}`,
      ),
  });
}
