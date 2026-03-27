import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
export const authOptions = {
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
        userType:{
          label: "UserType",
          type: "text",
        }
      },
      async authorize(credentials, req) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) {
          throw new Error("Invalid email or password.");
        }
        if (credentials.userType && user.userType !== credentials.userType) {
          throw new Error(
            `Access Denied. You are registered as a ${user.userType}.`,
          );
        }
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValidPassword) {
          throw new Error("Invalid email or password.");
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          userType: user.userType,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.userType = dbUser.userType;
        } else {
          token.id = user.id;
          token.userType = "patient";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.userType = token.userType;
      }
      return session;
    },
  },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
