import { PrismaClient } from "@prisma/client";

// Minimal augmentation to expose `guestUpgradeInvite` on the Prisma client with a typed `create`.
// This avoids using `any` or raw SQL while the generated client doesn't include the delegate.
declare module "@prisma/client" {
  interface PrismaClient {
    guestUpgradeInvite: {
      create(args: {
        data: {
          orderId: string;
          email: string;
          token: string;
          expiresAt: Date;
        };
      }): Promise<{
        id: string;
        orderId: string;
        email: string;
        token: string;
        expiresAt: Date;
        createdAt: Date;
      }>;
    };
  }
}
