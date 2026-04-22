import { DashboardScreen } from "@/features/dashboard/dashboard-screen";

interface DashboardPageProps {
  searchParams: Promise<{
    gameName?: string;
    tagLine?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;

  return (
    <DashboardScreen
      gameName={params.gameName}
      tagLine={params.tagLine}
    />
  );
}
