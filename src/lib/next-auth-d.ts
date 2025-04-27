import { Role } from "@prisma/client";
import { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: Role;
  email: string;
  image: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
