import { fetchClasses } from "@/lib/actions/classes.action";
import { fetcher } from "@/lib/fetcher";
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
    <div className="p-4 m-4 h-[calc(100vh-70px)] overflow-y-auto bg-card rounded-lg">
      <SearchForm />
      <SearchFilter inputLabel="Search By Name Roll or StudentId..." />
      <hr />

      <DataTable data={students} searchParams={searchParams} />
      {totalStudents > Number(searchParams.pageSize || "10") && (
        <PaginationCom totalCount={totalStudents} />
      )}
    </div>
  );
};

export default StudentPage;
