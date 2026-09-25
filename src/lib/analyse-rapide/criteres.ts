/**
 * Critères d'observation de l'ANALYSE RAPIDE + aide-mémoire intégré.
 *
 * Choix de méthode (volontairement différent du questionnaire Sensibilisation) :
 *
 *   1. **Une seule échelle continue par critère** (0-100), toujours orientée
 *      "défaveur" : 0 = rien à signaler, 100 = le pire observable. Y compris
 *      pour le Verre et la Paille, dont le score est inversé au calcul.
 *      → en direct, l'observateur ne se pose jamais la question du sens.
 *
 *   2. **L'aide-mémoire n'est pas une checklist cliquable mais une échelle
 *      ancrée** : chaque critère porte 4 descripteurs concrets (`ancrages`)
 *      placés à 0 / 35 / 70 / 100. Cocher des cases produirait une seconde
 *      notation implicite (nb de cases cochées) en concurrence avec le
 *      curseur, et ferait perdre la gradation (un dos à 25° et un dos à 80°
 *      cocheraient la même case). Les ancrages, eux, *guident* le curseur sans
 *      le dupliquer : c'est la technique classique des échelles d'évaluation
 *      ancrées sur le comportement, utilisée justement pour fiabiliser une
 *      cotation subjective rapide.
 *
 *   3. `repere` dit **où regarder** (la mesure à citer à l'oral pendant
 *      l'enregistrement), `ancrages` disent **comment coter ce qu'on voit**.
 *
 * Les critères reprennent la terminologie des questionnaires existants
 * (`src/lib/questions/*.ts`) pour que les deux outils racontent la même chose.
 */

import type { ElementId } from '@/lib/supabase/types'

/**
 * Rôle d'un critère dans le score de son élément.
 *   - `terme`         : entre dans la moyenne quadratique pondérée.
 *   - `multiplicateur`: module le score final de l'élément (0-100 % du score).
 *     Sert à l'Orage, où l'esprit AMDEC veut qu'un imprévu qui ne survient pas
 *     dans le moment observé ait une criticité nulle quelle que soit sa
 *     gravité (cf. `src/lib/questions/orage.ts`).
 */
export type RoleCritere = 'terme' | 'multiplicateur'

export interface CritereRapide {
  id: string
  element: ElementId
  /**
   * Intitulé court affiché en face du curseur. Toujours formulé du côté
   * défavorable ("Récupération insuffisante" et non "Récupération"), pour que
   * pousser le curseur vers la droite veuille dire la même chose sur les cinq
   * éléments.
   */
  label: string
  /** Ce qu'on regarde concrètement dans l'image (support de la justification orale). */
  repere: string
  /** 4 descripteurs d'ancrage, dans l'ordre : 0 / 35 / 70 / 100. */
  ancrages: [string, string, string, string]
  /** Niveau de poids pré-réglé (index dans `NIVEAUX_POIDS`). */
  niveauPoidsDefaut: number
  /** Position initiale du curseur. `GRAVITE_PAR_DEFAUT` si absent. */
  graviteDefaut?: number
  role?: RoleCritere
}

/**
 * Position initiale des curseurs : le milieu de l'échelle, c'est-à-dire
 * "situation ordinaire, pas encore observée".
 *
 * Partir de 0 a été essayé et abandonné : 0 signifie "rien à signaler", donc un
 * moment à peine noté décrivait un poste parfait — paille idéale et verre très
 * large — qui absorbait tout ce que le robinet apportait. Le verre restait
 * désespérément vide alors qu'on venait de coter une charge lourde. Partir du
 * milieu affiche une hypothèse neutre, visible à l'écran (l'ancrage médian est
 * écrit en clair), que l'observateur déplace dans un sens ou dans l'autre.
 */
export const GRAVITE_PAR_DEFAUT = 50

/**
 * Les 4 cases d'importance affichées en face de chaque critère.
 *
 * Rapport 5:1 entre "Déterminant" et "Mineur" : plus tranché que le classement
 * du questionnaire Sensibilisation (`ROBINET_RANK_WEIGHTS`, rapport 3:1) parce
 * qu'ici on ne classe pas 5 aspects les uns par rapport aux autres — on juge
 * l'importance absolue de chacun dans le moment observé, et un facteur
 * déterminant doit réellement tirer le score de l'élément.
 */
