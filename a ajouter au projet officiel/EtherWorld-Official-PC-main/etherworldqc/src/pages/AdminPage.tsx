import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AdminPage() {
  const { profile, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) { navigate("/"); return; }
    if (!profile?.is_admin) { navigate("/dashboard"); return; }
  }, [isLoggedIn, profile, navigate]);

  if (!profile?.is_admin) return null;

  return (
    <div className="min-h-screen bg-[#08080E] relative">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-mono text-2xl text-red-400" style={{ textShadow: "0 0 20px #ff3333" }}>⚙️ ADMIN PANEL</h1>
          <button onClick={() => navigate("/dashboard")} className="pixel-button px-4 py-2 bg-zinc-800 font-mono text-xs text-white">← Dashboard</button>
        </div>
        <div className="pixel-window p-6">
          <h2 className="font-mono text-lg text-white mb-4">🔒 Accès Admin — {profile.username}</h2>
          <pre className="font-mono text-xs text-zinc-400 bg-black/50 p-4 overflow-auto">
{`users/{uid}        → Profil utilisateur
players/{uid}      → Données joueur RP
inventories/{uid}  → Inventaire
worldState/global  → État du monde
accessLogs/{logId} → Logs d'accès`}
          </pre>
        </div>
      </div>
    </div>
  );
}
