export type LiveClientAvailability = "available" | "not_in_game" | "unavailable";

export interface LiveClientPlayerScores {
  kills: number;
  deaths: number;
  assists: number;
}

export interface LiveClientItem {
  itemID: number;
  displayName: string;
  price: number;
}

export interface LiveClientPlayer {
  summonerName: string;
  championName: string;
  team: "ORDER" | "CHAOS";
  position: string;
  level: number;
  scores: LiveClientPlayerScores;
  items: LiveClientItem[];
}

export interface LiveClientEvent {
  EventName: string;
  EventTime: number;
  KillerName?: string;
  VictimName?: string;
  Assisters?: string[];
}

export interface LiveClientAllGameData {
  gameData: {
    gameMode: string;
    gameTime: number;
    mapName: string;
    gameQueueConfigId: number;
  };
  activePlayer: {
    summonerName: string;
    level: number;
    currentGold: number;
    championStats: Record<string, number>;
  };
  allPlayers: LiveClientPlayer[];
  events: {
    Events: LiveClientEvent[];
  };
}

export interface NormalizedLiveTeamMember {
  summonerName: string;
  championName: string;
  position: string;
  level: number;
  kda: string;
}

export interface NormalizedLiveState {
  availability: LiveClientAvailability;
  source: "live_client" | "mock" | "fallback";
  gameMode: string;
  gameTimeSeconds: number;
  activePlayerName: string;
  allyTeam: NormalizedLiveTeamMember[];
  enemyTeam: NormalizedLiveTeamMember[];
  events: LiveClientEvent[];
  notes: string[];
}
