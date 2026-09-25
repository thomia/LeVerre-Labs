/**
 * Auto-tests de l'analyse rapide (scoring + physique du verre).
 *
 * Même principe que `src/lib/owas/auto-test.ts` : pas de dépendance externe,
 * on vérifie sur des cas de bornes que
 *   - les 4 cases d'importance pèsent bien comme annoncé,
 *   - l'Orage se neutralise quand aucun imprévu ne survient,
 *   - le Verre et la Paille s'inversent bien (score élevé = favorable),
 *   - le remplissage suit la formule et les durées de calibration attendues,
 *   - la projection (durée de travail représentée) agit sur le temps et non
 *     sur le débit,
 *   - le niveau reste déterministe (rejouer la vidéo donne le même verre).
 *
 * Résultats visibles sur `/dev/analyse-rapide` en `npm run dev`.
 */

import {
  CRITERES_PAR_ELEMENT,
  NIVEAUX_POIDS,
  PIRE_CAS_MINUTES,
  construitSegments,
  courbeNiveau,
  facteurProjection,
  niveauAuTemps,
  notationsParDefaut,
  scoreElement,
  scoresDuMoment,
  tauxParMinute,
  travailEcoule,
  type MomentAnalyse,
  type NotationsMoment,
  type ScoresMoment,
} from './index'

export interface ResultatTest {
  nom: string
  attendu: string
  obtenu: string
  ok: boolean
}

const TOLERANCE = 0.5

function approx(nom: string, obtenu: number, attendu: number, unite = '', tolerance = TOLERANCE): ResultatTest {
  return {
    nom,
    attendu: `${attendu.toFixed(1)}${unite}`,
    obtenu: `${obtenu.toFixed(1)}${unite}`,
    ok: Math.abs(obtenu - attendu) <= tolerance,
  }
}

function vraiSi(nom: string, condition: boolean, attendu: string, obtenu: string): ResultatTest {
  return { nom, attendu, obtenu, ok: condition }
}

/** Notations d'un élément forcées à une même gravité. */
function notationsUniformes(gravite: number): NotationsMoment {
  const notations = notationsParDefaut()
  for (const cle of Object.keys(notations)) notations[cle] = { ...notations[cle], gravite }
  return notations
}

function avecGravite(notations: NotationsMoment, critereId: string, gravite: number): NotationsMoment {
  return { ...notations, [critereId]: { ...notations[critereId], gravite } }
}

function avecPoids(notations: NotationsMoment, critereId: string, niveauPoids: number | null): NotationsMoment {
  return { ...notations, [critereId]: { ...notations[critereId], niveauPoids } }
}

function scores(partiel: Partial<ScoresMoment>): ScoresMoment {
  return { robinet: 0, bulle: 0, orage: 0, paille: 0, verre: 0, ...partiel }
}

