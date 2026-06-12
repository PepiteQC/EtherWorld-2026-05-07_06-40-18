import { useMemo } from "react";
import * as THREE from "three";

// ═══════════════════════════════════════════════════════
// ROUTE 138 — Corridor Portneuf
// Québec (z=-950) → Trois-Rivières (z=+950)
//
// FLEUVE SAINT-LAURENT = toujours X NÉGATIF (gauche)
//   → Tu roules vers Trois-Rivières (z+) : fleuve à gauche ✅
//   → Tu roules vers Québec (z-)         : fleuve à droite ✅
//
// VILLAGES (ouest→est, z- → z+) :
//   Québec        z = -950
//   Neuville      z = -700
//   Donnacona     z = -480
//   Cap-Santé     z = -280
//   Portneuf      z = -100
//   Flasheur T    z =  +80   ← Route Guilbault → Saint-Marc
//   Deschambault  z = +200
//   Grondines     z = +360
//   Sainte-Anne   z = +560
//   Batiscan      z = +720
//   Trois-Rivières z = +950
// ═══════════════════════════════════════════════════════

export const VILLAGES_138 = [
  { id: "quebec",        name: "Québec",                    z: -950, speedLimit: 70 },
  { id: "neuville",      name: "Neuville",                  z: -700, speedLimit: 50 },
  { id: "donnacona",     name: "Donnacona",                 z: -480, speedLimit: 50 },
  { id: "cap_sante",     name: "Cap-Santé",                 z: -280, speedLimit: 50 },
  { id: "portneuf",      name: "Portneuf",                  z: -100, speedLimit: 50 },
  { id: "deschambault",  name: "Deschambault",              z:  200, speedLimit: 50 },
  { id: "grondines",     name: "Grondines",                 z:  360, speedLimit: 50 },
  { id: "sainte_anne",   name: "Sainte-Anne-de-la-Pérade", z:  560, speedLimit: 50 },
  { id: "batiscan",      name: "Batiscan",                  z:  720, speedLimit: 50 },
  { id: "trois_rivieres",name: "Trois-Rivières",            z:  950, speedLimit: 70 },
] as const;

