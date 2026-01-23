export interface LatLng {
  lat: number;
  lng: number;
}

export interface NamedObjectWithPosition {
  name: string;
  amtlicher_schluessel: string | null;
  position: LatLng;
}

export interface LatLngBounds {
  southWest: LatLng;
  northEast: LatLng;
}

export interface QueryResult {
  pointsOfSchools: NamedObjectWithPosition[];
}

export interface AdminUnitData {
  ID: string; // unused / could be removed
  SCHLNR: string; // Deutschlandweit einduetiger Schlüssel der Gemeinde / kreisfreien Stadt
  AMTSBEZ_BM: string; // "Bürgermeister" / "Bürgermeisterin"
  TITEL: string; // akad. Titel des Amtsinhabers
  BM_NACHNAME: string;
  STRASSE: string;
  PLZ: string;
  ORT: string;
  E_MAIL: string;
}
