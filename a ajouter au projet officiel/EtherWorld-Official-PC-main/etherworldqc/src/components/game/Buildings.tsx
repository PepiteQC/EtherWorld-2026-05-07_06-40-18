import { useMemo } from "react";
import { VILLAGES_138 } from "./Road";

// ═══════════════════════════════════════════════════════
// BÂTIMENTS — placés sur les vrais Z des villages
// Tous les villages utilisent VILLAGES_138 comme ancre
// ═══════════════════════════════════════════════════════

const WALL_COLORS = [
  "#d4c8b0", "#c8bea8", "#e8dfd0",
  "#bab2a0", "#d8ccc0", "#c0b8a8",
];
const ROOF_COLORS = [
  "#8a3a2a", "#6a2a1a", "#4a3828",
  "#7a4030", "#5a3020", "#3a2818",
];

// Bâtiments spécifiques par village
// x = décalage gauche/droite par rapport à la route
// z = décalage avant/arrière par rapport au centre du village
// Positif X = côté champs (droite vers TR)
// Négatif X = côté fleuve (gauche vers TR)

const VILLAGE_DEFS: Record<string, {
  x: number; z: number
  w: number; h: number; d: number
  wall: string; roof: string
  isChurch?: boolean
  isPolice?: boolean
  isGarage?: boolean
  isDepanneur?: boolean
}[]> = {

  neuville: [
    { x: -15, z:   0, w:  6, h: 10, d: 14, wall: "#f0ece4", roof: "#2a3050", isChurch: true },
    { x:  18, z:  15, w:  5, h:  4, d:  6, wall: "#d4c8b0", roof: "#8a3a2a" },
    { x:  20, z: -10, w:  4, h:  3, d:  5, wall: "#c8bea8", roof: "#6a2a1a" },
    { x:  16, z:  35, w:  5, h:  4, d:  7, wall: "#e8dfd0", roof: "#7a4030" },
    { x: -18, z:  20, w:  4, h:  3, d:  5, wall: "#d4c8b0", roof: "#5a3020" },
    { x: -16, z: -15, w:  5, h:  4, d:  6, wall: "#c0b8a8", roof: "#4a3828" },
    { x:  18, z: -30, w:  7, h:  4, d:  6, wall: "#d8d0c3", roof: "#cc0000", isDepanneur: true },
    { x: -22, z:  45, w:  8, h:  5, d: 12, wall: "#8a2a1a", roof: "#4a4a4a" },
    { x:  22, z:  50, w:  4, h:  3, d:  5, wall: "#bab2a0", roof: "#6a2a1a" },
    { x: -18, z: -35, w:  5, h:  4, d:  6, wall: "#d4c8b0", roof: "#8a3a2a" },
  ],

  donnacona: [
    { x: -15, z:   0, w:  7, h: 12, d: 16, wall: "#f0ece4", roof: "#1a2040", isChurch: true },
    { x:  20, z:  10, w: 11, h:  5, d: 10, wall: "#3a4a68", roof: "#0a1220", isPolice: true },
    { x:  22, z:  30, w: 12, h:  5, d:  9, wall: "#d8d0c3", roof: "#cc0000", isDepanneur: true },
    { x:  18, z: -20, w:  5, h:  4, d:  6, wall: "#d4c8b0", roof: "#8a3a2a" },
    { x:  20, z:  55, w:  4, h:  3, d:  5, wall: "#c8bea8", roof: "#6a2a1a" },
    { x: -18, z:  35, w:  5, h:  4, d:  7, wall: "#e8dfd0", roof: "#7a4030" },
    { x: -22, z: -18, w:  4, h:  3, d:  5, wall: "#bab2a0", roof: "#5a3020" },
    { x: -20, z:  60, w:  5, h:  4, d:  6, wall: "#d4c8b0", roof: "#4a3828" },
    { x:  24, z: -40, w: 12, h:  5, d: 10, wall: "#4a4a4a", roof: "#2a2a2a", isGarage: true },
    { x: -26, z:  75, w:  8, h:  5, d: 12, wall: "#8a2a1a", roof: "#4a4a4a" },
    { x: -26, z:  78, w:  4, h: 10, d:  4, wall: "#c8c0b8", roof: "#8a8a88" },
    { x:  20, z: -55, w:  8, h:  4, d:  7, wall: "#f0f0f0", roof: "#cc0000" },
  ],

  cap_sante: [
    { x: -13, z:   0, w:  6, h: 11, d: 14, wall: "#f5f0e8", roof: "#2a3050", isChurch: true },
    { x:  15, z:  10, w:  5, h:  4, d:  6, wall: "#d4c8b0", roof: "#8a3a2a" },
    { x:  17, z: -14, w:  4, h:  4, d:  5, wall: "#c8bea8", roof: "#6a2a1a" },
    { x:  13, z:  25, w:  5, h:  4, d:  7, wall: "#e8dfd0", roof: "#7a4030" },
    { x: -15, z:  18, w:  4, h:  3, d:  5, wall: "#d4c8b0", roof: "#5a3020" },
    { x: -20, z: -22, w:  8, h:  7, d: 10, wall: "#c8b890", roof: "#3a2a18" },
    { x:  15, z: -28, w:  7, h:  4, d:  6, wall: "#d8d0c3", roof: "#cc0000", isDepanneur: true },
    { x: -16, z:  30, w:  5, h:  4, d:  6, wall: "#c0b8a8", roof: "#4a3828" },
  ],

  portneuf: [
    { x: -15, z:   0, w:  6, h: 10, d: 14, wall: "#f0ece4", roof: "#2a3050", isChurch: true },
    { x: -32, z: -12, w:  8, h:  3, d: 12, wall: "#3a5a7a", roof: "#1a2a3a" },
    { x:  17, z:  12, w:  7, h:  4, d:  6, wall: "#d8d0c3", roof: "#cc0000", isDepanneur: true },
    { x:  15, z: -18, w:  5, h:  4, d:  6, wall: "#d4c8b0", roof: "#8a3a2a" },
    { x:  17, z:  30, w:  4, h:  3, d:  5, wall: "#c8bea8", roof: "#6a2a1a" },
    { x: -17, z:  22, w:  5, h:  4, d:  7, wall: "#e8dfd0", roof: "#7a4030" },
    { x:  19, z: -32, w:  8, h:  4, d:  7, wall: "#f0f0f0", roof: "#cc0000" },
    { x: -19, z: -25, w:  5, h:  4, d:  6, wall: "#bab2a0", roof: "#5a3020" },
  ],

  deschambault: [
    { x: -14, z:   0, w:  6, h: 10, d: 13, wall: "#f0ece4", roof: "#2a3050", isChurch: true },
    { x: -22, z: -18, w:  6, h:  6, d:  8, wall: "#c8a870", roof: "#6a4a28" },
    { x:  15, z:  12, w:  5, h:  4, d:  6, wall: "#d4c8b0", roof: "#8a3a2a" },
    { x:  17, z: -12, w:  4, h:  3, d:  5, wall: "#c8bea8", roof: "#6a2a1a" },
    { x: -15, z:  22, w:  5, h:  4, d:  7, wall: "#e8dfd0", roof: "#7a4030" },
    { x:  15, z: -28, w:  7, h:  4, d:  6, wall: "#d8d0c3", roof: "#cc0000", isDepanneur: true },
    { x: -18, z:  35, w:  4, h:  3, d:  5, wall: "#bab2a0", roof: "#4a3828" },
  ],

  grondines: [
    { x: -13, z:   0, w:  5, h:  9, d: 12, wall: "#f0ece4", roof: "#2a3050", isChurch: true },
    { x: -30, z:  -8, w:  6, h:  2, d: 10, wall: "#4a6a8a", roof: "#2a3a4a" },
    { x:  13, z:  10, w:  4, h:  3, d:  5, wall: "#d4c8b0", roof: "#8a3a2a" },
    { x:  15, z: -14, w:  5, h:  4, d:  6, wall: "#c8bea8", roof: "#6a2a1a" },
    { x: -15, z:  18, w:  4, h:  3, d:  5, wall: "#e8dfd0", roof: "#5a3020" },
    { x: -22, z:  35, w:  8, h:  5, d: 12, wall: "#8a2a1a", roof: "#4a4a4a" },
    { x:  15, z:  28, w:  5, h:  4, d:  6, wall: "#d4c8b0", roof: "#6a2a1a" },
  ],

  sainte_anne: [
    { x: -13, z:   0, w:  6, h: 10, d: 13, wall: "#f0ece4", roof: "#2a3050", isChurch: true },
    { x:  19, z:  12, w:  8, h:  4, d:  7, wall: "#7a5a3a", roof: "#4a3020" },
    { x:  17, z: -18, w:  7, h:  4, d:  6, wall: "#d8d0c3", roof: "#cc0000", isDepanneur: true },
    { x:  15, z:  28, w:  5, h:  4, d:  6, wall: "#d4c8b0", roof: "#8a3a2a" },
    { x: -15, z:  22, w:  4, h:  3, d:  5, wall: "#c8bea8", roof: "#6a2a1a" },
    { x: -17, z: -12, w:  5, h:  4, d:  7, wall: "#bab2a0", roof: "#7a4030" },
    // Cabanes à poulamon sur le fleuve (X très négatif)
    { x: -38, z:   5, w:  4, h:  2, d:  4, wall: "#8a7a5a", roof: "#5a4a3a" },
    { x: -42, z:  15, w:  3, h:  2, d:  3, wall: "#7a6a4a", roof: "#4a3828" },
    { x: -40, z: -10, w:  4, h:  2, d:  4, wall: "#8a7a5a", roof: "#5a4a3a" },
  ],

  batiscan: [
    { x: -13, z:   0, w:  6, h: 10, d: 13, wall: "#f0ece4", roof: "#2a3050", isChurch: true },
    { x: -18, z: -18, w:  7, h:  5, d:  9, wall: "#e8dfc8", roof: "#4a3828" },
    { x:  15, z:  12, w:  5, h:  4, d:  6, wall: "#d4c8b0", roof: "#8a3a2a" },
    { x:  17, z: -12, w:  4, h:  3, d:  5, wall: "#c8bea8", roof: "#6a2a1a" },
    { x:  15, z:  28, w:  5, h:  4, d:  7, wall: "#e8dfd0", roof: "#7a4030" },
    { x:  17, z: -28, w:  7, h:  4, d:  6, wall: "#d8d0c3", roof: "#cc0000", isDepanneur: true },
    { x: -24, z:  40, w:  8, h:  5, d: 12, wall: "#8a2a1a", roof: "#4a4a4a" },
    { x: -18, z:  22, w:  5, h:  4, d:  6, wall: "#c0b8a8", roof: "#5a3020" },
  ],
};

