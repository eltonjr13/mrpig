import { PregameScreen } from "@/features/pregame/pregame-screen";

interface PregamePageProps {
  searchParams: Promise<{
    champion?: string;
    enemyChampion?: string;
    lane?: string;
  }>;
}

export default async function PregamePage({ searchParams }: PregamePageProps) {
  const params = await searchParams;

  return (
    <PregameScreen
      champion={params.champion}
      enemyChampion={params.enemyChampion}
      lane={params.lane}
    />
  );
}
