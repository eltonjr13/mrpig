import type {
  LiveAnalysis,
  PostGameCoachReport,
  PregameAnalysis,
} from "@/types/analysis";
import type { NormalizedLiveState } from "@/types/live-client";
import type { RiotLeagueEntryDto } from "@/types/riot";

export type SessionStatus = "mock_mode" | "riot_connected" | "riot_fallback";

export interface PlayerProfile {
  gameName: string;
  tagLine: string;
  puuid: string;
  summonerLevel: number;
  rankLabel: string;
}

export interface MatchOverview {
  matchId: string;
  championName: string;
  queueLabel: string;
  kda: string;
  result: "WIN" | "LOSS";
  gameDurationSeconds: number;
  playedAt: string;
}

export interface ChampionUsage {
  championName: string;
  games: number;
  winRate: number;
}

export interface DashboardData {
  profile: PlayerProfile;
  rankEntries: RiotLeagueEntryDto[];
  recentMatches: MatchOverview[];
  championPool: ChampionUsage[];
  sessionStatus: SessionStatus;
  overallWinRate: number;
}

export interface PregameData {
  userChampion: string;
  enemyChampion: string;
  lane: string;
  assumedEnemyJungle: string;
  analysis: PregameAnalysis;
}

export interface LiveData {
  liveState: NormalizedLiveState;
  liveAnalysis: LiveAnalysis;
}

export interface PostGameData {
  matchId: string;
  championName: string;
  report: PostGameCoachReport;
}
