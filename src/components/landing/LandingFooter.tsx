"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useIsMounted } from "@/hooks/useIsMounted";

const ACCENT = "#FF5A1F";
const INK = "#101114"; // text on top of the orange

// href "#" = page doesn't exist yet. Swap in real routes as you build them.
const footerLinks: Record<string, { label: string; href: string }[]> = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Security", href: "#security" },
    { label: "Pricing", href: "#pricing" },
    { label: "Roadmap", href: "#" },
  ],
  Company: [
    { label: "About", href: "#about" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Compliance", href: "#" },
  ],
  Support: [
    { label: "Help Center", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "Status", href: "#" },
    { label: "API Docs", href: "#" },
  ],
};

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/itsSopno",
    svg: <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />,
  },
  {
    label: "X",
    href: "#",
    svg: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />,
  },
  {
    label: "LinkedIn",
    href: "#",
    svg: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />,
  },
];

/** Same monogram as the navbar */
function Mark() {
  return (
    <svg viewBox="0 0 32 32" className="h-9 w-9 transition-transform duration-300 group-hover:-rotate-6" aria-hidden>
      <rect width="32" height="32" rx="10" fill={ACCENT} />
      <path d="M10.5 22.5V9.5l11 13v-13" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Local time, because a bank is run by people in a place */
function LocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Asia/Dhaka",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return <span>{time ? `Dhaka · ${time}` : "Dhaka"}</span>;
}

export default function LandingFooter() {
  const mounted = useIsMounted();
  const year = mounted ? new Date().getFullYear() : 2026;

  return (
    <footer
      className="relative overflow-hidden border-t px-6 pt-16 transition-colors duration-300 lg:px-8"
      style={{ background: "var(--land-bg)", borderColor: "var(--land-border)" }}
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="group flex w-fit items-center gap-2.5" aria-label="NovaBank home">
              <Mark />
              <span className="text-[19px] tracking-tight" style={{ color: "var(--land-text)" }}>
                Nova<span className="font-extrabold">Bank</span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-[15px] leading-relaxed" style={{ color: "var(--land-text-muted)" }}>
              Banking for Bangladesh that is fast, secure and doesn&apos;t make you read the fine print twice.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {socials.map(({ label, href, svg }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border transition hover:-translate-y-0.5 hover:border-[#FF5A1F] hover:text-[#FF5A1F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{
                    borderColor: "var(--land-border)",
                    background: "var(--land-surface)",
                    color: "var(--land-text-muted)",
                    outlineColor: ACCENT,
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
                    {svg}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <nav key={category} aria-label={category}>
              <h4 className="mb-4 text-sm font-semibold" style={{ color: "var(--land-text)" }}>
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="group/link relative inline-block text-sm transition-colors hover:text-[#FF5A1F]"
                      style={{ color: "var(--land-text-muted)" }}
                    >
                      {label}
                      <span
                        className="absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-300 group-hover/link:w-full"
                        style={{ background: ACCENT }}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-16 flex flex-col items-start justify-between gap-4 border-t py-6 text-sm sm:flex-row sm:items-center"
          style={{ borderColor: "var(--land-border)", color: "var(--land-text-faint)" }}
        >
          <p className="flex flex-wrap items-center gap-x-1.5">
            © {year} NovaBank. Made by
            Sinners Studio
          </p>

          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              All systems operational
            </span>
            <span className="hidden text-xs sm:inline" suppressHydrationWarning>
              <LocalTime />
            </span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="grid h-9 w-9 place-items-center rounded-full transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ background: ACCENT, color: INK, outlineColor: ACCENT }}
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Oversized wordmark, cropped at the bottom edge */}
      <div
        className="pointer-events-none relative -mb-[3.2vw] select-none text-center font-black leading-[0.8] tracking-tighter"
        style={{ fontSize: "clamp(4rem, 19vw, 18rem)", color: "var(--land-text)", opacity: 0.06 }}
        aria-hidden
      >
        NovaBank
      </div>
    </footer>
  );
}