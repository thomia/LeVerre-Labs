"use client"

/**
 * PAGE PARTICIPANT - Rejoindre une session
 * Route : /session/[code]
 *
 * 1) Si pas encore rejoint → formulaire de pseudo
 * 2) Après avoir rejoint → vue participant (son verre + questionnaires)
 */

import { use, useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { ParticipantJoin } from '@/components/formation/participant/ecran-rejoindre'
import { ParticipantView } from '@/components/formation/participant/vue-participant'
import { isValidSessionCode, normalizeSessionCode } from '@/lib/session/generate-code'

interface PageProps {
  params: Promise<{ code: string }>
}

// Clé localStorage pour persister l'identité participant en cas de refresh
const STORAGE_KEY = 'session_participant'

interface StoredParticipant {
  sessionCode: string
  id: string
  pseudo: string
}

export default function SessionPage({ params }: PageProps) {
  const { code: rawCode } = use(params)
  const code = normalizeSessionCode(rawCode)

  const [participant, setParticipant] = useState<StoredParticipant | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  // Validation du code : si invalide → 404
  if (!isValidSessionCode(code)) {
    notFound()
  }

  // Restauration depuis localStorage au mount (évite de se re-connecter après refresh)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const stored = JSON.parse(raw) as StoredParticipant
        if (stored.sessionCode === code) {
          setParticipant(stored)
        }
      }
    } catch {
      /* ignore */
    }
    setIsHydrated(true)
  }, [code])

  function handleJoined(id: string, pseudo: string) {
    const entry: StoredParticipant = { sessionCode: code, id, pseudo }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entry))
    setParticipant(entry)
  }

  // Layout adaptatif :
  //   - Avant de rejoindre (ParticipantJoin) : centré verticalement
  //   - Après avoir rejoint (ParticipantView split-screen) : aligné en haut
  //     pour laisser la place au split modèle + questionnaire sur mobile
  const wrapperClass = participant
    ? 'flex min-h-screen justify-center bg-gradient-to-br from-black via-slate-950 to-slate-900 px-3 py-4 sm:p-6'
    : 'flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-slate-950 to-slate-900 p-4'

  return (
    <div className={wrapperClass}>
      {!isHydrated ? (
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      ) : participant ? (
        <ParticipantView
          participantId={participant.id}
          pseudo={participant.pseudo}
          sessionCode={code}
        />
      ) : (
        <ParticipantJoin sessionCode={code} onJoined={handleJoined} />
      )}
    </div>
  )
}
