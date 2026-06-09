/**
 * Statistiques de sinistralite AT/MP - Assurance Maladie
 * =======================================================
 *
 * Donnees publiques publiees annuellement par la CNAM (Caisse Nationale
 * de l'Assurance Maladie - Direction des Risques Professionnels).
 *
 * Source officielle :
 *   https://assurance-maladie.ameli.fr/.../sinistralite-secteur-activite-risques-professionnels
 *
 * Granularite : par CTN (Comite Technique National), 9 grandes branches
 * d'activite + un agregat "tous" qui represente l'ensemble.
 *
 * Niveau de detail :
 *   - Niveau A (ce schema) : indicateurs cles + top MP + focus TMS.
 *     Permet de retracer l'evolution annuelle 2015-2024.
 *   - Niveau B (a venir) : repartitions detaillees par age, sexe,
 *     qualification, etc. Sera ajoute en extension de ce schema,
 *     uniquement pour 2024 dans un premier temps.
 */

/* =============================================================
 * 1. CONSTANTES METIER (vocabulaire fixe par l'AM)
 * ============================================================= */

/**
 * Les 9 grandes branches d'activite definies par l'arrete du 22/12/2000.
 * Le code special "tous" represente l'agregat (ensemble des 9 CTN).
 */
export const CTN_CODES = ['tous', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'] as const
export type CtnCode = (typeof CTN_CODES)[number]

/**
 * Libelles officiels des 9 CTN (versions courtes pour affichage).
 * Les libelles complets sont dans `CTN_LIBELLES_LONGS` (a creer si besoin).
 */
export const CTN_LIBELLES: Record<CtnCode, string> = {
  tous: "Ensemble des 9 grandes branches d'activite",
  A: 'Industries de la metallurgie',
  B: 'Industries du batiment et des travaux publics',
  C: 'Transports, eau, gaz, electricite, livre, communication',
  D: "Services, commerces et industries de l'alimentation",
  E: 'Chimie, caoutchouc, plasturgie',
  F: 'Bois, ameublement, papier-carton, textile, cuir, pierres',
  G: 'Commerce non alimentaire',
  H: 'Services I (banques, assurances, administrations)',
  I: 'Services II (interim, action sociale, sante, nettoyage)',
}

/**
 * Zones du corps utilisees pour le focus TMS dans les fiches MP.
 * Permet de regrouper les ~30 tableaux MP par zone anatomique.
 */
export const TMS_ZONES = [
  'epaule',
  'coude',
  'main-poignet-doigts',
  'dos',
  'genou',
  'cheville-pied',
] as const
export type TmsZone = (typeof TMS_ZONES)[number]

/**
 * Libelles parlants pour l'affichage UI.
 */
export const TMS_ZONES_LIBELLES: Record<TmsZone, string> = {
  epaule: 'Epaule',
  coude: 'Coude',
  'main-poignet-doigts': 'Main, poignet, doigts',
  dos: 'Dos',
  genou: 'Genou',
  'cheville-pied': 'Cheville et pied',
}

/* =============================================================
 * 2. REPARTITIONS DEMOGRAPHIQUES
 * ============================================================= */

/**
 * Une ligne de repartition (par age, sexe ou qualification).
 *
 * Le PDF fournit pour chaque categorie 4 valeurs :
 *   nb 1er reglement | nb nouvelles IP | nb deces | nb journees perdues
 *
 * Quand une valeur est absente du PDF (ex: pas de deces pour cette tranche
 * d'age), on garde `0` (c'est ce que le PDF affiche, pas une valeur manquante).
 */
export interface RepartitionLigne {
  /** Libelle de la categorie (ex: "20-24 ans", "Masculin", "Cadres techniciens") */
  libelle: string
  /** Nombre de sinistres avec 1er reglement dans cette categorie */
  nb1erReglement: number
  /** Nombre de nouvelles incapacites permanentes */
  nbNouvellesIp: number
  /** Nombre de deces */
  nbDeces: number
  /** Nombre de journees perdues par incapacite temporaire */
  nbJourneesPerdues: number
}

/**
 * Repartitions demographiques d'une fiche AT, TJ ou MP.
 *
 * - `parAge` : 10 tranches officielles AM ("Non precise", "Moins de 20 ans",
 *   "20 a 24 ans", ..., "65 ans et plus").
 * - `parSexe` : 2 lignes (Masculin / Feminin).
 * - `parQualification` : 8 categories (Cadres, Employes, Apprentis, Eleves,
 *   Ouvriers non qualifies, Ouvriers qualifies, Divers, Non precise).
 *   Vide `[]` pour les MP (l'AM ne publie pas cette dimension pour les MP).
 *
 * IMPORTANT - PERIMETRE DES VALEURS ABSOLUES :
 *   Ces repartitions sont extraites de la "fiche AT detaillee" du PDF AM,
 *   qui porte sur un SOUS-ENSEMBLE des AT du CTN : uniquement les AT
 *   correctement codes selon le vocabulaire INRS ESAW (deviation, nature
 *   des lesions, siege, etc.). Les AT non codables (compte special) sont
 *   exclus.
 *
 *   Le ratio "fiche detaillee / total CTN" varie de 5% (CTN B BTP, codage
 *   excellent) a 40% (CTN H services, codage tres partiel). Le pattern
 *   est stable d'une annee a l'autre.
 *
 *   En consequence :
 *   - Les VALEURS ABSOLUES (`nb1erReglement`, etc.) NE SOMMENT PAS au
 *     total CTN affiche dans la fiche scalaire `at.nb1erReglement`.
 *     Elles correspondent au sous-ensemble "AT codes ESAW" du CTN.
 *   - Les POURCENTAGES calcules sur ces valeurs (ex: "60% des AT codes
 *     concernent les hommes") sont consideres representatifs de la
 *     distribution globale, dans l'hypothese que les AT non codables
 *     suivent une distribution similaire.
 *
 *   Pour afficher des valeurs absolues representatives du total CTN dans
 *   l'UI, calculer : `pourcentage_sous_ensemble × at.nb1erReglement`.
 *
 * SOUS-PERIMETRE PAR SECTION :
 *   Certaines sections (Qualification, Deviation, Agent materiel,
 *   Activite physique, Modalite blessure) sont marquees "(1)" dans le
 *   PDF, ce qui signifie qu'elles portent sur les AT avec >=4 jours
 *   d'arret (sous-ensemble du sous-ensemble). Voir `TOTAL_REFERENCE_AT`
 *   dans le parser pour le mapping precis.
 */
export interface Repartitions {
  /* ----- Communs (presents dans AT, TJ et MP) ----- */
  /** Repartition par tranche d'age (10 categories) */
  parAge: RepartitionLigne[]
  /** Repartition par sexe (Masculin, Feminin) */
  parSexe: RepartitionLigne[]

  /* ----- Specifiques fiches AT et TJ (optionnels) ----- */
  /** Qualification professionnelle (Cadres, Employes, Ouvriers...) - AT/TJ */
  parQualification?: RepartitionLigne[]
  /** Repartition par siege des lesions (Tete, Membres superieurs, Dos...) */
  parSiegeLesions?: RepartitionLigne[]
  /** Repartition par deviation (Glissade, Perte de controle...) */
  parDeviation?: RepartitionLigne[]
  /** Repartition par agent materiel de la deviation (Vehicules, Outils...) */
  parAgentMaterielDeviation?: RepartitionLigne[]
  /** Repartition par nature des lesions (Plaies, Fractures, Entorses...) */
  parNatureLesions?: RepartitionLigne[]
  /** Repartition par activite physique specifique (Manipulation, Mouvement...) */
  parActivitePhysique?: RepartitionLigne[]
  /** Repartition par modalite de la blessure (Choc, Heurt, Contrainte...) */
  parModaliteBlessure?: RepartitionLigne[]

  /* ----- Specifique fiche AT uniquement (optionnel) ----- */
  /**
   * Type de lieu de l'accident (14 categories : Site industriel,
   * Chantier, Tertiaire, Domicile, etc.). Section presente uniquement
   * dans la fiche AT, pas TJ ni MP.
   */
  parTypeLieu?: RepartitionLigne[]

  /* ----- Specifiques fiche MP (optionnels) ----- */
  /**
   * Profession (Agriculteurs, Artisans, Conducteurs, Dirigeants,
   * Employes, Personnels de service, etc.). Section presente uniquement
   * dans la fiche MP. Distincte de `parQualification` qui est specifique
   * aux fiches AT/TJ.
   */
  parProfession?: RepartitionLigne[]
  /**
   * Duree d'exposition au risque (6 tranches : < 6 mois, 6 mois-1 an,
   * 1-5 ans, 5-10 ans, > 10 ans, Non precise). Section presente
   * uniquement dans la fiche MP.
   */
  parDureeExposition?: RepartitionLigne[]
}

/* =============================================================
 * 3. FICHES PAR TYPE DE SINISTRE
 * ============================================================= */

/**
 * Fiche Accident du Travail (AT) complete.
 *
 * Quand une valeur scalaire n'est pas calculee dans le PDF (mention "nc"
 * pour "non calcule", typiquement les indicateurs 2020 et 2022),
 * on stocke `null` plutot que d'inventer une valeur.
 */
export interface FicheAt {
  /** Nombre d'AT avec un 1er reglement dans l'annee */
  nb1erReglement: number
  /** Sous-ensemble : ceux avec au moins 4 jours d'arret */
  nbAvec4JoursArret: number
  /** Nombre de nouvelles incapacites permanentes (IP) reconnues */
  nbNouvellesIp: number
  /** Nombre de deces */
  nbDeces: number
  /** Nombre de journees perdues par incapacite temporaire (IT) */
  nbJourneesPerdues: number
  /** Indice de frequence : nb AT 1er regl. pour 1000 salaries */
  indiceFrequence: number | null
  /** Taux de frequence : nb AT 1er regl. par million d'heures travaillees */
  tauxFrequence: number | null
  /** Taux de gravite : nb journees perdues par IT pour 1000 heures travaillees */
  tauxGravite: number | null
  /** Indice de gravite : somme des taux d'IP par million d'heures travaillees */
  indiceGravite: number | null
  /** Nombre d'etablissements sur l'annee (uniquement publie pour les AT) */
  nbEtablissements: number | null
  /** Repartitions demographiques (peut etre absent si extraction partielle) */
  repartitions?: Repartitions
}

/**
 * Fiche Accident de Trajet (TJ) complete.
 *
 * Note : pas de taux de frequence/gravite ni d'indice de gravite
 * pour les trajets (ces indicateurs ne sont publies que pour les AT).
 */
export interface FicheTj {
  nb1erReglement: number
  nbAvec4JoursArret: number
  nbNouvellesIp: number
  nbDeces: number
  nbJourneesPerdues: number
  indiceFrequence: number | null
  /** Repartitions demographiques (peut etre absent si extraction partielle) */
  repartitions?: Repartitions
}

/**
 * Fiche Maladie Professionnelle (MP) complete.
 *
 * IMPORTANT : pour la section "tous CTN", la fiche detaillee du PDF
 * inclut le "compte special" (MP non rattachables a un CTN precis).
 * Les chiffres sont donc legerement superieurs a ceux de la synthese
 * (ex: 50 598 vs 48 042 pour 2024). On stocke ici les chiffres de la
 * fiche detaillee (= source primaire la plus precise).
 *
 * Pour les CTN individuels (A-I), pas de compte special : les chiffres
 * fiche detaillee == chiffres synthese.
 */
/**
 * Une ligne de la liste detaillee des MP par code de tableau cible.
 * Different de `TopMaladieProfessionnelle` qui ne contient que les
 * 5-6 principales MP de la page synthese.
 */
export interface MpParCodeTableau {
  /** Code du tableau MP officiel (ex: "057A", "098A", "069A", "042A") */
  codeTableau: string
  /** Libelle court explicatif */
  libelle: string
  /** Nombre de MP avec un 1er reglement dans l'annee */
  nbMp: number
  /** Nombre de nouvelles incapacites permanentes (IP) */
  nbNouvellesIp: number
  /** Nombre de deces */
  nbDeces: number
  /** Journees perdues par incapacite temporaire (IT) */
  nbJourneesPerdues: number
}

export interface FicheMp {
  /** Nombre de MP avec un 1er reglement dans l'annee */
  nbAvec1erReglement: number
  nbNouvellesIp: number
  nbDeces: number
  /** Journees perdues par incapacite temporaire (IT) */
  nbJourneesPerduesIt: number
  /**
   * Repartitions demographiques (peut etre absent si extraction partielle).
   *
   * Pour les MP, le PDF n'utilise pas la meme dimension "qualification"
   * que pour les AT/TJ. Il fournit a la place une "profession" stockee
   * dans `parProfession` (avec une liste differente : Agriculteurs,
   * Artisans, Conducteurs, Employes, Personnels de service, etc.).
   */
  repartitions?: Repartitions
  /**
   * Liste des MP par code de tableau cible (TMS, lombalgies, surdite,
   * vibrations, amiante). Complement utile du `topMp` qui n'inclut
   * que les 5-6 principales MP du CTN. Les codes cibles sont :
   *   - 057A : Affections periarticulaires (= TMS principal)
   *   - 069A : Vibrations et chocs / machine
   *   - 079A : Lesions chroniques du menisque
   *   - 097A : Rachis lombaire / vibrations
   *   - 098A : Rachis lombaire / manutention
   *   - 042A : Surdite
   *   - 030A/030B : Amiante
   *
   * Seuls les codes effectivement presents avec au moins 1 cas sont
   * inclus (pas de lignes a 0).
   */
  listeParTableau?: MpParCodeTableau[]
}

/* =============================================================
 * 4. SECTIONS COMPLEMENTAIRES
 * ============================================================= */

/**
 * Une ligne du "top des maladies professionnelles" presente dans la
 * fiche de synthese de chaque CTN (typiquement les 5-6 MP les plus
 * representees).
 *
 * Exemple PDF : "057A | Affections periarticulaires | 4 815 | 77% | 4 541"
 */
export interface TopMaladieProfessionnelle {
  /** Code du tableau MP officiel (ex: "057A", "030A", "098A") */
  codeTableau: string
  /** Libelle officiel du tableau MP */
  libelle: string
  /** Nombre de MP avec 1er reglement dans l'annee */
  nbMp: number
  /** Pourcentage sur le total MP du CTN (0-100) */
  pourcentage: number
  /** Nombre de MP l'annee precedente, pour comparaison */
  nbMpAnneePrecedente: number | null
}

/**
 * Une ligne de repartition TMS par localisation anatomique.
 * Le PDF affiche le pourcentage ; on calcule la valeur absolue
 * approximative (pourcentage * totalTms / 100) lors de l'usage.
 */
export interface TmsParLocalisation {
  /** Localisation anatomique */
  localisation:
    | 'coude'
    | 'main, poignet, doigts'
    | 'épaule'
    | 'genou'
    | 'cheville, pied'
    | 'dos'
  /** Pourcentage du total TMS pour cette localisation (0-100) */
  pourcentage: number
}

/**
 * Focus TMS (Troubles Musculo-Squelettiques) : total + repartition
 * par localisation anatomique.
 *
 * Le PDF AM affiche un graphique radial avec 6 secteurs (coude, main,
 * epaule, genou, cheville, dos). L'ordre dans le texte extrait du PDF
 * est CONSTANT depuis 2015 :
 *   [coude, main+poignet+doigts, epaule, genou, cheville+pied, dos]
 * Verifie : somme des 6 % = 100% sur 40 cas (2015-2024 x 10 CTN).
 *
 * Pour le "tous CTN", le total TMS inclut le compte special des MP
 * (mention explicite dans le PDF : "Le total des TMS comprend en plus
 * le compte special des maladies professionnelles").
 *
 * Note importante : les LOMBALGIES du tableau 98 (Affections du rachis
 * lombaire) NE SONT PAS comptees dans les TMS du graphique. Elles
 * apparaissent separement dans `topMp` sous le code "098A".
 *
 * Le detail par syndrome individuel (canal carpien, epicondylite, etc.)
 * est present dans le PDF mais son extraction est trop fragile
 * (chiffres et libelles melanges dans le layout). Non extrait.
 */
export interface FocusTms {
  /** Nombre total de TMS avec 1er reglement dans l'annee */
  totalTms: number
  /**
   * Repartition par localisation anatomique (6 categories).
   * Ordre fixe : coude, main, epaule, genou, cheville, dos.
   * Somme des pourcentages = 100 (a ±1% pres, arrondis PDF).
   */
  parLocalisation?: TmsParLocalisation[]
}

/**
 * Une ligne de repartition en pourcentage (ex: "Manutention manuelle 50%").
 * Pas de valeur absolue, juste le pourcentage et le libelle.
 */
export interface RepartitionPourcent {
  /** Libelle officiel du PDF (ex: "Manutention manuelle", "Dos") */
  libelle: string
  /** Pourcentage entier (0-100) */
  pourcentage: number
}

/**
 * Repartitions en pourcentage de la fiche SYNTHESE d'un CTN.
 *
 * Ces 3 repartitions ne portent que sur les AT (pas TJ ni MP).
 * Elles donnent un eclairage qualitatif sur la sinistralite :
 *   - quelles causes (manutention, chutes...) ?
 *   - quelles zones du corps touchees ?
 *   - quel type de lesion (trauma, entorse...) ?
 *
 * Le total des pourcentages d'une categorie fait ~100% (modulo arrondis).
 * Les categories presentes varient selon les CTN (ex: "Risque routier"
 * apparait pour le CTN B, "Machines" pour le CTN A).
 */
export interface RepartitionsSynthese {
  /**
   * Repartition des AT suivant le risque a l'origine de l'accident
   * (Manutention manuelle, Chutes plain-pied, Chutes hauteur,
   * Outillage main, Agressions, Risque routier, Machines, Autre,
   * Inconnue ou non precisee, ...)
   */
  parRisque: RepartitionPourcent[]
  /**
   * Repartition des AT selon le siege des lesions (Tete et cou,
   * Membres superieurs, Torse et organes, Dos, Membres inferieurs,
   * Multiples endroits du corps affectes)
   */
  parSiegeLesion: RepartitionPourcent[]
  /**
   * Repartition des AT selon la nature de la lesion (Traumatismes
   * internes, Entorses et foulures, Commotions, Chocs traumatiques,
   * Plaies ouvertes, Autre)
   */
  parNatureLesion: RepartitionPourcent[]
}

/* =============================================================
 * 5. ASSEMBLAGE PAR CTN ET PAR ANNEE
 * ============================================================= */

/**
 * Stats d'un CTN (ou de l'ensemble agrege) pour une annee donnee.
 */
export interface StatsCtn {
  /** Code CTN (A-I ou "tous") */
  code: CtnCode
  /** Libelle officiel court (cf. CTN_LIBELLES) */
  libelle: string
  /**
   * Nombre de salaries en activite dans ce CTN sur l'annee.
   * Mutualise entre AT/TJ/MP (c'est le meme chiffre).
   */
  nbSalariesActivite: number

  at: FicheAt
  tj: FicheTj
  mp: FicheMp

  /** Top des MP les plus frequentes (typiquement 5-6 lignes) */
  topMp: TopMaladieProfessionnelle[]

  /**
   * Focus TMS : total TMS (= MP type Troubles Musculo-Squelettiques).
   * Donnee cle pour la thematique "risque physique" du projet LeVerre Labs.
   */
  focusTms?: FocusTms

  /**
   * Repartitions en pourcentage de la fiche SYNTHESE :
   *   - par risque (manutention manuelle, chutes...)
   *   - par siege des lesions (dos, membres sup...)
   *   - par nature de lesion (trauma interne, entorse...)
   *
   * Ces 3 repartitions ne portent que sur les AT (pas TJ ni MP).
   */
  repartitionsSynthese?: RepartitionsSynthese
}

/**
 * Donnees d'une annee complete : agregat "tous" + 9 CTN individuels.
 *
 * Convention : le tableau `ctns` contient toujours 10 elements :
 * `tous` en premier, puis A, B, C, D, E, F, G, H, I dans cet ordre.
 */
export interface StatsAnnee {
  /** Annee de reference des donnees (ex: 2024) */
  annee: number
  /** Date de publication du PDF source si connue (format ISO YYYY-MM-DD) */
  datePublication?: string
  /** Reference interne du document AM (ex: "2026-026") */
  referenceCnam?: string
  /** Stats par CTN ("tous" + A-I) */
  ctns: StatsCtn[]
}
