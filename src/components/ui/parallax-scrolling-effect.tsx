"use client"

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { WordFadeIn } from '@/components/ui/word-fade-in'
import AnimatedLogo from '@/components/ui/animated-logo'

const ParallaxFondementsPage = () => {
  const featureRef = useRef<HTMLDivElement>(null)
  const opaqueRef = useRef<HTMLDivElement>(null)
  const [showOpaque, setShowOpaque] = useState(false)

  useEffect(() => {
    const featureEl = featureRef.current
    if (!featureEl) return

    const onScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollProgress = scrollTop / (document.documentElement.scrollHeight - window.innerHeight)
      
      // Fade out du container au scroll
      featureEl.style.opacity = `${Math.max(0, 1 - scrollProgress * 1.3)}`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // Appel initial

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const historySection = {
    title: "Notre Histoire",
    description: [
      "LeVerre Labs part d'un constat simple : les contraintes physiques au travail restent la première cause d'accidents et de problèmes de santé. Les compétences en ergonomie au travail reste un luxe pour les organisations.",
      "Le Modèle du Verre a d'abord existé sous sa forme la plus simple : un feutre, un tableau blanc et un message à faire passer. Après plusieurs phases de recherche, validation et design, il a évolué vers une version numérique interactive pour guider n'importe quel utilisateur qui souhaiterais améliorer les conditions de travail."
    ]
  }

  const approachSection = {
    title: "Notre Approche",
    description: [
      "LeVerre Labs transforme l'invisible en évidence.",
      "Tout le monde connaît l'expression : \"c'est la goutte d'eau qui fait déborder le vase\". Nous l'utilisons et l'appliquons dans toutes nos fonctionnalités"
    ]
  }

  const missionSection = {
    title: "Notre Mission",
    description: [
      "Démocratiser le savoir. Multiplier le pouvoir d'agir.",
      "Jour après jour, nous travaillons pour vous proposer une expérience portée par un logiciel fondé sur les meilleurs principes d'UX design.",
      "LeVerre Labs veut donner à chacun le pouvoir de comprendre simplement l'impact du travail sur sa santé et d'agir concrètement pour le transformer."
    ]
  }

  return (
    <div className="text-slate-900 min-h-screen" style={{ backgroundColor: '#E8E8E8' }}>
      <div
        ref={featureRef}
        className="fixed top-0 left-0 right-0 w-full h-screen z-0 overflow-hidden"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
          style={{
            background: 'radial-gradient(circle at 50% 30%, rgba(238, 238, 238, 1) 0%, rgba(232, 232, 232, 1) 40%, rgba(226, 226, 226, 1) 100%)',
          }}
        />
      </div>

      <div className="relative z-10 w-[90%] mx-auto pt-[15%] sm:w-[80%] sm:pt-[10%] pb-24">
        {/* Logo animé en header */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <AnimatedLogo size={350} />
        </motion.div>

        {/* Texte hero sous le logo */}
        <section className="mb-20">
          <div className="text-2xl md:text-3xl lg:text-4xl font-light text-slate-800 mb-6 leading-[1.3] text-center max-w-4xl mx-auto tracking-tight space-y-2">
            <WordFadeIn
              words="L'ergonomie ne devrait pas être réservée aux ergonomes."
              className="text-2xl md:text-3xl lg:text-4xl font-light text-slate-800 leading-[1.3] tracking-tight"
              delay={0.08}
            />
            <WordFadeIn
              words="La prévention ne devrait pas être réservée aux préventeurs."
              className="text-2xl md:text-3xl lg:text-4xl font-light text-slate-800 leading-[1.3] tracking-tight"
              delay={0.08}
            />
          </div>
          
          <div className="mb-12 flex justify-center">
            <WordFadeIn 
              words="La santé au travail est l'affaire de chacun."
              className="text-3xl md:text-4xl lg:text-5xl font-semibold text-slate-900 leading-[1.2] text-center max-w-5xl mx-auto tracking-tight"
              delay={0.08}
            />
          </div>

          <motion.div
            className="relative mx-auto"
            initial={{ width: 0, height: 0 }}
            animate={{ width: "50rem", height: "0.25rem" }}
            transition={{ duration: 1, delay: 5.8, ease: "easeOut" }}
          >
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgb(255,30,90) 50%, rgba(0,0,0,0.9) 100%)',
                filter: 'blur(0.5px)',
                maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)'
              }}
            />
          </motion.div>
        </section>

        {/* Section Notre Histoire */}
        <section className="py-20 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto px-4"
          >
            <motion.div
              className="relative mx-auto mb-10"
              initial={{ width: 0, height: 0 }}
              whileInView={{ width: "38rem", height: "0.2rem" }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            >
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgb(255,30,90) 50%, rgba(0,0,0,0.85) 100%)',
                  filter: 'blur(0.5px)',
                  maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)'
                }}
              />
            </motion.div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-slate-900 mb-16 text-center tracking-tight">
              {historySection.title}
            </h2>
            <div className="space-y-12 text-xl md:text-2xl text-slate-700 leading-[1.7] font-light text-center">
              {historySection.description.map((paragraph, index) => (
                <p key={index} className={index === 0 ? "text-slate-900 text-2xl md:text-3xl font-normal leading-[1.5] mb-8" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Section Notre Approche */}
        <section className="py-20 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto px-4"
          >
            <motion.div
              className="relative mx-auto mb-10"
              initial={{ width: 0, height: 0 }}
              whileInView={{ width: "38rem", height: "0.2rem" }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            >
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgb(255,30,90) 50%, rgba(0,0,0,0.85) 100%)',
                  filter: 'blur(0.5px)',
                  maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)'
                }}
              />
            </motion.div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-slate-900 mb-16 text-center tracking-tight">
              {approachSection.title}
            </h2>
            <div className="space-y-12 text-xl md:text-2xl text-slate-700 leading-[1.7] font-light text-center">
              {approachSection.description.map((paragraph, index) => (
                <p key={index} className={index === 0 ? "text-slate-900 text-2xl md:text-3xl font-normal leading-[1.5] mb-8" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Section Notre Mission */}
        <section className="py-20 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto px-4"
          >
            <motion.div
              className="relative mx-auto mb-10"
              initial={{ width: 0, height: 0 }}
              whileInView={{ width: "38rem", height: "0.2rem" }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            >
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgb(255,30,90) 50%, rgba(0,0,0,0.85) 100%)',
                  filter: 'blur(0.5px)',
                  maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)'
                }}
              />
            </motion.div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-slate-900 mb-16 text-center tracking-tight">
              {missionSection.title}
            </h2>
            <div className="space-y-12 text-xl md:text-2xl text-slate-700 leading-[1.7] font-light text-center">
              {missionSection.description.map((paragraph, index) => (
                <p key={index} className={index === 0 ? "text-slate-900 text-2xl md:text-3xl font-normal leading-[1.5] mb-8" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </section>

        <motion.div
          className="mt-16 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 mb-3 leading-[1.15] tracking-tight">
              Tu partages cette vision ?
            </h3>
            <p className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[rgb(255,30,90)] mb-6 leading-[1.15] tracking-tight">
              Rejoins le projet !
            </p>
            <motion.div
              className="relative mx-auto"
              initial={{ width: 0, height: 0 }}
              whileInView={{ width: "32rem", height: "0.2rem" }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            >
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgb(255,30,90) 50%, rgba(0,0,0,0.85) 100%)',
                  filter: 'blur(0.5px)',
                  maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)'
                }}
              />
            </motion.div>
          </motion.div>
          <motion.a
            href="mailto:contact@leverrelabs.com?subject=Rejoindre le projet LeVerre Labs"
            className="inline-flex items-center gap-2 mt-6 px-8 py-4 rounded-lg border-2 border-[rgb(255,30,90)] text-[rgb(255,30,90)] hover:bg-[rgb(255,30,90)] hover:text-white transition-all duration-300 font-bold text-lg shadow-[0_0_15px_rgba(255,30,90,0.3)] hover:shadow-[0_0_25px_rgba(255,30,90,0.5)]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Contacte-nous <ArrowRight className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </div>
    </div>
  )
}

export default ParallaxFondementsPage
