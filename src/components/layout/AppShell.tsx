import type { ReactNode } from "react";
import type { SessionStatus } from "@/types/app";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

interface AppShellProps {
  title: string;
  subtitle?: string;
  sessionStatus?: SessionStatus;
  children: ReactNode;
}

export function AppShell({
  title,
  subtitle,
  sessionStatus = "mock_mode",
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 lg:flex">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Header title={title} subtitle={subtitle} sessionStatus={sessionStatus} />
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
