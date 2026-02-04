import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import {
  runSchoolQuery,
  // runKindergartenQuery,
  runMainStreetQuery,
  runAdminUnitQuery,
} from "./queries";
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

    mainStreetsAtCoord: null,
    queryResult: null,
    setQueryResult: (queryResult) =>
      set((state) => ({ ...state, queryResult })),

    fetchQuery: async () => {
      const { queryCoord } = get();

      if (!queryCoord) {
        set((state) => ({
          ...state,
          mainStreetsAtCoord: null,
        }));

        return;
      }

      let resultAdminUnitAtCoord: NamedObjectWithPosition | null = null;
      let resultMainStreetsAtCoord: NamedObjectWithPosition[] = null;
      // let resultSchools: NamedObjectWithPosition[];
      // resultSchools = [];

      //TODO Refactoring: Run queries in parallel and update Map / Result lists whenever one of the queries terminates
      if (queryCoord) {
        // resultAdminUnitAtCoord = (await runAdminUnitQuery(queryCoord)) || null;
        // console.log("Gefundener Kreis:", resultAdminUnitAtCoord);
        // resultMainStreetsAtCoord = await runMainStreetQuery(queryCoord);
        // console.log("Gefundene Straßen:", resultMainStreetsAtCoord);

        // In overpass distances are in meter, but the School server takes distances in km.
        resultSchools = await runSchoolQuery(queryCoord, 0.3);
        console.log("Gefundene Schulen:", resultSchools);
      }

      set((state) => ({
        ...state,
        mainStreetsAtCoord: resultMainStreetsAtCoord,
        queryResult: { pointsOfSchools: resultSchools },
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
