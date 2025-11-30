/**
 * SECTIONS EXPLICATIVES VITRINE
 * Composant: SectionsExplicatives
 * Affiche les 5 sections détaillées du modèle (Verre, Robinet, Bulle, Orage, Paille)
 * avec démos interactives et références scientifiques
 */

"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import GlassComponent from '@/components/dashboard/glass-component'
import TapComponent from '@/components/dashboard/tap-component'
import BubbleComponent from '@/components/dashboard/bubble-component'
import StormComponent from '@/components/dashboard/storm-component'
import StrawComponent from '@/components/dashboard/straw-component'
import { Slider } from '@/components/ui/slider-number-flow'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'

interface SectionProps {
  expandedSections: Record<string, boolean>
  toggleSection: (id: string) => void
}

export function SectionsExplicatives({ expandedSections, toggleSection }: SectionProps) {
  // États pour les scores interactifs
  const [glassScore, setGlassScore] = useState([50])
  const [tapScore, setTapScore] = useState([60])
  const [bubbleScore, setBubbleScore] = useState([55])
  const [stormScore, setStormScore] = useState([40])
  const [strawScore, setStrawScore] = useState([50])

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-24">
      {/* Section Verre */}
      <section id="glass-section" className="scroll-mt-20 pb-32 pt-16 px-8 bg-gradient-to-br from-gray-900/20 to-gray-800/10 rounded-3xl shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-6xl font-extrabold text-gray-300 mb-8">Le Verre</h2>
            <h3 className="text-3xl font-bold text-white mb-6 tracking-tight">Les Facteurs Individuels</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Chaque individu est défini par des facteurs individuels physiologiques et psychologiques qui déterminent sa tolérance aux contraintes [1,2,3]. Cette « capacité d'absorption » personnelle, défini un certain seuil au-delà duquel des dommages aux structures musculaires, tendineuses et articulaires peuvent survenir. Intégrer cette réalité biologique dans l'analyse de l'activité est indispensable pour adapter efficacement les postes de travail [4,5,6].
            </p>
            
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-400/20 mb-6">
              <button 
                onClick={() => toggleSection('glass-factors')}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-gray-300 font-medium">Exemples de facteurs</span>
                {expandedSections['glass-factors'] ? <ChevronUp className="w-5 h-5 text-gray-300" /> : <ChevronDown className="w-5 h-5 text-gray-300" />}
              </button>
              {expandedSections['glass-factors'] && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-4 space-y-2 text-gray-400"
                >
                  <div>• Âge</div>
                  <div>• Antécédents médicaux</div>
                  <div>• Condition physique</div>
                  <div>• Hygiène de vie globale</div>
                  <div>• Prédispositions génétiques</div>
                </motion.div>
              )}
            </div>

          </div>
          
          <div className="flex justify-center items-center">
            <div className="relative scale-110 flex flex-col items-center">
              <GlassComponent 
                fillLevel={Math.min(90, 3000 / (20 + (glassScore[0] * 0.7)))} 
                absorptionRate={50}
                width={20 + (glassScore[0] * 0.7)}
              />
              <div className="mt-32 text-center space-y-4">
                <div>
                  <div className="text-gray-300 text-xl font-medium mb-2">Capacité d'absorption</div>
                  <div className="text-gray-400 text-base mb-12">Ajustez pour voir la largeur du verre changer</div>
                </div>
                <Slider
                  value={glassScore}
                  onValueChange={setGlassScore}
                  min={20}
                  max={100}
                  step={1}
                  className="mx-auto w-[250px]"
                  valueColor="text-gray-300"
                  style={{
                    '--slider-range-bg': 'rgb(209 213 219)',
                    '--slider-thumb-ring': 'rgb(209 213 219 / 0.2)'
                  } as React.CSSProperties}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Robinet */}
      <section id="tap-section" className="scroll-mt-20 pb-32 pt-16 px-8 bg-gradient-to-br from-blue-900/20 to-blue-800/10 rounded-3xl shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 flex justify-center items-center">
            <div className="relative flex flex-col items-center">
              <div className="scale-90 mt-8">
                <TapComponent 
                  flowRate={tapScore[0]} 
                  onFlowRateChange={() => {}}
                  hideDebitLabel={true}
                />
              </div>
              <div className="mt-32 text-center space-y-4">
                <div>
                  <div className="text-blue-400 text-xl font-medium mb-2">Charge de travail</div>
                  <div className="text-gray-400 text-base mb-12">Ajustez pour voir le débit changer</div>
                </div>
                <Slider
                  value={tapScore}
                  onValueChange={setTapScore}
                  min={0}
                  max={100}
                  step={1}
                  className="mx-auto w-[250px] [&_.bg-black]:!bg-blue-500 [&_.dark\\:bg-white]:!bg-blue-500"
                  valueColor="text-blue-400"
                />
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <h2 className="text-6xl font-extrabold text-blue-400 mb-8">Le Robinet</h2>
            <h3 className="text-3xl font-bold text-white mb-6 tracking-tight">Les Contraintes du Travail</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Chaque jour, votre corps et votre esprit sont sollicités par des contraintes multiples et interdépendantes [10,11]. Ces sollicitations se manifestent sous deux formes : les contraintes biomécaniques et physiologiques, et les contraintes cognitives et psychosociales. Leurs actions combinées et prolongées tout au long de la journée, forment une charge globale de travail que votre corps accumule progressivement et doit absorber [12,13,14].
            </p>
            
            <div className="bg-gray-900/50 p-4 rounded-lg border border-blue-400/20 mb-6">
              <button 
                onClick={() => toggleSection('tap-factors')}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-blue-400 font-medium">Exemples de facteurs</span>
                {expandedSections['tap-factors'] ? <ChevronUp className="w-5 h-5 text-blue-400" /> : <ChevronDown className="w-5 h-5 text-blue-400" />}
              </button>
              {expandedSections['tap-factors'] && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-4 space-y-2 text-gray-400"
                >
                  <div>• Actions de manipulation de charge (soulevée, poussée, tirée, maintenue)</div>
                  <div>• Poids et forme de la charge</div>
                  <div>• Type de préhension</div>
                  <div>• Fréquence de manipulation</div>
                  <div>• Angles articulaires utilisés</div>
                  <div>• Effort mental de l'activité</div>
                  <div>• Risques psychosociaux</div>
                </motion.div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Section Bulle */}
      <section id="bubble-section" className="scroll-mt-20 pb-32 pt-16 px-8 bg-gradient-to-br from-purple-900/20 to-purple-800/10 rounded-3xl shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-6xl font-extrabold text-purple-400 mb-8">La Bulle</h2>
            <h3 className="text-3xl font-bold text-white mb-6 tracking-tight">L'Environnement de Travail</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              L'environnement physique agit comme un amplificateur ou un modérateur des risques professionnels [15,16]. Les données scientifiques démontrent que certains facteurs environnementaux augmentent le risque de troubles musculosquelettiques. Tandis d'autres favorisent un cadre favorable à un travail efficient liant santé et performance au travail [17].
            </p>
            
            <div className="bg-gray-900/50 p-4 rounded-lg border border-purple-400/20 mb-6">
              <button 
                onClick={() => toggleSection('bubble-factors')}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-purple-400 font-medium">Exemples de facteurs</span>
                {expandedSections['bubble-factors'] ? <ChevronUp className="w-5 h-5 text-purple-400" /> : <ChevronDown className="w-5 h-5 text-purple-400" />}
              </button>
              {expandedSections['bubble-factors'] && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-4 space-y-2 text-gray-400"
                >
                  <div>• Température</div>
                  <div>• Éclairage</div>
                  <div>• Vibrations</div>
                  <div>• Horaires décalés</div>
                  <div>• Espace de travail</div>
                  <div>• Salubrité</div>
                  <div>• Bruit</div>
                  <div>• Travailleur isolé</div>
                  <div>• Matériel à disposition</div>
                </motion.div>
              )}
            </div>

          </div>
          
          <div className="flex justify-center items-center">
            <div className="relative flex flex-col items-center">
              <motion.div 
                className="relative w-96 h-96 rounded-full border-2 border-purple-400/40 overflow-hidden bg-purple-950/20 shadow-[0_0_30px_rgba(168,85,247,0.2)]"
                whileHover={{ 
                  borderColor: 'rgba(168,85,247,0.6)',
                  boxShadow: '0 0 50px rgba(168,85,247,0.4)'
                }}
                transition={{ duration: 0.3 }}
              >
                <BubbleComponent environmentScore={bubbleScore[0]} isPaused={false} />
                
                {/* Effet de lueur intérieure */}
                <div className="absolute inset-0 rounded-full pointer-events-none">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/10 via-transparent to-purple-600/10" />
                </div>
              </motion.div>
              
              <div className="mt-32 text-center space-y-4">
                <div>
                  <div className="text-purple-400 text-xl font-medium mb-2">Qualité de l'environnement de travail</div>
                  <div className="text-gray-400 text-base mb-12">Ajustez pour voir le nombre et la vitesse des particules</div>
                </div>
                <Slider
                  value={bubbleScore}
                  onValueChange={setBubbleScore}
                  min={0}
                  max={100}
                  step={1}
                  className="mx-auto w-[250px] [&_.bg-black]:!bg-purple-500 [&_.dark\\:bg-white]:!bg-purple-500"
                  valueColor="text-purple-400"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Orage */}
      <section id="storm-section" className="scroll-mt-20 pb-32 pt-16 px-8 bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 rounded-3xl shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 flex justify-center items-center">
            <div className="relative scale-110 flex flex-col items-center">
              <StormComponent 
                intensity={stormScore[0]} 
                onIntensityChange={() => {}}
                hideIntensityLabel={true} 
              />
              <div className="mt-32 text-center space-y-4">
                <div>
                  <div className="text-yellow-400 text-xl font-medium mb-2">Impact des aléas sur la charge globale</div>
                  <div className="text-gray-400 text-base mb-12">Ajustez pour voir la fréquence des éclairs</div>
                </div>
                <Slider
                  value={stormScore}
                  onValueChange={setStormScore}
                  min={0}
                  max={100}
                  step={1}
                  className="mx-auto w-[250px] [&_.bg-black]:!bg-yellow-500 [&_.dark\\:bg-white]:!bg-yellow-500"
                  valueColor="text-yellow-400"
                />
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <h2 className="text-6xl font-extrabold text-yellow-400 mb-8">L'Orage</h2>
            <h3 className="text-3xl font-bold text-white mb-6 tracking-tight">Les Imprévus</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Les situations imprévisibles sont une réalité du travail qui est souvent sous-estimée [18]. Ces perturbations creusent l'écart entre le travail prescrit et la réalité opérationnelle, impliquant la mobilisation des ressources additionnelles cognitives et physiques pour maintenir le niveau de performance attendu. Ces sollicitations supplémentaires imposées à l'organisme s'ajoutent à la charge globale de travail initiale.
            </p>
            
            <div className="bg-gray-900/50 p-4 rounded-lg border border-yellow-400/20 mb-6">
              <button 
                onClick={() => toggleSection('storm-factors')}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-yellow-400 font-medium">Exemples de facteurs</span>
                {expandedSections['storm-factors'] ? <ChevronUp className="w-5 h-5 text-yellow-400" /> : <ChevronDown className="w-5 h-5 text-yellow-400" />}
              </button>
              {expandedSections['storm-factors'] && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-4 space-y-2 text-gray-400"
                >
                  <div>• Récurrence</div>
                  <div>• Durée</div>
                  <div>• Nature</div>
                  <div>• Impact sur la performance</div>
                </motion.div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Section Paille */}
      <section id="straw-section" className="scroll-mt-20 pb-32 pt-16 px-8 bg-gradient-to-br from-green-900/20 to-green-800/10 rounded-3xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-6xl font-extrabold text-green-400 mb-8">La Paille</h2>
            <h3 className="text-3xl font-bold text-white mb-6 tracking-tight">Les Stratégies de Récupération</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              La récupération n'est pas un luxe, c'est une nécessité physiologique pour maintenir l'intégrité des structures corporelles [19,20]. Elle regroupe l'ensemble des mécanismes qui permettent à l'organisme de dissiper progressivement l'accumulation de fatigue et de sollicitations. Bien que ces stratégies interviennent après l'exposition aux contraintes, elles réduisent significativement les effets résiduels et diminuent le risque cumulatif de blessures professionnelles.
            </p>
            
            <div className="bg-gray-900/50 p-4 rounded-lg border border-green-400/20 mb-6">
              <button 
                onClick={() => toggleSection('straw-factors')}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-green-400 font-medium">Exemples de facteurs</span>
                {expandedSections['straw-factors'] ? <ChevronUp className="w-5 h-5 text-green-400" /> : <ChevronDown className="w-5 h-5 text-green-400" />}
              </button>
              {expandedSections['straw-factors'] && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-4 space-y-2 text-gray-400"
                >
                  <div>• Pauses</div>
                  <div>• Sommeil</div>
                  <div>• Relaxation</div>
                  <div>• Marche</div>
                  <div>• Étirements</div>
                  <div>• Hydratation</div>
                </motion.div>
              )}
            </div>

          </div>
          
          <div className="flex justify-center items-center">
            <div className="relative scale-110 flex flex-col items-center">
              <StrawComponent 
                absorptionRate={strawScore[0]} 
                setAbsorptionRate={() => {}} 
                isInsideGlass={true}
              />
              <div className="mt-32 text-center space-y-4">
                <div>
                  <div className="text-green-400 text-xl font-medium mb-2">Capacité de récupération</div>
                  <div className="text-gray-400 text-base mb-12">Ajustez pour voir la vitesse d'absorption</div>
                </div>
                <Slider
                  value={strawScore}
                  onValueChange={setStrawScore}
                  min={0}
                  max={100}
                  step={1}
                  className="mx-auto w-[250px] [&_.bg-black]:!bg-green-500 [&_.dark\\:bg-white]:!bg-green-500"
                  valueColor="text-green-400"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Demander une démonstration */}
      <section className="relative py-32 px-6 bg-gradient-to-br from-slate-900 to-black">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
            Voyez LeVerre Labs en action
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Découvrez comment notre approche transforme la prévention à travers une démonstration personnalisée de l'outil et de son utilisation concrète.
          </p>
          <a href="mailto:contact@leverrelabs.com?subject=Demande de démonstration LeVerre Labs">
            <InteractiveHoverButton 
              text="Demander une démonstration"
              className="w-auto px-8 py-4 text-lg bg-[rgb(255,30,90)] text-white border-[rgb(255,30,90)] hover:bg-[rgb(255,60,120)]"
            />
          </a>
        </motion.div>
      </section>
    </div>
  )
}
