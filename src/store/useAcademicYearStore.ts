import { AcademicYear } from "@/app/generated/prisma";
import { create } from "zustand";

interface AcademicYearStore {
  selectedYearId: string | null;
  years: AcademicYear[];
  currentYear: AcademicYear | null;
  setSelectedYear: (id: string) => void;
  setYears: (years: AcademicYear[]) => void;
  setCurrentYear: (year: AcademicYear) => void;
}

export const useAcademicYearStore = create<AcademicYearStore>((set) => ({
  selectedYearId: null,
  years: [],
  currentYear: null,
  setSelectedYear: (id) => {
    set({ selectedYearId: id });

    const url = new URL(window.location.href);
    url.searchParams.set("selectedYearId", id);
    window.history.pushState({}, "", url.toString());
  },
  setYears: (years) => set({ years }),
  setCurrentYear: (year) => set({ currentYear: year, selectedYearId: year.id }),
}));
