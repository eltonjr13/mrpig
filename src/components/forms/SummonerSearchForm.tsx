"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface SummonerSearchFormProps {
  defaultGameName?: string;
  defaultTagLine?: string;
  className?: string;
}

export function SummonerSearchForm({
  defaultGameName = "",
  defaultTagLine = "",
  className = "",
}: SummonerSearchFormProps) {
  const router = useRouter();
  const [gameName, setGameName] = useState(defaultGameName);
  const [tagLine, setTagLine] = useState(defaultTagLine);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const game = gameName.trim();
    const tag = tagLine.trim();

    if (!game || !tag) {
      return;
    }

    router.push(
      `/dashboard?gameName=${encodeURIComponent(game)}&tagLine=${encodeURIComponent(tag)}`,
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`grid gap-3 sm:grid-cols-[1fr_120px_auto] ${className}`}>
      <label className="sr-only" htmlFor="gameName">
        Game Name
      </label>
      <input
        id="gameName"
        value={gameName}
        onChange={(event) => setGameName(event.target.value)}
        placeholder="Game Name"
        required
        className="h-11 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none ring-cyan-500 transition focus:ring-2"
      />

      <label className="sr-only" htmlFor="tagLine">
        Tag Line
      </label>
      <input
        id="tagLine"
        value={tagLine}
        onChange={(event) => setTagLine(event.target.value)}
        placeholder="Tag"
        required
        className="h-11 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none ring-cyan-500 transition focus:ring-2"
      />

      <button
        type="submit"
        disabled={!gameName.trim() || !tagLine.trim()}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-cyan-500 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400"
      >
        <Search className="h-4 w-4" />
        Buscar
      </button>
    </form>
  );
}
