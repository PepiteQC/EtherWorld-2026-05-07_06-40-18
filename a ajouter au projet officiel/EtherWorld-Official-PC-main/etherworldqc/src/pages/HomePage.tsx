import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

export default function HomePage() {
  const { joinAsGuest, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"choose" | "guest">("choose");
  const [username, setUsername] = useState("");

  if (isLoggedIn) { navigate("/dashboard"); return null; }

  function handleGuest() {
    joinAsGuest(username || "Player");
    navigate("/dashboard");
  }

  return (
    <main className="w-screen h-screen overflow-hidden bg-[#08080E] relative flex items-center justify-center">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="scanlines absolute inset-0 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center px-4">
        <motion.h1 initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="neon-glow font-mono text-5xl md:text-7xl font-bold tracking-wider text-white mb-4">
          ETHERWORLD
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="font-mono text-lg text-zinc-400 mb-8 text-center">
          RP Simulation — <span className="neon-glow-green text-[#00FF9D]">Route 138 → EtherWorld City</span>
        </motion.p>

        <AnimatePresence mode="wait">
          {mode === "choose" ? (
            <motion.div key="choose" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex flex-col gap-3 w-full max-w-sm">
              <button onClick={() => setMode("guest")}
                className="pixel-button w-full bg-[#00FF9D] px-8 py-5 text-center font-mono text-lg text-black font-bold"
                style={{ boxShadow: "0 0 30px #00FF9D44" }}>
                ▶ REJOINDRE LE SERVEUR
              </button>
            </motion.div>
          ) : (
            <motion.div key="guest" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="w-full max-w-sm pixel-window p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 bg-red-500 rounded-full" /><div className="h-3 w-3 bg-yellow-500 rounded-full" /><div className="h-3 w-3 bg-green-500 rounded-full" />
                <span className="ml-2 font-mono text-xs text-zinc-500">join.exe</span>
              </div>
              <h2 className="mb-4 font-mono text-xl text-white">REJOINDRE ETHERWORLD RP</h2>
              <input type="text" placeholder="Ton pseudo... (optionnel)" maxLength={20} value={username}
                onChange={(e) => setUsername(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleGuest()}
                className="pixel-border w-full bg-black/50 p-3 font-mono text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#00FF9D] mb-3" />
              <button onClick={handleGuest}
                className="pixel-button w-full bg-[#00FF9D] py-3 font-mono text-sm text-black font-bold"
                style={{ boxShadow: "0 0 20px #00FF9D44" }}>
                ▶ ENTRER DANS LE MONDE
              </button>
              <button onClick={() => setMode("choose")} className="mt-3 w-full py-2 text-center font-mono text-xs text-zinc-500 hover:text-white">← Retour</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
