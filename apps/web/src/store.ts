import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { runMainStreetQuery } from "./queries";
import { schoolsIndex, type SchoolPoint } from "./school-index";
import type {
  LatLng,
  LatLngBounds,
  NamedObjectWithPosition,
  QueryResult,
} from "./types";

interface SchoolChecklistState {
  hasExitToStreet: boolean; // "hat schule ausgang zur strasse"
  isTempo50: boolean; // "ist strasse noch tempo 50"
}

interface Store {
  schoolChecklist: SchoolChecklistState;
  setSchoolChecklist: (checklist: SchoolChecklistState) => void;
  // current coordinate for coordinate based requests
  queryCoord: LatLng | null;
  setQueryCoord(queryCoord: LatLng): void;

  // main streets near query coordinate
  mainStreetsAtCoord: NamedObjectWithPosition[] | null;

  // overpass api query result for schools near query coordinate
  queryResult: QueryResult | null;

  // selected school marker
  selectedSchool: SchoolPoint | null;
  setSelectedSchool: (school: SchoolPoint | null) => void;

  // schools in current map viewport
  viewportSchools: SchoolPoint[];
  queryViewportSchools(bounds: LatLngBounds, boundsSize: number): void;

  fetchQuery(): Promise<void>;
}

export const useStore = create<Store>()(
  subscribeWithSelector((set, get) => ({
    queryCoord: null,
    setQueryCoord: (queryCoord) => {
      set((state) => ({ ...state, queryCoord }));
    },
    schoolChecklist: { hasExitToStreet: false, isTempo50: false },
    setSchoolChecklist: (schoolChecklist) => {
      set((state) => ({ ...state, schoolChecklist }));
    },
    mainStreetsAtCoord: null,
    queryResult: null,
    selectedSchool: null,
    setSelectedSchool: (selectedSchool) => {
      set((state) => ({ ...state, selectedSchool }));
    },
    viewportSchools: [],
    queryViewportSchools: (bounds, boundsSize) => {
      // limit the amount of visible markers to not overload the map
      const schoolsInViewport =
        boundsSize < 40_000 ? schoolsIndex.queryBounds(bounds) : [];

      set((state) => ({ ...state, viewportSchools: schoolsInViewport }));
    },
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

useStore.subscribe(
  (state) => state.selectedSchool,
  (school) => {
    const { setQueryCoord, setSchoolChecklist } = useStore.getState();

    setSchoolChecklist({ hasExitToStreet: false, isTempo50: false });

    if (school) {
      setQueryCoord({ lat: school.lat, lng: school.lng });
    }
  },
);
