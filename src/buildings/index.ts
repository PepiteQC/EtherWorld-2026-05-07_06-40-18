/**
 * src/buildings/index.ts
 * 
 * Barrel export for the new modular buildings architecture.
 * 
 * Everything is feature-flag gated at usage site (BuildingsScene).
 * No side effects on import.
 */

export * from './shared/featureFlags';
export * from './shared/types';

export { HotelRegistry, HOTEL_BUILDING, HOTEL_FLOORS, HOTEL_ROOMS, HOTEL_DOORS, HOTEL_LOCKS } from './hotel/core/HotelRegistry';
export { HotelScene } from './hotel/scenes/HotelScene';
export { HotelFloorModule } from './hotel/modules/floor/HotelFloorModule';
export { HotelRoomModule } from './hotel/modules/room/HotelRoomModule';

export { DepanneurRegistry, DEPANNEUR_BUILDING } from './depanneur/core/DepanneurRegistry';
export { DepanneurScene } from './depanneur/scenes/DepanneurScene';

export { BuildingsScene } from './BuildingsScene';
