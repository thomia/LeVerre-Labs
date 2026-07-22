/**
 * PAGE FORMATEUR - Session en cours
 * Route : /formation/[code]
 * Écran central projeté en salle
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server'
import { isValidSessionCode, normalizeSessionCode } from '@/lib/session/generate-code'
import { FormateurDashboard } from '@/components/formation/animateur/tableau-de-bord'
import { FormateurAuthGate } from '@/components/formation/animateur/verrou-mot-de-passe'

interface PageProps {
  params: Promise<{ code: string }>
}

// Session privée liée à un code unique : jamais indexée.
export const metadata: Metadata = {
  title: 'Session de formation',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function FormationSessionPage({ params }: PageProps) {
  const { code: rawCode } = await params
  const code = normalizeSessionCode(rawCode)

  if (!isValidSessionCode(code)) {
    notFound()
  }

  // Vérification : la session existe bien en base
  const supabase = createAdminClient()
  const { data: session, error } = await supabase
    .from('sessions')
    .select('code')
    .eq('code', code)
    .maybeSingle()

  if (error || !session) {
    notFound()
  }

  return (
    <FormateurAuthGate code={code}>
      <FormateurDashboard code={code} />
    </FormateurAuthGate>
  )
}
