import { PAGE_SIZE } from "@/const/data";
import { prisma } from "./connect";

// get user by email
export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    return null;
  }
};

// get user by id
export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  } catch (error) {
    return null;
  }
};

// get all classes
export const getClasses = async () => {
  try {
    const classes = await prisma?.class.findMany({
      select: {
        id: true,
        className: true,
        sectionName: true,
      },
    });
    return classes;
  } catch (error) {
    console.log(error);
    throw new Error("Getting Classes failed!!");
  }
};

// get current users
export const getCurrentUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    });
    return users;
  } catch (error) {
    console.log(error);
    throw new Error("Getting Users failed!!");
  }
};

// get student
export const getStudents = async (values: {
  className?: string;
  section?: string;
  search?: string;
  page?: number;
}) => {
  const pageNum = values.page || 1;
  const skip = (pageNum - 1) * PAGE_SIZE;

  try {
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

    const students = await prisma.student.findMany({
      where: filters,
      take: PAGE_SIZE,
      skip: skip,
    });

    return { students, totalCount };
  } catch (error) {
    console.log(error);
    throw new Error("Getting Students failed!!");
  }
};

// get single student

export const getStudent = async (studentId: number) => {
  try {
    const student = await prisma.student.findUnique({
      where: { studentId },
    });

    if (!student) {
      throw new Error("Student not found!");
    }
    return student;
  } catch (error) {
    console.log(error);
    throw new Error("Fetching Student failed!");
  }
};

//get results
export const getResult = async (
  studentId: number,
  session: number,
  className: string
) => {
  try {
    if (studentId && session && className) {
      const result = await prisma.student.findUnique({
        where: {
          studentId,
          sessionName: session,
          className: { contains: className, mode: "insensitive" },
        },
        select: {
          fullName: true,
          className: true,
          studentId: true,
          fatherName: true,
          motherName: true,
          dob: true,
          section: true,
          result: true,
        },
      });
      if (!result) {
        return { messege: "Result not found!" };
      }
      return { messege: "Success", result };
    }
  } catch (error) {
    console.log(error);
    throw new Error("Fetching Result failed!");
  }
};

//get session
export const getSession = async () => {
  try {
    const session = await prisma.session.findMany({
      select: {
        id: true,
        year: true,
      },
    });
    return session;
  } catch (error) {
    console.log(error);
    throw new Error("Fetching session failed!");
  }
};
