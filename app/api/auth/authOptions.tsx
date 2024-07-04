import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/prisma/client";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.hashedPassword!
        );

        return passwordsMatch ? user : null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
  },
  callbacks: {
    async session({ session, token }) {
      // Fetch the user from the database using the email from the session
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      // Add the user image and id to the session object
      if (user) {
        session.user.image = user.image;
        session.user.id = user.id;
      }

      return session;
    },
    async jwt({ token, user }) {
      // Pass the user data to the JWT token
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }

      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
};
