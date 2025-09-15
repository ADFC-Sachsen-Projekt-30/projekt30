import { Burger, Group, AppShell as MantineAppShell } from "@mantine/core";
import "@mantine/core/styles.css";
import { useDisclosure } from "@mantine/hooks";
import { Map } from "./Map";

export function AppShell() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <MantineAppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding={0}
      zIndex={
        // let app shell (esp the navbar) hover above the leaflet map (base
        // zIndex 400, controls have 1000)
        2000
      }
    >
      <MantineAppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          Project 30
        </Group>
      </MantineAppShell.Header>
      <MantineAppShell.Navbar p="md">Navbar</MantineAppShell.Navbar>
      <MantineAppShell.Main>
        <Map />
      </MantineAppShell.Main>
    </MantineAppShell>
  );
}