export default function Road() {

  // ── Surface principale 138 ──────────────────────────
  const roadGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(14, 1900);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);

  // ── Accotements ─────────────────────────────────────
  const shoulderGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(22, 1900);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);

  // ── Lignes jaunes centrales ──────────────────────────
  const centerLines = useMemo(() => {
    const items: JSX.Element[] = [];
    for (let z = -950; z < 950; z += 24) {
      items.push(
        <mesh key={`cl-${z}`} position={[0, 0.025, z]}
          rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.25, 10]} />
          <meshBasicMaterial color="#f0e040" />
        </mesh>
      );
    }
    return items;
  }, []);

  // ── Lignes blanches de bord ──────────────────────────
  const edgeLines = useMemo(() => (
    [-6.8, 6.8].map(x => (
      <mesh key={x} position={[x, 0.018, 0]}
        rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.2, 1900]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    ))
  ), []);

  // ── Glissières de sécurité ───────────────────────────
  const guardrails = useMemo(() => {
    const posts: JSX.Element[] = [];
    for (let z = -950; z < 950; z += 30) {
      [-8, 8].forEach(x => {
        posts.push(
          <mesh key={`gr-${x}-${z}`} position={[x, 0.4, z]} castShadow>
            <boxGeometry args={[0.15, 0.8, 0.15]} />
            <meshLambertMaterial color="#cccccc" />
          </mesh>
        );
      });
    }
    return posts;
  }, []);

  // ── Pylônes Hydro-Québec (côté fleuve, X négatif) ───
  const hydroPylons = useMemo(() => {
    const pylons: JSX.Element[] = [];
    for (let z = -900; z < 950; z += 120) {
      pylons.push(
        <group key={`pylon-${z}`} position={[-22, 0, z]}>
          <mesh position={[0, 10, 0]} castShadow>
            <boxGeometry args={[0.28, 20, 0.28]} />
            <meshLambertMaterial color="#aaaaaa" />
          </mesh>
          <mesh position={[0, 18, 0]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.2, 12, 0.2]} />
            <meshLambertMaterial color="#aaaaaa" />
          </mesh>
          {[-5, 0, 5].map(xi => (
            <mesh key={xi} position={[xi, 19, 0]}>
              <sphereGeometry args={[0.22, 4, 4]} />
              <meshLambertMaterial color="#888888" />
            </mesh>
          ))}
        </group>
      );
    }
    return pylons;
  }, []);

  // ── Lampadaires ─────────────────────────────────────
  const lampadaires = useMemo(() => {
    const lamps: JSX.Element[] = [];
    for (let z = -950; z < 950; z += 40) {
      lamps.push(
        <group key={`lamp-${z}`} position={[9, 0, z]}>
          <mesh position={[0, 3.5, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.07, 7, 6]} />
            <meshLambertMaterial color="#778890" />
          </mesh>
          <mesh position={[0, 7, 0]} castShadow>
            <boxGeometry args={[1.5, 0.15, 0.4]} />
            <meshLambertMaterial color="#556677" />
          </mesh>
          <pointLight
            position={[0, 6.8, 0]}
            color="#ffd090"
            intensity={0.8}
            distance={25}
            decay={2}
          />
        </group>
      );
    }
    return lamps;
  }, []);

  // ── Clôtures rurales (côté champs, X positif) ───────
  const fences = useMemo(() => {
    const posts: JSX.Element[] = [];
    for (let z = -950; z < 950; z += 18) {
      posts.push(
        <group key={`fence-${z}`} position={[14, 0, z]}>
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 1.6, 5]} />
            <meshLambertMaterial color="#5a3d22" />
          </mesh>
          {Math.floor(z / 18) % 2 === 0 && (
            <mesh position={[0, 0.65, 9]}>
              <boxGeometry args={[0.1, 0.1, 18]} />
              <meshLambertMaterial color="#6a4d32" />
            </mesh>
          )}
        </group>
      );
    }
    return posts;
  }, []);

  // ── Croix de chemin ──────────────────────────────────
  const crosses = [-650, -380, -80, 280, 580].map(z => (
    <group key={`cross-${z}`} position={[12, 0, z]}>
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[0.12, 4, 0.12]} />
        <meshLambertMaterial color="#e8e0d0" />
      </mesh>
      <mesh position={[0, 3.2, 0]} castShadow>
        <boxGeometry args={[1.2, 0.1, 0.1]} />
        <meshLambertMaterial color="#e8e0d0" />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.5, 0.3, 0.5]} />
        <meshLambertMaterial color="#8a8880" />
      </mesh>
    </group>
  ));

  // ── Panneaux d'entrée de village ─────────────────────
  const villageSigns = VILLAGES_138
    .filter(v => v.id !== "quebec" && v.id !== "trois_rivieres")
    .map(v => (
      <group key={`sign-${v.id}`} position={[11, 0, v.z - 40]}>
        {/* Poteaux */}
        <mesh position={[-0.9, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.05, 3, 6]} />
          <meshLambertMaterial color="#888" />
        </mesh>
        <mesh position={[0.9, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.05, 3, 6]} />
          <meshLambertMaterial color="#888" />
        </mesh>
        {/* Panneau vert */}
        <mesh position={[0, 3.2, 0]} castShadow>
          <boxGeometry args={[2.8, 0.9, 0.06]} />
          <meshLambertMaterial color="#1a6a2a" />
        </mesh>
      </group>
    ));

  // ── Panneaux de limite de vitesse ────────────────────
  const speedSigns = VILLAGES_138
    .filter(v => v.id !== "quebec" && v.id !== "trois_rivieres")
    .map(v => (
      <group key={`speed-${v.id}`} position={[10, 0, v.z - 20]}>
        <mesh position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.05, 3, 6]} />
          <meshLambertMaterial color="#888" />
        </mesh>
        <mesh position={[0, 3.1, 0]} castShadow>
          <boxGeometry args={[0.8, 1.0, 0.05]} />
          <meshLambertMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 3.1, 0.03]}>
          <ringGeometry args={[0.3, 0.38, 16]} />
          <meshLambertMaterial color="#cc0000" />
        </mesh>
      </group>
    ));

  // ── Flasheur au T (z=+80) ────────────────────────────
  // Route Guilbault monte vers Saint-Marc-des-Carrières
  // Bar au SUD du T (X négatif, côté fleuve)

  // ── Route Guilbault (du flasheur vers Saint-Marc) ────
  const guilbaultGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(9, 500);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);

  // ── Fleuve Saint-Laurent ─────────────────────────────
  // Toujours à X NÉGATIF — large, plat, bleu foncé
  const fleuveGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(200, 1960);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);

  return (
    <group>

      {/* ══ FLEUVE SAINT-LAURENT ══
          X négatif = à gauche quand on va vers TR (z+)
          X négatif = à droite quand on va vers Québec (z-)  ✅ */}
      <mesh geometry={fleuveGeo}
        position={[-180, -0.3, 0]}
        receiveShadow>
        <meshLambertMaterial color="#1a4a7a" transparent opacity={0.88} />
      </mesh>

      {/* ══ ACCOTEMENTS ══ */}
      <mesh geometry={shoulderGeo} position={[0, 0.005, 0]} receiveShadow>
        <meshLambertMaterial color="#5a5a52" />
      </mesh>

      {/* ══ ASPHALTE 138 ══ */}
      <mesh geometry={roadGeo} position={[0, 0.01, 0]} receiveShadow>
        <meshLambertMaterial color="#3a3a38" />
      </mesh>

      {/* ══ LIGNES ══ */}
      {centerLines}
      {edgeLines}

      {/* ══ GLISSIÈRES ══ */}
      {guardrails}

      {/* ══ PYLÔNES HYDRO ══ */}
      {hydroPylons}

      {/* ══ LAMPADAIRES ══ */}
      {lampadaires}

      {/* ══ CLÔTURES ══ */}
      {fences}

      {/* ══ CROIX DE CHEMIN ══ */}
      {crosses}

      {/* ══ PANNEAUX VILLAGES ══ */}
      {villageSigns}
      {speedSigns}

      {/* ══ ROUTE GUILBAULT — vers Saint-Marc ══
          Part du flasheur (z=+80) et monte X+ */}
      <mesh geometry={guilbaultGeo}
        position={[254, 0.01, 330]}
        rotation={[0, Math.PI * 0.15, 0]}
        receiveShadow>
        <meshLambertMaterial color="#383836" />
      </mesh>
      {/* Ligne centrale Guilbault */}
      <mesh position={[254, 0.025, 330]}
        rotation={[0, Math.PI * 0.15, 0]}>
        <planeGeometry args={[0.2, 500]} />
        <meshBasicMaterial color="#f0e040" />
      </mesh>

      {/* ══ FLASHEUR AU T (z=+80) ══ */}
      <group position={[0, 0, 80]}>
        {/* Poteau */}
        <mesh position={[0, 4, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.09, 8, 8]} />
          <meshLambertMaterial color="#666" />
        </mesh>
        {/* Boîtier jaune — 138 */}
        <mesh position={[0, 8.3, 0]} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshLambertMaterial
            color="#ffcc00"
            emissive="#ffcc00"
            emissiveIntensity={1.5}
          />
        </mesh>
        {/* Boîtier rouge — Guilbault */}
        <mesh position={[1.5, 8.3, 0]} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshLambertMaterial
            color="#cc0000"
            emissive="#cc0000"
            emissiveIntensity={1.5}
          />
        </mesh>
        <pointLight position={[0, 8, 0]}
          color="#ffcc00" intensity={3} distance={25} />

        {/* ══ BAR AU T ══
            Au SUD du flasheur = X négatif (côté fleuve)
            C'est le repère local — visible en arrivant */}
        <group position={[-18, 0, 0]}>
          {/* Bâtiment */}
          <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[12, 7, 9]} />
            <meshLambertMaterial color="#7a5535" />
          </mesh>
          {/* Toit */}
          <mesh position={[0, 7.2, 0]} castShadow>
            <boxGeometry args={[12.5, 0.5, 9.5]} />
            <meshLambertMaterial color="#3a2218" />
          </mesh>
          {/* Enseigne rouge néon */}
          <mesh position={[0, 6, 4.6]}>
            <boxGeometry args={[6, 0.9, 0.12]} />
            <meshLambertMaterial
              color="#cc2200"
              emissive="#cc2200"
              emissiveIntensity={2}
            />
          </mesh>
          <pointLight position={[0, 6, 5.5]}
            color="#ff4400" intensity={2} distance={18} />
          {/* Parking gravier */}
          <mesh position={[0, 0.01, 7]}
            rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[16, 10]} />
            <meshLambertMaterial color="#5a5040" />
          </mesh>
          {/* Fenêtres */}
          {[-3, 0, 3].map(x => (
            <mesh key={x} position={[x, 3.5, 4.6]}>
              <boxGeometry args={[1.8, 1.4, 0.05]} />
              <meshLambertMaterial color="#aad4ee"
                transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ══ AUTOROUTE 40 ══
          Parallèle à la 138, côté X négatif plus loin */}
      <mesh position={[-65, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow>
        <planeGeometry args={[22, 1900]} />
        <meshLambertMaterial color="#2e2e2c" />
      </mesh>
      {/* Lignes A-40 */}
      {[-4, 0, 4].map(xOff =>
        Array.from({ length: 105 }, (_, i) => i * 18 - 950).map(z => (
          <mesh key={`a40-${xOff}-${z}`}
            position={[-65 + xOff, 0.02, z]}
            rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.22, 8]} />
            <meshBasicMaterial
              color={xOff === 0 ? "#f0e040" : "#ffffff"} />
          </mesh>
        ))
      )}
      {/* Séparateur A-40 */}
      <mesh position={[-65, 0.25, 0]}>
        <boxGeometry args={[0.6, 0.5, 1900]} />
        <meshLambertMaterial color="#888880" />
      </mesh>

    </group>
  );
}