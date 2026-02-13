import { useStore } from "./store";

export function MapBottomSheetBody() {
  const { selectedSchool } = useStore();

  return (
    <div style={{ padding: "0 1rem" }}>
      {selectedSchool ? <>Schule: {selectedSchool.name}</> : null}
    </div>
  );
}
