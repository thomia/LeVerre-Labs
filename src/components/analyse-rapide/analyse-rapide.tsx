"use client"

/**
 * ANALYSE RAPIDE — découper une vidéo de poste au fil de l'eau et voir le
 * modèle du verre réagir en direct.
 *
 * Disposition pensée pour la capture d'écran (16:9) :
 *
 *   ┌──────────────────────────┬───────────────┬──────────────┐
 *   │  vidéo                   │  notation du  │   verre      │
 *   │                          │  moment       │   vivant     │
 *   ├──────────────────────────┤  (colonne qui │   + les 5    │
 *   │  frise + courbe du verre │   s'ouvre)    │   scores     │
 *   └──────────────────────────┴───────────────┴──────────────┘
 *
 * L'image reste à gauche (là où l'œil va d'abord), le verre reste à droite et
 * n'est JAMAIS masqué : quand le panneau de notation s'ouvre, la vidéo se
 * rétrécit, pas le modèle. Bouger un curseur fait donc monter le verre à
 * l'écran pendant qu'on explique pourquoi on le bouge — c'est l'effet
 * recherché pour la vidéo.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, Eye, Keyboard, RotateCcw } from 'lucide-react'
import { useTempsVideo } from '@/hooks/use-temps-video'
import { useDecoupageMoments } from '@/hooks/use-decoupage-moments'
import {
  PROJECTIONS,
  PROJECTION_PAR_DEFAUT,
  chargeAnalyse,
  cleAnalyse,
  construitSegments,
  courbeNiveau,
  facteurProjection,
  formateDuree,
  niveauAuTemps,
  notationsParDefaut,
  sauvegardeAnalyse,
  scoresDuMoment,
  scoresRepos,
  travailAvantDebordement,
  travailEcoule,
  segmentAuTemps,
  tauxParMinute,
  projectionValide,
  type MomentAnalyse,
  type ProjectionId,
} from '@/lib/analyse-rapide'
import { EcranImport } from './ecran-import'
import { LecteurVideo } from './lecteur-video'
import { FriseMoments } from './frise-moments'
import { PanneauNotation } from './panneau-notation'
import { SceneVerreVivant } from './scene-verre-vivant'
import { BandeauScores } from './bandeau-scores'

/**
 * Ajoute le moment en cours de découpage à la liste, tant qu'il n'empiète pas
 * sur un moment déjà noté. Il hérite des notations du moment précédent, comme
 * le fera le moment définitif : la transition est invisible à la validation.
 */
function avecMomentProvisoire(
  moments: MomentAnalyse[],
  debut: number | null,
  temps: number
): MomentAnalyse[] {
  if (debut === null || temps <= debut) return moments
  if (moments.some((moment) => moment.debut < temps && moment.fin > debut)) return moments

  const precedent = moments.filter((moment) => moment.debut < debut).pop()

  return [
    ...moments,
    {
      id: 'moment-provisoire',
      nom: 'Moment en cours',
      debut,
      fin: temps,
      notations: precedent?.notations ?? notationsParDefaut(),
      commentaire: '',
    },
  ]
}

const RACCOURCIS = [
  ['Espace', 'lecture / pause'],
  ['M', 'début puis fin du moment'],
  ['← →', 'reculer / avancer de 5 s'],
  ['Échap', 'annuler ou fermer'],
  ['F', 'mode focus'],
]

