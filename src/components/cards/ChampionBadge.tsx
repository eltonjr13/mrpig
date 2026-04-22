interface ChampionBadgeProps {
  championName: string;
  games?: number;
  winRate?: number;
}

export function ChampionBadge({ championName, games, winRate }: ChampionBadgeProps) {
  return (
    <article className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
      <p className="text-sm font-medium text-zinc-100">{championName}</p>
      {games !== undefined ? <p className="text-xs text-zinc-400">{games} partidas</p> : null}
      {winRate !== undefined ? <p className="text-xs text-zinc-500">WR {winRate}%</p> : null}
    </article>
  );
}
