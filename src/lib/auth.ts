import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { z } from "zod";
import type { Role } from "@prisma/client";

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  providers: [
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (raw) => {
        console.log("🔐 Authorize called with:", { email: raw?.email, hasPassword: !!raw?.password });
        
        const parsed = CredentialsSchema.safeParse(raw);
        if (!parsed.success) {
          console.log("❌ Validation failed:", parsed.error.issues);
          return null;
        }

        const { email, password } = parsed.data;
        console.log("✅ Validation passed, looking up user:", email.toLowerCase());

        try {
          const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            select: { id: true, name: true, email: true, role: true, password: true },
          });
          
          console.log("👤 User found:", user ? "Yes" : "No");
          if (!user || !user.password) {
            console.log("❌ No user or no password");
            return null;
          }

          console.log("🔑 Comparing passwords...");
          const ok = await compare(password, user.password);
          console.log("🔑 Password match:", ok);
          
          if (!ok) return null;

          const appUser = {
            id: user.id,
            role: user.role,
            name: user.name,
            email: user.email,
          };
          
          console.log("✅ Returning user:", { id: user.id, email: user.email, role: user.role });
          return appUser;
        } catch (error) {
          console.error("💥 Database error in authorize:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      console.log("🔄 JWT callback:", { hasUser: !!user, tokenId: token.id });
      if (user) {
        token.id = user.id;
        token.role = user.role;
        console.log("✅ Added user to token:", { id: user.id, role: user.role });
      }
      return token;
    },
    session: async ({ session, token }) => {
      console.log("👤 Session callback:", { hasSession: !!session.user, tokenId: token.id });
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role as Role;
        console.log("✅ Session enhanced:", { id: token.id, role: token.role });
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug mode
};