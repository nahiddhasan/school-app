import { create } from "zustand";

interface AcademicYearStore {
  selectedYearId: string | null;
  setSelectedYear: (id: string) => void;
}

export const useAcademicYearStore = create<AcademicYearStore>((set) => ({
  selectedYearId: null,
  setSelectedYear: (id) => {
    set({ selectedYearId: id });

    const url = new URL(window.location.href);
    url.searchParams.set("selectedYearId", id);
    window.history.pushState({}, "", url.toString());
  },
}));
