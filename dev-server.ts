// ============================================
// 🚀 EtherWorld API Server — Express + Firebase Admin
// ============================================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString(), version: "1.0.0" });
});

// Player routes
app.get("/api/player/profile", (req, res) => {
  const uid = req.headers.authorization?.replace("Bearer guest_", "") || "unknown";
  res.json({ uid, username: "Player", role: "player" });
});

app.post("/api/player/position", (req, res) => {
  res.json({ success: true });
});

app.get("/api/player/position", (_req, res) => {
  res.json({ x: 0, y: 0, z: 0 });
});

app.post("/api/player/avatar", (_req, res) => {
  res.json({ success: true });
});

// World routes
app.get("/api/world/state", (_req, res) => {
  res.json({ status: "online", players: 1 });
});

// Inventory routes
app.get("/api/inventory", (_req, res) => {
  res.json({ items: [] });
});

// Admin routes
app.get("/api/admin/players", (_req, res) => {
  res.json([]);
});

app.get("/api/admin/logs", (_req, res) => {
  res.json([]);
});

app.listen(PORT, () => {
  console.log(`🚀 API EtherWorld live: http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`🎮 Client attendu: http://localhost:5173`);
});
