/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { supabase } from "@/lib/supabase/browser";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const signInWithGoogle = async () => {
    setError(null);

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const signInWithMicrosoft = async () => {
    setError(null);

    await supabase.auth.signInWithOAuth({
      provider: "azure",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const loginWithEmail = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setError(err.message ?? "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-black via-[#0a0014] to-[#5b09c4] px-4">
      <div className="mt-20 w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-10 shadow-xl backdrop-blur-lg">
        {/* <div className="mb-3 flex justify-center">
          <Image
            src="/logo-white.png"
            alt="Meeteller logo"
            width={200}
            height={100}
            className="mb-4"
          />
        </div> */}

        <h1 className="text-center text-3xl font-semibold text-white">
          Welcome back
        </h1>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-xl bg-gray-100 pr-4 pl-11 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-black focus:outline-none"
            />
            <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400">
              <Mail size={18} />
            </span>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 w-full rounded-xl bg-gray-100 pr-12 pl-11 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-black focus:outline-none"
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
        </div>

        <div className="mt-4 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-white">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
            />
            Remember me
          </label>

          <button
            type="button"
            className="text-sm text-white/70 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <button
          onClick={() => loginWithEmail(email.trim(), password)}
          disabled={loading}
          className="mt-6 h-12 w-full rounded-xl bg-white/20 py-3 font-semibold text-white shadow-lg transition hover:bg-white/30 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-md text-white">Or continue with</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={signInWithGoogle}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
          >
            <Image src="/google.png" alt="Google" width={22} height={22} />
          </button>

          <button
            onClick={signInWithMicrosoft}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
          >
            <Image
              src="/Microsoft.png"
              alt="Microsoft"
              width={22}
              height={22}
            />
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-[#8c8b8b]">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-white hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
