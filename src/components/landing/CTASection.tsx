"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section
      id="about"
      className="py-24 px-6 lg:px-8 transition-colors duration-300"
      style={{ background: "var(--land-bg)" }}
    >
      <div className="mx-auto max-w-4xl text-center">
        <div
          className="relative rounded-[2rem] overflow-hidden p-14"
          style={{
            border: "1px solid rgba(255,90,31,0.2)",
            background: "linear-gradient(135deg, rgba(255,90,31,0.12), rgba(255,90,31,0.05), transparent)",
          }}
        >
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full blur-[80px]" style={{ background: "rgba(255,90,31,0.12)" }} />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full blur-[80px]" style={{ background: "var(--land-glow-green)" }} />

          <div className="relative z-10">
            <span className="inline-block rounded-full bg-[#FF5A1F]/20 border border-[#FF5A1F]/30 px-4 py-1.5 text-xs font-bold text-[#FF5A1F] mb-6">
              🚀 Start Today — It&apos;s Free
            </span>

            <h2 className="text-4xl sm:text-5xl font-black mb-5 leading-tight transition-colors duration-300" style={{ color: "var(--land-text)" }}>
              Ready to bank{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A1F] to-orange-400">
                smarter?
              </span>
            </h2>

            <p className="text-lg max-w-lg mx-auto mb-10 transition-colors duration-300" style={{ color: "var(--land-text-muted)" }}>
              Join 2.4 million people who already use NovaBank for their daily banking.
              Takes less than 2 minutes to get started.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="group flex items-center gap-2 rounded-2xl bg-[#FF5A1F] px-8 py-4 text-base font-bold text-white shadow-2xl shadow-[#FF5A1F]/30 hover:bg-[#e04d18] hover:scale-105 active:scale-95 transition-all">
                Open Free Account
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="rounded-2xl px-8 py-4 text-base font-bold transition-all hover:scale-105"
                style={{ border: "1px solid var(--land-border)", background: "var(--land-surface)", color: "var(--land-text)" }}
              >
                Sign In
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm transition-colors duration-300" style={{ color: "var(--land-text-faint)" }}>
              <span>✓ No credit card required</span>
              <span>✓ Free forever plan</span>
              <span>✓ Setup in 2 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
