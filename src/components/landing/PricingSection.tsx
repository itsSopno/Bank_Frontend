"use client";

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

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="py-24 px-6 lg:px-8 relative overflow-hidden transition-colors duration-300"
      style={{ background: "var(--land-bg-alt)" }}
    >
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full blur-[100px] transition-all duration-500"
        style={{ background: "var(--land-glow-orange)" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 px-4 py-2 text-sm font-medium text-[#FF5A1F] mb-5">
            Simple Pricing
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4 transition-colors duration-300" style={{ color: "var(--land-text)" }}>
            Choose your plan
          </h2>
          <p className="text-lg max-w-lg mx-auto transition-colors duration-300" style={{ color: "var(--land-text-muted)" }}>
            Start free, upgrade when you need more. No hidden fees, no surprises.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-7 flex flex-col transition-all hover:scale-[1.02] ${
                plan.highlight
                  ? "border-[#FF5A1F]/50 bg-gradient-to-b from-[#FF5A1F]/15 to-[#FF5A1F]/5 shadow-2xl shadow-[#FF5A1F]/15"
                  : ""
              }`}
              style={
                plan.highlight
                  ? { border: "1px solid rgba(255,90,31,0.5)" }
                  : { border: "1px solid var(--land-card-border)", background: "var(--land-card-bg)" }
              }
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-[#FF5A1F] px-4 py-1 text-xs font-bold text-white shadow-lg shadow-[#FF5A1F]/30">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-5">
                <p className="text-sm font-semibold mb-1 transition-colors duration-300" style={{ color: "var(--land-text-muted)" }}>
                  {plan.name}
                </p>
                <p className={`text-4xl font-black mb-2 ${plan.highlight ? "text-[#FF5A1F]" : ""}`} style={!plan.highlight ? { color: "var(--land-text)" } : {}}>
                  {plan.price}
                </p>
                <p className="text-sm transition-colors duration-300" style={{ color: "var(--land-text-faint)" }}>
                  {plan.desc}
                </p>
              </div>

              <ul className="space-y-2.5 mb-7 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm transition-colors duration-300" style={{ color: "var(--land-text-muted)" }}>
                    <span className={`h-1.5 w-1.5 rounded-full ${plan.highlight ? "bg-[#FF5A1F]" : "bg-[#00E676]"}`} />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={plan.href}
                className={`block rounded-2xl py-3 text-center text-sm font-bold transition-all ${
                  plan.highlight
                    ? "bg-[#FF5A1F] text-white shadow-lg shadow-[#FF5A1F]/30 hover:bg-[#e04d18]"
                    : "hover:opacity-80"
                }`}
                style={
                  !plan.highlight
                    ? { border: "1px solid var(--land-border)", background: "var(--land-surface)", color: "var(--land-text)" }
                    : {}
                }
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