export const NIVEAUX_POIDS = [
  { label: 'Mineur', poids: 1, description: 'Présent mais anecdotique dans ce moment' },
  { label: 'Notable', poids: 2, description: 'Compte vraiment, sans dominer' },
  { label: 'Important', poids: 3.5, description: 'Un des facteurs qui structurent le moment' },
  { label: 'Déterminant', poids: 5, description: "C'est ÇA qui fait la pénibilité du moment" },
] as const

export type NiveauPoids = (typeof NIVEAUX_POIDS)[number]

/** Positions des 4 ancrages sur l'échelle 0-100. */
export const POSITIONS_ANCRAGES = [0, 35, 70, 100] as const

const CRITERES_ROBINET: CritereRapide[] = [
  {
    id: 'r_charge',
    element: 'robinet',
    label: 'Charge physique',
    repere: 'Poids manipulé, prise (poignées, volume, matière glissante), distance de la charge au corps, nombre de reprises.',
    ancrages: [
      'Aucune charge, mains libres',
      'Charge légère (< 5 kg) près du corps',
      'Charge lourde (15-25 kg) ou prise difficile',
      'Charge très lourde ou bras tendus, reprise constante',
    ],
    niveauPoidsDefaut: 2,
  },
  {
    id: 'r_posture',
    element: 'robinet',
    label: 'Posture',
    repere: 'Angles pris par le dos, les épaules, les coudes, les poignets, les genoux — et le temps passé dans ces angles.',
    ancrages: [
      'Dos droit, bras sous les épaules',
      'Flexion légère (< 20°) ou brève',
      'Dos ou bras au-delà de 60°, maintenu',
      'Angles extrêmes tenus, accroupi ou en torsion',
    ],
    niveauPoidsDefaut: 3,
  },
  {
    id: 'r_frequence',
    element: 'robinet',
    label: 'Fréquence et durée',
    repere: "Chronomètre : nombre de répétitions du geste par minute, durée de l'effort, temps de récupération entre deux.",
    ancrages: [
      'Geste ponctuel, récupération large',
      'Quelques répétitions par minute',
      'Plus de 10 répétitions/min ou effort tenu',
      'Effort quasi continu, aucune pause du geste',
    ],
    niveauPoidsDefaut: 2,
  },
  {
    id: 'r_mental',
    element: 'robinet',
    label: 'Charge mentale',
    repere: 'Niveau de concentration exigé, informations à suivre en parallèle, pression temporelle, interruptions, conséquence d\u2019une erreur.',
    ancrages: [
      'Geste automatique',
      'Contrôle visuel régulier',
      'Concentration soutenue, cadence imposée',
      'Vigilance permanente, erreur lourde de conséquence',
    ],
    niveauPoidsDefaut: 1,
  },
  {
    id: 'r_rps',
    element: 'robinet',
    label: 'Risques psychosociaux',
    repere: 'Objectifs et délais imposés, marge de manœuvre sur la façon de faire, entraide visible, reconnaissance du travail.',
    ancrages: [
      'Climat serein, entraide visible',
      'Contraintes de délai supportables',
      'Pression forte ou isolement du poste',
      'Tension permanente, aucune marge de manœuvre',
    ],
    niveauPoidsDefaut: 1,
  },
]

const CRITERES_BULLE: CritereRapide[] = [
  {
    id: 'b_thermique',
    element: 'bulle',
    label: 'Ambiance thermique',
    repere: 'Température du local, courants d\u2019air, chaleur rayonnante, tenue de travail imposée.',
    ancrages: ['Confortable (18-24 °C)', 'Un peu frais ou chaud', 'Froid (5-12 °C) ou chaud (> 28 °C)', 'Extrême (< 5 °C ou > 30 °C)'],
    niveauPoidsDefaut: 1,
  },
  {
    id: 'b_bruit',
    element: 'bulle',
    label: 'Bruit',
    repere: "Niveau sonore, bruits impulsifs, nécessité de crier pour se parler, port de protection auditive.",
    ancrages: ['Calme (< 70 dB)', 'Bruyant mais on se parle', 'On doit hausser la voix (80-85 dB)', 'Protection obligatoire (> 85 dB)'],
    niveauPoidsDefaut: 1,
  },
  {
    id: 'b_visibilite',
    element: 'bulle',
    label: 'Éclairage et visibilité',
    repere: "Zone de travail éclairée ou dans l'ombre, reflets, contre-jour, obligation de se pencher pour voir.",
    ancrages: ['Zone bien éclairée', 'Éclairage correct mais fixe', 'Ombres portées, reflets gênants', 'Travaille quasiment à l\u2019aveugle'],
    niveauPoidsDefaut: 1,
  },
  {
    id: 'b_espace',
    element: 'bulle',
    label: 'Espace et encombrement',
    repere: 'Place pour poser les pieds et tourner, obstacles au sol, hauteur de passage, distance des approvisionnements.',
    ancrages: ['Dégagé, circulation libre', 'Correct mais un peu juste', 'Encombré, contourne des obstacles', 'Très exigu, se contorsionne pour passer'],
    niveauPoidsDefaut: 2,
  },
  {
    id: 'b_materiel',
    element: 'bulle',
    label: 'Matériel, sol et vibrations',
    repere: 'État et adaptation des outils, sol glissant ou irrégulier, outils vibrants, EPI contraignants (gants épais, masque).',
    ancrages: ['Matériel adapté, sol sain', 'Quelques bricolages ou EPI gênants', 'Outil inadapté, sol instable ou vibrations', 'Matériel vétuste, vibrations continues'],
    niveauPoidsDefaut: 2,
  },
]

