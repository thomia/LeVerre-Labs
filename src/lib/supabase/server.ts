/**
 * Client Supabase pour le serveur (API routes, Server Components, Route Handlers)
 * Utilise la clé service_role pour les opérations privilégiées (création de session)
 * /!\ NE JAMAIS IMPORTER CE FICHIER DANS DU CODE CLIENT
 *
 * Note : on n'utilise pas le générique Database (typage inline via les
 * fonctions utilisateur, voir types.ts).
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )
}
