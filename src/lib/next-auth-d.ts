import { Role } from "@/app/generated/prisma";
import { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  studentId: number;
  teacherId: number;
  role: Role;
  email: string;
  image: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
