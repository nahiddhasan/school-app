"use server";
import { auth } from "@/auth";
import { prisma } from "../connect";

export const studentReport = async (values: {
  className?: string;
  section?: string;
}) => {
  const session = await auth();

  try {
    //check session
    if (!session) {
      throw new Error("You are not authinticated!");
    }
    const filters: any = {
      ...(values.className && { className: values.className }),
      ...(values.section && { section: values.section }),
    };
    const student = await prisma.student.findMany({
      where: filters,
      orderBy: {
        className: "asc",
      },
    });
    return student;
  } catch (error) {
    console.log(error);
  }
};
