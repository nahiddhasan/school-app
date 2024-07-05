"use server";

import bcrypt from "bcryptjs";
import { writeFile } from "fs/promises";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import path from "path";
import { z } from "zod";
import { auth, signIn, signOut } from "../auth";
import { prisma } from "./connect";
import { DEFAULT_LOGIN_REDIRECT } from "./routes";
import { AddClassTypes, ImportStudent, UpdateClassType } from "./types";
import {
  LoginSchema,
  addNoticeSchema,
  admissionSchema,
  updateProfileSchema,
  updateUserSchema,
  userSchema,
} from "./zodSchema";

//login user
export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  const validatedLoginValues = LoginSchema.safeParse(values);

  if (!validatedLoginValues.success) {
    return { error: "Invalid fields error!" };
  }

  const { email, password } = validatedLoginValues.data;

  const existingUser = await prisma?.user.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser || !existingUser.email) {
    return { error: "User does not Exist!" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};

//logout
export const logout = async () => {
  await signOut({ redirectTo: "/login" });
};

// Add Student
export const studentAdmission = async (
  values: z.infer<typeof admissionSchema>
) => {
  const session = await auth();
  const validatedData = admissionSchema.safeParse(values);
  if (!validatedData.success) {
    return { error: "Invalid fields!" };
  }
  //   TODO: need to check session
  const validatedValues = validatedData.data;

  try {
    if (session?.user.role !== "ADMIN") {
      return { error: "Only admin can admit a sutdent!" };
    }

    const currentSession = await prisma.session.findFirst({
      where: {
        current: true,
      },
    });

    if (!currentSession) {
      return { messege: "Please add current session first" };
    }

    await prisma?.student.create({
      data: { ...validatedValues, sessionName: currentSession.year },
    });
    return { success: "Addmission Successfull" };
  } catch (error) {
    console.log(error);
    return { error: "Student Admission failed!" };
  }
};

// Add multiple student
export const importStudent = async (
  data: ImportStudent[],
  others: { className: string; section: string }
) => {
  const session = await auth();
  try {
    if (session?.user.role !== "ADMIN") {
      return { error: "Only admin can admit insert student data!" };
    }

    const currentSession = await prisma.session.findFirst({
      where: {
        current: true,
      },
    });

    if (!currentSession) {
      return { messege: "Please Add Current Session" };
    }

    const newData = data.map((item) => ({
      ...item,
      mobile: String(item.mobile),
      fatherPhone: String(item.fatherPhone),
      gurdianPhone: String(item.gurdianPhone),
      classRoll: String(item.classRoll),
      sessionName: currentSession.year,
      className: others.className,
      section: others.section,
    }));

    await prisma.student.createMany({
      data: newData,
      skipDuplicates: true,
    });

    return { success: "Import successfull" };
  } catch (error) {
    console.log(error);
    return { error: "import failed!" };
  }
};

export const uploadImage = async (formData: any) => {
  const file = formData.get("file");
  if (!file) {
    return { error: "No files received." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name.replaceAll(" ", "_");
  const timestamp = new Date().getTime();
  const fileNameWithtimestamp = timestamp + filename;
  try {
    const toPath = path.join(
      process.cwd(),
      "public/upload/" + fileNameWithtimestamp
    );
    await writeFile(toPath, buffer);
    return { Message: "Success", url: `/upload/${fileNameWithtimestamp}` };
  } catch (error) {
    console.log("Error occured ", error);
    return { Message: "Upload Failed" };
  }
};

// update student
export const updateStudent = async (
  studentId: number,
  values: z.infer<typeof admissionSchema>
) => {
  const session = await auth();
  const validatedData = admissionSchema.safeParse(values);
  if (!validatedData.success) {
    return { error: "Invalid fields!" };
  }

  try {
    if (session?.user.role !== "ADMIN") {
      return { error: "Only admin can update a sutdent!" };
    }
    await prisma.student.update({
      where: {
        studentId: studentId,
      },
      data: validatedData.data,
    });
    revalidatePath(`/dashboard/students/view/${studentId}`);
    return { success: "Update Successfull" };
  } catch (error) {
    console.log(error);
    return { error: "Student Update failed!" };
  }
};

// update current session
export const createNewSessionAndSetCurrent = async () => {
  const session = await auth();
  try {
    if (session?.user.role !== "ADMIN") {
      return { error: "Only admin can update current session!" };
    }
    const currentYear = new Date().getFullYear();
    const currentSession = await prisma.session.findFirst({
      where: {
        year: currentYear,
        current: true,
      },
    });

    if (currentYear === currentSession?.year) {
      return;
    }
    // Create a new session for the current year and mark it as current
    const newSession = await prisma.session.create({
      data: {
        year: currentYear,
        current: true,
      },
    });

    // Set other sessions to not current
    await prisma.session.updateMany({
      where: {
        NOT: {
          year: currentYear,
        },
      },
      data: {
        current: false,
      },
    });

    console.log("Session management complete");
  } catch (error) {
    console.log("Error during session management");
  }
};

// get result
export const getResult = async (
  studentId: number,
  session: number,
  className: string,
  exam: "Annual" | "Half-Yearly"
) => {
  try {
    if (studentId && session && className && exam) {
      const result = await prisma.result.findFirst({
        where: {
          studentId: studentId,
          className,
          year: session,
          type: exam,
        },
        select: {
          id: true,
          gpa: true,
          position: true,
          status: true,
          className: true,
          subjects: true,
          year: true,
          type: true,
          totalMarks: true,
          studentId: true,
          student: {
            select: {
              fullName: true,
              fatherName: true,
              classRoll: true,
              section: true,
              dob: true,
              gender: true,
            },
          },
        },
      });

      if (!result) {
        return { messege: "Result Not Found!" };
      }
      return { messege: "success", result };
    }
  } catch (error) {
    console.log(error);
    return { error: "Result error!" };
  }
};

//total student count
export const totalStudentCount = async () => {
  const session = await auth();
  try {
    if (session?.user.role !== "ADMIN" && session?.user.role !== "TEACHER") {
      return { error: "Only admin and Teachers can see student info!" };
    }
    const totalStudent = await prisma.student.count();
    const six = await prisma.student.count({ where: { className: "Six" } });
    const sixBoy = await prisma.student.count({
      where: { className: "Six", gender: "Male" },
    });
    const sixGirl = await prisma.student.count({
      where: { className: "Six", gender: "Female" },
    });
    const seven = await prisma.student.count({ where: { className: "Seven" } });
    const sevenBoy = await prisma.student.count({
      where: { className: "Seven", gender: "Male" },
    });
    const sevenGirl = await prisma.student.count({
      where: { className: "Seven", gender: "Female" },
    });
    const eight = await prisma.student.count({ where: { className: "Eight" } });
    const eightBoy = await prisma.student.count({
      where: { className: "Eight", gender: "Male" },
    });
    const eightGirl = await prisma.student.count({
      where: { className: "Eight", gender: "Female" },
    });
    const nine = await prisma.student.count({ where: { className: "Nine" } });
    const nineBoy = await prisma.student.count({
      where: { className: "Nine", gender: "Male" },
    });
    const nineGirl = await prisma.student.count({
      where: { className: "Nine", gender: "Female" },
    });
    const ten = await prisma.student.count({ where: { className: "Ten" } });
    const tenBoy = await prisma.student.count({
      where: { className: "Ten", gender: "Male" },
    });
    const tenGirl = await prisma.student.count({
      where: { className: "Ten", gender: "Female" },
    });
    return {
      totalStudent,
      six,
      sixBoy,
      sixGirl,
      seven,
      sevenBoy,
      sevenGirl,
      eight,
      eightBoy,
      eightGirl,
      nine,
      nineBoy,
      nineGirl,
      ten,
      tenBoy,
      tenGirl,
    };
  } catch (error) {
    console.log(error);
    return;
  }
};

// add user
export const addUser = async (values: z.infer<typeof userSchema>) => {
  const session = await auth();
  if (!session) {
    throw new Error("You are not authenticated");
  }

  if (session.user.role !== "ADMIN") {
    throw new Error("You are not authorized");
  }

  const validatedUserData = userSchema.safeParse(values);

  if (!validatedUserData.success) {
    return { error: "Invalid fields error!" };
  }

  const { name, email, role, password } = validatedUserData.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    if (!session) {
      return { error: "You are not authenticated!" };
    }
    if (session?.user.role !== "ADMIN") {
      return { error: "Only admin can add a user!" };
    }
    const existingUser = await prisma?.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return { error: "User already exist with this email!" };
    }

    await prisma?.user.create({
      data: { name, email, role, password: hashedPassword },
    });
    revalidatePath("/dashboard/settings/current-users");
    return { success: "Add User Successfull" };
  } catch (error) {
    console.log(error);
    return { error: "Add User failed!" };
  }
};

//update user profile
export const updateProfile = async (
  values: z.infer<typeof updateProfileSchema>
) => {
  const session = await auth();
  const validatedUpdatedUserData = updateProfileSchema.safeParse(values);

  if (!validatedUpdatedUserData.success) {
    return { error: "Invalid fields error!" };
  }

  const { name, file, id } = validatedUpdatedUserData.data;

  try {
    if (!session) {
      return { error: "You are not logged in!" };
    }

    if (session.user.id !== id) {
      return { error: "You are not Authorozied!" };
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name,
        image: file,
      },
    });

    revalidatePath("/dashboard");
    return { messege: "Update Successfull!" };
  } catch (error) {
    console.log(error);
    return { error: "Update Failed!" };
  }
};

