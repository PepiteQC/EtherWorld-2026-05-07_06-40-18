// ════════════════════════════════════════════════════════════════
// BÂTIMENTS — Village de Québec (Route 138)
// Zone: z ≈ -700 à -860
// ════════════════════════════════════════════════════════════════

export interface JobDef {
  id: string
  title: string
  emoji: string
  reward: number
  durationMs?: number
  cooldownMs?: number
}

export interface BuildingDef {
  id: string
  name: string
  pos: [number, number, number]
  size: [number, number, number]   // [largeur, hauteur, profondeur]
  wallColor: string
  wallColor2?: string
  roofColor: string
  signColor: string
  signTextColor?: string
  doorSide: 'left' | 'right'
  hasInterior?: boolean
  interiorId?: string
  job?: JobDef
}

// ── Zone d'interaction pour le Walker ──
export interface DoorZone {
  id: string
  name: string
  pos: [number, number, number]
  hasInterior: boolean
  interiorId?: string
  job?: JobDef
}

const BUILDINGS: BuildingDef[] = [
  {
    id: 'hotel',
    name: 'HÔTEL DU VILLAGE',
    pos: [18, 0, -750],
    size: [10, 14, 8],
    wallColor: '#2a3a5c',
    wallColor2: '#1e2a4a',
    roofColor: '#0f1419',
    signColor: '#1e3a7a',
    signTextColor: '#5ab0ff',
    doorSide: 'right',
    hasInterior: true,
    interiorId: 'hotel',
    job: {
      id: 'hotel_reception',
      title: 'Réceptionniste',
      emoji: '🏨',
      reward: 85,
      durationMs: 10000,
      cooldownMs: 90000,
    },
  },
  {
    id: 'depanneur',
    name: 'DÉPANNEUR CHEZ GILLES',
    pos: [-20, 0, -770],
    size: [8, 5, 6],
    wallColor: '#d8d0c3',
    roofColor: '#cc0000',
    signColor: '#cc0000',
    signTextColor: '#ffffff',
    doorSide: 'left',
    hasInterior: true,
    interiorId: 'depanneur',
    job: {
      id: 'depanneur_caissier',
      title: 'Caissier(ère)',
      emoji: '🛒',
      reward: 45,
      durationMs: 7000,
      cooldownMs: 60000,
    },
  },
  {
    id: 'restaurant',
    name: 'RESTAURANT LA BELLE PROVINCE',
    pos: [22, 0, -800],
    size: [10, 5, 9],
    wallColor: '#c8b87a',
    roofColor: '#6a3010',
    signColor: '#d4501a',
    signTextColor: '#fff5e0',
    doorSide: 'right',
    hasInterior: true,
    interiorId: 'restaurant',
    job: {
      id: 'restaurant_serveur',
      title: 'Serveur/Serveuse',
      emoji: '🍽️',
      reward: 60,
      durationMs: 9000,
      cooldownMs: 75000,
    },
  },
  {
    id: 'police',
    name: 'SQ — POSTE 138',
    pos: [-22, 0, -820],
    size: [11, 6, 10],
    wallColor: '#3a4a68',
    wallColor2: '#2a3a58',
    roofColor: '#0a1220',
    signColor: '#2255cc',
    signTextColor: '#ffffff',
    doorSide: 'left',
    hasInterior: true,
    interiorId: 'police',
    job: {
      id: 'police_patrouille',
      title: 'Agent(e) patrouille',
      emoji: '👮',
      reward: 120,
      durationMs: 14000,
      cooldownMs: 120000,
    },
  },
  {
    id: 'pharmacie',
    name: 'PHARMACIE JEAN-COUTU',
    pos: [20, 0, -830],
    size: [9, 5, 7],
    wallColor: '#e8e4dc',
    roofColor: '#22c55e',
    signColor: '#22c55e',
    signTextColor: '#ffffff',
    doorSide: 'right',
    job: {
      id: 'pharmacie_commis',
      title: 'Commis pharmacie',
      emoji: '💊',
      reward: 55,
      durationMs: 8000,
      cooldownMs: 70000,
    },
  },
  {
    id: 'garage',
    name: 'GARAGE PORTNEUF AUTO',
    pos: [-24, 0, -845],
    size: [12, 6, 10],
    wallColor: '#4a4a4a',
    roofColor: '#2a2a2a',
    signColor: '#cc6600',
    signTextColor: '#ffffff',
    doorSide: 'left',
    job: {
      id: 'garage_mecanicien',
      title: 'Mécanicien(ne)',
      emoji: '🔧',
      reward: 95,
      durationMs: 12000,
      cooldownMs: 100000,
    },
  },
]

export default BUILDINGS

// ── Génère les zones de portes pour le Walker ──
export function getBuildingDoors(): DoorZone[] {
  return BUILDINGS.map(b => {
    const [bx, , bz] = b.pos
    const [w] = b.size
    const doorX = b.doorSide === 'right' ? bx - w / 2 - 1 : bx + w / 2 + 1
    return {
      id: b.id,
      name: b.name,
      pos: [doorX, 0.5, bz] as [number, number, number],
      hasInterior: b.hasInterior ?? false,
      interiorId: b.interiorId,
      job: b.job,
    }
  })
}

export type { BuildingDef }