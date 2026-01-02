import { Box, Button, Collapse, Divider, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type CSSProperties, type FC } from "react";
import { QueryResultPanel } from "./QueryResultPanel";

export const BottomCollapse: FC<{ style?: CSSProperties }> = (props) => {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Box style={props.style}>
      <Group justify="center" mb={5}>
        <Button
          className="mantine-focus-never"
          fullWidth
          onClick={toggle}
          variant="transparent"
          size="compact-sm"
        >
          <Divider size="md" color="gray" style={{ width: "2.5rem" }} />
        </Button>
      </Group>

      <Collapse in={opened}>
        <QueryResultPanel />
      </Collapse>
    </Box>
  );
};
