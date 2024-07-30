import { getClasses, getStudent } from "@/lib/data";
import UpdateForm from "../../../_components/UpdateForm";

type props = {
  params: {
    studentId: string;
  };
};
const StudentEditPage = async ({ params }: props) => {
  const studentId = params.studentId;
  const student = await getStudent(parseInt(studentId));
  const classes = await getClasses();

  return <UpdateForm classes={classes} student={student} />;
};

export default StudentEditPage;
