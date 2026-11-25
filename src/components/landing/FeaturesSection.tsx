"use client";

import {
  ArrowLeftRight, Landmark, BarChart3, Bell,
  CreditCard, ShieldCheck, Zap, Users,
} from "lucide-react";

const features = [
  { icon: ArrowLeftRight, title: "Instant Fund Transfer", desc: "Transfer money between accounts in real-time with PIN-secured atomic transactions. Zero delays, zero failures.", color: "text-blue-500", bg: "bg-blue-500/10", border: "rgba(59,130,246,0.2)" },
  { icon: Landmark, title: "Smart Loan Management", desc: "Apply for personal, home, business or education loans. Auto EMI calculation with transparent interest rates.", color: "text-purple-500", bg: "bg-purple-500/10", border: "rgba(168,85,247,0.2)" },
  { icon: BarChart3, title: "Real-time Analytics", desc: "Track your spending patterns, income vs expenses, and financial health with beautiful visual dashboards.", color: "text-[#FF5A1F]", bg: "bg-[#FF5A1F]/10", border: "rgba(255,90,31,0.2)" },
  { icon: Bell, title: "Smart Notifications", desc: "Get instant alerts for every transaction, loan update, and account activity. Never miss a beat.", color: "text-amber-500", bg: "bg-amber-500/10", border: "rgba(245,158,11,0.2)" },
  { icon: CreditCard, title: "Multi-Account Support", desc: "Open savings, current, and business accounts. Manage multiple accounts with individual limits and controls.", color: "text-[#00C853]", bg: "bg-emerald-500/10", border: "rgba(0,230,118,0.2)" },
  { icon: ShieldCheck, title: "Role-Based Security", desc: "Admin, Staff, and Customer roles with granular permissions. Your data stays exactly where it should.", color: "text-cyan-500", bg: "bg-cyan-500/10", border: "rgba(6,182,212,0.2)" },
  { icon: Zap, title: "Deposit & Withdrawal", desc: "Request deposits and withdrawals with built-in approval workflow. Staff reviews, admin approves.", color: "text-yellow-500", bg: "bg-yellow-500/10", border: "rgba(234,179,8,0.2)" },
  { icon: Users, title: "Customer Management", desc: "Full customer directory with account history, loan records, transaction logs, and status control.", color: "text-pink-500", bg: "bg-pink-500/10", border: "rgba(236,72,153,0.2)" },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-24 px-6 lg:px-8 transition-colors duration-300"
      style={{ background: "var(--land-bg-alt)" }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 px-4 py-2 text-sm font-medium text-[#FF5A1F] mb-5">
            Everything you need
          </div>
          <h2
            className="text-4xl sm:text-5xl font-black leading-tight mb-4 transition-colors duration-300"
            style={{ color: "var(--land-text)" }}
          >
            Powerful features,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A1F] to-orange-400">
              simple experience
            </span>
          </h2>
          <p className="text-lg max-w-xl mx-auto transition-colors duration-300" style={{ color: "var(--land-text-muted)" }}>
            Everything a modern bank needs — built for customers, staff, and administrators.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            const isHero = i === 0;
            return (
              <div
                key={f.title}
                className={`group rounded-3xl p-6 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-default ${f.bg} ${isHero ? "lg:col-span-2" : ""}`}
                style={{ border: `1px solid ${f.border}` }}
              >
                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl ${f.bg}`} style={{ border: `1px solid ${f.border}` }}>
                  <Icon className={`h-5 w-5 ${f.color}`} />
                </div>
                <h3 className="text-base font-bold mb-2 transition-colors duration-300" style={{ color: "var(--land-text)" }}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed transition-colors duration-300" style={{ color: "var(--land-text-muted)" }}>
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
