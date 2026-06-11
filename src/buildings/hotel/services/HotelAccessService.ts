/**
 * src/buildings/hotel/services/HotelAccessService.ts
 * 
 * Hotel-specific access service.
 * 
 * Uses LockSimulator exclusively while ACCESS_SIMULATOR_ONLY = true.
 * 
 * Anti-casse:
 * - Never calls real hardware from browser.
 * - Immutable journal via simulator.
 * - Separate from dépanneur.
 * - Future: will proxy to Cloud Function when real locks enabled.
 */

import { isAccessSimulatorOnly } from '../../shared/featureFlags';
import { lockSimulator, type LockAttemptOptions, type LockAttemptResult } from '../../../systems/access-control/simulator/LockSimulator';
import type { RoomId, DoorId } from '../../shared/types';

export interface HotelAccessRequest {
  roomId: RoomId;
  doorId: DoorId;
  method: 'keycard' | 'keypad' | 'connected_app';
  actorId?: string;
  code?: string; // simulation only
}

export interface HotelAccessResponse {
  granted: boolean;
  result: string;
  message: string;
  logId: string;
}

/**
 * attemptRoomAccess — the safe, simulator-first entry point for hotel rooms.
 * Call this from InteractionSystem, UI, or E-key handlers.
 */
export async function attemptRoomAccess(req: HotelAccessRequest): Promise<HotelAccessResponse> {
  if (!isAccessSimulatorOnly()) {
    // Future real path will be here (Cloud Function call only)
    console.warn('[HotelAccessService] Real hardware path not yet enabled (anti-casse). Falling back to simulator.');
  }

  const opts: LockAttemptOptions = {
    doorId: req.doorId,
    lockId: `${req.doorId}_l01`, // convention from registry
    method: req.method,
    actorId: req.actorId,
    providedCode: req.code,
  };

  const simResult: LockAttemptResult = await lockSimulator.attemptAccess(opts);

  return {
    granted: simResult.success,
    result: simResult.result,
    message: simResult.message,
    logId: simResult.log.id,
  };
}

// Convenience for E-interaction on a room door
export async function attemptRoomEntry(roomId: RoomId, actorId?: string): Promise<HotelAccessResponse> {
  // In real system we would look up the doorId from registry or Firestore
  const doorId = `${roomId}_d01` as DoorId;

  return attemptRoomAccess({
    roomId,
    doorId,
    method: 'connected_app', // default for player E
    actorId,
  });
}
