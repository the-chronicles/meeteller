/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { forgotPassword } from "@/services/auth.service";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await forgotPassword(email.trim());
      setSuccess(true);
      setEmail("");
      toast.success("Password reset link sent.");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to send reset link";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-black via-[#0a0014] to-[#5b09c4] px-4">
      <div className="mt-20 w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-10 shadow-xl backdrop-blur-lg">
        <Link
          href="/login"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to login
        </Link>

        <h1 className="font-helvetica text-center text-3xl font-semibold text-white">
          Reset your password
        </h1>

        <p className="mt-2 text-center text-sm text-white/60">
          Enter your email and we&apos;ll send you a link to reset your password
        </p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-green-400/20 bg-green-500/10 p-4 text-sm text-green-200">
            <CheckCircle size={18} className="mt-0.5 shrink-0 text-green-400" />
            <span>
              <strong>Check your email.</strong>
              <br />
              We&apos;ve sent you a password reset link. Please check your inbox
              and follow the instructions.
            </span>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 w-full rounded-xl bg-gray-100 pr-4 pl-11 text-sm font-light text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-black focus:outline-none"
              />
              <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400">
                <Mail size={18} />
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="mt-6 h-12 w-full rounded-xl bg-white/20 font-semibold text-white shadow-lg transition hover:bg-white/30 disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-[#8c8b8b]">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-medium text-white hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
