import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { useStore } from "./store";

export function Map() {
  const ref = useRef<HTMLDivElement>(null);
  const { setBbox, queryResult } = useStore();
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

    function handleBboxChange() {
      const leafletBbox = map.getBounds();
      const sw = leafletBbox.getSouthWest();
      const ne = leafletBbox.getNorthEast();

      const bboxSizeInM = map.distance(sw, ne);

      if (bboxSizeInM > 1_000) {
        // hack to avoid large queries on overpass
        return;
      }

      setBbox({
        southWest: { lat: sw.lat, lng: sw.lng },
        northEast: { lat: ne.lat, lng: ne.lng },
      });
    }

    map.on("moveend", handleBboxChange);

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
  }, [ref, setBbox]);

  useEffect(() => {
    if (!map) {
      return;
    }

    if (!queryResult?.points) {
      return;
    }

    const markers = queryResult.points.map((location) =>
      new L.Marker([location.lat, location.lng]).addTo(map),
    );

    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [map, queryResult]);

  return (
    <div
      ref={ref}
      style={{
        height: "calc(100dvh - var(--app-shell-header-height))",
      }}
    />
  );
}
