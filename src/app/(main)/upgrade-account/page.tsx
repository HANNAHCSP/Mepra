// src/app/(main)/upgrade-account/page.tsx
"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus, AlertCircle } from "lucide-react";
import { completeGuestUpgradeAction } from "@/app/actions/auth";
import { toast } from "sonner";

function UpgradeAccountForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <h2 className="text-xl font-medium text-foreground">Invalid Invite</h2>
        <p className="text-muted-foreground">
          This upgrade link is invalid, missing, or has expired.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    // Append the token from the URL to the form data
    formData.append("token", token);

    try {
      const result = await completeGuestUpgradeAction(formData);

      if (result.success) {
        toast.success("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/signin");
        }, 1500);
      } else {
        setError(result.message);
        setIsLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-2xl font-light text-foreground">Finish Your Account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Set a password to access your order history and save your details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
              Create Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Min. 8 characters"
              required
              minLength={8}
              className="bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              required
              minLength={8}
              className="bg-white"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md">
            {error}
          </div>
        )}

        <Button type="submit" disabled={isLoading} className="w-full h-11">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </>
  );
}

export default function UpgradeAccountPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-lg border border-border/60">
        <Suspense
          fallback={
            <div className="flex justify-center">
              <Loader2 className="animate-spin text-secondary" />
            </div>
          }
        >
          <UpgradeAccountForm />
        </Suspense>
      </div>
    </div>
  );
}
