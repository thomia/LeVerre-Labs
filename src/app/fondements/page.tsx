"use client"

import { motion } from 'framer-motion'
import { BookOpen, Lightbulb, FlaskConical, Target, Users, Award } from 'lucide-react'

export default function FondementsPage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-400">
              Fondements Scientifiques
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Découvrez l'histoire, la méthodologie et les bases scientifiques du modèle{' '}
            <span className="text-[rgb(255,30,90)] font-semibold">LeVerre</span> Labs
          </p>
        </motion.div>

        {/* Histoire du modèle */}
        <section id="histoire" className="mb-24 scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-[rgb(255,30,90)]/10 rounded-xl border border-[rgb(255,30,90)]/20">
                <BookOpen className="w-8 h-8 text-[rgb(255,30,90)]" />
              </div>
              <h2 className="text-4xl font-bold text-white">Histoire du modèle</h2>
            </div>

            <div className="prose prose-invert prose-lg max-w-none">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-semibold text-white mb-4">La genèse</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  [À compléter avec votre storytelling - comment l'idée est née, les premiers constats sur le terrain, 
                  les difficultés rencontrées avec les méthodes traditionnelles...]
                </p>
                
                <h3 className="text-2xl font-semibold text-white mb-4">L'inspiration</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  [À compléter - pourquoi la métaphore du verre ? Comment cette idée a-t-elle émergé ? 
                  Les discussions, les itérations...]
                </p>

                <h3 className="text-2xl font-semibold text-white mb-4">Le développement</h3>
                <p className="text-gray-300 leading-relaxed">
                  [À compléter - les étapes de conception, les tests terrain, les ajustements, 
                  les retours des utilisateurs...]
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Pourquoi cette métaphore */}
        <section id="metaphore" className="mb-24 scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <Lightbulb className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-4xl font-bold text-white">Pourquoi cette métaphore ?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 rounded-2xl p-6 border border-blue-400/20">
                <h3 className="text-xl font-semibold text-blue-400 mb-3">Universellement compréhensible</h3>
                <p className="text-gray-300">
                  Le concept d'un verre qui se remplit est immédiatement accessible à tous, 
                  du directeur à l'opérateur, créant un langage commun.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 rounded-2xl p-6 border border-green-400/20">
                <h3 className="text-xl font-semibold text-green-400 mb-3">Visuellement puissant</h3>
                <p className="text-gray-300">
                  La métaphore visuelle permet de comprendre instantanément les concepts complexes 
                  de charge de travail et de récupération.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 rounded-2xl p-6 border border-purple-400/20">
                <h3 className="text-xl font-semibold text-purple-400 mb-3">Dynamique et interactif</h3>
                <p className="text-gray-300">
                  Le modèle montre les interactions en temps réel entre les différents facteurs, 
                  rendant l'ergonomie tangible.
                </p>
              </div>

              <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 rounded-2xl p-6 border border-yellow-400/20">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">Pédagogiquement efficace</h3>
                <p className="text-gray-300">
                  La métaphore facilite la mémorisation et l'appropriation des concepts ergonomiques 
                  par tous les acteurs.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Méthodologie */}
        <section id="methodologie" className="mb-24 scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <FlaskConical className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-4xl font-bold text-white">Méthodologie de développement</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl p-8 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgb(255,30,90)]/20 flex items-center justify-center text-[rgb(255,30,90)] font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Revue de littérature scientifique</h3>
                    <p className="text-gray-300">
                      Analyse approfondie des publications scientifiques sur les TMS, l'ergonomie, 
                      la physiologie du travail et les facteurs de risque professionnels.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl p-8 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgb(255,30,90)]/20 flex items-center justify-center text-[rgb(255,30,90)] font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Observations terrain</h3>
                    <p className="text-gray-300">
                      Études de situations de travail réelles pour identifier les besoins concrets 
                      et les limites des approches existantes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl p-8 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgb(255,30,90)]/20 flex items-center justify-center text-[rgb(255,30,90)] font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Conception itérative</h3>
                    <p className="text-gray-300">
                      Développement progressif du modèle avec tests utilisateurs, ajustements 
                      et validation par des experts en ergonomie.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl p-8 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgb(255,30,90)]/20 flex items-center justify-center text-[rgb(255,30,90)] font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Validation empirique</h3>
                    <p className="text-gray-300">
                      Tests en conditions réelles dans différents secteurs d'activité pour 
                      valider l'efficacité et l'acceptabilité du modèle.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Références scientifiques */}
        <section id="references" className="mb-24 scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                <Award className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-4xl font-bold text-white">Références scientifiques</h2>
            </div>

            <div className="space-y-12">
              {/* Verre - Facteurs individuels */}
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl p-8 border border-gray-400/20">
                <h3 className="text-2xl font-semibold text-gray-300 mb-6 flex items-center gap-3">
                  <span className="text-4xl">🥃</span>
                  Le Verre - Facteurs Individuels
                </h3>
                <div className="space-y-4 text-sm text-gray-400">
                  <p>[1] Cruz-Jentoft, A. J., et al. (2019). Sarcopenia: revised European consensus on definition and diagnosis. <em>Age and Ageing</em>, 48(1), 16-31.</p>
                  <p>[2] Jerban, S., Ma, Y., Namiranian, B. et al. (2019). Age-related decrease in collagen proton fraction in tibial tendons. <em>Sci Rep</em> 9, 17974.</p>
                  <p>[3] Loeser, R. F., et al. (2012). Osteoarthritis: a disease of the joint as an organ. <em>Arthritis & Rheumatology</em>, 64(6), 1697-1707.</p>
                  <p>[4] Andersen, L. L., et al. (2017). Physical fitness in relation to transport to school in adolescents: the HELENA study. <em>International Journal of Behavioral Nutrition and Physical Activity</em>, 14(1), 96.</p>
                  <p>[5] Nordander, C., et al. (2016). Fish processing work: the impact of two sex dependent exposure profiles on musculoskeletal health. <em>Occupational and Environmental Medicine</em>, 73(11), 722-728.</p>
                  <p>[6] Côté, J. N. (2012). A critical review on physical factors and functional characteristics that may explain a sex/gender difference in work-related neck/shoulder disorders. <em>Ergonomics</em>, 55(2), 173-182.</p>
                  <p>[7] Viegas, F., et al. (2022). The sleep as a predictor of musculoskeletal injuries in adolescent athletes. <em>Sleep science</em>, 15(3), 305–311.</p>
                  <p>[8] Webster, J., et al. (2023). Nutritional strategies to optimise musculoskeletal health. <em>Bone reports</em>, 19, 101684.</p>
                </div>
              </div>

              {/* Robinet - Charge de travail */}
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl p-8 border border-blue-400/20">
                <h3 className="text-2xl font-semibold text-blue-400 mb-6 flex items-center gap-3">
                  <span className="text-4xl">🚰</span>
                  Le Robinet - Charge de Travail
                </h3>
                <div className="space-y-4 text-sm text-gray-400">
                  <p>[9] Kumar, S. (2001). Theories of musculoskeletal injury causation. <em>Ergonomics</em>, 44(1), 17-47.</p>
                  <p>[10] Waters, T. R., et al. (1993). Revised NIOSH equation for the design and evaluation of manual lifting tasks. <em>Ergonomics</em>, 36(7), 749-776.</p>
                  <p>[11] Liu, F., et al. (2025). Mixed adverse ergonomic factors exposure in relation to work-related musculoskeletal disorders. <em>Sci Rep</em> 15, 14705.</p>
                  <p>[12] Buckle, P. W., & Devereux, J. J. (2002). The nature of work-related neck and upper limb musculoskeletal disorders. <em>Applied Ergonomics</em>, 33(3), 207-217.</p>
                  <p>[13] Hart, S. G., & Staveland, L. E. (1988). Development of NASA-TLX. <em>Advances in Psychology</em>, 52, 139-183.</p>
                  <p>[14] Karasek, R., et al. (1998). The Job Content Questionnaire (JCQ): an instrument for internationally comparative assessments of psychosocial job characteristics. <em>Journal of Occupational Health Psychology</em>, 3(4), 322.</p>
                </div>
              </div>

              {/* Bulle - Environnement */}
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl p-8 border border-purple-400/20">
                <h3 className="text-2xl font-semibold text-purple-400 mb-6 flex items-center gap-3">
                  <span className="text-4xl">🫧</span>
                  La Bulle - Environnement de Travail
                </h3>
                <div className="space-y-4 text-sm text-gray-400">
                  <p>[15] Bovenzi, M., & Hulshof, C. T. J. (1999). An updated review of epidemiologic studies on whole-body vibration and low back pain. <em>Int Arch Occup Environ Health</em>, 72(6), 351-365.</p>
                  <p>[16] Magnavita, N., et al. (2011). Environmental discomfort and musculoskeletal disorders. <em>Occupational medicine</em>, 61(3), 196-201.</p>
                  <p>[17] Hedge, A., et al. (1995). Effects of lensed-indirect and parabolic lighting on the satisfaction, visual health, and productivity of office workers. <em>Ergonomics</em>, 38(2), 260-280.</p>
                </div>
              </div>

              {/* Orage - Aléas */}
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl p-8 border border-yellow-400/20">
                <h3 className="text-2xl font-semibold text-yellow-400 mb-6 flex items-center gap-3">
                  <span className="text-4xl">⛈️</span>
                  L'Orage - Aléas et Imprévus
                </h3>
                <div className="space-y-4 text-sm text-gray-400">
                  <p>[18] Berthet, M., & Cru, D. (2003). Travail prescrit, travail réel et santé au travail. <em>Travail et emploi</em>, 96, 85-96.</p>
                </div>
              </div>

              {/* Paille - Récupération */}
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl p-8 border border-green-400/20">
                <h3 className="text-2xl font-semibold text-green-400 mb-6 flex items-center gap-3">
                  <span className="text-4xl">🥤</span>
                  La Paille - Stratégies de Récupération
                </h3>
                <div className="space-y-4 text-sm text-gray-400">
                  <p>[19] Ding, Y., et al. (2020). It is time to have rest: how do break types affect muscular activity during prolonged sitting work. <em>Safety and health at work</em>, 11(2), 207-214.</p>
                  <p>[20] INRS. (2018). Pratique d'exercices physiques au travail et prévention des TMS - Revue de la littérature. Brochure TC 161.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center bg-gradient-to-br from-[rgb(255,30,90)]/10 to-[rgb(255,60,120)]/10 rounded-2xl p-12 border border-[rgb(255,30,90)]/20"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à transformer votre approche de la prévention ?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Découvrez comment le modèle LeVerre Labs peut vous aider à améliorer 
            la santé et la performance de vos équipes.
          </p>
          <a
            href="/vitrine"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[rgb(255,30,90)] to-[rgb(255,60,120)] rounded-full hover:shadow-[0_0_30px_rgba(255,30,90,0.5)] transition-all duration-300"
          >
            Découvrir le modèle
          </a>
        </motion.div>
      </div>
    </div>
  )
}
