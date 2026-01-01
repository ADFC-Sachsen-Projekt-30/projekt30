import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { useStore } from "./store";
import type { NamedObjectWithPosition } from "./types";

export function Map() {
  const ref = useRef<HTMLDivElement>(null);
  const {
    queryCoord,
    setQueryCoord,
    queryResult,
    mainStreetsAtCoord,
    adminUnitAtCoord,
  } = useStore();
  const [map, setMap] = useState<L.Map | null>(null);

  function ListMainStreets() {
    /* Create a  list entry for each Street we found*/
    if (mainStreetsAtCoord) {
      return (
        <>
          <ul>
            {mainStreetsAtCoord.map(
              (mainStreetAtCoord: NamedObjectWithPosition) => (
                <li> {mainStreetAtCoord.name} </li>
              ),
            )}
          </ul>
        </>
      );
    }
  }

  function ShowAdminUnit() {
    /* Shows the administrive unit found at the coordinate*/
    if (adminUnitAtCoord) {
      return (
        <>
          {adminUnitAtCoord.name} TODO: müssen wir mehrere zuständige Stellen
          handeln? Grenzfälle?
        </>
      );
    }
  }

  function ListResults() {
    /* Listet alle gefundenen Schulen im Umkreis der Suchkoordinate auf */
    if (queryResult) {
      return (
        <>
          <ul>
            {queryResult.pointsOfSchools.map(
              (school: NamedObjectWithPosition) => (
                <li>
                  {" "}
                  {school.name} in der Nähe von {school.position.lat},{" "}
                  {school.position.lng}
                </li>
              ),
            )}
          </ul>
        </>
      );
    }
  }

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

  return (
    <div>
      <div
        ref={ref}
        style={{
          height: "calc(100dvh - var(--app-shell-header-height))",
        }}
      />
      <div>
        <h1>Mögliche Gründe für Tempo 30</h1>
        {queryCoord ? (
          <h3>
            Suche an Koordinate {queryCoord?.lat}, {queryCoord?.lng}
          </h3>
        ) : (
          ""
        )}
        TODO "Ladebalken" solange queries ausgeführt werden
        <h3>Möglicherweise betroffene Straßen</h3>
        TODO Auswahl bei mehreren Straßen TODO Zusammenführen von Straßen, die
        den gleichen Namen haben (?)
        <ListMainStreets />
        <h3>
          {" "}
          Zuständige Behörde: <ShowAdminUnit />{" "}
        </h3>
        TODO Mapping von Gemeinde/Stadt auf die zuständige Behörde (mit Adresse
        / E-Mail etc.)
        <h3>Schulen, die Tempo 30 ermöglichen könnten</h3>
        TODO: Auswahl und dann Checkliste / Wizzard starten:
        <ul>
          <li> Ist die Schule allgemeinbildend (d.h. ...)?</li>
          <li> Liegt sie direkt an der Straße (d.h. ...)?</li>
          <li> weitere Prüfkriterien</li>
        </ul>
        Gefundene Schulen:
        <ListResults />
      </div>
    </div>
  );
}
