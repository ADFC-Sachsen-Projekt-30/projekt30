import * as z from "zod";
import type { LatLng, LatLngBounds } from "./types";

const queryString = `
// Geschwindigkeiten von Straßen im 20m-Umkreis um Schulen in der bbox
// ROT:  mehr als Tempo 40, keine zeitbeschränkten Geschwindigkeitsreduktionen
// GELB: mehr als Tempo 40, aber zeitliche Geschwindigkeitsreduktionen
// GRÜN: Tempo 40 und geringer ohne zeitliche Beschränkungen
// GRAU: keine Infos vorhanden


[out:json][timeout:5000];
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

out center;
`;

const queryStringSchools = `
// Findet Schulen um die Koordinaten {{coord}} mit Abstand {{distance}}
// und gibt das Zentrum des gefundenen Objekts zurück
[out:json][timeout:10000];

nwr[amenity=school](around:{{distance}},{{coord}});
out center;
`;

const queryStringMainStreet = `
// Findet Hauptstraßen um die Koordinaten {{coord}} mit Abstand {{distance}}
// und gibt das gefundenen Objekt inklusive Zentrum zurück
[out:json][timeout:5000];

way[highway][highway~"(primary|secondary|tertiary)"](around:{{distance}},{{coord}});
out center;
`;

// Findet die Gemeinde, die für Koordinaten {{coord}} zuständig ist
// und gibt das gefundenen Objekt inklusive Zentrum zurück
// (Admin Level 6 = Kreis / Kreisfreie Stadt;  Admin Level 8 Gemeinde / Stadt im Landkreis)
// Wichtig: In Dresden liefert die Query für admin_level 8 kein Ergebnis
const queryStringAdminUnit = `
[out:json][timeout:5000];

  is_in({{coord}})->.a;
  relation(pivot.a)[boundary=administrative][admin_level={{ADMINUNITLEVEL}}];
 out tags center;
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
        tags: z.optional(
          z.object({
            name: z.optional(z.string()),
          }),
        ),
      }),
      z.object({
        type: z.literal("way"),
        center: z.object({
          lat: z.number(),
          lon: z.number(),
        }),
        id: z.number(),
        nodes: z.array(z.number()),
        tags: z.optional(
          z.object({
            name: z.optional(z.string()),
          }),
        ),
      }),
      z.object({
        type: z.literal("relation"),
        center: z.object({
          lat: z.number(),
          lon: z.number(),
        }),
        id: z.number(),
        members: z.unknown(),
        tags: z.optional(
          z.object({
            name: z.optional(z.string()),
            official_name: z.optional(z.string()),
            "de:amtlicher_gemeindeschluessel": z.optional(z.string())
          }),
        ),
      }),
    ]),
  ),
});

async function parseResponseToCoordinates(response: Response) {
  const result = await response.json();

  const typedResult = overpassApiQueryResultRuntype.parse(result);

  return typedResult.elements.flatMap((e) => {
    if (e.type == "way") {
      return {
        lat: e.center.lat,
        lng: e.center.lon,
        name: e.tags?.name
      };
    }

    if (e.type == "relation") {
      return {
        lat: e.center.lat,
        lng: e.center.lon,
        name: e.tags?.name,
        official_name: e.tags?.official_name,
        amtlicher_gemeindeschluessel: e.tags?.["de:amtlicher_gemeindeschluessel"]
      };
    }


    return {
      lat: e.lat,
      lng: e.lon,
      name: e.tags?.name,
    };
  });
}

async function parseResponseToNamedObjectWithPosition(response: Response) {
  const result = await response.json();

  //console.log("Query Ergebnis");
  //console.log(result);

  const typedResult = overpassApiQueryResultRuntype.parse(result);

  return typedResult.elements.flatMap((e) => {
    let position: LatLng;
    if (e.type !== "node") {
      position = {
        lat: e.center.lat,
        lng: e.center.lon,
      };
    } else {
      position = {
        lat: e.lat,
        lng: e.lon,
      };
    }

    let name = "Unbekannt";
    let official_name = "undefined";
    let amtlicher_schluessel = "undefined";
    if (e.tags && e.tags.name) {
      name = e.tags.name;

      if (e.type == "relation"){
        if (e.tags.official_name) {
          official_name = e.tags.official_name;
        }
        if (e.tags["de:amtlicher_gemeindeschluessel"]) {
          amtlicher_schluessel = e.tags["de:amtlicher_gemeindeschluessel"];
        }

      }
    }

    return {
      name: name,
      official_name: official_name,
      amtlicher_schluessel: amtlicher_schluessel,
      position: position,
    };
  });
}

function overpassServer() { 
  // return "https://overpass-api.de/api/interpreter"  // 504 Gateway tiemout to often 
  return "https://overpass.private.coffee/api/interpreter"}

export async function runQuery(bbox: LatLngBounds) {
  const bboxString = `${bbox.southWest.lat},${bbox.southWest.lng},${bbox.northEast.lat},${bbox.northEast.lng}`;
  const query = queryString.replaceAll("{{bbox}}", bboxString);

  const response = await fetch(overpassServer(), {
    method: "POST",
    body: "data=" + encodeURIComponent(query),
  });

  return parseResponseToCoordinates(response);
}

async function runCoordQuery(
  baseQuery: string,
  point: LatLng,
  distance: number,
) {
  /*
   Runs an Overpass-query baseQuery where placeholder {{coord}} is replaced by the coordinate 
   string for parameter point and placeholder {{distance}} is replaced by 
   parameter distance
  */
  const pointString = `${point.lat},${point.lng}`;
  const query = baseQuery
    .replaceAll("{{coord}}", pointString)
    .replaceAll("{{distance}}", distance.toString());

  const response = await fetch(overpassServer(), {
    method: "POST",
    body: "data=" + encodeURIComponent(query),
  });

  return parseResponseToNamedObjectWithPosition(response);
}

export async function runSchoolQuery(point: LatLng, distance: number) {
  /*
   Runs the query for Schools where placeholder {{coord}} is replaced by the coordinate 
   string for parameter point and placeholder {{distance}} is replaced by 
   parameter distance
  */

  return runCoordQuery(queryStringSchools, point, distance);
}

export async function runMainStreetQuery(point: LatLng) {
  /*
   Runs the query for main Streets where placeholder {{coord}} is replaced by the coordinate 
   string for parameter point and placeholder {{distance}} is replaced by 5.0m
   TODO Experimentally detect the best value for distance
  */

  return runCoordQuery(queryStringMainStreet, point, 5.0);
}

export async function runAdminUnitQuery(point: LatLng) {
  /*
   Runs the query for Admin unit where placeholder {{coord}} is replaced by the coordinate 
   string for parameter point 
  */

  let query = queryStringAdminUnit.replaceAll("{{ADMINUNITLEVEL}}", "8");
    
  

  console.log("Gemeindequery: ", query);
  // "distance" 0.0 is unused and could be eliminated in a refactoring
  let adminUnits = await runCoordQuery(query, point, 0.0);

  if (adminUnits.length > 0) {
    return adminUnits.at(0);
  }

  
  query = queryStringAdminUnit.replaceAll("{{ADMINUNITLEVEL}}", "6");

  console.log("Stadtquery: ", query);
  adminUnits = await runCoordQuery(query, point, 0.0);

  if (adminUnits.length > 0) {
    return adminUnits.at(0);
  }


  return null;
}
