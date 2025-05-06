import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import credentials from "next-auth/providers/credentials";
import { Role } from "./app/generated/prisma";
import { prisma } from "./lib/connect";
import { getUserById } from "./lib/data";
import { LoginSchema } from "./lib/zodSchema";

export default {
  providers: [
    credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const isNumericId = /^\d+$/.test(email);

          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: isNumericId ? undefined : email },
                { studentId: isNumericId ? Number(email) : undefined },
              ],
            },
          });

          // const user = await getUserByEmail(email);

          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          // const passwordsMatch = password === user.password;

          if (passwordsMatch) return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as Role;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.image = token.image as string;
        session.user.email = token.email!;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.name = existingUser.name;
      token.image = existingUser.image;
      token.email = existingUser.email;
      token.role = existingUser.role;
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
} satisfies NextAuthConfig;
