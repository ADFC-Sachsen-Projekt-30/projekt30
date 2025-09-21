import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { runQuery } from "./queries";
import type { LatLngBounds, QueryResult } from "./types";

interface Store {
  // current map bounding box
  bbox: LatLngBounds | null;
  setBbox(bbox: LatLngBounds): void;

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

    queryResult: null,
    setQueryResult: (queryResult) =>
      set((state) => ({ ...state, queryResult })),
    fetchQuery: async () => {
      const { bbox } = get();

      if (!bbox) {
        return;
      }

      const result = await runQuery(bbox);

      set((state) => ({ ...state, queryResult: { points: result } }));
    },
  })),
);

useStore.subscribe(
  (state) => state.bbox,
  () => {
    useStore.getState().fetchQuery();
  },
);