// ── Composant bâtiment individuel ─────────────────────────────

function Batiment({ b }: {
  b: typeof VILLAGE_DEFS["neuville"][0]
}) {
  return (
    <group position={[b.x, 0, b.z]}>

      {/* Corps */}
      <mesh position={[0, b.h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[b.w, b.h, b.d]} />
        <meshLambertMaterial color={b.wall} />
      </mesh>

      {/* Toit pignon bas */}
      <mesh position={[0, b.h + 0.5, 0]} castShadow>
        <boxGeometry args={[b.w + 0.3, 1, b.d + 0.3]} />
        <meshLambertMaterial color={b.roof} />
      </mesh>
      {/* Faîtage */}
      <mesh position={[0, b.h + 1.2, 0]} castShadow>
        <coneGeometry args={[b.w * 0.58, 1.8, 4]} />
        <meshLambertMaterial color={b.roof} />
      </mesh>

      {/* Clocher si église */}
      {b.isChurch && (
        <group position={[0, 0, -b.d * 0.28]}>
          <mesh position={[0, b.h + 3.5, 0]} castShadow>
            <boxGeometry args={[2.8, 7, 2.8]} />
            <meshLambertMaterial color={b.wall} />
          </mesh>
          <mesh position={[0, b.h + 8, 0]} castShadow>
            <coneGeometry args={[1.6, 5, 4]} />
            <meshLambertMaterial color={b.roof} />
          </mesh>
          {/* Croix */}
          <mesh position={[0, b.h + 11, 0]}>
            <boxGeometry args={[0.12, 1.8, 0.12]} />
            <meshLambertMaterial color="#c8c8c8" />
          </mesh>
          <mesh position={[0, b.h + 11.6, 0]}>
            <boxGeometry args={[0.9, 0.12, 0.12]} />
            <meshLambertMaterial color="#c8c8c8" />
          </mesh>
        </group>
      )}

      {/* Enseigne Police */}
      {b.isPolice && (
        <mesh position={[0, b.h - 1, b.d / 2 + 0.1]}>
          <boxGeometry args={[5, 0.8, 0.08]} />
          <meshLambertMaterial color="#2255cc"
            emissive="#1144aa" emissiveIntensity={0.4} />
        </mesh>
      )}

      {/* Enseigne Dépanneur */}
      {b.isDepanneur && (
        <mesh position={[0, b.h + 0.2, b.d / 2 + 0.1]}>
          <boxGeometry args={[4.5, 0.8, 0.08]} />
          <meshLambertMaterial color="#cc0000"
            emissive="#880000" emissiveIntensity={0.5} />
        </mesh>
      )}

      {/* Enseigne Garage */}
      {b.isGarage && (
        <mesh position={[0, b.h - 1, b.d / 2 + 0.1]}>
          <boxGeometry args={[5, 0.8, 0.08]} />
          <meshLambertMaterial color="#cc6600"
            emissive="#883300" emissiveIntensity={0.4} />
        </mesh>
      )}

      {/* Fenêtres */}
      {[-1, 1].map(side => (
        <mesh key={side}
          position={[side * (b.w / 2 + 0.01), b.h * 0.55, 0]}
          rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[b.d * 0.25, b.h * 0.28]} />
          <meshLambertMaterial color="#aad4ee"
            transparent opacity={0.65} />
        </mesh>
      ))}

    </group>
  );
}

