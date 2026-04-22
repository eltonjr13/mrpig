interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = "Carregando dados..." }: LoadingStateProps) {
  return (
    <section className="space-y-3">
      <p className="text-sm text-zinc-400">{label}</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-lg border border-zinc-800 bg-zinc-900/50"
          />
        ))}
      </div>
    </section>
  );
}
