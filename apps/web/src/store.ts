import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { runQuery, runSchoolQuery } from "./queries";
//import { runQuery } from "./queries";
import type { LatLng, LatLngBounds, QueryResult } from "./types";

interface Store {
  // current map bounding box
  bbox: LatLngBounds | null;
  setBbox(bbox: LatLngBounds): void;

  // current coordinate for coordinate based requests
  queryCoord: LatLng | null;
  setQueryCoord(queryCoord: LatLng): void;


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


    queryResult: null,
    setQueryResult: (queryResult) =>
      set((state) => ({ ...state, queryResult })),
    fetchQuery: async () => {
      const { bbox, queryCoord } = get();

      if (!bbox) {
        return;
      }

      let resultSchools: LatLng[];
      const result = await runQuery(bbox);
      
      resultSchools=[];
      
      if (queryCoord) {
        // TODO: Ich benutze 100m Abstand zur Schule, weil ich gerade nicht herausfinden kann, was der Abstand tatsächlich sein darf
        resultSchools = await runSchoolQuery(queryCoord, 100);
      }
      set((state) => ({ ...state, queryResult: { points: result, pointsOfSchools: resultSchools
         } }));
    },
  })),
);

useStore.subscribe(
  (state) => state.bbox,
  () => {
    useStore.getState().fetchQuery();
  },
);
