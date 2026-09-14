"use client"

/**
 * Hook : useViewportHeight
 * Hauteur en pixels de la zone réellement visible du navigateur.
 *
 * Sur mobile, `window.innerHeight` inclut la place prise par la barre d'URL
 * quand elle est repliée : on privilégie `visualViewport.height`, qui suit la
 * zone effectivement affichée (barre d'URL, barre d'onglets, clavier).
 *
 * Sert à dimensionner en JS ce que CSS ne permet pas (hauteur d'un modèle
 * rendu en `transform: scale()`). Renvoie `null` avant l'hydratation pour
 * éviter toute divergence SSR / CSR.
 */

import { useEffect, useState } from 'react'

export function useViewportHeight(): number | null {
  const [height, setHeight] = useState<number | null>(null)

  useEffect(() => {
    const update = () =>
      setHeight(window.visualViewport?.height ?? window.innerHeight)

    update()

    const viewport = window.visualViewport
    viewport?.addEventListener('resize', update)
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)

    return () => {
      viewport?.removeEventListener('resize', update)
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  return height
}
