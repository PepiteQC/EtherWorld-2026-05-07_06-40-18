/**
 * src/buildings/depanneur/scenes/DepanneurScene.tsx
 * 
 * Completely independent Dépanneur scene.
 * 
 * - Own origin, structure, parking, entrance, delivery, waste
 * - No functional dependency on hôtel (visual/pedestrian connection only)
 * - Reuses some visual patterns but zero shared state/logic/IDs
 * 
 * Anti-casse:
 * - Separate building
 * - Can be moved/replaced without touching hôtel
 * - No rooms (retail open plan per plan)
 */

import { memo } from 'react';
import { DEPANNEUR_BUILDING, DEPANNEUR_ZONES } from '../core/DepanneurRegistry';

interface DepanneurSceneProps {
  onEnter?: () => void;
}

export const DepanneurScene = memo(function DepanneurScene({ onEnter }: DepanneurSceneProps) {
  const { origin, architectural } = DEPANNEUR_BUILDING;

  return (
    <group position={origin} userData={{ buildingId: 'depanneur_couche_tard', type: 'depanneur_building' }}>
      {/* Independent foundation */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[architectural.width + 4, 0.3, architectural.depth + 4]} />
        <meshStandardMaterial color="#2a2a2e" roughness={0.9} />
      </mesh>

      {/* Main store volume (open retail) */}
      <mesh position={[0, architectural.height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[architectural.width, architectural.height, architectural.depth]} />
        <meshStandardMaterial color="#e8e2d8" roughness={0.6} />
      </mesh>

      {/* Independent customer entrance (visual + future interaction) */}
      <group position={DEPANNEUR_ZONES.customerEntrance.position}>
        <mesh position={[0, 1.6, 0.1]} castShadow>
          <boxGeometry args={[3.2, 3.2, 0.12]} />
          <meshStandardMaterial color="#555566" metalness={0.5} />
        </mesh>
        {/* Glass door area */}
        <mesh position={[0, 1.6, 0.2]} onClick={onEnter}>
          <boxGeometry args={[2.4, 2.8, 0.06]} />
          <meshPhysicalMaterial
            color="#a8d8ff"
            transmission={0.85}
            thickness={0.03}
            roughness={0.05}
            transparent
            opacity={0.9}
          />
        </mesh>
      </group>

      {/* Independent parking (separate from hotel) */}
      <group position={DEPANNEUR_ZONES.parking.position}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
          <planeGeometry args={[20, 12]} />
          <meshStandardMaterial color="#2a2a2e" roughness={0.9} />
        </mesh>
        {/* Parking lines */}
        {[-6, -2, 2, 6].map((x, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.015, 0]}>
            <planeGeometry args={[0.08, 8]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.5} />
          </mesh>
        ))}
      </group>

      {/* Delivery / waste (independent, away from hotel) */}
      <group position={DEPANNEUR_ZONES.waste.position}>
        <mesh castShadow>
          <boxGeometry args={[1.8, 1.2, 1.2]} />
          <meshStandardMaterial color="#333333" roughness={0.7} />
        </mesh>
      </group>

      {/* Simple signage (Couche-Tard style, independent) */}
      <group position={[0, 7.5, -3]}>
        <mesh castShadow>
          <boxGeometry args={[4, 1.6, 0.2]} />
          <meshStandardMaterial color="#cc0000" emissive="#cc0000" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.12]}>
          <boxGeometry args={[3.8, 1.4, 0.01]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.1} />
        </mesh>
      </group>

      {/* Independent exterior lights */}
      <pointLight position={[-6, 5, 8]} intensity={0.6} color="#fff8e0" distance={18} decay={2} />
      <pointLight position={[6, 5, 8]} intensity={0.6} color="#fff8e0" distance={18} decay={2} />
    </group>
  );
});
