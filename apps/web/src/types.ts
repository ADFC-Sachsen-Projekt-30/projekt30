export interface LatLng {
  lat: number;
  lng: number;
}

export interface School {
  name: string;
  position: LatLng;
}


export interface LatLngBounds {
  southWest: LatLng;
  northEast: LatLng;
}

export interface QueryResult {
  points: LatLng[];
  pointsOfSchools: School[];
}
