/**
 * Schéma au trait du modèle du verre.
 *
 * Version statique et sobre du modèle, dessinée comme une planche technique :
 * aucun script, aucune animation, un simple SVG servi avec le HTML. Sert de
 * visuel d'appui quand la version interactive (`ModeleVerreCompact`) serait
 * trop démonstrative, par exemple sur le premier écran de l'accueil.
 */

const REPERES = [
  { numero: 1, nom: 'Le verre', role: 'la capacité de la personne' },
  { numero: 2, nom: 'Le robinet', role: 'les contraintes du travail' },
  { numero: 3, nom: 'La bulle', role: "l'environnement" },
  { numero: 4, nom: "L'orage", role: 'les imprévus' },
  { numero: 5, nom: 'La paille', role: 'la récupération' },
] as const

export function SchemaModele({ avecLegende = true }: { avecLegende?: boolean }) {
  return (
    <figure className="m-0 w-full">
      <svg
        viewBox="0 0 440 580"
        fill="none"
        role="img"
        aria-labelledby="schema-modele-titre"
        className="w-full"
      >
        <title id="schema-modele-titre">
          Schéma du modèle du verre : le robinet remplit le verre, l&apos;orage et
          la bulle en modifient le débit, la paille le vide.
        </title>

        <defs>
          <pattern
            id="schema-modele-hachures"
            width="9"
            height="9"
            patternTransform="rotate(45)"
            patternUnits="userSpaceOnUse"
          >
            <line x1="0" y1="0" x2="0" y2="9" stroke="#60a5fa" strokeOpacity="0.45" strokeWidth="1" />
          </pattern>
          <clipPath id="schema-modele-interieur">
            <path d="M163 292 L175 486 Q176 498 189 498 L251 498 Q264 498 265 486 L277 292 Z" />
          </clipPath>
        </defs>

        {/* 3 - la bulle enveloppe l'ensemble */}
        <ellipse
          cx="220"
          cy="300"
          rx="188"
          ry="252"
          stroke="#c084fc"
          strokeOpacity="0.5"
          strokeWidth="1.25"
          strokeDasharray="5 7"
        />

        {/* 4 - l'orage */}
        <g stroke="#fbbf24" strokeOpacity="0.85" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M64 120 a 20 20 0 0 1 3 -39 a 27 27 0 0 1 51 -7 a 19 19 0 0 1 9 46 Z" />
          <path d="M92 132 L82 154 L94 152 L85 176" />
        </g>

        {/* 2 - le robinet */}
        <g stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M213 128 L213 206 M227 128 L227 206" />
          <path d="M205 128 L235 128" />
          <path d="M186 152 L254 152" />
          <circle cx="182" cy="152" r="5" />
          <circle cx="258" cy="152" r="5" />
          <path d="M206 206 L234 206 L230 216 L210 216 Z" />
        </g>

        {/* le filet d'eau */}
        <path
          d="M220 222 C 214 244, 226 262, 220 286"
          stroke="#60a5fa"
          strokeOpacity="0.8"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="232" cy="250" r="2.2" fill="#60a5fa" fillOpacity="0.6" />
        <circle cx="207" cy="274" r="1.6" fill="#60a5fa" fillOpacity="0.45" />

        {/* 1 - le verre et son niveau de remplissage */}
        <g clipPath="url(#schema-modele-interieur)">
          <rect x="150" y="372" width="140" height="140" fill="url(#schema-modele-hachures)" />
        </g>
        <path
          d="M163 292 L175 486 Q176 498 189 498 L251 498 Q264 498 265 486 L277 292"
          stroke="#e5e7eb"
          strokeOpacity="0.9"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M163 292 L277 292" stroke="#e5e7eb" strokeOpacity="0.35" strokeWidth="1.2" />
        <path
          d="M188 372 C 202 366, 216 378, 230 372 C 240 368, 248 374, 254 372"
          stroke="#60a5fa"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* 5 - la paille */}
        <g stroke="#4ade80" strokeOpacity="0.9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M318 214 L306 232 M330 222 L318 240" />
          <path d="M306 232 L236 452 M318 240 L247 456" />
          <path d="M236 452 L247 456" />
        </g>

        {/* repères numérotés */}
        <g fontSize="12" fontWeight="500">
          <g stroke="#ffffff" strokeOpacity="0.28" strokeWidth="1">
            <line x1="140" y1="440" x2="171" y2="440" />
            <line x1="300" y1="152" x2="264" y2="152" />
            <line x1="404" y1="102" x2="338" y2="102" />
            <line x1="150" y1="92" x2="128" y2="92" />
            <line x1="348" y1="212" x2="325" y2="220" />
          </g>
          <g fill="#000000" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="1">
            <circle cx="126" cy="440" r="13" />
            <circle cx="314" cy="152" r="13" />
            <circle cx="418" cy="102" r="13" />
            <circle cx="164" cy="92" r="13" />
            <circle cx="362" cy="210" r="13" />
          </g>
          <g fill="#ffffff" textAnchor="middle" dominantBaseline="central">
            <text x="126" y="441">1</text>
            <text x="314" y="153">2</text>
            <text x="418" y="103">3</text>
            <text x="164" y="93">4</text>
            <text x="362" y="211">5</text>
          </g>
        </g>
      </svg>

      {avecLegende && (
        <figcaption className="mt-6 space-y-1.5 text-sm text-gray-400">
          {REPERES.map(({ numero, nom, role }) => (
            <span key={numero} className="flex gap-2.5">
              <span className="tabular-nums text-gray-500">{numero}</span>
              <span>
                <span className="text-gray-300">{nom}</span> — {role}
              </span>
            </span>
          ))}
        </figcaption>
      )}
    </figure>
  )
}
