"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { TypeWriter } from "@/components/ui/typewriter"

interface Page9StrawExplanationProps {
  onComplete?: () => void
}

interface StrawExplanationProps {
  onComplete: () => void
}

// Texte d'explication de la paille
const strawExplanationText = `Découvrons maintenant l'élément "paille" et son rôle dans la prévention des TMS.

La paille représente les mécanismes de récupération qui permettent de réduire la charge accumulée dans le verre. Elle symbolise tous les facteurs qui facilitent la récupération et la régénération de l'organisme.

Examinons les quatre principaux facteurs qui influencent la capacité de récupération :

1. <u>Les pauses actives</u> : 
En plus des pauses légales obligatoires, les pauses actives sont des moments courts mais réguliers pendant lesquels vous changez de position, faites quelques mouvements ou organisez votre travail. Leur fréquence et leur durée sont essentielles pour prévenir la fatigue musculosquelettique.

2. <u>Les étirements</u> : 
Les exercices d'étirement permettent de détendre les muscles sollicités pendant le travail. Pratiqués régulièrement, notamment le matin avant de commencer l'activité, ils préparent le corps à l'effort et facilitent la récupération.

3. <u>La relaxation</u> : 
Les techniques de relaxation (respiration, méditation, etc.) réduisent le stress et la tension musculaire. Elles favorisent un meilleur équilibre mental et physique, essentiel pour prévenir les TMS.

4. <u>La qualité du sommeil</u> : 
Le sommeil est un facteur majeur de récupération. Sa durée (idéalement entre 7 et 9 heures) et sa qualité déterminent la capacité de l'organisme à se régénérer après l'effort.

Plus la capacité de récupération est élevée, plus la paille sera efficace pour absorber l'eau du verre, symbolisant la réduction des risques de TMS grâce à une meilleure récupération.

Dans la prochaine étape, nous verrons comment tous ces éléments (verre, robinet, bulle, orage et paille) interagissent dans un modèle complet représentant les facteurs de risque et de protection contre les TMS.`

export default function Page9StrawExplanation({ onComplete }: Page9StrawExplanationProps) {
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
      <div className="prose prose-invert prose-headings:text-green-400 prose-h2:mb-8 max-w-4xl mx-auto">
        <TypeWriter
          text={strawExplanationText}
          className="text-xl font-light text-white/90 leading-relaxed text-left whitespace-pre-line [&_u]:text-green-400 [&_u]:font-medium"
          onComplete={handleComplete}
          speed={50}
          dangerouslySetInnerHTML={true}
        />
      </div>
    </motion.div>
  )
}
