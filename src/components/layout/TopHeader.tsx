"use client";

import { useState } from "react";
import {
  Search,
  Bell,
  Menu,
  Sun,
  Moon,
  CheckCheck,
  Wallet,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSidebarOpen, toggleTheme, setGlobalSearch } from "@/store/slices/uiSlice";
import {
  useGetMyNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "@/store/api/bankingApi";
import { useRouter } from "next/navigation";

export default function TopHeader() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const { accounts } = useAppSelector((state) => state.account);
  const { theme, globalSearch } = useAppSelector((state) => state.ui);
  const [notifOpen, setNotifOpen] = useState(false);

  const { data: notifData } = useGetMyNotificationsQuery(undefined, {
    skip: !user,
    pollingInterval: 30000,
  });

  const [markAllRead] = useMarkAllNotificationsAsReadMutation();
  const [markOneRead] = useMarkNotificationAsReadMutation();

  const totalBalance = accounts.reduce(
    (sum, acc) => sum + Number(acc.balance),
    0
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      router.push(`/dashboard/transactions?search=${encodeURIComponent(globalSearch.trim())}`);
    }
  };

  const unreadCount = notifData?.unreadCount || 0;
  const notifications = notifData?.notifications || [];

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/80 px-6 py-4 backdrop-blur-xl">
      {/* Left: Mobile Menu + Greeting */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(setSidebarOpen(true))}
          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 text-[var(--text-primary)] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            Good to see you, {user?.name?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-xs text-[var(--text-muted)] sm:text-sm">
            {user?.role === "admin"
              ? "Bank Administration & Analytics Overview"
              : user?.role === "bank_staff"
              ? "Bank Operations & Verification Portal"
              : "Your Weekly Financial Update"}
          </p>
        </div>
      </div>

      {/* Right: Search, Orange Balance Pill, Theme Toggle, Bell, Profile */}
      <div className="flex items-center gap-3">
        {/* Pill Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => dispatch(setGlobalSearch(e.target.value))}
            placeholder="Search TXN ID..."
            className="w-48 lg:w-64 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] py-2 pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#FF5A1F] focus:outline-none transition-all"
          />
        </form>

        {/* Orange Balance Pill (matching reference image top right) */}
        {user?.role === "customer" && (
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-[#FF5A1F] px-4 py-2 text-xs font-bold text-white shadow-md shadow-[#FF5A1F]/25">
            <Wallet className="h-3.5 w-3.5" />
            <span>
              $
              {totalBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        )}

        {/* Quick Theme Toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          title="Toggle Dark / Light Mode"
          className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2.5 text-[var(--text-muted)] hover:border-[#FF5A1F] hover:text-[#FF5A1F] transition-colors"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-indigo-600" />
          )}
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2.5 text-[var(--text-muted)] hover:border-[#FF5A1F] hover:text-[var(--text-primary)] transition-colors"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF5A1F] text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-2xl z-50">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <h3 className="text-sm font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllRead()}
                    className="flex items-center gap-1 text-xs text-[#FF5A1F] hover:underline"
                  >
                    <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                  </button>
                )}
              </div>

              <div className="mt-2 max-h-72 space-y-2 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="py-6 text-center text-xs text-[var(--text-muted)]">
                    No notifications yet.
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => !n.isRead && markOneRead(n.id)}
                      className={`cursor-pointer rounded-xl p-3 text-xs transition-colors ${
                        n.isRead
                          ? "bg-transparent text-[var(--text-muted)]"
                          : "bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 text-[var(--text-primary)]"
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span>{n.title}</span>
                        {!n.isRead && (
                          <span className="h-2 w-2 rounded-full bg-[#FF5A1F]" />
                        )}
                      </div>
                      <p className="mt-1 opacity-85">{n.message}</p>
                      <span className="mt-1 block text-[10px] opacity-60">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Pill */}
        <div className="flex items-center gap-2.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] py-1.5 pl-1.5 pr-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#FF5A1F] to-amber-500 text-xs font-bold text-white">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <p className="text-xs font-semibold">{user?.name}</p>
            <p className="text-[10px] uppercase tracking-wider text-[#00E676] font-semibold">
              {user?.role?.replace("_", " ")}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