//bulkDelete
export const bulkDelete = async (values: string[]) => {
  const session = await auth();
  try {
    if (!session) {
      return { error: "You are not authenticated" };
    }
    if (session?.user.role !== "ADMIN") {
      return { error: "You are not allowed to bulk delete" };
    }
    await prisma.student.deleteMany({
      where: {
        id: {
          in: values,
        },
      },
    });
    revalidatePath("dashboard/students/bulk-delete");
    return { messege: "Delete Successfull" };
  } catch (error) {
    console.log(error);
    return { error: "Delete Failed!" };
  }
};

//delete user
export const deleteUser = async (userId: string) => {
  const session = await auth();

  try {
    if (!session) {
      return { error: "You are not authenticated" };
    }
    if (session?.user.role !== "ADMIN") {
      return { error: "You are not allowed to bulk delete" };
    }
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    revalidatePath("dashboard/settings/current-users");
    return { messege: "User has been deleted" };
  } catch (error) {
    console.log(error);
    return { error: "Delete Failed!" };
  }
};

//update user
export const updateUser = async (values: z.infer<typeof updateUserSchema>) => {
  const session = await auth();

  try {
    if (!session) {
      return { error: "You are not authenticated" };
    }
    if (session?.user.role !== "ADMIN") {
      return { error: "You are not allowed to update user!" };
    }
    if (values.password) {
      const hashedPassword = await bcrypt.hash(values.password, 10);
      values.password = hashedPassword;
    }

    await prisma.user.update({
      where: {
        id: values.id,
      },
      data: {
        ...values,
      },
    });
    revalidatePath("dashboard/settings/current-users");
    return { messege: "User has been updated" };
  } catch (error) {
    console.log(error);
    return { error: "Update Failed!" };
  }
};

