import {
  LiveClientBase,
  LiveClientError,
} from "@/lib/api-clients/live-client-base";
import type {
  LiveClientAllGameData,
  NormalizedLiveState,
} from "@/types/live-client";

function toKdaLabel(kills: number, deaths: number, assists: number) {
  return `${kills}/${deaths}/${assists}`;
}

export function normalizeLiveState(data: LiveClientAllGameData): NormalizedLiveState {
  const activePlayerTeam =
    data.allPlayers.find((player) => player.summonerName === data.activePlayer.summonerName)
      ?.team ?? "ORDER";

  const allyTeam = data.allPlayers
    .filter((player) => player.team === activePlayerTeam)
    .map((player) => ({
      summonerName: player.summonerName,
      championName: player.championName,
      position: player.position || "UNKNOWN",
      level: player.level,
      kda: toKdaLabel(player.scores.kills, player.scores.deaths, player.scores.assists),
    }));

  const enemyTeam = data.allPlayers
    .filter((player) => player.team !== activePlayerTeam)
    .map((player) => ({
      summonerName: player.summonerName,
      championName: player.championName,
      position: player.position || "UNKNOWN",
      level: player.level,
      kda: toKdaLabel(player.scores.kills, player.scores.deaths, player.scores.assists),
    }));

  return {
    availability: "available",
    source: "live_client",
    gameMode: data.gameData.gameMode,
    gameTimeSeconds: data.gameData.gameTime,
    activePlayerName: data.activePlayer.summonerName,
    allyTeam,
    enemyTeam,
    events: data.events.Events.slice(-8),
    notes: [
      "Assistente contextual ativo: foco em leitura de estado e opcoes.",
      "Nenhum comando de micro-decisao em tempo real e gerado.",
    ],
  };
}

export function buildUnavailableState(
  reason: "not_in_game" | "unavailable",
): NormalizedLiveState {
  return {
    availability: reason,
    source: "fallback",
    gameMode: "Sem partida ativa",
    gameTimeSeconds: 0,
    activePlayerName: "Indisponivel",
    allyTeam: [],
    enemyTeam: [],
    events: [],
    notes: [
      reason === "not_in_game"
        ? "Jogo nao detectado no momento."
        : "Live Client local nao respondeu.",
      "Continuamos oferecendo analise pre e pos-jogo normalmente.",
    ],
  };
}

export async function getLiveClientState(
  client: LiveClientBase = new LiveClientBase(),
): Promise<NormalizedLiveState> {
  try {
    const response = await client.get<LiveClientAllGameData>("/liveclientdata/allgamedata");
    return normalizeLiveState(response);
  } catch (error) {
    if (error instanceof LiveClientError) {
      return buildUnavailableState(error.kind);
    }

    return buildUnavailableState("unavailable");
  }
}
