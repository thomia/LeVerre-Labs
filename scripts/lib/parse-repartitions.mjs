/**
 * Extraction des tableaux de repartition (Age, Sexe, Qualification, ...)
 * dans les fiches AT/TJ/MP des PDFs Assurance Maladie.
 *
 * Probleme central :
 *   Le PDF a un layout 2 colonnes : sur chaque page, deux sections cote
 *   a cote. Le texte extrait par pdf-parse alterne les lignes des 2
 *   colonnes. Exemple ligne PDF AT 2024 page 1 :
 *     "1 Non précisé 0 0 0 0 1 Localisation de la blessure non déterminée 2 594 196 255 370 358"
 *     ^---- col gauche (AGE) ----^ ^---- col droite (SIEGE LESIONS) ----^
 *
 * Strategie d'extraction :
 *   1. Pour chaque section connue (Age, Sexe, ...), on a un catalogue
 *      de libelles attendus.
 *   2. Pour chaque libelle, on cherche sa position APRES le titre de
 *      la section (pour desambiguiser les libelles communs comme "Non
 *      precise" present dans AGE et QUALIFICATION).
 *   3. Apres chaque libelle, on capture le segment jusqu'au prochain
 *      libelle connu (toutes sections confondues = bornage 2-colonnes).
 *   4. Dans ce segment, on tokenise les nombres et on les decoupe en
 *      4 valeurs (1er reglement, IP, deces, journees perdues) en
 *      utilisant le format francais des nombres (1-3 chiffres puis
 *      groupes de 3 chiffres) + scoring d'ordre de grandeur pour
 *      lever l'ambiguite quand plusieurs decoupages sont possibles.
 */

/* =============================================================
 * 1. CATALOGUES DE LIBELLES PAR SECTION
 * ============================================================= */

/**
 * Section AGE : 10 tranches officielles AM, identiques 2015-2024.
 */
const LIBELLES_AGE = [
  'Non précisé',
  'Moins de 20 ans',
  'de 20 à 24 ans',
  'de 25 à 29 ans',
  'de 30 à 34 ans',
  'de 35 à 39 ans',
  'de 40 à 49 ans',
  'de 50 à 59 ans',
  'de 60 à 64 ans',
  '65 ans et plus',
]

/** Section SEXE : 2 lignes, identiques toutes annees. */
const LIBELLES_SEXE = ['Masculin', 'Féminin']

/**
 * Section QUALIFICATION (fiche AT). 8 categories + "Non codes".
 * Les libelles sont identiques 2015-2024.
 */
const LIBELLES_QUALIFICATION = [
  'Non précisé',
  'Cadres, techniciens, a.m.',
  'Employés',
  'Apprentis',
  'Elèves',
  'Ouvriers non qualifiés',
  'Ouvriers qualifiés',
  'Divers',
  'Non codés',
]

/**
 * Section SIEGE DES LESIONS (fiche AT). 9 lignes principales. La
 * categorie "Localisation de la blessure non déterminée" remplace le
 * "Non précisé" classique.
 */
const LIBELLES_SIEGE_LESIONS = [
  'Localisation de la blessure non déterminée',
  'Tête, sans autre spécification',
  'Cou, dont colonne vertébrale et vertèbres du cou',
  'Dos, dont colonne vertébrale et vertèbres du dos',
  'Torse et organes, sans autre spécification',
  'Membres supérieurs, sans autre spécification',
  'Membres inférieurs, sans autre spécification',
  'Ensemble du corps et endroits multiples',
  'Autres parties du corps blessées',
]

/**
 * Section DEVIATION (fiche AT). 9 lignes + "Non codés". Numerotation
 * INRS ESAW (1-9).
 */
const LIBELLES_DEVIATION = [
  'Problème électrique, explosion, feu',
  'Débordement, renversement, fuite, etc.',
  // Note : "d'agent matériel" inclus pour eviter de matcher les
  // sous-occurrences plus loin dans le texte.
  "Éclatement, glissade, chute, etc. d'agent matériel",
  'Perte de contrôle',
  'Glissade ou trébuchement avec chute',
  'Mouvement corps sans contrainte',
  'Mouvement corps avec contrainte',
  'Surprise, violence, agression, menace, etc.',
  'Autre ou sans information',
  'Non codés',
]

