/**
 * Types pour les scénarios (Mode Présentation)
 */

export interface Scenario {
  id: string
  userId: string
  name: string
  description?: string
  shareCode?: string
  settings: ScenarioSettings
  createdAt: Date
  updatedAt: Date
}

export interface ScenarioSettings {
  robinet: number     // 0-100
  verre: number       // 30-100
  paille: number      // 0-80
  bulle: number       // 0-100
  orage: number       // 0-100
}

export interface ScenarioFormData {
  name: string
  description?: string
  settings: ScenarioSettings
}
