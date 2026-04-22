import type { PostGameCoachReport, PregameAnalysis } from "@/types/analysis";
import type { MatchOverview } from "@/types/app";

export interface PostgameCoachInput {
  match: MatchOverview;
  pregameAnalysis: PregameAnalysis;
  buildUsed: string[];
}

function compareBuildToSuggestion(
  buildUsed: string[],
  pregameAnalysis: PregameAnalysis,
) {
  const recommended = pregameAnalysis.buildOptions[0]?.itemPath ?? [];
  const overlap = buildUsed.filter((item) => recommended.includes(item)).length;

  if (overlap >= 2) {
    return "Build usada manteve boa aderencia com a rota sugerida para o contexto da partida.";
  }
  if (overlap === 1) {
    return "Build usada teve aderencia parcial. Vale revisar o segundo item para alinhar melhor com o risco de lane.";
  }
  return "Build usada divergiu da sugestao contextual. Revise o plano de itemizacao para partidas de risco parecido.";
}

export function buildPostgameCoachReport(input: PostgameCoachInput): PostGameCoachReport {
  const isWin = input.match.result === "WIN";
  const highRiskLane = input.pregameAnalysis.laneRiskScore >= 60;

  return {
    summary: isWin
      ? "Partida vencida com execucao consistente na fase de transicao para mid game."
      : "Partida com pontos de pressao identificados na fase de lane e nas lutas de objetivo.",
    positives: [
      "Leitura de composicao manteve coerencia com o plano pre-jogo.",
      isWin
        ? "Aproveitou bem janelas de spike do proprio campeao."
        : "Manteve relevancia na partida mesmo sob pressao.",
      "Controle de risco melhor que a media quando comparado ao historico recente.",
    ],
    improvementPoints: [
      highRiskLane
        ? "Refinar timing de trocas em lane de alto risco para reduzir perdas no inicio."
        : "Aumentar consistencia da vantagem quando o matchup e favoravel.",
      "Melhorar alinhamento entre build escolhida e perfil de dano inimigo.",
      "Aprimorar transicao entre fim de lane e primeira disputa de objetivo.",
    ],
    likelyErrorPatterns: [
      "Excesso de permanencia em rotas laterais sem visao suficiente.",
      "Entrada em trocas longas antes de completar spike principal.",
      "Itemizacao ofensiva antecipada em jogos com engage inimigo elevado.",
    ],
    buildReview: compareBuildToSuggestion(input.buildUsed, input.pregameAnalysis),
    nextGameSuggestions: [
      "Manter plano de build em 2 rotas pre-definidas conforme perfil de dano inimigo.",
      "Validar risco de lane antes de acelerar o ritmo de troca.",
      "Repetir foco em lutas front-to-back quando a composicao favorecer.",
    ],
  };
}
