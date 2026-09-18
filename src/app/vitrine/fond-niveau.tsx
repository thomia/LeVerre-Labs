/**
 * Fond animé « le niveau monte ».
 *
 * Une surface liquide occupe le bas de l'écran : elle monte une fois au
 * chargement, puis deux vagues dérivent lentement en sens opposé. Tout est en
 * CSS et en SVG, sans script ni canvas, donc rendu côté serveur ; la règle
 * `prefers-reduced-motion` de la feuille globale suffit à figer le mouvement.
 */

const VAGUE = 'M0 44 C 120 20, 240 68, 360 44 C 480 20, 600 68, 720 44 L 720 120 L 0 120 Z'

export function FondNiveau({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {/* halo diffus au-dessus de la ligne d'eau */}
      <div className="animate-respiration absolute inset-x-0 bottom-0 h-[62%] bg-[radial-gradient(ellipse_80%_100%_at_50%_100%,rgb(37_99_235/0.32),transparent_70%)]" />

      <div className="animate-montee-niveau absolute inset-x-0 bottom-0 h-[46%]">
        {/* masse d'eau */}
        <div className="absolute inset-x-0 bottom-0 top-10 bg-gradient-to-b from-[rgb(30_70_150/0.75)] via-[rgb(18_45_100/0.7)] to-[rgb(8_20_45/0.85)]" />

        {/* vague de fond, lente */}
        <svg
          className="animate-derive-vague-lente absolute inset-x-0 top-0 h-24 w-[200%]"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          fill="none"
        >
          <path d={VAGUE} fill="rgb(37 99 235 / 0.32)" />
          <path d={VAGUE} transform="translate(720)" fill="rgb(37 99 235 / 0.32)" />
        </svg>

        {/* vague de surface, plus rapide et plus claire */}
        <svg
          className="animate-derive-vague-rapide absolute inset-x-0 top-4 h-24 w-[200%]"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          fill="none"
        >
          <path d={VAGUE} fill="rgb(96 165 250 / 0.24)" />
          <path d={VAGUE} transform="translate(720)" fill="rgb(96 165 250 / 0.24)" />
          <path
            d="M0 44 C 120 20, 240 68, 360 44 C 480 20, 600 68, 720 44"
            stroke="rgb(147 197 253 / 0.7)"
            strokeWidth="1.5"
          />
          <path
            d="M0 44 C 120 20, 240 68, 360 44 C 480 20, 600 68, 720 44"
            transform="translate(720)"
            stroke="rgb(147 197 253 / 0.7)"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* on assombrit la moitié gauche pour garder le texte lisible */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(0_0_0/0.92)_10%,rgb(0_0_0/0.45)_55%,transparent_85%)]" />
      <div className="absolute inset-0 bg-black/45 lg:hidden" />
    </div>
  )
}
