"use client"

import * as React from "react"
import { useCallback, useEffect, useState } from "react"
import { motion, useAnimation } from "framer-motion"

import { cn } from "@/lib/utils"

/**
 * MagnetizeFrame — Wrapper générique qui ajoute un "champ magnétique"
 * autour de n'importe quel contenu (bouton, image, carte…).
 *
 * Au survol, des billes rouges qui flottaient en orbite autour du
 * contenu viennent toutes converger au centre. Au départ du curseur,
 * elles repartent à leur position aléatoire avec un rebond.
 *
 * Pensé pour signaler "ça se clique" sans surcharger le visuel d'un
 * call-to-action textuel.
 *
 * Différence avec MagnetizeLink : ce composant ne porte ni texte ni
 * icône, c'est juste l'effet de particules autour d'enfants existants.
 */

interface MagnetizeFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  // Nombre de billes en orbite (plus = plus dense, mais plus coûteux).
  particleCount?: number
  // Rayon de dispersion initial des billes (en pixels). Doit être un
  // peu plus grand que la moitié du contenu pour que les billes
  // débordent du cadre au repos.
  spread?: number
}

interface Particle {
  id: number
  x: number
  y: number
}

export function MagnetizeFrame({
  className,
  children,
  particleCount = 18,
  spread = 200,
  ...props
}: MagnetizeFrameProps) {
  const [isAttracting, setIsAttracting] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const particlesControl = useAnimation()

  // Génère les positions initiales aléatoires une seule fois au mount.
  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * spread * 2 - spread,
      y: Math.random() * spread * 2 - spread,
    }))
    setParticles(newParticles)
  }, [particleCount, spread])

  // Au survol : les billes convergent vers le centre du wrapper.
  const handleInteractionStart = useCallback(async () => {
    setIsAttracting(true)
    await particlesControl.start({
      x: 0,
      y: 0,
      transition: { type: "spring", stiffness: 50, damping: 10 },
    })
  }, [particlesControl])

  // Au départ du curseur : retour à la position initiale, en élastique.
  const handleInteractionEnd = useCallback(async () => {
    setIsAttracting(false)
    await particlesControl.start((i) => ({
      x: particles[i].x,
      y: particles[i].y,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    }))
  }, [particlesControl, particles])

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      {...props}
    >
      {/* Billes positionnées au centre du wrapper et animées
          radialement par framer-motion. */}
      {particles.map((_, index) => (
        <motion.div
          key={index}
          custom={index}
          initial={{ x: particles[index].x, y: particles[index].y }}
          animate={particlesControl}
          className={cn(
            "pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-[rgb(255,30,90)]",
            "transition-opacity duration-300",
            isAttracting ? "opacity-100" : "opacity-50",
          )}
          style={{ boxShadow: "0 0 6px rgba(255,30,90,0.6)" }}
        />
      ))}
      {children}
    </div>
  )
}
