import { prisma } from "@/lib/connect";
import CountUpNumber from "./CountUp";
import CustomCard from "./CustomCard";

const Counter = async () => {
  const teachers = await prisma.teacher.count();
  const currentAcademicYear = await prisma.academicYear.findFirst({
    where: { current: true },
    select: { id: true },
  });

  const students = await prisma.student.count({
    where: {
      enrollments: {
        some: {
          academicYearId: currentAcademicYear?.id,
        },
      },
    },
  });
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3 my-16">
      <CustomCard>
        <div className="flex flex-col items-center py-4">
          <span className="text-4xl font-bold">
            <CountUpNumber number={teachers} />
          </span>
          <span className="mt-2 text-lg">Total Teacher</span>
        </div>
      </CustomCard>
      <CustomCard>
        <div className="flex flex-col items-center py-4">
          <span className="text-4xl font-bold">
            <CountUpNumber number={students} />
          </span>
          <span className="mt-2 text-lg">Total Student</span>
        </div>
      </CustomCard>
      <CustomCard>
        <div className="flex flex-col items-center py-4">
          <span className="text-4xl font-bold">
            <CountUpNumber number={30} />
          </span>
          <span className="mt-2 text-lg">Total Staff</span>
        </div>
      </CustomCard>
    </section>
  );
};

export default Counter;
