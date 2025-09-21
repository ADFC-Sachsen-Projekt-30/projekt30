import * as z from "zod";
import type { LatLngBounds } from "./types";

const queryString = `
// Geschwindigkeiten von Straßen im 20m-Umkreis um Schulen in der bbox
// ROT:  mehr als Tempo 40, keine zeitbeschränkten Geschwindigkeitsreduktionen
// GELB: mehr als Tempo 40, aber zeitliche Geschwindigkeitsreduktionen
// GRÜN: Tempo 40 und geringer ohne zeitliche Beschränkungen
// GRAU: keine Infos vorhanden


[out:json][timeout:800];
(
  (
   nwr[amenity=hospital]({{bbox}});
  )->.schools;
  (
    way(around.schools:20)
[highway][highway!~"^(footway|path|service|pedestrian|steps|living_street|platform|cycleway|track)$"]
({{bbox}})->.streets;
  );
);

(way(around.streets:20).schools;)->.matchingSchools;
// print results

 ((.schools; .streets;);>;);

out body;
`;

const overpassApiQueryResultRuntype = z.object({
  version: z.number(),
  osm3s: z.unknown(),
  generator: z.string(),
  elements: z.array(
    z.discriminatedUnion("type", [
      z.object({
        type: z.literal("node"),
        id: z.number(),
        lat: z.number(),
        lon: z.number(),
        tags: z.optional(z.unknown()),
      }),
      z.object({
        type: z.literal("way"),
        id: z.number(),
        nodes: z.array(z.number()),
        tags: z.unknown(),
      }),
      z.object({
        type: z.literal("relation"),
        id: z.number(),
        members: z.unknown(),
        tags: z.unknown(),
      }),
    ]),
  ),
});

export async function runQuery(bbox: LatLngBounds) {
  const bboxString = `${bbox.southWest.lat},${bbox.southWest.lng},${bbox.northEast.lat},${bbox.northEast.lng}`;
  const query = queryString.replaceAll("{{bbox}}", bboxString);

  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: "data=" + encodeURIComponent(query),
  });

  const result = await response.json();

  const typedResult = overpassApiQueryResultRuntype.parse(result);

  return typedResult.elements.flatMap((e) => {
    if (e.type !== "node") {
      return [];
    }

    return { lat: e.lat, lng: e.lon };
  });
}
