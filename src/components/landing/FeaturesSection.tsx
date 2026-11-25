"use client";

import type { ComponentType } from "react";
import {
  ArrowLeftRight, Landmark, BarChart3, Bell,
  CreditCard, ShieldCheck, Zap, Users, Fingerprint, Check,
} from "lucide-react";

const ACCENT = "#FF5A1F";
const INK = "#101114"; // text on top of the orange

type Feature = {
  icon: ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  desc: string;
  span: string; // desktop width, written out in full so Tailwind can see it
  variant?: "dark" | "light";
  art?: "apps" | "bars" | "alerts" | "fingerprint";
};

// Order here is the order on screen: 8+4 / 4+8 / 8+4 / 6+6
const features: Feature[] = [
  { icon: ArrowLeftRight, title: "Instant Fund Transfer", desc: "Transfer money between accounts in real-time with PIN-secured atomic transactions. Zero delays, zero failures.", span: "lg:col-span-8", variant: "dark", art: "apps" },
  { icon: Landmark, title: "Smart Loan Management", desc: "Apply for personal, home, business or education loans. Auto EMI calculation with transparent interest rates.", span: "lg:col-span-4" },
  { icon: BarChart3, title: "Real-time Analytics", desc: "Track your spending patterns, income vs expenses, and financial health with visual dashboards.", span: "lg:col-span-4", art: "bars" },
  { icon: Bell, title: "Smart Notifications", desc: "Get instant alerts for every transaction, loan update, and account activity. Never miss a beat.", span: "lg:col-span-8", art: "alerts" },
  { icon: ShieldCheck, title: "Role-Based Security", desc: "Admin, Staff, and Customer roles with granular permissions. Your data stays exactly where it should.", span: "lg:col-span-8", art: "fingerprint" },
  { icon: CreditCard, title: "Multi-Account Support", desc: "Open savings, current, and business accounts. Manage each with its own limits and controls.", span: "lg:col-span-4" },
  { icon: Zap, title: "Deposit & Withdrawal", desc: "Request deposits and withdrawals with a built-in approval workflow. Staff reviews, admin approves.", span: "lg:col-span-6" },
  { icon: Users, title: "Customer Management", desc: "Full customer directory with account history, loan records, transaction logs, and status control.", span: "lg:col-span-6" },
];

function Sparkle({ className, color = "var(--land-text)" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path d="M12 0 C12.8 7 17 11.2 24 12 C17 12.8 12.8 17 12 24 C11.2 17 7 12.8 0 12 C7 11.2 11.2 7 12 0Z" fill={color} />
    </svg>
  );
}

/* ---------- little illustrations (pure CSS, no images) ---------- */

