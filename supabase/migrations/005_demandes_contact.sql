-- Migration 005 — Demandes de contact commercial
-- Alimente le formulaire de la page /contact. Les demandes sont écrites par
-- l'API (clé service_role, voir src/app/api/contact/route.ts) : aucune
-- politique publique n'est ouverte, contrairement aux tables de session.

create table if not exists public.demandes_contact (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  organisation text not null,
  email text not null,
  telephone text,
  effectif text,
  besoin text not null,
  -- Page depuis laquelle la demande a été envoyée (utile pour savoir ce qui
  -- déclenche les prises de contact).
  origine text,
  traitee boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists demandes_contact_created_at_idx
  on public.demandes_contact (created_at desc);

-- RLS activée sans aucune politique : la table est invisible depuis la clé
-- anon utilisée par le navigateur. Seule la clé service_role (serveur) écrit
-- et lit. C'est volontaire : ces données sont des prospects, pas du contenu
-- public comme les sessions de formation.
alter table public.demandes_contact enable row level security;
