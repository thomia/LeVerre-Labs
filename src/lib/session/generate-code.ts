/**
 * Génération de code de session court et lisible
 * Format : LV-XXXX (LV pour LeVerre, puis 4 caractères alphanumériques)
 * Caractères exclus : 0, O, 1, I, L pour éviter les confusions
 */

const SAFE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

export function generateSessionCode(): string {
  let code = 'LV-'
  for (let i = 0; i < 4; i++) {
    code += SAFE_CHARS[Math.floor(Math.random() * SAFE_CHARS.length)]
  }
  return code
}

/**
 * Vérifie qu'un code a le format attendu
 */
export function isValidSessionCode(code: string): boolean {
  return /^LV-[A-Z2-9]{4}$/.test(code.toUpperCase())
}

/**
 * Normalise un code saisi ou tapé dans la barre d'adresse.
 *
 * Tolérant, car un participant recopie le code depuis un écran projeté : on
 * accepte les minuscules, les espaces, les séparateurs fantaisistes
 * (`LV_ABCD`, `LV.ABCD`), l'oubli du tiret (`LVABCD`) ou du préfixe (`ABCD`),
 * et même une URL complète collée (`leverre-labs.com/session/LV-ABCD`).
 *
 * Renvoie toujours la forme canonique `LV-XXXX` quand c'est possible, sinon
 * l'entrée nettoyée (à charge de `isValidSessionCode` de la rejeter).
 */
export function normalizeSessionCode(input: string): string {
  // Une URL collée : on ne garde que ce qui suit le dernier "/".
  const dernierSegment = input.trim().split(/[/?#]/).filter(Boolean).pop() ?? ''

  const caracteres = dernierSegment.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const sansPrefixe = caracteres.startsWith('LV')
    ? caracteres.slice(2)
    : caracteres

  return sansPrefixe ? `LV-${sansPrefixe}` : caracteres
}
