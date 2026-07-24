/**
 * FAQ VITRINE — Questions fréquentes sur la prévention des TMS
 * Composant : FaqTms
 *
 * Objectif SEO : répondre aux questions réellement tapées dans Google
 * (« qu'est-ce qu'un TMS ? », « comment sensibiliser aux TMS ? ») pour
 * capter la longue traîne et alimenter les réponses enrichies (rich
 * results) + les réponses des IA.
 *
 * - Contenu en HTML dès le premier rendu (balises <details>/<summary>
 *   natives) : lisible par les robots même sans JavaScript.
 * - Données structurées `FAQPage` (schema.org) injectées en JSON-LD
 *   pour permettre l'affichage en accordéon directement dans Google.
 */

interface QuestionReponse {
  question: string
  reponse: string
}

const FAQ: QuestionReponse[] = [
  {
    question: 'Qu’est-ce qu’un trouble musculosquelettique (TMS) ?',
    reponse:
      'Les troubles musculosquelettiques (TMS) regroupent les douleurs et lésions touchant les muscles, tendons, nerfs et articulations. Au travail, ils sont favorisés par les gestes répétitifs, le port de charges, les postures contraignantes et le stress. Ils constituent la première cause de maladies professionnelles reconnues en France.',
  },
  {
    question: 'Comment sensibiliser ses équipes aux TMS en entreprise ?',
    reponse:
      'La sensibilisation aux TMS est bien plus efficace quand elle est visuelle et concrète plutôt que théorique. LeVerre Labs utilise la métaphore d’un verre qui se remplit pour rendre les facteurs de risque compréhensibles par tous, faciliter les échanges pendant la formation et ancrer durablement les bons réflexes de prévention.',
  },
  {
    question: 'Qu’est-ce que le modèle du verre de LeVerre Labs ?',
    reponse:
      'Le verre représente le corps du travailleur : le robinet (la charge de travail) le remplit, la bulle (l’environnement) influe sur le débit, l’orage (les aléas) ajoute des pics et la paille (la récupération) le vide. Quand le verre déborde, le risque de TMS augmente. Chaque paramètre est ajustable pour refléter une vraie situation de travail.',
  },
  {
    question: 'À qui s’adresse LeVerre Labs ?',
    reponse:
      'L’outil s’adresse aux entreprises et aux services RH/HSE qui veulent sensibiliser leurs équipes, ainsi qu’aux ergonomes et préventeurs qui cherchent à analyser une situation de travail pour la transformer. Il combine un volet pédagogique grand public et un volet d’analyse approfondie.',
  },
  {
    question: 'La prévention des TMS est-elle une obligation pour l’employeur ?',
    reponse:
      'Oui. L’employeur a l’obligation légale de préserver la santé physique de ses salariés, ce qui inclut l’évaluation et la prévention des risques de TMS (document unique, aménagement des postes). Agir en amont réduit l’absentéisme et améliore la performance de l’entreprise.',
  },
]

export function FaqTms() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(({ question, reponse }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: reponse },
    })),
  }

  return (
    <section
      id="faq"
      className="mx-auto max-w-3xl px-6 py-24 scroll-mt-20"
      aria-labelledby="faq-titre"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h2
        id="faq-titre"
        className="mb-4 text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
      >
        Questions fréquentes sur la prévention des TMS
      </h2>
      <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">
        L’essentiel pour comprendre les troubles musculosquelettiques et la
        démarche de sensibilisation LeVerre Labs.
      </p>

      <div className="space-y-4">
        {FAQ.map(({ question, reponse }) => (
          <details
            key={question}
            className="group rounded-2xl border border-white/10 bg-gray-900/30 p-6 transition-colors open:border-[rgb(255,30,90)]/30 open:bg-gray-900/50"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 text-lg font-semibold text-white marker:content-none [&::-webkit-details-marker]:hidden">
              <span>{question}</span>
              <span
                aria-hidden
                className="shrink-0 text-2xl leading-none text-[rgb(255,30,90)] transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-4 leading-relaxed text-gray-300">{reponse}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
