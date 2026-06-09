/**
 * API Route : POST /api/formation/create
 * Crée une nouvelle session de formation
 * Requiert le mot de passe formateur (défini dans .env.local)
 */

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { generateSessionCode } from '@/lib/session/generate-code'

export async function POST(request: Request) {
  try {
    const { password, timerDuration } = await request.json()

    // Vérification du mot de passe formateur
    if (password !== process.env.FORMATEUR_PASSWORD) {
      return NextResponse.json(
        { error: 'Mot de passe incorrect' },
        { status: 401 }
      )
    }

    const supabase = createAdminClient()

    // Tentative de création avec un code unique (anti-collision)
    let code = generateSessionCode()
    let attempts = 0
    const MAX_ATTEMPTS = 5

    while (attempts < MAX_ATTEMPTS) {
      const { data, error } = await supabase
        .from('sessions')
        .insert({
          code,
          status: 'waiting',
          current_element: null,
          timer_end_at: null,
          timer_duration: timerDuration ?? 120,
        })
        .select()
        .single()

      if (!error && data) {
        return NextResponse.json({ code: data.code }, { status: 201 })
      }

      // Erreur 23505 = violation de contrainte UNIQUE (code déjà pris)
      if (error?.code === '23505') {
        code = generateSessionCode()
        attempts++
        continue
      }

      // Autre erreur → on remonte
      console.error('[formation/create] Supabase error:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la création de la session' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Impossible de générer un code unique' },
      { status: 500 }
    )
  } catch (err) {
    console.error('[formation/create] Exception:', err)
    return NextResponse.json(
      { error: 'Requête invalide' },
      { status: 400 }
    )
  }
}
