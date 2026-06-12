export type CardAccessLevel = 'resident' | 'staff' | 'admin'

export interface ApartmentDoorConfig {
  id: string
  position: [number, number, number]
  rotation: [number, number, number]
  isLocked: boolean
  lightOn: boolean
  occupied: boolean
  number: string
  doorColor: string
}

export interface CorridorLightConfig {
  id: string
  position: [number, number, number]
  intensity: number
  color: string
}

export interface DecorItem {
  id: string
  type: 'plant' | 'bench'
  position: [number, number, number]
}

export const CARD_COLORS: Record<CardAccessLevel, string> = {
  resident: '#22c55e',
  staff: '#3b82f6',
  admin: '#ef4444',
}
