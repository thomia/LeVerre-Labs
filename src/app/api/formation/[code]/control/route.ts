/**
 * API Route : POST /api/formation/[code]/control
 * Actions de contrôle du formateur sur une session en cours.
 * Requiert le mot de passe formateur à chaque appel.
 *
 * Actions supportées :
 *   - "start_element"  : lancer le questionnaire d'un élément
 *   - "stop_element"   : arrêter le questionnaire en cours
 *   - "end_session"    : terminer la session (passage à l'écran récap)
 *   - "reset"          : remettre à zéro (retour à l'état "waiting")
 */

import { NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createAdminClient } from '@/lib/supabase/server'
import { isValidSessionCode, normalizeSessionCode } from '@/lib/session/generate-code'
import { computeOverflowSeconds } from '@/lib/indicateur'
import type { ParticipantScores } from '@/lib/supabase/types'

type ElementId = 'verre' | 'robinet' | 'bulle' | 'orage' | 'paille'

interface ControlBody {
  password: string
  action:
    | 'start_element'
    | 'stop_element'
    | 'end_session'
    | 'reset'
    | 'start_simulation'
    | 'stop_simulation'
  element?: ElementId
  timerDurationSeconds?: number
}

const VALID_ELEMENTS: ElementId[] = ['verre', 'robinet', 'bulle', 'orage', 'paille']

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code: rawCode } = await params
    const code = normalizeSessionCode(rawCode)

    if (!isValidSessionCode(code)) {
      return NextResponse.json({ error: 'Code de session invalide' }, { status: 400 })
    }

    const body = (await request.json()) as ControlBody

    if (!process.env.FORMATEUR_PASSWORD) {
      return NextResponse.json(
        {
          error:
            "Accès formateur non configuré sur cet environnement (variable FORMATEUR_PASSWORD manquante).",
        },
        { status: 500 }
      )
    }

    if (body.password !== process.env.FORMATEUR_PASSWORD) {
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
    }

    const supabase = createAdminClient()

    // Construction du patch selon l'action
    let update: Record<string, unknown>

    switch (body.action) {
      case 'start_element': {
        if (!body.element || !VALID_ELEMENTS.includes(body.element)) {
          return NextResponse.json(
            { error: "Élément manquant ou invalide" },
            { status: 400 }
          )
        }
        const timerSec = body.timerDurationSeconds ?? 120
        const timerEndAt = new Date(Date.now() + timerSec * 1000).toISOString()
        update = {
          status: 'active',
          current_element: body.element,
          timer_end_at: timerEndAt,
          timer_duration: timerSec,
        }
        break
      }
      case 'stop_element': {
        update = {
          status: 'active',
          current_element: null,
          timer_end_at: null,
        }
        break
      }
      case 'end_session': {
        // On fige les scores finaux "temps avant débordement" pour les stats
        // avant de basculer la session en état terminé.
        await snapshotOverflowSeconds(supabase, code)
        update = {
          status: 'ended',
          current_element: null,
          timer_end_at: null,
          simulation_started_at: null,
        }
        break
      }
      // Lecture animée synchronisée : on diffuse l'instant de lancement à tous
      // les participants (et à la mosaïque formateur) via `simulation_started_at`.
      case 'start_simulation': {
        update = { simulation_started_at: new Date().toISOString() }
        break
      }
      case 'stop_simulation': {
        update = { simulation_started_at: null }
        break
      }
      case 'reset': {
        update = {
          status: 'waiting',
          current_element: null,
          timer_end_at: null,
          simulation_started_at: null,
        }
        break
      }
      default:
        return NextResponse.json({ error: 'Action inconnue' }, { status: 400 })
    }

    const { error } = await supabase
      .from('sessions')
      .update(update)
      .eq('code', code)

    if (error) {
      console.error('[formation/control] Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, applied: update })
  } catch (err) {
    console.error('[formation/control] Exception:', err)
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }
}

/**
 * Fige le score final "temps avant débordement" (en secondes, `null` = ne
 * déborde pas) de chaque participant de la session, à partir de ses scores
 * courants. Utilisé pour les statistiques post-session. Best-effort : on ne
 * bloque pas la fin de session si l'écriture échoue.
 */
async function snapshotOverflowSeconds(
  supabase: SupabaseClient,
  code: string
): Promise<void> {
  const { data, error } = await supabase
    .from('participants')
    .select('id, scores')
    .eq('session_code', code)

  if (error || !data) {
    if (error) console.error('[formation/control] snapshot select:', error)
    return
  }

  await Promise.all(
    data.map((row) => {
      const scores = (row.scores ?? {}) as ParticipantScores
      const overflow = computeOverflowSeconds(scores)
      return supabase
        .from('participants')
        .update({ overflow_seconds: overflow })
        .eq('id', row.id)
    })
  )
}
