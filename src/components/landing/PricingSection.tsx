"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const ACCENT = "#FF5A1F";
const INK = "#101114"; // text on top of the orange

const plans = [
  {
    name: "Personal", price: "Free", desc: "Perfect for individuals managing everyday finances.",
    features: ["1 Savings Account", "Fund Transfers", "Transaction History", "Loan Applications", "Mobile & Web Access"],
    cta: "Get Started", href: "/register", highlight: false,
  },
  {
    name: "Premium", price: "৳299/mo", desc: "For power users who need more control and features.",
    features: ["3 Accounts (Any Type)", "Priority Transfers", "Advanced Analytics", "Instant Loan Approval", "Dedicated Support", "PDF Reports & Exports"],
    cta: "Start Premium", href: "/register", highlight: true,
  },
  {
    name: "Business", price: "৳999/mo", desc: "Full-featured banking for businesses and enterprises.",
    features: ["Unlimited Accounts", "Bulk Transfers", "Staff & Admin Roles", "Custom Limits & Controls", "API Access", "Priority 24/7 Support"],
    cta: "Contact Sales", href: "/register", highlight: false,
  },
];

function Sparkle({ className, color = "var(--land-text)" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path d="M12 0 C12.8 7 17 11.2 24 12 C17 12.8 12.8 17 12 24 C11.2 17 7 12.8 0 12 C7 11.2 11.2 7 12 0Z" fill={color} />
    </svg>
  );
}

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden px-6 py-24 transition-colors duration-300 lg:px-8"
      style={{ background: "var(--land-bg-alt)" }}
    >
      <Sparkle className="absolute left-[10%] top-20 h-4 w-4" />
      <Sparkle className="absolute right-[12%] top-32 h-3.5 w-3.5" color={ACCENT} />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2
            className="mx-auto max-w-xl text-3xl font-bold leading-[1.4] tracking-tight sm:text-4xl"
            style={{ color: "var(--land-text)" }}
          >
            Choose{" "}
            <span className="rounded-md px-2 [box-decoration-break:clone]" style={{ background: ACCENT, color: INK }}>
              your plan
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed" style={{ color: "var(--land-text-muted)" }}>
            Start free, upgrade when you need more. No hidden fees, no surprises.
          </p>
        </div>

        {/* Cards */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-stretch gap-5 md:grid-cols-3">
          {plans.map((plan, i) => {
            const [amount, period] = plan.price.split("/");
            const dark = plan.highlight;

            return (
              <article
                key={plan.name}
                className={`relative flex flex-col rounded-3xl border p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${dark ? "shadow-2xl shadow-black/20 md:-translate-y-4 md:py-9 md:hover:-translate-y-5" : ""
                  }`}
                style={
                  dark
                    ? { background: "#0b0b0b", borderColor: "rgba(255,255,255,0.1)", color: "#fff" }
                    : { background: "var(--land-card-bg)", borderColor: "var(--land-card-border)", color: "var(--land-text)" }
                }
              >
                {/* sticker */}
                {dark && (
                  <span
                    className="absolute -top-3 right-6 rotate-[4deg] rounded-md px-3 py-1 text-xs font-bold shadow-md"
                    style={{ background: ACCENT, color: INK }}
                  >
                    Most popular
                  </span>
                )}

                {/* handwritten-style note pointing at the free plan */}
                {i === 0 && (
                  <div
                    className="pointer-events-none absolute -left-2 -top-9 hidden items-end gap-1 italic md:flex"
                    style={{ color: "var(--land-text-muted)" }}
                    aria-hidden
                  >
                    <span className="text-xs">start here, it&apos;s free</span>
                    <svg width="34" height="26" viewBox="0 0 34 26" fill="none">
                      <path d="M2 4 C14 -1 26 6 24 20" stroke={ACCENT} strokeWidth="1.6" strokeLinecap="round" />
                      <path d="M18 16 L24 21 L28 14" stroke={ACCENT} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}

                <p className="text-sm font-semibold" style={{ color: dark ? "rgba(255,255,255,0.7)" : "var(--land-text-muted)" }}>
                  {plan.name}
                </p>

                <p className="mt-3 flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight">{amount}</span>
                  {period && (
                    <span className="text-sm" style={{ color: dark ? "rgba(255,255,255,0.55)" : "var(--land-text-faint)" }}>
                      /{period}
                    </span>
                  )}
                </p>

                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: dark ? "rgba(255,255,255,0.6)" : "var(--land-text-muted)" }}
                >
                  {plan.desc}
                </p>

                <ul className="my-7 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <span
                        className="grid h-5 w-5 shrink-0 place-items-center rounded-full"
                        style={
                          dark
                            ? { background: ACCENT, color: INK }
                            : { background: "color-mix(in srgb, #FF5A1F 15%, transparent)", color: ACCENT }
                        }
                      >
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span style={{ color: dark ? "rgba(255,255,255,0.85)" : "var(--land-text)" }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`group flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${dark ? "" : "border hover:border-[#FF5A1F]"
                    }`}
                  style={
                    dark
                      ? { background: ACCENT, color: INK, outlineColor: ACCENT }
                      : { borderColor: "var(--land-border)", background: "var(--land-surface)", color: "var(--land-text)", outlineColor: ACCENT }
                  }
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </article>
            );
          })}
        </div>

        <p className="mt-12 text-center text-sm" style={{ color: "var(--land-text-faint)" }}>
          Prices are in Bangladeshi taka. Cancel anytime from your dashboard.
        </p>
      </div>
    </section>
  );
}