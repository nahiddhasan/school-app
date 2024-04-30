import { PAGE_SIZE } from "@/const/data";
import { getClasses, getStudents } from "@/lib/data";
import DataTable from "../_components/dataTable/DataTable";
import PaginationCom from "../_components/pagination/Pagination";
import SearchForm from "../_components/searchFrom/SearchForm";
type props = {
  searchParams: {
    className?: string;
    section?: string;
    search?: string;
  };
};
const StudentPage = async ({ searchParams }: props) => {
  const classes = await getClasses();
  const { students, totalCount } = await getStudents(searchParams);

  return (
    <div className="p-4 h-full">
      <SearchForm classes={classes} />
      <div className="">
        <DataTable data={students} />
        {totalCount > PAGE_SIZE && <PaginationCom totalCount={totalCount} />}
      </div>
    </div>
  );
};

export default StudentPage;
