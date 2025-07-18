import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import TeacherProfile from "../../_components/TeacherProfile";

const TeacherProfilePage = async ({ params }: { params: any }) => {
  const { id } = params;
  if (!id) return <div>Teacher Id not found</div>;
  const session = await auth();
  const teacher = await prisma.teacher.findUnique({
    where: {
      teacherId: Number(id),
      schoolId: session?.user.schoolId,
    },
    include: {
      user: true,
      schedules: {
        include: {
          class: true,
          subject: true,
          teacher: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!teacher) return <div>Teacher not found</div>;
  return <TeacherProfile teacher={teacher} />;
};

export default TeacherProfilePage;
