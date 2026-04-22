create extension if not exists pgcrypto;

create type public.report_type as enum ('pregame', 'live', 'postgame');

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  riot_game_name text,
  riot_tag_line text,
  preferred_role text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.profiles is 'Perfil base do usuario autenticado no produto.';

create table if not exists public.tracked_players (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  puuid text not null,
  game_name text not null,
  tag_line text not null,
  platform_route text not null default 'br1',
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  unique (profile_id, puuid)
);
comment on table public.tracked_players is 'Jogadores monitorados por cada perfil para acompanhar analises e historico.';

create table if not exists public.match_snapshots (
  id uuid primary key default gen_random_uuid(),
  tracked_player_id uuid not null references public.tracked_players (id) on delete cascade,
  match_id text not null,
  queue_id int,
  champion_name text,
  lane text,
  result text,
  kda text,
  game_duration_seconds int,
  played_at timestamptz,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tracked_player_id, match_id)
);
comment on table public.match_snapshots is 'Snapshot normalizado da partida para analise e cache historico.';

create table if not exists public.pregame_reports (
  id uuid primary key default gen_random_uuid(),
  tracked_player_id uuid not null references public.tracked_players (id) on delete cascade,
  champion_name text not null,
  enemy_champion_name text not null,
  lane text not null,
  risk_score int not null,
  tags text[] not null default '{}',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
comment on table public.pregame_reports is 'Relatorio de pre-game com contexto, tags e risco de lane.';

create table if not exists public.live_snapshots (
  id uuid primary key default gen_random_uuid(),
  tracked_player_id uuid not null references public.tracked_players (id) on delete cascade,
  game_id text,
  source text not null default 'live_client',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
comment on table public.live_snapshots is 'Capturas da leitura contextual da partida em andamento.';

create table if not exists public.postgame_reports (
  id uuid primary key default gen_random_uuid(),
  tracked_player_id uuid not null references public.tracked_players (id) on delete cascade,
  match_snapshot_id uuid references public.match_snapshots (id) on delete set null,
  summary text,
  positives text[] not null default '{}',
  improvements text[] not null default '{}',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
comment on table public.postgame_reports is 'Coaching pos-jogo comparando plano pre-game e execucao.';

create table if not exists public.build_recommendations (
  id uuid primary key default gen_random_uuid(),
  tracked_player_id uuid not null references public.tracked_players (id) on delete cascade,
  report_type public.report_type not null,
  report_id uuid not null,
  champion_name text not null,
  lane text,
  option_label text not null,
  item_path text[] not null default '{}',
  rationale text not null,
  created_at timestamptz not null default now()
);
comment on table public.build_recommendations is 'Opcoes de build contextuais ligadas a relatorios pre/live/post.';

create table if not exists public.champion_profiles (
  id uuid primary key default gen_random_uuid(),
  champion_name text not null unique,
  primary_role text not null,
  damage_profile text not null,
  lane_style text not null,
  scaling_profile text not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.champion_profiles is 'Base para leitura de matchup e regras iniciais de analise.';

create index if not exists idx_tracked_players_profile on public.tracked_players (profile_id);
create index if not exists idx_match_snapshots_tracked_player on public.match_snapshots (tracked_player_id);
create index if not exists idx_pregame_reports_tracked_player on public.pregame_reports (tracked_player_id);
create index if not exists idx_live_snapshots_tracked_player on public.live_snapshots (tracked_player_id);
create index if not exists idx_postgame_reports_tracked_player on public.postgame_reports (tracked_player_id);
create index if not exists idx_build_recommendations_report on public.build_recommendations (report_type, report_id);
create index if not exists idx_build_recommendations_tracked_player on public.build_recommendations (tracked_player_id);

alter table public.profiles enable row level security;
alter table public.tracked_players enable row level security;
alter table public.match_snapshots enable row level security;
alter table public.pregame_reports enable row level security;
alter table public.live_snapshots enable row level security;
alter table public.postgame_reports enable row level security;
alter table public.build_recommendations enable row level security;
alter table public.champion_profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "tracked_players_owner_access"
  on public.tracked_players for all
  using (exists (
    select 1
    from public.profiles p
    where p.id = tracked_players.profile_id
      and p.id = auth.uid()
  ))
  with check (exists (
    select 1
    from public.profiles p
    where p.id = tracked_players.profile_id
      and p.id = auth.uid()
  ));

create policy "match_snapshots_owner_access"
  on public.match_snapshots for all
  using (exists (
    select 1
    from public.tracked_players tp
    where tp.id = match_snapshots.tracked_player_id
      and tp.profile_id = auth.uid()
  ))
  with check (exists (
    select 1
    from public.tracked_players tp
    where tp.id = match_snapshots.tracked_player_id
      and tp.profile_id = auth.uid()
  ));

create policy "pregame_reports_owner_access"
  on public.pregame_reports for all
  using (exists (
    select 1
    from public.tracked_players tp
    where tp.id = pregame_reports.tracked_player_id
      and tp.profile_id = auth.uid()
  ))
  with check (exists (
    select 1
    from public.tracked_players tp
    where tp.id = pregame_reports.tracked_player_id
      and tp.profile_id = auth.uid()
  ));

create policy "live_snapshots_owner_access"
  on public.live_snapshots for all
  using (exists (
    select 1
    from public.tracked_players tp
    where tp.id = live_snapshots.tracked_player_id
      and tp.profile_id = auth.uid()
  ))
  with check (exists (
    select 1
    from public.tracked_players tp
    where tp.id = live_snapshots.tracked_player_id
      and tp.profile_id = auth.uid()
  ));

create policy "postgame_reports_owner_access"
  on public.postgame_reports for all
  using (exists (
    select 1
    from public.tracked_players tp
    where tp.id = postgame_reports.tracked_player_id
      and tp.profile_id = auth.uid()
  ))
  with check (exists (
    select 1
    from public.tracked_players tp
    where tp.id = postgame_reports.tracked_player_id
      and tp.profile_id = auth.uid()
  ));

create policy "build_recommendations_owner_access"
  on public.build_recommendations for all
  using (exists (
    select 1
    from public.tracked_players tp
    where tp.id = build_recommendations.tracked_player_id
      and tp.profile_id = auth.uid()
  ))
  with check (exists (
    select 1
    from public.tracked_players tp
    where tp.id = build_recommendations.tracked_player_id
      and tp.profile_id = auth.uid()
  ));

create policy "champion_profiles_read_all"
  on public.champion_profiles for select
  using (true);
