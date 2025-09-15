import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";

export function Map() {
  const ref = useRef<HTMLDivElement>(null);

  // Setup leaflet 2.0 (class based api) manually.
  // Tried using react-leaflet but that does not work with the current preact
  // version (preact is missing react v19 `use` hook) and I didn't want to
  // switch back to react.
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const div = ref.current;

    const map = new L.Map(div).setView([51.063623, 13.751474], 18);

    new L.TileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    new L.Control.Scale({
      imperial: false,
      maxWidth: 300,
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, [ref]);

  return (
    <div
      ref={ref}
      style={{
        height: "calc(100dvh - var(--app-shell-header-height))",
      }}
    />
  );
}
