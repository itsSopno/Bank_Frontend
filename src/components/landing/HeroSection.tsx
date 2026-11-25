"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react";

const stats = [
  { label: "Active Users", value: "2.4M+", color: "text-[#FF5A1F]" },
  { label: "Transactions Daily", value: "10M+", color: "text-[#00E676]" },
  { label: "Countries", value: "50+", color: "text-blue-400" },
  { label: "Uptime", value: "99.99%", color: "text-purple-400" },
];

const badges = [
  { icon: ShieldCheck, text: "Bank-grade Security" },
  { icon: Zap, text: "Instant Transfers" },
  { icon: Globe, text: "Global Payments" },
];

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 transition-colors duration-300"
      style={{ background: "var(--land-bg)" }}
    >
      {/* Background Glow Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full blur-[120px] transition-all duration-500"
          style={{ background: "var(--land-glow-orange)" }}
        />
        <div
          className="absolute -bottom-32 -right-20 h-[400px] w-[400px] rounded-full blur-[100px] transition-all duration-500"
          style={{ background: "var(--land-glow-green)" }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 dark:opacity-[0.03] opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(var(--land-text) 1px, transparent 1px), linear-gradient(90deg, var(--land-text) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 px-4 py-2 text-sm font-medium text-[#FF5A1F] mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF5A1F] animate-pulse" />
          Bangladesh&apos;s #1 Digital Banking Platform
        </div>

        {/* Main Headline */}
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6 transition-colors duration-300"
          style={{ color: "var(--land-text)" }}
        >
          Banking made{" "}
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A1F] to-orange-400">
              smarter
            </span>
            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
              <path d="M0 6 Q50 1 100 5 Q150 9 200 4" stroke="#FF5A1F" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
            </svg>
          </span>
          <br />
          <span style={{ color: "var(--land-text)" }}>for everyone</span>
        </h1>

        {/* Subtitle */}
        <p
          className="mx-auto max-w-2xl text-lg sm:text-xl leading-relaxed mb-10 transition-colors duration-300"
          style={{ color: "var(--land-text-muted)" }}
        >
          Open an account in minutes. Send money instantly. Manage loans, track transactions,
          and grow your savings — all in one secure platform.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/register"
            className="group flex items-center gap-2 rounded-2xl bg-[#FF5A1F] px-8 py-4 text-base font-bold text-white shadow-2xl shadow-[#FF5A1F]/30 hover:bg-[#e04d18] hover:shadow-[#FF5A1F]/50 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Get Started Free
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-2xl border px-8 py-4 text-base font-bold transition-all duration-200 hover:scale-105"
            style={{
              borderColor: "var(--land-border)",
              background: "var(--land-surface)",
              color: "var(--land-text)",
            }}
          >
            Sign In to Dashboard
          </Link>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-20">
          {badges.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-300"
              style={{
                borderColor: "var(--land-border)",
                background: "var(--land-surface)",
                color: "var(--land-text-muted)",
              }}
            >
              <Icon className="h-4 w-4 text-[#FF5A1F]" />
              {text}
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border p-5 hover:scale-105 transition-all group cursor-default"
              style={{
                borderColor: "var(--land-card-border)",
                background: "var(--land-card-bg)",
              }}
            >
              <p className={`text-3xl font-black ${stat.color} group-hover:scale-105 transition-transform`}>
                {stat.value}
              </p>
              <p className="text-xs mt-1 font-medium" style={{ color: "var(--land-text-faint)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none transition-all duration-300"
        style={{ background: `linear-gradient(to top, var(--land-bg), transparent)` }}
      />
    </section>
  );
}
