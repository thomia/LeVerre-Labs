import { EcranSaisieCode } from '@/components/formation/participant/ecran-saisie-code'

/**
 * Code de session invalide (`/session/[code]`).
 *
 * En pleine session, le 404 par défaut de Next.js laissait le participant
 * bloqué sans explication. On propose directement de resaisir le code.
 */
export default function CodeSessionIntrouvable() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gradient-to-br from-black via-slate-950 to-slate-900 p-4">
      <EcranSaisieCode avertissement="Ce lien de session n'est pas valide. Vérifie le code affiché par ton formateur." />
    </div>
  )
}
