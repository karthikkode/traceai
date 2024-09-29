import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { db } from "@/lib/db";
import { compare } from "bcrypt";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,

      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/", // Ensure this matches your sign-in page
    signOut: "/auth/signout", // Ensure this matches your sign-out page
    error: "/auth/error", // Error redirect
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // This callback runs whenever a user signs in
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "github") {
        const email = user?.email as string;
        const name = user?.name as string;
        const image = user?.image as string;
        const existingUser = await db.user.findUnique({
          where: { email: email },
        });
        if (existingUser) return true;
        const newUser = await db.user.create({
          data: {
            username: name,
            email: email,
            image: image,
          },
        });
      }
      return true;
    },
  },
});
