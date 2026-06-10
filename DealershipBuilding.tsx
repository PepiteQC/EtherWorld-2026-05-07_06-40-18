"use client";
export function DealershipBuilding({ position = [0,0,0] }: { position?: [number,number,number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 3, 0]}>
        <boxGeometry args={[20, 6, 15]} />
        <meshLambertMaterial color="#c0c8d8" />
      </mesh>
      <mesh position={[0, 6.1, 0]}>
        <boxGeometry args={[20.5, 0.2, 15.5]} />
        <meshLambertMaterial color="#8899aa" />
      </mesh>
    </group>
  );
}
