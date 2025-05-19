import { fetchClasses } from "@/lib/actions/classes.action";
import "jspdf-autotable";
import SearchStudentReport from "./SearchStudentReport";

const StudentReport = async () => {
  const classes = await fetchClasses();

  return (
    <div className="p-4 space-y-6">
      <SearchStudentReport classes={classes} />
    </div>
  );
};

export default StudentReport;
