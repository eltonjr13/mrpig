"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Swords, Trophy, UserCircle2 } from "lucide-react";
import {
  AppShell,
  ChampionBadge,
  EmptyState,
  LoadingState,
  MatchCard,
  StatCard,
  SummonerSearchForm,
  WarningBanner,
} from "@/components";
import { useDashboardData } from "@/hooks";

interface DashboardScreenProps {
  gameName?: string;
  tagLine?: string;
}

export function DashboardScreen({ gameName, tagLine }: DashboardScreenProps) {
  const hasSummonerIdentity = Boolean(gameName?.trim() && tagLine?.trim());
  const { data, isPending } = useDashboardData({ gameName, tagLine });
  const topChampion = useMemo(() => data?.championPool[0], [data?.championPool]);
  const navigationQuery = data
    ? `?gameName=${encodeURIComponent(data.profile.gameName)}&tagLine=${encodeURIComponent(data.profile.tagLine)}`
    : "";

  return (
    <AppShell
      title="Dashboard"
      subtitle="Visao geral do jogador, historico recente e atalhos para os modulos."
      sessionStatus={data?.sessionStatus}
    >
      <section className="space-y-6">
        <SummonerSearchForm defaultGameName={gameName} defaultTagLine={tagLine} />

        {!hasSummonerIdentity ? (
          <WarningBanner
            title="Preencha Game Name e Tag"
            description="Use seu Riot ID completo (ex.: jogador#BR1) para tentar carregar dados reais."
          />
        ) : null}

        {isPending ? <LoadingState label="Carregando dashboard..." /> : null}

        {!isPending && !data ? (
          <EmptyState
            title="Sem dados no momento"
            description="Busque um invocador para carregar a primeira analise."
          />
        ) : null}

        {data ? (
          <>
            {data.sessionStatus !== "riot_connected" ? (
              <WarningBanner
                title="Dados em fallback/mock"
                description={
                  data.fallbackReason
                    ? `Riot retornou fallback: ${data.fallbackReason}`
                    : "Nao foi possivel carregar dados reais da Riot neste teste. Verifique Riot ID e sua RIOT_API_KEY ativa."
                }
              />
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Perfil"
                value={`${data.profile.gameName}#${data.profile.tagLine}`}
                helpText={`Nivel ${data.profile.summonerLevel}`}
                icon={<UserCircle2 className="h-4 w-4 text-zinc-400" />}
              />
              <StatCard
                label="Win Rate"
                value={`${data.overallWinRate}%`}
                helpText="Ultimas partidas analisadas"
                icon={<Trophy className="h-4 w-4 text-zinc-400" />}
              />
              <StatCard
                label="Rank"
                value={data.profile.rankLabel}
                helpText="Solo queue"
                icon={<Swords className="h-4 w-4 text-zinc-400" />}
              />
              <StatCard
                label="Sessao"
                value={data.sessionStatus}
                helpText="Conexao do modulo Riot/mock"
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
              <section className="space-y-3">
                <h2 className="text-sm font-semibold text-zinc-200">Ultimas partidas</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {data.recentMatches.map((match) => (
                    <MatchCard key={match.matchId} match={match} />
                  ))}
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-sm font-semibold text-zinc-200">Campeoes mais jogados</h2>
                <div className="grid gap-2 sm:grid-cols-2">
                  {data.championPool.map((champion) => (
                    <ChampionBadge
                      key={champion.championName}
                      championName={champion.championName}
                      games={champion.games}
                      winRate={champion.winRate}
                    />
                  ))}
                </div>
                {topChampion ? (
                  <p className="text-xs text-zinc-400">
                    Destaque atual: {topChampion.championName} com {topChampion.winRate}% WR.
                  </p>
                ) : null}
              </section>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Link
                href={`/pregame${navigationQuery}`}
                className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-200 transition hover:border-zinc-700"
              >
                Pre-game: matchup, risco de lane e builds
              </Link>
              <Link
                href={`/live${navigationQuery}`}
                className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-200 transition hover:border-zinc-700"
              >
                Live: contexto da partida e alertas macro
              </Link>
              <Link
                href={`/postgame${navigationQuery}`}
                className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-200 transition hover:border-zinc-700"
              >
                Post-game: revisao de execucao e proximo plano
              </Link>
            </div>
          </>
        ) : null}
      </section>
    </AppShell>
  );
}
