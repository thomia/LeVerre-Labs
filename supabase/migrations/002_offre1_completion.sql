-- Migration 002 — Complétion Offre 1
-- Ajoute : tâche de référence (participants), bascule Kanban (sessions),
-- et la table `actions` (Kanban collaboratif) avec RLS + realtime.

-- 1) Tâche de référence : nom libre saisi par le participant au moment de rejoindre.
alter table public.participants
  add column if not exists tache_reference text;

-- 2) Bascule vers la phase Kanban actions (contrôlée par le formateur).
alter table public.sessions
  add column if not exists actions_open boolean not null default false;

-- 3) Table `actions` — Kanban partagé par session.
create table if not exists public.actions (
  id uuid primary key default gen_random_uuid(),
  session_code text not null references public.sessions(code) on delete cascade,
  participant_id uuid references public.participants(id) on delete set null,
  pseudo text not null,
  colonne text not null check (colonne in ('moi', 'entreprise')),
  element text check (element in ('verre', 'robinet', 'bulle', 'orage', 'paille')),
  texte text not null,
  created_at timestamptz not null default now()
);

create index if not exists actions_session_code_idx
  on public.actions (session_code);

-- 4) RLS : ouverte (pas d'auth dans l'app, comme `participants`).
alter table public.actions enable row level security;

drop policy if exists "actions_select_all" on public.actions;
create policy "actions_select_all" on public.actions
  for select using (true);

drop policy if exists "actions_insert_all" on public.actions;
create policy "actions_insert_all" on public.actions
  for insert with check (true);

drop policy if exists "actions_update_all" on public.actions;
create policy "actions_update_all" on public.actions
  for update using (true) with check (true);

drop policy if exists "actions_delete_all" on public.actions;
create policy "actions_delete_all" on public.actions
  for delete using (true);

-- 5) Realtime : diffuser les changements de la table `actions`.
alter publication supabase_realtime add table public.actions;
