/**
 * src/buildings/depanneur/core/DepanneurRegistry.ts
 * 
 * Completely independent Dépanneur (Couche-Tard style).
 * 
 * Per Plan directeur:
 * - Separate building with own foundations, structure, electrical, mechanical
 * - Independent entrance, parking, delivery, waste, security
 * - Visual/pedestrian connection ONLY — zero functional dependency on hôtel
 * - Can be modified or rebuilt without touching hôtel
 * 
 * Anti-casse:
 * - Separate origin
 * - Separate IDs (depanneur_couche_tard_*)
 * - No shared collections/logic with hôtel
 * - No code in giant component
 */

import type { BuildingBase, BuildingId } from '../../shared/types';

export const DEPANNEUR_BUILDING: BuildingBase = {
  id: 'depanneur_couche_tard',
  name: 'Dépanneur Couche-Tard',
  origin: [80, 0, -60], // positioned far enough for visual connection only (as in prior modular start)
  architectural: {
    width: 16,
    depth: 14,
    height: 5.8,
    wallThickness: 0.15,
    doorWidth: 1.8,
    doorHeight: 2.4,
    corridorWidth: 0, // no corridor — open retail floor
    roomWidth: 0,
    roomDepth: 0,
  },
  decorative: {
    wallColor: '#e8e2d8',
    floorColor: '#e2ddd4',
    trimColor: '#cc0000',
    materialRoughness: 0.6,
  },
};

// Independent zones (for future access control — separate from hotel)
export const DEPANNEUR_ZONES = {
  customerEntrance: { id: 'depanneur_entrance', position: [0, 0, 7] as [number, number, number] },
  delivery: { id: 'depanneur_delivery', position: [0, 0, -8] as [number, number, number] },
  waste: { id: 'depanneur_waste', position: [7, 0, -6] as [number, number, number] },
  parking: { id: 'depanneur_parking', position: [0, 0, 12] as [number, number, number] },
  staffOnly: { id: 'depanneur_staff', position: [5, 0, 4] as [number, number, number] },
};

// No rooms (retail open plan). Future: could add "zones" for security.
export const DEPANNEUR_HAS_ROOMS = false;

// For consistency with hotel registry API (empty but present)
export const DEPANNEUR_ROOMS: never[] = [];
export const DEPANNEUR_DOORS: never[] = [];
export const DEPANNEUR_LOCKS: never[] = [];

export function getDepanneurBuilding(): BuildingBase {
  return DEPANNEUR_BUILDING;
}
