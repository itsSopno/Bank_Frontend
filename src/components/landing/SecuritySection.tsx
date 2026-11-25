"use client";

import { Lock, Server, Eye, Key, Award, RefreshCw, Check, ShieldCheck } from "lucide-react";

const ACCENT = "#FF5A1F";
const INK = "#101114"; // text on top of the orange

const securityFeatures = [
  { icon: Lock, title: "4-Digit Transaction PIN", desc: "Every fund transfer requires your personal PIN. Bcrypt-hashed and never stored in plain text." },
  { icon: Key, title: "JWT Authentication", desc: "Secure JSON Web Tokens with 7-day expiry. Automatic token invalidation on logout." },
  { icon: Eye, title: "Role-Based Access Control", desc: "Customers can't access admin panels. Staff can't see other customers' private data." },
  { icon: Server, title: "Supabase PostgreSQL", desc: "Enterprise-grade cloud database with row-level security, automatic backups, and 99.9% uptime." },
  { icon: RefreshCw, title: "Atomic Transactions", desc: "Fund transfers use database transactions: either fully complete or fully rolled back. No partial states." },
  { icon: Award, title: "Approval Workflows", desc: "Deposits and withdrawals go through staff/admin approval. No money moves without authorization." },
];

const badges = ["256-bit Encryption", "2FA Ready", "RBAC System", "Audit Logs"];

function Sparkle({ className, color = "var(--land-text)" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path d="M12 0 C12.8 7 17 11.2 24 12 C17 12.8 12.8 17 12 24 C11.2 17 7 12.8 0 12 C7 11.2 11.2 7 12 0Z" fill={color} />
    </svg>
  );
}

export default function SecuritySection() {
  return (
    <section
      id="security"
      className="relative overflow-hidden px-6 py-24 transition-colors duration-300 lg:px-8"
      style={{ background: "var(--land-bg)" }}
    >
      <Sparkle className="absolute left-[8%] top-16 h-4 w-4" />
      <Sparkle className="absolute right-[10%] bottom-14 h-3.5 w-3.5" color={ACCENT} />

      {/* Dark panel: stays dark in both themes, like the stats bar and the dark feature card */}
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-[#1f1f1f] to-[#0b0b0b] px-6 py-14 text-white shadow-2xl sm:px-10 lg:px-14 lg:py-20">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-[360px] w-[360px] rounded-full opacity-30 blur-[110px]"
          style={{ background: ACCENT }}
          aria-hidden
        />

        <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-5 lg:gap-14">
          {/* Left: text */}
          <div className="lg:col-span-2">
            <span
              className="mb-6 grid h-12 w-12 place-items-center rounded-2xl"
              style={{ background: ACCENT, color: INK }}
            >
              <ShieldCheck className="h-6 w-6" />
            </span>

            <h2 className="text-3xl font-bold leading-[1.4] tracking-tight sm:text-4xl">
              Your money is{" "}
              <span className="rounded-md px-2 [box-decoration-break:clone]" style={{ background: ACCENT, color: INK }}>
                safe with us
              </span>
            </h2>

            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/65">
              We use multiple layers of security to protect every transaction and every account. Built on
              enterprise infrastructure with zero compromises.
            </p>

            <ul className="mt-8 grid max-w-md grid-cols-2 gap-3">
              {badges.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-white/85">
                  <span
                    className="grid h-5 w-5 shrink-0 place-items-center rounded-full"
                    style={{ background: ACCENT, color: INK }}
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: feature grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-3">
            {securityFeatures.map((f) => {
              const Icon = f.icon;
              return (
                <article
                  key={f.title}
                  className="group rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#FF5A1F]/50 hover:bg-white/[0.07]"
                >
                  <span
                    className="mb-4 grid h-9 w-9 place-items-center rounded-xl transition-colors"
                    style={{ background: "rgba(255,90,31,0.15)", color: ACCENT }}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="text-sm font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/60">{f.desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}