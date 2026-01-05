"use client"

import { motion } from 'framer-motion'
import AnimatedLogo from './animated-logo'

export default function HeroSection() {
  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Section Intro - Problématique */}
      <div className="relative text-center mb-16">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.015]">
            <div 
              className="absolute inset-0" 
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgb(255,255,255) 1px, transparent 1px),
                  linear-gradient(to bottom, rgb(255,255,255) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px'
              }}
            />
          </div>
          
          {/* Gradient Orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[rgb(255,30,90)]/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
        </div>

        {/* Title with gradient */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="relative text-5xl md:text-6xl lg:text-7xl font-bold mb-16 tracking-tight"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-400">
            Comprendre pour transformer
          </span>
        </motion.h2>
        
        {/* Stats Card with modern design */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative group"
        >
          {/* Glow effect on hover */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[rgb(255,30,90)] via-purple-500 to-[rgb(255,30,90)] rounded-3xl opacity-20 group-hover:opacity-40 blur-xl transition-all duration-500" />
          
          {/* Main card */}
          <div className="relative bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-black/95 backdrop-blur-xl rounded-3xl p-10 md:p-12 max-w-5xl mx-auto border border-white/10 shadow-2xl">
            {/* Top highlight bar */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-[rgb(255,30,90)] to-transparent rounded-full" />
            
            {/* Content */}
            <div className="space-y-8">
              {/* Stats */}
              <div className="relative">
                <p className="text-2xl md:text-3xl lg:text-4xl text-white font-bold mb-2 leading-relaxed">
                  88% des maladies professionnelles et 50% des accidents du travail :
                </p>
                
                <div className="relative inline-block">
                  <p className="text-xl md:text-2xl lg:text-3xl text-[rgb(255,30,90)] font-semibold">
                    tous liés à l'activité physique au travail.
                  </p>
                  {/* Underline effect */}
                  <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[rgb(255,30,90)] to-transparent" />
                </div>
              </div>
              
              {/* Separator */}
              <div className="relative py-8">
                <div className="flex items-center gap-8">
                  <div className="flex-1 border-t border-white/5" />
                  <AnimatedLogo size={96} className="flex-shrink-0" />
                  <div className="flex-1 border-t border-white/5" />
                </div>
              </div>
              
              {/* Description */}
              <div className="relative">
                <p className="text-lg md:text-xl lg:text-2xl text-gray-100 leading-relaxed">
                  <span className="font-bold text-white relative">
                    LeVerre Labs
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[rgb(255,30,90)]/50 to-transparent" />
                  </span>{' '}
                  simplifie la prévention de ce risque. 
                  Une métaphore visuelle qui permet de{' '}
                  <span className="relative inline-block group/word">
                    <span className="text-[rgb(255,30,90)] font-semibold">sensibiliser</span>
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[rgb(255,30,90)] group-hover/word:w-full transition-all duration-300" />
                  </span>
                  ,{' '}
                  <span className="relative inline-block group/word">
                    <span className="text-[rgb(255,60,120)] font-semibold">former</span>
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[rgb(255,60,120)] group-hover/word:w-full transition-all duration-300" />
                  </span>
                  ,{' '}
                  <span className="relative inline-block group/word">
                    <span className="text-[rgb(255,40,100)] font-semibold">analyser</span>
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[rgb(255,40,100)] group-hover/word:w-full transition-all duration-300" />
                  </span>
                  {' '}et{' '}
                  <span className="relative inline-block group/word">
                    <span className="text-[rgb(255,50,110)] font-semibold">transformer</span>
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[rgb(255,50,110)] group-hover/word:w-full transition-all duration-300" />
                  </span>
                  {' '}vos postes de travail,{' '}
                  adapté à votre organisation.
                </p>
              </div>
              
              {/* Bottom accent dots */}
              <div className="flex justify-center gap-1.5 pt-4">
                <div className="w-1.5 h-1.5 rounded-full bg-[rgb(255,30,90)]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[rgb(255,30,90)]/60" />
                <div className="w-1.5 h-1.5 rounded-full bg-[rgb(255,30,90)]/30" />
              </div>
            </div>
            
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-l border-t border-[rgb(255,30,90)]/20 rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-r border-b border-[rgb(255,30,90)]/20 rounded-br-3xl" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
