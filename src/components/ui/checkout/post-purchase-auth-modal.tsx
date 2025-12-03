// src/components/ui/checkout/post-purchase-auth-modal.tsx
"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, User, Mail, X, Gift } from "lucide-react";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createAccountFromGuestOrder } from "@/app/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  orderId: z.string(),
});
type FormData = z.infer<typeof FormSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Creating Account..." : "Create Account & Save Order"}
    </Button>
  );
}

interface PostPurchaseAuthModalProps {
  orderId: string;
  customerEmail: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function PostPurchaseAuthModal({
  orderId,
  customerEmail,
  isOpen,
  onClose,
}: PostPurchaseAuthModalProps) {
  const [state, formAction] = useActionState(createAccountFromGuestOrder, {
    success: false,
    message: "",
  });

  const [password, setPassword] = useState("");

  const {
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);

      if (password) {
        signIn("credentials", {
          email: customerEmail,
          password: password,
          redirect: false,
        }).then((result) => {
          if (result?.ok) {
            router.refresh();
            router.push("/account/orders");
          } else {
            toast.error("Login failed after registration. Please try logging in manually.");
            router.push("/signin");
          }
        });
      } else {
        toast.error("Could not log you in automatically. Please sign in.");
        router.push("/signin");
      }
    } else if (state.message && state.message !== "Invalid form data.") {
      toast.error(state.message);
    }
  }, [state, customerEmail, router, password]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-8 bg-card rounded-lg shadow-xl border-2 border-border m-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors tap-target"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 mb-4">
            <Gift className="h-6 w-6 text-secondary" />
          </div>
          <h3 className="text-2xl font-light text-foreground mb-2">Save Your Order</h3>
          <p className="text-sm text-muted-foreground">
            Create an account to track this order and enjoy faster checkouts next time.
          </p>
        </div>

        {/* Benefits List */}
        <div className="bg-accent/50 border-2 border-border rounded-lg p-4 mb-6">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
            Account Benefits:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-secondary flex-shrink-0" />
              <span>Track your order status in real-time</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-secondary flex-shrink-0" />
              <span>Save addresses for faster checkout</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-secondary flex-shrink-0" />
              <span>View complete order history</span>
            </li>
          </ul>
        </div>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="orderId" value={orderId} />

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 text-muted-foreground -translate-y-1/2" />
              <Input
                type="email"
                name="email"
                value={customerEmail}
                readOnly
                className="pl-10 bg-muted/30 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 text-muted-foreground -translate-y-1/2" />
              <Input id="name" {...register("name")} className="pl-10" />
            </div>
            {errors.name && <p className="mt-1 text-sm text-burgundy">{errors.name.message}</p>}
            {state.errors?.name && (
              <p className="mt-1 text-sm text-burgundy">{state.errors.name[0]}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 text-muted-foreground -translate-y-1/2" />
              <Input
                id="password"
                type="password"
                {...register("password")}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-burgundy">{errors.password.message}</p>
            )}
            {state.errors?.password && (
              <p className="mt-1 text-sm text-burgundy">{state.errors.password[0]}</p>
            )}
          </div>

          <SubmitButton />
        </form>

        {/* Skip Option */}
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
