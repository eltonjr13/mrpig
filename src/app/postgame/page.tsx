"use client";

import {
  AppShell,
  EmptyState,
  InsightCard,
  LoadingState,
  WarningBanner,
} from "@/components";
import { usePostgameData } from "@/hooks";

export default function PostgamePage() {
  const { data, isPending } = usePostgameData();

  return (
    <AppShell
      title="Post-game"
      subtitle="Revisao da partida, comparacao com plano inicial e melhoria para o proximo jogo."
      sessionStatus="mock_mode"
    >
      <section className="space-y-6">
        <WarningBanner
          title="Revisao orientada por coaching"
          description="A analise foca em padroes de decisao e consistencia de plano, nao em automacao de jogadas."
        />

        {isPending ? <LoadingState label="Montando revisao pos-jogo..." /> : null}

        {!isPending && !data ? (
          <EmptyState
            title="Sem revisao disponivel"
            description="Conclua uma partida ou use dados mock para validar a experiencia."
          />
        ) : null}

        {data ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <InsightCard title="Partida" description={data.matchId} />
              <InsightCard title="Campeao" description={data.championName} />
              <InsightCard title="Resumo" description={data.report.summary} tone="info" />
              <InsightCard
                title="Build review"
                description={data.report.buildReview}
                tone="warning"
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <section className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
                <h2 className="text-sm font-semibold text-zinc-200">Pontos positivos</h2>
                <ul className="mt-3 space-y-2">
                  {data.report.positives.map((item) => (
                    <li key={item} className="text-sm text-zinc-300">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
                <h2 className="text-sm font-semibold text-zinc-200">Pontos de melhoria</h2>
                <ul className="mt-3 space-y-2">
                  {data.report.improvementPoints.map((item) => (
                    <li key={item} className="text-sm text-zinc-300">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <section className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
                <h2 className="text-sm font-semibold text-zinc-200">Padroes provaveis de erro</h2>
                <ul className="mt-3 space-y-2">
                  {data.report.likelyErrorPatterns.map((item) => (
                    <li key={item} className="text-sm text-zinc-300">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
                <h2 className="text-sm font-semibold text-zinc-200">
                  Sugestoes para a proxima partida
                </h2>
                <ul className="mt-3 space-y-2">
                  {data.report.nextGameSuggestions.map((item) => (
                    <li key={item} className="text-sm text-zinc-300">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </>
        ) : null}
      </section>
    </AppShell>
  );
}
