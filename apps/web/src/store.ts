import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { runQuery, runSchoolQuery, runMainStreetQuery, runAdminUnitQuery } from "./queries";
//import { runQuery } from "./queries";
import type { LatLng, LatLngBounds, QueryResult, NamedObjectWithPosition } from "./types";

interface Store {
  // current map bounding box
  bbox: LatLngBounds | null;
  setBbox(bbox: LatLngBounds): void;

  // current coordinate for coordinate based requests
  queryCoord: LatLng | null;
  setQueryCoord(queryCoord: LatLng): void;

  adminUnitAtCoord: NamedObjectWithPosition | null;
  setAdminUnitAtCoord(adminUnitAtCoord: NamedObjectWithPosition) : void;

  mainStreetsAtCoord: NamedObjectWithPosition[] | null;
  setmainStreetAtCoord(mainStreetAtCoord: NamedObjectWithPosition[]) : void;

  // overpass api query result
  queryResult: QueryResult | null;
  setQueryResult(qs: QueryResult): void;
  fetchQuery(): Promise<void>;
}

export const useStore = create<Store>()(
  subscribeWithSelector((set, get) => ({
    bbox: null,
    setBbox: (bbox) => {
      set((state) => ({ ...state, bbox }));
    },

    queryCoord: null,
    setQueryCoord: (queryCoord) => {
      set((state) => ({ ...state, queryCoord }));
    },

    mainStreetsAtCoord: null, 
    setmainStreetAtCoord: (mainStreetAtCoord) =>
      set( (state) => ({ ...state, mainStreetsAtCoord: mainStreetAtCoord}))  
    ,

    adminUnitAtCoord: null, 
    setAdminUnitAtCoord: (adminUnitAtCoord) =>
      set( (state) => ({ ...state, adminUnitAtCoord: adminUnitAtCoord}))  
    ,


    queryResult: null,
    setQueryResult: (queryResult) =>
      set((state) => ({ ...state, queryResult })),
    fetchQuery: async () => {
      const { bbox, queryCoord } = get();

      // Debug alert(queryCoord?.lat.toString() + " " + queryCoord?.lng.toString());

      if (!bbox) {
        return;
      }
      const result = await runQuery(bbox);

      let resultAdminUnitAtCoord: NamedObjectWithPosition | null;
      resultAdminUnitAtCoord = null;

      let resultMainStreetsAtCoord: NamedObjectWithPosition[];
      resultMainStreetsAtCoord=[];
      let resultSchools: NamedObjectWithPosition[];
      resultSchools=[];
      //TODO Refactoring: Run queries in parallel and update Map / Result lists whenever one of the queries terminates
      if (queryCoord) {
        resultAdminUnitAtCoord = await runAdminUnitQuery(queryCoord) || null;
        resultMainStreetsAtCoord = await runMainStreetQuery(queryCoord);
        // TODO: Ich benutze 100m Abstand zur Schule, weil ich gerade nicht herausfinden kann, was der Abstand tatsächlich sein darf
        resultSchools = await runSchoolQuery(queryCoord, 150);
        
      }

      set((state) => ({ ...state,
        mainStreetsAtCoord: resultMainStreetsAtCoord,
        adminUnitAtCoord: resultAdminUnitAtCoord,
        queryResult: { points: result, pointsOfSchools: resultSchools
         } }));
    },
  })),
);

useStore.subscribe(
  (state) => state.queryCoord,
  () => {
    useStore.getState().fetchQuery();
  },
);
