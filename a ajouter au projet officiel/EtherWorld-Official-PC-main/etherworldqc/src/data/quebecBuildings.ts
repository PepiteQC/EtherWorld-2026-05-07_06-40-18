// ============================================
// 🏠 Quebec Buildings — Data
// ============================================

export interface BuildingDef {
  id: string;
  name: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  hasInterior?: boolean;
  interiorId?: string;
  job?: {
    id: string;
    label: string;
    durationMs: number;
    reward: number;
  };
}

export interface DoorZone {
  id: string;
  pos: [number, number, number];
  label: string;
  hasInterior: boolean;
  interiorId?: string;
  job?: BuildingDef["job"];
}

const BUILDINGS: BuildingDef[] = [
  // Neuville
  { id: "neuville_depanneur", name: "Dépanneur Neuville", position: [-12, 0, -650], size: [8, 5, 6], color: "#8B7355", hasInterior: true, interiorId: "depanneur_neuville" },
  { id: "neuville_maison1", name: "Maison Neuville", position: [10, 0, -660], size: [6, 4, 5], color: "#A0522D" },
  { id: "neuville_maison2", name: "Maison Neuville 2", position: [15, 0, -640], size: [7, 4, 6], color: "#CD853F" },
  { id: "neuville_garage", name: "Garage Neuville", position: [-15, 0, -620], size: [10, 4, 8], color: "#696969", hasInterior: true, interiorId: "garage_neuville", job: { id: "mechanic", label: "Mécanicien", durationMs: 10000, reward: 50 } },
  // Donnacona
  { id: "donnacona_resto", name: "Restaurant Donnacona", position: [-10, 0, -470], size: [9, 5, 7], color: "#B22222", hasInterior: true, interiorId: "resto_donnacona", job: { id: "cook", label: "Cuisinier", durationMs: 8000, reward: 40 } },
  { id: "donnacona_maison1", name: "Maison Donnacona", position: [12, 0, -480], size: [7, 4, 5], color: "#D2691E" },
  { id: "donnacona_epicerie", name: "Épicerie Donnacona", position: [-18, 0, -440], size: [10, 5, 8], color: "#2E8B57", hasInterior: true, interiorId: "epicerie_donnacona", job: { id: "cashier", label: "Caissier", durationMs: 6000, reward: 30 } },
  // Cap-Santé
  { id: "capsante_ecole", name: "École Cap-Santé", position: [-14, 0, -260], size: [12, 6, 8], color: "#4682B4" },
  { id: "capsante_maison1", name: "Maison Cap-Santé", position: [8, 0, -270], size: [6, 4, 5], color: "#DAA520" },
  // Portneuf
  { id: "portneuf_banque", name: "Banque Portneuf", position: [-12, 0, -90], size: [10, 7, 8], color: "#4A4A4A", hasInterior: true, interiorId: "banque_portneuf", job: { id: "banker", label: "Banquier", durationMs: 12000, reward: 80 } },
  { id: "portneuf_maison1", name: "Maison Portneuf", position: [10, 0, -100], size: [7, 4, 6], color: "#BC8F8F" },
  { id: "portneuf_poste", name: "Poste de Police", position: [18, 0, -80], size: [10, 6, 8], color: "#1a1a4a", hasInterior: true, interiorId: "police_portneuf", job: { id: "security", label: "Agent de sécurité", durationMs: 15000, reward: 100 } },
  // Deschambault
  { id: "deschambault_pharmacie", name: "Pharmacie", position: [-10, 0, 200], size: [8, 5, 6], color: "#006400", hasInterior: true, interiorId: "pharmacie_deschambault" },
  { id: "deschambault_maison1", name: "Maison Deschambault", position: [12, 0, 190], size: [6, 4, 5], color: "#F4A460" },
  // Grondines
  { id: "grondines_cafe", name: "Café Grondines", position: [-8, 0, 360], size: [7, 4, 6], color: "#8B4513", hasInterior: true, interiorId: "cafe_grondines", job: { id: "barista", label: "Barista", durationMs: 5000, reward: 25 } },
  // Sainte-Anne
  { id: "ste_anne_hotel", name: "Hôtel Sainte-Anne", position: [-15, 0, 530], size: [12, 8, 10], color: "#8B0000", hasInterior: true, interiorId: "hotel_ste_anne" },
  // Batiscan
  { id: "batiscan_quai", name: "Quai Batiscan", position: [10, 0, 720], size: [15, 2, 4], color: "#5C4033" },
  // Trois-Rivières
  { id: "tr_gare", name: "Gare TR", position: [-20, 0, 870], size: [14, 7, 10], color: "#4A4A4A", hasInterior: true, interiorId: "gare_tr" },
  { id: "tr_magasin", name: "Magasin TR", position: [15, 0, 880], size: [10, 5, 8], color: "#CD5C5C", hasInterior: true, interiorId: "magasin_tr", job: { id: "vendor", label: "Vendeur", durationMs: 7000, reward: 35 } },
];

export { BUILDINGS };
export default BUILDINGS;

// Get building doors as DoorZone[]
export function getBuildingDoors(): DoorZone[] {
  return BUILDINGS
    .filter((b) => b.hasInterior || b.job)
    .map((b) => ({
      id: b.id,
      pos: [b.position[0], 0, b.position[2] + b.size[2] / 2 + 1] as [number, number, number],
      label: b.name,
      hasInterior: !!b.hasInterior,
      interiorId: b.interiorId,
      job: b.job,
    }));
}