const CRITERES_ORAGE: CritereRapide[] = [
  {
    id: 'o_occurrence',
    element: 'orage',
    label: 'Survenue dans ce moment',
    repere: "L'imprévu se produit-il vraiment ici ? Rien à signaler = le reste de l'orage ne compte pas.",
    ancrages: ['Aucun imprévu', 'Micro-accroc ponctuel', 'Perturbation nette', 'Le moment est entièrement subi'],
    niveauPoidsDefaut: 3,
    // Un imprévu ne se présume pas : tant qu'on n'en a pas vu, l'Orage est nul.
    graviteDefaut: 0,
    role: 'multiplicateur',
  },
  {
    id: 'o_temps',
    element: 'orage',
    label: 'Temps perdu',
    repere: "Durée d'attente, de reprise, de rattrapage — et cadence à retrouver ensuite.",
    ancrages: ['Aucun temps perdu', 'Quelques secondes', 'Plusieurs minutes de reprise', 'Le moment est entièrement du rattrapage'],
    niveauPoidsDefaut: 1,
  },
  {
    id: 'o_surcharge',
    element: 'orage',
    label: 'Surcharge physique induite',
    repere: 'Gestes en urgence, charge reprise à bout de bras, posture dégradée pour rattraper le coup.',
    ancrages: ['Aucun geste supplémentaire', 'Un geste de rattrapage', 'Effort brusque ou posture dégradée', 'Effort maximal en urgence'],
    niveauPoidsDefaut: 2,
  },
  {
    id: 'o_mental',
    element: 'orage',
    label: 'Coût mental',
    repere: "Signes visibles de tension : soupir, arrêt, échange tendu, recherche de solution dans l'urgence.",
    ancrages: ['Anodin', 'Agacement visible', 'Stress net, cherche une solution', 'Met à cran, plombe la suite'],
    niveauPoidsDefaut: 2,
  },
  {
    id: 'o_securite',
    element: 'orage',
    label: 'Dégradation de la sécurité',
    repere: 'Contournement de procédure, protection retirée, passage dans une zone de circulation, prise de risque pour aller vite.',
    ancrages: ['Aucune prise de risque', 'Léger écart de procédure', 'Protection contournée', 'Mise en danger caractérisée'],
    niveauPoidsDefaut: 2,
  },
]

const CRITERES_PAILLE: CritereRapide[] = [
  {
    id: 'p_micropauses',
    element: 'paille',
    label: 'Micro-pauses impossibles',
    repere: "Peut-il s'arrêter quelques secondes sans que la ligne ou le client attende ? Les pauses observées sont-elles réelles ?",
    ancrages: ['Peut souffler quand il veut', 'Pauses courtes mais réelles', 'Presque aucune interruption', 'Enchaîne sans jamais s\u2019arrêter'],
    niveauPoidsDefaut: 2,
  },
  {
    id: 'p_variation',
    element: 'paille',
    label: 'Posture toujours identique',
    repere: 'Alternance debout/assis, changement de côté, sollicitation de groupes musculaires différents au fil du moment.',
    ancrages: ['Alterne naturellement', 'Quelques changements', 'Toujours la même posture', 'Geste unique figé, un seul côté'],
    niveauPoidsDefaut: 2,
  },
  {
    id: 'p_recuperation',
    element: 'paille',
    label: 'Récupération insuffisante',
    repere: "Temps réellement disponible entre deux efforts notables, et ce qui est fait de ce temps (repos ou autre tâche).",
    ancrages: ['Récupération large entre efforts', 'Courte mais suffisante', 'Insuffisante, enchaîne trop vite', 'Aucune, efforts collés'],
    niveauPoidsDefaut: 2,
  },
  {
    id: 'p_aides',
    element: 'paille',
    label: 'Aides techniques délaissées',
    repere: "Présence ET usage réel des aides (table élévatrice, chariot, ventouse, convoyeur). Une aide non utilisée ne récupère rien.",
    ancrages: ['Aides adaptées et utilisées', 'Aides présentes, usage partiel', 'Aides disponibles mais délaissées', 'Tout à la main, aucune aide'],
    niveauPoidsDefaut: 2,
  },
  {
    id: 'p_marge',
    element: 'paille',
    label: 'Rythme imposé',
    repere: 'Peut-il changer son ordre de travail, son rythme, sa façon de faire pour se ménager ?',
    ancrages: ['Organise son travail librement', 'Quelques ajustements possibles', 'Rythme largement imposé', 'Cadence machine, aucune latitude'],
    niveauPoidsDefaut: 1,
  },
]

