/**
 * PoolSystem.tsx
 * Piscine intérieure + spa — eau animée, chaises longues, jacuzzi
 */

import { useRef, useMemo, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─────────────────────────────────────────────
// ANIMATED WATER
// ─────────────────────────────────────────────

const WaterSurface = memo(function WaterSurface({
  size, position,
}: {
  size: [number, number]
  position: [number, number, number]
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.MeshPhysicalMaterial
    // Simuler l'ondulation de l'eau avec la couleur
    const t = state.clock.elapsedTime
    mat.color.setRGB(
      0.1 + Math.sin(t * 0.5) * 0.02,
      0.4 + Math.sin(t * 0.3 + 1) * 0.05,
      0.7 + Math.cos(t * 0.4) * 0.05,
    )
  })

  return (
    <mesh ref={meshRef} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[...size, 16, 16]} />
      <meshPhysicalMaterial
        color="#1a6088"
        transmission={0.3}
        thickness={2}
        roughness={0.05}
        metalness={0}
        ior={1.33}
        transparent
        opacity={0.85}
      />
    </mesh>
  )
})

// ─────────────────────────────────────────────
// LOUNGE CHAIR
// ─────────────────────────────────────────────

const LoungeChair = memo(function LoungeChair({
  position,
  rotation = 0,
}: {
  position: [number, number, number]
  rotation?: number
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Assise */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <boxGeometry args={[0.65, 0.08, 1.8]} />
        <meshStandardMaterial color="#f5e6c8" roughness={0.7} />
      </mesh>
      {/* Dossier incliné */}
      <mesh position={[0, 0.38, 0.7]} rotation={[-0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.63, 0.08, 0.7]} />
        <meshStandardMaterial color="#f5e6c8" roughness={0.7} />
      </mesh>
      {/* Pieds */}
      {[[-0.28, -0.55], [0.28, -0.55], [-0.28, 0.55], [0.28, 0.55]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.07, z]}>
          <boxGeometry args={[0.04, 0.14, 0.04]} />
          <meshStandardMaterial color="#888888" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      {/* Serviette */}
      <mesh position={[0, 0.22, 0.1]} rotation={[0.05, 0, 0]}>
        <boxGeometry args={[0.5, 0.015, 1.0]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>
    </group>
  )
})

// ─────────────────────────────────────────────
// POOL SYSTEM
// ─────────────────────────────────────────────

export const PoolSystem = memo(function PoolSystem() {
  const bubbleRefs = useRef<THREE.Mesh[]>([])

  useFrame((state) => {
    bubbleRefs.current.forEach((mesh, i) => {
      if (mesh) {
        mesh.position.y = -0.3 + ((state.clock.elapsedTime * 0.5 + i * 0.4) % 1) * 0.8
        mesh.material.opacity = 0.3 - ((state.clock.elapsedTime * 0.5 + i * 0.4) % 1) * 0.3
      }
    })
  })

  return (
    <group>
      {/* ══ PISCINE PRINCIPALE ══ */}

      {/* Structure piscine */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[12, 1.5, 8]} />
        <meshStandardMaterial color="#e8e8f0" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Carreaux bleus intérieur */}
      <mesh position={[0, -0.7, 0]}>
        <boxGeometry args={[11.8, 1.1, 7.8]} />
        <meshStandardMaterial color="#4488bb" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Eau piscine */}
      <WaterSurface size={[11.5, 7.5]} position={[0, 0, 0]} />

      {/* Reflet lumineux sur l'eau */}
      <pointLight position={[0, 2, 0]} intensity={0.8} color="#44aaff" distance={10} decay={2} />

      {/* Bordure piscine — carreaux blancs */}
      {/* Autour de la piscine */}
      <mesh position={[0, 0.05, 4.1]}>
        <boxGeometry args={[12, 0.12, 0.3]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.05, -4.1]}>
        <boxGeometry args={[12, 0.12, 0.3]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[6.1, 0.05, 0]}>
        <boxGeometry args={[0.3, 0.12, 8.6]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[-6.1, 0.05, 0]}>
        <boxGeometry args={[0.3, 0.12, 8.6]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Échelle piscine */}
      <group position={[5.9, 0, 3]}>
        {[-0.15, 0.15].map((x, i) => (
          <mesh key={i} position={[x, -0.5, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 1.2, 6]} />
            <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
        {Array.from({ length: 4 }).map((_, i) => (
          <mesh key={i} position={[0, -i * 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.015, 0.015, 0.3, 6]} />
            <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* Lane dividers */}
      {[-2, 0, 2].map((x, i) => (
        <mesh key={i} position={[x, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.05, 7.5]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#ff6600' : '#0066ff'} roughness={0.8} />
        </mesh>
      ))}

      {/* ══ JACUZZI ══ */}
      <group position={[10, 0, 0]}>
        {/* Structure */}
        <mesh>
          <cylinderGeometry args={[2, 2.2, 0.9, 16]} />
          <meshStandardMaterial color="#e8e4d8" roughness={0.4} metalness={0.1} />
        </mesh>
        {/* Eau jacuzzi */}
        <WaterSurface size={[3.8, 3.8]} position={[0, 0.45, 0]} />
        {/* Jets — bulles */}
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh
            key={i}
            ref={el => { if (el) bubbleRefs.current[i] = el }}
            position={[
              Math.cos(i * Math.PI / 3) * 1.2,
              -0.3,
              Math.sin(i * Math.PI / 3) * 1.2,
            ]}
          >
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshStandardMaterial
              color="#ffffff"
              transparent
              opacity={0.3}
            />
          </mesh>
        ))}
        <pointLight position={[0, -0.2, 0]} intensity={0.4} color="#66ccff" distance={3} decay={2} />
      </group>

      {/* ══ SAUNA ══ */}
      <group position={[-10, 0, 6]}>
        {/* Cabine */}
        <mesh castShadow>
          <boxGeometry args={[3, 2.5, 3]} />
          <meshStandardMaterial color="#8b5e3c" roughness={0.7} metalness={0.1} />
        </mesh>
        {/* Porte vitrée */}
        <mesh position={[0, 0, 1.52]}>
          <boxGeometry args={[0.8, 2.0, 0.04]} />
          <meshPhysicalMaterial color="#88bbcc" transmission={0.6} thickness={0.04} roughness={0.1} transparent opacity={0.7} />
        </mesh>
        {/* Bancs */}
        <mesh position={[0, 0.5, -1.2]}>
          <boxGeometry args={[2.8, 0.08, 0.5]} />
          <meshStandardMaterial color="#6b4423" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.9, -1.0]}>
          <boxGeometry args={[2.8, 0.08, 0.5]} />
          <meshStandardMaterial color="#6b4423" roughness={0.8} />
        </mesh>
        {/* Poêle sauna */}
        <mesh position={[0, 0.3, -1.3]}>
          <boxGeometry args={[0.4, 0.6, 0.35]} />
          <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Pierres */}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={i} position={[-0.1 + (i % 3) * 0.12, 0.62, -1.28]}>
            <sphereGeometry args={[0.04 + Math.random() * 0.02, 5, 5]} />
            <meshStandardMaterial color="#555555" roughness={0.9} />
          </mesh>
        ))}
        <pointLight position={[0, 0.8, 0]} intensity={0.4} color="#ff8844" distance={3} decay={2} />
      </group>

      {/* ══ SOL AUTOUR PISCINE ══ */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial color="#d8d4cc" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* ══ CHAISES LONGUES ══ */}
      {[
        [0, 0.12, 5.5],
        [2, 0.12, 5.5],
        [4, 0.12, 5.5],
        [-2, 0.12, 5.5],
        [-4, 0.12, 5.5],
        [0, 0.12, -5.5],
        [2, 0.12, -5.5],
        [-2, 0.12, -5.5],
      ].map(([x, y, z], i) => (
        <LoungeChair
          key={i}
          position={[x, y, z]}
          rotation={z > 0 ? 0 : Math.PI}
        />
      ))}

      {/* Parasols */}
      {[[0, 0, 5.5], [3, 0, 5.5], [-3, 0, 5.5]].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 2.4, 6]} />
            <meshStandardMaterial color="#888888" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, 2.3, 0]} rotation={[0.1, i * 0.5, 0]}>
            <coneGeometry args={[1.0, 0.3, 12, 1, true]} />
            <meshStandardMaterial color={['#cc4422', '#2244cc', '#228844'][i]} roughness={0.7} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}

      {/* ══ ÉCLAIRAGE PISCINE ══ */}
      <ambientLight intensity={0.5} color="#88ccff" />
      <pointLight position={[-8, 5, 0]} intensity={1.5} color="#ffffff" distance={15} decay={2} castShadow shadow-mapSize={[512, 512]} />
      <pointLight position={[8, 5, 0]} intensity={1.5} color="#ffffff" distance={15} decay={2} />
    </group>
  )
})