function AppsArt() {
  const tiles = [
    null, { i: Check, c: ACCENT }, null, { i: Landmark, c: "#7C8CFF" },
    { i: CreditCard, c: ACCENT, big: true }, { i: Zap, c: "#5CE1E6" }, null, null,
    null, null, null, null,
  ] as const;
  return (
    <div className="grid w-[220px] shrink-0 grid-cols-4 gap-2.5 [mask-image:linear-gradient(to_bottom,black_60%,transparent)]" aria-hidden>
      {tiles.map((t, i) => (
        <div
          key={i}
          className="grid aspect-square place-items-center rounded-xl"
          style={{ background: t ? "#2a2a2a" : "#1b1b1b" }}
        >
          {t && (
            <span className="grid h-7 w-7 place-items-center rounded-full" style={{ background: t.c, color: INK }}>
              <t.i className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function BarsArt() {
  return (
    <div className="mt-6 flex h-20 items-end gap-2" aria-hidden>
      {[35, 55, 40, 75, 60, 95, 70].map((h, i) => (
        <span
          key={i}
          className="w-full rounded-t-md"
          style={{ height: `${h}%`, background: i === 5 ? ACCENT : "var(--land-border)" }}
        />
      ))}
    </div>
  );
}

function AlertsArt() {
  const rows = [
    { t: "৳ 12,500 sent to Karim", s: "Just now" },
    { t: "Loan EMI due in 3 days", s: "10 min ago" },
  ];
  return (
    <div className="flex w-full max-w-[260px] shrink-0 flex-col gap-2.5" aria-hidden>
      {rows.map((r, i) => (
        <div
          key={r.t}
          className="flex items-center gap-3 rounded-2xl border px-4 py-3"
          style={{
            background: "var(--land-surface)",
            borderColor: "var(--land-border)",
            transform: i === 1 ? "translateX(18px)" : undefined,
          }}
        >
          <span className="h-2 w-2 rounded-full" style={{ background: ACCENT }} />
          <div className="leading-tight">
            <p className="text-xs font-semibold" style={{ color: "var(--land-text)" }}>{r.t}</p>
            <p className="text-[10px]" style={{ color: "var(--land-text-faint)" }}>{r.s}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function FingerprintArt() {
  return (
    <div
      className="grid shrink-0 place-items-center rounded-3xl border p-6 text-center shadow-lg"
      style={{ background: "var(--land-surface)", borderColor: "var(--land-border)" }}
      aria-hidden
    >
      <span className="grid h-14 w-14 place-items-center rounded-2xl" style={{ background: ACCENT, color: INK }}>
        <Fingerprint className="h-7 w-7" />
      </span>
      <p className="mt-3 text-[11px] font-semibold leading-tight" style={{ color: "var(--land-text)" }}>
        Fingerprint
        <br />
        authentication
      </p>
    </div>
  );
}

const arts = { apps: AppsArt, bars: BarsArt, alerts: AlertsArt, fingerprint: FingerprintArt };

/* ---------- section ---------- */

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative overflow-hidden px-6 py-24 transition-colors duration-300 lg:px-8"
      style={{ background: "var(--land-bg-alt)" }}
    >
      <Sparkle className="absolute left-[12%] top-32 h-4 w-4" />
      <Sparkle className="absolute right-[14%] top-20 h-3.5 w-3.5" color={ACCENT} />
      <Sparkle className="absolute right-6 top-1/2 hidden h-4 w-4 lg:block" />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <h2
            className="mx-auto max-w-2xl text-3xl font-bold leading-[1.4] tracking-tight sm:text-4xl"
            style={{ color: "var(--land-text)" }}
          >
            <span className="rounded-md px-2 [box-decoration-break:clone]" style={{ background: ACCENT, color: INK }}>
              Powerful Features
            </span>{" "}
            That Keep Banking Simple
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed" style={{ color: "var(--land-text-muted)" }}>
            Everything a modern bank needs, built for customers, staff, and administrators.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {features.map((f) => {
            const Icon = f.icon;
            const dark = f.variant === "dark";
            const Art = f.art ? arts[f.art] : null;
            const side = f.art === "apps" || f.art === "alerts" || f.art === "fingerprint";
            const wide = f.span !== "lg:col-span-4";

            return (
              <article
                key={f.title}
                className={`relative overflow-hidden rounded-3xl border p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${f.span} ${wide ? "sm:col-span-2" : ""}`}
                style={
                  dark
                    ? { background: "#0b0b0b", borderColor: "rgba(255,255,255,0.1)", color: "#fff" }
                    : { background: "var(--land-card-bg)", borderColor: "var(--land-card-border)", color: "var(--land-text)" }
                }
              >
                <div className={`flex h-full gap-8 ${side ? "flex-col md:flex-row md:items-center md:justify-between" : "flex-col"}`}>
                  <div className={side ? "md:max-w-[17rem]" : ""}>
                    <span
                      className="mb-5 grid h-10 w-10 place-items-center rounded-xl"
                      style={
                        dark
                          ? { background: ACCENT, color: INK }
                          : { background: "color-mix(in srgb, #FF5A1F 14%, transparent)", color: ACCENT }
                      }
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-semibold leading-snug">{f.title}</h3>
                    <p
                      className="mt-2 text-sm leading-relaxed"
                      style={{ color: dark ? "rgba(255,255,255,0.65)" : "var(--land-text-muted)" }}
                    >
                      {f.desc}
                    </p>
                  </div>

                  {Art && <Art />}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}