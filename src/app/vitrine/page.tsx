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
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero'

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
        title="ProtoVerreTMS"
        date="De la Complexité à la Clarté"
        scrollToExpand="Faites défiler pour découvrir notre solution"
        textBlend
      >
        <div className="max-w-6xl mx-auto">
          {/* Section Intro - Problématique */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              Révolutionnez votre Approche TMS
            </h2>
            <p className="text-xl text-gray-200 leading-relaxed max-w-4xl mx-auto">
              Les modèles traditionnels sont complexes, difficiles à communiquer. 
              <span className="block mt-2 text-2xl font-semibold text-white">ProtoVerreTMS simplifie sans sacrifier la rigueur.</span>
            </p>
          </div>

          {/* Section 3 Axes Principaux */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {/* Axe 1 : Formation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gradient-to-br from-blue-900/40 to-blue-800/30 p-8 rounded-2xl border border-blue-400/30 hover:border-blue-400/60 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300"
            >
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-2xl font-bold text-blue-400 mb-4">Formation</h3>
              <p className="text-gray-200 leading-relaxed mb-4">
                Formez vos équipes avec un modèle qui parle à tous. Du manager à l'opérateur, 
                créez un langage commun autour de la prévention TMS.
              </p>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>✓ Métaphore intuitive universelle</li>
                <li>✓ Appropriation rapide par tous</li>
                <li>✓ Support pédagogique visuel</li>
              </ul>
            </motion.div>

            {/* Axe 2 : Sensibilisation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-purple-900/40 to-purple-800/30 p-8 rounded-2xl border border-purple-400/30 hover:border-purple-400/60 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300"
            >
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-2xl font-bold text-purple-400 mb-4">Sensibilisation</h3>
              <p className="text-gray-200 leading-relaxed mb-4">
                Engagez vos collaborateurs dans la prévention. Rendez visibles les contraintes 
                invisibles et mobilisez autour d'objectifs concrets.
              </p>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>✓ Visualisation immédiate des risques</li>
                <li>✓ Dialogue facilité terrain-direction</li>
                <li>✓ Culture prévention renforcée</li>
              </ul>
            </motion.div>

            {/* Axe 3 : Évaluation & Simulation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-green-900/40 to-green-800/30 p-8 rounded-2xl border border-green-400/30 hover:border-green-400/60 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300"
            >
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-green-400 mb-4">Évaluation & Simulation</h3>
              <p className="text-gray-200 leading-relaxed mb-4">
                Mesurez, simulez, décidez. Testez vos aménagements avant investissement 
                et justifiez vos choix avec des données objectives.
              </p>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>✓ Scénarios avant/après simulés</li>
                <li>✓ Priorisation des investissements</li>
                <li>✓ ROI prévention démontré</li>
              </ul>
            </motion.div>
          </div>

          {/* Section Les 5 Forces - Restructurée */}
          <div className="bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-sm rounded-3xl p-10 border border-gray-700/50 mb-16">
            <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              Les 5 Forces de ProtoVerreTMS
            </h2>
            <p className="text-center text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Une approche qui transforme l'analyse ergonomique en outil stratégique de prévention
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Force 1 */}
              <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/20 hover:border-blue-400/40 transition-all">
                <h4 className="text-lg font-bold text-blue-400 mb-2">Rigueur & Flexibilité</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Modèle scientifique adaptable à vos contraintes organisationnelles.
                </p>
              </div>

              {/* Force 2 */}
              <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all">
                <h4 className="text-lg font-bold text-purple-400 mb-2">Langage Fédérateur</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Du directeur au technicien, un dialogue commun pour transformer la culture sécurité.
                </p>
              </div>

              {/* Force 3 */}
              <div className="bg-green-900/20 p-6 rounded-xl border border-green-500/20 hover:border-green-400/40 transition-all">
                <h4 className="text-lg font-bold text-green-400 mb-2">Métaphore Intuitive</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Chaque opérationnel comprend et devient acteur de sa prévention.
                </p>
              </div>

              {/* Force 4 */}
              <div className="bg-yellow-900/20 p-6 rounded-xl border border-yellow-500/20 hover:border-yellow-400/40 transition-all">
                <h4 className="text-lg font-bold text-yellow-400 mb-2">Décisions Data-Driven</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Arguments objectifs pour justifier vos investissements prévention.
                </p>
              </div>

              {/* Force 5 */}
              <div className="bg-gray-700/20 p-6 rounded-xl border border-gray-500/20 hover:border-gray-400/40 transition-all md:col-span-2 lg:col-span-1">
                <h4 className="text-lg font-bold text-gray-300 mb-2">Vision Holistique</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Tous les aspects de la charge de travail consolidés en un seul endroit.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Final */}
          <div className="text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button className="px-10 py-5 bg-gradient-to-r from-blue-500 via-purple-600 to-green-500 text-white font-bold rounded-xl text-xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300">
                Découvrir le Modèle Complet ↓
              </button>
            </motion.div>
          </div>
        </div>
      </ScrollExpandMedia>

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

      {/* Sections explicatives détaillées */}
      <SectionsExplicatives expandedSections={expandedSections} toggleSection={toggleSection} />
      </div>
    </>
  )
}
