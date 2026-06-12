import { useState, useEffect, useCallback, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Game from "../components/game/Game";
import HUD from "../components/game/HUD";
import { readSave, type SaveData } from "../hooks/useSaveSystem";

export default function WorldPage() {
  const { profile, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [speed, setSpeed] = useState(0);
  const [zone, setZone] = useState("Route 138");
  const [mode, setMode] = useState<"driving" | "walking">("driving");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "idle">("idle");
  const [nearBuilding, setNearBuilding] = useState<any>(null);
  const [interiorPrompt, setInteriorPrompt] = useState<string | null>(null);
  const [isInInterior, setIsInInterior] = useState(false);
  const [initialSave, setInitialSave] = useState<SaveData | null>(null);
  const [serverHealth, setServerHealth] = useState<any>(null);

  useEffect(() => {
    if (!isLoggedIn) { navigate("/"); return; }
    const save = readSave();
    setInitialSave(save);
  }, [isLoggedIn, navigate]);

  // Check server health
  useEffect(() => {
    fetch("http://localhost:4000/health").then(r => r.json()).then(setServerHealth).catch(() => {});
  }, []);

  if (!profile || !initialSave) return null;

  return (
    <div className="w-screen h-screen bg-black relative">
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white font-mono">Chargement 3D...</div>}>
        <Game
          onSpeedChange={setSpeed}
          onZoneChange={setZone}
          onModeChange={setMode}
          onSaveStatus={setSaveStatus}
          onNearBuilding={setNearBuilding}
          onInteriorPrompt={(_, label) => setInteriorPrompt(label)}
          onIsInInterior={setIsInInterior}
          initialSave={initialSave}
          isNewPlayer={!readSave()}
        />
      </Suspense>
      <HUD
        speed={speed}
        zone={zone}
        mode={mode}
        saveStatus={saveStatus}
        nearBuilding={nearBuilding}
        interiorPrompt={interiorPrompt}
        isInInterior={isInInterior}
        money={0}
        serverHealth={serverHealth}
        onExit={() => navigate("/dashboard")}
      />
    </div>
  );
}
