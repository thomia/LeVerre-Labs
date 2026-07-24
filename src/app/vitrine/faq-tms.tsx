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

interface PointReponse {
  label?: string
  texte: string
}

interface QuestionReponse {
  question: string
  intro: string
  points?: PointReponse[]
  conclusion?: string
}

const FAQ: QuestionReponse[] = [
  {
    question: 'Qu’est-ce qu’un trouble musculosquelettique (TMS) ?',
    intro:
      'Les TMS regroupent les douleurs et lésions des muscles, tendons, nerfs et articulations, favorisées au travail par les gestes répétitifs, le port de charges, les postures contraignantes et le stress. Ils représentent près de 90 % des maladies professionnelles reconnues en France.',
  },
  {
    question: 'Comment sensibiliser ses équipes aux TMS en entreprise ?',
    intro:
      'La sensibilisation fonctionne mieux quand elle est visuelle et concrète que théorique. LeVerre Labs utilise la métaphore du verre qui se remplit pour rendre les facteurs de risque compréhensibles par tous et ancrer durablement les bons réflexes de prévention.',
  },
  {
    question: 'Qu’est-ce que le modèle du verre de LeVerre Labs ?',
    intro:
      'Le modèle du verre illustre, par une métaphore visuelle, l’accumulation des contraintes physiques et mentales au fil de l’activité, symbolisée par un verre qui se remplit.',
    points: [
      {
        label: 'Le verre',
        texte:
          'les facteurs individuels (âge, antécédents, condition physique, hygiène de vie) qui définissent la résistance de chacun.',
      },
      {
        label: 'Le robinet',
        texte:
          'les contraintes du travail (charges, postures, fréquence, charge mentale et risques psychosociaux) qui remplissent le verre.',
      },
      {
        label: 'La bulle',
        texte:
          'l’environnement (température, bruit, vibrations, éclairage, espace) qui amplifie les contraintes subies.',
      },
      {
        label: 'L’orage',
        texte:
          'les imprévus et aléas du terrain, une source de remplissage supplémentaire qui vient s’ajouter au travail prévu.',
      },
      {
        label: 'La paille',
        texte:
          'la récupération (repos, pauses actives, étirements, entraide) qui vide en partie le verre.',
      },
    ],
    conclusion:
      'Le niveau de remplissage, en pourcentage, se découpe en quatre zones de risque (favorable, vigilance, critique, rupture) qui guident la prise de conscience et les actions de prévention.',
  },
  {
    question:
      'Que risque-t-on quand le verre déborde : accident du travail (AT) ou TMS ?',
    intro:
      'Plus le verre se remplit, plus le risque de blessure augmente. Il prend deux formes :',
    points: [
      {
        label: 'Conséquence aiguë — l’accident du travail (AT)',
        texte:
          'survient d’un coup (lombalgie aiguë, tendinite de l’épaule…) et entraîne souvent un arrêt.',
      },
      {
        label: 'Conséquence chronique — le TMS',
        texte:
          's’installe progressivement et relève de la maladie professionnelle.',
      },
    ],
    conclusion:
      'Un accident aigu signale souvent une fragilité déjà installée, qui peut évoluer en TMS sur la durée. D’où l’intérêt d’agir avant que le verre ne déborde.',
  },
  {
    question: 'À qui s’adresse LeVerre Labs ?',
    intro:
      'Aux entreprises et services RH/HSE qui veulent sensibiliser leurs équipes, ainsi qu’aux préventeurs et ergonomes qui analysent une situation de travail pour la transformer. L’outil sert aussi en formation initiale (écoles, universités).',
  },
  {
    question: 'La prévention des TMS est-elle une obligation pour l’employeur ?',
    intro:
      'Oui. L’employeur a l’obligation légale de préserver la santé de ses salariés, ce qui inclut l’évaluation et la prévention des risques de TMS (document unique, aménagement des postes). Agir en amont réduit aussi l’absentéisme.',
  },
]

function texteComplet({ intro, points, conclusion }: QuestionReponse): string {
  const morceaux = [
    intro,
    ...(points?.map((p) => (p.label ? `${p.label} : ${p.texte}` : p.texte)) ??
      []),
    conclusion,
  ]
  return morceaux.filter(Boolean).join(' ')
}

export function FaqTms() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: texteComplet(item) },
    })),
  }

  return (
    <section
      id="faq"
      className="mx-auto max-w-7xl px-6 py-24 scroll-mt-20"
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
        {FAQ.map((item) => (
          <details
            key={item.question}
            className="group rounded-2xl border border-white/10 bg-gray-900/30 p-6 transition-colors open:border-[rgb(255,30,90)]/30 open:bg-gray-900/50"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 text-lg font-semibold text-white marker:content-none [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <span
                aria-hidden
                className="shrink-0 text-2xl leading-none text-[rgb(255,30,90)] transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>

            <div className="mt-4 leading-relaxed text-gray-300">
              <p>{item.intro}</p>

              {item.points && (
                <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-[rgb(255,30,90)]">
                  {item.points.map((point) => (
                    <li key={point.label ?? point.texte}>
                      {point.label && (
                        <span className="font-semibold text-white">
                          {point.label} :{' '}
                        </span>
                      )}
                      {point.texte}
                    </li>
                  ))}
                </ul>
              )}

              {item.conclusion && <p className="mt-3">{item.conclusion}</p>}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
