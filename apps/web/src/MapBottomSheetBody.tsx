import { useStore } from "./store";
import { PetitionChecklist } from "./PetitionChecklist";

export function MapBottomSheetBody() {
  const { selectedSchool } = useStore();

  return (
    <div style={{ padding: "0 1rem" }}>
      <PetitionChecklist />
    </div>
  );
}
