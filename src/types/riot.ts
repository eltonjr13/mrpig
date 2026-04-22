export type RiotRegionalRoute = "americas" | "asia" | "europe";

export type RiotPlatformRoute =
  | "br1"
  | "eun1"
  | "euw1"
  | "jp1"
  | "kr"
  | "la1"
  | "la2"
  | "na1"
  | "oc1"
  | "tr1"
  | "ru";

export interface RiotAccountDto {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface RiotSummonerDto {
  id: string;
  accountId: string;
  puuid: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

export interface RiotLeagueEntryDto {
  leagueId: string;
  queueType: string;
  tier: string;
  rank: string;
  summonerId: string;
  puuid: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
}

export interface RiotChampionMasteryDto {
  puuid: string;
  championId: number;
  championLevel: number;
  championPoints: number;
  lastPlayTime: number;
}

export interface RiotMatchListQuery {
  start?: number;
  count?: number;
  queue?: number;
  type?: "ranked" | "normal" | "tourney" | "tutorial";
}

export interface RiotMatchParticipantDto {
  puuid: string;
  summonerName: string;
  championName: string;
  teamId: number;
  teamPosition: string;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
  totalDamageDealtToChampions: number;
  physicalDamageDealtToChampions: number;
  magicDamageDealtToChampions: number;
  trueDamageDealtToChampions: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
}

export interface RiotMatchInfoDto {
  gameCreation: number;
  gameDuration: number;
  gameId: number;
  gameMode: string;
  queueId: number;
  participants: RiotMatchParticipantDto[];
}

export interface RiotMatchMetadataDto {
  matchId: string;
  participants: string[];
}

export interface RiotMatchDto {
  metadata: RiotMatchMetadataDto;
  info: RiotMatchInfoDto;
}

export interface RiotSpectatorParticipantDto {
  puuid: string;
  summonerName: string;
  championId: number;
  teamId: 100 | 200;
}

export interface RiotCurrentGameInfoDto {
  gameId: number;
  gameStartTime: number;
  gameLength: number;
  gameMode: string;
  gameType: string;
  mapId: number;
  participants: RiotSpectatorParticipantDto[];
}
