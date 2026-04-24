"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Activity, BarChart3, Compass, Home, ShieldCheck } from "lucide-react";
import { cn } from "@/utils/cn";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/pregame", label: "Pre-game", icon: Compass },
  { href: "/live", label: "Live", icon: Activity },
  { href: "/postgame", label: "Post-game", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const gameName = searchParams.get("gameName");
  const tagLine = searchParams.get("tagLine");
  const identityQuery =
    gameName && tagLine
      ? `?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}`
      : "";

  return (
    <aside className="w-full border-b border-zinc-800 bg-zinc-950 px-4 py-4 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="mb-6 flex items-center gap-2 px-2">
        <ShieldCheck className="h-5 w-5 text-cyan-400" />
        <p className="text-sm font-semibold text-zinc-100">LoL Coach Live</p>
      </div>

      <nav className="grid grid-cols-2 gap-2 lg:grid-cols-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={`${href}${identityQuery}`}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                isActive
                  ? "border-cyan-500/60 bg-cyan-500/10 text-cyan-200"
                  : "border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
