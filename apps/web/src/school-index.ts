import type { LatLngBounds } from "./types";
import { schools, type School } from "./data/schools";

export interface SchoolPoint {
  // index props
  id: number;
  name: string;
  lat: number;
  lng: number;

  // metadata
  building: School["buildings"][number];
}

// ad hoc spatial index generated with deepseek + codex-cli,
// works fine and ist just a few lines of simple code
// if we need more points here maybe use sth. more sophisticated like
// geokdbush
class SchoolGridIndex {
  private grid: Map<string, SchoolPoint[]> = new Map();
  private cellSize: number;

  constructor(cellSize: number = 0.01) {
    this.cellSize = cellSize;
  }

  build(schoolsData: typeof schools): void {
    this.grid.clear();

    schoolsData.forEach((school) => {
      school.buildings.forEach((building) => {
        if (!building.relocated) {
          const key = this.getCellKey(building.latitude, building.longitude);
          if (!this.grid.has(key)) {
            this.grid.set(key, []);
          }
          this.grid.get(key)!.push({
            id: school.id,
            name: school.name,
            lat: building.latitude,
            lng: building.longitude,
            building,
          });
        }
      });
    });
  }

  private getCellKey(lat: number, lng: number): string {
    const latCell = Math.floor(lat / this.cellSize);
    const lngCell = Math.floor(lng / this.cellSize);
    return `${latCell},${lngCell}`;
  }

  queryBounds(bounds: LatLngBounds): SchoolPoint[] {
    const results: SchoolPoint[] = [];
    const minLat = Math.min(bounds.southWest.lat, bounds.northEast.lat);
    const maxLat = Math.max(bounds.southWest.lat, bounds.northEast.lat);
    const minLng = Math.min(bounds.southWest.lng, bounds.northEast.lng);
    const maxLng = Math.max(bounds.southWest.lng, bounds.northEast.lng);

    for (
      let latCell = Math.floor(minLat / this.cellSize);
      latCell <= Math.floor(maxLat / this.cellSize);
      latCell++
    ) {
      for (
        let lngCell = Math.floor(minLng / this.cellSize);
        lngCell <= Math.floor(maxLng / this.cellSize);
        lngCell++
      ) {
        const key = `${latCell},${lngCell}`;
        const cells = this.grid.get(key);
        if (cells) {
          results.push(
            ...cells.filter(
              (p) =>
                p.lat >= minLat &&
                p.lat <= maxLat &&
                p.lng >= minLng &&
                p.lng <= maxLng,
            ),
          );
        }
      }
    }

    return results;
  }
}

export const schoolsIndex = new SchoolGridIndex();
schoolsIndex.build(schools);
