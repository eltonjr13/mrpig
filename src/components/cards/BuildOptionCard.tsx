import type { BuildOption } from "@/types/analysis";
import { cn } from "@/utils/cn";

interface BuildOptionCardProps {
  option: BuildOption;
  emphasized?: boolean;
}

export function BuildOptionCard({ option, emphasized = false }: BuildOptionCardProps) {
  return (
    <article
      className={cn(
        "rounded-lg border bg-zinc-900/60 p-4",
        emphasized ? "border-cyan-500/50" : "border-zinc-800",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-zinc-100">
          {option.id} - {option.title}
        </p>
        <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
          {option.scenario}
        </span>
      </div>
      <ul className="mt-3 space-y-1">
        {option.itemPath.map((item) => (
          <li key={item} className="text-xs text-zinc-300">
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-zinc-400">{option.rationale}</p>
    </article>
  );
}
