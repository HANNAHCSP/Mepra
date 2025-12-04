// src/app/(main)/signin/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof Schema>;

export default function SignInPage() {
  const router = useRouter();
  const search = useSearchParams();
  const { data: session, status } = useSession();

  const initialError = search.get("error") ? "Invalid email or password" : undefined;
  const [apiError, setApiError] = useState<string | undefined>(initialError);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(Schema) });

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const callbackUrl = search.get("callbackUrl") ?? search.get("from") ?? "/";
      if (session.user.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace(callbackUrl);
      }
    }
  }, [session, status, router, search]);

  const onSubmit = async (data: FormData) => {
    setApiError(undefined);
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        setApiError("Invalid email or password");
      } else if (res?.ok) {
        window.location.reload();
      }
    } catch (error) {
      setApiError("An unexpected error occurred");
    }
  };

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-lg border border-border/60">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-foreground">Welcome Back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access your account and orders
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className={errors.email ? "border-burgundy focus-visible:ring-burgundy/20" : ""}
            />
            {errors.email && (
              <p className="text-xs text-burgundy">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-secondary hover:text-primary transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={errors.password ? "border-burgundy focus-visible:ring-burgundy/20" : ""}
            />
            {errors.password && (
              <p className="text-xs text-burgundy">{errors.password.message}</p>
            )}
          </div>

          {apiError && (
            <div className="p-3 rounded-md bg-burgundy/10 border border-burgundy/20 text-sm text-burgundy text-center">
              {apiError}
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-base">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-secondary hover:text-primary transition-colors"
            >
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}