/**
 * Section AGENT MATERIEL DE LA DEVIATION (fiche AT). 20 lignes + "99
 * Autre" + "Non codes". Vocabulaire INRS ESAW.
 *
 * Note : "Autre ou sans information" apparait aussi dans DEVIATION et
 * ACTIVITE PHYSIQUE. La desambiguation se fait par le titre de section.
 */
const LIBELLES_AGENT_MATERIEL = [
  'Bâtiments, surfaces à niveau',
  'Bâtiments, constructions, surfaces hauteur',
  'Bâtiments, constructions, surfaces profondeur',
  'Dispositifs de distribution de matière',
  'Moteurs, dispositifs transmis./stockage énergie',
  'Outils à main non motorisés',
  'Outils mécaniques tenus main',
  'Outils à main, sans précision sur motorisation',
  'Machines, équipements portables ou mobiles',
  'Machines et équipements fixes',
  'Dispositifs convoyage, transport, stockage',
  'Véhicules terrestres',
  'Autres véhicules de transport',
  'Matériaux, objets, produits, bris, poussières, etc.',
  'Substances chimiques, explosives, radioactives…',
  'Dispositifs et équipements de sécurité',
  'Equipements bureau, sport, armes, domestiques…',
  'Organismes vivants et êtres humains',
  'Déchets en vrac',
  'Phénomènes physiques, éléments naturels',
  'Autre ou sans information',
  'Non codés',
]

/**
 * Section NATURE DES LESIONS (fiche AT). 36 lignes (codes 1-36 INRS
 * ESAW). Pas de "Non codes" propre a cette section.
 */
const LIBELLES_NATURE_LESIONS = [
  'Nature inconnue ou non précisée',
  'Blessures superficielles',
  'Plaies ouvertes',
  'Autres plaies et blessures superficielles',
  'Fractures fermées',
  'Fractures ouvertes',
  'Autres fractures osseuses',
  'Luxations et sub-luxations',
  'Entorses et foulures',
  'Autres luxations, entorses, foulures',
  'Amputations traumatiques',
  'Commotions et traumatismes internes',
  'Traumatismes internes',
  'Autres commotions, traumatismes internes',
  'Brûlures (thermiques)',
  'Brûlures chimiques (corrosions)',
  'Gelures',
  'Autres brûlures et gelures',
  'Empoisonnements aigus',
  'Infections aiguës',
  'Autres empoisonnements, infections',
  'Asphyxies',
  'Noyades et submersions non mortelles',
  'Autres noyades et asphyxies',
  'Perte auditive aiguë',
  'Effets de la pression (barotrauma)',
  'Autres effets bruit, vibrations et pression',
  'Chaleur et coups de soleil',
  'Effets des radiations (non thermiques)',
  'Effets du froid',
  'Autres effets t°, lumière, radiations',
  'Chocs suite à agressions et menaces',
  'Chocs traumatiques',
  'Autres chocs',
  'Blessures multiples',
  'Autres blessures déterminées non classées',
]

/**
 * Section ACTIVITE PHYSIQUE SPECIFIQUE (fiche AT). Codes INRS ESAW
 * 1-7, 9 (pas de 8). + "Non codes".
 */
const LIBELLES_ACTIVITE_PHYSIQUE = [
  'Opération de machine',
  'Travail avec des outils à main',
  'Conduite/présence moyen de transport-manutention…',
  "Manipulation d'objets",
  'Transport manuel',
  'Mouvement',
  'Présence',
  'Autre ou sans information',
  'Non codés',
]

/**
 * Section MODALITE DE LA BLESSURE (fiche AT). 9 lignes + "Non codes".
 */
const LIBELLES_MODALITE_BLESSURE = [
  'Contact courant électrique, t°, substance dangereuse',
  'Noyade, ensevelissement, enveloppement',
  'Écrasement mouvement vertical ou horizontal',
  'Heurt par objet en mouvement',
  'Contact agent matériel coupant, pointu, etc.',
  'Coincement, écrasement, etc.',
  'Contrainte du corps, contrainte psychique',
  'Morsure, coup de pied, etc.',
  'Autre ou sans information',
  'Non codés',
]

