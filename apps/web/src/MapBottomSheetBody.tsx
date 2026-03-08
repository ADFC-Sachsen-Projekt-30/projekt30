import { useStore } from "./store";
import { PetitionChecklist } from "./PetitionChecklist";

export function MapBottomSheetBody() {
  return (
    <div style={{ padding: "0 1rem" }}>
      <PetitionChecklist />
    </div>
  );
}
