import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { AppShell } from "./AppShell";

const theme = createTheme({
  /** Put your mantine theme override here */
});

export function App() {
  return (
    <MantineProvider theme={theme}>
      <AppShell />
    </MantineProvider>
  );
}
