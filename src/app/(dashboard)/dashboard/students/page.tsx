import { getClasses } from "@/lib/data";
import { getStudents } from "@/lib/protectedDataFetch/getAllStudents.data";
import { Suspense } from "react";
import SearchFilter from "../_components/SearchFilter";
import DataTable from "../_components/dataTable/DataTable";
import PaginationCom from "../_components/pagination/Pagination";
import SearchForm from "../_components/searchFrom/SearchForm";
type props = {
  searchParams: {
    className?: string;
    section?: string;
    search?: string;
    pageSize?: string;
  };
};
const StudentPage = async ({ searchParams }: props) => {
  const classes = await getClasses();
  const { students, totalCount } = await getStudents(searchParams);

  return (
    <div className="p-4 h-full overflow-y-scroll pb-14">
      <SearchForm classes={classes} />
      <SearchFilter inputLabel="Search By Name Roll or StudentId..." />
      <hr />

      <Suspense fallback={<span>Loading...</span>}>
        <DataTable data={students} />
        {totalCount > Number(searchParams.pageSize || "10") && (
          <PaginationCom totalCount={totalCount} />
        )}
      </Suspense>
    </div>
  );
};

export default StudentPage;
