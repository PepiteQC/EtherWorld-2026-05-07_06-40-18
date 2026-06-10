import { useCityBoot } from "../../../hooks/city/useCityBoot";
import { useCityStore } from "../../../store/city/useCityStore";

export function CityRuntime() {
  useCityBoot();

  const snapshot = useCityStore((state) => state.snapshot);

  return (
    <group name="etherworld-city-runtime">
      {/* Ici on branchera les bâtiments dynamiques, portes, jobs, stockage et sécurité. */}
      {snapshot?.buildings.map((building) => (
        <group
          key={building.id}
          name={building.id}
          position={building.position}
          rotation={building.rotation}
        />
      ))}
    </group>
  );
}