/**
 * Section TYPE DE LIEU DE L'ACCIDENT (fiche AT uniquement, pas TJ).
 * 14 categories (PDF AM 2015-2024).
 */
const LIBELLES_TYPE_LIEU = [
  'Site industriel',
  'Chantier, construction, carrière, mine à ciel ouvert',
  'Lieu pour agriculture, élevage, pisciculture, zone forest.',
  "Lieu d'activité tertiaire, bureau, divertissement, divers",
  'Établissement de soins',
  'Lieu public',
  'Domicile',
  "Lieu d'activité sportive",
  "En l'air, en hauteur - à l'exclusion des chantiers",
  "Sous terre - à l'exclusion des chantiers",
  "Sur l'eau - à l'exclusion des chantiers",
  "En milieu hyperbare - à l'exclusion des chantiers",
  'Autre ou sans information',
  'Non codés',
]

/**
 * Section PROFESSION (fiche MP uniquement). 10 lignes + "Non précisé".
 * Format INRS PCS-ESE.
 */
const LIBELLES_PROFESSION = [
  'Agriculteurs',
  'Artisans',
  'Conducteurs',
  'Dirigeants',
  'Employés',
  'Employés non qualifiés',
  'Personnels de service',
  'Professions intermédiaires',
  'Spécialistes des sciences',
  'Professions militaires',
  'Non précisé',
]

/**
 * Section DUREE D'EXPOSITION (fiche MP uniquement). 6 categories.
 */
const LIBELLES_DUREE_EXPOSITION = [
  'Non précisé',
  'Moins de 6 mois',
  'De 6 mois à un an',
  'De 1 an à moins de 5 ans',
  'De 5 ans à moins de 10 ans',
  'Plus de 10 ans',
]

/**
 * Codes MP cibles pour le projet LeVerre Labs (focus TMS, lombalgies,
 * audition, vibrations). Catalogue stable 2015-2024.
 *
 * Pour chaque code, on extrait : nbMp, nbNouvellesIp, nbDeces,
 * nbJourneesPerdues. Ces codes complement le `topMp` (qui agrege
 * souvent ces categories en "Autres MP").
 *
 * Reference tableaux MP : https://www.inrs.fr/publications/bdd/mp.html
 */
const CODES_MP_CIBLES = [
  // TMS - Tableau 57 : affections periarticulaires (epaule, coude, main,
  // genou, cheville). C'est LE tableau TMS principal (80% des MP).
  { code: '057A', libelle: 'Affections périarticulaires' },
  // TMS - Tableau 69 : vibrations et chocs transmis par machines a main
  // (perceuses, marteaux piqueurs, etc.) - cause de troubles main/poignet.
  { code: '069A', libelle: 'Vibrations et chocs/machine' },
  // TMS - Tableau 79 : lesion chronique du menisque (genou) - typique
  // du travail accroupi/agenouille (BTP, plomberie).
  { code: '079A', libelle: 'Lésions chroniques du ménisque' },
  // Rachis lombaire - Tableau 97 : sciatique par hernie discale liee
  // aux vibrations de basses frequences (conducteurs poids lourds,
  // engins de chantier).
  { code: '097A', libelle: 'Aff. rachis lombaire / vibrations' },
  // Rachis lombaire - Tableau 98 : lombalgies liees a la manutention
  // de charges lourdes (logistique, BTP, soins).
  { code: '098A', libelle: 'Aff. rachis lombaire / manutention' },
  // Hors TMS strict mais lie au travail : surdite (tableau 42) -
  // expositions au bruit (industries, BTP, militaires).
  { code: '042A', libelle: 'Surdité' },
  // Hors TMS : amiante (tableaux 30A/30B/30T) - inclus car represente
  // toujours une part significative des MP "Autres".
  { code: '030A', libelle: 'Affections / amiante' },
  { code: '030B', libelle: 'Cancer broncho-pulmonaire / amiante' },
]

