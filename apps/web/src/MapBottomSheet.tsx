import { type FC, useEffect, useRef, useState } from "react";
import { Sheet, type SheetRef } from "react-modal-sheet";
import { MapBottomSheetBody } from "./MapBottomSheetBody";
import { useStore } from "./store";

const snapPoints = [0, 42, 130, 0.3, 0.7, -200, 1];
const initialSnap = 2;

export const MapBottomSheet: FC<{
  // an element hovering over the map right above the bottom sheed
  MapControlButton?: React.ReactNode;
}> = (props) => {
  const sheetRef = useRef<SheetRef>(null);
  const [snapPoint, setSnapPoint] = useState(initialSnap);
  const snapTo = (i: number) => sheetRef.current?.snapTo(i);
  const { selectedSchool } = useStore();

  useEffect(() => {
    // do not allow th sheet to grow to full height
    if (snapPoint === snapPoints.length - 1) {
      snapTo(snapPoints.length - 2);
    }
  }, [snapPoint]);

  // snap to 0.3 (index 3) when a school is selected so that the
  // PetitionChecklist is visible
  useEffect(() => {
    if (selectedSchool) {
      if (snapPoint < 3) {
        snapTo(3);
      }
    } else {
      snapTo(2);
    }
  }, [selectedSchool]);

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
        {
          // hide the gps button when the panel occupies more screen similar
          // to how gmap does this
          // TODO: use a proper motion animation for this
          snapPoint < 4 ? (
            <div
              style={{
                position: "relative",
                height: 0,
                width: "100%",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  zIndex: "calc(var(--mantine-z-index-app) + 100)",
                  top: "-4rem",
                  right: "1rem",
                }}
              >
                {props.MapControlButton}
              </div>
            </div>
          ) : null
        }
        <Sheet.Header />
        <Sheet.Content>
          <MapBottomSheetBody />
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
};
