"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTheme } from "@/store/slices/uiSlice";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.ui);
  const isDark = theme === "dark";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl border-b shadow-lg"
          : "bg-transparent"
      }`}
      style={
        scrolled
          ? {
              background: "var(--land-nav-bg)",
              borderColor: "var(--land-border)",
            }
          : {}
      }
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-9 w-9 flex items-center justify-center">
              <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-md bg-[#FF5A1F] group-hover:scale-110 transition-transform" />
              <span
                className="absolute bottom-0.5 right-0.5 h-5 w-5 rounded-md group-hover:scale-110 transition-transform delay-75"
                style={{ background: "var(--land-border)" }}
              />
            </div>
            <span className="text-xl font-bold tracking-tight transition-colors duration-300" style={{ color: "var(--land-text)" }}>
              Nova<span className="text-[#FF5A1F]">Bank</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-2 text-sm font-medium transition-all hover:text-[#FF5A1F]"
                style={{ color: "var(--land-text-muted)" }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: Theme Toggle + Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {/* ── Dark / Light Toggle ── */}
            <button
              onClick={() => dispatch(toggleTheme())}
              aria-label="Toggle theme"
              className="relative flex items-center gap-1.5 rounded-2xl px-3 py-2 text-sm font-medium transition-all hover:scale-105 active:scale-95"
              style={{
                border: "1px solid var(--land-border)",
                background: "var(--land-surface)",
                color: "var(--land-text-muted)",
              }}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {/* Animated icon */}
              <span className="relative h-5 w-5">
                <Sun
                  className={`absolute inset-0 h-5 w-5 text-amber-500 transition-all duration-300 ${
                    isDark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
                  }`}
                />
                <Moon
                  className={`absolute inset-0 h-5 w-5 text-indigo-400 transition-all duration-300 ${
                    isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
                  }`}
                />
              </span>
              <span className="hidden lg:inline">{isDark ? "Light" : "Dark"}</span>
            </button>

            <Link
              href="/login"
              className="rounded-2xl px-5 py-2 text-sm font-semibold transition-all hover:text-[#FF5A1F]"
              style={{
                border: "1px solid var(--land-border)",
                background: "var(--land-surface)",
                color: "var(--land-text-muted)",
              }}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-2xl bg-[#FF5A1F] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#FF5A1F]/30 hover:bg-[#e04d18] hover:shadow-[#FF5A1F]/50 active:scale-95 transition-all"
            >
              Open Account
            </Link>
          </div>

          {/* Mobile: Theme toggle + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => dispatch(toggleTheme())}
              aria-label="Toggle theme"
              className="rounded-xl p-2 transition-all"
              style={{
                border: "1px solid var(--land-border)",
                background: "var(--land-surface)",
                color: "var(--land-text-muted)",
              }}
            >
              {isDark ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-indigo-400" />}
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-xl p-2 transition-all"
              style={{ color: "var(--land-text-muted)" }}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden backdrop-blur-xl border-t px-6 py-4 space-y-1 transition-colors duration-300"
          style={{ background: "var(--land-nav-bg)", borderColor: "var(--land-border)" }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-4 py-2.5 text-sm font-medium transition-all hover:text-[#FF5A1F]"
              style={{ color: "var(--land-text-muted)" }}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <Link
              href="/login"
              className="rounded-2xl px-5 py-2.5 text-center text-sm font-semibold transition-all"
              style={{ border: "1px solid var(--land-border)", background: "var(--land-surface)", color: "var(--land-text)" }}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-2xl bg-[#FF5A1F] px-5 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-[#FF5A1F]/30 transition-all"
            >
              Open Account Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