/**
 * Liste plate de tous les codes MP qui peuvent apparaitre dans une fiche
 * MP detaillee. Utilisee comme bornes pour delimiter le segment de
 * chiffres de chaque code (= eviter de manger des chiffres du code
 * suivant).
 *
 * On inclut ici ~110 codes MP qui existent dans les PDFs 2015-2024.
 * Si un nouveau code apparait, il faut le rajouter ici (sinon le
 * segment du code precedent risque de manger ses chiffres).
 */
const TOUS_CODES_MP = [
  '001A','002A','003A','004A','004B','005A','006A','007A','008A','009A',
  '010A','010B','010T','011A','012A','013A','014A','015A','015B','015T',
  '016A','016B','018A','019A','020A','020B','020T','021A','022A','023A',
  '024A','025A','026A','027A','028A','029A','030A','030B','030T','031A',
  '032A','033A','034A','036A','036B','037A','037B','037T','038A','039A',
  '040A','041A','042A','043A','043B','044A','044B','045A','046A','047A',
  '049A','049B','050A','051A','052A','053A','054A','055A','056A','057A',
  '058A','059A','061A','061B','062A','063A','064A','065A','066A','066B',
  '067A','068A','069A','070A','070B','070T','071A','071B','072A','073A',
  '074A','075A','076A','077A','078A','079A','080A','081A','082A','083A',
  '084A','085A','086A','087A','088A','089A','090A','091A','092A','093A',
  '094A','095A','096A','097A','098A','099A','100A','101A','102A',
]

/**
 * Definition d'une section : son titre dans le PDF, son catalogue de
 * libelles, et le champ JSON cible.
 */
/**
 * IMPORTANT : certaines sections (marquees "(1)" dans le PDF) sont
 * calculees sur le sous-ensemble "AT avec au moins 4 jours d'arret"
 * et non sur le total des AT en 1er reglement. Le PDF precise :
 *   "(1) Nombre d'accidents avec un 1er règlement en YYYY et ayant
 *    eu au moins 4 jours d'arrêt en YYYY"
 *
 * On stocke cette info pour la validation par invariants.
 *
 *   - AGE, SEXE, SIEGE, NATURE              => total = nb1erReglement
 *   - QUALIFICATION, DEVIATION, AGENT
 *     MATERIEL, ACTIVITE, MODALITE,
 *     TYPE DE LIEU                          => total = nbAvec4JoursArret
 */
const SECTIONS_FICHE_AT = [
  {
    id: 'parAge',
    titre: "L'AGE DE LA VICTIME",
    libelles: LIBELLES_AGE,
    totalSur: 'nb1erReglement',
  },
  {
    id: 'parSiegeLesions',
    titre: 'LE SIEGE DES LESIONS',
    libelles: LIBELLES_SIEGE_LESIONS,
    totalSur: 'nb1erReglement',
  },
  {
    id: 'parSexe',
    titre: 'LE SEXE DE LA VICTIME',
    libelles: LIBELLES_SEXE,
    totalSur: 'nb1erReglement',
  },
  {
    id: 'parQualification',
    titre: 'LA QUALIFICATION PROFESSIONNELLE',
    libelles: LIBELLES_QUALIFICATION,
    totalSur: 'nbAvec4JoursArret',
  },
  {
    id: 'parDeviation',
    titre: 'LA DEVIATION',
    libelles: LIBELLES_DEVIATION,
    totalSur: 'nbAvec4JoursArret',
  },
  {
    id: 'parAgentMaterielDeviation',
    titre: "L'AGENT MATERIEL DE LA DEVIATION",
    libelles: LIBELLES_AGENT_MATERIEL,
    totalSur: 'nbAvec4JoursArret',
  },
  {
    id: 'parNatureLesions',
    titre: 'LA NATURE DES LESIONS',
    libelles: LIBELLES_NATURE_LESIONS,
    totalSur: 'nb1erReglement',
  },
  {
    id: 'parActivitePhysique',
    titre: "L'ACTIVITE PHYSIQUE SPECIFIQUE",
    libelles: LIBELLES_ACTIVITE_PHYSIQUE,
    totalSur: 'nbAvec4JoursArret',
  },
  {
    id: 'parModaliteBlessure',
    titre: 'LA MODALITE DE LA BLESSURE',
    libelles: LIBELLES_MODALITE_BLESSURE,
    totalSur: 'nbAvec4JoursArret',
  },
  {
    id: 'parTypeLieu',
    titre: "LE TYPE DE LIEU DE L'ACCIDENT",
    libelles: LIBELLES_TYPE_LIEU,
    totalSur: 'nbAvec4JoursArret',
    // Cette section n'existe QUE dans la fiche AT (pas TJ).
    // Si absente, l'extraction retourne [] (comportement attendu en TJ).
    atSeulement: true,
  },
]

