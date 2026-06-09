"use client"

import { motion } from "framer-motion"
import {
  Activity,
  HeartPulse,
  ShieldCheck,
  Brain,
  Users,
  GraduationCap,
  Palette,
  BarChart3,
  MonitorSmartphone,
  FlaskConical,
  Globe,
  Lightbulb,
  type LucideIcon,
} from "lucide-react"

/**
 * RadarCompetences — Radar 360° aux couleurs LeVerre Labs.
 *
 * Concept visuel : un radar avec 4 cercles concentriques rouges
 * atténués, une ligne "sweep" rouge qui balaie en 360° en boucle,
 * et 12 disciplines disposées comme des "blips" tout autour.
 *
 * Métaphore : "Là où nos disciplines se croisent." Chaque domaine
 * est un point d'entrée possible pour un·e chercheur·euse,
 * un·e ergonome ou un·e institutionnel·le qui se reconnaît dans
 * l'une de ces intersections.
 *
 * Adaptable :
 *   - Toutes les couleurs s'alignent sur le rouge LeVerre rgb(255,30,90).
 *   - Les labels sont visibles sur écrans md+ et masqués sur mobile.
 */

const ROUGE = "rgb(255,30,90)"

interface Domaine {
  label: string
  Icon: LucideIcon
  // Strate (1 à 4) = distance au centre. La strate 1 est au cœur du
  // projet, la strate 4 la plus périphérique. Le rayon réel est calculé
  // à partir de la strate via RAYON_PAR_STRATE.
  strate: 1 | 2 | 3 | 4
}

// Rayon (en % du container, mesuré depuis le centre) associé à chaque
// strate. Plus la strate est élevée, plus le domaine est éloigné.
const RAYON_PAR_STRATE: Record<Domaine["strate"], number> = {
  1: 17,
  2: 28,
  3: 38,
  4: 47,
}

// 12 disciplines réparties en 4 strates. L'ordre du tableau alterne les
// strates (1→2→3→4→1…) afin de répartir les domaines en "bras" autour du
// radar et d'éviter l'effet "blips alignés".
const DOMAINES: Domaine[] = [
  { label: "Ergonomie", Icon: Activity, strate: 1 },
  { label: "Sciences cognitives", Icon: Brain, strate: 2 },
  { label: "UX Design", Icon: Palette, strate: 3 },
  { label: "Recherche appliquée", Icon: FlaskConical, strate: 2 },
  { label: "Santé au travail", Icon: HeartPulse, strate: 1 },
  { label: "Facteurs humains", Icon: Users, strate: 2 },
  { label: "Visualisation de données", Icon: BarChart3, strate: 3 },
  { label: "Santé publique", Icon: Globe, strate: 4 },
  { label: "Prévention des risques", Icon: ShieldCheck, strate: 1 },
  { label: "Ingénierie pédagogique", Icon: GraduationCap, strate: 2 },
  { label: "Logiciels de prévention", Icon: MonitorSmartphone, strate: 3 },
  { label: "Innovation", Icon: Lightbulb, strate: 4 },
]

// Nombre d'anneaux concentriques (un par strate).
const ANNEAUX_COUNT = 4

export function RadarCompetences() {
  return (
    <div className="relative mx-auto aspect-square w-[min(94vw,760px)]">
      {/* Animation locale du sweep — un keyframe simple qui fait
          tourner la ligne radar de 0° à 360° en boucle. */}
      <style>{`
        @keyframes radar-sweep {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes radar-pulse {
          0%, 100% {
            box-shadow:
              0 0 16px rgb(255,30,90),
              0 0 0 0 rgba(255,30,90,0.45);
          }
          50% {
            box-shadow:
              0 0 16px rgb(255,30,90),
              0 0 0 14px rgba(255,30,90,0);
          }
        }
      `}</style>

      {/* --- Cercles concentriques rouges atténués --- */}
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: ANNEAUX_COUNT }).map((_, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.08, duration: 0.5 }}
            className="absolute rounded-full border"
            style={{
              height: `${((idx + 1) / ANNEAUX_COUNT) * 94}%`,
              width: `${((idx + 1) / ANNEAUX_COUNT) * 94}%`,
              borderColor: `rgba(255,30,90,${0.45 - idx * 0.06})`,
            }}
          />
        ))}
      </div>

      {/* --- Sweep : ligne rouge qui balaie 360° --- */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-10"
        style={{
          width: "47%",
          height: "1px",
          transformOrigin: "left center",
          animation: "radar-sweep 8s linear infinite",
        }}
      >
        <div
          className="h-full w-full"
          style={{
            background:
              "linear-gradient(to right, rgba(255,30,90,0) 0%, rgba(255,30,90,0.18) 35%, rgba(255,30,90,0.85) 100%)",
            boxShadow: "0 0 8px rgba(255,30,90,0.45)",
          }}
        />
      </div>

      {/* --- Logo LeVerre Labs au centre du radar ---
          Le logo remplace l'ancien point central. Un halo rouge pulsé
          (animation CSS pure) l'entoure pour rappeler le "blip" radar. */}
      <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
        {/* Halo rouge pulsé en arrière-plan */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ animation: "radar-pulse 2.5s ease-in-out infinite" }}
        />
        <img
          src="/photo%20video/logo_noir-removebg-preview.png"
          alt="LeVerre Labs"
          className="relative h-14 w-14 object-contain brightness-0 invert sm:h-16 sm:w-16"
          style={{ filter: "brightness(0) invert(1) drop-shadow(0 0 10px rgba(255,30,90,0.7))" }}
        />
      </div>

      {/* --- Domaines disposés en cercle autour --- */}
      {DOMAINES.map((domaine, i) => {
        // Angle en radians : on démarre à 12h (-π/2) et on tourne
        // dans le sens horaire au fur et à mesure des éléments.
        const angle = (i / DOMAINES.length) * 2 * Math.PI - Math.PI / 2
        const radius = RAYON_PAR_STRATE[domaine.strate]
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        const { Icon, label } = domaine

        return (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.08, duration: 0.4 }}
            className="absolute z-30 flex flex-col items-center gap-2"
            style={{
              left: `calc(50% + ${x}%)`,
              top: `calc(50% + ${y}%)`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl border bg-black/80 backdrop-blur-sm transition-transform duration-200 hover:scale-110 sm:h-12 sm:w-12"
              style={{
                borderColor: "rgba(255,30,90,0.35)",
                color: ROUGE,
                boxShadow: "0 4px 14px rgba(255,30,90,0.2)",
              }}
            >
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.6} />
            </div>
            <span className="hidden whitespace-nowrap text-[11px] font-medium text-slate-300 md:block">
              {label}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}
