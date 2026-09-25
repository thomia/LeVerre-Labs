"use client"

/**
 * Écran d'entrée du module : choix de la vidéo + rappel du déroulé.
 *
 * La vidéo n'est jamais envoyée sur le réseau — elle est lue depuis le disque
 * via un object URL. Seul le découpage est conservé, dans le navigateur.
 */

import { useRef, useState, type DragEvent } from 'react'
import { FileVideo, Upload } from 'lucide-react'

interface EcranImportProps {
  onFichier: (fichier: File) => void
}

const ETAPES = [
  { titre: 'Lancer la vidéo', detail: 'Espace pour jouer, ×0,5 pour observer un geste au ralenti.' },
  { titre: 'Découper au fil de l’eau', detail: 'M au début du moment, M à la fin. La vidéo se met en pause.' },
  { titre: 'Noter en 10 gestes', detail: '5 curseurs de gravité + 4 cases d’importance par élément.' },
  { titre: 'Rejouer', detail: 'Le verre se remplit et se vide en suivant les moments traversés.' },
]

export function EcranImport({ onFichier }: EcranImportProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isSurvol, setIsSurvol] = useState(false)

  function depose(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsSurvol(false)

    const fichier = event.dataTransfer.files?.[0]
    if (fichier?.type.startsWith('video/')) onFichier(fichier)
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold text-white">Analyse rapide</h1>
        <p className="mt-1 text-sm text-white/50">
          Découpez une vidéo de poste en moments, notez-les sur les 5 éléments du modèle, et regardez le
          verre raconter l’activité pendant la lecture.
        </p>
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault()
          setIsSurvol(true)
        }}
        onDragLeave={() => setIsSurvol(false)}
        onDrop={depose}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-14 transition-colors ${
          isSurvol ? 'border-[rgb(255,30,90)] bg-[rgb(255,30,90)]/10' : 'border-white/15 bg-white/[0.02] hover:border-white/30'
        }`}
      >
        <div className="rounded-2xl bg-white/5 p-4">
          {isSurvol ? <FileVideo className="h-8 w-8 text-[rgb(255,30,90)]" /> : <Upload className="h-8 w-8 text-white/50" />}
        </div>
        <p className="text-sm font-medium text-white">Déposez une vidéo ici ou cliquez pour parcourir</p>
        <p className="text-xs text-white/35">Lecture locale uniquement — aucun envoi sur Internet.</p>

        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(event) => {
            const fichier = event.target.files?.[0]
            if (fichier) onFichier(fichier)
          }}
        />
      </div>

      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ETAPES.map((etape, index) => (
          <li key={etape.titre} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <span className="text-[10px] font-bold uppercase tracking-wide text-[rgb(255,30,90)]">
              Étape {index + 1}
            </span>
            <p className="mt-1 text-sm font-semibold text-white">{etape.titre}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-white/45">{etape.detail}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
