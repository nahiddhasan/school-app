import { getBulkStudents, getClasses } from "@/lib/data";
import SearchForm from "../../_components/searchFrom/SearchForm";
import BulkDeleteData from "./BulkDeleteData";
import columns from "./columns";
type props = {
  searchParams: {
    className: string;
    section?: string;
  };
};
const BulkDelete = async ({ searchParams }: props) => {
  const classes = await getClasses();
  const students = await getBulkStudents(searchParams);

  return (
    <div className="p-4 overflow-y-auto h-full pb-10">
      <SearchForm classes={classes} />
      <BulkDeleteData columns={columns} data={students} />
    </div>
  );
};

export default BulkDelete;
