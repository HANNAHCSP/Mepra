// app/sign-in/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const Schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof Schema>;

export default function SignInPage() {
  const router = useRouter();
  const search = useSearchParams();
  const { data: session, status } = useSession();

  // Show an error if NextAuth redirected back with ?error=CredentialsSignin, etc.
  const initialError =
    search.get("error") ? "Invalid email or password" : undefined;

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const [apiError, setApiError] = useState<string | undefined>(initialError);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(Schema) });

  // Redirect if already authenticated - AFTER all hooks are called
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const callbackUrl = search.get("callbackUrl") ?? search.get("from") ?? "/";
      
      // Role-based redirect
      if (session.user.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace(callbackUrl);
      }
    }
  }, [session, status, router, search]);

  const onSubmit = async (data: FormData) => {
    console.log("🔄 Starting sign-in process...");
    setApiError(undefined);

    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false, // Important: keep this false
      });

      console.log("📊 Sign-in result:", res);

      if (!res) {
        console.log("❌ No response from signIn");
        setApiError("No response from authentication service");
        return;
      }

      if (res.error) {
        console.log("❌ Sign-in error:", res.error);
        setApiError("Invalid email or password");
        return;
      }

      if (res.ok) {
        console.log("✅ Sign-in successful! Refreshing session...");
        
        // Force session refresh and redirect will happen in useEffect
        window.location.reload();
      }
    } catch (error) {
      console.error("💥 Sign-in error:", error);
      setApiError("An unexpected error occurred");
    }
  };

  // CONDITIONAL RETURNS AFTER ALL HOOKS
  // Show loading if checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render form if already authenticated
  if (status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Main form render - only when unauthenticated
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sign in</h1>
          <p className="mt-2 text-sm text-gray-600">
            New here?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-300" : "border-gray-300"
              }`}
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className={`mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? "border-red-300" : "border-gray-300"
              }`}
              {...register("password")}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {apiError && (
            <div className="text-center text-sm text-red-600">{apiError}</div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          By signing in, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}