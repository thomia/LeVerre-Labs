/**
 * Client Supabase pour le navigateur (Client Components)
 * Utilisé côté browser uniquement avec la clé anon (publique)
 *
 * Note : on n'utilise pas le générique Database car les types complexes
 * de Supabase v2 sont mieux gérés via un casting explicite au niveau des
 * retours (voir types.ts pour les interfaces Session et Participant).
 */

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
