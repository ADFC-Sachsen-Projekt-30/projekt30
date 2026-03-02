import { useStore } from "./store";
import { SchoolChecklist } from "./SchoolChecklist";

export function MapBottomSheetBody() {
  const { selectedSchool } = useStore();

  return (
    <div style={{ padding: "0 1rem" }}>
      {selectedSchool ? <SchoolChecklist /> : null}
    </div>
  );
}
