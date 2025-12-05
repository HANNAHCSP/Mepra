// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
 
  var prisma: PrismaClient | undefined;
}

// Prevent multiple instances in dev (hot reload)
export const prisma =
  global.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? [ "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
