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
 * Normalise un code saisi par l'utilisateur (majuscules + trim)
 */
export function normalizeSessionCode(input: string): string {
  return input.trim().toUpperCase()
}
