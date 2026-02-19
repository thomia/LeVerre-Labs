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
      "L'activité physique, c'est bon pour la santé... sauf au travail.",
      "Contrairement à une activité physique de loisir, l'activité physique au travail est caractérisée par la répétitivité, des efforts contraints et un environnement non propice. C'est l'inverse d'une \"activité physique de santé.\"",
      "50% des accidents du travail",
      "88% des maladies professionnelles",
      "2x plus d'absences pour les travailleurs exposés à des contraintes physiques",
      "a d'abord existé sous sa forme la plus simple :",
      "un FEUTRE, un TABLEAU BLANC et un MESSAGE à faire passer.",
      "Après plusieurs phases de recherche et validation, il a évolué vers une version numérique interactive pour guider n'importe quel utilisateur qui souhaiterais améliorer les conditions de travail."
    ]
  }

  const approachSection = {
    title: "Notre Approche",
    description: [
      "\"C'est la goutte d'eau qui fait déborder le vase.\""
    ]
  }

  const missionSection = {
    title: "Notre Mission",
    description: [
      "Jour après jour, nous travaillons pour vous proposer un accompagnement qui aborde ce risque différemment : sur le terrain, avec vos équipes, à travers une métaphore visuelle que tout le monde comprend en moins de 5 minutes.",
      " Garantissant une cohérence scientifique et respectant la réglementation."
    ]
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <div
        ref={featureRef}
        className="fixed top-0 left-0 right-0 w-full h-screen z-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-100/30 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 w-[90%] mx-auto pt-[15%] sm:w-[80%] sm:pt-[10%] pb-24">
        {/* Texte hero */}
        <section className="mb-20">
          <div className="text-2xl md:text-3xl lg:text-4xl font-light text-slate-300 mb-6 leading-[1.3] text-center max-w-4xl mx-auto tracking-tight space-y-2">
            <WordFadeIn
              words="L'ergonomie ne devrait pas être réservée aux ergonomes."
              className="text-2xl md:text-3xl lg:text-4xl font-light text-slate-700 leading-[1.3] tracking-tight"
              delay={0.08}
            />
            <WordFadeIn
              words="La prévention ne devrait pas être réservée aux préventeurs."
              className="text-2xl md:text-3xl lg:text-4xl font-light text-slate-700 leading-[1.3] tracking-tight"
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
                background: 'linear-gradient(to right, rgba(245,241,232,0.9) 0%, rgb(255,30,90) 50%, rgba(245,241,232,0.9) 100%)',
                filter: 'blur(0.5px)',
                maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)'
              }}
            />
          </motion.div>
        </section>

        {/* Logo animé entre les barres */}
        <motion.div
          className="flex justify-center my-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <AnimatedLogo size={450} color="rgb(255, 30, 90)" />
        </motion.div>

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
                  background: 'linear-gradient(to right, rgba(245,241,232,0.85) 0%, rgb(255,30,90) 50%, rgba(245,241,232,0.85) 100%)',
                  filter: 'blur(0.5px)',
                  maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)'
                }}
              />
            </motion.div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-slate-900 mb-20 text-center tracking-tight">
              {historySection.title}
            </h2>
            
            {/* Premier paragraphe - Accroche principale */}
            <p className="text-3xl md:text-4xl font-semibold text-slate-900 leading-[1.4] text-center mb-16">
              {historySection.description[0]}
            </p>
            
            {/* Deuxième paragraphe - Explication */}
            <p className="text-xl md:text-2xl text-slate-700 leading-[1.7] font-light text-center mb-16 max-w-4xl mx-auto">
              {historySection.description[1]}
            </p>
            
            {/* Statistiques discrètes */}
            <div className="space-y-3 mb-20 max-w-2xl mx-auto">
              <p className="text-lg md:text-xl text-slate-600 text-center font-light">
                {historySection.description[2]}
              </p>
              <p className="text-lg md:text-xl text-slate-600 text-center font-light">
                {historySection.description[3]}
              </p>
              <p className="text-lg md:text-xl text-slate-600 text-center font-light">
                {historySection.description[4]}
              </p>
            </div>
            
            {/* Séparateur visuel */}
            <motion.div
              className="relative mx-auto mb-16"
              initial={{ width: 0 }}
              whileInView={{ width: "20rem" }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="h-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent rounded-full" />
            </motion.div>
            
            {/* Origine de LeVerre Labs */}
            <div className="space-y-6 text-center mb-16">
              <p className="text-xl md:text-2xl text-slate-700 leading-[1.7] font-light">
                <span className="text-[rgb(255,30,90)] font-bold">Le</span>
                <span className="text-[rgb(255,30,90)] font-bold">Verre</span>
                <span className="text-slate-600 font-bold"> Labs</span> {historySection.description[5]}
              </p>
              <p className="text-3xl md:text-4xl font-bold text-slate-900 leading-[1.4] py-6">
                {historySection.description[6]}
              </p>
              <p className="text-xl md:text-2xl text-slate-700 leading-[1.7] font-light max-w-4xl mx-auto">
                {historySection.description[7]}
              </p>
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
                  background: 'linear-gradient(to right, rgba(245,241,232,0.85) 0%, rgb(255,30,90) 50%, rgba(245,241,232,0.85) 100%)',
                  filter: 'blur(0.5px)',
                  maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)'
                }}
              />
            </motion.div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-slate-900 mb-16 text-center tracking-tight">
              {approachSection.title}
            </h2>
            <div className="space-y-12 text-xl md:text-2xl text-slate-700 leading-[1.7] font-light text-center">
              <p className="text-slate-900 text-2xl md:text-3xl font-normal leading-[1.5] mb-8">
                {approachSection.description[0]}
              </p>
              <p>
                <span className="text-[rgb(255,30,90)] font-bold">Le</span>
                <span className="text-[rgb(255,30,90)] font-bold">Verre</span>
                <span className="text-slate-600 font-bold"> Labs</span>
                <span> utilise cette métaphore universelle pour rendre visible la dynamique d'accumulation des contraintes.</span>
              </p>
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
                  background: 'linear-gradient(to right, rgba(245,241,232,0.85) 0%, rgb(255,30,90) 50%, rgba(245,241,232,0.85) 100%)',
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
                  background: 'linear-gradient(to right, rgba(245,241,232,0.85) 0%, rgb(255,30,90) 50%, rgba(245,241,232,0.85) 100%)',
                  filter: 'blur(0.5px)',
                  maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)'
                }}
              />
            </motion.div>
          </motion.div>
          <motion.a
            href="mailto:leverrelabs@gmail.com?subject=Rejoindre le projet LeVerre Labs"
            className="inline-flex items-center gap-2 mt-6 px-8 py-4 rounded-lg border-2 border-[rgb(255,30,90)] text-[rgb(255,30,90)] hover:bg-[rgb(255,30,90)] hover:text-white transition-all duration-300 font-bold text-lg shadow-[0_0_15px_rgba(255,30,90,0.2)] hover:shadow-[0_0_25px_rgba(255,30,90,0.4)]"
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
