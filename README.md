# LoL Coach Live (base v1)

Projeto Open Source usando como base de estudos usando ajuda do codex
- pre-game analysis
- live contextual tracking
- post-game review

Stack:
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- React Query
- Zod
- Supabase (schema + RLS + client)

## Setup

1. Instale dependencias:
```bash
npm install
```

2. Copie `.env.example` para `.env.local` e preencha:
```bash
RIOT_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
LIVE_CLIENT_BASE_URL=https://127.0.0.1:2999
```

3. Rode o projeto:
```bash
npm run dev
```

4. Abra:
```txt
http://localhost:3000
```

## Fluxo do app

1. `/` landing com busca de invocador.
2. `/dashboard` mostra perfil, win rate, ultimas partidas e campeoes mais jogados.
3. `/pregame` exibe matchup, lane risk score, tags, alertas e 3 builds situacionais.
4. `/live` mostra estado atual, comps, tags contextuais, alertas macro e build path foco.
5. `/postgame` entrega resumo, pontos fortes, melhorias, review de build e sugestoes para proxima.

## Politica Riot (aplicada nesta base)

- Sem comandos em tempo real.
- Sem automacao de decisao.
- Sem previsoes proibidas do tipo “o inimigo vai fazer X agora”.
- Recomendacoes sempre contextuais e de alto nivel.

## Estrutura principal

```txt
src/
  app/                # rotas e route handlers
  components/         # UI reutilizavel
  features/           # orquestracao por modulo
  hooks/              # hooks React Query
  lib/                # clients e configuracoes
  schemas/            # validacao Zod
  services/           # integracoes e regras de negocio
  types/              # tipos de dominio e DB
  utils/              # utilitarios
supabase/migrations/  # schema SQL inicial
```

## O que ja esta pronto

- UI base completa de todas as telas.
- AppShell + Sidebar + Header + cards/estados reutilizaveis.
- React Query com cache/fetch via `/api/*`.
- Riot API module separado por endpoint:
  - `account-v1`
  - `summoner-v4`
  - `match-v5`
  - `league-v4`
  - `champion-mastery-v4`
  - `spectator-v5`
- Rate-limit/retry basico para Riot API.
- Camada de normalizacao de dados.
- Live Client module com fallback seguro para indisponibilidade.
- Analysis engine inicial (regras mockadas, organizado por responsabilidade).
- Post-game coach base.
- Supabase client (browser/server), migration inicial e RLS basico.

## O que esta mockado nesta v1

- Parte da experiencia visual usa dados mock para garantir funcionamento sem dependencias externas.
- Analise de matchup/build usa heuristicas iniciais (sem modelo estatistico completo).
- Fluxo pos-jogo usa relatorio mockado a partir do plano pre-game.

## Como conectar 100% com Riot API

1. Definir `RIOT_API_KEY` valido.
2. Mapear rotas por regiao/plataforma conforme jogador (ex.: `americas` + `br1`).
3. Persistir resposta normalizada em Supabase (`match_snapshots`, `pregame_reports`, `live_snapshots`, `postgame_reports`).
4. Evoluir normalizadores para Data Dragon (ids de itens/campeoes) e enriquecer build paths.
5. Implementar refresh control por rate limits por usuario/sessao.

## Banco de dados

- Migration inicial: `supabase/migrations/202604210001_initial_schema.sql`
- Tabelas:
  - `profiles`
  - `tracked_players`
  - `match_snapshots`
  - `pregame_reports`
  - `live_snapshots`
  - `postgame_reports`
  - `build_recommendations`
  - `champion_profiles`

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
