import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { BottomCollapse } from "./BottomCollapse";
import { useStore } from "./store";

export function Map() {
  const ref = useRef<HTMLDivElement>(null);
  const { setQueryCoord, queryResult, mainStreetsAtCoord } = useStore();
  const [map, setMap] = useState<L.Map | null>(null);

  // Setup leaflet 2.0 (class based api) manually.
  // Tried using react-leaflet but that does not work with the current preact
  // version (preact is missing react v19 `use` hook) and I didn't want to
  // switch back to react.
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const div = ref.current;

    const map = new L.Map(div).setView(
      // markers for the demo query
      [51.063, 13.7612],
      // adfc dd
      // [51.063623, 13.751474]
      18,
    );

    function handleClick(event: L.LeafletMouseEvent) {
      const position = event.latlng;
      setQueryCoord({
        lat: position.lat,
        lng: position.lng,
      });
    }

    map.on("click", handleClick);

    new L.TileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    setMap(map);

    return () => {
      setMap(null);
      map.remove();
    };
  }, [ref, setQueryCoord]);

  useEffect(() => {
    if (!map) {
      return;
    }

    if (!queryResult) {
      return;
    }

    const greenCircleIcon = new L.DivIcon({
      className: "green-circle-marker",
      html: '<div style="width: 8px; height: 8px; background-color: green; border-radius: 50%; border: none; opacity: 0.6"></div>',
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });

    const markersOfSchools = queryResult.pointsOfSchools.map((school) =>
      new L.Marker([school.position.lat, school.position.lng], {
        icon: greenCircleIcon,
      }).addTo(map),
    );

    return () => {
      markersOfSchools.forEach((m) => m.remove());
    };
  }, [map, queryResult, mainStreetsAtCoord]);

  const bottomHeight = "2rem";

  return (
    <div>
      <div
        ref={ref}
        style={{
          height: `calc(100dvh - var(--app-shell-header-height) - ${bottomHeight})`,
          zIndex: "var(--mantine-z-index-app)",
        }}
      />
      <div
        style={{
          position: "relative",
          height: bottomHeight,
        }}
      >
        <BottomCollapse
          style={{
            zIndex: "calc(var(--mantine-z-index-app) + 10)",
            position: "absolute",
            bottom: 0,
            width: "100%",
            backgroundColor: "var(--mantine-color-body)",
            borderRadius: "1rem",
          }}
        />
      </div>
    </div>
  );
}
