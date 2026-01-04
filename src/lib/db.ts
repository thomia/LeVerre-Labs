/**
 * Configuration du client Prisma
 * Singleton pour éviter multiples instances en développement
 */

import { PrismaClient } from '@prisma/client'

// Fonction pour créer le client Prisma avec logs en dev
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

// Déclarer le type pour global
declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

// Utiliser un singleton en développement pour éviter trop de connexions
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}
