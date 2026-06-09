-- =============================================================================
-- MIGRATION : Phase d'animation / simulation des verres
-- =============================================================================
-- À exécuter dans le SQL Editor de Supabase, AU-DESSUS de l'existant.
-- Cette migration est idempotente (on peut la rejouer sans casser).
-- =============================================================================

-- ---- sessions : démarrage de la simulation ---------------------------------
-- Quand le formateur lance la simulation, on stocke ici l'instant exact.
-- Tous les participants utilisent ce timestamp pour synchroniser leur animation
-- locale (chacun calcule son propre delta côté client).
-- NULL = pas encore lancée.
alter table public.sessions
  add column if not exists simulation_started_at timestamptz;

-- ---- participants : choix du scénario --------------------------------------
-- Chaque participant choisit AVANT le lancement la temporalité représentée
-- par sa simulation. Ne change rien à la dynamique du verre, juste à l'échelle
-- horaire affichée.
--
-- 'tache'   : ~1h compressée  (simulation_speed = 6)
-- 'journee' : ~8h compressées (simulation_speed = 48)
-- 'semaine' : ~40h compressées (simulation_speed = 240)
alter table public.participants
  add column if not exists simulation_scenario text
    check (simulation_scenario in ('tache', 'journee', 'semaine'));

-- =============================================================================
-- ✅ Migration terminée. Tu peux fermer cet onglet.
-- =============================================================================
