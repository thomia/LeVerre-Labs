/**
 * Lecteur de l'essai 60 s — cadence lente, peu de texte, fond noir.
 */

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Play } from 'lucide-react'
import {
  DUREE_VIDEO_MS,
  etatModeleA,
  legendeA,
  VERRES_SALLE,
  visuelA,
} from '@/lib/video-vitrine/script-60s'
import { ModeleCinematique, VerreSilhouette } from './modele-cinematique'

export function LecteurEssai60s() {
  const prefereMouvementReduit = useReducedMotion()
  const [isPlaying, setIsPlaying] = useState(false)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const elapsedRef = useRef(0)
  const playingRef = useRef(false)
  const frameRef = useRef(0)
  const startedAtRef = useRef(0)

  elapsedRef.current = elapsedMs
  playingRef.current = isPlaying

  const isTermine = elapsedMs >= DUREE_VIDEO_MS
  const visuel = visuelA(Math.min(elapsedMs, DUREE_VIDEO_MS - 1))
  const etat = etatModeleA(elapsedMs)
  const legende =
    hasStarted && !isTermine && visuel !== 'accroche' ? legendeA(elapsedMs) : ''

  const arreterFrame = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
  }, [])

  useEffect(() => {
    if (!isPlaying || prefereMouvementReduit) return

    startedAtRef.current = performance.now() - elapsedRef.current

    function tick(now: number) {
      const suivant = Math.min(DUREE_VIDEO_MS, now - startedAtRef.current)
      elapsedRef.current = suivant
      setElapsedMs(suivant)
      if (suivant < DUREE_VIDEO_MS) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        playingRef.current = false
        setIsPlaying(false)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return arreterFrame
  }, [isPlaying, prefereMouvementReduit, arreterFrame])

  const lancer = useCallback(() => {
    if (prefereMouvementReduit) return
    if (elapsedRef.current >= DUREE_VIDEO_MS) {
      elapsedRef.current = 0
      setElapsedMs(0)
    }
    setHasStarted(true)
    setIsPlaying(true)
  }, [prefereMouvementReduit])

  const basculer = useCallback(() => {
    if (!playingRef.current && elapsedRef.current >= DUREE_VIDEO_MS) {
      lancer()
      return
    }
    if (!playingRef.current && elapsedRef.current === 0) {
      lancer()
      return
    }
    setIsPlaying((actuel) => !actuel)
  }, [lancer])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.code !== 'Space') return
      const cible = event.target as HTMLElement | null
      if (cible && ['INPUT', 'TEXTAREA', 'BUTTON'].includes(cible.tagName)) return
      event.preventDefault()
      basculer()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [basculer])

  const afficherPlay =
    !prefereMouvementReduit && (!hasStarted || (!isPlaying && !isTermine) || isTermine)

  return (
    <div className="mx-auto w-full max-w-5xl">
      <button
        type="button"
        onClick={basculer}
        aria-label={isPlaying ? 'Mettre en pause' : 'Lire la séquence de 60 secondes'}
        className="relative aspect-video w-full overflow-hidden bg-black text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/40"
      >
        {hasStarted && !isTermine && visuel === 'accroche' && <SceneAccroche />}
        {hasStarted && !isTermine && visuel === 'modele' && (
          <div className="absolute inset-0 flex items-center justify-center pb-16">
            <ModeleCinematique etat={etat} />
          </div>
        )}
        {hasStarted && !isTermine && visuel === 'salle' && (
          <div className="absolute inset-0 flex items-center justify-center pb-16">
            <SceneSalle />
          </div>
        )}
        {hasStarted && !isTermine && visuel === 'offre' && <SceneOffre />}
        {isTermine && <SceneOffre />}
        {!hasStarted && <SceneAccroche />}

        {legende ? (
          <p className="absolute bottom-10 left-0 right-0 px-8 text-center text-[15px] font-light leading-snug tracking-wide text-white/85 sm:text-lg">
            {legende}
          </p>
        ) : null}

        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10">
          <div
            className="h-full bg-white/40"
            style={{
              width: `${(Math.min(elapsedMs, DUREE_VIDEO_MS) / DUREE_VIDEO_MS) * 100}%`,
            }}
          />
        </div>

        {afficherPlay && (
          <span
            className={
              hasStarted
                ? 'absolute bottom-8 right-8 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/25'
                : 'absolute left-1/2 top-[72%] z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-white/25'
            }
          >
            <Play className="ml-0.5 h-4 w-4 fill-white text-white" />
          </span>
        )}
      </button>
    </div>
  )
}

function SceneAccroche() {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-10 pb-8">
      <p className="max-w-2xl text-center text-2xl font-light leading-snug tracking-tight text-white/90 sm:text-3xl md:text-[2.1rem]">
        88 % des maladies professionnelles
        <br />
        viennent du geste au travail.
      </p>
    </div>
  )
}

function SceneSalle() {
  return (
    <div className="grid grid-cols-6 items-end gap-3 sm:gap-6">
      {VERRES_SALLE.map((verre, index) => (
        <VerreSilhouette
          key={index}
          remplissage={verre.remplissage}
          className="justify-self-center"
        />
      ))}
    </div>
  )
}

function SceneOffre() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-8 pb-6">
      <p className="text-center text-xl font-light tracking-tight text-white/90 sm:text-2xl">
        Aujourd’hui : sensibiliser une équipe.
      </p>
      <p className="text-center text-base font-light text-white/40 sm:text-lg">
        Ensuite, analyser, former, transformer.
      </p>
      <p className="text-sm tracking-wide">
        <span className="text-[rgb(255,30,90)]">LeVerre</span>{' '}
        <span className="text-white/45">Labs</span>
      </p>
    </div>
  )
}
