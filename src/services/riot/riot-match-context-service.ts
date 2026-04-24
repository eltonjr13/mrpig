import type {
  RiotMatchDto,
  RiotMatchParticipantDto,
} from "@/types/riot";

const LANE_BY_TEAM_POSITION: Record<string, string> = {
  TOP: "top",
  JUNGLE: "jungle",
  MIDDLE: "mid",
  BOTTOM: "bottom",
  UTILITY: "support",
};

function normalizeLane(teamPosition: string | undefined) {
  if (!teamPosition) {
    return "mid";
  }

  return LANE_BY_TEAM_POSITION[teamPosition] ?? "mid";
}

function getEnemyChampionByLane(
  enemyParticipants: RiotMatchParticipantDto[],
  lanePosition: string,
) {
  const byLane = enemyParticipants.find(
    (participant) => participant.teamPosition === lanePosition,
  );

  return byLane?.championName ?? enemyParticipants[0]?.championName ?? "Desconhecido";
}

function getEnemyJungle(enemyParticipants: RiotMatchParticipantDto[]) {
  const enemyJungler = enemyParticipants.find(
    (participant) => participant.teamPosition === "JUNGLE",
  );

  return enemyJungler?.championName ?? "Desconhecido";
}

export interface RiotMatchContext {
  userChampion: string;
  enemyChampion: string;
  lane: string;
  allyComp: string[];
  enemyComp: string[];
  assumedEnemyJungle: string;
  participant: RiotMatchParticipantDto;
}

export function getMatchContextByPuuid(
  match: RiotMatchDto,
  puuid: string,
): RiotMatchContext | null {
  const participant = match.info.participants.find((item) => item.puuid === puuid);

  if (!participant) {
    return null;
  }

  const allyParticipants = match.info.participants.filter(
    (item) => item.teamId === participant.teamId,
  );
  const enemyParticipants = match.info.participants.filter(
    (item) => item.teamId !== participant.teamId,
  );

  return {
    userChampion: participant.championName,
    enemyChampion: getEnemyChampionByLane(enemyParticipants, participant.teamPosition),
    lane: normalizeLane(participant.teamPosition),
    allyComp: allyParticipants.map((item) => item.championName),
    enemyComp: enemyParticipants.map((item) => item.championName),
    assumedEnemyJungle: getEnemyJungle(enemyParticipants),
    participant,
  };
}

export function getMostRecentMatchContext(
  matches: RiotMatchDto[],
  puuid: string,
) {
  for (const match of matches) {
    const context = getMatchContextByPuuid(match, puuid);

    if (context) {
      return context;
    }
  }

  return null;
}
