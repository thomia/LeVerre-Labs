"use client"

/**
 * COMPOSANT QUESTIONNAIRE ROBINET
 * Interface épurée et guidée pour l'analyse de la charge de travail
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Check } from 'lucide-react'

interface QuestionComponentProps {
  question: string
  subtitle?: string
  type: 'single' | 'multiple' | 'scale'
  options?: Array<{ label: string; value: number; description?: string }>
  scaleMin?: number
  scaleMax?: number
  scaleLabels?: { min: string; max: string }
  value: number | number[] | null
  onChange: (value: number | number[]) => void
}

export function QuestionComponent({
  question,
  subtitle,
  type,
  options,
  scaleMin,
  scaleMax,
  scaleLabels,
  value,
  onChange
}: QuestionComponentProps) {
  const [hoveredOption, setHoveredOption] = useState<number | null>(null)

  if (type === 'scale' && scaleMin !== undefined && scaleMax !== undefined) {
    const currentValue = typeof value === 'number' ? value : scaleMin
    
    return (
      <div className="space-y-6">
        <div className="mb-8 text-center">
          <p className="text-xl font-medium text-gray-200 leading-relaxed mb-2">
            {question}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-400 leading-relaxed">
              {subtitle}
            </p>
          )}
          <div className="mt-4 h-1 w-16 bg-blue-600 rounded-full mx-auto"></div>
        </div>

        <div className="space-y-4">
          {/* Affichage de la valeur actuelle */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-slate-800/50 border border-blue-500/30 rounded-xl px-6 py-3">
              <span className="text-sm text-gray-400">Valeur :</span>
              <span className="text-3xl font-bold text-blue-400">{currentValue}</span>
              <span className="text-sm text-gray-400">/ {scaleMax}</span>
            </div>
          </div>

          {/* Slider */}
          <div className="px-4">
            <input
              type="range"
              min={scaleMin}
              max={scaleMax}
              step={1}
              value={currentValue}
              onChange={(e) => onChange(parseInt(e.target.value))}
              className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-6
                [&::-webkit-slider-thumb]:h-6
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-blue-500
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:shadow-lg
                [&::-webkit-slider-thumb]:shadow-blue-500/50
                [&::-webkit-slider-thumb]:hover:bg-blue-400
                [&::-webkit-slider-thumb]:transition-all
                [&::-moz-range-thumb]:w-6
                [&::-moz-range-thumb]:h-6
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-blue-500
                [&::-moz-range-thumb]:cursor-pointer
                [&::-moz-range-thumb]:border-0
                [&::-moz-range-thumb]:shadow-lg
                [&::-moz-range-thumb]:shadow-blue-500/50"
            />
          </div>

          {/* Labels min/max */}
          {scaleLabels && (
            <div className="flex justify-between px-2">
              <span className="text-xs text-gray-400">{scaleLabels.min}</span>
              <span className="text-xs text-gray-400">{scaleLabels.max}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (type === 'multiple' && options) {
    const selectedValues = Array.isArray(value) ? value : []

    return (
      <div className="space-y-6">
        <div className="mb-8 text-center">
          <p className="text-xl font-medium text-gray-200 leading-relaxed mb-2">
            {question}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-400 leading-relaxed">
              {subtitle}
            </p>
          )}
          <div className="mt-4 h-1 w-16 bg-blue-600 rounded-full mx-auto"></div>
        </div>

        <div className="space-y-3">
          {options.map((option, idx) => {
            const isSelected = selectedValues.includes(option.value)
            const isHovered = hoveredOption === idx

            return (
              <motion.button
                key={idx}
                onClick={() => {
                  const newValues = isSelected
                    ? selectedValues.filter(v => v !== option.value)
                    : [...selectedValues, option.value]
                  onChange(newValues)
                }}
                onHoverStart={() => setHoveredOption(idx)}
                onHoverEnd={() => setHoveredOption(null)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? 'bg-blue-700/30 border-blue-400 shadow-lg shadow-blue-400/20'
                    : 'bg-slate-800/40 border-gray-700/40 hover:border-blue-500/50 hover:bg-slate-800/60'
                }`}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all mt-0.5 ${
                    isSelected
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-transparent border-gray-600'
                  }`}>
                    {isSelected && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className={`font-medium transition-colors ${
                      isSelected ? 'text-white' : 'text-gray-300'
                    }`}>
                      {option.label}
                    </p>
                    
                    {option.description && (isSelected || isHovered) && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-sm text-gray-400 mt-1"
                      >
                        {option.description}
                      </motion.p>
                    )}
                  </div>

                  <div className="flex-shrink-0 text-sm font-bold text-blue-400">
                    +{option.value}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    )
  }

  // Type 'single'
  if (options) {
    const selectedValue = typeof value === 'number' ? value : null

    return (
      <div className="space-y-6">
        <div className="mb-8 text-center">
          <p className="text-xl font-medium text-gray-200 leading-relaxed mb-2">
            {question}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-400 leading-relaxed">
              {subtitle}
            </p>
          )}
          <div className="mt-4 h-1 w-16 bg-blue-600 rounded-full mx-auto"></div>
        </div>

        <div className="space-y-3">
          {options.map((option, idx) => {
            const isSelected = selectedValue === option.value
            const isHovered = hoveredOption === idx

            return (
              <motion.button
                key={idx}
                onClick={() => onChange(option.value)}
                onHoverStart={() => setHoveredOption(idx)}
                onHoverEnd={() => setHoveredOption(null)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? 'bg-blue-700/30 border-blue-400 shadow-lg shadow-blue-400/20'
                    : 'bg-slate-800/40 border-gray-700/40 hover:border-blue-500/50 hover:bg-slate-800/60'
                }`}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-medium transition-colors ${
                    isSelected ? 'text-white' : 'text-gray-300'
                  }`}>
                    {option.label}
                  </span>
                  {isSelected ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <ChevronRight className="w-5 h-5 text-blue-400" />
                    </motion.div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-600" />
                  )}
                </div>
                
                {option.description && (isSelected || isHovered) && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-sm text-gray-400 mt-2"
                  >
                    {option.description}
                  </motion.p>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>
    )
  }

  return null
}
