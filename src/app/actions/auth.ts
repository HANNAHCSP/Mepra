// src/app/actions/auth.ts
"use server";

import { prisma } from "@/lib/prisma";
import { hash, compare } from "bcryptjs";
import { z } from "zod";
import { ShippingAddressSchema } from "@/lib/zod-schemas";
import { randomUUID } from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

// --- 1. GUEST ACCOUNT CREATION (From Order) ---

const CreateAccountSchema = z.object({
  name: z.string().trim().min(2, { message: "Name must be at least 2 characters." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  orderId: z.string().cuid(),
});

type FormState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    password?: string[];
    orderId?: string[];
    _form?: string[];
  };
};

export async function createAccountFromGuestOrder(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = CreateAccountSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid form data.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, password, orderId } = parsed.data;

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order || order.userId) {
      return { success: false, message: "This order is not a guest order or does not exist." };
    }

    const customerEmail = order.customerEmail;
    const existingUser = await prisma.user.findUnique({ where: { email: customerEmail } });

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email already exists. Please sign in.",
      };
    }

    const hashedPassword = await hash(password, 12);

    // TYPE FIX: Treat Prisma Json as unknown for Zod validation
    const shippingAddress = ShippingAddressSchema.parse(order.shippingAddress as unknown);

    await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email: customerEmail,
          password: hashedPassword,
        },
      });

      // Link all past guest orders
      await tx.order.updateMany({
        where: {
          customerEmail: customerEmail,
          userId: null,
        },
        data: {
          userId: newUser.id,
        },
      });

      // Save the address
      await tx.address.create({
        data: {
          userId: newUser.id,
          street: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country,
          isDefault: true,
        },
      });
    });

    return { success: true, message: "Account created successfully! Signing you in..." };
  } catch (error) {
    console.error("Error creating account from guest order:", error);
    return { success: false, message: "An internal error occurred. Please try again." };
  }
}

// --- 2. GUEST UPGRADE (From Email Token) ---

const UpgradeAccountSchema = z.object({
  token: z.string().min(1, "Token is missing"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function completeGuestUpgradeAction(formData: FormData) {
  const parsed = UpgradeAccountSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, message: "Invalid data." };
  }

  const { token, password } = parsed.data;

  try {
    // 1. Find Invite
    const invite = await prisma.guestUpgradeInvite.findUnique({
      where: { token },
    });

    if (!invite) {
      return { success: false, message: "Invalid or expired invite link." };
    }

    if (new Date() > invite.expiresAt) {
      await prisma.guestUpgradeInvite.delete({ where: { token } });
      return { success: false, message: "Invite link has expired." };
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: invite.email },
    });

    if (existingUser) {
      return { success: false, message: "An account with this email already exists." };
    }

    // 3. Create User
    const hashedPassword = await hash(password, 12);

    // We get the order details to populate name if possible
    const order = await prisma.order.findUnique({
      where: { id: invite.orderId },
    });

    // Attempt to extract name from shipping address
    let name = "Customer";
    if (order && order.shippingAddress) {
      // Check if it matches expected shape safely
      const addr = order.shippingAddress as Record<string, unknown>;
      if (typeof addr.firstName === "string") {
        name = `${addr.firstName} ${typeof addr.lastName === "string" ? addr.lastName : ""}`.trim();
      }
    }

    const newUser = await prisma.user.create({
      data: {
        email: invite.email,
        password: hashedPassword,
        name: name,
      },
    });

    // 4. Link past orders
    await prisma.order.updateMany({
      where: { customerEmail: invite.email },
      data: { userId: newUser.id },
    });

    // 5. Cleanup
    await prisma.guestUpgradeInvite.delete({ where: { token } });

    return { success: true, message: "Account created successfully!" };
  } catch (error) {
    console.error("Guest Upgrade Error:", error);
    return { success: false, message: "Failed to upgrade account." };
  }
}

// --- 3. FORGOT PASSWORD ACTIONS ---

const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

const ResetPasswordSchema = z.object({
  token: z.string().min(1, "Token is missing"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function forgotPasswordAction(formData: FormData) {
  const parsed = ForgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { success: false, message: "Invalid email address." };
  }

  const { email } = parsed.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user) {
      return { success: true, message: "If an account exists, a reset link has been sent." };
    }

    const token = randomUUID();
    // Token valid for 1 hour
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    // Clean up old tokens
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    await sendPasswordResetEmail(email, token);

    return { success: true, message: "If an account exists, a reset link has been sent." };
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

export async function resetPasswordAction(formData: FormData) {
  const parsed = ResetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, message: "Password must be at least 8 characters." };
  }

  const { token, password } = parsed.data;

  try {
    const existingToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return { success: false, message: "Invalid or expired reset token." };
    }

    if (new Date() > existingToken.expires) {
      await prisma.verificationToken.delete({ where: { token } });
      return { success: false, message: "Token has expired. Please request a new one." };
    }

    const user = await prisma.user.findUnique({
      where: { email: existingToken.identifier },
    });

    if (!user) {
      return { success: false, message: "User account no longer exists." };
    }

    // --- SECURITY: PREVENT REUSE OF CURRENT PASSWORD ---
    const isSamePassword = await compare(password, user.password);
    if (isSamePassword) {
      return {
        success: false,
        message: "New password cannot be the same as your current password.",
      };
    }
    // ---------------------------------------------------

    const hashedPassword = await hash(password, 12);

    await prisma.user.update({
      where: { email: existingToken.identifier },
      data: { password: hashedPassword },
    });

    // Delete token after successful use
    await prisma.verificationToken.delete({ where: { token } });

    return { success: true, message: "Password updated successfully!" };
  } catch (error) {
    console.error("Reset Password Error:", error);
    return { success: false, message: "Failed to reset password." };
  }
}
