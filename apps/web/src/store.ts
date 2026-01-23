import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import {
  runSchoolQuery,
  // runKindergartenQuery,
  runMainStreetQuery,
  runAdminUnitQuery,
} from "./queries";
import { parseCsvAdminUnitsSaxony } from "./AdminUnitAddressSaxony";
import type {
  LatLng,
  QueryResult,
  NamedObjectWithPosition,
  AdminUnitData,
} from "./types";

interface Store {
  // current coordinate for coordinate based requests
  queryCoord: LatLng | null;
  setQueryCoord(queryCoord: LatLng): void;

  // Gemeinde oder Stadt-Schlüssel at query coordinate
  adminUnitAtCoord: NamedObjectWithPosition | null;
  setAdminUnitAtCoord(adminUnitAtCoord: NamedObjectWithPosition): void;

  // main streets near query coordinate
  mainStreetsAtCoord: NamedObjectWithPosition[] | null;
  setmainStreetAtCoord(mainStreetAtCoord: NamedObjectWithPosition[]): void;

  // overpass api query result for schools near query coordinate
  queryResult: QueryResult | null;
  setQueryResult(qs: QueryResult): void;
  fetchQuery(): Promise<void>;

  // List of contact data for each Saxonian Gemeinde / kreisfreie Stadt
  adminUnitsSaxony: AdminUnitData[] | null;
  setAdminUnitsSaxony(adminUnitsSaxony: AdminUnitData[]): void;
}

export const useStore = create<Store>()(
  subscribeWithSelector((set, get) => ({
    queryCoord: null,
    setQueryCoord: (queryCoord) => {
      set((state) => ({ ...state, queryCoord }));
    },

    adminUnitsSaxony: null,
    setAdminUnitsSaxony: (adminUnitsSaxony) =>
      set((state) => ({ ...state, adminUnitsSaxony: adminUnitsSaxony })),

    mainStreetsAtCoord: null,
    setmainStreetAtCoord: (mainStreetAtCoord) =>
      set((state) => ({ ...state, mainStreetsAtCoord: mainStreetAtCoord })),
    adminUnitAtCoord: null,
    setAdminUnitAtCoord: (adminUnitAtCoord) =>
      set((state) => ({ ...state, adminUnitAtCoord: adminUnitAtCoord })),
    queryResult: null,
    setQueryResult: (queryResult) =>
      set((state) => ({ ...state, queryResult })),

    fetchQuery: async () => {
      const { queryCoord, adminUnitsSaxony } = get();

      let parsedAdminUnitsSaxony = adminUnitsSaxony;
      if (!adminUnitsSaxony) {
        try {
          parsedAdminUnitsSaxony = await parseCsvAdminUnitsSaxony();
          console.log(parsedAdminUnitsSaxony);
        } catch (error) {
          console.error(
            "Fehler beim Laden der sächsischen Gemeinde-Daten:",
            error,
          );
        }
      }
      //TODO : Do a get on the adminUnitsSaxony  if it is null, then call papa parse and set the result via
      //setADminUnitsAtCoord()

      // Debug alert(queryCoord?.lat.toString() + " " + queryCoord?.lng.toString());

      let resultAdminUnitAtCoord: NamedObjectWithPosition | null;
      resultAdminUnitAtCoord = null;

      let resultMainStreetsAtCoord: NamedObjectWithPosition[];
      resultMainStreetsAtCoord = [];
      let resultSchools: NamedObjectWithPosition[];
      resultSchools = [];
      //TODO Refactoring: Run queries in parallel and update Map / Result lists whenever one of the queries terminates
      if (queryCoord) {
        resultAdminUnitAtCoord = (await runAdminUnitQuery(queryCoord)) || null;
        console.log("Gefundener Kreis:", resultAdminUnitAtCoord);
        resultMainStreetsAtCoord = await runMainStreetQuery(queryCoord);
        console.log("Gefundene Straßen:", resultMainStreetsAtCoord);

        // In overpass distances are in meter, but the School server takes distances in km.
        resultSchools = await runSchoolQuery(queryCoord, 0.3);
        console.log("Gefundene Schulen:", resultSchools);
      }

      set((state) => ({
        ...state,
        mainStreetsAtCoord: resultMainStreetsAtCoord,
        adminUnitAtCoord: resultAdminUnitAtCoord,
        queryResult: { pointsOfSchools: resultSchools },
        adminUnitsSaxony: parsedAdminUnitsSaxony,
      }));
    },
  })),
);

useStore.subscribe(
  (state) => state.queryCoord,
  () => {
    useStore.getState().fetchQuery();
  },
);
