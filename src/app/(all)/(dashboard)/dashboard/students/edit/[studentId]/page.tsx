import { fetchClasses } from "@/lib/actions/classes.action";
import { fetcher } from "@/lib/fetcher";
import { StudentType } from "@/lib/types";
import UpdateForm from "../../../_components/UpdateForm";

type props = {
  params: {
    studentId: string;
  };
  searchParams: {
    selectedYearId: string | string[] | undefined;
  };
};
const fetchStudent = async (
  studentId: string | string[] | undefined,
  selectedYearId: string | string[] | undefined
) => {
  return fetcher(`/api/students/${studentId}?selectedYearId=${selectedYearId}`);
};

const StudentEditPage = async ({ params, searchParams }: props) => {
  const { studentId } = params;
  const { selectedYearId } = searchParams;

  const classes = await fetchClasses();
  const student: StudentType = await fetchStudent(studentId, selectedYearId);

  return <UpdateForm classes={classes} student={student} />;
};

export default StudentEditPage;
