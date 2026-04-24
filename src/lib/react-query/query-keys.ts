export const queryKeys = {
  dashboard: (gameName?: string, tagLine?: string) =>
    ["dashboard", gameName ?? "default", tagLine ?? "default"] as const,
  pregame: (
    gameName?: string,
    tagLine?: string,
    champion?: string,
    enemyChampion?: string,
    lane?: string,
  ) =>
    [
      "pregame",
      gameName ?? "default",
      tagLine ?? "default",
      champion ?? "default",
      enemyChampion ?? "default",
      lane ?? "mid",
    ] as const,
  live: (gameName?: string, tagLine?: string) =>
    ["live", gameName ?? "default", tagLine ?? "default"] as const,
  postgame: (gameName?: string, tagLine?: string, matchId?: string) =>
    ["postgame", gameName ?? "default", tagLine ?? "default", matchId ?? "latest"] as const,
};
