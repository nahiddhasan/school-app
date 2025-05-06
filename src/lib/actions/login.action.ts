"use server";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import { prisma } from "../connect";
import { LoginSchema } from "../zodSchema";

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
  // email can be email or student id
  const isNumericId = /^\d+$/.test(email);

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: isNumericId ? undefined : email },
        { studentId: isNumericId ? Number(email) : undefined },
      ],
    },
  });

  if (!existingUser) {
    return { error: "Invalid credentials!" };
  }
  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      return { error: "Invalid credentials!" };
    }

    // Determine role-based redirect
    const userRole = existingUser.role?.toLowerCase();
    const redirectUrl = callbackUrl || `/dashboard/${userRole}`;

    return { success: "Login successful", redirectUrl };
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
