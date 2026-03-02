import { Checkbox, Stack, Text, Loader, Title } from "@mantine/core";
import { useStore } from "./store";
import { adminUnits } from "./data/adminUnits";

export function SchoolChecklist() {
  const { selectedSchool, schoolChecklist, setSchoolChecklist } = useStore();

  if (!selectedSchool) {
    return null;
  }

  const councilName =
    adminUnits.find(
      (unit) =>
        unit.SCHLNR === selectedSchool.building.community_key ||
        unit.SCHLNR === selectedSchool.building.community_part_key,
    )?.GEMEINDE || "Unbekannt";

  return (
    <Stack>
      <Title order={3}>Schule: {selectedSchool.name}</Title>
      <Stack>
        <Checkbox
          label="Hat die Schule Haupt- oder Nebenausgang zur Straße?"
          checked={schoolChecklist.hasExitToStreet}
          onChange={(event) =>
            setSchoolChecklist({
              ...schoolChecklist,
              hasExitToStreet: event.currentTarget.checked,
            })
          }
        />
        <Checkbox
          label="Ist an dieser Straße noch Tempo 50?"
          checked={schoolChecklist.isTempo50}
          onChange={(event) =>
            setSchoolChecklist({
              ...schoolChecklist,
              isTempo50: event.currentTarget.checked,
            })
          }
        />
        <Text>Gemeinde/Stadt: {councilName}</Text>
      </Stack>
    </Stack>
  );
}
