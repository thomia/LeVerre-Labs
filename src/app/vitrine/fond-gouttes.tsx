'use client'

/**
 * Fond animé « la goutte d'eau ».
 *
 * Une trame de points fixes, posée en CSS, sur laquelle des ondes circulaires
 * se propagent : une goutte tombe, les points qu'elle traverse s'éclairent.
 * Le canvas ne dessine que les points touchés par une onde, jamais la trame
 * entière, ce qui garde l'animation à quelques centaines d'arcs par image.
 *
 * L'animation se met en pause hors écran et ne démarre pas du tout lorsque le
 * visiteur a demandé moins d'animations.
 */

import { useEffect, useRef } from 'react'

const ESPACEMENT = 30
const VITESSE = 118
const LARGEUR_ANNEAU = 62
const DUREE_ONDE = 5600
const INTERVALLE_GOUTTE = 1900
const COULEUR = '96, 165, 250'

interface Onde {
  x: number
  y: number
  depart: number
}

export function FondGouttes({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const contexte = canvas.getContext('2d')
    if (!contexte) return

    const animationsReduites = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (animationsReduites.matches) return

    let largeur = 0
    let hauteur = 0
    let ondes: Onde[] = []
    let image = 0
    let prochaineGoutte = 0
    let visible = true

    const ratio = Math.min(window.devicePixelRatio || 1, 2)

    function redimensionner() {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      largeur = rect.width
      hauteur = rect.height
      canvas.width = Math.round(largeur * ratio)
      canvas.height = Math.round(hauteur * ratio)
      contexte?.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    function ajouterOnde(x: number, y: number, instant: number) {
      ondes.push({ x, y, depart: instant })
      if (ondes.length > 6) ondes.shift()
    }

    function dessiner(instant: number) {
      image = requestAnimationFrame(dessiner)
      if (!visible || !contexte) return

      contexte.clearRect(0, 0, largeur, hauteur)

      if (instant > prochaineGoutte) {
        ajouterOnde(Math.random() * largeur, Math.random() * hauteur, instant)
        prochaineGoutte = instant + INTERVALLE_GOUTTE * (0.7 + Math.random() * 0.8)
      }

      ondes = ondes.filter((onde) => instant - onde.depart < DUREE_ONDE)

      for (const onde of ondes) {
        const age = instant - onde.depart
        const rayon = (age / 1000) * VITESSE
        const attenuation = Math.max(0, 1 - age / DUREE_ONDE)
        if (attenuation <= 0) continue

        // l'anneau lui-même, qui donne la lecture d'une onde à la surface
        contexte.beginPath()
        contexte.arc(onde.x, onde.y, rayon, 0, Math.PI * 2)
        contexte.strokeStyle = `rgba(${COULEUR}, ${(attenuation * 0.16).toFixed(3)})`
        contexte.lineWidth = 1.5
        contexte.stroke()

        const interne = Math.max(0, rayon - LARGEUR_ANNEAU)
        const externe = rayon + LARGEUR_ANNEAU
        const colonneMin = Math.floor((onde.x - externe) / ESPACEMENT)
        const colonneMax = Math.ceil((onde.x + externe) / ESPACEMENT)
        const ligneMin = Math.floor((onde.y - externe) / ESPACEMENT)
        const ligneMax = Math.ceil((onde.y + externe) / ESPACEMENT)

        for (let colonne = colonneMin; colonne <= colonneMax; colonne++) {
          const x = colonne * ESPACEMENT + ESPACEMENT / 2
          if (x < 0 || x > largeur) continue

          for (let ligne = ligneMin; ligne <= ligneMax; ligne++) {
            const y = ligne * ESPACEMENT + ESPACEMENT / 2
            if (y < 0 || y > hauteur) continue

            const distance = Math.hypot(x - onde.x, y - onde.y)
            if (distance < interne || distance > externe) continue

            const ecart = Math.abs(distance - rayon) / LARGEUR_ANNEAU
            const intensite = (1 - ecart * ecart) * attenuation
            if (intensite <= 0.02) continue

            contexte.beginPath()
            contexte.arc(x, y, 1 + intensite * 2.4, 0, Math.PI * 2)
            contexte.fillStyle = `rgba(${COULEUR}, ${Math.min(1, intensite * 1.25).toFixed(3)})`
            contexte.fill()
          }
        }
      }
    }

    /**
     * Le fond est en `pointer-events: none` pour ne jamais gêner les liens :
     * on écoute donc la fenêtre, et on ne retient que les clics tombant dans
     * la zone couverte par le canvas.
     */
    function auClic(evenement: PointerEvent) {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const x = evenement.clientX - rect.left
      const y = evenement.clientY - rect.top
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return
      ajouterOnde(x, y, performance.now())
    }

    redimensionner()
    // deux ondes déjà en vol au premier rendu : le fond n'est jamais inerte
    ajouterOnde(largeur * 0.68, hauteur * 0.34, performance.now() - 1500)
    ajouterOnde(largeur * 0.82, hauteur * 0.72, performance.now() - 200)
    image = requestAnimationFrame(dessiner)

    const observateur = new IntersectionObserver(
      ([entree]) => {
        visible = entree.isIntersecting
      },
      { threshold: 0 },
    )
    observateur.observe(canvas)

    window.addEventListener('resize', redimensionner)
    window.addEventListener('pointerdown', auClic)

    return () => {
      cancelAnimationFrame(image)
      observateur.disconnect()
      window.removeEventListener('resize', redimensionner)
      window.removeEventListener('pointerdown', auClic)
    }
  }, [])

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgb(255 255 255) 1px, transparent 1px)',
          backgroundSize: `${ESPACEMENT}px ${ESPACEMENT}px`,
          backgroundPosition: `${ESPACEMENT / 2}px ${ESPACEMENT / 2}px`,
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(0_0_0/0.9)_12%,rgb(0_0_0/0.5)_48%,transparent_78%)]" />
      <div className="absolute inset-0 bg-black/45 lg:hidden" />
    </div>
  )
}
