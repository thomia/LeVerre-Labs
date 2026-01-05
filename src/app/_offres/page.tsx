"use client"

import { motion } from "framer-motion"
import { Check, ArrowRight, Users, Target, Microscope } from "lucide-react"
import Link from "next/link"

export default function OffresPage() {
  const offers = [
    {
      name: "Sensibilisation",
      icon: Users,
      tagline: "Pour les équipes opérationnelles",
      price: "Sur devis",
      description: "Formation courte pour sensibiliser vos équipes aux risques liés à l'activité physique.",
      duration: "2-3 heures",
      participants: "Jusqu'à 20 personnes",
      features: [
        "Introduction aux TMS et AT",
        "Découverte du Modèle du Verre",
        "Analyse d'une tâche simple",
        "Identification de solutions basiques",
        "Support visuel interactif",
        "Accès limité à l'interface",
      ],
      highlighted: false,
      gradient: "from-slate-900 to-slate-800",
    },
    {
      name: "Intermédiaire",
      icon: Target,
      tagline: "Recommandé pour tous",
      price: "Sur devis",
      description: "Formation complète pour comprendre et appliquer le Modèle du Verre sur vos postes de travail.",
      duration: "1 journée (7h)",
      participants: "Jusqu'à 15 personnes",
      features: [
        "Tout de Sensibilisation, plus :",
        "Découverte approfondie (1 tâche)",
        "Appropriation (3 tâches de votre quotidien)",
        "Observation sur le terrain",
        "Identification de solutions détaillées",
        "Simulation de solutions",
        "Comparaison avant/après",
        "Plan d'action personnalisé",
        "Accès complet à l'interface",
        "Support post-formation (30 jours)",
      ],
      highlighted: true,
      gradient: "from-[rgb(255,30,90)] to-[rgb(255,60,120)]",
    },
    {
      name: "Expert",
      icon: Microscope,
      tagline: "Pour une analyse approfondie",
      price: "Sur devis",
      description: "Formation experte pour mesurer et analyser en détail l'impact des contraintes sur la santé.",
      duration: "2 journées",
      participants: "Jusqu'à 12 personnes",
      features: [
        "Tout de Intermédiaire, plus :",
        "Analyse multi-postes (5+ tâches)",
        "Mesure précise des impacts",
        "Méthodes d'évaluation avancées",
        "Comparaison inter-postes",
        "Priorisation des actions",
        "ROI et coûts estimés",
        "Tableau de bord personnalisé",
        "Suivi à long terme",
        "Support prioritaire (90 jours)",
        "Formation de formateurs internes",
      ],
      highlighted: false,
      gradient: "from-slate-900 to-slate-800",
    },
  ]

  const timeline = [
    { phase: "Découverte", duration: "1h30", description: "Introduction et analyse de la première tâche" },
    { phase: "Appropriation", duration: "2h", description: "Application sur 3 tâches de votre quotidien" },
    { phase: "Observation", duration: "1h30", description: "Analyse d'une tâche sur le terrain" },
    { phase: "Solutions", duration: "1h", description: "Identification des leviers d'action" },
    { phase: "Simulation", duration: "45min", description: "Test et comparaison des solutions" },
    { phase: "Conclusion", duration: "15min", description: "Engagement et plan d'action" },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[rgb(255,30,90)]/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-slate-800/50 blur-3xl" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.span
              className="text-[rgb(255,30,90)] font-medium mb-4 uppercase tracking-wider text-sm inline-block"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Nos Offres
            </motion.span>
            <h1 className="text-4xl md:text-6xl font-light mb-6">
              Formations adaptées à{" "}
              <span className="text-[rgb(255,30,90)]">vos besoins</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              De la sensibilisation à l'expertise, découvrez nos formations basées sur le Modèle du Verre
              pour transformer votre approche de la prévention.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {offers.map((offer, index) => {
              const Icon = offer.icon
              return (
                <motion.div
                  key={offer.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative rounded-2xl p-8 ${
                    offer.highlighted
                      ? "bg-gradient-to-b from-slate-900 to-slate-800 border-2 border-[rgb(255,30,90)]"
                      : "bg-slate-900/50 border border-slate-700"
                  } ${offer.highlighted ? "scale-105 shadow-2xl shadow-[rgb(255,30,90)]/20" : ""}`}
                >
                  {offer.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[rgb(255,30,90)] text-white text-sm font-medium rounded-full">
                      Recommandé
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${offer.gradient}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-light">{offer.name}</h3>
                      <p className="text-sm text-gray-400">{offer.tagline}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-3xl font-light mb-2">{offer.price}</div>
                    <p className="text-gray-400 text-sm">{offer.description}</p>
                  </div>

                  <div className="mb-6 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-1 h-1 rounded-full bg-[rgb(255,30,90)]" />
                      <span className="text-gray-300">Durée : {offer.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-1 h-1 rounded-full bg-[rgb(255,30,90)]" />
                      <span className="text-gray-300">{offer.participants}</span>
                    </div>
                  </div>

                  <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-6" />

                  <ul className="space-y-3 mb-8">
                    {offer.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check
                          className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                            offer.highlighted ? "text-[rgb(255,30,90)]" : "text-gray-400"
                          }`}
                        />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                      offer.highlighted
                        ? "bg-[rgb(255,30,90)] hover:bg-[rgb(255,60,120)] text-white"
                        : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-600"
                    }`}
                  >
                    Demander un devis <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-slate-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-light mb-4">
              Déroulement de la formation{" "}
              <span className="text-[rgb(255,30,90)]">Intermédiaire</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Une journée structurée en 6 phases pour maîtriser le Modèle du Verre et l'appliquer à vos postes de
              travail.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[rgb(255,30,90)] via-slate-700 to-transparent hidden md:block" />

            {timeline.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative mb-12 md:flex md:items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                  <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 hover:border-[rgb(255,30,90)]/50 transition-colors">
                    <div className="flex items-center gap-3 mb-2 md:justify-end">
                      <span className="text-2xl font-light">{phase.phase}</span>
                      <span className="px-3 py-1 bg-[rgb(255,30,90)]/10 text-[rgb(255,30,90)] rounded-full text-sm">
                        {phase.duration}
                      </span>
                    </div>
                    <p className="text-gray-400">{phase.description}</p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
                  <div className="w-4 h-4 rounded-full bg-[rgb(255,30,90)] border-4 border-black" />
                </div>

                <div className="md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(255,30,90)]/10 to-transparent" />

        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-light mb-6">
              Prêt à transformer votre <span className="text-[rgb(255,30,90)]">prévention</span> ?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Contactez-nous pour discuter de vos besoins et obtenir un devis personnalisé.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="mailto:leverrelabs@gmail.com?subject=Demande de devis formation LeVerre Labs"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-[rgb(255,30,90)] hover:bg-[rgb(255,60,120)] text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                Demander un devis <ArrowRight className="w-5 h-5" />
              </motion.a>
              <Link href="/fondements">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium border border-slate-700 transition-colors"
                >
                  En savoir plus
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
