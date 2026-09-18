/**
 * Fond animé « le verre en filigrane ».
 *
 * La silhouette du verre occupe la hauteur de l'écran, très en retrait, et se
 * remplit une fois au chargement. Le contour reste lisible sans jamais passer
 * devant le texte. SVG et CSS uniquement, donc rendu côté serveur ; la règle
 * `prefers-reduced-motion` de la feuille globale fige le remplissage.
 */

const CONTOUR_VERRE =
  'M163 292 L175 486 Q176 498 189 498 L251 498 Q264 498 265 486 L277 292'

export function FondVerreFiligrane({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute inset-y-0 right-[4%] flex w-[46%] items-center justify-center">
        <div className="absolute h-[70%] w-[70%] rounded-full bg-[radial-gradient(circle,rgb(37_99_235/0.16),transparent_70%)]" />

        <svg
          viewBox="150 280 140 230"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
          className="h-[78vh] w-auto"
        >
          <defs>
            <clipPath id="fond-verre-interieur">
              <path d="M163 292 L175 486 Q176 498 189 498 L251 498 Q264 498 265 486 L277 292 Z" />
            </clipPath>
          </defs>

          <g clipPath="url(#fond-verre-interieur)">
            <g
              className="animate-remplissage-filigrane"
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            >
              <rect x="150" y="292" width="140" height="210" fill="rgb(37 99 235 / 0.2)" />
              <rect x="150" y="292" width="140" height="2.5" fill="rgb(147 197 253 / 0.6)" />
            </g>
            {/* reflet vertical, qui donne l'épaisseur du verre */}
            <rect x="176" y="292" width="7" height="210" fill="rgb(255 255 255 / 0.05)" />
          </g>

          <path d={CONTOUR_VERRE} stroke="rgb(255 255 255 / 0.3)" strokeWidth="2" strokeLinejoin="round" />
          <path d="M163 292 L277 292" stroke="rgb(255 255 255 / 0.14)" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(0_0_0/0.95)_15%,rgb(0_0_0/0.6)_50%,transparent_80%)]" />
      <div className="absolute inset-0 bg-black/45 lg:hidden" />
    </div>
  )
}
