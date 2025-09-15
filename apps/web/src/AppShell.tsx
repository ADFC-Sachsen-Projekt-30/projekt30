import {
  Burger,
  Group,
  AppShell as MantineAppShell,
  Text,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { useDisclosure } from "@mantine/hooks";

export function AppShell() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <MantineAppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <MantineAppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          Header has a burger icon below sm breakpoint
        </Group>
      </MantineAppShell.Header>
      <MantineAppShell.Navbar p="md">
        Navbar is collapsed on mobile at sm breakpoint. At that point it is no
        longer offset by padding in the main element and it takes the full width
        of the screen when opened.
      </MantineAppShell.Navbar>
      <MantineAppShell.Main>
        <Text>This is the main section, your app content here.</Text>
        <Text>
          Layout used in most cases – Navbar and Header with fixed position
        </Text>
      </MantineAppShell.Main>
    </MantineAppShell>
  );
}
