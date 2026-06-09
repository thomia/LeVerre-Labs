"use client"

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Award } from 'lucide-react'
import { WordFadeIn } from '@/components/ui/word-fade-in'
import AnimatedLogo from '@/components/ui/animated-logo'
import { MagnetizeFrame } from '@/components/ui/magnetize-frame'

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
      "Jour après jour, nous travaillons pour vous proposer un logiciel qui simplifie l'analyse et l'optimisation des conditions de travail.",
      " Garantissant une cohérence scientifique et respectant la règlementation."
    ]
  }

  return (
    <div className="min-h-screen bg-black">
      <div
        ref={featureRef}
        className="fixed top-0 left-0 right-0 w-full h-screen z-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/2 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 w-[90%] mx-auto pt-[15%] sm:w-[80%] sm:pt-[10%] pb-24">
        {/* Texte hero */}
        <section className="mb-20">
          <div className="text-2xl md:text-3xl lg:text-4xl font-light text-slate-300 mb-6 leading-[1.3] text-center max-w-4xl mx-auto tracking-tight space-y-2">
            <WordFadeIn
              words="L'ergonomie ne devrait pas être réservée aux ergonomes."
              className="text-2xl md:text-3xl lg:text-4xl font-light text-slate-300 leading-[1.3] tracking-tight"
              delay={0.08}
            />
            <WordFadeIn
              words="La prévention ne devrait pas être réservée aux préventeurs."
              className="text-2xl md:text-3xl lg:text-4xl font-light text-slate-300 leading-[1.3] tracking-tight"
              delay={0.08}
            />
          </div>
          
          <div className="mb-12 flex justify-center">
            <WordFadeIn 
              words="La santé au travail est l'affaire de chacun."
              className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-[1.2] text-center max-w-5xl mx-auto tracking-tight"
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
                  background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgb(255,30,90) 50%, rgba(0,0,0,0.85) 100%)',
                  filter: 'blur(0.5px)',
                  maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)'
                }}
              />
            </motion.div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-20 text-center tracking-tight">
              {historySection.title}
            </h2>
            
            {/* Premier paragraphe - Accroche principale */}
            <p className="text-3xl md:text-4xl font-semibold text-white leading-[1.4] text-center mb-16">
              {historySection.description[0]}
            </p>
            
            {/* Deuxième paragraphe - Explication */}
            <p className="text-xl md:text-2xl text-slate-300 leading-[1.7] font-light text-center mb-16 max-w-4xl mx-auto">
              {historySection.description[1]}
            </p>
            
            {/* Statistiques discrètes */}
            <div className="space-y-3 mb-20 max-w-2xl mx-auto">
              <p className="text-lg md:text-xl text-slate-400 text-center font-light">
                {historySection.description[2]}
              </p>
              <p className="text-lg md:text-xl text-slate-400 text-center font-light">
                {historySection.description[3]}
              </p>
              <p className="text-lg md:text-xl text-slate-400 text-center font-light">
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
              <div className="h-1 bg-gradient-to-r from-transparent via-slate-600 to-transparent rounded-full" />
            </motion.div>
            
            {/* Origine de LeVerre Labs */}
            <div className="space-y-6 text-center mb-16">
              <p className="text-xl md:text-2xl text-slate-300 leading-[1.7] font-light">
                <span className="text-[rgb(255,30,90)] font-bold">Le</span>
                <span className="text-[rgb(255,30,90)] font-bold">Verre</span>
                <span className="text-slate-400 font-bold"> Labs</span> {historySection.description[5]}
              </p>
              <p className="text-3xl md:text-4xl font-bold text-white leading-[1.4] py-6">
                {historySection.description[6]}
              </p>
              <p className="text-xl md:text-2xl text-slate-300 leading-[1.7] font-light max-w-4xl mx-auto">
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
                  background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgb(255,30,90) 50%, rgba(0,0,0,0.85) 100%)',
                  filter: 'blur(0.5px)',
                  maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)'
                }}
              />
            </motion.div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-16 text-center tracking-tight">
              {approachSection.title}
            </h2>
            <div className="space-y-12 text-xl md:text-2xl text-slate-300 leading-[1.7] font-light text-center">
              <p className="text-white text-2xl md:text-3xl font-normal leading-[1.5] mb-8">
                {approachSection.description[0]}
              </p>
              <p>
                <span className="text-[rgb(255,30,90)] font-bold">Le</span>
                <span className="text-[rgb(255,30,90)] font-bold">Verre</span>
                <span className="text-slate-400 font-bold"> Labs</span>
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
                  background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgb(255,30,90) 50%, rgba(0,0,0,0.85) 100%)',
                  filter: 'blur(0.5px)',
                  maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)'
                }}
              />
            </motion.div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-16 text-center tracking-tight">
              {missionSection.title}
            </h2>
            <div className="space-y-12 text-xl md:text-2xl text-slate-300 leading-[1.7] font-light text-center">
              {missionSection.description.map((paragraph, index) => (
                <p key={index} className={index === 0 ? "text-white text-2xl md:text-3xl font-normal leading-[1.5] mb-8" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Section Notre Recherche
            Suit le même pattern que Notre Histoire / Approche / Mission :
            barre décorative rouge animée + h2 grande taille + paragraphes
            en gros texte storytelling. Y est intégré le badge prix MODACT
            et la vignette du poster cliquable. */}
        <section className="py-20 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto px-4"
          >
            {/* Barre décorative rouge animée (idem Mission) */}
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

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-10 text-center tracking-tight">
              Notre Recherche
            </h2>

            {/* Bloc texte storytelling (même structure que Mission).
                Ton humble : on parle de la conférence et de ses enjeux,
                pas de la distinction. Celle-ci est juste signalée par
                un petit badge rouge en coin de la vignette du poster. */}
            <div className="space-y-12 text-xl md:text-2xl text-slate-300 leading-[1.7] font-light text-center">
              <p className="text-white text-2xl md:text-3xl font-normal leading-[1.5] mb-8">
                Une démarche pensée pour être partagée.
              </p>
              <p>
                Présenté lors de{' '}
                <a
                  href="https://www.modact.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
                >
                  ModACT 2026
                </a>
                , conférence scientifique réunissant des expertises variées autour de la
                modélisation de l’activité humaine.
              </p>
            </div>

            {/* Vignette du poster cliquable, centrée, taille modérée
                pour ne pas déséquilibrer la composition. Englobée dans
                un MagnetizeFrame : au survol, des billes rouges en
                orbite convergent au centre du poster (call-to-action
                silencieux qui remplace l'ancien bouton). */}
            <MagnetizeFrame
              className="mx-auto mt-16 w-full max-w-xs"
              particleCount={20}
              spread={220}
            >
            <motion.a
              href="https://popups.uliege.be/3041-4687/index.php?id=626"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ scale: 1.03 }}
              className="group relative block cursor-pointer"
            >
              {/* Pastille ronde rouge LeVerre signalant la distinction
                  sans texte. Au survol : tooltip natif via `title`. */}
              <div
                className="absolute -top-3 -right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[rgb(255,30,90)] text-white"
                style={{ boxShadow: '0 4px 14px rgba(255,30,90,0.45)' }}
                title="Meilleur poster scientifique — ModACT 2026"
              >
                <Award className="h-4 w-4" strokeWidth={2.2} />
              </div>

              <div
                className="relative overflow-hidden rounded-md border border-white/15 transition-all duration-300 group-hover:border-[rgb(255,30,90)]/50"
                style={{
                  boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
                }}
              >
                <img
                  src="/photo%20video/poster.JPG"
                  alt="Poster scientifique LeVerre Labs présenté à MODACT 2026"
                  className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                {/* Halo rouge subtil au hover */}
                <div className="absolute inset-0 bg-[rgb(255,30,90)]/0 transition-colors duration-300 group-hover:bg-[rgb(255,30,90)]/10" />
              </div>
            </motion.a>
            </MagnetizeFrame>
          </motion.div>
        </section>
      </div>
    </div>
  )
}

export default ParallaxFondementsPage
