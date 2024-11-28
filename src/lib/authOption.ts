import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";

declare module "next-auth" {
  interface User {
    fullname: string;
    password: string;
  }

  interface Session {
    user?: {
      id: string;
      fullname: string;
      photo?: string;
      store: string;
    };
  }

  interface JWT {
    id: string;
    fullname: string;
    photo?: string;
    store: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "credentials",
      credentials: {
        fullname: { label: "Fullname", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { fullname, password } = credentials as {
          fullname: string;
          password: string;
        };

        try {
          const user = await prisma.user.findFirst({
            where: {
              fullname: fullname,
            },
          });

          if (!user) {
            return null;
          }
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return null;
          }

          return user;
        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
        }
      },
    }),
  ],
};
