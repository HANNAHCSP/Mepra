import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { z } from "zod";
import type { Role } from "@prisma/client";
import { mergeAnonymousCartIntoUserCart } from "@/app/actions/cart";

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  providers: [
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (raw) => {
        const parsed = CredentialsSchema.safeParse(raw);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        try {
          const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            select: { id: true, name: true, email: true, role: true, password: true },
          });

          if (!user || !user.password) {
            return null;
          }

          const ok = await compare(password, user.password);
          if (!ok) {
            return null;
          }

          // Return the user object that will be passed to the JWT callback
          return {
            id: user.id,
            role: user.role,
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  events: {
    // This event triggers when a user successfully signs in
    async signIn({ user }) {
      try {
        if (user.id) {
          await mergeAnonymousCartIntoUserCart(user.id);
          console.log(`🛒 Cart merged for user ${user.email}`);
        }
      } catch (error) {
        console.error("❌ Failed to merge cart on sign in:", error);
      }
    },
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
