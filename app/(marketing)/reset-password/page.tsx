/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { resetPassword } from "@/services/auth.service";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Invalid reset link");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (getPasswordStrength(password) < 2) {
      setError("Password is too weak");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-black via-[#0a0014] to-[#5b09c4] px-4">
        <div className="mt-20 w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-10 shadow-xl backdrop-blur-lg">
          <div className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
            <CheckCircle size={18} className="mt-0.5 shrink-0 text-red-400" />
            <span>
              <strong>Invalid reset link.</strong>
              <br />
              Please request a new password reset link from the forgot password
              page.
            </span>
          </div>

          <Link
            href="/forgot-password"
            className="mt-6 inline-block w-full rounded-xl bg-white/20 py-3 text-center font-semibold text-white shadow-lg transition hover:bg-white/30"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-black via-[#0a0014] to-[#5b09c4] px-4">
      <div className="mt-20 w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-10 shadow-xl backdrop-blur-lg">
        <h1 className="font-helvetica text-center text-3xl font-semibold text-white">
          Create new password
        </h1>

        <p className="mt-2 text-center text-sm text-white/60">
          Enter a strong password to secure your account
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
              <strong>Password updated!</strong>
              <br />
              Redirecting you to login. You can now sign in with your new
              password.
            </span>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 w-full rounded-xl bg-gray-100 pr-12 pl-11 text-sm font-light text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-black focus:outline-none"
              />

              <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400">
                <Lock size={18} />
              </span>

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {password && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ease-out ${
                        getPasswordStrength(password) >= level
                          ? level <= 2
                            ? "bg-red-400"
                            : level === 3
                              ? "bg-yellow-400"
                              : "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <p className="mt-1 text-xs text-gray-400 transition-opacity">
                  {getPasswordStrength(password) < 2 && "Weak password"}
                  {getPasswordStrength(password) === 2 && "Fair password"}
                  {getPasswordStrength(password) === 3 && "Good password"}
                  {getPasswordStrength(password) === 4 && "Strong password"}
                </p>
              </div>
            )}

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-12 w-full rounded-xl bg-gray-100 pr-12 pl-11 text-sm font-light text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-black focus:outline-none"
              />

              <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400">
                <Lock size={18} />
              </span>

              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !password || !confirmPassword}
              className="mt-6 h-12 w-full rounded-xl bg-white/20 font-semibold text-white shadow-lg transition hover:bg-white/30 disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset Password"}
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
