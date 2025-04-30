"use server";
import { auth } from "@/auth";
import { prisma } from "../connect";

export const getAcademicYears = async () => {
  const session = await auth();

  if (!session) {
    throw new Error("You are not authenticated...");
  }
  try {
    const years = await prisma.academicYear.findMany();
    return years;
  } catch (error) {
    throw new Error("error fetching academic years");
  }
};
