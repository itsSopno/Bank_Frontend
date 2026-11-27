"use client";

import Link from "next/link";
import { ArrowRight, Check, Nfc } from "lucide-react";

const ACCENT = "#FF5A1F";
const INK = "#101114"; // text on top of the orange

const perks = ["No credit card required", "Free forever plan", "Setup in 2 minutes"];

function Sparkle({ className, color = INK }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path d="M12 0 C12.8 7 17 11.2 24 12 C17 12.8 12.8 17 12 24 C11.2 17 7 12.8 0 12 C7 11.2 11.2 7 12 0Z" fill={color} />
    </svg>
  );
}

export default function CTASection() {
  return (
    <section
      id="about"
      className="px-6 py-24 transition-colors duration-300 lg:px-8"
      style={{ background: "var(--land-bg-alt)" }}
    >
      <div
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] px-8 py-14 shadow-2xl shadow-[#FF5A1F]/25 sm:px-12 lg:px-16 lg:py-20"
        style={{ background: ACCENT, color: INK }}
      >
        {/* faint dot pattern + sparkles */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `radial-gradient(${INK} 1px, transparent 1px)`,
            backgroundSize: "22px 22px",
          }}
          aria-hidden
        />
        <Sparkle className="absolute left-8 top-8 h-4 w-4" />
        <Sparkle className="absolute right-[44%] top-12 hidden h-3.5 w-3.5 lg:block" color="#fff" />
        <Sparkle className="absolute bottom-10 right-8 h-4 w-4 lg:right-1/2" color="#fff" />

        <div className="relative grid items-center gap-12 lg:grid-cols-2">
          {/* Left: copy */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#101114] px-4 py-1.5 text-xs font-bold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF5A1F]" />
              Start today, it&apos;s free
            </span>

            <h2 className="mt-6 text-4xl font-bold leading-[1.25] tracking-tight sm:text-5xl">
              Ready to bank{" "}
              <span className="inline-block rounded-xl bg-[#101114] px-3 text-white">smarter?</span>
            </h2>

            <p className="mt-5 max-w-md text-[15px] leading-relaxed" style={{ color: "rgba(16,17,20,0.8)" }}>
              Join 2.4 million people who already use NovaBank for their daily banking. Takes less than 2 minutes
              to get started.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#101114] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/25 transition hover:-translate-y-0.5 hover:bg-black active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#101114]"
              >
                Open Free Account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border-2 border-[#101114] px-7 py-3 text-sm font-bold transition hover:-translate-y-0.5 hover:bg-[#101114] hover:text-white active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#101114]"
              >
                Sign In
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
              {perks.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-[#101114] text-white">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: card peeking out of the panel */}
          <div className="relative hidden h-[300px] lg:block" aria-hidden>
            <div className="absolute z-10 -bottom-24 left-1/2 w-[300px] -translate-x-1/2 rotate-[-8deg] overflow-hidden rounded-[26px] bg-[#101114] text-white shadow-2xl shadow-black/40">
              <div className="h-[210px] p-6">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold tracking-wide">NOVABANK</span>
                  <Nfc className="h-5 w-5 text-white/80" />
                </div>
                <div className="mt-6 relative h-9 w-12 rounded-lg border border-amber-700/30 bg-gradient-to-br from-amber-200 to-amber-400">
                  <span className="absolute inset-x-0 top-1/2 h-px bg-amber-700/40" />
                  <span className="absolute inset-y-0 left-1/2 w-px bg-amber-700/40" />
                </div>
                <p className="mt-8 text-lg tracking-[0.2em] text-white/90">•••• •••• •••• 4821</p>
              </div>
              <div className="flex items-center justify-between px-6 pb-6 text-xs text-white/60">
                <span>Rahim Uddin</span>
                <span className="text-base font-black italic text-white">NB</span>
              </div>
            </div>

            {/* second card behind, lighter */}
            <div className="absolute -bottom-28 left-1/2 ml-16 h-[280px] w-[260px] -translate-x-1/2 rotate-[10deg] rounded-[26px] bg-[#EFEBD6] shadow-xl shadow-black/25" />
          </div>
        </div>
      </div>
    </section>
  );
}