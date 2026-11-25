"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section id="about" className="bg-[#0D0D0F] py-24 px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        {/* Card */}
        <div className="relative rounded-[2rem] overflow-hidden border border-[#FF5A1F]/20 bg-gradient-to-br from-[#FF5A1F]/15 via-[#FF5A1F]/8 to-transparent p-14">
          {/* BG decorations */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#FF5A1F]/15 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#00E676]/10 blur-[80px]" />

          <div className="relative z-10">
            <span className="inline-block rounded-full bg-[#FF5A1F]/20 border border-[#FF5A1F]/30 px-4 py-1.5 text-xs font-bold text-[#FF5A1F] mb-6">
              🚀 Start Today — It&apos;s Free
            </span>

            <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">
              Ready to bank{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A1F] to-orange-300">
                smarter?
              </span>
            </h2>

            <p className="text-white/40 text-lg max-w-lg mx-auto mb-10">
              Join 2.4 million people who already use NovaBank for their daily banking. 
              Takes less than 2 minutes to get started.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="group flex items-center gap-2 rounded-2xl bg-[#FF5A1F] px-8 py-4 text-base font-bold text-white shadow-2xl shadow-[#FF5A1F]/30 hover:bg-[#e04d18] hover:scale-105 active:scale-95 transition-all"
              >
                Open Free Account
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="rounded-2xl border border-white/15 bg-white/5 px-8 py-4 text-base font-bold text-white hover:bg-white/10 transition-all"
              >
                Sign In
              </Link>
            </div>

            {/* Trust signals */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/30">
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

