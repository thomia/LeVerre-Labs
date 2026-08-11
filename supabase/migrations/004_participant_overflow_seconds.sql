-- Migration 004 — Score final "temps avant débordement" (statistiques)
-- Ajoute une colonne pour figer, à la fin de la session, le temps avant
-- débordement de chaque participant (en secondes-modèle). NULL = le verre ne
-- déborde pas (récupération suffisante). Alimenté par l'action `end_session`
-- de l'API formateur (voir src/app/api/formation/[code]/control/route.ts).

alter table public.participants
  add column if not exists overflow_seconds numeric;

comment on column public.participants.overflow_seconds is
  'Score final "temps avant débordement" (secondes-modèle) figé en fin de session. NULL = pas de débordement.';
