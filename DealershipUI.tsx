"use client";
import { useDealershipStore } from "../store/dealershipStore";
export function DealershipUI() {
  const { isOpen } = useDealershipStore();
  if (!isOpen) return null;
  return (
    <div style={{
      position: "fixed", top: "50%", left: "50%",
      transform: "translate(-50%,-50%)",
      background: "rgba(10,15,30,0.95)",
      border: "1px solid #334",
      borderRadius: 12, padding: 32,
      color: "#fff", fontFamily: "monospace",
      zIndex: 500, minWidth: 400,
    }}>
      <h2>🚗 Concessionnaire</h2>
      <p style={{ color: "#88aacc" }}>Sélectionnez un véhicule</p>
    </div>
  );
}
