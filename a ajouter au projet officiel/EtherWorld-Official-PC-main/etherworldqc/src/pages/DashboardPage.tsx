import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { readSave, type SaveData } from "../hooks/useSaveSystem";

export default function DashboardPage() {
  const { profile, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [skinColor, setSkinColor] = useState(profile?.avatar?.skin_color || "#f5d0c5");
  const [saved] = useState(false);

  useEffect(() => { if (!isLoggedIn) navigate("/"); }, [isLoggedIn, navigate]);
  if (!profile) return null;

  const hasSave = !!readSave();

  function handleEnterWorld() { navigate("/world"); }

  const SKIN_COLORS = ["#f5d0c5", "#e8b89d", "#d4956b", "#c07840", "#8d5524", "#5c3310"];

  return (
    <div className="w-screen h-screen bg-[#08080E] relative overflow-y-auto">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="neon-glow font-mono text-2xl text-white">ETHERWORLD</h1>
            <p className="font-mono text-xs text-zinc-500">🔓 Mode développement local</p>
          </div>
          <button onClick={() => { logout(); navigate("/"); }} className="pixel-button px-4 py-2 bg-zinc-800 font-mono text-xs text-red-400">🚪 QUITTER</button>
        </div>

        {/* Profile */}
        <div className="pixel-window p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full border-2 border-[#00FF9D] flex items-center justify-center text-3xl" style={{ backgroundColor: skinColor }}>👤</div>
            <div>
              <h2 className="font-mono text-xl text-white">{profile.username}</h2>
              <p className="font-mono text-xs text-zinc-500">{profile.email || "Pas d'email (guest)"}</p>
              <p className="font-mono text-xs text-[#00FF9D]">Role: {profile.role}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 font-mono text-sm">
            <div className="pixel-border bg-black/30 p-3 text-center">
              <p className="text-xs text-zinc-500">SAVE</p>
              <p className="text-white text-lg">{hasSave ? "✓" : "—"}</p>
            </div>
            <div className="pixel-border bg-black/30 p-3 text-center">
              <p className="text-xs text-zinc-500">STATUS</p>
              <p className="text-[#00FF9D] text-lg">PRÊT</p>
            </div>
          </div>
        </div>

        {/* Avatar */}
        <div className="pixel-window p-6 mb-6">
          <h3 className="font-mono text-lg text-white mb-4">👤 PERSONNAGE</h3>
          <div>
            <label className="block font-mono text-xs text-zinc-500 mb-2">SKIN</label>
            <div className="flex gap-2">{SKIN_COLORS.map((c) => (
              <button key={c} onClick={() => setSkinColor(c)} className={`w-10 h-10 pixel-border ${skinColor === c ? "ring-2 ring-white" : ""}`} style={{ backgroundColor: c }} />
            ))}</div>
          </div>
          {saved && <p className="mt-3 font-mono text-xs text-[#00FF9D]">✓ Sauvegardé !</p>}
        </div>

        {/* ===== GROS BOUTON ===== */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <button onClick={handleEnterWorld}
            className="pixel-button w-full bg-[#00FF9D] py-8 text-center font-mono text-2xl text-black font-bold"
            style={{ boxShadow: "0 0 40px #00FF9D44, 0 0 80px #00FF9D22" }}>
            🎮 REJOINDRE LE SERVEUR ETHERWORLD RP
          </button>
          <p className="text-center font-mono text-xs text-zinc-600 mt-3">
            Route 138 — Simulation RP — Respect & Réalisme
          </p>
        </motion.div>

        <div className="mt-8 text-center font-mono text-xs text-zinc-700">EtherWorld RP v1.0.0</div>
      </div>
    </div>
  );
}
