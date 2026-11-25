"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0D0D0F]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-9 w-9 flex items-center justify-center">
              <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-md bg-[#FF5A1F] group-hover:scale-110 transition-transform" />
              <span className="absolute bottom-0.5 right-0.5 h-5 w-5 rounded-md bg-white/10 group-hover:scale-110 transition-transform delay-75" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Nova<span className="text-[#FF5A1F]">Bank</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-2xl px-5 py-2 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/8 border border-white/10 hover:border-white/20 transition-all"
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden rounded-xl p-2 text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0D0D0F]/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-4 py-2.5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <Link
              href="/login"
              className="rounded-2xl border border-white/10 px-5 py-2.5 text-center text-sm font-semibold text-white/80 hover:bg-white/5 transition-all"
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