//add classes
export const addClass = async (values: AddClassTypes) => {
  const session = await auth();

  if (!session) {
    throw new Error("You are not authenticated");
  }
  if (session.user.role !== "ADMIN") {
    throw new Error("You are not authorized");
  }
  try {
    const existingClass = await prisma.class.findFirst({
      where: {
        className: values.className,
      },
    });

    if (existingClass) {
      return { error: "Class already exists!" };
    }

    await prisma.class.create({
      data: values,
    });
    return { messege: "Class Added..." };
  } catch (error) {
    console.log(error);
    return { error: "Failed to Add Class" };
  }
};

//add classes
export const updateClass = async (values: UpdateClassType) => {
  const session = await auth();

  if (!session) {
    throw new Error("You are not authenticated");
  }
  if (session.user.role !== "ADMIN") {
    throw new Error("You are not authorized");
  }
  try {
    await prisma.class.update({
      where: {
        id: values.id,
      },
      data: values,
    });
    revalidatePath("/dashboard/settings/all-classes");
    return { messege: "Class Updated..." };
  } catch (error) {
    console.log(error);
    return { error: "Failed to Update Class" };
  }
};

//add notice
export const addNotice = async (values: z.infer<typeof addNoticeSchema>) => {
  const validatedValues = addNoticeSchema.safeParse(values);

  if (!validatedValues.success) {
    return { error: "Invalid fields error!" };
  }

  try {
    const newNotice = await prisma.notice.create({
      data: values,
    });
    return { messege: "Notice Added..." };
  } catch (error) {
    console.log(error);
    return { error: "Failed to add notice!" };
  }
};
