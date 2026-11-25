"use client";

import Link from "next/link";
import { ArrowRight, Check, Nfc, ShieldCheck, Zap, Globe } from "lucide-react";

const ACCENT = "#FF5A1F";
const INK = "#101114"; // text on top of the orange (same in light and dark mode)

const stats = [
  { value: "2.4M+", label: "Active users\nacross the country" },
  { value: "10M+", label: "Transactions\nevery single day" },
  { value: "99.99%", label: "Uptime for\nyour banking" },
];

const perks = [
  { icon: ShieldCheck, text: "Bank-grade security" },
  { icon: Zap, text: "Instant transfers" },
  { icon: Globe, text: "Global payments" },
];

function Sparkle({ className, color = "var(--land-text)" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path d="M12 0 C12.8 7 17 11.2 24 12 C17 12.8 12.8 17 12 24 C11.2 17 7 12.8 0 12 C7 11.2 11.2 7 12 0Z" fill={color} />
    </svg>
  );
}

function Chip() {
  return (
    <div className="relative h-9 w-12 rounded-lg border border-amber-700/30 bg-gradient-to-br from-amber-200 to-amber-400">
      <span className="absolute inset-x-0 top-1/2 h-px bg-amber-700/40" />
      <span className="absolute inset-y-0 left-1/2 w-px bg-amber-700/40" />
      <span className="absolute inset-y-[9px] left-[14px] right-[14px] rounded-sm border border-amber-700/30" />
    </div>
  );
}

