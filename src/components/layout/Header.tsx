import { Wifi } from "lucide-react";
import { cn } from "@/utils/cn";
import type { SessionStatus } from "@/types/app";

interface HeaderProps {
  title: string;
  subtitle?: string;
  sessionStatus?: SessionStatus;
}

const statusLabelByValue: Record<SessionStatus, string> = {
  mock_mode: "Modo mock",
  riot_connected: "Riot conectada",
  riot_fallback: "Fallback ativo",
};

const statusClassByValue: Record<SessionStatus, string> = {
  mock_mode: "border-zinc-700 text-zinc-300",
  riot_connected: "border-emerald-500/60 text-emerald-300",
  riot_fallback: "border-amber-500/60 text-amber-300",
};

export function Header({ title, subtitle, sessionStatus = "mock_mode" }: HeaderProps) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 px-6 py-4 backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-zinc-400">{subtitle}</p> : null}
        </div>
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium",
            statusClassByValue[sessionStatus],
          )}
        >
          <Wifi className="h-3.5 w-3.5" />
          {statusLabelByValue[sessionStatus]}
        </div>
      </div>
    </header>
  );
}
