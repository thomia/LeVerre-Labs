"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Info, PieChart as PieChartIcon } from 'lucide-react'
import { Slider } from '@/components/ui/slider-number-flow'

interface ScoreModalProps {
  isOpen: boolean
  onClose: () => void
  taskLabel: string
  componentName: string
  componentColor: string
  currentScore: number | null
  onSave: (score: number, parameters?: Parameter[]) => void
}

interface Parameter {
  name: string
  weight: number // Pourcentage (somme = 100)
  score: number // Note sur le poids
}

const componentDescriptions: Record<string, {
  title: string
  description: string
  examples: string[]
  scale: { min: string, mid: string, max: string }
}> = {
  robinet: {
    title: 'Score Robinet',
    description: 'Le robinet mesure l\'intensité des contraintes mécaniques et mentales du travail.',
    examples: [
      'Charge physique : Port de charges lourdes, efforts répétés',
      'Postures contraignantes : Bras levés, dos penché, positions prolongées',
      'Fréquence : Nombre de répétitions par minute/heure',
      'Charge mentale : Concentration, attention soutenue',
      'Risques psychosociaux : Stress, pression temporelle'
    ],
    scale: {
      min: '0-30 : Contraintes faibles',
      mid: '31-70 : Contraintes modérées',
      max: '71-100 : Contraintes élevées'
    }
  },
  verre: {
    title: 'Score Verre',
    description: 'Le verre représente la capacité d\'absorption individuelle des contraintes.',
    examples: [
      'Âge : Impact sur la résistance physique',
      'Antécédents médicaux : Historique de TMS',
      'Condition physique : Force, endurance',
      'Hygiène de vie : Sommeil, nutrition',
      'Prédispositions génétiques'
    ],
    scale: {
      min: '0-30 : Capacité élevée',
      mid: '31-70 : Capacité moyenne',
      max: '71-100 : Capacité réduite'
    }
  },
  bulle: {
    title: 'Score Bulle',
    description: 'La bulle représente la qualité de l\'environnement de travail.',
    examples: [
      'Température : Trop chaud, trop froid',
      'Éclairage : Insuffisant ou éblouissant',
      'Bruit : Nuisances sonores',
      'Vibrations : Exposition aux vibrations',
      'Espace : Encombrement, circulation',
      'Équipement : Outils adaptés ou non'
    ],
    scale: {
      min: '0-30 : Environnement favorable',
      mid: '31-70 : Environnement neutre',
      max: '71-100 : Environnement défavorable'
    }
  },
  orage: {
    title: 'Score Orage',
    description: 'L\'orage représente les aléas et perturbations imprévisibles.',
    examples: [
      'Impact : Ampleur de la perturbation',
      'Durée : Temps de résolution',
      'Fréquence : Nombre d\'interruptions',
      'Nature : Pannes, changements de dernière minute'
    ],
    scale: {
      min: '0-30 : Aléas rares',
      mid: '31-70 : Aléas occasionnels',
      max: '71-100 : Aléas fréquents'
    }
  },
  paille: {
    title: 'Score Paille',
    description: 'La paille représente la capacité de récupération et les stratégies de compensation.',
    examples: [
      'Pauses actives : Micro-pauses régulières',
      'Étirements : Exercices de mobilité',
      'Relaxation : Techniques de décompression',
      'Sommeil : Qualité et durée du repos',
      'Hydratation : Apport hydrique suffisant'
    ],
    scale: {
      min: '0-30 : Récupération faible',
      mid: '31-70 : Récupération modérée',
      max: '71-100 : Récupération optimale'
    }
  }
}

