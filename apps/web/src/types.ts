export interface LatLng {
  lat: number;
  lng: number;
}

export interface NamedObjectWithPosition {
  name: string;
  position: LatLng;
}


export interface LatLngBounds {
  southWest: LatLng;
  northEast: LatLng;
}

export interface QueryResult {
  points: LatLng[];
  pointsOfSchools: NamedObjectWithPosition[];
}
