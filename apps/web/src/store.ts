import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { runMainStreetQuery } from "./queries";
import type { LatLng, NamedObjectWithPosition, QueryResult } from "./types";

interface Store {
  // current coordinate for coordinate based requests
  queryCoord: LatLng | null;
  setQueryCoord(queryCoord: LatLng): void;

  // main streets near query coordinate
  mainStreetsAtCoord: NamedObjectWithPosition[] | null;

  // overpass api query result for schools near query coordinate
  queryResult: QueryResult | null;
  fetchQuery(): Promise<void>;
}

export const useStore = create<Store>()(
  subscribeWithSelector((set, get) => ({
    queryCoord: null,
    setQueryCoord: (queryCoord) => {
      set((state) => ({ ...state, queryCoord }));
    },
    mainStreetsAtCoord: null,
    queryResult: null,
    fetchQuery: async () => {
      const { queryCoord } = get();

      if (!queryCoord) {
        set((state) => ({
          ...state,
          mainStreetsAtCoord: null,
        }));

        return;
      }

      const mainStreetsAtCoord = await runMainStreetQuery(queryCoord);

      set((state) => ({
        ...state,
        mainStreetsAtCoord,
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