// ── Export principal ───────────────────────────────────────────

export default function Buildings() {
  return (
    <group>
      {VILLAGES_138.map(village => {
        const defs = VILLAGE_DEFS[village.id];
        if (!defs) return null;
        return (
          <group key={village.id} position={[0, 0, village.z]}>
            {defs.map((b, i) => (
              <Batiment key={i} b={b} />
            ))}
          </group>
        );
      })}

      {/* ── Pont sur rivière à Portneuf ── */}
      <group position={[0, 0, -100]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[30, 0.5, 20]} />
          <meshLambertMaterial color="#7a7a70" />
        </mesh>
        {[-10, 10].map(x => (
          <mesh key={x} position={[x, -1.5, 0]}>
            <boxGeometry args={[2, 3, 18]} />
            <meshLambertMaterial color="#5a5a52" />
          </mesh>
        ))}
      </group>

      {/* ── Granges entre les villages ── */}
      {[
        { z: -600, x:  28 },
        { z: -380, x: -28 },
        { z: -150, x:  26 },
        { z:   60, x: -26 },
        { z:  290, x:  28 },
        { z:  480, x: -28 },
        { z:  640, x:  26 },
      ].map((pos, i) => (
        <group key={`barn-${i}`} position={[pos.x, 0, pos.z]}>
          <mesh position={[0, 3, 0]} castShadow>
            <boxGeometry args={[9, 6, 13]} />
            <meshLambertMaterial color="#8a2a1a" />
          </mesh>
          <mesh position={[0, 6.5, 0]} castShadow>
            <boxGeometry args={[9.5, 0.5, 13.5]} />
            <meshLambertMaterial color="#4a4a4a" />
          </mesh>
          <mesh position={[0, 2.5, 6.6]}>
            <boxGeometry args={[3, 5, 0.1]} />
            <meshLambertMaterial color="#5a1a0a" />
          </mesh>
          {/* Silo */}
          <mesh position={[7, 5, 0]} castShadow>
            <cylinderGeometry args={[2, 2, 10, 8]} />
            <meshLambertMaterial color="#c8c0b8" />
          </mesh>
          <mesh position={[7, 10.5, 0]} castShadow>
            <coneGeometry args={[2.2, 2, 8]} />
            <meshLambertMaterial color="#8a8a88" />
          </mesh>
        </group>
      ))}

    </group>
  );
}