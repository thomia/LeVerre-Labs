/** Formatage des timecodes de l'analyse vidéo. */

/** `M:SS` (ou `M:SS.d` avec les dixièmes, utile sur des moments très courts). */
export function formateTemps(secondes: number, avecDixiemes = false): string {
  const valeur = Math.max(0, secondes)
  const minutes = Math.floor(valeur / 60)
  const reste = valeur - minutes * 60
  const entier = Math.floor(reste)
  const base = `${minutes}:${entier.toString().padStart(2, '0')}`

  if (!avecDixiemes) return base
  return `${base}.${Math.floor((reste - entier) * 10)}`
}

/** Durée courte : `12 s` ou `1 min 05`. */
export function formateDuree(secondes: number): string {
  const valeur = Math.max(0, Math.round(secondes))
  if (valeur < 60) return `${valeur} s`

  const minutes = Math.floor(valeur / 60)
  const reste = valeur % 60
  return `${minutes} min ${reste.toString().padStart(2, '0')}`
}
