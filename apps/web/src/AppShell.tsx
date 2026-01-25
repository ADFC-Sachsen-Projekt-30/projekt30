import { Burger, AppShell as MantineAppShell } from "@mantine/core";
import "@mantine/core/styles.css";
import { useDisclosure } from "@mantine/hooks";
import { Map } from "./Map";

export function AppShell() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <MantineAppShell
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened, desktop: !opened },
      }}
      padding={0}
      zIndex={"var(--mantine-z-index-modal)"}
    >
      <Burger
        opened={opened}
        onClick={toggle}
        size="md"
        lineSize="2px"
        style={{
          position: "absolute",
          top: "0rem",
          left: "0rem",
          // burger must hover over map and navbar
          zIndex: "2010",
          backgroundColor: "var(--mantine-color-body)",
          margin: "0.5rem",
          borderColor: "var(--mantine-color-default-border)",
          border: "1px var(--mantine-color-default-border) solid",
          padding: "0.25rem 0.25rem 0.25rem 0.25rem",
        }}
      />
      <MantineAppShell.Navbar p="md" style={{ paddingTop: "4rem" }}>
        Navbar
      </MantineAppShell.Navbar>
      <MantineAppShell.Main>
        <Map />
      </MantineAppShell.Main>
    </MantineAppShell>
  );
}
