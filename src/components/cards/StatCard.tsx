import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  helpText?: string;
  icon?: ReactNode;
}

export function StatCard({ label, value, helpText, icon }: StatCardProps) {
  return (
    <article className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-zinc-400">{label}</p>
        {icon}
      </div>
      <p className="mt-2 text-2xl font-semibold text-zinc-50">{value}</p>
      {helpText ? <p className="mt-1 text-xs text-zinc-400">{helpText}</p> : null}
    </article>
  );
}