/**
 * Sections de la fiche MP. Format identique a AT mais 4 sections
 * differentes : Age, Profession, Sexe, Duree d'exposition.
 * Toutes ont leur total sur nbAvec1erReglement (= total MP du CTN).
 */
const SECTIONS_FICHE_MP = [
  {
    id: 'parAge',
    titre: "L'AGE DE LA VICTIME",
    libelles: LIBELLES_AGE,
    totalSur: 'nbAvec1erReglement',
  },
  {
    id: 'parProfession',
    titre: 'LA PROFESSION',
    libelles: LIBELLES_PROFESSION,
    totalSur: 'nbAvec1erReglement',
  },
  {
    id: 'parSexe',
    titre: 'LE SEXE DE LA VICTIME',
    libelles: LIBELLES_SEXE,
    totalSur: 'nbAvec1erReglement',
  },
  {
    id: 'parDureeExposition',
    titre: "LA DUREE D'EXPOSITION",
    libelles: LIBELLES_DUREE_EXPOSITION,
    totalSur: 'nbAvec1erReglement',
  },
]

/**
 * Mapping (id de section) -> nom du champ scalaire qui correspond a son
 * total. Utilise par la validation par invariants.
 */
export const TOTAL_REFERENCE_AT = Object.fromEntries(
  SECTIONS_FICHE_AT.map((s) => [s.id, s.totalSur])
)

export const TOTAL_REFERENCE_MP = Object.fromEntries(
  SECTIONS_FICHE_MP.map((s) => [s.id, s.totalSur])
)

/**
 * Catalogue plat de TOUS les libelles AT, utilise comme ensemble de
 * bornes pour delimiter le segment de chaque libelle (= la zone qui
 * contient ses 4 valeurs numeriques).
 */
const TOUS_LIBELLES_AT = [
  ...new Set(SECTIONS_FICHE_AT.flatMap((s) => s.libelles)),
]

const TOUS_LIBELLES_MP = [
  ...new Set(SECTIONS_FICHE_MP.flatMap((s) => s.libelles)),
]

/* =============================================================
 * 2. EXTRACTION DES VALEURS NUMERIQUES
 * ============================================================= */

/**
 * Decoupe une chaine de tokens numeriques en exactement 4 nombres
 * en respectant le format francais (1-3 chiffres + 0..N groupes de
 * 3 chiffres).
 *
 * Exemples :
 *   ['22','299','263','2','732','789']  =>  [22299, 263, 2, 732789]
 *   ['0','0','0','0']                   =>  [0, 0, 0, 0]
 *   ['44','997','2','931','256','4','406','018']  =>  [44997, 2931, 256, 4406018]
 *
 * Si plusieurs decoupages sont valides (cas frequent quand il y a
 * beaucoup de tokens), on choisit celui qui maximise un score de
 * coherence (ordre de grandeur attendu : journees perdues > autres,
 * deces toujours faible).
 */
function decouperEn4Nombres(tokens) {
  if (tokens.length < 4) return null

  const candidats = []

  // Enumere tous les partitionnements (k1,k2,k3,k4) tels que
  // somme = N et 1 <= ki <= 3.
  const N = tokens.length
  for (let k1 = 1; k1 <= Math.min(3, N - 3); k1++) {
    for (let k2 = 1; k2 <= Math.min(3, N - 2 - k1); k2++) {
      for (let k3 = 1; k3 <= Math.min(3, N - 1 - k1 - k2); k3++) {
        const k4 = N - k1 - k2 - k3
        if (k4 < 1 || k4 > 3) continue

        const partition = [k1, k2, k3, k4]
        const result = appliquerPartition(tokens, partition)
        if (result) candidats.push(result)
      }
    }
  }

  if (candidats.length === 0) return null
  if (candidats.length === 1) return candidats[0]

  // Plusieurs partitionnements valides : on choisit le plus coherent.
  candidats.sort((a, b) => scoreCoherence(b) - scoreCoherence(a))
  return candidats[0]
}

