/**
 * Identité de l'éditeur du site, pour les pages légales.
 *
 * ⚠️ TROIS VALEURS SONT À COMPLÉTER avant de considérer les mentions légales
 * comme valides : STATUT_JURIDIQUE, IMMATRICULATION et ADRESSE_POSTALE. Elles
 * s'affichent telles quelles sur /mentions-legales, donc tant qu'elles portent
 * la mention « à compléter », le visiteur la voit aussi.
 *
 * Ce que dit la loi (LCEN, article 6-III) : un site professionnel doit indiquer
 * qui l'édite, comment le joindre et qui l'héberge. Pour une entreprise
 * individuelle, l'adresse peut être celle du siège déclaré.
 */

export const EDITEUR = {
  nom: 'Thomas Relot',
  /** Ex. : « Entreprise individuelle », « SASU », « Auto-entrepreneur ». */
  statutJuridique: 'à compléter',
  /** Ex. : « SIRET 123 456 789 00012 ». */
  immatriculation: 'à compléter',
  /** Siège social ou adresse de domiciliation. */
  adressePostale: 'à compléter',
  /** Responsable de la publication : le plus souvent l'éditeur lui-même. */
  directeurPublication: 'Thomas Relot',
  /** Numéro de déclaration d'activité de formation, si/quand il existe. */
  declarationActivite: null as string | null,
} as const

/** Hébergeur du site. Vercel héberge le domaine leverre-labs.com. */
export const HEBERGEUR = {
  nom: 'Vercel Inc.',
  adresse: '340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis',
  site: 'https://vercel.com',
} as const

/** Date de dernière révision des textes légaux. À mettre à jour si on y touche. */
export const DERNIERE_MISE_A_JOUR = 'septembre 2026'
