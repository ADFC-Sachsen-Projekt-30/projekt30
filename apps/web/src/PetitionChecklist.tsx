import { ActionIcon, Checkbox, Group, Stack, Text, Title } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useStore } from "./store";

export function PetitionChecklist() {
  const {
    selectedSchool,
    petitionChecklist,
    setPetitionChecklist,
    adminUnit,
    setSelectedSchool,
  } = useStore();

  if (!selectedSchool) {
    return (
      <Stack>
        <Text fs="italic">
          Wähle eine Schule auf der Karte aus um die Temp-30 Checkliste
          anzuzeigen
        </Text>
      </Stack>
    );
  }

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={3}>Schule: {selectedSchool.name}</Title>
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={() => setSelectedSchool(null)}
        >
          <IconX size={20} />
        </ActionIcon>
      </Group>
      <Stack>
        <Checkbox
          label="Hat die Schule einen Haupt- oder Nebenausgang zur Straße?"
          checked={petitionChecklist.hasExitToStreet}
          onChange={(event) =>
            setPetitionChecklist({
              ...petitionChecklist,
              hasExitToStreet: event.currentTarget.checked,
            })
          }
        />
        <Checkbox
          label="Ist an dieser Straße noch Tempo 50?"
          checked={petitionChecklist.isTempo50}
          onChange={(event) =>
            setPetitionChecklist({
              ...petitionChecklist,
              isTempo50: event.currentTarget.checked,
            })
          }
        />
        {adminUnit ? (
          <Text>
            Gemeinde: {adminUnit?.name}, {adminUnit?.email}
          </Text>
        ) : (
          <Text>Keine Gemeinde gefunden :(</Text>
        )}
      </Stack>
    </Stack>
  );
}
