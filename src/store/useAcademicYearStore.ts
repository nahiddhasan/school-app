import { AcademicYear } from "@/app/generated/prisma";
import { create } from "zustand";

interface AcademicYearStore {
  selectedYearId: string | null;
  years: AcademicYear[];
  currentYear: AcademicYear | null;
  isCurrent: boolean;
  setSelectedYear: (id: string) => void;
  setYears: (years: AcademicYear[]) => void;
  setCurrentYear: (year: AcademicYear) => void;
}

export const useAcademicYearStore = create<AcademicYearStore>((set, get) => ({
  selectedYearId: null,
  years: [],
  currentYear: null,
  isCurrent: false,

  setSelectedYear: (id) => {
    const currentYear = get().currentYear;
    const isCurrent = currentYear ? currentYear.id === id : false;

    set({
      selectedYearId: id,
      isCurrent,
    });

    const url = new URL(window.location.href);
    url.searchParams.set("selectedYearId", id);
    url.searchParams.set("isCurrent", String(isCurrent));
    window.history.pushState({}, "", url.toString());
  },

  setYears: (years) => set({ years }),

  setCurrentYear: (year) => {
    const selectedYearId = get().selectedYearId ?? year.id;
    const isCurrent = selectedYearId === year.id;

    set({
      currentYear: year,
      selectedYearId,
      isCurrent,
    });

    const url = new URL(window.location.href);
    url.searchParams.set("selectedYearId", selectedYearId);
    url.searchParams.set("isCurrent", String(isCurrent));
    window.history.pushState({}, "", url.toString());
  },
}));
