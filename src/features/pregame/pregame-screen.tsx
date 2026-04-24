"use client";

import {
  AppShell,
  BuildOptionCard,
  InsightCard,
  LoadingState,
  RiskScoreCard,
  TeamCompCard,
  WarningBanner,
} from "@/components";
import { mockAllyComp, mockEnemyComp } from "@/features/mock-data";
import { usePregameData } from "@/hooks";

interface PregameScreenProps {
  gameName?: string;
  tagLine?: string;
  champion?: string;
  enemyChampion?: string;
  lane?: string;
}

export function PregameScreen({
  gameName,
  tagLine,
  champion,
  enemyChampion,
  lane,
}: PregameScreenProps) {
  const { data, isPending } = usePregameData({
    gameName,
    tagLine,
    champion,
    enemyChampion,
    lane,
  });

  return (
    <AppShell
      title="Pre-game"
      subtitle="Analise de matchup, risco de lane e opcoes de build situacionais."
      sessionStatus={data?.sessionStatus ?? "mock_mode"}
    >
      <section className="space-y-6">
        <WarningBanner
          title="Coaching contextual"
          description="As recomendacoes sao de contexto e risco. A ferramenta nao emite comandos de execucao imediata."
        />

        {data?.sessionStatus === "riot_fallback" ? (
          <WarningBanner
            title="Pregame em fallback"
            description={
              data.fallbackReason
                ? `Nao foi possivel usar Riot em tempo real: ${data.fallbackReason}`
                : "Nao foi possivel usar Riot em tempo real para este pregame."
            }
          />
        ) : null}

        {isPending || !data ? (
          <LoadingState label="Gerando leitura pre-game..." />
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <InsightCard
                title="Seu campeao"
                description={`${data.userChampion} (${data.lane})`}
              />
              <InsightCard
                title="Campeao inimigo"
                description={data.enemyChampion}
              />
              <InsightCard
                title="Matchup overview"
                description={data.analysis.matchupOverview}
                tone="info"
              />
              <RiskScoreCard
                score={data.analysis.laneRiskScore}
                label={data.analysis.laneRiskLabel}
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <TeamCompCard title="Composicao aliada" champions={data.allyComp ?? mockAllyComp} />
              <TeamCompCard title="Composicao inimiga" champions={data.enemyComp ?? mockEnemyComp} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <InsightCard
                title="Damage profile inimigo"
                description={data.analysis.enemyDamageProfile}
              />
              <InsightCard
                title="Power spikes"
                description={data.analysis.powerSpikes.join(" | ")}
              />
              <InsightCard
                title="Tags"
                description={data.analysis.tags.join(" | ")}
                tone="warning"
              />
            </div>

            <div className="grid gap-3 xl:grid-cols-3">
              {data.analysis.buildOptions.map((option, index) => (
                <BuildOptionCard
                  key={option.id}
                  option={option}
                  emphasized={index === 0}
                />
              ))}
            </div>

            <section className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
              <h2 className="text-sm font-semibold text-zinc-200">Alertas contextuais</h2>
              <ul className="mt-3 space-y-2">
                {data.analysis.contextualAlerts.map((alert) => (
                  <li key={alert} className="text-sm text-zinc-300">
                    {alert}
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </section>
    </AppShell>
  );
}
