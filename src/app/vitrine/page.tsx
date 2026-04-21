/**
 * PAGE VITRINE - PRÉSENTATION DU MODÈLE
 * Route: /vitrine
 * Présentation complète du modèle ProtoVerreTMS avec explications scientifiques
 */

"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import TapComponent from '@/components/modele/tap-component'
import GlassComponent from '@/components/modele/glass-component'
import StrawComponent from '@/components/modele/straw-component'
import StormComponent from '@/components/modele/storm-component'
import BubbleComponent from '@/components/modele/bubble-component'
import { SectionsExplicatives } from './sections-explicatives'
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero'
import FeaturesCards from '@/components/ui/feature-shader-cards'
import HeroSection from '@/components/ui/hero-section'

export default function VitrinePage() {
  const [isMounted, setIsMounted] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  
  // États fixes pour la démo
  const flowRate = 60
  const fillLevel = 45
  const absorptionRate = 50
  const environmentScore = 55
  const stormIntensity = 40
  const glassWidth = 55
  const isPaused = false

  useEffect(() => {
    setIsMounted(true)
  }, [])

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

  if (!isMounted) {
    return <div className="w-full h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-white">Chargement...</div>
    </div>
  }

  return (
    <>
      {/* Section d'expansion avec scroll */}
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc="/photo%20video/Vid%C3%A9o%20pres.mp4?v=3"
        posterSrc="/photo%20video/TMSsht-1-1372841116.jpg"
        bgImageSrc="/photo%20video/TMSsht-1-1372841116.jpg"
        title="LeVerre Labs"
        date="The Powerful Digital Ergonomic Tool"
        scrollToExpand="Faites défiler pour découvrir notre solution"
        textBlend
      >
        {/* Section Intro - Problématique */}
        <HeroSection />

        {/* Section des Forces avec Shaders */}
        <div className="mb-16">
          <FeaturesCards />
        </div>
      </ScrollExpandMedia>

      <div className="min-h-screen bg-black">
        {/* Hero Section avec le modèle */}
        <section className="relative py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-8 tracking-tight">
              <span className="text-[rgb(255,30,90)] drop-shadow-[0_0_8px_rgba(255,30,90,0.5)]">LeVerre</span> <span className="text-gray-400">Labs</span>
            </h1>
            <p className="text-2xl md:text-3xl text-white mb-4 max-w-4xl mx-auto font-bold leading-relaxed">
              The Powerful Digital Ergonomic Tool
            </p>
          </motion.div>

          {/* Modèle visuel complet */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative w-full max-w-[800px] h-[800px] mx-auto"
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

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-gray-400 mt-12 text-lg font-light"
          >
            Cliquez sur chaque élément pour en savoir plus
          </motion.p>
        </div>
      </section>

      {/* Sections explicatives détaillées */}
      <SectionsExplicatives expandedSections={expandedSections} toggleSection={toggleSection} />
      </div>
    </>
  )
}
