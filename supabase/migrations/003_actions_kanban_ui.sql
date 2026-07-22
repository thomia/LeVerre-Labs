-- Migration 003 — Refonte UI Actions
-- Le Kanban actions devient un pop-up formateur (état local, plus besoin de
-- synchroniser une phase via la session) : on retire `actions_open`.
-- On ajoute la colonne "à classer" (zone de dépôt par défaut avant tri).

-- 1) Plus besoin de piloter l'ouverture de la phase actions depuis la BDD :
--    c'est un pop-up local sur l'écran du formateur.
alter table public.sessions
  drop column if exists actions_open;

-- 2) Nouvelle colonne "à classer" : zone de dépôt par défaut avant que le
--    formateur trie l'action dans une des deux colonnes.
alter table public.actions
  drop constraint if exists actions_colonne_check;

alter table public.actions
  add constraint actions_colonne_check
  check (colonne in ('a_classer', 'moi', 'entreprise'));

alter table public.actions
  alter column colonne set default 'a_classer';
