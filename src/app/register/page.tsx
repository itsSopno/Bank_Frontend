"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, KeyRound, Phone, ArrowRight } from "lucide-react";
import { useRegisterMutation } from "@/store/api/bankingApi";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { setAccounts } from "@/store/slices/accountSlice";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    transactionPin: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await register({
        ...form,
        role: "customer",
      }).unwrap();

      dispatch(setCredentials({ user: res.user, token: res.token }));
      if (res.account) {
        dispatch(setAccounts([res.account]));
      }
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(
        err?.data?.errors?.[0]?.message ||
          err?.data?.message ||
          "Registration failed."
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-canvas)] px-4 py-12 text-[var(--text-primary)]">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 shadow-2xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Create Your <span className="text-[#FF5A1F]">NovaBank</span> Account
          </h1>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Instant savings account creation upon sign up
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-medium text-red-500">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                className="w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-3 pl-10 pr-4 text-sm focus:border-[#FF5A1F] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="john@example.com"
                className="w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-3 pl-10 pr-4 text-sm focus:border-[#FF5A1F] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="6+ chars"
                  className="w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-3 pl-10 pr-3 text-sm focus:border-[#FF5A1F] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
                4-Digit PIN
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="password"
                  maxLength={4}
                  pattern="\d{4}"
                  required
                  value={form.transactionPin}
                  onChange={(e) =>
                    setForm({ ...form, transactionPin: e.target.value })
                  }
                  placeholder="e.g. 1234"
                  className="w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-3 pl-10 pr-3 text-sm focus:border-[#FF5A1F] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
              Phone (Optional)
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+880 1XXX-XXXXXX"
                className="w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-3 pl-10 pr-4 text-sm focus:border-[#FF5A1F] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF5A1F] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#FF5A1F]/25 hover:bg-[#e54e17] disabled:opacity-60 transition-all cursor-pointer"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="text-center text-xs text-[var(--text-muted)]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#FF5A1F] hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

