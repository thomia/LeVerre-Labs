"use client"

import * as React from "react"
import { useCallback, useEffect, useState } from "react"
import { motion, useAnimation } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * MagnetizeLink — Lien stylisé en bouton-pilule avec un effet
 * "champ magnétique" : des billes rouges flottent autour du bouton
 * au repos, et viennent toutes se rassembler au centre quand
 * l'utilisateur survole l'élément.
 *
 * Pensé pour mettre en valeur un lien externe sans crier (texte
 * simple + flèche), tout en récompensant l'interaction par une
 * petite animation organique.
 */

interface MagnetizeLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  particleCount?: number
}

interface Particle {
  id: number
  x: number
  y: number
}

function MagnetizeLink({
  className,
  particleCount = 14,
  children,
  ...props
}: MagnetizeLinkProps) {
  const [isAttracting, setIsAttracting] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const particlesControl = useAnimation()

  // Position de départ aléatoire pour chaque bille (autour du
  // bouton, dans un rayon de ±180px sur chaque axe).
  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 360 - 180,
      y: Math.random() * 360 - 180,
    }))
    setParticles(newParticles)
  }, [particleCount])

  // Au survol : toutes les billes convergent vers le centre.
  const handleInteractionStart = useCallback(async () => {
    setIsAttracting(true)
    await particlesControl.start({
      x: 0,
      y: 0,
      transition: { type: "spring", stiffness: 50, damping: 10 },
    })
  }, [particlesControl])

  // Au départ du curseur : les billes retournent à leur position
  // initiale aléatoire avec un petit rebond élastique.
  const handleInteractionEnd = useCallback(async () => {
    setIsAttracting(false)
    await particlesControl.start((i) => ({
      x: particles[i].x,
      y: particles[i].y,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    }))
  }, [particlesControl, particles])

  return (
    <a
      className={cn(
        "group relative inline-flex min-w-44 touch-none items-center justify-center gap-2 overflow-visible rounded-full",
        "border border-[rgb(255,30,90)]/40 bg-white/[0.02] px-6 py-3",
        "text-sm font-medium text-white",
        "transition-all duration-300",
        "hover:border-[rgb(255,30,90)]/80 hover:bg-[rgb(255,30,90)]/[0.06]",
        className,
      )}
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      {...props}
    >
      {particles.map((_, index) => (
        <motion.div
          key={index}
          custom={index}
          initial={{ x: particles[index].x, y: particles[index].y }}
          animate={particlesControl}
          className={cn(
            "pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-[rgb(255,30,90)]",
            "transition-opacity duration-300",
            isAttracting ? "opacity-100" : "opacity-50",
          )}
          style={{ boxShadow: "0 0 6px rgba(255,30,90,0.6)" }}
        />
      ))}
      <span className="relative flex items-center gap-2">
        {children}
        <ArrowRight
          className={cn(
            "h-4 w-4 transition-transform duration-300",
            isAttracting && "translate-x-0.5",
          )}
          strokeWidth={2}
        />
      </span>
    </a>
  )
}

export { MagnetizeLink }
