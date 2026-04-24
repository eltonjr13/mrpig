import { z } from "zod";

export const riotAccountSchema = z.object({
  puuid: z.string(),
  gameName: z.string(),
  tagLine: z.string(),
});

export const riotSummonerSchema = z.object({
  id: z.string().optional(),
  accountId: z.string().optional(),
  puuid: z.string(),
  profileIconId: z.number(),
  revisionDate: z.number(),
  summonerLevel: z.number(),
});

export const riotLeagueEntrySchema = z.object({
  leagueId: z.string(),
  queueType: z.string(),
  tier: z.string(),
  rank: z.string(),
  summonerId: z.string().optional(),
  puuid: z.string(),
  leaguePoints: z.number(),
  wins: z.number(),
  losses: z.number(),
  veteran: z.boolean(),
  inactive: z.boolean(),
  freshBlood: z.boolean(),
  hotStreak: z.boolean(),
});

export const riotLeagueEntriesSchema = z.array(riotLeagueEntrySchema);

export const riotChampionMasterySchema = z.object({
  puuid: z.string(),
  championId: z.number(),
  championLevel: z.number(),
  championPoints: z.number(),
  lastPlayTime: z.number(),
});

export const riotChampionMasteriesSchema = z.array(riotChampionMasterySchema);

export const riotMatchParticipantSchema = z.object({
  puuid: z.string(),
  summonerName: z.string(),
  championName: z.string(),
  teamId: z.number(),
  teamPosition: z.string(),
  kills: z.number(),
  deaths: z.number(),
  assists: z.number(),
  win: z.boolean(),
  totalDamageDealtToChampions: z.number(),
  physicalDamageDealtToChampions: z.number(),
  magicDamageDealtToChampions: z.number(),
  trueDamageDealtToChampions: z.number(),
  item0: z.number(),
  item1: z.number(),
  item2: z.number(),
  item3: z.number(),
  item4: z.number(),
  item5: z.number(),
  item6: z.number(),
});

export const riotMatchSchema = z.object({
  metadata: z.object({
    matchId: z.string(),
    participants: z.array(z.string()),
  }),
  info: z.object({
    gameCreation: z.number(),
    gameDuration: z.number(),
    gameId: z.number(),
    gameMode: z.string(),
    queueId: z.number(),
    participants: z.array(riotMatchParticipantSchema),
  }),
});

export const riotCurrentGameSchema = z.object({
  gameId: z.number(),
  gameStartTime: z.number(),
  gameLength: z.number(),
  gameMode: z.string(),
  gameType: z.string(),
  mapId: z.number(),
  participants: z.array(
    z.object({
      puuid: z.string(),
      summonerName: z.string(),
      championId: z.number(),
      teamId: z.union([z.literal(100), z.literal(200)]),
    }),
  ),
});
