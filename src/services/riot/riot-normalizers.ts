import type {
  ChampionUsage,
  MatchOverview,
  PlayerProfile,
} from "@/types/app";
import type {
  RiotAccountDto,
  RiotLeagueEntryDto,
  RiotMatchDto,
  RiotSummonerDto,
} from "@/types/riot";

const QUEUE_LABEL_BY_ID: Record<number, string> = {
  420: "Ranked Solo/Duo",
  440: "Ranked Flex",
  450: "ARAM",
  400: "Normal Draft",
  430: "Normal Blind",
};

function queueIdToLabel(queueId: number) {
  return QUEUE_LABEL_BY_ID[queueId] ?? `Queue ${queueId}`;
}

export function normalizePlayerProfile(
  account: RiotAccountDto,
  summoner: RiotSummonerDto,
  rankEntries: RiotLeagueEntryDto[],
): PlayerProfile {
  const soloQueue = rankEntries.find((entry) => entry.queueType === "RANKED_SOLO_5x5");
  const rankLabel = soloQueue
    ? `${soloQueue.tier} ${soloQueue.rank} - ${soloQueue.leaguePoints} LP`
    : "Sem rank ativo";

  return {
    gameName: account.gameName,
    tagLine: account.tagLine,
    puuid: account.puuid,
    summonerLevel: summoner.summonerLevel,
    rankLabel,
  };
}

export function normalizeRecentMatches(
  matches: RiotMatchDto[],
  puuid: string,
): MatchOverview[] {
  return matches
    .map((match) => {
      const participant = match.info.participants.find((item) => item.puuid === puuid);

      if (!participant) {
        return null;
      }

      return {
        matchId: match.metadata.matchId,
        championName: participant.championName,
        queueLabel: queueIdToLabel(match.info.queueId),
        kda: `${participant.kills}/${participant.deaths}/${participant.assists}`,
        result: participant.win ? "WIN" : "LOSS",
        gameDurationSeconds: match.info.gameDuration,
        playedAt: new Date(match.info.gameCreation).toISOString(),
      } satisfies MatchOverview;
    })
    .filter((match): match is MatchOverview => Boolean(match));
}

export function normalizeChampionPool(
  matches: RiotMatchDto[],
  puuid: string,
): ChampionUsage[] {
  const usageMap = new Map<string, { games: number; wins: number }>();

  matches.forEach((match) => {
    const participant = match.info.participants.find((item) => item.puuid === puuid);

    if (!participant) {
      return;
    }

    const current = usageMap.get(participant.championName) ?? { games: 0, wins: 0 };
    usageMap.set(participant.championName, {
      games: current.games + 1,
      wins: current.wins + (participant.win ? 1 : 0),
    });
  });

  return [...usageMap.entries()]
    .map(([championName, stats]) => ({
      championName,
      games: stats.games,
      winRate: stats.games > 0 ? Number(((stats.wins / stats.games) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.games - a.games)
    .slice(0, 5);
}

export function calculateOverallWinRate(matches: MatchOverview[]) {
  if (matches.length === 0) {
    return 0;
  }

  const wins = matches.filter((match) => match.result === "WIN").length;
  return Number(((wins / matches.length) * 100).toFixed(1));
}
