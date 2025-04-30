import { useAcademicYearStore } from "@/store/useAcademicYearStore";

export function useAcademicLink(href: string) {
  // const searchParams = useSearchParams();
  // const academicYearId = searchParams.get("academicYearId");
  const { selectedYearId } = useAcademicYearStore();

  if (selectedYearId) {
    return `${href}?selectedYearId=${selectedYearId}`;
  }

  return href;
}
