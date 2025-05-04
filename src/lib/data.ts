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
