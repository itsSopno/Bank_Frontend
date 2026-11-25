"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Shield,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Edit3,
  Save,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { useSetPinMutation } from "@/store/api/bankingApi";

export default function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth);
  const [setPin, { isLoading: pinLoading }] = useSetPinMutation();

  // PIN form
  const [pinForm, setPinForm] = useState({
    currentPassword: "",
    pin: "",
    confirmPin: "",
  });
  const [pinMessage, setPinMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showPin, setShowPin] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const roleBadgeColor = {
    admin: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    bank_staff: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    customer: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  };

  const roleLabel = {
    admin: "Administrator",
    bank_staff: "Bank Staff",
    customer: "Customer",
  };

  const handleSetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinMessage(null);

    if (pinForm.pin.length !== 4 || !/^\d{4}$/.test(pinForm.pin)) {
      setPinMessage({ type: "error", text: "PIN must be exactly 4 digits." });
      return;
    }
    if (pinForm.pin !== pinForm.confirmPin) {
      setPinMessage({ type: "error", text: "PINs do not match." });
      return;
    }

    try {
      await setPin({
        pin: pinForm.pin,
        currentPassword: pinForm.currentPassword,
      }).unwrap();
      setPinMessage({ type: "success", text: "Transaction PIN updated successfully!" });
      setPinForm({ currentPassword: "", pin: "", confirmPin: "" });
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setPinMessage({
        type: "error",
        text: error?.data?.message ?? "Failed to update PIN.",
      });
    }
  };

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Profile</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          View your account details and manage your transaction PIN
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Avatar + Info Card ── */}
        <div className="lg:col-span-1">
          <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-5">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#FF5A1F] to-orange-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-[#FF5A1F]/30">
                  {initials}
                </div>
                <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-[var(--bg-surface)]" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-[var(--text-primary)] text-lg">{user.name}</p>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium mt-1 ${
                    roleBadgeColor[user.role]
                  }`}
                >
                  <Shield className="h-3 w-3" />
                  {roleLabel[user.role]}
                </span>
              </div>
            </div>

            <hr className="border-[var(--border-subtle)]" />

            {/* Info List */}
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-[var(--text-muted)]">
                <Mail className="h-4 w-4 mt-0.5 shrink-0 text-[#FF5A1F]" />
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-0.5">Email</p>
                  <p className="text-[var(--text-primary)] font-medium">{user.email}</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-0.5 shrink-0 text-[#FF5A1F]" />
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-0.5">Phone</p>
                  <p className="text-[var(--text-primary)] font-medium">
                    {user.phone ?? "—"}
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-[#FF5A1F]" />
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-0.5">Address</p>
                  <p className="text-[var(--text-primary)] font-medium">
                    {user.address ?? "—"}
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <User className="h-4 w-4 mt-0.5 shrink-0 text-[#FF5A1F]" />
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-0.5">Account Status</p>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      user.status === "active"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-red-500/15 text-red-400"
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    {user.status ?? "active"}
                  </span>
                </div>
              </li>
            </ul>

            {/* Member Since */}
            <div className="rounded-2xl bg-[var(--bg-elevated)] p-3 text-center">
              <p className="text-xs text-[var(--text-muted)]">Member Since</p>
              <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* ── Right: Security / PIN ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Security Overview */}
          <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-2xl bg-[#FF5A1F]/15 flex items-center justify-center">
                <Lock className="h-5 w-5 text-[#FF5A1F]" />
              </div>
              <div>
                <h2 className="font-semibold text-[var(--text-primary)]">Security Settings</h2>
                <p className="text-xs text-[var(--text-muted)]">Manage your transaction PIN</p>
              </div>
            </div>

            {/* Security Badges */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-3 flex items-center gap-3">
                <Shield className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="text-xs text-[var(--text-muted)]">Password</p>
                  <p className="text-sm font-medium text-emerald-400">Protected</p>
                </div>
              </div>
              <div className="rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-3 flex items-center gap-3">
                <Lock className="h-5 w-5 text-[#FF5A1F]" />
                <div>
                  <p className="text-xs text-[var(--text-muted)]">Transaction PIN</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">4-Digit PIN</p>
                </div>
              </div>
            </div>

            {/* Set / Update PIN Form */}
            <form onSubmit={handleSetPin} className="space-y-4">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-[#FF5A1F]" />
                Set / Update Transaction PIN
              </h3>

              {/* Current Password */}
              <div className="relative">
                <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={pinForm.currentPassword}
                    onChange={(e) =>
                      setPinForm((f) => ({ ...f, currentPassword: e.target.value }))
                    }
                    placeholder="Enter your current password"
                    required
                    className="w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-3 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#FF5A1F] focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* New PIN + Confirm */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">
                    New 4-Digit PIN
                  </label>
                  <div className="relative">
                    <input
                      type={showPin ? "text" : "password"}
                      value={pinForm.pin}
                      onChange={(e) =>
                        setPinForm((f) => ({
                          ...f,
                          pin: e.target.value.replace(/\D/g, "").slice(0, 4),
                        }))
                      }
                      placeholder="••••"
                      maxLength={4}
                      required
                      className="w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-3 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#FF5A1F] focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/20 transition-all tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                      {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">
                    Confirm PIN
                  </label>
                  <input
                    type={showPin ? "text" : "password"}
                    value={pinForm.confirmPin}
                    onChange={(e) =>
                      setPinForm((f) => ({
                        ...f,
                        confirmPin: e.target.value.replace(/\D/g, "").slice(0, 4),
                      }))
                    }
                    placeholder="••••"
                    maxLength={4}
                    required
                    className="w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#FF5A1F] focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/20 transition-all tracking-widest"
                  />
                </div>
              </div>

              {/* PIN strength dots */}
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      pinForm.pin.length > i ? "bg-[#FF5A1F]" : "bg-[var(--border-subtle)]"
                    }`}
                  />
                ))}
                <span className="text-xs text-[var(--text-muted)] ml-1 w-14">
                  {pinForm.pin.length}/4 digits
                </span>
              </div>

              {/* Feedback */}
              {pinMessage && (
                <div
                  className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm ${
                    pinMessage.type === "success"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}
                >
                  {pinMessage.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0" />
                  )}
                  {pinMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={pinLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF5A1F] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#FF5A1F]/30 hover:bg-[#e04d18] active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {pinLoading ? (
                  <div className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {pinLoading ? "Saving..." : "Save Transaction PIN"}
              </button>
            </form>
          </div>

          {/* Account ID Card */}
          <div className="rounded-3xl border border-[var(--border-subtle)] bg-gradient-to-r from-[#FF5A1F]/10 to-transparent p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-0.5">User ID</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">#{user.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[var(--text-muted)] mb-0.5">Role</p>
              <p className="text-sm font-semibold text-[#FF5A1F] capitalize">
                {roleLabel[user.role]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

