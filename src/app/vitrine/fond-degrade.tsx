/**
 * Fond en nappes de couleur, d'après le « Gradient Builder » de 21st.dev.
 *
 * Le principe du générateur : un dégradé conique net, puis deux passes qui
 * font tout le rendu — un flou large qui transforme les secteurs en nappes
 * organiques, et un grain qui casse les bandes de dégradé. La palette reprend
 * les couleurs de LeVerre Labs : le rose de la marque, le bleu du robinet et
 * le violet de la bulle, posés sur un bleu de nuit.
 *
 * Aucune dépendance : le composant remplit son parent, qui doit être en
 * `position: relative`.
 */

const NAPPES = [
  '#05070D 0%',
  '#0C1A38 16%',
  '#1B2F6B 31%',
  '#4B3A8E 46%',
  '#8E2159 60%',
  '#FF1E5A 72%',
  '#7A1440 82%',
  '#140B1F 91%',
  '#05070D 100%',
].join(', ')

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")"

/** Là où le fond doit s'assombrir pour laisser lire le texte. */
const VOILES = {
  gauche:
    'bg-[linear-gradient(to_right,rgb(3_5_10/0.88)_0%,rgb(3_5_10/0.62)_42%,rgb(3_5_10/0.15)_72%,transparent_100%)]',
  centre:
    'bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgb(3_5_10/0.82)_0%,rgb(3_5_10/0.55)_55%,transparent_100%)]',
} as const

interface FondDegradeProps {
  className?: string
  /** Fait dériver très lentement les nappes, au lieu d'un fond fixe. */
  anime?: boolean
  /** Position du texte à protéger. */
  voile?: keyof typeof VOILES
}

export function FondDegrade({ className = '', anime = false, voile = 'gauche' }: FondDegradeProps) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[#05070D]" />

      {/* Deux nappes identiques à un cadrage près. Les faire se relayer en
          opacité fait respirer les couleurs sans jamais recalculer le flou,
          là où une rotation de la nappe floutée coûtait un tiers des images
          par seconde. */}
      <Nappe angle={145} centre="62% 56%" className={anime ? 'animate-nappe-avant' : ''} />
      {anime && <Nappe angle={228} centre="38% 44%" className="animate-nappe-arriere" />}

      <div
        className="absolute inset-0 opacity-[0.22] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      {/* on ramène le contraste sous le texte sans éteindre les couleurs */}
      <div className={`absolute inset-0 ${VOILES[voile]}`} />
      <div className="absolute inset-0 bg-black/35 lg:hidden" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 to-transparent" />
    </div>
  )
}

function Nappe({
  angle,
  centre,
  className = '',
}: {
  angle: number
  centre: string
  className?: string
}) {
  return (
    <div
      className={`absolute -inset-[30%] blur-[44px] saturate-[1.05] sm:blur-[78px] ${className}`}
      style={{ backgroundImage: `conic-gradient(from ${angle}deg at ${centre}, ${NAPPES})` }}
    />
  )
}
