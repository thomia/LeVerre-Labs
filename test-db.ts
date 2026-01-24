/**
 * Script de test pour vérifier la connexion Prisma
 * Exécuter avec: npx ts-node test-db.ts
 */

import prisma from './src/lib/db'
import bcrypt from 'bcryptjs'

async function testDatabase() {
  console.log('🧪 Test de la base de données...\n')

  try {
    // Test 1: Vérifier la connexion
    console.log('✓ Connexion à la base de données... OK')

    // Test 2: Créer un utilisateur de test
    console.log('\n📝 Création d\'un utilisateur de test...')
    
    const hashedPassword = await bcrypt.hash('password123', 10)
    
    const testUser = await prisma.user.create({
      data: {
        email: 'test@leverre.fr',
        password: hashedPassword,
        role: 'BETA_TESTEUR',
        nom: 'Dupont',
        prenom: 'Jean',
        entreprise: 'LeVerre Labs',
        poste: 'Ergonome'
      }
    })

    console.log('✓ Utilisateur créé:', {
      id: testUser.id,
      email: testUser.email,
      nom: testUser.nom,
      prenom: testUser.prenom,
      role: testUser.role
    })

    // Test 3: Lire l'utilisateur
    console.log('\n📖 Lecture de l\'utilisateur...')
    const foundUser = await prisma.user.findUnique({
      where: { email: 'test@leverre.fr' }
    })

    if (foundUser) {
      console.log('✓ Utilisateur trouvé:', foundUser.email)
    }

    // Test 4: Créer une analyse de test
    console.log('\n📊 Création d\'une analyse de test...')
    
    const testAnalysis = await prisma.analysis.create({
      data: {
        userId: testUser.id,
        poste: 'Opérateur de production',
        tache: 'Assemblage de composants',
        duree: 480, // 8 heures
        date: new Date(),
        operateur: 'Jean Dupont',
        notes: 'Analyse de test initiale',
        scores: JSON.stringify({
          robinet: { total: 65, chargePhysique: 15, postures: 12, frequence: 14, chargeMentale: 13, rps: 11 },
          verre: { capacite: 60, age: 15, anciennete: 18, formation: 15, antecedents: 12 },
          paille: { total: 45, pausesActives: 12, etirements: 10, relaxation: 13, sommeil: 10 },
          bulle: { total: 55, temperature: 10, eclairage: 12, bruit: 8, vibrations: 6, hygiene: 7, espace: 8, equipements: 4 },
          orage: { total: 40, impact: 20, duree: 12, frequence: 8 }
        }),
        results: JSON.stringify({
          remplissageMax: 78,
          risqueTMS: 65,
          risqueAccident: 58,
          niveauGlobal: 'vigilance'
        }),
        recommendations: JSON.stringify([
          'Réduire la charge physique',
          'Améliorer l\'ergonomie du poste',
          'Augmenter la fréquence des pauses'
        ])
      }
    })

    console.log('✓ Analyse créée:', {
      id: testAnalysis.id,
      poste: testAnalysis.poste,
      tache: testAnalysis.tache
    })

    // Test 5: Créer un scénario de test
    console.log('\n🎬 Création d\'un scénario de test...')
    
    const testScenario = await prisma.scenario.create({
      data: {
        userId: testUser.id,
        name: 'Scénario de démonstration',
        description: 'Exemple de configuration pour webinaire',
        shareCode: 'DEMO-' + Math.random().toString(36).substring(7).toUpperCase(),
        settings: JSON.stringify({
          robinet: 75,
          verre: 50,
          paille: 30,
          bulle: 60,
          orage: 45
        })
      }
    })

    console.log('✓ Scénario créé:', {
      id: testScenario.id,
      name: testScenario.name,
      shareCode: testScenario.shareCode
    })

    // Test 6: Lire toutes les données
    console.log('\n📊 Statistiques de la base de données:')
    
    const userCount = await prisma.user.count()
    const analysisCount = await prisma.analysis.count()
    const scenarioCount = await prisma.scenario.count()

    console.log(`  - Utilisateurs: ${userCount}`)
    console.log(`  - Analyses: ${analysisCount}`)
    console.log(`  - Scénarios: ${scenarioCount}`)

    // Test 7: Relations
    console.log('\n🔗 Test des relations...')
    
    const userWithData = await prisma.user.findUnique({
      where: { id: testUser.id },
      include: {
        analyses: true,
        scenarios: true
      }
    })

    console.log(`✓ Utilisateur avec ${userWithData?.analyses.length} analyses et ${userWithData?.scenarios.length} scénarios`)

    console.log('\n✅ Tous les tests sont passés avec succès!\n')
    console.log('🎯 Vous pouvez maintenant:')
    console.log('   1. Ouvrir Prisma Studio (npx prisma studio)')
    console.log('   2. Voir les données dans l\'interface graphique')
    console.log('   3. Continuer avec l\'implémentation de l\'authentification')

  } catch (error) {
    console.error('\n❌ Erreur lors du test:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Fonction pour nettoyer les données de test
async function cleanupTestData() {
  console.log('\n🧹 Nettoyage des données de test...')
  
  const testUser = await prisma.user.findUnique({
    where: { email: 'test@leverre.fr' }
  })

  if (testUser) {
    // Supprimer les analyses et scénarios associés (cascade automatique)
    await prisma.user.delete({
      where: { id: testUser.id }
    })
    console.log('✓ Données de test supprimées')
  } else {
    console.log('ℹ Aucune donnée de test à supprimer')
  }
}

// Menu interactif
const args = process.argv.slice(2)

if (args.includes('--clean')) {
  cleanupTestData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
} else {
  testDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
