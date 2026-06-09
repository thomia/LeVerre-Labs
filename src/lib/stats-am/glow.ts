/**
 * Glow rouge LeVerre Labs : detection des donnees liees au risque
 * d'activite physique au travail (TMS, manutention, lombalgies,
 * traumatismes).
 *
 * Pour chaque type de donnee affichee dans le dashboard, on expose une
 * fonction `estActivitePhysique(libelle)` qui retourne true si ce
 * libelle doit etre mis en avant avec un glow rouge (= la couleur
 * accent rgb(255,30,90) du projet).
 *
 * Cette source de verite UNIQUE evite que les composants UI dispersent
 * leur propre logique de "qu'est-ce qu'un risque physique".
 */

/**
 * Couleur accent LeVerre Labs (= rouge magenta vif).
 * A utiliser dans les classes Tailwind via style inline ou via les
 * tokens CSS.
 */
export const COULEUR_RISQUE_PHYSIQUE = 'rgb(255,30,90)'

/**
 * Style glow standard a appliquer sur un element HTML/SVG pour indiquer
 * "risque physique" (texte ou box-shadow leger).
 */
export const STYLE_GLOW_RISQUE_PHYSIQUE = {
  boxShadow: '0 0 24px rgba(255,30,90,0.45), 0 0 48px rgba(255,30,90,0.2)',
} as const

export const STYLE_GLOW_TEXTE = {
  textShadow: '0 0 24px rgba(255,30,90,0.5), 0 0 48px rgba(255,30,90,0.25)',
} as const

/* =============================================================
 * 1. REGLES PAR SECTION DE REPARTITION
 * ============================================================= */

/**
 * Mots-cles qui declenchent le glow dans la section
 * "REPARTITION SUIVANT LA NATURE DES LESIONS".
 * Exemples cibles : traumatismes internes, entorses, douleurs musculaires.
 */
const MOTS_CLES_NATURE_LESION = [
  'traumatisme', // "Traumatismes internes" (= lesions liees a effort)
  'entorse', // "Entorses et foulures"
  'douleur musculaire',
  'lumbago',
  'lombalgie',
] as const

/**
 * Mots-cles qui declenchent le glow dans la section
 * "REPARTITION SUIVANT LE SIEGE DES LESIONS".
 * Les TMS touchent essentiellement les membres superieurs et le dos.
 */
const MOTS_CLES_SIEGE_LESION = [
  'membre superieur',
  'membres superieurs',
  'dos',
  'colonne vertebrale',
] as const

/**
 * Mots-cles dans "REPARTITION SUIVANT LA DEVIATION".
 * La deviation "Mouvement du corps avec contrainte" = effort physique
 * lors d'un mouvement, typique des TMS.
 */
const MOTS_CLES_DEVIATION = [
  'mouvement corps avec contrainte',
  'mouvement du corps avec contrainte',
  'mouvement du corps sous contrainte',
  'effort physique',
] as const

/**
 * Mots-cles dans "REPARTITION SUIVANT LA MODALITE DE LA BLESSURE".
 * "Contrainte du corps" = contrainte mecanique sur le corps.
 */
const MOTS_CLES_MODALITE = [
  'contrainte du corps',
  'contrainte psychique',
] as const

/**
 * Mots-cles dans la "Repartition des AT suivant le risque" de la page
 * SYNTHESE. La manutention manuelle est LE risque physique principal.
 */
const MOTS_CLES_RISQUE_SYNTHESE = [
  'manutention manuelle',
  'manutention',
] as const

/**
 * Codes MP qui correspondent au champ "TMS" au sens large : affections
 * peri-articulaires, vibrations, menisques, rachis lombaire.
 * (Cf. catalogue dans `parse-repartitions.mjs`.)
 */
const CODES_MP_TMS = new Set([
  '057A', // Affections peri-articulaires (= TMS principaux)
  '069A', // Vibrations et chocs / machine
  '079A', // Lesions chroniques du menisque
  '097A', // Rachis lombaire / vibrations
  '098A', // Rachis lombaire / manutention
])

/* =============================================================
 * 2. API : FONCTIONS DE DETECTION
 * ============================================================= */

/**
 * Helper interne : normalise un libelle (lowercase, sans accents) puis
 * teste si l'une des chaines `motsCles` est presente.
 */
function contientMotCle(libelle: string, motsCles: readonly string[]): boolean {
  const normal = libelle
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  return motsCles.some((mc) => normal.includes(mc))
}

/**
 * Detecte si un libelle de la section "Nature des lesions" est lie a
 * un risque d'activite physique.
 */
export function estLesionPhysique(libelle: string): boolean {
  return contientMotCle(libelle, MOTS_CLES_NATURE_LESION)
}

/**
 * Detecte si un libelle de la section "Siege des lesions" est lie a
 * un risque d'activite physique.
 */
export function estSiegePhysique(libelle: string): boolean {
  return contientMotCle(libelle, MOTS_CLES_SIEGE_LESION)
}

/**
 * Detecte si un libelle de la section "Deviation" est lie a un risque
 * d'activite physique.
 */
export function estDeviationPhysique(libelle: string): boolean {
  return contientMotCle(libelle, MOTS_CLES_DEVIATION)
}

/**
 * Detecte si un libelle de la section "Modalite de la blessure" est lie
 * a un risque d'activite physique.
 */
export function estModalitePhysique(libelle: string): boolean {
  return contientMotCle(libelle, MOTS_CLES_MODALITE)
}

/**
 * Detecte si un libelle de la "Repartition par risque" de la synthese
 * est lie a un risque d'activite physique.
 */
export function estRisquePhysique(libelle: string): boolean {
  return contientMotCle(libelle, MOTS_CLES_RISQUE_SYNTHESE)
}

/**
 * Detecte si un code MP est un TMS (ou apparente).
 */
export function estCodeMpTms(codeTableau: string): boolean {
  return CODES_MP_TMS.has(codeTableau)
}

/**
 * Pour la section "Activite physique specifique" (fiche AT), TOUTES
 * les lignes representent un risque physique par nature (manipulation,
 * deplacement, levage, etc.). Donc on glow tout.
 */
export function estActivitePhysiqueLigne(_libelle: string): boolean {
  return true
}

/**
 * Pour la section "TMS par localisation" (focusTms), TOUTES les
 * localisations sont par definition des TMS = activite physique.
 */
export function estTmsLocalisation(_libelle: string): boolean {
  return true
}

/**
 * Mapping universel : etant donne un nom de section et un libelle,
 * retourne true si la ligne doit avoir un glow rouge.
 *
 * Utilise par les composants UI qui ne veulent pas se soucier de
 * "quelle section je suis".
 */
export function ligneEstActivitePhysique(
  section: string,
  libelle: string
): boolean {
  switch (section) {
    case 'parNatureLesions':
      return estLesionPhysique(libelle)
    case 'parSiegeLesions':
      return estSiegePhysique(libelle)
    case 'parDeviation':
      return estDeviationPhysique(libelle)
    case 'parModaliteBlessure':
      return estModalitePhysique(libelle)
    case 'parActivitePhysique':
      return estActivitePhysiqueLigne(libelle)
    case 'parRisque':
      return estRisquePhysique(libelle)
    case 'parLocalisation':
      return estTmsLocalisation(libelle)
    case 'listeParTableau':
      return estCodeMpTms(libelle)
    default:
      return false
  }
}
