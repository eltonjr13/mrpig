import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SummonerSearchForm } from "@/components";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section
        className="relative flex min-h-[82vh] items-end"
        style={{
          backgroundImage:
            "url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-zinc-950/70" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-10 pt-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-cyan-300">LoL Coach Live</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight text-zinc-50 sm:text-5xl">
              LoL Coach Live
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-zinc-200 sm:text-base">
              Assistente de contexto para pre-game, leitura live e revisao pos-jogo, com foco em
              risco, composicao e opcoes de build.
            </p>
          </div>

          <div className="mt-8 max-w-2xl">
            <SummonerSearchForm />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-md border border-zinc-600 bg-zinc-900/80 px-3 py-2 transition hover:border-zinc-500"
            >
              Entrar no dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p>Ferramenta de coaching contextual. Sem comandos em tempo real.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
