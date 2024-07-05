import { auth } from "@/auth";
import { prisma } from "../connect";
// get student
export const getStudents = async (values: {
  className?: string;
  section?: string;
  search?: string;
  page?: string;
  pageSize?: string;
}) => {
  const session = await auth();

  const pageNum = parseInt(values.page || "1");
  const initialPageSize = parseInt(values.pageSize || "10");

  // limit maximum 50 item per page
  const pageSize = initialPageSize > 50 ? 50 : initialPageSize;
  const skip = (pageNum - 1) * pageSize;

  try {
    //check session
    if (!session) {
      throw new Error("You are not authinticated!");
    }

    const filters: any = {
      className: values.className || "",
      ...(values.section && { section: values.section }),
      ...(values.search && {
        OR: [
          { fullName: { contains: values.search, mode: "insensitive" } },
          { studentId: parseInt(values.search) || 0 },
          { classRoll: { contains: values.search, mode: "insensitive" } },
        ],
      }),
    };

    const totalCount = await prisma.student.count({
      where: filters,
    });

    //TODO: need to change classroll type to number
    const students = await prisma.student.findMany({
      where: filters,
      take: pageSize,
      skip: skip,
      // orderBy: {
      //   classRoll: "asc",
      // },
    });

    return { students, totalCount };
  } catch (error) {
    console.log(error);
    throw new Error("Getting Students failed!!");
  }
};
