"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, LogOut, ArrowUpRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTheme } from "@/store/slices/uiSlice";
import { clearCredentials } from "@/store/slices/authSlice";
import { clearAccountState } from "@/store/slices/accountSlice";
import { useIsMounted } from "@/hooks/useIsMounted";

const ACCENT = "#FF5A1F";
const INK = "#101114"; // text on top of the orange

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

/** Monogram: orange tile with a hand-set "N" */
function Mark() {
  return (
    <svg viewBox="0 0 32 32" className="h-9 w-9 transition-transform duration-300 group-hover:-rotate-6" aria-hidden>
      <rect width="32" height="32" rx="10" fill={ACCENT} />
      <path d="M10.5 22.5V9.5l11 13v-13" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Wobbly underline for the active link, same stroke as the one under the hero headline */
function Squiggle() {
  return (
    <svg className="absolute -bottom-1 left-3 right-3 h-2 w-[calc(100%-1.5rem)]" viewBox="0 0 60 8" preserveAspectRatio="none" fill="none" aria-hidden>
      <path d="M1 5 Q8 1 15 4.5 T30 4 T45 4.5 T59 3" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");

  const dispatch = useAppDispatch();
  const mounted = useIsMounted();
  const { theme } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);
  const isDark = mounted ? theme === "dark" : true;
  const currentUser = mounted ? user : null;

  const handleLogout = () => {
    dispatch(clearCredentials());
    dispatch(clearAccountState());
  };

  // shrink into a floating pill once you scroll
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      if (window.scrollY < 200) setActive("");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // highlight the link of the section you're reading
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Esc closes the mobile menu; so does growing the window past the breakpoint
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    const onResize = () => window.innerWidth >= 768 && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  const pillStyle = scrolled || menuOpen
    ? { background: "var(--land-nav-bg)", borderColor: "var(--land-border)" }
    : { background: "transparent", borderColor: "transparent" };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <div
        className={`mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border pl-4 pr-2 transition-all duration-300 sm:pl-5 ${scrolled || menuOpen ? "shadow-lg shadow-black/10 backdrop-blur-xl" : ""
          }`}
        style={pillStyle}
      >
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5" aria-label="NovaBank home">
          <Mark />
          <span className="text-[19px] tracking-tight" style={{ color: "var(--land-text)" }}>
            Nova<span className="font-extrabold">Bank</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center md:flex" aria-label="Main">
          {navLinks.map((link) => {
            const isActive = active === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "true" : undefined}
                className="relative px-4 py-2 text-sm font-medium transition-colors hover:text-[#FF5A1F]"
                style={{ color: isActive ? "var(--land-text)" : "var(--land-text-muted)" }}
              >
                {link.label}
                {isActive && <Squiggle />}
              </a>
            );
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-1.5 md:flex">
          <button
            onClick={() => dispatch(toggleTheme())}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="relative grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-[color-mix(in_srgb,var(--land-text)_8%,transparent)]"
            style={{ color: "var(--land-text-muted)" }}
          >
            <Sun
              className={`absolute h-[18px] w-[18px] transition-all duration-300 ${isDark ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
            />
            <Moon
              className={`absolute h-[18px] w-[18px] transition-all duration-300 ${isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"}`}
            />
          </button>

          {currentUser ? (
            <>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
              <Link
                href="/dashboard"
                className="group flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold transition hover:brightness-95 active:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ background: ACCENT, color: INK, outlineColor: ACCENT }}
              >
                Dashboard
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-[#FF5A1F]"
                style={{ color: "var(--land-text)" }}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="group flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold transition hover:brightness-95 active:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ background: ACCENT, color: INK, outlineColor: ACCENT }}
              >
                Open account
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            onClick={() => dispatch(toggleTheme())}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="grid h-10 w-10 place-items-center rounded-full"
            style={{ color: "var(--land-text-muted)" }}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-full"
            style={{ background: menuOpen ? ACCENT : "transparent", color: menuOpen ? INK : "var(--land-text)" }}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="mx-auto mt-2 max-w-6xl rounded-3xl border p-3 shadow-xl shadow-black/15 backdrop-blur-xl md:hidden"
          style={{ background: "var(--land-nav-bg)", borderColor: "var(--land-border)" }}
        >
          <nav className="flex flex-col" aria-label="Mobile">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-lg font-semibold transition-colors hover:bg-[color-mix(in_srgb,var(--land-text)_8%,transparent)]"
                style={{ color: active === link.href ? ACCENT : "var(--land-text)" }}
              >
                {link.label}
                <ArrowUpRight className="h-4 w-4 opacity-40" />
              </a>
            ))}
          </nav>

          <div className="mt-2 grid gap-2 border-t pt-3" style={{ borderColor: "var(--land-border)" }}>
            {currentUser ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full px-5 py-3 text-center text-sm font-bold"
                  style={{ background: ACCENT, color: INK }}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="rounded-full px-5 py-3 text-center text-sm font-medium text-red-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full px-5 py-3 text-center text-sm font-bold"
                  style={{ background: ACCENT, color: INK }}
                >
                  Open account free
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full px-5 py-3 text-center text-sm font-medium"
                  style={{ color: "var(--land-text)" }}
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}