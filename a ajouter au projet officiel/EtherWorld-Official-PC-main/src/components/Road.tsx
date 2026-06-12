import { useMemo } from "react";
import * as THREE from "three";

export default function Road() {
  // Route 138 — long road from Québec to Trois-Rivières
  const roadGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(14, 1900);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);

  // Road shoulder/gravel
  const shoulderGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(22, 1900);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);

  // Center line dashes
  const dashLines = useMemo(() => {
    const dashes: JSX.Element[] = [];
    for (let z = -900; z < 900; z += 24) {
      dashes.push(
        <mesh key={z} position={[0, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.3, 10]} />
          <meshBasicMaterial color="#f0e040" />
        </mesh>
      );
    }
    return dashes;
  }, []);

  // Edge white lines
  const edgeLines = useMemo(() => {
    const lines: JSX.Element[] = [];
    [-6.8, 6.8].forEach(xPos => {
      lines.push(
        <mesh key={xPos} position={[xPos, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.25, 1900]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      );
    });
    return lines;
  }, []);

  // Autoroute 40 (highway) — separate parallel road to the south
  const a40Geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(22, 1900);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);

  const a40Lanes = useMemo(() => {
    const lanes: JSX.Element[] = [];
    // divider and lane markings for A-40
    [-4, 0, 4].forEach(xOff => {
      for (let z = -900; z < 900; z += 18) {
        lanes.push(
          <mesh key={`${xOff}-${z}`} position={[-60 + xOff, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.25, 8]} />
            <meshBasicMaterial color={xOff === 0 ? "#f0e040" : "#ffffff"} />
          </mesh>
        );
      }
    });
    return lanes;
  }, []);

  // Guardrail posts
  const guardrailPosts = useMemo(() => {
    const posts: JSX.Element[] = [];
    for (let z = -900; z < 900; z += 30) {
      [-8, 8].forEach(x => {
        posts.push(
          <mesh key={`${x}-${z}`} position={[x, 0.4, z]} castShadow>
            <boxGeometry args={[0.15, 0.8, 0.15]} />
            <meshLambertMaterial color="#cccccc" />
          </mesh>
        );
      });
    }
    return posts;
  }, []);

  return (
    <group>
      {/* Main road shoulder (Route 138) */}
      <mesh geometry={shoulderGeo} position={[0, 0.005, 0]} receiveShadow>
        <meshLambertMaterial color="#5a5a52" />
      </mesh>

      {/* Road surface */}
      <mesh geometry={roadGeometry} position={[0, 0.01, 0]} receiveShadow>
        <meshLambertMaterial color="#3a3a38" />
      </mesh>

      {/* Lane markings */}
      {dashLines}
      {edgeLines}

      {/* Guardrail posts */}
      {guardrailPosts}

      {/* Autoroute 40 surface */}
      <mesh geometry={a40Geometry} position={[-60, 0.01, 0]} receiveShadow>
        <meshLambertMaterial color="#2e2e2c" />
      </mesh>

      {/* A-40 Lane markings */}
      {a40Lanes}

      {/* A-40 divider barrier */}
      <mesh position={[-60, 0.25, 0]}>
        <boxGeometry args={[0.6, 0.5, 1900]} />
        <meshLambertMaterial color="#888880" />
      </mesh>

      {/* Road signs — village names */}
      {[
        { z: -650, name: "Québec" },
        { z: -300, name: "Neuville" },
        { z: 0, name: "Portneuf" },
        { z: 350, name: "Batiscan" },
        { z: 700, name: "Trois-Rivières" },
      ].map(({ z, name }) => (
        <group key={name} position={[10, 0, z]}>
          {/* Sign pole */}
          <mesh position={[0, 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 3, 6]} />
            <meshLambertMaterial color="#888888" />
          </mesh>
          {/* Sign board */}
          <mesh position={[0, 3.2, 0]} castShadow>
            <boxGeometry args={[0.2, 0.8, 3]} />
            <meshLambertMaterial color="#1a5fa8" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
