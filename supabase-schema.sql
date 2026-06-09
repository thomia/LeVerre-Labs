-- =============================================================================
-- SCHEMA SUPABASE : Feature "Session Sensibilisation Collective"
-- =============================================================================
-- Instructions :
--   1. Ouvre ton projet Supabase
--   2. Va dans "SQL Editor" (icône dans la sidebar)
--   3. Clique "+ New query"
--   4. Copie-colle tout ce fichier
--   5. Clique "Run" (ou Ctrl+Enter)
-- =============================================================================

-- ---- Table : sessions (une par session de formation) -----------------------
create table if not exists public.sessions (
  code              text primary key,
  status            text not null default 'waiting'
                    check (status in ('waiting', 'active', 'ended')),
  current_element   text
                    check (current_element in ('verre', 'robinet', 'bulle', 'orage', 'paille')),
  timer_end_at      timestamptz,
  timer_duration    integer not null default 120,
  created_at        timestamptz not null default now()
);

comment on table public.sessions is 'Session de formation (offre 1 Sensibilisation 4h)';

-- ---- Table : participants --------------------------------------------------
create table if not exists public.participants (
  id              uuid primary key default gen_random_uuid(),
  session_code    text not null references public.sessions(code) on delete cascade,
  pseudo          text not null,
  scores          jsonb not null default '{}'::jsonb,
  answers         jsonb not null default '{}'::jsonb,
  joined_at       timestamptz not null default now()
);

create index if not exists idx_participants_session_code
  on public.participants(session_code);

comment on table public.participants is 'Participants connectés à une session';

-- ---- Row Level Security ----------------------------------------------------
alter table public.sessions      enable row level security;
alter table public.participants  enable row level security;

-- Sessions : lecture publique (un participant doit pouvoir lire l'état de sa session)
drop policy if exists "sessions_public_read" on public.sessions;
create policy "sessions_public_read"
  on public.sessions for select
  using (true);

-- Sessions : écriture UNIQUEMENT via service_role (API route formateur)
-- => pas de policy pour insert/update/delete = bloqué pour anon

-- Participants : lecture publique (formateur lit la mosaïque via anon key en realtime)
drop policy if exists "participants_public_read" on public.participants;
create policy "participants_public_read"
  on public.participants for select
  using (true);

-- Participants : les participants peuvent rejoindre (INSERT) une session
drop policy if exists "participants_can_join" on public.participants;
create policy "participants_can_join"
  on public.participants for insert
  with check (true);

-- Participants : les participants peuvent mettre à jour leurs propres réponses
-- (en prod, on pourrait sécuriser avec un token participant. Ici : open)
drop policy if exists "participants_can_update" on public.participants;
create policy "participants_can_update"
  on public.participants for update
  using (true)
  with check (true);

-- ---- Realtime : activer la réplication sur ces 2 tables --------------------
-- (Active le streaming des changements INSERT/UPDATE/DELETE vers les clients)
alter publication supabase_realtime add table public.sessions;
alter publication supabase_realtime add table public.participants;

-- =============================================================================
-- ✅ Terminé ! Tu peux fermer cet onglet.
-- =============================================================================
