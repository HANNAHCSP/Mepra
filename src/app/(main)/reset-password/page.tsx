"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Loader2, AlertCircle } from "lucide-react";
import { resetPasswordAction } from "@/app/actions/auth";
import { toast } from "sonner";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <h2 className="text-xl font-medium text-foreground">Invalid Link</h2>
        <p className="text-muted-foreground">This password reset link is invalid or missing.</p>
        <Button asChild className="mt-4">
          <Link href="/forgot-password">Request New Link</Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("token", token); // Attach token from URL

    const result = await resetPasswordAction(formData);

    if (result.success) {
      toast.success("Password reset successfully!");
      router.push("/signin");
    } else {
      toast.error(result.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6 text-secondary" />
        </div>
        <h1 className="text-2xl font-light text-foreground">New Password</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please enter your new password below.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            New Password
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

        <Button type="submit" disabled={isLoading} className="w-full h-11">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-lg border border-border/60">
        <Suspense
          fallback={
            <div className="flex justify-center">
              <Loader2 className="animate-spin" />
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
