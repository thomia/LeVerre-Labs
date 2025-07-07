"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { TypeWriter } from "@/components/ui/typewriter"

interface Page7StormExplanationProps {
  onComplete?: () => void
}

interface StormExplanationProps {
  onComplete: () => void
}

// Texte d'explication de l'orage
const stormExplanationText = `Découvrons maintenant l'élément "orage" et son impact sur les risques de TMS.

L'orage représente les aléas, perturbations et interruptions qui peuvent survenir lors de votre travail. Ces événements imprévus augmentent la charge mentale et physique, ce qui peut aggraver le risque de TMS.

Examinons les trois principaux facteurs qui caractérisent l'impact d'un aléa :

1. <u>L'impact</u> : 
C'est l'intensité de la perturbation. Une interruption mineure a peu d'impact, tandis qu'un problème majeur nécessitant une réorganisation complète du travail a un impact fort.

2. <u>La durée</u> : 
C'est le temps pendant lequel l'aléa affecte votre travail. Une perturbation courte (quelques minutes) est moins problématique qu'une perturbation qui dure plusieurs heures.

3. <u>La fréquence</u> : 
C'est le nombre d'occurrences de l'aléa sur une période donnée. Des interruptions rares sont plus faciles à gérer que des interruptions constantes.

Les aléas peuvent être classés en trois catégories principales :

• <u>Physiques</u> : 
Ce sont les perturbations liées à l'environnement ou aux équipements (panne, outil défectueux, coupure d'électricité, etc.). Ils peuvent forcer des postures contraignantes ou des efforts imprévus.

• <u>Mentaux</u> : 
Ce sont les interruptions qui exigent un changement d'attention ou une charge cognitive supplémentaire (appels téléphoniques, messages urgents, demandes d'aide de collègues). Ils augmentent le stress et peuvent modifier la façon de réaliser les gestes.

• <u>Organisationnels</u> : 
Ce sont les changements de planning, de priorités ou de tâches imposés par la hiérarchie ou les clients. Ils peuvent réduire le temps disponible et augmenter la précipitation, facteur important de risque de TMS.

Plus l'intensité de l'orage est élevée (combinaison d'impact, durée et fréquence), plus les gouttes tombant du nuage seront nombreuses et rapides, illustrant l'augmentation du risque.`

export default function Page7StormExplanation({ onComplete }: Page7StormExplanationProps) {
  const handleComplete = () => {
    if (onComplete) {
      setTimeout(onComplete, 500);
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh]"
    >
      <div className="prose prose-invert prose-headings:text-[#D4A017] prose-h2:mb-8 max-w-4xl mx-auto">
        <TypeWriter
          text={stormExplanationText}
          className="text-xl font-light text-white/90 leading-relaxed text-left whitespace-pre-line [&_u]:text-[#D4A017] [&_u]:font-medium"
          onComplete={handleComplete}
          speed={50}
          dangerouslySetInnerHTML={true}
        />
      </div>
    </motion.div>
  )
}
