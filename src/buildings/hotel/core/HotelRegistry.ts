/**
 * src/buildings/hotel/core/HotelRegistry.ts
 * Emplacement exact: /home/user/etherworld/src/buildings/hotel/core/HotelRegistry.ts
 *
 * Central registry for the HÔTEL.
 * Generates exactly:
 * - 3 floors (level 0, 1, 2)
 * - 10 rooms per floor = 30 rooms total
 * - 5 rooms on the LEFT side of the central corridor
 * - 5 rooms on the RIGHT side of the central corridor
 * All IDs are stable and deterministic (no random generation for identification).
 */

import type { BuildingBase, FloorBase, RoomBase, DoorBase, LockBase } from '../../shared/types';

export const HOTEL_BUILDING: BuildingBase = {
  id: 'hotel_main_2026',
  type: 'hotel',
  name: 'Hôtel EtherWorld',
  architectural: {
    width: 48,
    depth: 22,
    height: 12,
    wallThickness: 0.25,
    floorThickness: 0.35,
    corridorWidth: 3.8,
  },
  createdAt: Date.now(),
  status: 'active',
};

// 3 floors
export const HOTEL_FLOORS: FloorBase[] = [0, 1, 2].map((level) => ({
  id: `hotel_main_f${String(level).padStart(2, '0')}`,
  buildingId: HOTEL_BUILDING.id,
  level,
  name: level === 0 ? 'Rez-de-chaussée' : `Étage ${level}`,
  architectural: {
    width: HOTEL_BUILDING.architectural.width,
    depth: HOTEL_BUILDING.architectural.depth,
    corridorWidth: HOTEL_BUILDING.architectural.corridorWidth,
  },
}));

/**
 * Generates exactly 30 rooms:
 * - Floors 0,1,2 → rooms 101-110, 201-210, 301-310
 * - Left side: 101-105 / 201-205 / 301-305 (5 per floor)
 * - Right side: 106-110 / 206-210 / 306-310 (5 per floor)
 */
export function generateHotelRooms(): RoomBase[] {
  const rooms: RoomBase[] = [];

  HOTEL_FLOORS.forEach((floor) => {
    const floorNum = floor.level;

    // LEFT side — 5 rooms
    for (let i = 1; i <= 5; i++) {
      const roomNum = 100 * (floorNum + 1) + i;
      rooms.push({
        id: `hotel_main_f${String(floorNum).padStart(2, '0')}_r${roomNum}`,
        floorId: floor.id,
        buildingId: HOTEL_BUILDING.id,
        number: String(roomNum),
        side: 'left',
        architectural: { width: 5.2, depth: 6.8, height: 3.1 },
        decorative: { wallColor: '#e8e0d5', floorMaterial: 'carpet_beige' },
      });
    }

    // RIGHT side — 5 rooms
    for (let i = 6; i <= 10; i++) {
      const roomNum = 100 * (floorNum + 1) + i;
      rooms.push({
        id: `hotel_main_f${String(floorNum).padStart(2, '0')}_r${roomNum}`,
        floorId: floor.id,
        buildingId: HOTEL_BUILDING.id,
        number: String(roomNum),
        side: 'right',
        architectural: { width: 5.2, depth: 6.8, height: 3.1 },
        decorative: { wallColor: '#e8e0d5', floorMaterial: 'carpet_beige' },
      });
    }
  });

  return rooms;
}

export const HOTEL_ROOMS: RoomBase[] = generateHotelRooms(); // Exactly 30 rooms

/**
 * Generates one main door + one connected lock per room.
 */
export function generateHotelDoorsAndLocks(): { doors: DoorBase[]; locks: LockBase[] } {
  const doors: DoorBase[] = [];
  const locks: LockBase[] = [];

  HOTEL_ROOMS.forEach((room) => {
    const doorId = `${room.id}_door_main`;
    const lockId = `lock_${room.id}_main`;

    doors.push({
      id: doorId,
      roomId: room.id,
      buildingId: HOTEL_BUILDING.id,
      type: 'main',
      lockId,
      position: { x: 0, y: 0, z: 0, rotationY: 0 }, // position calculated later by modules
    });

    locks.push({
      id: lockId,
      doorId,
      buildingId: HOTEL_BUILDING.id,
      type: 'connected', // keycard + keypad + future real hardware
      status: 'active',
    });
  });

  return { doors, locks };
}

export const { doors: HOTEL_DOORS, locks: HOTEL_LOCKS } = generateHotelDoorsAndLocks();

export function getHotelRoomById(id: string): RoomBase | undefined {
  return HOTEL_ROOMS.find((r) => r.id === id);
}

export function getHotelFloorByLevel(level: number): FloorBase | undefined {
  return HOTEL_FLOORS.find((f) => f.level === level);
}

export const TOTAL_HOTEL_ROOMS = HOTEL_ROOMS.length; // 30
