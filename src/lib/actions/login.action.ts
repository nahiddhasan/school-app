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

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser || !existingUser.email) {
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
