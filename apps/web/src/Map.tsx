import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { useStore } from "./store";
import type { School } from "./types";


export function Map() {
  const ref = useRef<HTMLDivElement>(null);
  const { setBbox, setQueryCoord, queryResult } = useStore();
  const [map, setMap] = useState<L.Map | null>(null);

  
  function ListResults() {
            //{queryResult.pointsOfSchools.map( (point) => <li> point </li>)}
    if (queryResult) {
      return (
        <>
          <ul>
           {queryResult.pointsOfSchools.map( (school: School) => <li> {school.name} in der Nähe von {school.position.lat}, {school.position.lng}</li>)}
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

   function handleClick( event : L.LeafletMouseEvent) {
      const position = event.latlng;
      setQueryCoord( {
        lat: position.lat, 
        lng: position.lng
      });  
    }

    function handleBboxChange() {
      const leafletBbox = map.getBounds();
      const leafletCenter = map.getCenter();
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

      // Temporary hack to test coordiante queries before click event is established
      // Use center of map.   If you remove this, then we need a subscribe on changes to the bbox-value
      // to reevaluate the queries
      setQueryCoord( {
        lat: leafletCenter.lat, 
        lng: leafletCenter.lng
      });
      

    }

    map.on("moveend", handleBboxChange);
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
  }, [ref, setBbox, setQueryCoord]);

  useEffect(() => {
    if (!map) {
      return;
    }



    if (!queryResult) {
      return;
    }

    // does not need the default leaflet map icon to be present in the assets
    const redCircleIcon = new L.DivIcon({
      className: "red-circle-marker",
      html: '<div style="width: 8px; height: 8px; background-color: red; border-radius: 50%; border: none; opacity: 0.6"></div>',
      iconSize: [8, 8],
      iconAnchor: [4, 4],
    });

    const markers = queryResult.points.map((location) =>
      new L.Marker([location.lat, location.lng], { icon: redCircleIcon }).addTo(
        map,
      ),
    );

    const greenCircleIcon = new L.DivIcon({
      className: "green-circle-marker",
      html: '<div style="width: 8px; height: 8px; background-color: green; border-radius: 50%; border: none; opacity: 0.6"></div>',
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });

    const markersOfSchools = queryResult.pointsOfSchools.map((school) =>
      new L.Marker([school.position.lat, school.position.lng], { icon: greenCircleIcon }).addTo(
        map,
      ),
    );



    return () => {
      markersOfSchools.forEach((m) => m.remove());
      markers.forEach((m) => m.remove());
    };
  }, [map, queryResult]);

   

  return (
    <div>
      <div
        ref={ref}
        style={{
          height: "calc(100dvh - var(--app-shell-header-height))",
        }}
      />
      <div>
        <h1> Mögliche Gründe für Tempo 30</h1>
        <ListResults />
      </div>
    </div>      
  );
}
