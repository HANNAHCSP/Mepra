"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Mail, Loader2 } from "lucide-react";
import { forgotPasswordAction } from "@/app/actions/auth";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await forgotPasswordAction(formData);

    setIsLoading(false);

    if (result.success) {
      setIsSubmitted(true);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-lg border border-border/60">
        <Link
          href="/signin"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Sign In
        </Link>

        {isSubmitted ? (
          <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-light text-foreground">Check your inbox</h2>
            <p className="text-muted-foreground text-sm">
              If an account exists for that email, we have sent password reset instructions.
            </p>
            <Button variant="outline" className="mt-4 w-full" onClick={() => setIsSubmitted(false)}>
              Try another email
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-secondary" />
              </div>
              <h1 className="text-2xl font-light text-foreground">Reset Password</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="bg-white"
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full h-11">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {isLoading ? "Sending Link..." : "Send Reset Link"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
