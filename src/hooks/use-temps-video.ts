"use client"

/**
 * Suit la position de lecture d'un `<video>` image par image.
 *
 * L'événement `timeupdate` du navigateur ne se déclenche que 4 à 5 fois par
 * seconde : bien trop saccadé pour un verre qui doit se remplir de façon fluide
 * à l'écran. On lit donc `currentTime` dans une boucle `requestAnimationFrame`,
 * avec un seuil qui évite les rendus inutiles quand la vidéo est en pause.
 */

import { useEffect, useState, type RefObject } from 'react'

/** Écart minimal (en secondes de vidéo) avant de provoquer un nouveau rendu. */
const SEUIL = 0.03

export function useTempsVideo(videoRef: RefObject<HTMLVideoElement | null>): number {
  const [temps, setTemps] = useState(0)

  useEffect(() => {
    let image = 0
    let dernier = -1

    const boucle = () => {
      const video = videoRef.current

      if (video && Math.abs(video.currentTime - dernier) >= SEUIL) {
        dernier = video.currentTime
        setTemps(video.currentTime)
      }

      image = requestAnimationFrame(boucle)
    }

    image = requestAnimationFrame(boucle)

    return () => cancelAnimationFrame(image)
  }, [videoRef])

  return temps
}
