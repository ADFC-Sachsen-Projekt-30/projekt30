import { ActionIcon } from "@mantine/core";
import { IconCircleFilled } from "@tabler/icons-react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { MapBottomSheet } from "./MapBottomSheet";
import { createMapMarkerIcon } from "./mapMarkers";
import { schoolsIndex, type SchoolPoint } from "./spatial-index";
import { useStore } from "./store";

export function Map() {
  const ref = useRef<HTMLDivElement>(null);
  const { setQueryCoord, queryResult, mainStreetsAtCoord } = useStore();
  const [map, setMap] = useState<L.Map | null>(null);
  const [userLocation, setUserLocation] = useState<L.LatLng | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [viewportSchools, setViewportSchools] = useState<SchoolPoint[]>([]);

  // Setup leaflet 2.0 (class based api) manually.
  // Tried using react-leaflet but that does not work with the current preact
  // version (preact is missing react v19 `use` hook) and I didn't want to
  // switch back to react.
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const div = ref.current;
    const map = new L.Map(div);

    map.setView(
      // markers for the demo query
      [51.063, 13.7612],
      // adfc dd
      // [51.063623, 13.751474]
      18,
    );

    // default zoom control position interferes with AppShell Burger button
    map.removeControl(map.zoomControl);

    function handleClick(event: L.LeafletMouseEvent) {
      const position = event.latlng;

      setQueryCoord({
        lat: position.lat,
        lng: position.lng,
      });
    }

    map.on("click", handleClick);

    // Add viewport change listener
    function handleMoveEnd() {
      const bounds = map.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      const boundsSize = map.distance(sw, ne);

      // limit the amount of visible markers to not overload the map
      const schoolsInViewport =
        boundsSize < 40_000
          ? schoolsIndex.queryBounds({
              southWest: { lat: sw.lat, lng: sw.lng },
              northEast: { lat: ne.lat, lng: ne.lng },
            })
          : [];

      setViewportSchools(schoolsInViewport);
    }

    map.on("moveend", handleMoveEnd);

    // Initial trigger
    handleMoveEnd();

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

  // school markers from spatial index
  useEffect(() => {
    if (!map) {
      return;
    }

    const markersOfSchools = viewportSchools.map((school) => {
      return new L.Marker([school.lat, school.lng], {
        icon: createMapMarkerIcon(),
        title: school.name,
      }).addTo(map);
    });

    return () => {
      markersOfSchools.forEach((m) => m.remove());
    };
  }, [map, viewportSchools]);

  // school markers from query result (external API)
  useEffect(() => {
    if (!map || !queryResult) {
      return;
    }

    const markersOfSchools = queryResult.pointsOfSchools.map((school) => {
      return new L.Marker([school.position.lat, school.position.lng], {
        icon: createMapMarkerIcon(),
      }).addTo(map);
    });

    return () => {
      markersOfSchools.forEach((m) => m.remove());
    };
  }, [map, queryResult, mainStreetsAtCoord]);

  // user location marker
  useEffect(() => {
    if (!map || !userLocation) return;

    // Create blue marker for user location
    const blueCircleIcon = new L.DivIcon({
      className: "user-location-marker",
      html: '<div style="width: 12px; height: 12px; background-color: #228be6; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.5);"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    const userMarker = new L.Marker(userLocation, {
      icon: blueCircleIcon,
    }).addTo(map);

    // Cleanup
    return () => {
      if (userMarker) {
        userMarker.remove();
      }
    };
  }, [map, userLocation]);

  // browser gps
  const getUserLocation = () => {
    if (!map) return;

    setIsLocating(true);

    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const latLng = new L.LatLng(lat, lng);

        map.setView(latLng, map.getZoom());
        setUserLocation(latLng);

        // same as clicking on map to trigger a query
        setQueryCoord({
          lat: lat,
          lng: lng,
        });

        setIsLocating(false);
      },
      (error) => {
        console.error("Error getting location:", error.message);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  // min height of the bottom collapse
  const bottomHeight = "42px";

  return (
    <div>
      {/* Leaflet map */}
      <div
        ref={ref}
        style={{
          // exactly above the bottom collapse so the maps attribution is visible
          height: `calc(100dvh - ${bottomHeight})`,
          zIndex: "var(--mantine-z-index-app)",
        }}
      />

      {/* GPS button */}
      <ActionIcon
        size="xl"
        variant="white"
        color="blue"
        onClick={getUserLocation}
        style={{
          position: "absolute",
          bottom: `calc(${bottomHeight})`, // position above bottom sheet
          right: "1rem",
          zIndex: "calc(var(--mantine-z-index-app) + 10)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
        title="Meinen Standort finden"
        aria-label="Meinen Standort finden"
        loading={isLocating}
      >
        <IconCircleFilled />
      </ActionIcon>

      {/* bottom panel collapse */}
      <div
        style={{
          position: "relative",
          height: bottomHeight,
        }}
      >
        <MapBottomSheet />
      </div>
    </div>
  );
}
