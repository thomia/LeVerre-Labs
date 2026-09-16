/**
 * CONTENU D'ACCUEIL - PRÉSENTATION DU MODÈLE (contenu interactif)
 * Rendu par la route `/` (voir `src/app/page.tsx`), sous <HeroAccueil>.
 *
 * Composant client : le premier écran, les metadata et le rendu initial vivent
 * dans `src/app/page.tsx` (Server Component). Ce fichier ne porte que
 * l'interactivité (démos du modèle, sections dépliables).
 */

"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import TapComponent from '@/components/modele/tap-component'
import GlassComponent from '@/components/modele/glass-component'
import StrawComponent from '@/components/modele/straw-component'
import StormComponent from '@/components/modele/storm-component'
import BubbleComponent from '@/components/modele/bubble-component'
import { SectionsExplicatives } from './sections-explicatives'
import { FaqTms } from './faq-tms'
import FeaturesCards from '@/components/ui/feature-shader-cards'
import HeroSection from '@/components/ui/hero-section'

export default function VitrineClient() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  // États fixes pour la démo
  const flowRate = 60
  const fillLevel = 45
  const absorptionRate = 50
  const environmentScore = 55
  const stormIntensity = 40
  const glassWidth = 55
  const isPaused = false

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Problématique chiffrée */}
      <div className="px-4 py-16">
        <HeroSection />
      </div>

      {/* Ce que le modèle permet de faire */}
      <div className="mb-16">
        <FeaturesCards />
      </div>

      {/* Le modèle, manipulable */}
      <section id="le-modele" className="relative scroll-mt-24 py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-white mb-4 max-w-4xl mx-auto font-bold leading-tight">
              Le modèle du verre : rendre visibles les facteurs de risque
            </h2>
            <p className="text-gray-400 text-lg font-light">
              Cliquez sur chaque élément pour comprendre ce qu&apos;il représente.
            </p>
          </motion.div>

          {/* Modèle visuel complet */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative w-full max-w-[800px] h-[800px] mx-auto mt-12"
          >
            {/* Structure du modèle */}
            <div className="flex flex-col items-center justify-center relative" style={{ height: '700px' }}>
              {/* Bulle environnementale cliquable */}
              <div 
                className="absolute top-1/2 left-1/2 z-0" 
                style={{ top: '53%', transform: 'translate(-50%, -50%)' }}
              >
                <motion.div
                  className="w-[700px] h-[700px] rounded-full overflow-hidden border-2 border-purple-400/40 bg-transparent shadow-[0_0_20px_rgba(168,85,247,0.15)] cursor-pointer transition-transform duration-300"
                  onClick={() => scrollToSection('bubble-section')}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="pointer-events-none">
                    <BubbleComponent 
                      environmentScore={environmentScore} 
                      isPaused={isPaused}
                    />
                  </div>
                </motion.div>
              </div>
              
              {/* Robinet */}
              <motion.div 
                className="relative z-20 mt-[220px] cursor-pointer transition-transform duration-300"
                onClick={() => scrollToSection('tap-section')}
                whileHover={{ scale: 1.15 }}
              >
                <TapComponent 
                  flowRate={flowRate} 
                  onFlowRateChange={() => {}}
                  hideDebitLabel={true}
                />
              </motion.div>
              
              {/* Orage */}
              <motion.div 
                className="relative z-20 scale-110 mt-[-180px] mb-[30px] ml-[-120px] cursor-pointer transition-transform duration-300"
                onClick={() => scrollToSection('storm-section')}
                whileHover={{ scale: 1.3 }}
              >
                <StormComponent 
                  intensity={stormIntensity} 
                  onIntensityChange={() => {}}
                  hideIntensityLabel={true} 
                />
              </motion.div>
              
              {/* Verre */}
              <div className="scale-125 mt-[-20px] relative z-10">
                <motion.div 
                  className="relative cursor-pointer transition-transform duration-300"
                  onClick={() => scrollToSection('glass-section')}
                  whileHover={{ scale: 1.15 }}
                >
                  <GlassComponent 
                    fillLevel={fillLevel} 
                    absorptionRate={absorptionRate}
                    width={glassWidth}
                  />
                  
                  {/* Paille */}
                  <motion.div 
                    className="absolute top-[-230px] right-[-5px] z-20 cursor-pointer transition-transform duration-300"
                    onClick={(e) => {
                      e.stopPropagation()
                      scrollToSection('straw-section')
                    }}
                    whileHover={{ scale: 1.15 }}
                  >
                    <StrawComponent 
                      absorptionRate={absorptionRate} 
                      setAbsorptionRate={() => {}} 
                      isInsideGlass={true}
                    />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sections explicatives détaillées */}
      <SectionsExplicatives expandedSections={expandedSections} toggleSection={toggleSection} />

      {/* FAQ : capte la longue traîne + réponses enrichies Google */}
      <FaqTms />
    </div>
  )
}