/**
 * Applique un partitionnement aux tokens. Retourne null si le format
 * francais des nombres n'est pas respecte (1er token > 3 chiffres ou
 * tokens suivants != 3 chiffres exactement).
 */
function appliquerPartition(tokens, [k1, k2, k3, k4]) {
  const result = []
  let i = 0
  for (const k of [k1, k2, k3, k4]) {
    const groupe = tokens.slice(i, i + k)
    // Format francais : 1er token de 1 a 3 chiffres
    if (groupe[0].length > 3) return null
    // Un nombre francais ne commence jamais par 0 (sauf le nombre 0 lui-meme).
    // Si le 1er token d'un groupe est "069" ou "021" etc., c'est forcement
    // un groupe de millier d'un nombre precedent => partitionnement invalide.
    if (groupe[0].length > 1 && groupe[0][0] === '0') return null
    // Suivants : EXACTEMENT 3 chiffres
    for (let j = 1; j < groupe.length; j++) {
      if (groupe[j].length !== 3) return null
    }
    result.push(parseInt(groupe.join(''), 10))
    i += k
  }
  return result
}

/**
 * Score de coherence d'un decoupage en 4 valeurs [nb1, nb2, nb3, nb4].
 * Reflete les ordres de grandeur typiques d'un dataset AT/TJ :
 *   - nb4 (journees perdues) : grand (souvent le max)
 *   - nb3 (deces)            : tres petit (rarement > 1000)
 *   - nb2 (IP)               : petit
 *   - nb1 (1er reglement)    : moyen
 * Score plus eleve = decoupage plus probable.
 */
function scoreCoherence([nb1, nb2, nb3, nb4]) {
  let score = 0
  // nb4 (journees perdues) doit etre le plus grand
  if (nb4 >= nb1) score += 5
  if (nb4 >= nb2) score += 5
  if (nb4 >= nb3) score += 10
  // nb3 (deces) tres petit
  if (nb3 <= nb2) score += 3
  if (nb3 <= nb1) score += 3
  // nb1 (1er regl) >= nb2 (IP) la plupart du temps
  if (nb1 >= nb2) score += 3
  // Penalites pour valeurs aberrantes
  if (nb3 > 5000) score -= 10 // deces rarement > 5000 par categorie
  if (nb2 > nb1 * 2) score -= 5 // IP rarement > 2x le 1er regl
  return score
}

/**
 * Extrait les 4 valeurs (1er regl, IP, deces, journees perdues) qui
 * suivent un libelle dans une zone de texte donnee.
 *
 * @param {string} zone - Texte de la fiche (ou portion).
 * @param {string} libelle - Libelle a chercher.
 * @param {string[]} bornes - Catalogue de tous les libelles connus,
 *                            utilise pour delimiter la fin du segment.
 * @returns {[number, number, number, number] | null}
 */
