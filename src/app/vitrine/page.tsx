"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import TapComponent from '@/components/dashboard/tap-component'
import GlassComponent from '@/components/dashboard/glass-component'
import StrawComponent from '@/components/dashboard/straw-component'
import StormComponent from '@/components/dashboard/storm-component'
import BubbleComponent from '@/components/dashboard/bubble-component'
import { SectionsExplicatives } from './sections-explicatives'

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section avec le modèle */}
      <section className="relative py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent tracking-tight">
              ProtoVerreTMS
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-4 max-w-4xl mx-auto font-light leading-relaxed">
              Révolutionnez votre approche ergonomique
            </p>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto font-light">
              Une métaphore visuelle intuitive pour une prévention efficace
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
                  className="w-[700px] h-[700px] rounded-full overflow-hidden border-2 border-purple-400/40 bg-purple-950/10 shadow-[0_0_20px_rgba(168,85,247,0.15)] cursor-pointer transition-transform duration-300"
                  onClick={() => scrollToSection('bubble-section')}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="pointer-events-none">
                    <BubbleComponent 
                      environmentScore={environmentScore} 
                      isPaused={isPaused}
                    />
                  </div>
                  
                  {/* Effet de lueur intérieure */}
                  <div className="absolute inset-0 rounded-full pointer-events-none">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/5 via-transparent to-purple-600/5" />
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

      {/* Section des 5 Forces */}
      <section className="py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-black border-t-2 border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent tracking-tight">
              Les 5 Forces
            </h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
              Une approche révolutionnaire qui transforme l'analyse ergonomique en outil stratégique de prévention
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Force 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 p-8 rounded-2xl border border-blue-500/30 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
            >
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-blue-400 mb-2">Rigueur Scientifique</h3>
                <h4 className="text-lg font-semibold text-white/90">Flexibilité Opérationnelle</h4>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Modèle basé sur les connaissances scientifiques disponibles. Vous configurez les cinq composants selon les contraintes et besoins de votre organisation.
              </p>
            </motion.div>

            {/* Force 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 p-8 rounded-2xl border border-purple-500/30 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
            >
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-purple-400 mb-2">Langage Fédérateur</h3>
                <h4 className="text-lg font-semibold text-white/90">Du Directeur au Technicien</h4>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Un langage commun qui facilite le dialogue stratégique entre tous les acteurs de la prévention. Une clé pour transformer la culture sécurité.
              </p>
            </motion.div>

            {/* Force 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-gradient-to-br from-green-900/30 to-green-800/20 p-8 rounded-2xl border border-green-500/30 hover:border-green-400/50 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300"
            >
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-green-400 mb-2">Comprendre pour Transformer</h3>
                <h4 className="text-lg font-semibold text-white/90">Métaphore Visuelle Intuitive</h4>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Vulgarise les concepts d'ergonomie. Chaque opérationnel identifie et comprend le risque à son poste, il devient acteur de sa prévention.
              </p>
            </motion.div>

            {/* Force 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 p-8 rounded-2xl border border-yellow-500/30 hover:border-yellow-400/50 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 md:col-span-2 lg:col-span-1"
            >
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">Décisions Basées sur les Données</h3>
                <h4 className="text-lg font-semibold text-white/90">Arguments Objectifs</h4>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Visualisez et mesurez les contraintes réelles. Testez des scénarios avant/après. Disposez d'arguments objectifs pour justifier vos investissements prévention.
              </p>
            </motion.div>

            {/* Force 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="bg-gradient-to-br from-gray-900/30 to-gray-800/20 p-8 rounded-2xl border border-gray-500/30 hover:border-gray-400/50 hover:shadow-lg hover:shadow-gray-500/10 transition-all duration-300 md:col-span-2"
            >
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-300 mb-2">Vision Holistique</h3>
                <h4 className="text-lg font-semibold text-white/90">Tous les Aspects en Un Seul Endroit</h4>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Un outil centralisé qui consolide tous les aspects de la charge de travail en un seul endroit. Une approche globale pour une prévention efficace et durable.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sections explicatives détaillées */}
      <SectionsExplicatives expandedSections={expandedSections} toggleSection={toggleSection} />
    </div>
  )
}
