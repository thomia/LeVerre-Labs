/**
 * Coordonnées de contact du site, centralisées.
 *
 * Tout ce qui s'affiche publiquement (footer, page contact, mentions légales)
 * lit ces constantes : quand une information change, une seule ligne à modifier.
 *
 * TODO — passer à une adresse professionnelle : dès que la boîte
 * `contact@leverre-labs.com` existe chez l'hébergeur du domaine, remplacer la
 * valeur de EMAIL_CONTACT ci-dessous. Une adresse Gmail sur un site B2B est
 * lue comme un signal d'amateurisme par les acheteurs (voir
 * `docs/BENCHMARK-SITE-VITRINE.md`, section 3.1).
 */

export const EMAIL_CONTACT = 'leverrelabs@gmail.com'

/** Délai de réponse annoncé aux visiteurs. Tenir cette promesse. */
export const DELAI_REPONSE = '48 heures ouvrées'

/**
 * Téléphone public. Laisser vide tant qu'aucun numéro dédié n'existe :
 * mieux vaut pas de numéro qu'un numéro auquel personne ne répond.
 */
export const TELEPHONE_CONTACT = ''
