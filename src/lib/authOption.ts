import CredentialsProvider from "next-auth/providers/credentials";
// import { prisma } from "./prisma";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import jwt from "jsonwebtoken";
import User from "./models/user-model";
import connectDB from "./db";

declare module "next-auth" {
  interface User {
    _id: string;
    fullname: string;
    password: string;
    photo: string;
    store: string;
    phone: string;
  }

  interface Session {
    user?: {
      id?: string;
      fullname: string;
      photo?: string;
      store?: string;
      accessToken?: string;
      phone?: string;
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
        await connectDB();
        try {
          const user = await User.findOne({ fullname: fullname });

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
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (account?.provider === "credentials" && user) {
        token.id = user.id;
        token.fullname = user.fullname;
        token.photo = user.photo as string;
        token.store = user.store as string;
        token.phone = user.phone as string;
      }

      if (trigger === "update" && session) {
        token.id = session.user?._id as string;
        token.fullname = session.user?.fullname as string;
        token.photo = session.user?.photo as string;
        token.store = session.user?.store as string;
        token.phone = session.user?.phone as string;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) || "";
        session.user.fullname = (token.fullname as string) || "";
        session.user.photo = (token.photo as string) || "";
        session.user.store = (token.store as string) || "";
        session.user.phone = (token.phone as string) || "";

        const accessToken = jwt.sign(token, process.env.NEXTAUTH_SECRET || "", {
          algorithm: "HS256",
        });

        session.user.accessToken = accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
};
