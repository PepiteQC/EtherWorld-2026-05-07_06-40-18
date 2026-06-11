/**
 * src/buildings/hotel/modules/room/HotelRoomModule.tsx
 * 
 * Reusable, modular 3D room for Hôtel.
 * 
 * - Architectural structure only (walls, floor, ceiling, door frame)
 * - Decorative visual only (colors, simple trim)
 * - Door + safe placeholders (safe in every room)
 * - Stable ID passed via userData for raycast / interaction / access
 * - NEVER codes a full room in a giant component
 * 
 * Anti-casse:
 * - Purely reusable module
 * - Architectural dimensions from registry (not hardcoded here)
 * - No direct lock commands
 * - Decorative params separate
 */

import { memo } from 'react';
import * as THREE from 'three';
import type { RoomBase, DoorBase } from '../../../shared/types';

interface HotelRoomModuleProps {
  room: RoomBase;
  door?: DoorBase;
  position?: [number, number, number]; // world or parent-relative
  onDoorClick?: (roomId: string) => void;
}

export const HotelRoomModule = memo(function HotelRoomModule({
  room,
  door,
  position = [0, 0, 0],
  onDoorClick,
}: HotelRoomModuleProps) {
  const { architectural, id, side, hasSafe } = room;

  const roomW = architectural.roomWidth;
  const roomD = architectural.roomDepth;
  const roomH = architectural.height;

  const isLeft = side === 'left';

  // Wall material (architectural + light decorative)
  const wallMat = new THREE.MeshStandardMaterial({
    color: '#3a2a22',
    roughness: 0.82,
    metalness: 0.05,
  });
  const floorMat = new THREE.MeshStandardMaterial({
    color: '#c8c0b4',
    roughness: 0.7,
  });
  const ceilingMat = new THREE.MeshStandardMaterial({
    color: '#1e2024',
    roughness: 0.9,
  });

  const doorFrameMat = new THREE.MeshStandardMaterial({
    color: '#2a2520',
    roughness: 0.6,
    metalness: 0.1,
  });

  const safeMat = new THREE.MeshStandardMaterial({
    color: '#444444',
    roughness: 0.4,
    metalness: 0.6,
  });

  const handleDoorClick = () => {
    if (onDoorClick) onDoorClick(id);
  };

  return (
    <group position={position} userData={{ roomId: id, buildingId: 'hotel_main', type: 'hotel_room' }}>
      {/* Floor (architectural) */}
      <mesh
        position={[0, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[roomW, roomD]} />
        <primitive object={floorMat} attach="material" />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, roomH, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomW, roomD]} />
        <primitive object={ceilingMat} attach="material" />
      </mesh>

      {/* Back wall (corridor side for left rooms, opposite for right) */}
      <mesh
        position={[isLeft ? -roomW / 2 + 0.01 : roomW / 2 - 0.01, roomH / 2, 0]}
        rotation={[0, isLeft ? Math.PI / 2 : -Math.PI / 2, 0]}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[roomD, roomH]} />
        <primitive object={wallMat} attach="material" />
      </mesh>

      {/* Side walls */}
      <mesh position={[0, roomH / 2, -roomD / 2 + 0.01]} castShadow receiveShadow>
        <planeGeometry args={[roomW, roomH]} />
        <primitive object={wallMat} attach="material" />
      </mesh>
      <mesh position={[0, roomH / 2, roomD / 2 - 0.01]} castShadow receiveShadow>
        <planeGeometry args={[roomW, roomH]} />
        <primitive object={wallMat} attach="material" />
      </mesh>

      {/* Door frame (architectural opening) */}
      {door && (
        <group
          position={[
            isLeft ? -roomW / 2 + 0.02 : roomW / 2 - 0.02,
            door.architectural.doorHeight / 2,
            door.position[2],
          ]}
          rotation={[0, door.rotationY, 0]}
          onClick={handleDoorClick}
          userData={{ doorId: door.id, lockId: door.lockId, type: 'hotel_door' }}
        >
          {/* Simple frame */}
          <mesh>
            <boxGeometry args={[0.12, door.architectural.doorHeight + 0.1, door.architectural.doorWidth + 0.1]} />
            <primitive object={doorFrameMat} attach="material" />
          </mesh>

          {/* Door leaf (visual only for now — animated in future connector) */}
          <mesh
            position={[0, 0, 0]}
            onClick={handleDoorClick}
            userData={{ interactive: true, roomId: id }}
          >
            <boxGeometry args={[0.08, door.architectural.doorHeight, door.architectural.doorWidth]} />
            <meshStandardMaterial color="#3a2a22" roughness={0.7} />
          </mesh>
        </group>
      )}

      {/* Safe (every room) — anchored, no code in client for opening yet */}
      {hasSafe && (
        <group
          position={[roomW * 0.28, 0.9, roomD * 0.32]}
          userData={{ safeId: `${id}_s01`, roomId: id, type: 'hotel_safe' }}
        >
          <mesh castShadow>
            <boxGeometry args={[0.55, 0.55, 0.45]} />
            <primitive object={safeMat} attach="material" />
          </mesh>
          {/* Simple digital keypad visual (no real input) */}
          <mesh position={[0.29, 0.15, 0.23]}>
            <boxGeometry args={[0.08, 0.18, 0.02]} />
            <meshStandardMaterial color="#111111" emissive="#112211" emissiveIntensity={0.1} />
          </mesh>
        </group>
      )}

      {/* Basic bed placeholder (decorative only) */}
      <group position={[0, 0.45, -roomD * 0.18]}>
        <mesh castShadow>
          <boxGeometry args={[1.8, 0.6, 2.4]} />
          <meshStandardMaterial color="#2a2520" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[1.7, 0.25, 2.2]} />
          <meshStandardMaterial color="#4a3a30" roughness={0.9} />
        </mesh>
      </group>

      {/* Simple window (decorative) on outer wall */}
      <mesh position={[0, roomH / 2 + 0.3, roomD / 2 - 0.02]} castShadow>
        <boxGeometry args={[2.2, 1.4, 0.04]} />
        <meshStandardMaterial color="#1a2535" metalness={0.6} roughness={0.2} transparent opacity={0.75} />
      </mesh>
    </group>
  );
});
