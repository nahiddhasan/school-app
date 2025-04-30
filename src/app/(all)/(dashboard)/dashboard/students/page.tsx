import { fetchClasses } from "@/lib/actions/classes.action";
import { fetcher } from "@/lib/fetcher";
import { Suspense } from "react";
import DataTable from "../_components/dataTable/DataTable";
import PaginationCom from "../_components/pagination/Pagination";
import SearchFilter from "../_components/SearchFilter";
import SearchForm from "../_components/searchFrom/SearchForm";

type searchParams = { [key: string]: string | string[] | undefined };

const fetchStudents = async (searchParams: searchParams) => {
  const query = new URLSearchParams(
    searchParams as Record<string, string>
  ).toString();
  return fetcher(`/api/students?${query}`);
};

const StudentPage = async ({
  searchParams,
}: {
  searchParams: searchParams;
}) => {
  const classes = await fetchClasses();
  const { students, totalStudents } = await fetchStudents(searchParams);

  return (
    <div className="p-4 h-full overflow-y-scroll pb-14">
      <SearchForm classes={classes} />
      <SearchFilter inputLabel="Search By Name Roll or StudentId..." />
      <hr />

      <Suspense fallback={<span>Loading...</span>}>
        <DataTable
          data={students}
          selectedYearId={searchParams.selectedYearId}
        />
        {totalStudents > Number(searchParams.pageSize || "10") && (
          <PaginationCom totalCount={totalStudents} />
        )}
      </Suspense>
    </div>
  );
};

export default StudentPage;