function extraireValeursApresLibelle(zone, libelle, bornes) {
  // Recherche INSENSIBLE A LA CASSE : certains libelles peuvent etre
  // "Masculin" en 2018 et "masculin" en 2024 dans le meme PDF AM.
  // On compare en minuscules pour les positions, puis on extrait sur
  // l'original (preserve les chiffres et leurs separateurs).
  const zoneLower = zone.toLowerCase()
  const libelleLower = libelle.toLowerCase()

  const debut = zoneLower.indexOf(libelleLower)
  if (debut < 0) return null
  const apresLibelle = debut + libelle.length

  // Trouver la position du prochain libelle connu (= borne sup) pour
  // delimiter le segment de valeurs numeriques.
  let fin = zone.length
  for (const b of bornes) {
    if (b === libelle) continue
    const p = zoneLower.indexOf(b.toLowerCase(), apresLibelle)
    if (p > 0 && p < fin) fin = p
  }

  // Egalement borner par le titre de la prochaine section ("REPARTITION")
  const repartIdx = zoneLower.indexOf('repartition', apresLibelle)
  if (repartIdx > 0 && repartIdx < fin) fin = repartIdx

  const segment = zone.slice(apresLibelle, fin)

  // Tokeniser les nombres dans le segment.
  // On ignore les sequences trop longues (numeros de page "10 of 57")
  // en se limitant aux groupes de 1-3 chiffres.
  const tokens = (segment.match(/\d{1,3}/g) || []).slice(0, 12)
  if (tokens.length < 4) return null

  // Le segment peut contenir des nombres "parasites" apres les 4 valeurs
  // utiles : numero de la ligne suivante (col droite ligne 2), debut
  // d'un autre libelle, etc. On essaie tous les n de 4 a min(tokens, 8)
  // et on retient le meilleur score parmi tous les candidats valides.
  const tousCandidats = []
  for (let n = 4; n <= Math.min(tokens.length, 8); n++) {
    const result = decouperEn4Nombres(tokens.slice(0, n))
    if (result) tousCandidats.push(result)
  }
  if (tousCandidats.length === 0) return null
  if (tousCandidats.length === 1) return tousCandidats[0]
  tousCandidats.sort((a, b) => scoreCoherence(b) - scoreCoherence(a))
  return tousCandidats[0]
}

/* =============================================================
 * 3. EXTRACTION D'UNE SECTION
 * ============================================================= */

/**
 * Extrait toutes les lignes d'une section (Age, Sexe, ...) dans le
 * texte d'une fiche.
 *
 * @param {string} texteFiche - Texte de la fiche AT/TJ/MP.
 * @param {{titre: string, libelles: string[]}} section - Definition.
 * @returns {Array<{libelle: string, nb1erReglement: number, nbIp: number, nbDeces: number, nbJourneesPerdues: number}>}
 */
function extraireSection(texteFiche, section, bornes) {
  // 1. Trouver la position du titre de section. La regex est tolerante
  //    aux variations de mise en page (espaces, sauts de ligne) et au
  //    "(1)" qui suit parfois le titre.
  const titreRe = new RegExp(
    'REPARTITION\\s+(?:SUIVANT|SELON)\\s+' +
      section.titre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    'i'
  )
  const titreMatch = titreRe.exec(texteFiche)
  if (!titreMatch) return []

  // 2. Travailler sur la zone qui suit le titre (toute la fin de la
  //    fiche : on ne se restreint pas a la "section" car le layout 2
  //    colonnes melange les sections de toute facon).
  const apresTitre = titreMatch.index + titreMatch[0].length
  const zone = texteFiche.slice(apresTitre)

  // 3. Pour chaque libelle, extraire ses 4 valeurs.
  const lignes = []
  for (const libelle of section.libelles) {
    const valeurs = extraireValeursApresLibelle(zone, libelle, bornes)
    if (valeurs) {
      lignes.push({
        libelle,
        nb1erReglement: valeurs[0],
        nbNouvellesIp: valeurs[1],
        nbDeces: valeurs[2],
        nbJourneesPerdues: valeurs[3],
      })
    }
  }
  return lignes
}

/* =============================================================
 * 4. API PUBLIQUE
 * ============================================================= */

/**
 * Extrait toutes les repartitions d'une fiche AT (8 sections).
 *
 * Renvoie un objet `Repartitions` partiel (les 3 champs obligatoires
 * + les optionnels specifiques AT).
 *
 * @param {string} texteFiche - Texte brut de la fiche AT.
 * @returns {object} - Object `Repartitions` du type TS.
 */
export function parseRepartitionsAt(texteFiche) {
  const repartitions = {
    parAge: [],
    parSexe: [],
    parQualification: [],
  }

  for (const section of SECTIONS_FICHE_AT) {
    const lignes = extraireSection(texteFiche, section, TOUS_LIBELLES_AT)
    if (lignes.length > 0) {
      repartitions[section.id] = lignes
    }
  }

  return repartitions
}

/**
 * Extrait toutes les repartitions d'une fiche MP (4 sections :
 * Age, Profession, Sexe, Duree d'exposition).
 *
 * @param {string} texteFiche - Texte brut de la fiche MP.
 * @returns {object} - Object `Repartitions` partiel pour MP.
 */
