"use client"

import { motion } from 'framer-motion'
import { LampContainer } from '@/components/ui/lamp'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import { StickyScrollSections } from '@/components/ui/sticky-scroll-sections'

export default function FondementsPage() {
  const sectionsData = [
    {
      title: "Notre Mission",
      content: (
        <div className="space-y-12 text-lg md:text-xl text-gray-400 font-normal leading-relaxed mb-32 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            L'ergonomie ne devrait pas être réservée aux ergonomes. La prévention ne devrait pas être réservée aux préventeurs. 
            La <span className="text-white">santé au travail est l'affaire de chacun</span>.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Jour après jour, nous travaillons pour proposer une expérience d'apprentissage qui donne 
            le <span className="text-white">pouvoir à chacun</span> de comprendre simplement l'impact du travail sur sa santé. Les messages les plus simples sont les plus puissants.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8 p-6 bg-gradient-to-r from-gray-900 to-black border-l-4 border-[rgb(255,30,90)] text-center"
          >
            <p className="text-2xl md:text-3xl text-white font-light italic">
              Démocratiser le savoir. Multiplier le pouvoir d'agir.
            </p>
          </motion.div>
        </div>
      )
    },
    {
      title: "Origines",
      content: (
        <div className="space-y-12 text-lg md:text-xl text-gray-400 leading-relaxed mb-32 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-[rgb(255,30,90)] font-bold">LeVerre Labs</span> est né au fil d'années d'expérience en entreprise, d'un travail de préventeur et ergonome 
            confronté jour après jour aux enjeux des <span className="text-white">accidents du travail et des TMS</span>.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Le constat s'est imposé progressivement : malgré des formations scientifiquement fondées, les contenus 
            traditionnels ne parvenaient pas à créer une <span className="text-white">connexion directe</span> avec la réalité vécue par les travailleurs.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            L'enjeu était clair : rendre ces notions complexes <span className="text-white">immédiatement compréhensibles et appropriables</span> par tous, 
            sans nécessiter de formation préalable en physiologie ou ergonomie.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-6 bg-gradient-to-r from-gray-900 to-black border-l-4 border-[rgb(255,30,90)] rounded-r-lg text-center"
          >
            <p className="text-gray-400">
              Le <span className="text-white">Modèle du Verre</span> a d'abord existé sous sa forme la plus simple : un feutre, un tableau blanc et un message 
              à faire passer. Après des mois de tests terrain et d'itérations successives, il a été formalisé dans un mémoire 
              de Mastère puis développé en outil numérique, capable de <span className="text-white">former, d'analyser et d'accompagner</span> la transformation 
              des situations de travail.
            </p>
          </motion.div>
        </div>
      )
    },
    {
      title: "Notre Approche",
      content: (
        <div className="space-y-12 text-lg md:text-xl text-gray-400 leading-relaxed mb-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-gradient-to-r from-gray-900 to-black border-l-4 border-[rgb(255,30,90)] rounded-r-lg text-center"
          >
            <p className="text-2xl md:text-3xl text-white font-light">
              <span className="text-[rgb(255,30,90)] font-bold">LeVerre Labs</span> transforme l'invisible en évidence.
            </p>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Notre approche : une <span className="text-white">métaphore universelle</span> qui rend le risque visible en un instant. Auto-évaluation, leviers d'action, transformation ciblée.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            L'outil ne s'arrête pas à la prise de conscience: il sert l'<span className="text-white">analyse concrète</span> des situations, permet de tester des hypothèses, guide les transformations. De la compréhension individuelle à la décision organisationnelle.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            Appuyée sur les <span className="text-white">sciences cognitives</span> et forgée sur le terrain, notre approche reste dynamique. Nos équipes maintiennent une veille scientifique et réglementaire active qui nourrit l'amélioration continue de nos solutions.
          </motion.p>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero avec lampe - sans titre, juste la lampe LED */}
      <LampContainer>
        <div className="h-4" />
      </LampContainer>

      {/* Sections avec titres sticky - marge négative pour rapprocher de la LED */}
      <div className="-mt-96 md:-mt-[32rem]">
        <StickyScrollSections sections={sectionsData} />
      </div>

      {/* CTA - Devenir organisation partenaire */}
      <section className="relative py-32 px-6 bg-gradient-to-br from-slate-700 to-slate-900">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight leading-tight">
            Rejoignez les premières organisations qui transforment leur prévention
          </h2>
          <p className="text-xl text-gray-200 mb-12 leading-relaxed">
            LeVerre Labs accompagne des entreprises pilotes pour déployer une approche innovante et mesurer l'impact réel. Échangeons sur votre contexte.
          </p>
          <a href="mailto:contact@leverrelabs.com?subject=Devenir organisation partenaire LeVerre Labs">
            <InteractiveHoverButton 
              text="Devenir partenaire"
              className="w-auto px-8 py-4 text-lg bg-[rgb(255,30,90)] text-white border-[rgb(255,30,90)] hover:bg-[rgb(255,60,120)]"
            />
          </a>
        </motion.div>
      </section>
    </div>
  )
}
