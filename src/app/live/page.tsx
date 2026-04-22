"use client";

import {
  AppShell,
  BuildOptionCard,
  EmptyState,
  InsightCard,
  LoadingState,
  TeamCompCard,
  WarningBanner,
} from "@/components";
import { useLiveData, usePregameData } from "@/hooks";

export default function LivePage() {
  const liveQuery = useLiveData();
  const pregameQuery = usePregameData();

  const liveData = liveQuery.data;
  const pregameData = pregameQuery.data;

  return (
    <AppShell
      title="Live"
      subtitle="Acompanhamento contextual da partida em andamento."
      sessionStatus="mock_mode"
    >
      <section className="space-y-6">
        <WarningBanner
          title="Assistente contextual, nao prescritivo"
          description="A interface oferece leitura de estado, risco e opcoes. Nao fornece comandos de acao imediata."
        />

        {liveQuery.isPending ? (
          <LoadingState label="Lendo estado da partida..." />
        ) : null}

        {!liveQuery.isPending && !liveData ? (
          <EmptyState
            title="Live indisponivel"
            description="Nao foi possivel carregar dados da partida. O modulo continua funcional com contexto pre e pos-jogo."
          />
        ) : null}

        {liveData ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <InsightCard
                title="Estado atual da partida"
                description={liveData.liveAnalysis.gameStateSummary}
                tone="info"
              />
              <InsightCard
                title="Modo"
                description={liveData.liveState.gameMode}
              />
              <InsightCard
                title="Tempo"
                description={`${Math.floor(liveData.liveState.gameTimeSeconds / 60)} min`}
              />
              <InsightCard
                title="Build path foco"
                description={`Opcao ${liveData.liveAnalysis.buildPathFocus}`}
                tone="warning"
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <TeamCompCard
                title="Time aliado"
                champions={liveData.liveState.allyTeam.map((player) => player.championName)}
              />
              <TeamCompCard
                title="Time inimigo"
                champions={liveData.liveState.enemyTeam.map((player) => player.championName)}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <InsightCard
                title="Leitura composicional"
                description={liveData.liveAnalysis.compositionalRead}
              />
              <InsightCard
                title="Tags contextuais"
                description={liveData.liveAnalysis.tags.join(" | ")}
              />
              <InsightCard
                title="Status Live Client"
                description={liveData.liveState.availability}
              />
            </div>

            <section className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
              <h2 className="text-sm font-semibold text-zinc-200">Alertas macro</h2>
              <ul className="mt-3 space-y-2">
                {liveData.liveAnalysis.macroAlerts.map((alert) => (
                  <li key={alert} className="text-sm text-zinc-300">
                    {alert}
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-zinc-200">
                Build paths disponiveis (sem prescricao instantanea)
              </h2>
              <div className="grid gap-3 xl:grid-cols-3">
                {(pregameData?.analysis.buildOptions ?? []).map((option) => (
                  <BuildOptionCard
                    key={option.id}
                    option={option}
                    emphasized={option.id === liveData.liveAnalysis.buildPathFocus}
                  />
                ))}
              </div>
            </section>
          </>
        ) : null}
      </section>
    </AppShell>
  );
}
