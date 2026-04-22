import type { MatchOverview } from "@/types/app";
import { cn } from "@/utils/cn";

interface MatchCardProps {
  match: MatchOverview;
}

export function MatchCard({ match }: MatchCardProps) {
  return (
    <article className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-zinc-100">{match.championName}</p>
          <p className="text-xs text-zinc-400">{match.queueLabel}</p>
        </div>
        <span
          className={cn(
            "rounded px-2 py-1 text-xs font-semibold",
            match.result === "WIN"
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-rose-500/15 text-rose-300",
          )}
        >
          {match.result}
        </span>
      </div>
      <p className="mt-3 text-sm text-zinc-300">KDA: {match.kda}</p>
      <p className="mt-1 text-xs text-zinc-500">{Math.round(match.gameDurationSeconds / 60)} min</p>
    </article>
  );
}
