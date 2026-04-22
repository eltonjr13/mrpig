interface TeamCompCardProps {
  title: string;
  champions: string[];
}

export function TeamCompCard({ title, champions }: TeamCompCardProps) {
  return (
    <article className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
      <p className="text-sm font-semibold text-zinc-100">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {champions.map((champion) => (
          <span
            key={champion}
            className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-300"
          >
            {champion}
          </span>
        ))}
      </div>
    </article>
  );
}
