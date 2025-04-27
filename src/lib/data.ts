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
      // orderBy: {
      //   className: "desc",
      // },
    });
    return classes;
  } catch (error) {
    console.log(error);
    throw new Error("Getting Classes failed!!");
  }
};

// get single student

export const getStudent = async (studentId: number) => {
  try {
    const student = await prisma.student.findUnique({
      where: { studentId },
      include: { result: true },
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

// get student
export const getBulkStudents = async (values: {
  className?: string;
  section?: string;
}) => {
  try {
    const filters: any = {
      className: values.className || "",
      ...(values.section && { section: values.section }),
    };

    const bulkSutdents = await prisma.student.findMany({
      where: filters,
    });

    return bulkSutdents;
  } catch (error) {
    console.log(error);
    throw new Error("Getting BulkStudents failed!!");
  }
};

// result report
export const resultReport = async () => {
  try {
    const resultByClass = await prisma.class.findFirst({
      where: { className: "Six" },
      select: {
        result: {
          select: {
            studentId: true,
            gpa: true,
            status: true,
          },
        },
      },
    });
    return resultByClass;
  } catch (error) {
    console.log(error);
  }
};

//get notices
export const getNotices = async () => {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return notices;
  } catch (error) {
    console.log(error);
    throw new Error("Fetching notices failed!");
  }
};

//get single notice
export const getSingleNotice = async (id: string) => {
  try {
    const notice = await prisma.notice.findUnique({
      where: {
        id: id,
      },
    });

    return notice;
  } catch (error) {
    console.log(error);
    throw new Error("Fetching notice failed!");
  }
};
