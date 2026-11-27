"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, Sun, Moon } from "lucide-react";
import { useLoginMutation } from "@/store/api/bankingApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { setAccounts } from "@/store/slices/accountSlice";
import { toggleTheme } from "@/store/slices/uiSlice";
import { useIsMounted } from "@/hooks/useIsMounted";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const mounted = useIsMounted();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.ui);
  const currentTheme = mounted ? theme : "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ user: res.user, token: res.token }));
      if (res.accounts) {
        dispatch(setAccounts(res.accounts));
      }
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Invalid email or password.");
    }
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Password123!");
    setErrorMsg("");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[var(--bg-canvas)] px-4 py-12 text-[var(--text-primary)]">
      {/* Top Left Back to Home */}
      <Link
        href="/"
        className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2.5 text-xs font-semibold text-[var(--text-muted)] hover:border-[#FF5A1F] hover:text-[var(--text-primary)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      {/* Top Right Theme Switch */}
      <button
        onClick={() => dispatch(toggleTheme())}
        className="absolute right-6 top-6 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 text-[var(--text-muted)] hover:border-[#FF5A1F] transition-colors"
      >
        {currentTheme === "dark" ? (
          <Sun className="h-5 w-5 text-amber-400" />
        ) : (
          <Moon className="h-5 w-5 text-indigo-600" />
        )}
      </button>

      <div className="w-full max-w-md space-y-6 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 shadow-2xl">
        {/* Brand Logo */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3 flex h-12 w-12 items-center justify-center">
            <span className="absolute left-1.5 top-1.5 h-5 w-5 rounded-sm bg-[#FF5A1F]" />
            <span className="absolute bottom-1.5 right-1.5 h-5 w-5 rounded-sm bg-gray-900 dark:bg-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Sign in to Nova<span className="text-[#FF5A1F]">Bank</span>
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Secure Digital Banking Management System
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-medium text-red-500">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--text-muted)]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@bank.com"
                className="w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-3 pl-10 pr-4 text-sm focus:border-[#FF5A1F] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--text-muted)]">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-3 pl-10 pr-4 text-sm focus:border-[#FF5A1F] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF5A1F] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#FF5A1F]/25 hover:bg-[#e54e17] disabled:opacity-60 transition-all cursor-pointer"
          >
            {isLoading ? "Authenticating..." : "Sign In Securely"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Quick Demo Role Buttons */}
        <div className="border-t border-[var(--border-subtle)] pt-5">
          <div className="mb-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-[var(--text-muted)]">
            <ShieldCheck className="h-4 w-4 text-[#00E676]" />
            <span>Quick Demo Access (Password: Password123!)</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemo("admin@bank.com")}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-2 text-xs font-semibold hover:border-[#FF5A1F] hover:text-[#FF5A1F] transition-colors cursor-pointer"
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemo("staff@bank.com")}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-2 text-xs font-semibold hover:border-[#FF5A1F] hover:text-[#FF5A1F] transition-colors cursor-pointer"
            >
              👔 Staff
            </button>
            <button
              type="button"
              onClick={() => fillDemo("customer@bank.com")}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-2 text-xs font-semibold hover:border-[#00E676] hover:text-[#00E676] transition-colors cursor-pointer"
            >
              👤 Customer
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-[var(--text-muted)]">
          New to NovaBank?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#FF5A1F] hover:underline"
          >
            Open a Free Account
          </Link>
        </p>
      </div>
    </div>
  );
}

