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
import { AddClassTypes, UpdateClassType } from "./types";
import {
  LoginSchema,
  addAcademicYearSchema,
  addNoticeSchema,
  newAdmissionSchema,
  updateAcademicYearSchema,
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
  values: z.infer<typeof newAdmissionSchema>
) => {
  const session = await auth();
  const validatedData = newAdmissionSchema.safeParse(values);
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

  const { name, currentPassword, confirmPassword, file, id } =
    validatedUpdatedUserData.data;

  try {
    if (!session) {
      return { error: "You are not logged in!" };
    }

    if (session.user.id !== id) {
      return { error: "You are not Authorozied!" };
    }
    if (currentPassword && confirmPassword) {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        return { error: "User not found!" };
      }
      const passwordsMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!passwordsMatch) {
        return { error: "Current password is incorrect!" };
      }
      const hashedPassword = await bcrypt.hash(confirmPassword, 10);
      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          name,
          image: file,
          password: hashedPassword,
        },
      });
    } else {
      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          name,
          image: file,
        },
      });
    }

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

//update classes
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
  console.log(values);
  const validatedValues = addNoticeSchema.safeParse(values);
  console.log(validatedValues);
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

// add academicyear
export const addAcademicYear = async (
  values: z.infer<typeof addAcademicYearSchema>
) => {
  const session = await auth();
  if (!session) {
    throw new Error("You are not authenticated");
  }

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Only admin can create academic years!" };
  }

  const validatedUserData = addAcademicYearSchema.safeParse(values);

  if (!validatedUserData.success) {
    return { error: "Invalid fields error!" };
  }

  const { year, isCurrent } = validatedUserData.data;

  const current = isCurrent === "true";

  if (year < new Date().getFullYear()) {
    return { error: "Cannot create academic year for past years!" };
  }
  try {
    if (current) {
      await prisma.academicYear.updateMany({
        where: { current: true },
        data: { current: false },
      });
    }

    await prisma.academicYear.create({
      data: { year, current },
    });

    revalidatePath("/dashboard/settings/academic-year");
    return { success: "Academic year created successfully!" };
  } catch (error) {
    console.log(error);
    return { error: "Failed to create academic year!" };
  }
};

// update academicyear
export const updateAcademicYear = async (
  values: z.infer<typeof updateAcademicYearSchema>
) => {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return { error: "Only admin can update academic years!" };
  }

  const validatedUserData = updateAcademicYearSchema.safeParse(values);

  if (!validatedUserData.success) {
    return { error: "Invalid fields error!" };
  }

  const { id, year, isCurrent } = validatedUserData.data;

  const current = isCurrent === "true";

  if (year < new Date().getFullYear()) {
    return { error: "Cannot update to a past academic year!" };
  }

  try {
    const existing = await prisma.academicYear.findUnique({ where: { id } });
    if (!existing) {
      return { error: "Academic year not found!" };
    }

    if (current) {
      await prisma.academicYear.updateMany({
        where: { current: true },
        data: { current: false },
      });
    }

    await prisma.academicYear.update({
      where: { id },
      data: { year, current },
    });

    revalidatePath("/dashboard/settings/academic-year");
    return { success: "Academic year updated successfully!" };
  } catch (error) {
    console.log(error);
    return { error: "Failed to update academic year!" };
  }
};
