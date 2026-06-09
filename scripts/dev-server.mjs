/**
 * Wrapper autour de `next dev` qui :
 *   1) Détecte et affiche les IPs locales du PC (pour tester sur téléphone)
 *   2) Lance Next.js en écoute sur toutes les interfaces (0.0.0.0)
 *
 * Utilisé par le script `npm run dev` (voir package.json).
 */

import { networkInterfaces } from 'node:os'
import { spawn } from 'node:child_process'

const PORT = process.env.PORT ?? '3000'

// Codes ANSI pour les couleurs dans le terminal
const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
}

/**
 * Récupère les IPs IPv4 locales (non-internal).
 * Filtre les interfaces virtuelles courantes (VMware, VirtualBox, WSL, etc.)
 */
function getLocalIPs() {
  const nets = networkInterfaces()
  const results = []

  for (const [name, addresses] of Object.entries(nets)) {
    for (const addr of addresses ?? []) {
      if (addr.family !== 'IPv4' || addr.internal) continue
      if (addr.address.startsWith('169.254')) continue // APIPA / link-local

      const lowerName = name.toLowerCase()
      const isVirtual =
        lowerName.includes('vmware') ||
        lowerName.includes('virtualbox') ||
        lowerName.includes('vethernet') ||
        lowerName.includes('wsl') ||
        lowerName.includes('hyper-v') ||
        lowerName.includes('docker')

      results.push({
        name,
        address: addr.address,
        isVirtual,
      })
    }
  }

  // Affiche les interfaces réelles en premier
  return results.sort((a, b) => Number(a.isVirtual) - Number(b.isVirtual))
}

function printBanner() {
  const ips = getLocalIPs()

  console.log('')
  console.log(`${COLORS.bold}${COLORS.cyan}📱 Accès pour tes participants (même WiFi) :${COLORS.reset}`)

  if (ips.length === 0) {
    console.log(
      `${COLORS.dim}   Aucune interface réseau détectée. Vérifie ta connexion WiFi/Ethernet.${COLORS.reset}`
    )
  } else {
    for (const ip of ips) {
      const tag = ip.isVirtual
        ? `${COLORS.dim}(virtuelle – ignore probablement)${COLORS.reset}`
        : `${COLORS.green}← utilise celle-ci${COLORS.reset}`
      console.log(
        `   ${COLORS.bold}http://${ip.address}:${PORT}${COLORS.reset}` +
          `  ${COLORS.dim}(${ip.name})${COLORS.reset}  ${tag}`
      )
    }
  }

  console.log('')
  console.log(
    `${COLORS.yellow}💡 Ouvre toi aussi l'app via l'IP ci-dessus (pas via localhost),${COLORS.reset}`
  )
  console.log(
    `${COLORS.yellow}   sinon le QR code généré contiendra localhost et ne marchera pas sur téléphone.${COLORS.reset}`
  )
  console.log('')
}

// ---- Démarrage ------------------------------------------------------------
printBanner()

const child = spawn('npx', ['next', 'dev', '-H', '0.0.0.0', '-p', PORT], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
})

child.on('exit', (code) => process.exit(code ?? 0))

// Propagation des signaux d'arrêt (Ctrl+C) au processus enfant
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal))
}
