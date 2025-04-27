import { getClasses } from "@/lib/data";
import "jspdf-autotable";
import SearchStudentReport from "./SearchStudentReport";
type props = {
  searchParams: {
    className?: string;
    section?: string;
  };
};
const StudentReport = async ({ searchParams }: props) => {
  const classes = await getClasses();

  return (
    <div className="p-4 space-y-6">
      <SearchStudentReport classes={classes} />
    </div>
  );
};

export default StudentReport;
