import { Prisma, Role } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { prisma } from "../connect";

// get current users
export const getCurrentUsers = async (values: {
  pageSize?: string;
  search?: string;
  page?: string;
  type: Role;
}) => {
  const session = await auth();

  const pageNum = parseInt(values.page || "1");
  const initialPageSize = parseInt(values.pageSize || "10");

  // limit maximum 50 item per page
  const pageSize = initialPageSize > 50 ? 50 : initialPageSize;

  const skip = (pageNum - 1) * pageSize;

  if (!session) {
    throw new Error("You are not Logged In!!");
  }

  if (session.user.role !== "ADMIN") {
    throw new Error("You are not Authorized!!");
  }

  try {
    const filters: Prisma.UserWhereInput = {
      ...(values.search && {
        OR: [
          { name: { contains: values.search, mode: "insensitive" } },
          { email: { contains: values.search, mode: "insensitive" } },
        ],
      }),
      role: values.type,
    };

    const users = await prisma.user.findMany({
      where: filters,
      take: pageSize,
      skip: skip,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        studentId: true,
        role: true,
        isDisabled: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const usersCount = await prisma.user.count();

    return { users, usersCount };
  } catch (error) {
    console.log(error);
    throw new Error("Getting Users failed!!");
  }
};
