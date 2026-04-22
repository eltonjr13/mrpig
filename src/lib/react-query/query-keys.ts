export const queryKeys = {
  dashboard: (gameName?: string, tagLine?: string) =>
    ["dashboard", gameName ?? "default", tagLine ?? "default"] as const,
  pregame: (champion?: string, enemyChampion?: string, lane?: string) =>
    ["pregame", champion ?? "default", enemyChampion ?? "default", lane ?? "mid"] as const,
  live: (gameName?: string, tagLine?: string) =>
    ["live", gameName ?? "default", tagLine ?? "default"] as const,
  postgame: (matchId?: string) => ["postgame", matchId ?? "latest"] as const,
};