export function parseRepartitionsMp(texteFiche) {
  const repartitions = {}
  for (const section of SECTIONS_FICHE_MP) {
    const lignes = extraireSection(texteFiche, section, TOUS_LIBELLES_MP)
    if (lignes.length > 0) {
      repartitions[section.id] = lignes
    }
  }
  return repartitions
}

/**
 * Extrait la liste des MP par code de tableau cibles (TMS, vibrations,
 * lombalgies, surdite, amiante).
 *
 * Format dans le PDF :
 *   "057A Affections périarticulaires 4 815 2 294 0 1 476 161"
 *   = code + libelle + 4 chiffres (nbMp, nbIp, nbDeces, journees perdues).
 *
 * Strategie : pour chaque code cible, le chercher dans le texte, puis
 * reutiliser `extraireValeursApresLibelle` avec TOUS_CODES_MP comme
 * bornes (= la fonction s'arrete au prochain code MP qui suit).
 *
 * @param {string} texteFicheMp - Texte de la fiche MP detaillee.
 * @returns {Array<{codeTableau, libelle, nbMp, nbNouvellesIp, nbDeces, nbJourneesPerdues}>}
 */
export function parseListeMpCibles(texteFicheMp) {
  if (!texteFicheMp) return []
  const resultat = []
  for (const { code, libelle } of CODES_MP_CIBLES) {
    const valeurs = extraireValeursApresLibelle(
      texteFicheMp,
      code,
      TOUS_CODES_MP
    )
    if (!valeurs) continue
    // On ne stocke que les codes vraiment presents (= avec au moins 1
    // valeur non nulle). Cela evite les "faux positifs" si l'extraction
    // a echoue silencieusement.
    if (valeurs[0] === 0 && valeurs[1] === 0 && valeurs[3] === 0) continue
    resultat.push({
      codeTableau: code,
      libelle,
      nbMp: valeurs[0],
      nbNouvellesIp: valeurs[1],
      nbDeces: valeurs[2],
      nbJourneesPerdues: valeurs[3],
    })
  }
  return resultat
}

/**
 * Verifie qu'une repartition est coherente avec les totaux scalaires
 * de la fiche : la somme des valeurs sur toutes les categories
 * doit etre proche du total declare.
 *
 * Tolerance : ±2% (arrondis et lignes "Non codes" peuvent provoquer
 * de petits ecarts).
 *
 * @param {Array<object>} lignes - Lignes d'une repartition.
 * @param {object} totaux - {nb1erReglement, nbIp, nbDeces, nbJourneesPerdues}
 * @returns {{ok: boolean, ecarts: object}}
 */
export function validerRepartition(lignes, totaux) {
  if (lignes.length === 0) return { ok: false, ecarts: { motif: 'vide' } }

  const sommes = lignes.reduce(
    (acc, l) => ({
      nb1erReglement: acc.nb1erReglement + l.nb1erReglement,
      nbNouvellesIp: acc.nbNouvellesIp + l.nbNouvellesIp,
      nbDeces: acc.nbDeces + l.nbDeces,
      nbJourneesPerdues: acc.nbJourneesPerdues + l.nbJourneesPerdues,
    }),
    { nb1erReglement: 0, nbNouvellesIp: 0, nbDeces: 0, nbJourneesPerdues: 0 }
  )

  const ecarts = {}
  let ok = true
  for (const champ of [
    'nb1erReglement',
    'nbNouvellesIp',
    'nbDeces',
    'nbJourneesPerdues',
  ]) {
    const total = totaux[champ] || 0
    const somme = sommes[champ]
    if (total === 0) {
      ecarts[champ] = somme === 0 ? 'ok' : `inattendu (somme=${somme})`
      if (somme > 0) ok = false
      continue
    }
    const ratio = Math.abs(somme - total) / total
    ecarts[champ] = ratio < 0.02 ? 'ok' : `ecart ${(ratio * 100).toFixed(1)}% (${somme}/${total})`
    if (ratio >= 0.02) ok = false
  }
  return { ok, ecarts }
}
