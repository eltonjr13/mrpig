import { cn } from "@/utils/cn";

interface RiskScoreCardProps {
  score: number;
  label: "baixo" | "medio" | "alto";
}

const toneByLabel = {
  baixo: "text-emerald-300 border-emerald-500/40",
  medio: "text-amber-300 border-amber-500/40",
  alto: "text-rose-300 border-rose-500/40",
};

export function RiskScoreCard({ score, label }: RiskScoreCardProps) {
  return (
    <article className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
      <p className="text-xs text-zinc-400">Lane risk score</p>
      <div className="mt-2 flex items-center gap-3">
        <p className="text-3xl font-semibold text-zinc-100">{score}</p>
        <span className={cn("rounded px-2 py-1 text-xs font-semibold border", toneByLabel[label])}>
          {label.toUpperCase()}
        </span>
      </div>
      <div className="mt-3 h-2 rounded bg-zinc-800">
        <div
          className="h-full rounded bg-cyan-500"
          style={{ width: `${Math.max(8, Math.min(100, score))}%` }}
        />
      </div>
    </article>
  );
}
