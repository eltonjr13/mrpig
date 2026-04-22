import { cn } from "@/utils/cn";

interface InsightCardProps {
  title: string;
  description: string;
  tone?: "neutral" | "info" | "warning";
}

const toneClasses = {
  neutral: "border-zinc-800",
  info: "border-cyan-500/40",
  warning: "border-amber-500/40",
};

export function InsightCard({
  title,
  description,
  tone = "neutral",
}: InsightCardProps) {
  return (
    <article
      className={cn("rounded-lg border bg-zinc-900/60 p-4", toneClasses[tone])}
    >
      <p className="text-sm font-semibold text-zinc-100">{title}</p>
      <p className="mt-2 text-sm text-zinc-300">{description}</p>
    </article>
  );
}
