"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  History,
  Landmark,
  Users,
  ShieldAlert,
  LogOut,
  X,
  ArrowDownUp,
  Sun,
  Moon,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCredentials } from "@/store/slices/authSlice";
import { clearAccountState } from "@/store/slices/accountSlice";
import { setSidebarOpen, toggleTheme } from "@/store/slices/uiSlice";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: ("admin" | "bank_staff" | "customer")[];
}

const navItems: NavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "bank_staff", "customer"],
  },
  {
    label: "Accounts",
    href: "/dashboard/accounts",
    icon: Wallet,
    roles: ["admin", "bank_staff", "customer"],
  },
  {
    label: "Fund Transfer",
    href: "/dashboard/transfer",
    icon: ArrowLeftRight,
    roles: ["customer"],
  },
  {
    label: "Deposit & Withdraw",
    href: "/dashboard/requests",
    icon: ArrowDownUp,
    roles: ["customer"],
  },
  {
    label: "Transactions",
    href: "/dashboard/transactions",
    icon: History,
    roles: ["admin", "bank_staff", "customer"],
  },
  {
    label: "Loans",
    href: "/dashboard/loans",
    icon: Landmark,
    roles: ["admin", "bank_staff", "customer"],
  },
  {
    label: "Customers",
    href: "/dashboard/customers",
    icon: Users,
    roles: ["admin", "bank_staff"],
  },
  {
    label: "Pending Reviews",
    href: "/dashboard/reviews",
    icon: ShieldAlert,
    roles: ["admin", "bank_staff"],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { theme, sidebarOpen } = useAppSelector((state) => state.ui);

  const handleLogout = () => {
    dispatch(clearCredentials());
    dispatch(clearAccountState());
    router.push("/login");
  };

  const filteredNav = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col justify-between border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Brand Logo */}
        <div>
          <div className="flex items-center justify-between px-6 py-6">
            <Link href="/dashboard" className="flex items-center gap-3">
              {/* Geometric stacked square logo matching reference screenshot */}
              <div className="relative h-9 w-9 flex items-center justify-center">
                <span className="absolute top-1 left-1 h-4 w-4 rounded-sm bg-[#FF5A1F]" />
                <span className="absolute bottom-1 right-1 h-4 w-4 rounded-sm bg-gray-900 dark:bg-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Nova<span className="text-[#FF5A1F]">Bank</span>
              </span>
            </Link>

            <button
              onClick={() => dispatch(setSidebarOpen(false))}
              className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-4 space-y-1.5 px-4">
            {filteredNav.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => dispatch(setSidebarOpen(false))}
                  className={`flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#FF5A1F] text-white shadow-lg shadow-[#FF5A1F]/25"
                      : "text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: Theme Switch & Logout */}
        <div className="border-t border-[var(--border-subtle)] p-4 space-y-2">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="flex w-full items-center justify-between rounded-2xl px-4 py-2.5 text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors"
          >
            <span className="flex items-center gap-3">
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-amber-400" />
              ) : (
                <Moon className="h-5 w-5 text-indigo-500" />
              )}
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </span>
            <span className="rounded-full bg-[var(--bg-elevated)] px-2.5 py-0.5 text-xs border border-[var(--border-subtle)]">
              {theme === "dark" ? "Dark" : "Light"}
            </span>
          </button>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

