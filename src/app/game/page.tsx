// src/app/game/page.tsx  (ou GameCanvas.tsx)
"use client";

import { Canvas } from "@react-three/fiber";
import { Physics }  from "@react-three/rapier";
import AdminConsole from "@/components/AdminConsole/AdminConsole";
import { useGameContext } from "@/hooks/useGameContext";

export default function GamePage() {
  const { player, commandContext } = useGameContext();

  return (
    <>
      {/* Canvas Three.js / R3F */}
      <Canvas>
        <Physics>
          {/* Ton monde ETHERWORLD RP ici 🌌 */}
        </Physics>
      </Canvas>

      {/* Console Admin - par-dessus le canvas */}
      {player && (
        <AdminConsole
          player={player}
          context={commandContext}
        />
      )}
    </>
  );
}