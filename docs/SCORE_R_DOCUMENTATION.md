# DOCUMENTATION COMPLÈTE - SCORE R (ROBINET)

## 📊 Vue d'ensemble

Le **Score R** mesure la **CHARGE DE TRAVAIL** totale à travers 4 dimensions principales :
- **A. Charges physiques** (manipulation d'objets)
- **B. Postures contraignantes** (positions du corps)
- **C. Charge mentale** (NASA-TLX)
- **D. Risques psychosociaux** (modèle de Karasek)

---

## 🔵 SECTION A : CHARGES PHYSIQUES

### Questions

**Q1. Présence de charges (Filtre)**
- Si "Non" → Section ignorée
- Sinon → Continuer

**Q2. Type de manipulation**
- Soulevée / Portée / Poussée / Tirée
- Information qualitative (pas de points)

**Q3. Poids de la charge**
```
< 3 kg     →  5 points
3-5 kg     → 10 points  
5-10 kg    → 20 points
10-15 kg   → 40 points
15-25 kg   → 60 points
25-40 kg   → 80 points
40-55 kg   → 90 points
> 55 kg    → 100 points
```

**Q4. Préhension (Multiplicateur)**
```
Facile          → 0    (×1.00)
Correct         → 0.1  (×1.10)
Difficile       → 0.30 (×1.30)
Très difficile  → 0.45 (×1.45)
```

**Q5. Fréquence (Multiplicateur)**
```
< 1/min        → 0    (×1.00)
1-5/min        → 0.20 (×1.20)
5-15/min       → 0.40 (×1.40)
> 15/min       → 0.60 (×1.60)
```

### Formule de calcul

```typescript
Score_Charges_Brut = Points_Poids × (1 + Ajust_Préhension + Ajust_Fréquence)

// Exemple : 40kg, prise difficile, 10 fois/min
// = 40 × (1 + 0.30 + 0.40)
// = 40 × 1.70
// = 68 points brut

// Normalisation sur 100 (max théorique = 205)
Score_Charges = (Score_Brut / 205) × 100
```

**Pondération dans Score R final : 30%**

---

## 🔵 SECTION B : POSTURES

### Q6. Observation des postures (Multiple)

7 postures à observer pendant 2-3 minutes :

```
Bras levés au-dessus des épaules        → +35 points
Dos penché en avant répétitif           → +40 points
Dos en torsion/rotation                 → +25 points
Cou penché en avant OU arrière          → +15 points
Gestes rapides mains/poignets           → +20 points
À genoux ou accroupi prolongé           → +20 points
Position statique prolongée (>30min)    → +10 points
```

**Points cumulatifs** : plusieurs postures peuvent être cochées

### Q7. Fréquence d'exposition (Multiplicateur)

```
Ponctuel (< 1h/jour)        → ×0.5
Modéré (1-2h/jour)          → ×1.0
Important (2-4h/jour)       → ×1.5
Très important (>4h/jour)   → ×2.0
```

### Formule de calcul

```typescript
Score_Postures = Σ(Points_Postures_Cochées) × Facteur_Fréquence

// Exemple : Dos penché (40) + Cou penché (15) × Fréquence importante (1.5)
// = (40 + 15) × 1.5
// = 55 × 1.5
// = 82.5 points

// Normalisation sur 100 (max théorique = 165 × 2 = 330)
Score_Postures = (Score_Brut / 330) × 100
```

**Pondération dans Score R final : 30%**

---

## 🔵 SECTION C : CHARGE MENTALE (NASA-TLX)

### 6 Échelles (0-20 points chacune)

1. **Exigence mentale**
   - Activité cognitive : penser, décider, calculer, mémoriser
   - 0 = Très faible | 20 = Très élevée

2. **Exigence physique**
   - Activité corporelle : pousser, tirer, tourner, contrôler
   - 0 = Très faible | 20 = Très élevée

3. **Exigence temporelle**
   - Pression du temps : rythme, urgence, délais
   - 0 = Très faible | 20 = Très élevée

4. **Performance**
   - Satisfaction par rapport aux objectifs
   - 0 = Bonne | 20 = Mauvaise

5. **Effort**
   - Intensité du travail mental et physique
   - 0 = Très faible | 20 = Très élevé

6. **Niveau de frustration**
   - Stress, irritation, découragement
   - 0 = Très faible | 20 = Très élevé

### Formule de calcul

```typescript
Score_Mental_Brut = E1 + E2 + E3 + E4 + E5 + E6

// Score maximum : 6 × 20 = 120 points

// Normalisation sur 100
Score_Mental = (Score_Brut / 120) × 100
```

**Pondération dans Score R final : 20%**

---

## 🔵 SECTION D : RISQUES PSYCHOSOCIAUX (Karasek)

### 18 Questions (Échelle 1-4)

#### Latitude ou marges de manœuvre (Q10-Q12)
```
Q10: Mon travail me permet de prendre des décisions (1-4)
Q11: J'ai peu de libertés pour décider comment faire (1-4) [INVERSÉ]
Q12: J'ai la possibilité d'influencer mon travail (1-4)
```

#### Utilisation actuelle des compétences (Q13-Q15)
```
Q13: J'effectue des tâches répétitives (1-4) [INVERSÉ]
Q14: Mon travail demande un haut niveau de compétence (1-4)
Q15: J'ai des activités variées (1-4)
```

#### Développement des compétences (Q16-Q18)
```
Q16: Je dois apprendre des choses nouvelles (1-4)
Q17: Mon travail demande de la créativité (1-4)
Q18: J'ai l'occasion de développer mes compétences (1-4)
```

#### Quantité - Rapidité (Q1-Q3)
```
Q1: Je dois travailler très vite (1-4)
Q2: On me demande une quantité excessive (1-4)
Q3: J'ai le temps nécessaire (1-4) [INVERSÉ]
```

#### Complexité - Intensité (Q4-Q6)
```
Q4: Je reçois des ordres contradictoires (1-4)
Q5: Je dois travailler intensément (1-4)
Q6: Longues périodes de concentration (1-4)
```

#### Morcellement - Prévisibilité (Q7-Q9)
```
Q7: Tâches interrompues à reprendre (1-4)
Q8: Travail très bousculé (1-4)
Q9: Attente de collègues ralentit mon travail (1-4)
```

### Formules de calcul

```typescript
// AXE DEMANDE PSYCHOLOGIQUE
Demande_Psycho = Q1 + Q2 + Q5 + (5-Q3) + Q4 + Q6 + Q7 + Q8 + Q9
// Maximum : 9 questions × 4 = 36 points

// AXE LATITUDE DÉCISIONNELLE  
Latitude_Decision = 
  4×Q10 + 4×(5-Q11) + 4×Q12 +      // Marges de manœuvre (poids ×4)
  2×(5-Q13) + 2×Q14 + 2×Q15 +      // Compétences actuelles (poids ×2)
  2×Q16 + 2×Q17 + 2×Q18            // Développement (poids ×2)
// Maximum : (4×3 + 2×6) × 4 = 72 points

// SCORE RPS FINAL
// Haute demande + Faible latitude = Risque élevé
Score_Demande = (Demande_Psycho / 36) × 100
Score_Latitude = (Latitude_Decision / 72) × 100

Score_RPS = (Score_Demande × 0.6) + ((100 - Score_Latitude) × 0.4)
```

**Pondération dans Score R final : 20%**

---

## 🎯 CALCUL FINAL DU SCORE R

### Formule d'agrégation

```typescript
Score_R = 
  (Score_Charges × 0.30) +      // 30% - Charges physiques
  (Score_Postures × 0.30) +     // 30% - Postures
  (Score_Mental × 0.20) +       // 20% - Charge mentale
  (Score_RPS × 0.20)            // 20% - Risques psychosociaux

// Plafonnement entre 0 et 100
Score_R_Final = Math.max(0, Math.min(100, Score_R))
```

### Interprétation

```
0-29   : Charge faible        (Vert)
30-49  : Charge modérée       (Bleu)
50-69  : Charge élevée        (Ambre)
70-100 : Charge très élevée   (Rouge)
```

---

## 📝 Exemple complet

### Données d'entrée
```
SECTION A - CHARGES
- Poids : 15 kg → 60 points
- Préhension : Difficile → ×1.30
- Fréquence : 5-15/min → ×1.40
→ Score_Charges_Brut = 60 × (1 + 0.30 + 0.40) = 102
→ Score_Charges = (102 / 205) × 100 = 49.8

SECTION B - POSTURES
- Dos penché (40) + Gestes rapides (20) = 60 points
- Fréquence : Important → ×1.5
→ Score_Postures_Brut = 60 × 1.5 = 90
→ Score_Postures = (90 / 330) × 100 = 27.3

SECTION C - CHARGE MENTALE
- 6 échelles : 12 + 15 + 18 + 10 + 14 + 11 = 80 points
→ Score_Mental = (80 / 120) × 100 = 66.7

SECTION D - RPS
- Demande psycho : 28/36 → 77.8%
- Latitude : 45/72 → 62.5%
→ Score_RPS = (77.8 × 0.6) + ((100 - 62.5) × 0.4) = 61.7
```

### Calcul final
```
Score_R = (49.8 × 0.30) + (27.3 × 0.30) + (66.7 × 0.20) + (61.7 × 0.20)
        = 14.94 + 8.19 + 13.34 + 12.34
        = 48.81
        ≈ 49 / 100

→ Catégorie : CHARGE MODÉRÉE
```

---

## 🔧 Implémentation technique

### Fichiers créés
```
/src/app/analysis/robinet/page.tsx
/src/lib/calculations/score-r-calculator.ts
/src/components/analysis/robinet-questionnaire.tsx
```

### Fonctions principales
```typescript
calculateScoreCharges(presence, type, poids, prehension, frequence)
calculateScorePostures(posturesPoints[], frequence)
calculateScoreMental(echelles[6])
calculateScoreRPS(reponses[18])
calculateScoreRFinal(scoreCharges, scorePostures, scoreMental, scoreRPS)
```

---

## 📚 Références scientifiques

- **NASA-TLX** : Hart & Staveland (1988)
- **Modèle de Karasek** : Karasek & Theorell (1990)
- **Évaluation des charges** : Norme ISO 11228
- **Analyse posturale** : Méthode REBA/RULA

---

*Document généré pour LeVerre Labs*
*Toutes les formules sont implémentées dans le code avec documentation inline*
