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
import { adminUnits } from "./data/adminUnits";

// helper types
interface PetitionChecklist {
  hasExitToStreet: boolean; // "hat schule ausgang zur strasse"
  isTempo50: boolean; // "ist strasse noch tempo 50"
}

interface AdminUnit {
  id: string;
  name: string;
  email: string;
}

// store defintion
interface Store {
  // current coordinate for coordinate based requests
  queryCoord: LatLng | null;
  setQueryCoord(queryCoord: LatLng): void;

  // main streets near query coordinate
  mainStreetsAtCoord: NamedObjectWithPosition[] | null;

  // overpass api query result for schools near query coordinate
  queryResult: QueryResult | null;
  fetchQuery(): Promise<void>;

  // schools in current map viewport
  viewportSchools: SchoolPoint[];
  queryViewportSchools(bounds: LatLngBounds, boundsSize: number): void;

  // selected school marker
  selectedSchool: SchoolPoint | null;
  setSelectedSchool: (school: SchoolPoint | null) => void;

  // current admin unit (based on selected school for now)
  adminUnit: AdminUnit | null;
  setAdminUnit(am: AdminUnit | null): void;

  // petition checklist
  petitionChecklist: PetitionChecklist;
  setPetitionChecklist: (checklist: PetitionChecklist) => void;
}

// store implementation
export const useStore = create<Store>()(
  subscribeWithSelector((set, get) => ({
    queryCoord: null,
    setQueryCoord: (queryCoord) => {
      set((state) => ({ ...state, queryCoord }));
    },
    petitionChecklist: { hasExitToStreet: false, isTempo50: false },
    setPetitionChecklist: (petitionChecklist) => {
      set((state) => ({ ...state, petitionChecklist }));
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

    adminUnit: null,
    setAdminUnit: (adminUnit: AdminUnit | null) => {
      set((state) => ({ ...state, adminUnit }));
    },
  })),
);

// fetch query if query coord changes
useStore.subscribe(
  (state) => state.queryCoord,
  () => {
    useStore.getState().fetchQuery();
  },
);

// set admin unit based on the selected school
useStore.subscribe(
  (state) => state.selectedSchool,
  (school) => {
    console.log("SELECTED SCHOOL");

    const { setAdminUnit } = useStore.getState();

    if (!school) {
      setAdminUnit(null);

      return;
    }

    const adminUnit = adminUnits.find(
      (unit) =>
        unit.SCHLNR === school.building.community_key ||
        unit.SCHLNR === school.building.community_part_key,
    );

    if (!adminUnit) {
      setAdminUnit(null);

      return;
    }

    setAdminUnit({
      id: adminUnit.ID,
      email: adminUnit.E_MAIL,
      name: adminUnit.GEMEINDE,
    });
  },
);

// initialize petition checklist
useStore.subscribe(
  (state) => state.selectedSchool,
  (school) => {
    const { setQueryCoord, setPetitionChecklist } = useStore.getState();

    setPetitionChecklist({ hasExitToStreet: false, isTempo50: false });

    if (school) {
      setQueryCoord({ lat: school.lat, lng: school.lng });
    }
  },
);
