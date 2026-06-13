// ═══════════════════════════════════════════════════════════════
// BÂTIMENTS DU QUÉBEC — EtherWorld QC RP
// ═══════════════════════════════════════════════════════════════

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
  size: [number, number, number]
  wallColor: string
  wallColor2?: string
  roofColor: string
  signColor: string
  signTextColor?: string
  doorSide: 'left' | 'right' | 'front' | 'back'
  hasInterior?: boolean
  interiorId?: string
  job?: JobDef
}

export interface DoorZone {
  id: string
  name: string
  pos: [number, number, number]
  hasInterior: boolean
  interiorId?: string
  job?: JobDef
}

// Bâtiments interactifs (liés aux villes de la Route 138)
const BUILDINGS: BuildingDef[] = [
  // Québec (1300, 0) — CHÂTEAU FRONTENAC
  {
    id: 'hotel',
    name: 'CHÂTEAU FRONTENAC (QUÉBEC)',
    pos: [1300, 0, -20],
    size: [16, 20, 12],
    wallColor: '#2a3a5c',
    roofColor: '#0f1419',
    signColor: '#1e3a7a',
    doorSide: 'front',
    hasInterior: true,
    interiorId: 'hotel',
    job: { id: 'hotel_reception', title: 'Réceptionniste', emoji: '🏨', reward: 85, durationMs: 10000, cooldownMs: 90000 }
  },

  // Trois-Rivières (-1300, 0) — RESTAURANT
  {
    id: 'restaurant',
    name: 'RESTAURANT (TROIS-RIVIÈRES)',
    pos: [-1300, 0, 20],
    size: [10, 5, 9],
    wallColor: '#c8b87a',
    roofColor: '#6a3010',
    signColor: '#d4501a',
    doorSide: 'front',
    hasInterior: true,
    interiorId: 'restaurant',
    job: { id: 'restaurant_serveur', title: 'Serveur/Serveuse', emoji: '🍽️', reward: 60, durationMs: 9000, cooldownMs: 75000 }
  },

  // Portneuf (0, 0) — GARAGE
  {
    id: 'garage',
    name: 'GARAGE PORTNEUF AUTO',
    pos: [0, 0, 20],
    size: [12, 6, 10],
    wallColor: '#4a4a4a',
    roofColor: '#2a2a2a',
    signColor: '#cc6600',
    doorSide: 'front',
    job: { id: 'garage_mecanicien', title: 'Mécanicien(ne)', emoji: '🔧', reward: 95, durationMs: 12000, cooldownMs: 100000 }
  },

  // Donnacona (600, 0) — POSTE DE POLICE SQ
  {
    id: 'police',
    name: 'SQ — POSTE DONNACONA',
    pos: [600, 0, -20],
    size: [11, 6, 10],
    wallColor: '#3a4a68',
    roofColor: '#0a1220',
    signColor: '#2255cc',
    doorSide: 'front',
    hasInterior: true,
    interiorId: 'police',
    job: { id: 'police_patrouille', title: 'Agent(e) patrouille', emoji: '👮', reward: 120, durationMs: 14000, cooldownMs: 120000 }
  },

  // Saint-Raymond (400, -800) — CAMPING
  {
    id: 'camping',
    name: 'CAMPING NATURE (ST-RAYMOND)',
    pos: [400, 0, -780],
    size: [8, 4, 6],
    wallColor: '#8fbc8f',
    roofColor: '#006400',
    signColor: '#006400',
    doorSide: 'front',
    job: { id: 'camping_gardien', title: 'Gardien(ne) de Camping', emoji: '🏕️', reward: 70, durationMs: 10000, cooldownMs: 80000 }
  },

  // Saint-Marc-des-Carrières (-200, -300) — SCIERIE
  {
    id: 'scierie',
    name: 'SCIERIE (ST-MARC)',
    pos: [-200, 0, -280],
    size: [15, 8, 12],
    wallColor: '#5c4033',
    roofColor: '#2f4f4f',
    signColor: '#8b4513',
    doorSide: 'front',
    job: { id: 'scierie_bucheron', title: 'Bûcheron(ne)', emoji: '🪓', reward: 150, durationMs: 15000, cooldownMs: 150000 }
  },

  // Saint-Alban (-100, -700) — FERME LAITIÈRE
  {
    id: 'ferme',
    name: 'FERME LAITIÈRE (ST-ALBAN)',
    pos: [-100, 0, -680],
    size: [14, 7, 14],
    wallColor: '#8b0000',
    roofColor: '#1a1a1a',
    signColor: '#8b0000',
    doorSide: 'front',
    job: { id: 'ferme_agriculteur', title: 'Ouvrier Agricole', emoji: '🐄', reward: 110, durationMs: 12000, cooldownMs: 120000 }
  },

  // Saint-Ubalde (-700, -800) — MARCHÉ
  {
    id: 'epicerie_rang',
    name: 'MARCHÉ (ST-UBALDE)',
    pos: [-700, 0, -820],
    size: [9, 5, 8],
    wallColor: '#cd853f',
    roofColor: '#8b0000',
    signColor: '#cd853f',
    doorSide: 'front',
    job: { id: 'marche_commis', title: "Commis d'épicerie", emoji: '🥖', reward: 50, durationMs: 8000, cooldownMs: 70000 }
  },

  // Batiscan (-1000, 0) — DÉPANNEUR
  {
    id: 'depanneur',
    name: 'DÉPANNEUR (BATISCAN)',
    pos: [-1000, 0, 15],
    size: [8, 5, 6],
    wallColor: '#d8d0c3',
    roofColor: '#cc0000',
    signColor: '#cc0000',
    doorSide: 'front',
    hasInterior: true,
    interiorId: 'depanneur',
    job: { id: 'depanneur_caissier', title: 'Caissier(ère)', emoji: '🛒', reward: 45, durationMs: 7000, cooldownMs: 60000 }
  },

  // EtherWorld City (800+, 0) — TOUR ETHERWORLD
  {
    id: 'etherworld_tower',
    name: 'TOUR ETHERWORLD — SIÈGE SOCIAL',
    pos: [850, 0, 0],
    size: [20, 40, 20],
    wallColor: '#0a1628',
    wallColor2: '#001a33',
    roofColor: '#00d4ff',
    signColor: '#00d4ff',
    signTextColor: '#08080e',
    doorSide: 'front',
    hasInterior: true,
    interiorId: 'etherworld_lobby',
    job: { id: 'etherworld_admin', title: 'Administrateur Système', emoji: '⚡', reward: 500, durationMs: 20000, cooldownMs: 300000 }
  },

  // Hôtel Ultra-Luxe (EtherWorld City)
  {
    id: 'hotel_ultra',
    name: 'HÔTEL ETHER — ULTRA LUXE',
    pos: [900, 0, -30],
    size: [18, 25, 15],
    wallColor: '#1a0a2e',
    wallColor2: '#0f051a',
    roofColor: '#b84dff',
    signColor: '#b84dff',
    signTextColor: '#08080e',
    doorSide: 'front',
    hasInterior: true,
    interiorId: 'hotel_ultra',
    job: { id: 'hotel_ultra_concierge', title: 'Concierge de Luxe', emoji: '💎', reward: 200, durationMs: 15000, cooldownMs: 180000 }
  },

  // Casinò EtherWorld
  {
    id: 'casino',
    name: 'CASINO ETHERWORLD — ROYALE',
    pos: [950, 0, 30],
    size: [22, 12, 18],
    wallColor: '#1a001a',
    wallColor2: '#0d001a',
    roofColor: '#ffd700',
    signColor: '#ffd700',
    signTextColor: '#08080e',
    doorSide: 'front',
    hasInterior: true,
    interiorId: 'casino',
    job: { id: 'casino_croupier', title: 'Croupier(ère) VIP', emoji: '🎰', reward: 300, durationMs: 18000, cooldownMs: 240000 }
  },
]

export default BUILDINGS

export function getBuildingDoors(): DoorZone[] {
  return BUILDINGS.map(b => {
    const [bx, , bz] = b.pos
    const [w, , d] = b.size
    let doorX = bx
    let doorZ = bz

    if (b.doorSide === 'front') doorZ = bz + d / 2 + 1
    if (b.doorSide === 'back') doorZ = bz - d / 2 - 1
    if (b.doorSide === 'left') doorX = bx - w / 2 - 1
    if (b.doorSide === 'right') doorX = bx + w / 2 + 1

    return {
      id: b.id,
      name: b.name,
      pos: [doorX, 0.5, doorZ] as [number, number, number],
      hasInterior: b.hasInterior ?? false,
      interiorId: b.interiorId,
      job: b.job,
    }
  })
}

export function getBuildingById(id: string): BuildingDef | undefined {
  return BUILDINGS.find(b => b.id === id)
}

export function getAllBuildings(): BuildingDef[] {
  return BUILDINGS
}