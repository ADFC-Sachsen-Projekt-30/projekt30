import {
  type CSSProperties,
  type FC,
  useEffect,
  useRef,
  useState,
} from "react";
import { Sheet, type SheetRef } from "react-modal-sheet";
import { MapBottomSheetBody } from "./MapBottomSheetBody";

const snapPoints = [0, 42, 130, 0.5, -100, 1];
const initialSnap = 2;

export const MapBottomSheet: FC<{ style?: CSSProperties }> = () => {
  const sheetRef = useRef<SheetRef>(null);
  const [snapPoint, setSnapPoint] = useState(initialSnap);
  const snapTo = (i: number) => sheetRef.current?.snapTo(i);

  useEffect(() => {
    // do not allow th sheet to grow to full height
    if (snapPoint === snapPoints.length - 1) {
      snapTo(snapPoints.length - 2);
    }
  }, [snapPoint]);

  return (
    <Sheet
      disableDismiss
      initialSnap={initialSnap}
      isOpen
      onClose={() => undefined}
      onSnap={setSnapPoint}
      ref={sheetRef}
      snapPoints={snapPoints}
      style={{ zIndex: "calc(var(--mantine-z-index-app) + 50" }}
    >
      <Sheet.Container
        style={{
          backgroundColor: "var(--mantine-color-body)",
        }}
      >
        <Sheet.Header />
        <Sheet.Content>
          <MapBottomSheetBody />
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
};