export function AnalyseRapide() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const conteneurRef = useRef<HTMLDivElement>(null)

  const [videoSrc, setVideoSrc] = useState<string | null>(null)
  const [nomFichier, setNomFichier] = useState('')
  const [titre, setTitre] = useState('')
  const [duree, setDuree] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [vitesse, setVitesse] = useState(1)
  const [projection, setProjection] = useState<ProjectionId>(PROJECTION_PAR_DEFAUT)
  const [modeFocus, setModeFocus] = useState(false)
  const [afficheRaccourcis, setAfficheRaccourcis] = useState(false)
  const [isPleinEcran, setIsPleinEcran] = useState(false)

  const [decoupageEnCours, setDecoupageEnCours] = useState<number | null>(null)
  const [momentSelectionneId, setMomentSelectionneId] = useState<string | null>(null)
  const [isNotationOuverte, setIsNotationOuverte] = useState(false)

  const { moments, creeMoment, majMoment, ajusteBornes, supprimeMoment, remplaceMoments } =
    useDecoupageMoments()

  const temps = useTempsVideo(videoRef)
  const facteur = facteurProjection(projection, duree)

  const momentSelectionne = moments.find((moment) => moment.id === momentSelectionneId) ?? null
  const courbe = useMemo(
    () => courbeNiveau(construitSegments(moments, duree), duree, 240, facteur),
    [moments, duree, facteur]
  )

  // Le moment en cours de découpage compte déjà dans la simulation, avec les
  // notations dont il héritera : le verre vit pendant qu'on découpe, pas
  // seulement une fois le moment validé.
  const segments = construitSegments(avecMomentProvisoire(moments, decoupageEnCours, temps), duree)

  // Pendant la notation, on fige la simulation à la fin du moment noté : chaque
  // curseur déplacé montre immédiatement le niveau que ce moment laisse dans le
  // verre, au lieu du niveau atteint là où la lecture s'est arrêtée.
  const tempsSimule = isNotationOuverte && momentSelectionne ? momentSelectionne.fin : temps
  const segmentActif = segmentAuTemps(segments, tempsSimule)

  const scores =
    isNotationOuverte && momentSelectionne
      ? scoresDuMoment(momentSelectionne.notations)
      : segmentActif?.scores ?? scoresRepos()

  const niveau = niveauAuTemps(segments, tempsSimule, facteur)
  // Arrondi au demi-point : évite de re-rendre toute la scène à chaque image
  // sans que l'œil y perde quoi que ce soit (le verre s'anime sur 0,5 s).
  const niveauAffiche = Math.round(niveau * 2) / 2
  // Le taux affiché est celui de la physique, par minute de travail : la
  // projection ne change que la vitesse à laquelle ce temps défile.
  const taux = tauxParMinute(scores)

  const momentTraverse = segmentActif?.momentId
    ? moments.find((moment) => moment.id === segmentActif.momentId)?.nom ?? null
    : null

  function ouvreVideo(fichier: File) {
    setVideoSrc((ancien) => {
      if (ancien) URL.revokeObjectURL(ancien)
      return URL.createObjectURL(fichier)
    })
    setNomFichier(fichier.name)
    setTitre(fichier.name.replace(/\.[^.]+$/, ''))
  }

  function chargeMetadonnees(dureeVideo: number) {
    setDuree(dureeVideo)

    const sauvegarde = chargeAnalyse(cleAnalyse(nomFichier, dureeVideo))
    if (!sauvegarde) return

    remplaceMoments(sauvegarde.moments)
    setProjection(projectionValide(sauvegarde.projection))
    setTitre(sauvegarde.titre)
  }

  const basculeLecture = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      void video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }, [])

  const deplace = useCallback((delta: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + delta))
  }, [])

  const seek = useCallback((valeur: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.max(0, Math.min(video.duration || 0, valeur))
  }, [])

  const ouvreNotation = useCallback((id: string) => {
    setMomentSelectionneId(id)
    setIsNotationOuverte(true)

    const video = videoRef.current
    if (video && !video.paused) {
      video.pause()
      setIsPlaying(false)
    }
  }, [])

  const fermeNotation = useCallback(() => {
    setIsNotationOuverte(false)

    const video = videoRef.current
    if (video && video.paused) {
      void video.play()
      setIsPlaying(true)
    }
  }, [])

  /** Clic début → clic fin → panneau de notation. */
  const basculeDecoupage = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (decoupageEnCours === null) {
      setDecoupageEnCours(video.currentTime)
      if (video.paused) {
        void video.play()
        setIsPlaying(true)
      }
      return
    }

    const identifiant = creeMoment(decoupageEnCours, video.currentTime)
    setDecoupageEnCours(null)
    if (identifiant) ouvreNotation(identifiant)
  }, [creeMoment, decoupageEnCours, ouvreNotation])

  const annule = useCallback(() => {
    if (decoupageEnCours !== null) {
      setDecoupageEnCours(null)
      return
    }

    setIsNotationOuverte(false)
  }, [decoupageEnCours])

  // Raccourcis clavier : l'analyse se pilote d'une main pendant qu'on parle.
  useEffect(() => {
    if (!videoSrc) return

    function surTouche(event: KeyboardEvent) {
      const cible = event.target as HTMLElement | null
      const isSaisie =
        cible?.tagName === 'INPUT' || cible?.tagName === 'TEXTAREA' || cible?.getAttribute('role') === 'slider'

      if (isSaisie && event.key !== 'Escape') return

      switch (event.key) {
        case ' ':
          event.preventDefault()
          basculeLecture()
          break
        case 'm':
        case 'M':
          event.preventDefault()
          basculeDecoupage()
          break
        case 'ArrowLeft':
          event.preventDefault()
          deplace(-5)
          break
        case 'ArrowRight':
          event.preventDefault()
          deplace(5)
          break
        case 'Escape':
          annule()
          break
        case 'f':
        case 'F':
          setModeFocus((actuel) => !actuel)
          break
        default:
      }
    }

    window.addEventListener('keydown', surTouche)
    return () => window.removeEventListener('keydown', surTouche)
  }, [annule, basculeDecoupage, basculeLecture, deplace, videoSrc])

  useEffect(() => {
    const video = videoRef.current
    if (video) video.playbackRate = vitesse
  }, [vitesse, videoSrc])

  // Le mode focus passe l'outil en plein écran natif : plus de navbar ni
  // d'onglets à l'image, la capture d'écran ne montre que la vidéo, la frise et
  // le verre.
  useEffect(() => {
    const conteneur = conteneurRef.current
    if (!conteneur) return

    if (modeFocus && !document.fullscreenElement) void conteneur.requestFullscreen?.().catch(() => {})
    if (!modeFocus && document.fullscreenElement) void document.exitFullscreen?.().catch(() => {})
  }, [modeFocus])

  useEffect(() => {
    function surChangement() {
      const actif = Boolean(document.fullscreenElement)
      setIsPleinEcran(actif)
      if (!actif) setModeFocus(false)
    }

    document.addEventListener('fullscreenchange', surChangement)
    return () => document.removeEventListener('fullscreenchange', surChangement)
  }, [])

  // Sauvegarde locale : une analyse commentée dure une heure, un
  // rafraîchissement ne doit pas la faire disparaître.
  useEffect(() => {
    if (!nomFichier || duree <= 0 || moments.length === 0) return

    const minuteur = setTimeout(() => {
      sauvegardeAnalyse(cleAnalyse(nomFichier, duree), { titre, moments, projection })
    }, 400)

    return () => clearTimeout(minuteur)
  }, [duree, moments, nomFichier, projection, titre])

  useEffect(() => {
    return () => {
      if (videoSrc) URL.revokeObjectURL(videoSrc)
    }
  }, [videoSrc])

  function exporte() {
    const donnees = {
      titre,
      fichier: nomFichier,
      duree,
      projection,
      moments: moments.map((moment) => ({
        nom: moment.nom,
        debut: moment.debut,
        fin: moment.fin,
        commentaire: moment.commentaire,
        scores: scoresDuMoment(moment.notations),
        notations: moment.notations,
      })),
    }

    const lien = document.createElement('a')
    const url = URL.createObjectURL(new Blob([JSON.stringify(donnees, null, 2)], { type: 'application/json' }))
    lien.href = url
    lien.download = `${titre || 'analyse-rapide'}.json`
    lien.click()
    URL.revokeObjectURL(url)
  }

  if (!videoSrc) return <EcranImport onFichier={ouvreVideo} />

  return (
    <div
      ref={conteneurRef}
      className={`flex flex-col gap-2 bg-slate-950 px-3 pb-4 ${
        isPleinEcran ? 'h-dvh pt-3' : 'h-[calc(100dvh-9rem)]'
      }`}
    >
      {!modeFocus && (
        <header className="flex flex-wrap items-center gap-2 pt-1">
          <input
            value={titre}
            onChange={(event) => setTitre(event.target.value)}
            placeholder="Poste analysé"
            className="w-56 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-white outline-none transition-colors focus:border-white/30"
          />

          <span className="rounded-lg bg-white/5 px-2.5 py-1.5 text-[11px] text-white/45">
            {moments.length} moment{moments.length > 1 ? 's' : ''} · {formateDuree(duree)}
          </span>

          <div className="flex items-center gap-1 rounded-lg bg-white/5 p-1">
            <span className="px-1.5 text-[10px] uppercase tracking-wide text-white/35">
              La séquence représente
            </span>
            {PROJECTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setProjection(option.id)}
                title={option.aide}
                className={`rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
                  projection === option.id ? 'bg-white/20 text-white' : 'text-white/45 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setAfficheRaccourcis((actuel) => !actuel)}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] text-white/45 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Keyboard className="h-3.5 w-3.5" />
              Raccourcis
            </button>
            <button
              type="button"
              onClick={exporte}
              disabled={moments.length === 0}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] text-white/45 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
            >
              <Download className="h-3.5 w-3.5" />
              Exporter
            </button>
            <button
              type="button"
              onClick={() => setModeFocus(true)}
              className="flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-white/20"
            >
              <Eye className="h-3.5 w-3.5" />
              Mode focus
            </button>
          </div>

          <AnimatePresence>
            {afficheRaccourcis && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex w-full flex-wrap gap-x-4 gap-y-1 overflow-hidden text-[11px] text-white/40"
              >
                {RACCOURCIS.map(([touche, action]) => (
                  <li key={touche}>
                    <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-medium text-white/70">{touche}</kbd>{' '}
                    {action}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </header>
      )}

      {modeFocus && (
        <button
          type="button"
          onClick={() => setModeFocus(false)}
          className="fixed right-4 top-4 z-30 flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-[11px] text-white/70 backdrop-blur transition-colors hover:bg-white/20"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Quitter le focus
        </button>
      )}

      <div className="flex min-h-0 flex-1 gap-2">
        <motion.div layout className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
          <LecteurVideo
            videoRef={videoRef}
            src={videoSrc}
            isPlaying={isPlaying}
            isMuted={isMuted}
            temps={temps}
            duree={duree}
            vitesse={vitesse}
            decoupageEnCours={decoupageEnCours}
            onTogglePlay={basculeLecture}
            onToggleMuet={() => {
              const video = videoRef.current
              if (!video) return
              video.muted = !video.muted
              setIsMuted(video.muted)
            }}
            onDeplacer={deplace}
            onVitesse={setVitesse}
            onBasculeDecoupage={basculeDecoupage}
            onMetadonnees={chargeMetadonnees}
          />

          <FriseMoments
            moments={moments}
            duree={duree}
            temps={temps}
            courbe={courbe}
            momentSelectionneId={momentSelectionneId}
            decoupageEnCours={decoupageEnCours}
            onSeek={seek}
            onSelectionner={(id) => {
              setMomentSelectionneId(id)
              if (!modeFocus) setIsNotationOuverte(true)
            }}
            onAjusterBornes={ajusteBornes}
          />
        </motion.div>

        <AnimatePresence initial={false}>
          {isNotationOuverte && momentSelectionne && !modeFocus && (
            <motion.div
              layout
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 420, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="min-h-0 shrink-0 overflow-hidden"
            >
              <div className="h-full w-[420px]">
                <PanneauNotation
                  moment={momentSelectionne}
                  onChange={majMoment}
                  onSupprimer={() => {
                    supprimeMoment(momentSelectionne.id)
                    setMomentSelectionneId(null)
                    setIsNotationOuverte(false)
                  }}
                  onFermer={fermeNotation}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          className={`flex min-h-0 min-w-[300px] flex-col gap-2 ${modeFocus ? 'w-[44%]' : 'w-[36%]'}`}
        >
          <div className="min-h-0 flex-1 rounded-2xl border border-white/10 bg-slate-950/40">
            <SceneVerreVivant scores={scores} niveau={niveauAffiche} />
          </div>

          <BandeauScores
            scores={scores}
            niveau={niveauAffiche}
            taux={taux}
            avantDebordement={travailAvantDebordement(scores, niveauAffiche)}
            travailEcoule={travailEcoule(projection, tempsSimule, duree)}
            momentActif={isNotationOuverte && momentSelectionne ? momentSelectionne.nom : momentTraverse}
          />
        </motion.div>
      </div>
    </div>
  )
}