export default function HeroSection() {
  return (
    <section
      className="hero relative overflow-hidden pt-24 transition-colors duration-300"
      style={{ background: "var(--land-bg-alt)", color: "var(--land-text)" }}
    >
      {/* One entrance sequence on load; skipped for people who prefer reduced motion */}
      <style>{`
        @keyframes hero-rise { from { opacity: 0; transform: translateY(28px) rotate(var(--r, 0deg)); } to { opacity: 1; transform: translateY(0) rotate(var(--r, 0deg)); } }
        @keyframes hero-pop { from { opacity: 0; transform: scale(.85) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes hero-draw { to { stroke-dashoffset: 0; } }
        @media (prefers-reduced-motion: no-preference) {
          .hero-card { opacity: 0; animation: hero-rise .8s cubic-bezier(.2,.8,.2,1) forwards; }
          .hero-card.c1 { animation-delay: .35s; }
          .hero-card.c2 { animation-delay: .2s; }
          .hero-card.c3 { animation-delay: .05s; }
          .hero-pill { opacity: 0; animation: hero-pop .5s cubic-bezier(.2,.8,.2,1) 1.1s forwards; }
          .hero-ring { stroke-dasharray: 1200; stroke-dashoffset: 1200; animation: hero-draw 1.6s ease-out .1s forwards; }
        }
        .hero-stack:hover .c1 { transform: translate(-10px, -6px) rotate(-4deg); }
        .hero-stack:hover .c3 { transform: translate(10px, 6px) rotate(16deg); }
        .hero-card { transition: transform .4s cubic-bezier(.2,.8,.2,1); }
      `}</style>

      {/* soft orange glow behind the cards */}
      <div
        className="pointer-events-none absolute -right-24 top-10 h-[460px] w-[460px] rounded-full blur-[120px]"
        style={{ background: "var(--land-glow-orange)" }}
        aria-hidden
      />

      <Sparkle className="absolute left-8 top-28 h-4 w-4" />
      <Sparkle className="absolute right-10 top-24 hidden h-4 w-4 sm:block" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
        {/* Left */}
        <div className="pb-6 lg:pb-24">
          <h1 className="text-4xl font-bold leading-[1.35] tracking-tight sm:text-5xl">
            Enjoy{" "}
            <span className="rounded-md px-2 [box-decoration-break:clone]" style={{ background: ACCENT, color: INK }}>
              Various Benefits
            </span>
            <br />
            by Becoming Our Loyal
            <br />
            <span className="relative inline-block">
              Customer.
              <span className="absolute -bottom-1 left-0 h-1.5 w-2/3 rounded" style={{ background: ACCENT, opacity: 0.25 }} />
            </span>
          </h1>

          <p className="mt-6 max-w-md text-[15px] leading-relaxed" style={{ color: "var(--land-text-muted)" }}>
            <span className="mr-1 rounded px-1 font-semibold" style={{ background: ACCENT, color: INK }}>
              Prime Bank
            </span>
            gives you both the foundation and flexibility to build and grow digital capabilities and deliver
            customer experiences.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold shadow-lg shadow-[#FF5A1F]/30 transition hover:-translate-y-0.5 hover:brightness-95 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ background: ACCENT, color: INK, outlineColor: ACCENT }}
            >
              Get started free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center rounded-full border px-7 py-3.5 text-sm font-bold transition hover:-translate-y-0.5 hover:border-[#FF5A1F] active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                borderColor: "var(--land-border)",
                background: "var(--land-surface)",
                color: "var(--land-text)",
                outlineColor: ACCENT,
              }}
            >
              Sign in
            </Link>
          </div>

          {/* perks */}
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm" style={{ color: "var(--land-text-muted)" }}>
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2">
                <Icon className="h-4 w-4" style={{ color: ACCENT }} />
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: cards (scaled on small screens so nothing gets cut off) */}
        <div className="relative z-10 mx-auto h-[340px] w-full max-w-[520px] sm:h-[440px] lg:-mb-20 lg:h-[480px]">
          <div className="hero-stack absolute left-1/2 top-0 h-[480px] w-[560px] -translate-x-1/2 origin-top scale-[0.62] sm:scale-90 lg:scale-100">
            {/* outline ring */}
            <svg className="absolute -left-4 -top-4 h-[110%] w-full" viewBox="0 0 520 470" fill="none" aria-hidden>
              <path
                className="hero-ring"
                d="M30 380 C -10 230, 80 40, 270 15 C 420 -5, 500 120, 470 260"
                stroke="var(--land-text)"
                strokeOpacity="0.7"
                strokeWidth="1.2"
              />
            </svg>

            {/* teal card (far back) */}
            <div
              className="hero-card c3 absolute left-[330px] top-[70px] h-[320px] w-[230px] rounded-[26px] shadow-xl shadow-black/20"
              style={{ background: "#BFE3D8", ["--r" as string]: "14deg", transform: "rotate(14deg)" }}
            />

            {/* beige card with bars */}
            <div
              className="hero-card c2 absolute left-[190px] top-[40px] h-[330px] w-[240px] overflow-hidden rounded-[26px] bg-[#EFEBD6] text-[#101114] shadow-xl shadow-black/25"
              style={{ ["--r" as string]: "8deg", transform: "rotate(8deg)" }}
            >
              <div className="flex items-start justify-between p-5">
                <span className="text-[9px] font-bold">PRIME BANK</span>
                <Nfc className="h-4 w-4" />
              </div>
              <div className="px-5">
                <Chip />
              </div>
              <div className="absolute bottom-[78px] right-6 flex items-end gap-1.5" aria-hidden>
                {[30, 70, 45, 95, 60, 110, 50].map((h, i) => (
                  <span key={i} className="w-[3px] bg-[#101114]" style={{ height: h }} />
                ))}
              </div>
              <div className="absolute inset-x-0 bottom-0 flex h-[70px] items-center justify-between bg-[#14140f] px-5 text-white">
                <span className="text-[11px] text-white/70">Savings</span>
                <span className="text-lg font-black italic">PB</span>
              </div>
            </div>

            {/* orange front card */}
            <div
              className="hero-card c1 absolute left-[40px] top-0 h-[340px] w-[250px] overflow-hidden rounded-[26px] shadow-2xl shadow-black/30"
              style={{ background: ACCENT, color: INK, ["--r" as string]: "-2deg", transform: "rotate(-2deg)" }}
            >
              <div className="flex items-start justify-between p-5">
                <span className="text-[9px] font-bold">PRIME BANK</span>
                <span className="text-[10px] font-semibold tracking-widest">•••• 4821</span>
              </div>
              <div className="flex items-center justify-end gap-2 px-5">
                <Chip />
                <Nfc className="h-4 w-4" />
              </div>
              {/* plant line art */}
              <svg className="absolute left-5 top-24 h-44 w-36" viewBox="0 0 100 130" fill="none" aria-hidden>
                <path d="M50 128 C 52 90, 60 50, 78 8" stroke={INK} strokeWidth="1.5" />
                <g fill={INK}>
                  <path d="M54 100 C 36 96 24 84 20 66 C 40 70 52 82 54 100Z" />
                  <path d="M58 84 C 76 80 88 68 92 50 C 72 54 60 66 58 84Z" />
                  <path d="M62 62 C 46 58 36 48 34 32 C 52 36 62 46 62 62Z" />
                  <path d="M68 42 C 82 38 90 30 92 16 C 76 20 68 28 68 42Z" />
                </g>
              </svg>
              <div className="absolute inset-x-0 bottom-0 h-[84px] bg-[#14140f] px-5 py-4 text-white">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-sky-400 text-[10px] font-bold text-[#101114]">
                    R
                  </span>
                  <span className="text-sm font-semibold">Rahim Uddin</span>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-[11px] text-white/60">Debit Card</span>
                  <span className="text-xl font-black italic">PB</span>
                </div>
              </div>
            </div>

            {/* transfer confirmation pill */}
            <div
              className="hero-pill absolute -left-2 top-[300px] z-20 flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl shadow-black/20 backdrop-blur"
              style={{ background: "var(--land-card-bg)", borderColor: "var(--land-card-border)", color: "var(--land-text)" }}
              role="status"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-white">
                <Check className="h-4 w-4" strokeWidth={3} />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-bold">৳ 12,500 sent</p>
                <p className="text-[11px]" style={{ color: "var(--land-text-faint)" }}>
                  Arrived in 2 seconds
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dark stats bar */}
      <div className="relative mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 rounded-3xl border border-white/10 bg-gradient-to-b from-[#3a3a3a] via-[#1c1c1c] to-[#0c0c0c] px-8 py-10 text-white shadow-xl sm:grid-cols-3 sm:divide-x sm:divide-white/15 lg:py-14">
          {stats.map((s) => (
            <div key={s.value} className="flex items-center gap-4 sm:px-8">
              <span className="text-5xl font-bold tracking-tight">{s.value}</span>
              <span className="whitespace-pre-line text-xs italic leading-snug text-white/70">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}