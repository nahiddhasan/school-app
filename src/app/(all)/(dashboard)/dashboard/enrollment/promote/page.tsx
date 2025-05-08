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
    <div className="p-4 m-4 h-[calc(100vh-70px)] overflow-y-auto bg-card rounded-lg">
      <SearchForm requireSection />
      <EnrollmentDataTable columns={columns} data={students} />
    </div>
  );
};

export default Enrollment;
