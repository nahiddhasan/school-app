import { fetcher } from "@/lib/fetcher";
import SearchForm from "../../_components/searchFrom/SearchForm";
import EnrollmentDataTable from "./EnrollmentDataTable";
import columns from "./columns";

type searchParams = { [key: string]: string | string[] | undefined };

const fetchPromotePreview = async (searchParams: searchParams) => {
  const query = new URLSearchParams(
    searchParams as Record<string, string>
  ).toString();
  return fetcher(`/api/promote/preview?${query}`);
};

const Enrollment = async ({ searchParams }: { searchParams: searchParams }) => {
  const students = await fetchPromotePreview(searchParams);

  return (
    <div className="p-4 h-full overflow-y-scroll pb-14">
      <SearchForm />
      <EnrollmentDataTable columns={columns} data={students} />
    </div>
  );
};

export default Enrollment;