export function lancerAutotests(): ResultatTest[] {
  const tests: ResultatTest[] = []

  // --- Scoring -------------------------------------------------------------

  tests.push(approx('Robinet : tous les curseurs à 0', scoreElement('robinet', notationsUniformes(0)), 0))
  tests.push(approx('Robinet : tous les curseurs à 100', scoreElement('robinet', notationsUniformes(100)), 100))

  // Un seul critère à 100 en "Déterminant" (×5), les 4 autres à 0 avec leurs
  // poids par défaut (5 + 3.5 + 2 + 2 = 12.5) : A = √(5×100² / 17.5) = 53.5.
  const robinetUnFacteur = avecPoids(avecGravite(notationsUniformes(0), 'r_charge', 100), 'r_charge', 3)
  tests.push(approx('Robinet : un seul facteur déterminant à 100', scoreElement('robinet', robinetUnFacteur), 53))

  // Le même critère en "Mineur" (×1) pèse deux fois moins : A = √(100²/13.5) = 27.2.
  const robinetMineur = avecPoids(robinetUnFacteur, 'r_charge', 0)
  tests.push(approx('Robinet : le même facteur en mineur', scoreElement('robinet', robinetMineur), 27))

  // Critère écarté : il sort complètement du calcul.
  const robinetEcarte = avecPoids(avecGravite(notationsUniformes(0), 'r_charge', 100), 'r_charge', null)
  tests.push(approx('Robinet : facteur écarté ignoré', scoreElement('robinet', robinetEcarte), 0))

  // Orage : occurrence nulle → criticité nulle (esprit AMDEC).
  const orageSansOccurrence = avecGravite(notationsUniformes(100), 'o_occurrence', 0)
  tests.push(approx('Orage : aucun imprévu survenu', scoreElement('orage', orageSansOccurrence), 0))

  const orageMoitie = avecGravite(notationsUniformes(100), 'o_occurrence', 50)
  tests.push(approx('Orage : imprévu survenu à 50 %', scoreElement('orage', orageMoitie), 50))

  // Éléments positifs : la défaveur est inversée.
  tests.push(approx('Paille : aucun manque observé', scoreElement('paille', notationsUniformes(0)), 100))
  tests.push(approx('Paille : tout est dégradé', scoreElement('paille', notationsUniformes(100)), 0))
  tests.push(approx('Verre : aucune fragilité observée', scoreElement('verre', notationsUniformes(0)), 100))

  // Point de départ d'un moment vierge.
  const defaut = scoresDuMoment(notationsParDefaut())
  tests.push(
    vraiSi(
      'Moment vierge : hypothèse neutre sur les 5 éléments',
      defaut.robinet === 50 && defaut.bulle === 50 && defaut.orage === 0 && defaut.paille === 50 && defaut.verre === 50,
      'R50 B50 O0 P50 V50',
      `R${defaut.robinet} B${defaut.bulle} O${defaut.orage} P${defaut.paille} V${defaut.verre}`
    )
  )

  tests.push(
    vraiSi(
      'Les 4 cases vont bien de ×1 à ×5',
      NIVEAUX_POIDS[0].poids === 1 && NIVEAUX_POIDS[3].poids === 5,
      '×1 → ×5',
      `×${NIVEAUX_POIDS[0].poids} → ×${NIVEAUX_POIDS[3].poids}`
    )
  )

  tests.push(
    vraiSi(
      'Chaque élément a au moins 4 critères observables',
      Object.values(CRITERES_PAR_ELEMENT).every((liste) => liste.length >= 4),
      '≥ 4 par élément',
      Object.values(CRITERES_PAR_ELEMENT)
        .map((liste) => liste.length)
        .join(' / ')
    )
  )

  // --- Physique du verre ---------------------------------------------------
  //
  // Le taux est exprimé par minute de TRAVAIL : les bornes se lisent donc en
  // durée de travail, pas en durée de vidéo.

  const pireCas = scores({ robinet: 100, bulle: 100, orage: 100, paille: 0, verre: 0 })
  tests.push(approx('Pire cas : taux par heure de travail', tauxParMinute(pireCas) * 60, 50, ' %/h'))
  tests.push(
    approx('Pire cas : verre plein après', 100 / tauxParMinute(pireCas), PIRE_CAS_MINUTES, ' min de travail', 1)
  )

  const momentMoyen = scores({ robinet: 50, bulle: 50, orage: 0, paille: 50, verre: 50 })
  tests.push(approx('Moment neutre : taux par heure de travail', tauxParMinute(momentMoyen) * 60, 4.3, ' %/h'))
  tests.push(
    approx('Moment neutre : verre plein après', 100 / tauxParMinute(momentMoyen) / 60, 23.1, ' h de travail', 0.2)
  )

  const momentDur = scores({ robinet: 100, bulle: 80, orage: 60, paille: 10, verre: 20 })
  tests.push(
    approx('Moment dur : verre plein après', 100 / tauxParMinute(momentDur) / 60, 3.0, ' h de travail', 0.2)
  )

  const momentLeger = scores({ robinet: 20, bulle: 20, orage: 0, paille: 80, verre: 80 })
  tests.push(
    vraiSi(
      'Moment léger : le verre se vide',
      tauxParMinute(momentLeger) < 0,
      'taux négatif',
      `${(tauxParMinute(momentLeger) * 60).toFixed(1)} %/h`
    )
  )

  // Vidéo de 2 min entièrement couverte par un moment neutre, projetée sur une
  // demi-journée : 240 min de travail à 4.33 %/h = 17.3 % de verre.
  const moment: MomentAnalyse = {
    id: 'test',
    nom: 'Test',
    debut: 0,
    fin: 120,
    notations: notationsParDefaut(),
    commentaire: '',
  }
  const segments = construitSegments([moment], 120)
  const facteur4h = facteurProjection('4h', 120)
  tests.push(approx('Séquence neutre projetée sur 4 h', niveauAuTemps(segments, 120, facteur4h), 17.3, ' %'))

  tests.push(
    approx(
      'Projection : 1 min de vidéo = 2 min de travail (2 min → 4 h)',
      facteurProjection('4h', 120),
      120,
      '×'
    )
  )
  tests.push(approx('Travail écoulé à mi-vidéo', travailEcoule('4h', 60, 120), 120, ' min'))

  // Doubler la projection double le temps de travail, donc le remplissage
  // (tant qu'on ne touche pas les bornes) : la physique reste linéaire.
  tests.push(
    approx(
      'Projection 8 h = 2 × projection 4 h',
      niveauAuTemps(segments, 120, facteurProjection('8h', 120)),
      2 * niveauAuTemps(segments, 120, facteur4h),
      ' %'
    )
  )

  // Après le moment, plus de robinet : la paille héritée vide le verre.
  const segmentsAvecRepos = construitSegments([moment], 240)
  tests.push(
    vraiSi(
      'Hors moment : le verre redescend',
      niveauAuTemps(segmentsAvecRepos, 240, facteur4h) < niveauAuTemps(segmentsAvecRepos, 120, facteur4h),
      'niveau décroissant',
      `${niveauAuTemps(segmentsAvecRepos, 120, facteur4h).toFixed(1)} % → ${niveauAuTemps(
        segmentsAvecRepos,
        240,
        facteur4h
      ).toFixed(1)} %`
    )
  )

  // Déterminisme : deux appels au même instant donnent le même verre.
  tests.push(
    vraiSi(
      'Déterminisme : rejouer donne le même niveau',
      niveauAuTemps(segments, 90, facteur4h) === niveauAuTemps(segments, 90, facteur4h),
      'identique',
      `${niveauAuTemps(segments, 90, facteur4h).toFixed(3)} %`
    )
  )

  // Bornes.
  const momentExtreme: MomentAnalyse = {
    ...moment,
    notations: avecGravite(notationsUniformes(100), 'o_occurrence', 100),
  }
  const niveauMax = niveauAuTemps(construitSegments([momentExtreme], 120), 120, facteurProjection('8h', 120))
  tests.push(
    vraiSi('Le niveau ne dépasse jamais 100 %', niveauMax <= 100, '≤ 100 %', `${niveauMax.toFixed(1)} %`)
  )

  const niveauMin = niveauAuTemps(
    construitSegments([{ ...moment, notations: notationsUniformes(0) }], 120),
    120,
    facteurProjection('8h', 120)
  )
  tests.push(vraiSi('Le niveau ne descend jamais sous 0 %', niveauMin >= 0, '≥ 0 %', `${niveauMin.toFixed(1)} %`))

  // Le verre plein doit rester atteignable sur une séquence courte : c'est tout
  // l'intérêt de la projection pour la vidéo.
  const niveauDur: MomentAnalyse = {
    ...moment,
    notations: avecGravite(notationsUniformes(90), 'o_occurrence', 80),
  }
  tests.push(
    vraiSi(
      'Un poste très dégradé fait déborder le verre sur 8 h',
      niveauAuTemps(construitSegments([niveauDur], 120), 120, facteurProjection('8h', 120)) >= 99,
      '≈ 100 %',
      `${niveauAuTemps(construitSegments([niveauDur], 120), 120, facteurProjection('8h', 120)).toFixed(1)} %`
    )
  )

  // La courbe de la frise doit raconter la même chose que le verre.
  const courbe = courbeNiveau(segmentsAvecRepos, 240, 241, facteur4h)
  tests.push(
    approx(
      'Courbe de la frise = niveau du verre (t=120 s)',
      courbe[120],
      niveauAuTemps(segmentsAvecRepos, 120, facteur4h),
      ' %',
      1
    )
  )

  return tests
}
