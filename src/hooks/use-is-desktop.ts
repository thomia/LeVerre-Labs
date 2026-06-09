"use client"

/**
 * Hook : useIsDesktop
 * Détecte si la fenêtre est en taille "desktop" (≥ 1024px, correspond au
 * breakpoint Tailwind `lg:`). Utile pour ajuster des dimensions qui ne peuvent
 * pas être gérées en pur CSS (ex. styles inline `height: ...px`).
 *
 * Le hook renvoie `false` côté serveur (pas de window) et lors du premier
 * render côté client, puis passe à `true` dès l'hydratation si la condition
 * est remplie. Ça évite toute divergence SSR / CSR.
 */

import { useEffect, useState } from 'react'

const DESKTOP_MEDIA_QUERY = '(min-width: 1024px)'

export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_MEDIA_QUERY)
    const update = () => setIsDesktop(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])

  return isDesktop
}