export default function ScoreModal({
  isOpen,
  onClose,
  taskLabel,
  componentName,
  componentColor,
  currentScore,
  onSave
}: ScoreModalProps) {
  const [score, setScore] = useState(currentScore || 0)
  const [showCustomization, setShowCustomization] = useState(false)
  const [parameters, setParameters] = useState<Parameter[]>([
    { name: 'Charge physique', weight: 25.6, score: 0 },
    { name: 'Postures', weight: 20.6, score: 0 },
    { name: 'Répétition', weight: 18.9, score: 0 },
    { name: 'Charge mentale', weight: 15, score: 0 },
    { name: 'RPS', weight: 19.9, score: 0 },
  ])

  const info = componentDescriptions[componentName.toLowerCase()] || componentDescriptions.robinet

  const handleSave = () => {
    onSave(score, showCustomization ? parameters : undefined)
    onClose()
  }

  const totalWeight = parameters.reduce((sum, p) => sum + p.weight, 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* En-tête */}
              <div className={`sticky top-0 z-10 p-6 border-b border-white/10 bg-gradient-to-r from-gray-900 to-gray-950`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {taskLabel.toUpperCase()} – {info.title.toUpperCase()}
                    </h2>
                    <p className={`text-sm ${componentColor}`}>{info.description}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6 space-y-8">
                {/* Slider principal */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Score global</h3>
                    <div className={`text-4xl font-bold ${componentColor}`}>
                      {score}
                    </div>
                  </div>
                  
                  <Slider
                    value={[score]}
                    onValueChange={(values) => setScore(values[0])}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                    valueColor={componentColor.replace('text-', '')}
                  />
                  
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{info.scale.min}</span>
                    <span>{info.scale.mid}</span>
                    <span>{info.scale.max}</span>
                  </div>
                </div>

                {/* Légendes */}
                <div className="bg-gray-950/50 rounded-xl p-6 border border-white/5">
                  <div className="flex items-start gap-3 mb-4">
                    <Info className={`w-5 h-5 mt-0.5 ${componentColor}`} />
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Exemples de facteurs</h4>
                      <ul className="space-y-2">
                        {info.examples.map((example, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className={`${componentColor} mt-1`}>•</span>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Personnalisation (Pie Chart) */}
                <div className="bg-gray-950/50 rounded-xl p-6 border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <PieChartIcon className={`w-5 h-5 ${componentColor}`} />
                      <h4 className="text-lg font-semibold text-white">Personnalisation avancée</h4>
                    </div>
                    <button
                      onClick={() => setShowCustomization(!showCustomization)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        showCustomization
                          ? 'bg-[rgb(255,30,90)] text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {showCustomization ? 'Masquer' : 'Configurer'}
                    </button>
                  </div>

                  {showCustomization && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <p className="text-sm text-gray-400 mb-4">
                        Décomposez le score en sous-paramètres pondérés. 
                        Total : <span className={totalWeight === 100 ? 'text-green-400' : 'text-red-400'}>{totalWeight.toFixed(1)}%</span>
                      </p>

                      {parameters.map((param, index) => (
                        <div key={index} className="bg-gray-900/50 rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <input
                              type="text"
                              value={param.name}
                              onChange={(e) => {
                                const newParams = [...parameters]
                                newParams[index].name = e.target.value
                                setParameters(newParams)
                              }}
                              className="bg-transparent text-white font-medium outline-none"
                            />
                            <span className={`text-sm ${componentColor} font-semibold`}>
                              {param.weight.toFixed(1)}%
                            </span>
                          </div>
                          
                          <Slider
                            value={[param.weight]}
                            onValueChange={(values) => {
                              const newParams = [...parameters]
                              newParams[index].weight = values[0]
                              setParameters(newParams)
                            }}
                            min={0}
                            max={100}
                            step={0.1}
                            className="w-full"
                          />
                        </div>
                      ))}

                      <button
                        onClick={() => {
                          setParameters([...parameters, { name: 'Nouveau paramètre', weight: 0, score: 0 }])
                        }}
                        className="w-full py-2 border-2 border-dashed border-gray-700 hover:border-gray-600 rounded-lg text-gray-400 hover:text-gray-300 transition-colors text-sm"
                      >
                        + Ajouter un paramètre
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Footer avec boutons */}
              <div className="sticky bottom-0 p-6 border-t border-white/10 bg-gradient-to-r from-gray-900 to-gray-950 flex items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-gradient-to-r from-[rgb(255,30,90)] to-[rgb(255,60,120)] hover:shadow-lg text-white rounded-lg transition-all font-semibold"
                >
                  Enregistrer
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
