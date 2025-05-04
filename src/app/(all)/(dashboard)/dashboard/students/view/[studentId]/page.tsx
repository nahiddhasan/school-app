import { fetcher } from "@/lib/fetcher";
import { StudentType } from "@/lib/types";
import Image from "next/image";
import QrCode from "../_components/QrCode";
import RightView from "../_components/RightView";

type searchParams = { [key: string]: string | string[] | undefined };

const fetchStudent = async (
  studentId: string | string[] | undefined,
  selectedYearId: string | string[] | undefined
) => {
  return fetcher(`/api/students/${studentId}?selectedYearId=${selectedYearId}`);
};

const SingleStudentPage = async ({
  params,
  searchParams,
}: {
  params: searchParams;
  searchParams: searchParams;
}) => {
  const { studentId } = params;
  const { selectedYearId } = searchParams;

  const student: StudentType = await fetchStudent(studentId, selectedYearId);

  return (
    <div className=" flex h-full overflow-y-auto">
      <div className="flex-1  border-r border-border p-3">
        <div className="relative w-1/2 aspect-square flex items-center justify-center mx-auto my-4">
          <Image
            src={student.studentImg || "/img/avatar.png"}
            fill
            alt=""
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-center text-2xl truncate">{student.fullName}</h1>
          {/* othres details  */}
          <div className="flex flex-col gap-2 my-2">
            <h2 className="w-full px-2 py-1 border-b">
              StudentId:
              <span className="float-end font-semibold">
                {student.studentId}
              </span>
            </h2>
            <h2 className="w-full px-2 py-1 border-b">
              Class:
              <span className="float-end font-semibold">
                {student.enrollments[0].class?.className}
              </span>
            </h2>
            <h2 className="w-full px-2 py-1 border-b">
              Section:
              <span className="float-end font-semibold">
                {student.enrollments[0].section}
              </span>
            </h2>
            <h2 className="w-full px-2 py-1 border-b">
              Class Roll:
              <span className="float-end font-semibold">
                {student.enrollments[0].classRoll}
              </span>
            </h2>
            <h2 className="w-full px-2 py-1 border-b">
              Gender:
              <span className="float-end font-semibold">{student.gender}</span>
            </h2>
            {student.bloodGroup && (
              <h2 className="w-full px-2 py-1 border-b">
                Blood Group:
                <span className="float-end font-semibold">
                  {student.bloodGroup}
                </span>
              </h2>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center">
          <QrCode student={student} />
        </div>
      </div>
      <div className="flex-[2] p-2 overflow-y-auto">
        <RightView student={student} />
      </div>
    </div>
  );
};

export default SingleStudentPage;