const CRITERES_VERRE: CritereRapide[] = [
  {
    id: 'v_antecedents',
    element: 'verre',
    label: 'Antécédents et douleurs',
    repere: "Informations recueillies avant le tournage : TMS déclarés, restrictions, gestes d'évitement visibles à l'image.",
    ancrages: ['Aucun antécédent', 'Épisode ancien, résolu', 'Douleurs récurrentes', 'Douleur actuelle, limitation'],
    niveauPoidsDefaut: 3,
  },
  {
    id: 'v_age',
    element: 'verre',
    label: 'Âge et ancienneté au poste',
    repere: "Âge de l'opérateur et années d'exposition cumulées sur ce type de geste.",
    ancrages: ['< 30 ans, exposition récente', '30-49 ans', '50-64 ans ou longue exposition', '> 65 ans ou exposition très longue'],
    niveauPoidsDefaut: 1,
  },
  {
    id: 'v_condition',
    element: 'verre',
    label: 'Déconditionnement physique',
    repere: 'Activité physique hebdomadaire, aisance et stabilité du geste, essoufflement visible.',
    ancrages: ['Entraîné, geste stable', 'Actif régulièrement', 'Peu actif, geste peu assuré', 'Sédentaire, essoufflement rapide'],
    niveauPoidsDefaut: 2,
  },
  {
    id: 'v_morphologie',
    element: 'verre',
    label: 'Poste inadapté à sa morphologie',
    repere: "Hauteur de plan de travail vs taille de l'opérateur, portée des commandes, taille des poignées vs main.",
    ancrages: ['Poste à sa taille', 'Léger décalage compensé', 'Doit se hausser ou se baisser', 'Poste totalement inadapté'],
    niveauPoidsDefaut: 2,
  },
  {
    id: 'v_forme',
    element: 'verre',
    label: 'Fatigue du jour',
    repere: 'Sommeil de la nuit, moment de la journée filmé (début vs fin de poste), signes de fatigue.',
    ancrages: ['Frais, début de poste', 'Légère fatigue', 'Fatigue nette, fin de poste', 'Épuisé avant même de commencer'],
    niveauPoidsDefaut: 1,
  },
]

/** Critères par élément, dans l'ordre d'affichage du panneau de notation. */
export const CRITERES_PAR_ELEMENT: Record<ElementId, CritereRapide[]> = {
  robinet: CRITERES_ROBINET,
  bulle: CRITERES_BULLE,
  orage: CRITERES_ORAGE,
  paille: CRITERES_PAILLE,
  verre: CRITERES_VERRE,
}

/**
 * Ordre des onglets du panneau : on note d'abord ce qui se voit à l'image
 * (Robinet), puis le contexte, et on finit par le Verre — profil de
 * l'opérateur, qui ne change pas d'un moment à l'autre et se recopie tout seul
 * grâce à l'héritage du moment précédent.
 */
export const ORDRE_NOTATION: ElementId[] = ['robinet', 'bulle', 'orage', 'paille', 'verre']

export const TOUS_LES_CRITERES: CritereRapide[] = ORDRE_NOTATION.flatMap(
  (element) => CRITERES_PAR_ELEMENT[element]
)

/** Descripteur d'ancrage le plus proche d'une gravité donnée. */
export function ancrageActif(critere: CritereRapide, gravite: number): string {
  let indexProche = 0
  let ecartMin = Infinity

  POSITIONS_ANCRAGES.forEach((position, index) => {
    const ecart = Math.abs(position - gravite)
    if (ecart < ecartMin) {
      ecartMin = ecart
      indexProche = index
    }
  })

  return critere.ancrages[indexProche]
}
