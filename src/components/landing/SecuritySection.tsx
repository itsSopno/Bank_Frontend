"use client";

import { Lock, Server, Eye, Key, Award, RefreshCw } from "lucide-react";

const securityFeatures = [
  {
    icon: Lock,
    title: "4-Digit Transaction PIN",
    desc: "Every fund transfer requires your personal PIN. Bcrypt-hashed and never stored in plain text.",
  },
  {
    icon: Key,
    title: "JWT Authentication",
    desc: "Secure JSON Web Tokens with 7-day expiry. Automatic token invalidation on logout.",
  },
  {
    icon: Eye,
    title: "Role-Based Access Control",
    desc: "Customers can't access admin panels. Staff can't see other customers' private data.",
  },
  {
    icon: Server,
    title: "Supabase PostgreSQL",
    desc: "Enterprise-grade cloud database with row-level security, automatic backups, and 99.9% uptime.",
  },
  {
    icon: RefreshCw,
    title: "Atomic Transactions",
    desc: "Fund transfers use database transactions — either fully complete or fully rollback. No partial states.",
  },
  {
    icon: Award,
    title: "Approval Workflows",
    desc: "Deposits and withdrawals go through staff/admin approval. No money moves without authorization.",
  },
];

export default function SecuritySection() {
  return (
    <section id="security" className="bg-[#0D0D0F] py-24 px-6 lg:px-8 relative overflow-hidden">
      {/* BG accent */}
      <div className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-[#00E676]/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00E676]/30 bg-[#00E676]/10 px-4 py-2 text-sm font-medium text-[#00E676] mb-5">
              🔒 Bank-Grade Security
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-5">
              Your money is{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E676] to-emerald-400">
                safe with us
              </span>
            </h2>
            <p className="text-white/40 text-lg leading-relaxed mb-8">
              We use multiple layers of security to protect every transaction and every account. 
              Built on enterprise infrastructure with zero compromises.
            </p>

            {/* Security badge row */}
            <div className="flex flex-wrap gap-3">
              {["256-bit Encryption", "2FA Ready", "RBAC System", "Audit Logs"].map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-[#00E676]/20 bg-[#00E676]/8 px-4 py-1.5 text-xs font-semibold text-[#00E676]"
                >
                  ✓ {b}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {securityFeatures.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-3xl border border-white/5 bg-white/3 p-5 hover:border-[#00E676]/20 hover:bg-[#00E676]/5 transition-all group"
                >
                  <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#00E676]/10 border border-[#00E676]/20">
                    <Icon className="h-4 w-4 text-[#00E676]" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{f.title}</h3>
                  <p className="text-xs text-white/35 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

